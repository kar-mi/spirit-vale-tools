import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";
import { resolveFishNetItem } from "@spiritvale/items";
import { PERCENT_STATS, STAT_NAMES, type CharacterStatBreakdown, type CharacterViewState, type GearStatTotal } from "@spiritvale/character";
import type { CharacterRpc } from "../character-types.ts";

const ATTRIBUTE_NAMES = ["STR", "VIT", "AGI", "DEX", "INT", "LUK"] as const;
type Tab = "basic" | "gear" | "advanced";
let activeTab: Tab = "basic";

const rpc = Electroview.defineRPC<CharacterRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });

button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
initWindowChrome({
  titlebar: element("titlebar"), minWidth: 680, minHeight: 520,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 920, height: 720 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
});
void electroview.rpc?.request.getState({}).then(render);
for (const tab of document.querySelectorAll<HTMLButtonElement>(".tab-button")) tab.addEventListener("click", () => setActiveTab(tab.dataset.tab as Tab));

function render(state: CharacterViewState): void {
  const empty = element("empty-state");
  const content = element("character-content");
  empty.hidden = Boolean(state.snapshot);
  content.hidden = !state.snapshot;
  element("source-badge").textContent = state.status === "live" ? "Live" : state.status === "cached" ? "Last known" : "Waiting";
  if (!state.snapshot) return;
  const character = state.snapshot;
  element("character-name").textContent = character.title ? `${character.name} · ${character.title}` : character.name;
  element("character-class").textContent = character.archetypes.length ? character.archetypes.join(" / ") : "Novice";
  element("level").textContent = format(character.level);
  element("job-level").textContent = format(character.jobLevel);
  element("experience").textContent = format(character.experience);
  element("job-experience").textContent = format(character.jobExperience);
  element("status-detail").textContent = state.statusDetail;
  const attributes = element("attributes");
  attributes.replaceChildren(...ATTRIBUTE_NAMES.map((name) => node("div", "attribute", [node("span", "", name), node("strong", "", format(character.attributes[name]))])));
  const history = [
    ["Playtime", character.playtimeSeconds === undefined ? undefined : duration(character.playtimeSeconds)],
    ["Monster kills", character.monsterKills === undefined ? undefined : format(character.monsterKills)],
    ["Boss kills", character.bossKills === undefined ? undefined : format(character.bossKills)],
    ["Deaths", character.deaths === undefined ? undefined : format(character.deaths)],
  ].filter((entry): entry is [string, string] => entry[1] !== undefined);
  element("history-card").hidden = history.length === 0;
  element("history").replaceChildren(...history.map(([label, value]) => node("div", "attribute", [node("span", "", label), node("strong", "", value)])));
  element("loadout-label").textContent = `${character.activeLoadout} loadout · rolled substats shown at their in-game scaled values`;
  renderBuild("equipment", character.equipment.map((item) => ({
    slot: item.slot, name: item.itemId, refine: item.refine,
    details: [itemEffectText(2, item.itemId, item.refine), substatText(item.substats), item.cards.length ? `Cards: ${item.cards.map((card) => `${card}${itemEffectText(4, card, 0, true)}`).join(", ")}` : ""].filter(Boolean).join(" · "),
  })));
  const artifactCounts = new Map<string, number>();
  for (const artifact of character.artifacts) artifactCounts.set(artifact.itemId, (artifactCounts.get(artifact.itemId) ?? 0) + 1);
  renderBuild("artifacts", character.artifacts.map((item) => ({
    slot: item.slot, name: item.itemId, refine: item.refine,
    details: [itemEffectText(3, item.itemId, item.refine, false, artifactCounts.get(item.itemId) ?? 0), substatText(item.substats), item.gems.length ? `Gems: ${item.gems.map((gem) => `${gem}${itemEffectText(5, gem, 0, true)}`).join(", ")}` : ""].filter(Boolean).join(" · "),
  })));
  renderStats("basic-stat-groups", state.stats, "basic");
  renderStats("advanced-stat-groups", state.stats, "advanced");
  renderGearTotals(state.gearTotals);
  renderSkills(character.skills);
  setActiveTab(activeTab);
}

function renderSkills(skills: Array<{ displayName: string; level: number; effects: Array<{ label: string; value: number; percent: boolean }> }>): void {
  const root = element("skills");
  if (!skills.length) { root.replaceChildren(node("div", "build-empty", "No learned skills captured.")); return; }
  root.replaceChildren(...skills.map((skill) => node("div", "gear-total", [node("span", "", skill.displayName), node("strong", "", `Lv ${format(skill.level)}${skill.effects.length ? ` → ${skill.effects.map((effect) => `${signed(effect.value)}${effect.percent ? "%" : ""} ${effect.label}`).join(", ")}` : ""}`)])));
}

function renderBuild(id: string, items: Array<{ slot: string; name: string; refine: number; details: string }>): void {
  const root = element(id);
  if (!items.length) { root.replaceChildren(node("div", "build-empty", "No items captured in this loadout.")); return; }
  root.replaceChildren(...items.map((item) => node("div", "build-item", [
    node("div", "build-item-head", [node("span", "", item.slot), node("strong", "", `${item.name}${item.refine ? ` +${item.refine}` : ""}`)]),
    node("div", "build-detail", item.details || "No rolled substats"),
  ])));
}

