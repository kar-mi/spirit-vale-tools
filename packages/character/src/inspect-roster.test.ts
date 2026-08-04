import { describe, expect, test } from "bun:test";
import type { CapturedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";
import { FishNetCharacterTracker } from "./tracker.ts";
import { FishNetInspectRoster } from "./inspect-roster.ts";
import { syntheticCharacter } from "./synthetic-character.test-helper.ts";

/** Inspect_T carries no leading CharacterUpdateType, hence `syntheticCharacter(false, …)`. */
function inspectPacket(name: string, rpcName = "Inspect_T"): CapturedFishNetPacket {
  return {
    tick: 1,
    packetId: 1,
    packetName: "targetRpc",
    rpcName,
    raw: Buffer.alloc(0),
    payload: syntheticCharacter(false, true, name),
    connectionId: "test-connection",
  } as CapturedFishNetPacket;
}

describe("FishNetInspectRoster", () => {
  test("decodes an inspected player into the roster", () => {
    const roster = new FishNetInspectRoster();

    expect(roster.consume(inspectPacket("Fictional Stranger"))).toBe(true);

    expect(roster.list().map((entry) => entry.snapshot.name)).toEqual(["Fictional Stranger"]);
    expect(roster.get("Fictional Stranger")?.equipment).toHaveLength(1);
  });

  test("ignores packets that are not inspect replies", () => {
    const roster = new FishNetInspectRoster();
    expect(roster.consume(inspectPacket("Fictional Stranger", "CharacterCallback_T"))).toBe(false);
    expect(roster.list()).toEqual([]);
  });

  test("keeps only the most recent inspect of a given player", () => {
    const roster = new FishNetInspectRoster();
    roster.consume(inspectPacket("Fictional Stranger"), new Date("2026-01-01T00:00:00.000Z"));
    roster.consume(inspectPacket("Fictional Stranger"), new Date("2026-01-02T00:00:00.000Z"));

    expect(roster.list()).toHaveLength(1);
    expect(roster.list()[0]!.inspectedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  test("orders most recently inspected first", () => {
    const roster = new FishNetInspectRoster();
    roster.consume(inspectPacket("First"), new Date("2026-01-01T00:00:00.000Z"));
    roster.consume(inspectPacket("Second"), new Date("2026-01-02T00:00:00.000Z"));

    expect(roster.list().map((entry) => entry.snapshot.name)).toEqual(["Second", "First"]);
  });

  test("evicts the least recently inspected player past the cap", () => {
    const roster = new FishNetInspectRoster(2);
    roster.consume(inspectPacket("First"), new Date("2026-01-01T00:00:00.000Z"));
    roster.consume(inspectPacket("Second"), new Date("2026-01-02T00:00:00.000Z"));
    roster.consume(inspectPacket("Third"), new Date("2026-01-03T00:00:00.000Z"));

    expect(roster.list().map((entry) => entry.snapshot.name)).toEqual(["Third", "Second"]);
  });

  test("re-inspecting refreshes recency so the other player is evicted instead", () => {
    const roster = new FishNetInspectRoster(2);
    roster.consume(inspectPacket("First"), new Date("2026-01-01T00:00:00.000Z"));
    roster.consume(inspectPacket("Second"), new Date("2026-01-02T00:00:00.000Z"));
    roster.consume(inspectPacket("First"), new Date("2026-01-03T00:00:00.000Z"));
    roster.consume(inspectPacket("Third"), new Date("2026-01-04T00:00:00.000Z"));

    expect(roster.list().map((entry) => entry.snapshot.name).sort()).toEqual(["First", "Third"]);
  });

  test("a malformed inspect is dropped rather than surfaced", () => {
    const roster = new FishNetInspectRoster();
    const packet = inspectPacket("Fictional Stranger");
    packet.payload = Buffer.from([0xff]);

    expect(roster.consume(packet)).toBe(false);
    expect(roster.list()).toEqual([]);
  });

  test("notifies subscribers and stops after unsubscribe", () => {
    const roster = new FishNetInspectRoster();
    const seen: number[] = [];
    const unsubscribe = roster.subscribe((entries) => seen.push(entries.length));

    roster.consume(inspectPacket("First"));
    unsubscribe();
    roster.consume(inspectPacket("Second"));

    expect(seen).toEqual([1]);
  });

  test("an inspected character never reaches the local character tracker", () => {
    // The tracker merges every payload it accepts into a single local snapshot, so routing an
    // inspect through it would overwrite your own character with a stranger's.
    const tracker = new FishNetCharacterTracker();
    expect(tracker.consume(inspectPacket("Fictional Stranger"))).toBe(false);
    expect(tracker.current()).toBeUndefined();
  });
});

describe("FishNetInspectRoster shape matching", () => {
  function unnamed(name: string): CapturedFishNetPacket {
    const packet = inspectPacket(name);
    delete (packet as { rpcName?: string }).rpcName;
    return packet;
  }

  test("recognises an inspect reply whose RPC-link id never resolved", () => {
    // A capture that joins mid-session cannot name PlayerController RPCs, so the reply arrives as
    // a bare targetRpc and must be matched on shape instead.
    const roster = new FishNetInspectRoster();
    expect(roster.consume(unnamed("Fictional Stranger"))).toBe(true);
    expect(roster.list().map((entry) => entry.snapshot.name)).toEqual(["Fictional Stranger"]);
  });

  test("never files the local player as an inspected stranger", () => {
    const roster = new FishNetInspectRoster();
    roster.setLocalName("Fictional Stranger");
    expect(roster.consume(unnamed("Fictional Stranger"))).toBe(false);
    expect(roster.list()).toEqual([]);
  });

  test("ignores an unnamed targetRpc too short to be a character", () => {
    const roster = new FishNetInspectRoster();
    const packet = unnamed("Fictional Stranger");
    packet.payload = Buffer.alloc(64);
    expect(roster.consume(packet)).toBe(false);
  });
});
