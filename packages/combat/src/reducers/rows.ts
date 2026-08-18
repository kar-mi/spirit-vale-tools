import type { FishNetDpsActorRow, FishNetDpsEncounterSnapshot, FishNetDpsSkillRow, FishNetPersonalMatch } from "../snapshot.ts";
import { DEFAULT_CURRENT_TAU_SECONDS, DEFAULT_MINIMUM_DURATION_MS, createActor } from "./damage.ts";
import type { ActorAggregate, EncounterAggregate, EnemySkillStats } from "./damage.ts";
import { addSeries, seriesPoints } from "./timeline.ts";

export interface RenderOptions {
  nowMs?: number;
  minimumDurationMs?: number;
  anonymousIdentityGraceMs?: number;
  personalName?: string;
  personalActorId?: number;
}

const DEFAULT_ANONYMOUS_IDENTITY_GRACE_MS = 10_000;

/**
 * Renders an aggregate into an encounter snapshot. Every derived figure lives here — per-skill rows,
 * timeline buckets, crit rates, contribution shares, the personal row — so the live service, the
 * history read model and a whole-log replay all report identically from the same aggregates.
 */
export function renderEncounter(
  encounter: EncounterAggregate,
  options: RenderOptions = {},
): FishNetDpsEncounterSnapshot {
  const minimumDurationMs = options.minimumDurationMs ?? DEFAULT_MINIMUM_DURATION_MS;
  const anonymousIdentityGraceMs = options.anonymousIdentityGraceMs ?? DEFAULT_ANONYMOUS_IDENTITY_GRACE_MS;
  const personalName = options.personalName ?? "";
  const personalActorId = options.personalActorId;

  const snapshotNowMs = Math.max(options.nowMs ?? encounter.lastDamageAtMs, encounter.lastDamageAtMs);
  const durationMs = Math.max(minimumDurationMs, encounter.lastDamageAtMs - encounter.startedAtMs);
  const mergedActors = mergeActors(encounter.actors);
  const totalDamage = mergedActors.reduce((sum, actor) => sum + actor.damage, 0);
  const rowForActor = (actor: ActorAggregate, rowId: string): FishNetDpsActorRow => actorRow(
    actor,
    rowId,
    encounter.startedAtMs,
    durationMs,
    totalDamage,
    snapshotNowMs,
    minimumDurationMs,
    actor.displayName === undefined,
    "encounter",
  );
  const displayGroups = displayActorAggregates(encounter, {
    snapshotNowMs,
    anonymousIdentityGraceMs,
    personalActorId,
  });
  const actors = displayGroups.map(({ actor, rowId }) => rowForActor(actor, rowId)).sort(compareRows);
  const partyCurrentDps = mergedActors.reduce(
    (sum, actor) => sum + rowForActor(actor, actorRowId(actor)).currentDps,
    0,
  );
  const namedActors = mergedActors.filter((actor) => actor.displayName !== undefined);
  const visibleAnonymousActors = displayGroups
    .filter(({ rowId }) => rowId === UNIDENTIFIED_ROW_ID)
    .flatMap(({ actor }) => actor.actorIds);
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
      actorRowId(personalActor),
      personalStartMs,
      personalDurationMs,
      totalDamage,
      snapshotNowMs,
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
    unidentifiedActorIds: visibleAnonymousActors,
    personalName,
    personalMatch,
    ...(personalMatch === "matched" && personal ? { personal } : {}),
  };
}

function actorRow(
  actor: ActorAggregate,
  rowId: string,
  startedAtMs: number,
  durationMs: number,
  partyDamage: number,
  nowMs: number,
  minimumDurationMs: number,
  isUnidentified: boolean,
  alignment: "encounter" | "actor",
): FishNetDpsActorRow {
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
    rowId,
    actorIds: [...actor.actorIds],
    displayName: actor.displayName ?? (isUnidentified ? "Unidentified" : "Unknown"),
    ...(actor.archetype === undefined ? {} : { archetype: actor.archetype }),
    durationMs,
    ...(actor.lastDamageAtMs === undefined ? {} : { lastDamageAtMs: actor.lastDamageAtMs }),
    damage: actor.damage,
    dps: perSecond(actor.damage, durationMs),
    currentDps: actor.currentRate.rateAt(nowMs, { fromMs: startedAtMs, minimumMs: minimumDurationMs }),
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

export const UNIDENTIFIED_ROW_ID = "unidentified";

export interface DisplayActorAggregate {
  rowId: string;
  actor: ActorAggregate;
}

/** Applies the same identity and anonymous-row folding used by the rendered encounter. */
export function displayActorAggregates(
  encounter: EncounterAggregate,
  options: { snapshotNowMs?: number; anonymousIdentityGraceMs?: number; personalActorId?: number } = {},
): DisplayActorAggregate[] {
  const snapshotNowMs = Math.max(options.snapshotNowMs ?? encounter.lastDamageAtMs, encounter.lastDamageAtMs);
  const anonymousIdentityGraceMs = options.anonymousIdentityGraceMs ?? DEFAULT_ANONYMOUS_IDENTITY_GRACE_MS;
  const mergedActors = mergeActors(encounter.actors);
  const namedActors = mergedActors.filter((actor) => actor.displayName !== undefined);
  const visibleAnonymousActors = mergedActors.filter((actor) => actor.displayName === undefined)
    .filter((actor) => encounter.endedAtMs !== undefined
      || (options.personalActorId !== undefined && actor.actorIds.includes(options.personalActorId))
      || actor.firstDamageAtMs === undefined
      || snapshotNowMs - actor.firstDamageAtMs >= anonymousIdentityGraceMs);
  return [
    ...namedActors.map((actor) => ({ rowId: actorRowId(actor), actor })),
    ...(visibleAnonymousActors.length === 0
      ? []
      : [{ rowId: UNIDENTIFIED_ROW_ID, actor: combineActors(visibleAnonymousActors) }]),
  ];
}

export function actorRowId(actor: ActorAggregate): string {
  const displayName = actor.displayName?.trim();
  if (displayName) return `name:${normalizeName(displayName)}`;
  if (actor.uid !== undefined) return `uid:${actor.uid}`;
  if (actor.ownerConnectionId !== undefined) return `owner:${actor.ownerConnectionId}`;
  return `actor:${actor.actorId}`;
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
        ...createActor(actor.actorId, actor.encounterSeries.originMs, actor.currentRate.emptyLike()),
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
  const combined = createActor(
    actors[0]?.actorId ?? -1,
    actors[0]?.encounterSeries.originMs ?? 0,
    actors[0]?.currentRate.emptyLike() ?? DEFAULT_CURRENT_TAU_SECONDS,
  );
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
  for (const [targetId, skills] of actor.enemySkills) {
    const targetSkills = target.enemySkills.get(targetId) ?? new Map<string, EnemySkillStats>();
    target.enemySkills.set(targetId, targetSkills);
    for (const [sourceId, stats] of skills) {
      const current = targetSkills.get(sourceId)
        ?? { sourceLabel: stats.sourceLabel, damage: 0, hits: 0, criticalHits: 0 };
      current.sourceLabel = stats.sourceLabel;
      current.damage += stats.damage;
      current.hits += stats.hits;
      current.criticalHits += stats.criticalHits;
      targetSkills.set(sourceId, current);
    }
  }
  target.currentRate.add(actor.currentRate);
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