function substatText(stats: Array<{ name: string; value?: number; roll: number; percent: boolean }>): string {
  return stats.map((stat) => stat.value === undefined ? `${stat.name} (roll ${stat.roll})` : `${stat.name} ${stat.value}${stat.percent ? "%" : ""}`).join(" · ");
}

function itemEffectText(itemType: number, itemId: string, refine: number, compact = false, pieces?: number): string {
  const definition = resolveFishNetItem(itemType, itemId);
  if (!definition) return "";
  const show = (effects: readonly { type: number; value: number }[]) => effects.map((effect) => `${statName(effect.type)} ${signed(effect.value, isPercent(effect.type) ? "%" : undefined)}`).join(", ");
  const parts = [show(definition.effects ?? [])];
  if (refine && definition.refineEffects?.length) parts.push(`Refine ${show(definition.refineEffects.map((effect) => ({ ...effect, value: effect.value * refine })))}`);
  if (definition.artifactSet && pieces !== undefined) {
    const set = definition.artifactSet;
    const perPiece = show(set.perPiece.map((effect) => ({ ...effect, value: effect.value * pieces })));
    if (perPiece) parts.push(`${pieces}/${set.requiredPieces} set: ${perPiece}`);
    if (pieces >= set.requiredPieces) { const full = show(set.fullSet); if (full) parts.push(`Full set: ${full}`); }
  }
  const value = parts.filter(Boolean).join(" · ");
  return value ? compact ? ` (${value})` : `Base: ${value}` : "";
}
function statName(type: number): string { return STAT_NAMES[type] ?? `Stat ${type}`; }
function isPercent(type: number): boolean { return PERCENT_STATS.has(type); }

function renderGearTotals(totals: GearStatTotal[]): void {
  const root = element("gear-totals");
  if (!totals.length) { root.replaceChildren(node("div", "build-empty", "No rolled substats captured in this loadout.")); return; }
  root.replaceChildren(...totals.map((stat) => node("div", "gear-total", [node("span", "", stat.name), node("strong", "", `${signed(stat.total)}${stat.percent ? "%" : ""}${stat.unresolvedRolls ? ` · roll ${stat.unresolvedRolls}` : ""}`)])));
}

function renderStats(id: string, stats: CharacterStatBreakdown[], tab: CharacterStatBreakdown["tab"]): void {
  const root = element(id);
  const displayed = stats.filter((stat) => stat.tab === tab);
  if (!displayed.length) { root.replaceChildren(node("div", "build-empty", tab === "advanced" ? "No additional gear-granted stats in this loadout." : "No calculated stats available.")); return; }
  const categories = [...new Set(displayed.map((stat) => stat.category))];
  root.replaceChildren(...categories.map((category) => {
    const group = node("section", "stat-group");
    group.append(node("h3", "", category));
    group.append(node("div", "stat-column-headings", [node("span", "", ""), node("span", "", "Base"), node("span", "", "Gear"), node("span", "", "Total")]));
    for (const stat of displayed.filter((entry) => entry.category === category)) {
      const details = document.createElement("details");
      details.className = "stat-row";
      const summary = document.createElement("summary");
      summary.append(node("span", "stat-label", stat.label), node("span", "stat-value", valueText(stat.base, stat.unit)), node("span", `stat-value gear-value${stat.gear ? " nonzero" : ""}`, signed(stat.gear, stat.unit)), node("span", "stat-value", valueText(stat.value, stat.unit)));
      const inputs = Object.entries(stat.inputs).map(([key, value]) => `${key} ${format(value)}`).join(" · ");
      const breakdown = node("div", "breakdown", [node("div", "formula", stat.formula), node("div", "inputs", inputs)]);
      details.append(summary, breakdown);
      group.append(details);
    }
    return group;
  }));
}

function setActiveTab(tab: Tab): void {
  activeTab = tab;
  for (const panel of document.querySelectorAll<HTMLElement>(".tab-panel")) panel.hidden = panel.id !== `${tab}-panel`;
  for (const button of document.querySelectorAll<HTMLButtonElement>(".tab-button")) { const selected = button.dataset.tab === tab; button.classList.toggle("active", selected); button.setAttribute("aria-selected", String(selected)); }
}

function node<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", content?: string | Node[]): HTMLElementTagNameMap[K] {
  const value = document.createElement(tag);
  value.className = className;
  if (typeof content === "string") value.textContent = content;
  else if (content) value.append(...content);
  return value;
}
function format(value: number): string { return new Intl.NumberFormat().format(value); }
function valueText(value: number, unit?: "%"): string { return `${format(value)}${unit ?? ""}`; }
function signed(value: number, unit?: "%"): string { return `${value > 0 ? "+" : ""}${valueText(value, unit)}`; }
function duration(seconds: number): string { const hours = Math.floor(seconds / 3600); const minutes = Math.floor(seconds % 3600 / 60); return `${format(hours)}h ${minutes}m`; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
