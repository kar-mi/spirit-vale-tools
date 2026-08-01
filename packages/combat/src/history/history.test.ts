import { appendFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "bun:test";
import { openReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import type { ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import type { LogRecord } from "@kar-mi/spirit-vale-tools-logging";

import { loadDpsReplay } from "../replay.ts";
import type { FishNetDpsActorRow, FishNetDpsEncounterSnapshot } from "../dps-meter.ts";
import { createCombatDomain } from "./domain.ts";
import { indexCombatStream } from "./importer.ts";
import { CombatHistoryStore } from "./store.ts";

const SESSION = "20260101T000000000Z-0000abcd";
const ORIGIN = Date.UTC(2026, 0, 1);

let sequence = 0;

function record(atMs: number, data: Record<string, unknown>, type = "combat.event"): string {
  const value: LogRecord = {
    schemaVersion: 1,
    sessionId: SESSION,
    sequence: ++sequence,
    recordedAt: new Date(ORIGIN + atMs).toISOString(),
    source: "synthetic-test",
    type,
    data: data as LogRecord["data"],
  };
  return `${JSON.stringify(value)}\n`;
}

function identity(actorId: number, displayName: string, atMs: number): string {
  return record(atMs, { kind: "actorIdentity", operation: "upsert", tick: atMs, actorId, displayName }, "combat.actorIdentity");
}

function damage(actorId: number, targetId: number, value: number, atMs: number, sourceId = "skill:strike"): string {
  return record(atMs, {
    kind: "damage", tick: atMs, actorId, targetId, team: 0, value,
    sourceId, sourceLabel: sourceId, hitResult: "normal",
  });
}

interface Fixture {
  root: string;
  logPath: string;
  open(): Promise<ReadModel>;
  cleanup(): Promise<void>;
}

async function fixture(): Promise<Fixture> {
  sequence = 0;
  const root = path.resolve(import.meta.dir, "../../../../.local", `combat-history-${crypto.randomUUID()}`);
  const logPath = path.join(root, "sessions", SESSION, "combat.jsonl");
  await mkdir(path.dirname(logPath), { recursive: true });
  await writeFile(logPath, "");
  const opened: ReadModel[] = [];
  return {
    root,
    logPath,
    async open() {
      const model = await openReadModel({ logDirectory: root, domains: [createCombatDomain()] });
      opened.push(model);
      return model;
    },
    async cleanup() {
      for (const model of opened.splice(0)) {
        try { model.close(); } catch { /* already closed */ }
      }
      await rm(root, { recursive: true, force: true });
    },
  };
}

/**
 * `loadDpsReplay` rebases every timestamp onto the first record it sees, while the read model stores
 * absolute epoch milliseconds so encounters stay comparable across sessions. Shift the legacy
 * snapshot onto the same base so everything else can be compared exactly.
 */
function toAbsolute(snapshot: FishNetDpsEncounterSnapshot, originMs: number): FishNetDpsEncounterSnapshot {
  const shiftRow = (row: FishNetDpsActorRow): FishNetDpsActorRow => ({
    ...row,
    ...(row.lastDamageAtMs === undefined ? {} : { lastDamageAtMs: row.lastDamageAtMs + originMs }),
  });
  return {
    ...snapshot,
    startedAtMs: snapshot.startedAtMs + originMs,
    lastDamageAtMs: snapshot.lastDamageAtMs + originMs,
    ...(snapshot.endedAtMs === undefined ? {} : { endedAtMs: snapshot.endedAtMs + originMs }),
    actors: snapshot.actors.map(shiftRow),
    ...(snapshot.personal === undefined ? {} : { personal: shiftRow(snapshot.personal) }),
  };
}

/** The whole point of the read model: it must agree with the legacy full-history replay. */
async function expectParity(context: Fixture, model: ReadModel): Promise<void> {
  const store = new CombatHistoryStore(model);
  const legacy = (await loadDpsReplay(context.logPath)).meter.getSnapshots();
  const listed = store.listEncounters({ sessionId: SESSION });
  expect(listed.items).toHaveLength(legacy.length);

  for (const [index, expected] of legacy.entries()) {
    const summary = listed.items[index]!;
    const actual = store.getEncounter(SESSION, summary.encounterId)!;
    // Encounter ids differ by construction (log-derived vs sequential); everything else must match.
    expect({ ...actual, id: expected.id }).toEqual(toAbsolute(expected, ORIGIN));
  }
}

describe("combat read model", () => {
  test("reproduces the legacy replay for a whole log", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        identity(2, "Bramble", 0),
        damage(1, 90, 100, 1_000),
        damage(2, 90, 50, 1_500, "skill:ember"),
        damage(1, 90, 200, 7_000),
        damage(1, 91, 25, 12_000),
        // 30s idle gap ends the first encounter.
        damage(2, 92, 300, 60_000, "skill:ember"),
        damage(1, 92, 120, 63_000),
      ].join(""));

      const model = await context.open();
      const result = await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      expect(result.recordsIndexed).toBe(8);
      await expectParity(context, model);
    } finally {
      await context.cleanup();
    }
  });

  test("resuming mid-encounter matches a single uninterrupted pass", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        damage(1, 90, 100, 1_000),
        damage(1, 90, 150, 4_000),
      ].join(""));

      const first = await context.open();
      // No finalize: the session is still live, so the trailing encounter must stay open.
      await indexCombatStream(first, { sessionId: SESSION, sourcePath: context.logPath });
      // The encounter is still open, so it must be stored unfinished and picked up again.
      expect((first.statement("select count(*) as n from combat_encounters where ended_at_ms is null").get() as { n: number }).n).toBe(1);
      first.close();

      await appendFile(context.logPath, [
        damage(1, 90, 200, 9_000),
        damage(1, 91, 75, 14_000, "skill:ember"),
      ].join(""));

      const second = await context.open();
      await indexCombatStream(second, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      await expectParity(context, second);
    } finally {
      await context.cleanup();
    }
  });

  test("indexing twice adds nothing and leaves totals unchanged", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        damage(1, 90, 100, 1_000),
        damage(1, 90, 100, 3_000),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      const totals = (): unknown => model
        .statement("select count(*) as n, sum(damage) as damage from combat_actors")
        .get();
      const before = totals();

      const again = await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      expect(again.recordsIndexed).toBe(0);
      expect(totals()).toEqual(before);
      await expectParity(context, model);
    } finally {
      await context.cleanup();
    }
  });

  test("keeps a player's aggregates separate when an actor id is reused", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        damage(1, 90, 100, 1_000),
        record(2_000, { kind: "actorIdentity", operation: "remove", tick: 2_000, actorId: 1 }, "combat.actorIdentity"),
        identity(1, "Bramble", 3_000),
        damage(1, 90, 400, 4_000),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      // Two distinct aggregates share actor id 1; a key on actor_id alone would collapse them.
      expect((model.statement("select count(*) as n from combat_actors where actor_id = 1").get() as { n: number }).n).toBe(2);
      await expectParity(context, model);
    } finally {
      await context.cleanup();
    }
  });

  test("records the death log and enemy breakdown from the same pass", async () => {
    const context = await fixture();
    try {
      const incoming = (actorId: number, targetId: number, value: number, atMs: number, kind = "damage"): string =>
        record(atMs, {
          kind, tick: atMs, actorId, targetId, team: 1, value,
          sourceId: "skill:maul", sourceLabel: "Maul", hitResult: "normal",
          ...(kind === "death" ? { duplicatesDamageEvent: false } : {}),
        });

      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        // A monster publishes its name through an activation record.
        record(500, { kind: "activation", tick: 500, actorId: 500, sourceId: "__spiritvaleMobIdentity:boss", sourceLabel: "Cave Warden" }),
        damage(1, 90, 100, 1_000),
        damage(1, 90, 50, 2_000, "skill:ember"),
        damage(1, 91, 70, 3_000),
        incoming(500, 1, 40, 4_000),
        incoming(500, 1, 60, 5_000),
        incoming(500, 1, 25, 6_000, "death"),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      const store = new CombatHistoryStore(model);
      const encounterId = store.listEncounters({ sessionId: SESSION }).items[0]!.encounterId;

      const deaths = store.getDeathLog({ sessionId: SESSION });
      expect(deaths.items).toHaveLength(1);
      const death = deaths.items[0]!;
      expect(death).toMatchObject({ victimName: "Aurora", targetId: 1, totalDamage: 125 });
      // All three incoming hits fall inside the ten-second lookback, newest last.
      expect(death.hits.map((hit) => hit.damage)).toEqual([40, 60, 25]);
      expect(death.hits.every((hit) => hit.attackerIsMonster && hit.attackerLabel === "Cave Warden")).toBe(true);

      const breakdown = store.getEnemyBreakdown(SESSION, encounterId);
      // Aurora's outgoing targets plus the monster's target, since every positive hit is counted.
      expect(breakdown.enemies.map((enemy) => enemy.targetId).sort()).toEqual([1, 90, 91]);
      const auroraOnNinety = breakdown.skills.filter((row) => row.attackerActorId === 1 && row.targetId === 90);
      expect(auroraOnNinety.map((row) => [row.sourceId, row.damage]).sort()).toEqual([["skill:ember", 50], ["skill:strike", 100]]);
    } finally {
      await context.cleanup();
    }
  });

  test("pages encounters with a cursor, returning each exactly once", async () => {
    const context = await fixture();
    try {
      const lines: string[] = [identity(1, "Aurora", 0)];
      for (let index = 0; index < 7; index += 1) lines.push(damage(1, 90 + index, 100, index * 60_000));
      await appendFile(context.logPath, lines.join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      const store = new CombatHistoryStore(model);

      const seen: string[] = [];
      let cursor: string | undefined;
      do {
        const page = store.listEncounters({ sessionId: SESSION, limit: 3, ...(cursor ? { cursor } : {}) });
        expect(page.items.length).toBeLessThanOrEqual(3);
        seen.push(...page.items.map((item) => item.encounterId));
        cursor = page.nextCursor;
      } while (cursor);

      expect(seen).toHaveLength(7);
      expect(new Set(seen).size).toBe(7);
    } finally {
      await context.cleanup();
    }
  });
});
