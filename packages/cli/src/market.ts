import { PacketCapture } from "@kar-mi/spirit-vale-tools-capture/capture";
import { createLogSession } from "@kar-mi/spirit-vale-tools-logging";
import type { JsonLinesLogger, JsonObject } from "@kar-mi/spirit-vale-tools-logging";
import {
  FishNetMarketTracker,
  marketEventLogData,
  marketLogMetadataData,
  parseFishNetMarketStatExpression,
  replayMarketCapture,
} from "@kar-mi/spirit-vale-tools-market";
import type { FishNetMarketQuery } from "@kar-mi/spirit-vale-tools-market";

function option(name: string): string | undefined {
  const index = Bun.argv.indexOf(name);
  return index >= 0 ? Bun.argv[index + 1] : undefined;
}

function options(name: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < Bun.argv.length; index += 1) {
    if (Bun.argv[index] !== name) continue;
    const value = Bun.argv[index + 1];
    if (value === undefined) throw new Error(`${name} requires a value`);
    values.push(value);
  }
  return values;
}

function integerOption(name: string): number | undefined {
  const text = option(name);
  if (text === undefined) return undefined;
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
}

function bigintOption(name: string): bigint | undefined {
  const text = option(name);
  if (text === undefined) return undefined;
  try { return BigInt(text); } catch { throw new Error(`${name} must be an integer`); }
}

const input = option("--input");
const live = Bun.argv.includes("--live");
if (Bun.argv.includes("--json")) throw new Error("--json was removed because market logs are always JSON Lines");
if (Boolean(input) === live) throw new Error("choose exactly one market source: --input <capture.jsonl> or --live");
const sortText = option("--sort") ?? "price-asc";
if (sortText !== "price-asc" && sortText !== "price-desc") throw new Error("--sort must be price-asc or price-desc");
const statMode = option("--stat-mode") ?? "all";
if (statMode !== "all" && statMode !== "any") throw new Error("--stat-mode must be all or any");
const query: FishNetMarketQuery = {
  text: option("--query"), itemType: integerOption("--item-type"),
  minPrice: bigintOption("--min-price"), maxPrice: bigintOption("--max-price"),
  stats: options("--stat").map(parseFishNetMarketStatExpression), statMode,
  sort: sortText, limit: integerOption("--limit") ?? 100,
};
const tracker = new FishNetMarketTracker();
const outputPath = option("--output");
const session = await createLogSession({
  producer: "market-cli", streams: ["market"],
  ...(outputPath ? { outputPaths: { market: outputPath } } : {}),
  onWriteError: ({ stream, error }) => console.error(`[logging error] ${stream}: ${error.message}`),
});
const logger = session.logger("market");
let metadataLogged = false;
console.error(`logging market session ${session.id}`);

if (input) {
  const replay = await replayMarketCapture(input, tracker);
  emitMetadataOnce(logger, tracker.snapshot());
  emitSummary(tracker, query, logger, { ...replay });
  await session.close();
} else {
  await runLive(tracker, query, logger);
}

async function runLive(market: FishNetMarketTracker, marketQuery: FishNetMarketQuery, output: JsonLinesLogger): Promise<void> {
  const capture = new PacketCapture();
  capture.on("started", () => { output.log("market.lifecycle", { state: "started" }); console.error("market capture started; open the in-game market or press Ctrl+C to stop"); });
  capture.on("warning", (message) => { output.log("market.warning", { message }); console.error(`[warning] ${message}`); });
  capture.on("error", (error) => { output.log("market.error", { message: error.message }); console.error(`[error] ${error.message}`); });
  capture.on("fishNetPacket", (packet) => {
    try {
      const events = market.consume(packet);
      for (const event of events) {
        emitMetadataOnce(output, event);
        output.log("market.event", marketEventLogData(event));
      }
      if (events.length > 0) report(market, marketQuery);
    } catch (error) {
      const message = `skipped market payload: ${error instanceof Error ? error.message : String(error)}`;
      output.log("market.warning", { message }); console.error(`[warning] ${message}`);
    }
  });
  let stopping = false;
  const stop = async (): Promise<void> => {
    if (stopping) return;
    stopping = true;
    await capture.stop();
    output.log("market.lifecycle", { state: "stopped" });
    await session.close();
  };
  process.on("SIGINT", () => void stop());
  process.on("SIGTERM", () => void stop());
  await capture.start({ protocols: ["udp"], targetProcessName: "SpiritVale.exe", decodeFishNet: true });
  const duration = option("--duration");
  if (duration !== undefined) {
    const seconds = Number(duration);
    if (!Number.isFinite(seconds) || seconds <= 0) throw new Error("--duration must be a positive number of seconds");
    await Bun.sleep(seconds * 1_000);
    await stop();
  }
}

function emitSummary(market: FishNetMarketTracker, marketQuery: FishNetMarketQuery, output: JsonLinesLogger, detail: Record<string, unknown>): void {
  const snapshot = market.snapshot();
  const results = market.query(marketQuery);
  output.log("market.summary", jsonObject({
    ...detail, search: snapshot.search, stallStatus: snapshot.stallStatus,
    overview: snapshot.overview, lastBalanceDelta: snapshot.lastBalanceDelta,
    lastCollectedAmount: snapshot.lastCollectedAmount, listingCount: snapshot.listings.length,
    stallCount: snapshot.stalls.length, resultCount: results.length, results,
  }));
  console.error(`market: ${snapshot.listings.length} listings, ${snapshot.stalls.length} stalls, ${results.length} matches`);
}

function report(market: FishNetMarketTracker, marketQuery: FishNetMarketQuery): void {
  const snapshot = market.snapshot();
  console.error(`market: ${snapshot.listings.length} listings, ${snapshot.stalls.length} stalls, ${market.query(marketQuery).length} matches`);
}

function jsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value, (key, entry) => {
    if (key === "sellerAccountId" || key === "accountId" || key === "visualSnapshotJson" || key === "archetype"
      || key === "compatibilityFingerprint" || key === "payloadSchemaVersion") return undefined;
    return typeof entry === "bigint" ? entry.toString() : entry;
  })) as JsonObject;
}

function emitMetadataOnce(output: JsonLinesLogger, value: unknown): void {
  if (metadataLogged) return;
  const metadata = marketLogMetadataData(value);
  if (!metadata) return;
  output.log("market.metadata", metadata);
  metadataLogged = true;
}
