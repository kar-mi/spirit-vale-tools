import { describe, expect, test } from "bun:test";

import {
  decodeCombatCaptureJsonLines,
  FishNetActorDirectory,
  FishNetCombatTracker,
} from "@kar-mi/spirit-vale-tools-combat";

function record(type: string, data: Record<string, unknown>): string {
  return JSON.stringify({
    schemaVersion: 1,
    sessionId: "20260805T044339941Z-95a8eb3b",
    sequence: 1,
    recordedAt: "2026-08-05T04:46:19.608Z",
    source: "synthetic-test",
    type,
    data,
  });
}

function replay(text: string) {
  return decodeCombatCaptureJsonLines(text, {
    directory: new FishNetActorDirectory(),
    tracker: new FishNetCombatTracker(),
  });
}

describe("combat capture replay", () => {
  test("accepts structured UDP records without exposing endpoint metadata", () => {
    const result = replay(`${record("transport.packet", {
      protocol: "udp",
      sourceIP: "192.0.2.10",
      destinationIP: "198.51.100.20",
      sourcePort: 40000,
      destinationPort: 7007,
      payloadHex: "032000",
    })}\n`);
    expect(result).toEqual({
      datagrams: 1,
      combatEvents: 0,
      identityEvents: 0,
      invalidLines: 0,
      decodeWarnings: 0,
    });
  });

  test("counts unrelated and malformed lines without retaining them", () => {
    expect(replay("not-json\n{}\n")).toMatchObject({ datagrams: 0, invalidLines: 2, decodeWarnings: 0 });
  });

  /** `dump.ts --combat-only` writes decoded events, which replay through `loadDpsReplay` instead. */
  test("ignores valid records from other streams", () => {
    expect(replay(`${record("combat.event", { tick: 1, kind: "damage" })}\n`))
      .toMatchObject({ datagrams: 0, combatEvents: 0, invalidLines: 0 });
  });
});
