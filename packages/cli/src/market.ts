import { FishNetMarketTracker, parseFishNetMarketStatExpression } from "@spiritvale/market";
import { PacketCapture } from "@spiritvale/core";
import type { FishNetMarketListingView, FishNetMarketQuery } from "@spiritvale/market";
import { replayMarketCapture } from "./market-replay.ts";

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
  try {
    return BigInt(text);
  } catch {
    throw new Error(`${name} must be an integer`);
  }
}

const input = option("--input");
const live = Bun.argv.includes("--live");
if (Boolean(input) === live) throw new Error("choose exactly one market source: --input <capture.log> or --live");
const sortText = option("--sort") ?? "price-asc";
if (sortText !== "price-asc" && sortText !== "price-desc") throw new Error("--sort must be price-asc or price-desc");
const statMode = option("--stat-mode") ?? "all";
if (statMode !== "all" && statMode !== "any") throw new Error("--stat-mode must be all or any");
const query: FishNetMarketQuery = {
  text: option("--query"),
  itemType: integerOption("--item-type"),
  minPrice: bigintOption("--min-price"),
  maxPrice: bigintOption("--max-price"),
  stats: options("--stat").map(parseFishNetMarketStatExpression),
  statMode,
  sort: sortText,
  limit: integerOption("--limit") ?? 100,
};
const json = Bun.argv.includes("--json");
const tracker = new FishNetMarketTracker();

if (input) {
  const replay = await replayMarketCapture(input, tracker);
  emit(tracker, query, json, { ...replay });
} else {
  await runLive(tracker, query, json);
}

async function runLive(market: FishNetMarketTracker, marketQuery: FishNetMarketQuery, asJson: boolean): Promise<void> {
  const capture = new PacketCapture();
  capture.on("started", () => console.error("market capture started; open the in-game market or press Ctrl+C to stop"));
  capture.on("warning", (message) => console.error(`[warning] ${message}`));
  capture.on("error", (error) => console.error(`[error] ${error.message}`));
  capture.on("fishNetPacket", (packet) => {
    try {
      const events = market.consume(packet);
      if (events.length > 0) emit(market, marketQuery, asJson, { event: events.at(-1)?.kind });
    } catch (error) {
      console.error(`[warning] skipped market payload: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  let stopping = false;
  const stop = async (): Promise<void> => {
    if (stopping) return;
    stopping = true;
    await capture.stop();
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

function emit(
  market: FishNetMarketTracker,
  marketQuery: FishNetMarketQuery,
  asJson: boolean,
  detail: Record<string, unknown>,
): void {
  const snapshot = market.snapshot();
  const results = market.query(marketQuery);
  if (asJson) {
    console.log(JSON.stringify({
      ...detail,
      account: snapshot.account,
      lastBalanceDelta: snapshot.lastBalanceDelta,
      lastCollectedAmount: snapshot.lastCollectedAmount,
      catalogCount: snapshot.catalog.length,
      stallCount: snapshot.stalls.length,
      resultCount: results.length,
      results,
    }, (_key, value) => typeof value === "bigint" ? value.toString() : value));
    return;
  }
  const balance = snapshot.account ? ` vending balance=${snapshot.account.balance}` : "";
  const delta = snapshot.lastBalanceDelta === undefined ? "" : ` last balance change=${signed(snapshot.lastBalanceDelta)}`;
  const collected = snapshot.lastCollectedAmount === undefined ? "" : ` last collected=${snapshot.lastCollectedAmount}`;
  console.log(`market: ${snapshot.catalog.length} catalog entries, ${snapshot.stalls.length} stalls, ${results.length} matches${balance}${delta}${collected}`);
  if (results.length === 0) return;
  console.log("item\tprice\tremaining\tstats\tseller\tshop\tmap");
  for (const result of results) console.log(formatRow(result));
}

function formatRow(result: FishNetMarketListingView): string {
  return [
    result.itemId ?? "",
    result.price.toString(),
    String(result.count - result.countTraded),
    result.stats?.map((stat) => {
      const value = stat.value === undefined ? `roll:${stat.roll}` : `${stat.value}${stat.percent ? "%" : ""}`;
      return `${stat.name ?? `#${stat.type}`}=${value}`;
    }).join(",") ?? "",
    result.sellerName ?? "",
    result.shopName ?? "",
    result.mapId ?? "",
  ].map(clean).join("\t");
}

function clean(value: string): string {
  return value.replace(/[\t\r\n]/g, " ");
}

function signed(value: bigint): string {
  return value > 0n ? `+${value}` : value.toString();
}
