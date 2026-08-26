/** Options exist so the positional/chaos/qualifier fields can be exercised. */
export interface SyntheticCharacterOptions {
  /** `EquipData.ChaosType` on the worn weapon. -1 = no chaos substat. */
  chaosType?: number;
  /** Worn-weapon substats in wire order; `null` writes an absent entry (a hole). */
  substats?: Array<{ type: number; roll: number; valueStr?: string } | null>;
  /** Worn-weapon cards in wire order; `null` writes an empty socket. */
  cards?: Array<string | null>;
  /** Stored weapon loadouts (Normal, Secondary, Heavy). */
  loadouts?: Array<Array<{ slot: number; itemId: string }>>;
  /** Equipped grimoires in wire order; `null` writes an empty slot. */
  grimoires?: Array<string | null>;
  /** `SkillSystemData.Skills` — the skill-tree allocation. */
  skills?: Array<{ id: string; level: number }>;
  /** `SkillSystemData.Assigned` — the action bar. Must never reach `snapshot.skills`. */
  assigned?: Array<{ id: string; level: number }>;
}

export function syntheticCharacter(
  update: boolean,
  includeHistory = true,
  characterName = "Example Hero",
  options: SyntheticCharacterOptions = {},
): Buffer {
  const {
    chaosType = -1,
    substats = [{ type: 0, roll: 100, valueStr: "" }],
    cards = ["Example Card"],
    loadouts = [[], [], []],
    grimoires = [],
    skills = [{ id: "Example Skill", level: 3 }],
    assigned = [],
  } = options;
  const out: number[] = [];
  if (update) packed(out, 4);
  bool(out, false); // CharacterData is a class: present, not null.
  string(out, "example-character-id");
  string(out, "example-account");
  packed(out, 7);
  string(out, ""); string(out, ""); string(out, characterName);
  bool(out, false);
  for (let index = 0; index < 10; index += 1) packed(out, index);
  bool(out, false); list(out, [], () => undefined);
  list(out, [], () => undefined);
  string(out, "Trailblazer"); string(out, ""); string(out, "");
  list(out, [0, 12], (value) => packed(out, value));
  packed(out, 42); packed(out, 12345); packed(out, 18); packed(out, 678);
  bool(out, false);
  float(out, 1); float(out, 1); string(out, "Example Town");
  bool(out, false); float(out, 0); float(out, 0); float(out, 0);
  string(out, ""); // InstancedMapReturnMapId.
  bool(out, false); float(out, 0); float(out, 0); float(out, 0); // InstancedMapReturnPosition.
  list(out, [], () => undefined); packed(out, 0); list(out, [], () => undefined); list(out, [], () => undefined);
  list(out, [60, 30, 10, 20, 5, 15], (value) => packed(out, value));
  list(out, [0], () => {
    bool(out, false); packed(out, 0); bool(out, false);
    list(out, substats, (value) => {
      if (!value) { bool(out, true); return; }
      bool(out, false); packed(out, value.type); packed(out, value.roll); string(out, value.valueStr ?? "");
    });
    list(out, cards, (value) => maybeString(out, value));
    packed(out, 0); packed(out, 0); packed(out, chaosType); string(out, "example-equip-instance"); packed(out, 5); string(out, "Example Sword"); bool(out, false);
  });
  packed(out, 0);
  for (const set of loadouts) list(out, set, (entry) => equipSlot(out, entry.slot, entry.itemId));
  list(out, [0], () => {
    bool(out, false);
    list(out, [0], () => { bool(out, false); packed(out, 71); packed(out, 100); string(out, ""); });
    packed(out, 0);
    list(out, [0], () => { bool(out, false); string(out, "example-gem-instance"); packed(out, 1); string(out, "Example Gem"); bool(out, false); });
    string(out, "example-artifact-instance"); packed(out, 3); string(out, "Example Rune"); bool(out, false);
  });
  if (!includeHistory) return Buffer.from(out);
  bool(out, false); // SkillSystemData.
  list(out, skills, (value) => { bool(out, false); string(out, value.id); packed(out, value.level); }); // Skills.
  list(out, assigned, (value) => { bool(out, false); string(out, value.id); packed(out, value.level); }); // Assigned.
  bool(out, true); // SkillCopy.
  list(out, [], () => undefined); // Reanimations.
  list(out, grimoires, (value) => grimoire(out, value)); // Grimoires.
  bool(out, false); // InventoryData.
  dictionary(out, "fictional-bag-equipment", () => equipment(out, "Fictional Bag Sword"));
  dictionary(out, "fictional-bag-artifact", () => artifact(out, "Fictional Bag Rune"));
  dictionary(out, "fictional-card-stack", () => stackable(out, "Fictional Card", 7));
  dictionary(out, "fictional-gem", () => refinable(out, "Fictional Gem", 2));
  dictionary(out, "fictional-junk-stack", () => stackable(out, "Fictional Material", 11));
  dictionary(out, "fictional-consumable-stack", () => stackable(out, "Fictional Potion", 13));
  dictionary(out, "fictional-cosmetic", () => {
    bool(out, false); packed(out, 0); bool(out, false); string(out, "fictional-cosmetic-instance");
    packed(out, 0); string(out, "Fictional Hat"); bool(out, false);
  });
  packed(out, 0); packed(out, 3600); packed(out, 25); packed(out, 3); packed(out, 2);
  list(out, [], () => undefined); // WaypointsUnlocked.
  list(out, [], () => undefined); // NpcsSpokenTo.
  string(out, ""); // WaystoneMapId.
  packed(out, 0); packed(out, 0); // Created, Updated.
  return Buffer.from(out);
}

