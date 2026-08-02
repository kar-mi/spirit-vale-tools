import { appendFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "bun:test";
import { openReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import type { ReadModel } from "@kar-mi/spirit-vale-tools-sqlite";
import { sanitizeCombatData } from "@kar-mi/spirit-vale-tools-logging";
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

/** Flat lifecycle record emitted when capture identifies a monster from its spawn packet. */
function spawnIdentity(actorId: number, displayName: string, atMs: number): string {
  const data = sanitizeCombatData("combat.event", {
    kind: "monsterIdentity", operation: "upsert", tick: atMs, actorId,
    mobId: "fictional_mob", displayName,
  });
  if (!data) throw new Error("monster identity was rejected by the combat sanitizer");
  return record(atMs, data);
}

/** Incoming damage: a non-zero team is what makes it count toward the tanked meter. */
function incoming(actorId: number, targetId: number, value: number, atMs: number, sourceId = "skill:bite"): string {
  return record(atMs, {
    kind: "damage", tick: atMs, actorId, targetId, team: 1, value,
    sourceId, sourceLabel: sourceId, hitResult: "normal",
  });
}

function mobIdentity(actorId: number, displayName: string, atMs: number): string {
  return record(atMs, {
    kind: "activation", tick: atMs, actorId,
    sourceId: "__spiritvaleMobIdentity:mob", sourceLabel: displayName, level: 10,
  });
}

/**
 * A player death. Real logs carry no damage on the death record itself — the lethal blow is a
 * separate damage event — so the value defaults to zero.
 */
function playerDeath(actorId: number, targetId: number, atMs: number, value = 0): string {
  return record(atMs, {
    kind: "death", tick: atMs, actorId, targetId, team: 1, value,
    sourceId: "skill:bite", sourceLabel: "skill:bite", hitResult: "normal",
    duplicatesDamageEvent: false,
  });
}

function heal(actorId: number, targetId: number, value: number, atMs: number, sourceId = "skill:mend"): string {
  return record(atMs, {
    kind: "heal", tick: atMs, actorId, targetId, value,
    sourceId, sourceLabel: sourceId, attribution: "exact",
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

describe("indexed meters", () => {
  test("indexes tanked and healing beside damage and reads them back", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        identity(2, "Bramble", 0),
        damage(1, 90, 100, 1_000),
        incoming(90, 1, 40, 2_000),
        incoming(90, 1, 60, 2_500),
        incoming(90, 2, 10, 2_600),
        heal(2, 1, 25, 3_000),
        heal(2, 1, 15, 3_200),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      const store = new CombatHistoryStore(model);
      const [summary] = store.listEncounters({ sessionId: SESSION }).items;
      const encounterId = summary!.encounterId;

      const dps = store.getEncounter(SESSION, encounterId)!;
      expect(dps.totalDamage).toBe(100);
      expect(dps.actors.map((actor) => actor.displayName)).toEqual(["Aurora"]);

      const tanked = store.getEncounter(SESSION, encounterId, { meter: "tanked" })!;
      expect(tanked.totalDamage).toBe(110);
      // Grouped by the party member taking the hit, not the attacker.
      expect(tanked.actors.map((actor) => [actor.displayName, actor.damage, actor.hits]))
        .toEqual([["Aurora", 100, 2], ["Bramble", 10, 1]]);
      expect(tanked.actors[0]!.skills.map((skill) => skill.sourceLabel)).toEqual(["skill:bite"]);
      expect(tanked.actors[0]!.timeline.length).toBeGreaterThan(0);

      const healing = store.getEncounter(SESSION, encounterId, { meter: "healing" })!;
      expect(healing.totalDamage).toBe(40);
      expect(healing.actors.map((actor) => [actor.displayName, actor.damage, actor.hits]))
        .toEqual([["Bramble", 40, 2]]);

      // Every meter divides by the encounter's own duration, so the rates stay comparable.
      expect(tanked.durationMs).toBe(dps.durationMs);
      expect(healing.durationMs).toBe(dps.durationMs);

      // The personal row resolves on each meter independently.
      expect(store.getEncounter(SESSION, encounterId, { meter: "tanked", personalName: "Aurora" })!.personal?.damage)
        .toBe(100);
    } finally {
      await context.cleanup();
    }
  });

  test("resumes meter totals across an interrupted pass", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        damage(1, 90, 100, 1_000),
        incoming(90, 1, 40, 2_000),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath });

      // The encounter is still open; a second pass must continue its meters rather than restart them.
      await appendFile(context.logPath, [
        incoming(90, 1, 60, 3_000),
        heal(1, 1, 25, 3_500),
      ].join(""));
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });

      const store = new CombatHistoryStore(model);
      const encounterId = store.listEncounters({ sessionId: SESSION }).items[0]!.encounterId;
      expect(store.getEncounter(SESSION, encounterId, { meter: "tanked" })!.totalDamage).toBe(100);
      expect(store.getEncounter(SESSION, encounterId, { meter: "healing" })!.totalDamage).toBe(25);
    } finally {
      await context.cleanup();
    }
  });

  /**
   * A monster is named by its spawn packet, which the combat log does not carry, so the name has to
   * ride along on the hit. Nothing else in the stream can name a monster that dies without acting.
   */
  test("names an enemy that never acted, from its sanitized spawn identity", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        spawnIdentity(90, "Fictional Mob", 900),
        damage(1, 90, 100, 1_000),
        damage(1, 91, 100, 1_500),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      const store = new CombatHistoryStore(model);
      const encounterId = store.listEncounters({ sessionId: SESSION }).items[0]!.encounterId;

      const enemies = store.getEnemyBreakdown(SESSION, encounterId).enemies;
      expect(enemies.find((enemy) => enemy.targetId === 90)?.label).toBe("Fictional Mob");
      // Unnamed targets still fall back to the id, rather than borrowing another enemy's name.
      expect(enemies.find((enemy) => enemy.targetId === 91)?.label).toBe("Enemy 91");
    } finally {
      await context.cleanup();
    }
  });

  /**
   * An open encounter's enemy rows are deleted and rewritten on every pass, so a name learned in an
   * earlier pass has to be carried back on resume or the rewrite replaces it with the id.
   */
  test("keeps an enemy name across an incremental pass that does not re-see it", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        spawnIdentity(90, "Fictional Mob", 900),
        damage(1, 90, 100, 1_000),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath });

      // A later hit on the same still-open encounter, this time with no identity on the event.
      await appendFile(context.logPath, [damage(1, 90, 50, 2_000)].join(""));
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });

      const store = new CombatHistoryStore(model);
      const encounterId = store.listEncounters({ sessionId: SESSION }).items[0]!.encounterId;
      expect(store.getEnemyBreakdown(SESSION, encounterId).enemies
        .find((enemy) => enemy.targetId === 90)?.label).toBe("Fictional Mob");
    } finally {
      await context.cleanup();
    }
  });
});

