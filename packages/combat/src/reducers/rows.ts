import type { FishNetDpsActorRow, FishNetDpsEncounterSnapshot, FishNetDpsSkillRow, FishNetPersonalMatch } from "../dps-meter.ts";
import { DEFAULT_CURRENT_WINDOW_MS, DEFAULT_MINIMUM_DURATION_MS, createActor } from "./damage.ts";
import type { ActorAggregate, EncounterAggregate } from "./damage.ts";
import { addSeries, seriesPoints } from "./timeline.ts";

export interface RenderOptions {
  nowMs?: number;
  currentWindowMs?: number;
  minimumDurationMs?: number;
  anonymousIdentityGraceMs?: number;
  personalName?: string;
  personalActorId?: number;
}

const DEFAULT_ANONYMOUS_IDENTITY_GRACE_MS = 10_000;

/**
 * Renders an aggregate into the same snapshot shape the legacy meter produces, so the read model and
 * the live service can be diffed against `FishNetDpsMeter` field for field.
 */
export function renderEncounter(
  encounter: EncounterAggregate,
  options: RenderOptions = {},
): FishNetDpsEncounterSnapshot {
  const currentWindowMs = options.currentWindowMs ?? DEFAULT_CURRENT_WINDOW_MS;
  const minimumDurationMs = options.minimumDurationMs ?? DEFAULT_MINIMUM_DURATION_MS;
  const anonymousIdentityGraceMs = options.anonymousIdentityGraceMs ?? DEFAULT_ANONYMOUS_IDENTITY_GRACE_MS;
  const personalName = options.personalName ?? "";
  const personalActorId = options.personalActorId;

  const snapshotNowMs = Math.max(options.nowMs ?? encounter.lastDamageAtMs, encounter.lastDamageAtMs);
  const durationMs = Math.max(minimumDurationMs, encounter.lastDamageAtMs - encounter.startedAtMs);
  const mergedActors = mergeActors(encounter.actors);
  const totalDamage = mergedActors.reduce((sum, actor) => sum + actor.damage, 0);
  const rowForActor = (actor: ActorAggregate): FishNetDpsActorRow => actorRow(
    actor,
    encounter.startedAtMs,
    durationMs,
    totalDamage,
    snapshotNowMs,
    currentWindowMs,
    minimumDurationMs,
    actor.displayName === undefined,
    "encounter",
  );
  const namedActors = mergedActors.filter((actor) => actor.displayName !== undefined);
  const anonymousActors = mergedActors.filter((actor) => actor.displayName === undefined);
  const visibleAnonymousActors = anonymousActors.filter((actor) => encounter.endedAtMs !== undefined
    || (personalActorId !== undefined && actor.actorIds.includes(personalActorId))
    || actor.firstDamageAtMs === undefined
    || snapshotNowMs - actor.firstDamageAtMs >= anonymousIdentityGraceMs);
  const displayActors = visibleAnonymousActors.length === 0
    ? namedActors
    : [...namedActors, combineActors(visibleAnonymousActors)];
  const actors = displayActors.map(rowForActor).sort(compareRows);
  const partyCurrentDps = mergedActors.reduce((sum, actor) => sum + rowForActor(actor).currentDps, 0);
  const normalizedPersonalName = normalizeName(personalName);
  const selectedPersonalActor = personalActorId === undefined
    ? undefined
    : mergedActors.find((actor) => actor.actorIds.includes(personalActorId));
  const personalActor = selectedPersonalActor ?? (normalizedPersonalName
    ? namedActors.find((actor) => normalizeName(actor.displayName ?? "") === normalizedPersonalName)
    : undefined);
  const personalMatch: FishNetPersonalMatch = selectedPersonalActor
    ? "matched"
    : personalActorId !== undefined
      ? "missing"
      : !normalizedPersonalName
        ? "unconfigured"
        : personalActor
          ? "matched"
          : "missing";
  const personalStartMs = personalActor?.firstDamageAtMs ?? encounter.startedAtMs;
  const personalDurationMs = Math.max(
    minimumDurationMs,
    (personalActor?.lastDamageAtMs ?? personalStartMs) - personalStartMs,
  );
  const personal = personalActor === undefined
    ? undefined
    : actorRow(
      personalActor,
      personalStartMs,
      personalDurationMs,
      totalDamage,
      snapshotNowMs,
      currentWindowMs,
      minimumDurationMs,
      personalActor.displayName === undefined,
      "actor",
    );
  return {
    id: encounter.id,
    startedAtMs: encounter.startedAtMs,
    lastDamageAtMs: encounter.lastDamageAtMs,
    ...(encounter.endedAtMs === undefined ? {} : { endedAtMs: encounter.endedAtMs }),
    durationMs,
    totalDamage,
    partyDps: perSecond(totalDamage, durationMs),
    partyCurrentDps,
    actors,
    personalName,
    personalMatch,
    ...(personalMatch === "matched" && personal ? { personal } : {}),
  };
}

