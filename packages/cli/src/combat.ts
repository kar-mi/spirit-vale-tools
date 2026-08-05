import {
  BUNDLED_GAME_BUILD_FINGERPRINTS,
  loadBundledFishNetSemanticMap,
} from "@kar-mi/spirit-vale-tools-capture";
import {
  DamageReducer,
  FishNetActorDirectory,
  FishNetCombatTracker,
  MeterReducer,
  renderEncounter,
  replayCombatCapture,
} from "@kar-mi/spirit-vale-tools-combat";
import type { EncounterAggregate } from "@kar-mi/spirit-vale-tools-combat";
import { mobDefinitionsById } from "@kar-mi/spirit-vale-tools-rewards";

function option(name: string): string | undefined {
  const index = Bun.argv.indexOf(name);
  return index >= 0 ? Bun.argv[index + 1] : undefined;
}

const input = option("--input");
if (!input) throw new Error("--input <capture.jsonl> is required; it must be a raw capture (capture:dump), not a --combat-only log");
const fishNetBuildFingerprint = option("--fishnet-build");
const semanticMap = fishNetBuildFingerprint
  && BUNDLED_GAME_BUILD_FINGERPRINTS.some((fingerprint) => fingerprint === fishNetBuildFingerprint)
  ? loadBundledFishNetSemanticMap(fishNetBuildFingerprint)
  : undefined;

const finished: { encounter: EncounterAggregate; tanked?: EncounterAggregate }[] = [];
const tanked = new MeterReducer({ kind: "tanked" });
const reducer = new DamageReducer({
  onEncounterFinished: (encounter) => {
    const meter = tanked.current?.id === encounter.id
      ? tanked.finish(encounter.endedAtMs ?? encounter.lastDamageAtMs)
      : undefined;
    finished.push({ encounter, ...(meter ? { tanked: meter } : {}) });
  },
});

let lastObservedAtMs = 0;
const result = await replayCombatCapture(input, {
  directory: new FishNetActorDirectory(),
  tracker: new FishNetCombatTracker({
    ...(fishNetBuildFingerprint === undefined ? {} : { buildFingerprint: fishNetBuildFingerprint }),
    ...(semanticMap === undefined ? {} : { semanticMap }),
    monsterCatalog: mobDefinitionsById(),
  }),
  onEvent: (event, observedAtMs) => {
    lastObservedAtMs = observedAtMs;
    if (event.kind === "actorIdentity") {
      reducer.consumeIdentity(event, observedAtMs);
      tanked.consumeIdentity(event);
      return;
    }
    // The damage reducer owns encounter boundaries, so it runs first; the meter only follows the
    // encounter it is told about. Mirrors `history/importer.ts`.
    reducer.consumeCombat(event, observedAtMs);
    const encounter = reducer.current;
    if (!encounter) return;
    if (tanked.current?.id !== encounter.id) tanked.begin(encounter.id, encounter.startedAtMs);
    tanked.consumeCombat(event, observedAtMs, reducer.identities);
  },
});
reducer.reset(lastObservedAtMs);

console.log(`replayed ${result.datagrams} datagrams: ${result.combatEvents} combat events, `
  + `${result.identityEvents} identity events, ${result.invalidLines} invalid lines, `
  + `${result.decodeWarnings} decode warnings`);
console.log(`${finished.length} encounter(s), ${finished.reduce((total, entry) => total + entry.encounter.deaths.length, 0)} death(s)`);

for (const { encounter, tanked: tankedAggregate } of finished) {
  const snapshot = renderEncounter(encounter, { nowMs: lastObservedAtMs });
  console.log("");
  console.log(`== ${snapshot.id}  ${time(snapshot.startedAtMs)} -> ${time(snapshot.endedAtMs ?? snapshot.lastDamageAtMs)}`
    + `  (${(snapshot.durationMs / 1_000).toFixed(1)}s)  ${count(snapshot.totalDamage)} damage`);
  for (const actor of snapshot.actors) {
    console.log(`   ${actor.displayName.padEnd(20)} ${count(actor.damage).padStart(12)}  ${count(Math.round(actor.dps)).padStart(9)} dps`
      + `  ${actor.hits} hits  ${actor.kills} kills`);
  }
  if (tankedAggregate) {
    const takenRows = renderEncounter(tankedAggregate, { nowMs: lastObservedAtMs }).actors.filter((actor) => actor.damage > 0);
    if (takenRows.length > 0) {
      console.log("   -- damage taken --");
      for (const actor of takenRows) {
        const top = [...actor.skills].sort((left, right) => right.damage - left.damage)[0];
        console.log(`   ${actor.displayName.padEnd(20)} ${count(actor.damage).padStart(12)}  ${actor.hits} hits`
          + `${top ? `  top: ${top.sourceLabel} ${count(top.damage)}` : ""}`);
      }
    }
  }
  for (const death of encounter.deaths) {
    console.log(`   -- death: ${death.victimName} (${death.targetId}) at ${time(death.diedAtMs)}, ${count(death.totalDamage)} in the last 10s --`);
    for (const hit of death.hits) {
      console.log(`      -${(hit.beforeDeathMs / 1_000).toFixed(3)}s  ${hit.attackerLabel} (${hit.attackerActorId})`
        + `  ${hit.sourceLabel}  ${count(hit.damage)}${hit.critical ? " crit" : ""}`);
    }
  }
}

function time(atMs: number): string {
  return new Date(atMs).toISOString();
}

function count(value: number): string {
  return value.toLocaleString("en-US");
}
