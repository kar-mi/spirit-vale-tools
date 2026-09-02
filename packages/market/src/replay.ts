import { FishNetTransportReplay } from "@kar-mi/spirit-vale-tools-capture";
import { LogRecordLineDecoder, readTextLines } from "@kar-mi/spirit-vale-tools-logging";
import { FishNetMarketTracker } from "./market.ts";

export interface MarketReplayResult {
  datagrams: number;
  marketEvents: number;
  invalidLines: number;
  decodeWarnings: number;
}

export function decodeMarketCaptureJsonLines(text: string, tracker: FishNetMarketTracker): MarketReplayResult {
  const replay = new MarketCaptureReplay(tracker);
  for (const line of text.split(/\r?\n/)) replay.consumeLine(line);
  return replay.result();
}

export async function replayMarketCapture(path: string, tracker: FishNetMarketTracker): Promise<MarketReplayResult> {
  const replay = new MarketCaptureReplay(tracker);
  for await (const line of readTextLines(Bun.file(path).stream())) replay.consumeLine(line);
  return replay.result();
}

class MarketCaptureReplay {
  private readonly records = new LogRecordLineDecoder();
  private readonly transport = new FishNetTransportReplay();
  private marketEvents = 0;
  private invalidLines = 0;

  constructor(private readonly tracker: FishNetMarketTracker) {}

  consumeLine(line: string): void {
    const decoded = this.records.decode(line);
    if (decoded.kind === "empty" || decoded.kind === "header") return;
    if (decoded.kind === "invalid") {
      this.invalidLines += 1;
      return;
    }
    const result = this.transport.consumeRecord(decoded.record, (packet) => {
      this.marketEvents += this.tracker.consume(packet).length;
    });
    if (result === "invalid") this.invalidLines += 1;
  }

  result(): MarketReplayResult {
    return { ...this.transport.stats(), marketEvents: this.marketEvents, invalidLines: this.invalidLines };
  }
}