describe("death log", () => {
  test("records a death that carries no damage of its own", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        damage(1, 90, 100, 1_000),
        incoming(90, 1, 40, 2_000),
        incoming(90, 1, 60, 2_500),
        playerDeath(90, 1, 3_000),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      const deaths = new CombatHistoryStore(model).getDeathLog({ sessionId: SESSION }).items;

      expect(deaths).toHaveLength(1);
      expect(deaths[0]!.victimName).toBe("Aurora");
      // The ten-second lookback carries the hits that led to it, even though the death itself is
      // not a positive hit and so contributes nothing to the enemy breakdown.
      expect(deaths[0]!.hits.map((hit) => hit.damage)).toEqual([40, 60]);
      expect(deaths[0]!.totalDamage).toBe(100);
    } finally {
      await context.cleanup();
    }
  });
});

describe("incremental indexing", () => {
  /**
   * The live path calls indexCombatStream repeatedly over a growing log, with a fresh reducer each
   * time. Identities, monster names and the death lookback span encounters, so they have to survive
   * a pass boundary that has no encounter open — which is the normal state between fights, and
   * always the state before the first one.
   */
  test("keeps identities and monster names across a pass with no open encounter", async () => {
    const context = await fixture();
    try {
      const model = await context.open();

      // Pass one: identities only, so nothing is open when it ends.
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        mobIdentity(90, "Shark Buccaneer", 500),
      ].join(""));
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath });

      // Pass two: the fight those identities belong to.
      await appendFile(context.logPath, [
        damage(1, 90, 100, 60_000),
        incoming(90, 1, 40, 60_500),
        playerDeath(90, 1, 61_000),
      ].join(""));
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });

      const store = new CombatHistoryStore(model);
      const deaths = store.getDeathLog({ sessionId: SESSION }).items;
      expect(deaths).toHaveLength(1);
      expect(deaths[0]!.victimName).toBe("Aurora");
      expect(deaths[0]!.hits.map((hit) => [hit.attackerLabel, hit.attackerIsMonster]))
        .toEqual([["Shark Buccaneer", true]]);

      // The tanked meter reads the same identity map, so it names the victim too.
      const encounterId = store.listEncounters({ sessionId: SESSION }).items[0]!.encounterId;
      expect(store.getEncounter(SESSION, encounterId, { meter: "tanked" })!.actors.map((a) => a.displayName))
        .toEqual(["Aurora"]);
    } finally {
      await context.cleanup();
    }
  });
});