function actorRow(
  actor: ActorAggregate,
  startedAtMs: number,
  durationMs: number,
  partyDamage: number,
  nowMs: number,
  currentWindowMs: number,
  minimumDurationMs: number,
  isUnidentified: boolean,
  alignment: "encounter" | "actor",
): FishNetDpsActorRow {
  const currentCutoffMs = nowMs - currentWindowMs;
  const windowDamage = actor.window.reduce(
    (sum, point) => point.atMs > currentCutoffMs ? sum + point.damage : sum,
    0,
  );
  const currentDurationMs = Math.max(minimumDurationMs, Math.min(currentWindowMs, nowMs - startedAtMs));
  const skills = [...actor.skills.values()]
    .map((skill): FishNetDpsSkillRow => ({
      ...skill,
      dps: perSecond(skill.damage, durationMs),
      contribution: actor.damage === 0 ? 0 : skill.damage / actor.damage,
      ...(skill.hits === 0 ? {} : { critRate: skill.criticalHits / skill.hits }),
    }))
    .sort(compareRows);
  const series = alignment === "actor" ? actor.actorSeries : actor.encounterSeries;
  return {
    actorIds: [...actor.actorIds],
    displayName: actor.displayName ?? (isUnidentified ? "Unidentified" : "Unknown"),
    ...(actor.archetype === undefined ? {} : { archetype: actor.archetype }),
    durationMs,
    ...(actor.lastDamageAtMs === undefined ? {} : { lastDamageAtMs: actor.lastDamageAtMs }),
    damage: actor.damage,
    dps: perSecond(actor.damage, durationMs),
    currentDps: perSecond(windowDamage, currentDurationMs),
    contribution: partyDamage === 0 ? 0 : actor.damage / partyDamage,
    hits: actor.hits,
    criticalHits: actor.criticalHits,
    ...(actor.hits === 0 ? {} : { critRate: actor.criticalHits / actor.hits }),
    kills: actor.kills,
    mobsHit: actor.targetIds.size,
    skills,
    timeline: seriesPoints(series, durationMs),
    ...(isUnidentified ? { isUnidentified: true } : {}),
  };
}

export function mergeActors(actors: readonly ActorAggregate[]): ActorAggregate[] {
  const merged = new Map<string, ActorAggregate>();
  for (const actor of actors) {
    if (actor.damage <= 0) continue;
    const displayName = actor.displayName?.trim() || undefined;
    const key = displayName !== undefined
      ? `name:${normalizeName(displayName)}`
      : actor.uid !== undefined
        ? `uid:${actor.uid}`
        : actor.ownerConnectionId !== undefined
          ? `owner:${actor.ownerConnectionId}`
          : `actor:${actor.actorId}`;
    let target = merged.get(key);
    if (!target) {
      target = {
        ...createActor(actor.actorId, actor.encounterSeries.originMs),
        ...(displayName === undefined ? {} : { displayName }),
        activeIdentity: actor.activeIdentity,
        ...(actor.archetype === undefined ? {} : { archetype: actor.archetype }),
        ...(actor.ownerConnectionId === undefined ? {} : { ownerConnectionId: actor.ownerConnectionId }),
        ...(actor.uid === undefined ? {} : { uid: actor.uid }),
      };
      merged.set(key, target);
    }
    if (actor.activeIdentity && actor.archetype !== undefined) {
      target.archetype = actor.archetype;
    } else if (target.archetype === undefined) {
      target.archetype = actor.archetype;
    }
    target.activeIdentity ||= actor.activeIdentity;
    accumulate(target, actor);
  }
  return [...merged.values()];
}

