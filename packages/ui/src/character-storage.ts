import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Utils } from "electrobun/bun";
import { CURRENT_GAME_BUILD_FINGERPRINT } from "@spiritvale/core";
import type { CharacterSnapshot } from "@spiritvale/character";

const directory = path.join(Utils.paths.userData, "spirit-vale-tools");
const defaultFile = path.join(directory, "character.json");

export async function loadCharacterSnapshot(file = defaultFile): Promise<CharacterSnapshot | undefined> {
  try {
    const value = JSON.parse(await readFile(file, "utf8")) as Partial<CharacterSnapshot>;
    if (value.schemaVersion !== 1 || value.buildFingerprint !== CURRENT_GAME_BUILD_FINGERPRINT) return undefined;
    if (typeof value.name !== "string" || typeof value.level !== "number" || !validAttributes(value.attributes)) return undefined;
    return {
      ...value,
      activeLoadout: value.activeLoadout ?? "Normal",
      equipment: Array.isArray(value.equipment) ? value.equipment : [],
      artifacts: Array.isArray(value.artifacts) ? value.artifacts.map((artifact) => ({
        ...(artifact as unknown as Record<string, unknown>),
        gems: Array.isArray((artifact as { gems?: unknown }).gems)
          ? (artifact as { gems: unknown[] }).gems.flatMap((gem) => typeof gem === "string" ? [{ id: gem, refine: 0 }] : gem && typeof gem === "object" && typeof (gem as { id?: unknown }).id === "string" && typeof (gem as { refine?: unknown }).refine === "number" ? [gem] : [])
          : [],
      })) as CharacterSnapshot["artifacts"] : [],
      skills: Array.isArray(value.skills) ? value.skills.map((skill) => ({
        ...(skill as unknown as Record<string, unknown>),
        effects: Array.isArray((skill as unknown as { effects?: unknown }).effects) ? (skill as unknown as { effects: unknown[] }).effects : [],
      })) as CharacterSnapshot["skills"] : [],
      source: "cached",
    } as CharacterSnapshot;
  } catch {
    return undefined;
  }
}

export async function saveCharacterSnapshot(snapshot: CharacterSnapshot, file = defaultFile): Promise<void> {
  const safe: CharacterSnapshot = {
    schemaVersion: 1,
    buildFingerprint: snapshot.buildFingerprint,
    name: snapshot.name,
    ...(snapshot.title ? { title: snapshot.title } : {}),
    archetypes: [...snapshot.archetypes],
    level: snapshot.level,
    experience: snapshot.experience,
    jobLevel: snapshot.jobLevel,
    jobExperience: snapshot.jobExperience,
    attributes: { ...snapshot.attributes },
    activeLoadout: snapshot.activeLoadout,
    equipment: structuredClone(snapshot.equipment),
    artifacts: structuredClone(snapshot.artifacts),
    skills: structuredClone(snapshot.skills),
    ...(snapshot.playtimeSeconds === undefined ? {} : { playtimeSeconds: snapshot.playtimeSeconds }),
    ...(snapshot.monsterKills === undefined ? {} : { monsterKills: snapshot.monsterKills }),
    ...(snapshot.bossKills === undefined ? {} : { bossKills: snapshot.bossKills }),
    ...(snapshot.deaths === undefined ? {} : { deaths: snapshot.deaths }),
    updatedAt: snapshot.updatedAt,
    source: "cached",
  };
  const temporary = `${file}.tmp`;
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(temporary, `${JSON.stringify(safe, null, 2)}\n`, "utf8");
  await rename(temporary, file);
}

function validAttributes(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  return ["STR", "VIT", "AGI", "DEX", "INT", "LUK"].every((key) => Number.isFinite((value as Record<string, unknown>)[key]));
}