function dictionary(out: number[], key: string, writeValue: () => void): void {
  list(out, [key], (value) => { string(out, value); writeValue(); });
}
function equipment(out: number[], id: string): void {
  bool(out, false);
  list(out, [], () => undefined); list(out, [], () => undefined);
  packed(out, 0); packed(out, 0); packed(out, 0); string(out, "fictional-equipment-instance");
  packed(out, 0); string(out, id); bool(out, false);
}
function artifact(out: number[], id: string): void {
  bool(out, false);
  list(out, [], () => undefined); packed(out, 0); list(out, [], () => undefined);
  string(out, "fictional-artifact-instance"); packed(out, 0); string(out, id); bool(out, false);
}
function refinable(out: number[], id: string, refine: number): void {
  bool(out, false); string(out, "fictional-refinable-instance"); packed(out, refine); string(out, id); bool(out, false);
}
function stackable(out: number[], id: string, count: number): void {
  bool(out, false); packed(out, count); string(out, id); bool(out, false);
}
function equipSlot(out: number[], slot: number, itemId: string): void {
  bool(out, false); packed(out, slot);
  bool(out, false);
  list(out, [], () => undefined); list(out, [], () => undefined);
  packed(out, 0); packed(out, 0); packed(out, -1);
  string(out, "fictional-loadout-instance"); packed(out, 0); string(out, itemId); bool(out, false);
}
function grimoire(out: number[], id: string | null): void {
  if (id === null) { bool(out, true); return; }
  bool(out, false);
  list(out, [], () => undefined); list(out, [], () => undefined);
  packed(out, 0); packed(out, 0); packed(out, -1);
  string(out, "fictional-grimoire-instance"); packed(out, 0); string(out, id); bool(out, false);
}
function maybeString(out: number[], value: string | null): void {
  if (value === null) { packed(out, -1); return; }
  string(out, value);
}
function bool(out: number[], value: boolean): void { out.push(value ? 1 : 0); }
function string(out: number[], value: string): void { const bytes = Buffer.from(value); packed(out, bytes.length); out.push(...bytes); }
function float(out: number[], value: number): void { const bytes = Buffer.alloc(4); bytes.writeFloatLE(value); out.push(...bytes); }
function list<T>(out: number[], values: T[], write: (value: T) => void): void { packed(out, values.length); for (const value of values) write(value); }
function packed(out: number[], value: number): void {
  let remaining = (BigInt(value) << 1n) ^ (BigInt(value) >> 63n);
  while (remaining >= 0x80n) { out.push(Number((remaining & 0x7fn) | 0x80n)); remaining >>= 7n; }
  out.push(Number(remaining));
}