describe("encounter boundaries", () => {
  /**
   * Incoming damage and healing cannot open an encounter, so nothing else would close one that has
   * gone idle before they are attributed. They must not be folded into the encounter that already
   * ended — that would corrupt the tanked and healing meters, the enemy breakdown and the death log.
   */
  test("does not attribute post-idle incoming damage to the expired encounter", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        damage(1, 90, 100, 0),
        // The encounter goes idle 1s after its last damage; these land well past that.
        incoming(90, 1, 40, 5_000),
        heal(1, 1, 25, 5_500),
        playerDeath(90, 1, 6_000),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, {
        sessionId: SESSION, sourcePath: context.logPath, idleGapMs: 1_000, finalize: true,
      });
      const store = new CombatHistoryStore(model);
      const encounters = store.listEncounters({ sessionId: SESSION }).items;

      // Only the outgoing damage defines an encounter.
      expect(encounters).toHaveLength(1);
      const encounterId = encounters[0]!.encounterId;
      expect(store.getEncounter(SESSION, encounterId)!.totalDamage).toBe(100);
      expect(store.getEncounter(SESSION, encounterId, { meter: "tanked" })!.totalDamage).toBe(0);
      expect(store.getEncounter(SESSION, encounterId, { meter: "healing" })!.totalDamage).toBe(0);
      // The enemy breakdown and the death log are fed from the same path.
      expect(store.getEnemyBreakdown(SESSION, encounterId).skills.filter((row) => row.targetId === 1)).toEqual([]);
      expect(store.getDeathLog({ sessionId: SESSION }).items).toEqual([]);
    } finally {
      await context.cleanup();
    }
  });

  test("still attributes incoming damage inside an active encounter", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        damage(1, 90, 100, 0),
        incoming(90, 1, 40, 500),
        heal(1, 1, 25, 600),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, {
        sessionId: SESSION, sourcePath: context.logPath, idleGapMs: 1_000, finalize: true,
      });
      const store = new CombatHistoryStore(model);
      const encounterId = store.listEncounters({ sessionId: SESSION }).items[0]!.encounterId;

      expect(store.getEncounter(SESSION, encounterId, { meter: "tanked" })!.totalDamage).toBe(40);
      expect(store.getEncounter(SESSION, encounterId, { meter: "healing" })!.totalDamage).toBe(25);
    } finally {
      await context.cleanup();
    }
  });
});

describe("malformed records", () => {
  test("accumulates unparseable lines across incremental passes", async () => {
    const context = await fixture();
    try {
      await appendFile(context.logPath, [
        identity(1, "Aurora", 0),
        "this is not json\n",
        damage(1, 90, 100, 1_000),
      ].join(""));

      const model = await context.open();
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath });
      const store = new CombatHistoryStore(model);
      expect(store.invalidLines(SESSION)).toBe(1);

      // A later pass adds its own, rather than reporting only what it read.
      await appendFile(context.logPath, ['{"broken": true}\n', damage(1, 90, 50, 2_000)].join(""));
      await indexCombatStream(model, { sessionId: SESSION, sourcePath: context.logPath, finalize: true });
      expect(store.invalidLines(SESSION)).toBe(2);
    } finally {
      await context.cleanup();
    }
  });
});
