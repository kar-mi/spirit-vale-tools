import { FishNetTransportReplay } from "@kar-mi/spirit-vale-tools-capture";
import { LogRecordLineDecoder, readTextLines } from "@kar-mi/spirit-vale-tools-logging";
import { FishNetActorDirectory } from "../tracking/actor-directory.ts";
import type { FishNetActorIdentityEvent } from "../tracking/actor-directory.ts";
import { FishNetCombatTracker } from "../tracking/combat-tracker.ts";
import type { FishNetCombatEvent } from "../events/combat-events.ts";

export interface CombatCaptureReplayOptions {
  tracker: FishNetCombatTracker;
  directory: FishNetActorDirectory;
  /** Receives every decoded event in wire order, so a caller can drive reducers as it replays. */
  onEvent?: (event: FishNetActorIdentityEvent | FishNetCombatEvent, observedAtMs: number) => void;
}

export interface CombatCaptureReplayResult {
  datagrams: number;
  combatEvents: number;
  identityEvents: number;
  invalidLines: number;
  decodeWarnings: number;
}

export function decodeCombatCaptureJsonLines(text: string, options: CombatCaptureReplayOptions): CombatCaptureReplayResult {
  const replay = new CombatCaptureReplay(options);
  for (const line of text.split(/\r?\n/)) replay.consumeLine(line);
  return replay.result();
}

export async function replayCombatCapture(path: string, options: CombatCaptureReplayOptions): Promise<CombatCaptureReplayResult> {
  return replayCombatCaptures([path], options);
}

export async function replayCombatCaptures(paths: readonly string[], options: CombatCaptureReplayOptions): Promise<CombatCaptureReplayResult> {
  const replay = new CombatCaptureReplay(options);
  for (const path of paths) {
    for await (const line of readTextLines(Bun.file(path).stream())) replay.consumeLine(line);
  }
  return replay.result();
}

class CombatCaptureReplay {
  private readonly records = new LogRecordLineDecoder();
  private readonly transport = new FishNetTransportReplay();
  private combatEvents = 0;
  private identityEvents = 0;
  private invalidLines = 0;

  constructor(private readonly options: CombatCaptureReplayOptions) {}

  consumeLine(line: string): void {
    const decoded = this.records.decode(line);
    if (decoded.kind === "empty" || decoded.kind === "header") return;
    if (decoded.kind === "invalid") {
      this.invalidLines += 1;
      return;
    }
    const result = this.transport.consumeRecord(decoded.record, (packet, observedAtMs) => {
      for (const event of this.options.directory.consume(packet)) {
        this.identityEvents += 1;
        if (observedAtMs !== undefined) this.options.onEvent?.(event, observedAtMs);
      }
      for (const event of this.options.tracker.consume(packet)) {
        this.combatEvents += 1;
        if (observedAtMs !== undefined) this.options.onEvent?.(event, observedAtMs);
      }
    });
    if (result === "invalid") this.invalidLines += 1;
  }

  result(): CombatCaptureReplayResult {
    return {
      ...this.transport.stats(),
      combatEvents: this.combatEvents,
      identityEvents: this.identityEvents,
      invalidLines: this.invalidLines,
    };
  }
}