export function combineActors(actors: readonly ActorAggregate[]): ActorAggregate {
  const combined = createActor(actors[0]?.actorId ?? -1, actors[0]?.encounterSeries.originMs ?? 0);
  combined.actorIds = [];
  for (const actor of actors) {
    combined.actorIds.push(...actor.actorIds);
    accumulate(combined, actor, false);
  }
  combined.actorIds = [...new Set(combined.actorIds)];
  return combined;
}

/** Folds one aggregate into another, keeping both bucket alignments consistent. */
function accumulate(target: ActorAggregate, actor: ActorAggregate, mergeIds = true): void {
  target.damage += actor.damage;
  target.firstDamageAtMs = minDefined(target.firstDamageAtMs, actor.firstDamageAtMs);
  target.lastDamageAtMs = maxDefined(target.lastDamageAtMs, actor.lastDamageAtMs);
  target.hits += actor.hits;
  target.criticalHits += actor.criticalHits;
  target.kills += actor.kills;
  if (mergeIds) target.actorIds = [...new Set([...target.actorIds, ...actor.actorIds])];
  for (const targetId of actor.targetIds) target.targetIds.add(targetId);
  for (const [targetId, damage] of actor.targetDamage) {
    target.targetDamage.set(targetId, (target.targetDamage.get(targetId) ?? 0) + damage);
  }
  target.window.push(...actor.window);
  addSeries(target.encounterSeries, actor.encounterSeries);
  // The merged row's own-origin timeline starts at the earliest component's first damage.
  if (target.actorSeries.buckets.length === 0) {
    target.actorSeries = { ...actor.actorSeries, buckets: [...actor.actorSeries.buckets] };
  } else {
    if (actor.actorSeries.originMs < target.actorSeries.originMs) {
      rebase(target.actorSeries, actor.actorSeries.originMs);
    }
    addSeries(target.actorSeries, actor.actorSeries);
  }
  for (const skill of actor.skills.values()) {
    const current = target.skills.get(skill.sourceId);
    if (current) {
      current.sourceLabel = skill.sourceLabel;
      current.damage += skill.damage;
      current.hits += skill.hits;
      current.criticalHits += skill.criticalHits;
    } else {
      target.skills.set(skill.sourceId, { ...skill });
    }
  }
}

/** Shifts a series to an earlier origin, inserting empty leading buckets. */
function rebase(series: { originMs: number; widthMs: number; buckets: number[] }, originMs: number): void {
  const shift = Math.round((series.originMs - originMs) / series.widthMs);
  if (shift <= 0) {
    series.originMs = originMs;
    return;
  }
  series.buckets = [...new Array<number>(shift).fill(0), ...series.buckets];
  series.originMs = originMs;
}

export function compareRows(
  left: { damage: number; sourceLabel?: string; displayName?: string },
  right: { damage: number; sourceLabel?: string; displayName?: string },
): number {
  return right.damage - left.damage
    || (left.sourceLabel ?? left.displayName ?? "").localeCompare(right.sourceLabel ?? right.displayName ?? "");
}

export function perSecond(damage: number, durationMs: number): number {
  return damage / (durationMs / 1_000);
}

export function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

function minDefined(left: number | undefined, right: number | undefined): number | undefined {
  if (left === undefined) return right;
  if (right === undefined) return left;
  return Math.min(left, right);
}

function maxDefined(left: number | undefined, right: number | undefined): number | undefined {
  if (left === undefined) return right;
  if (right === undefined) return left;
  return Math.max(left, right);
}
