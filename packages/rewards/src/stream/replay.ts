import { LogRecordLineDecoder, readTextLines } from "@kar-mi/spirit-vale-tools-logging";
import { MobRewardSession } from "../aggregation/session.ts";
import type { MobRewardSessionSnapshot } from "../aggregation/session.ts";
import { parseRewardLogRecord } from "./record.ts";

export async function loadRewardReplay(path: string): Promise<{ snapshot: MobRewardSessionSnapshot; invalidLines: number }> {
  const session = new MobRewardSession();
  const records = new LogRecordLineDecoder();
  let invalidLines = 0;
  for await (const line of readTextLines(Bun.file(path).stream())) {
    const decoded = records.decode(line);
    if (decoded.kind === "empty" || decoded.kind === "header") continue;
    if (decoded.kind === "invalid") { invalidLines += 1; continue; }
    const record = decoded.record;
    if (record.type !== "rewards.kill" && record.type !== "rewards.unmatched") continue;
    const event = parseRewardLogRecord(record.type, record.data);
    if (!event) invalidLines += 1;
    else session.consume(event, { recordedAt: record.recordedAt });
  }
  return { snapshot: session.snapshot(), invalidLines };
}
