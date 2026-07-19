import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";
import type { CharacterStatBreakdown, CharacterViewState } from "@spiritvale/character";
import type { CharacterRpc } from "../character-types.ts";

const ATTRIBUTE_NAMES = ["STR", "VIT", "AGI", "DEX", "INT", "LUK"] as const;

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
    details: [substatText(item.substats), item.cards.length ? `Cards: ${item.cards.join(", ")}` : ""].filter(Boolean).join(" · "),
  })));
  renderBuild("artifacts", character.artifacts.map((item) => ({
    slot: item.slot, name: item.itemId, refine: item.refine,
    details: [substatText(item.substats), item.gems.length ? `Gems: ${item.gems.join(", ")}` : ""].filter(Boolean).join(" · "),
  })));
  renderStats(state.stats);
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

function renderStats(stats: CharacterStatBreakdown[]): void {
  const root = element("stat-groups");
  const categories = [...new Set(stats.map((stat) => stat.category))];
  root.replaceChildren(...categories.map((category) => {
    const group = node("section", "stat-group");
    group.append(node("h3", "", category));
    for (const stat of stats.filter((entry) => entry.category === category)) {
      const details = document.createElement("details");
      details.className = "stat-row";
      const summary = document.createElement("summary");
      summary.append(node("span", "stat-label", stat.label), node("span", "stat-value", `${format(stat.value)}${stat.unit ?? ""}`));
      const inputs = Object.entries(stat.inputs).map(([key, value]) => `${key} ${format(value)}`).join(" · ");
      const breakdown = node("div", "breakdown", [node("div", "formula", stat.formula), node("div", "inputs", inputs)]);
      details.append(summary, breakdown);
      group.append(details);
    }
    return group;
  }));
}

function node<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", content?: string | Node[]): HTMLElementTagNameMap[K] {
  const value = document.createElement(tag);
  value.className = className;
  if (typeof content === "string") value.textContent = content;
  else if (content) value.append(...content);
  return value;
}
function format(value: number): string { return new Intl.NumberFormat().format(value); }
function duration(seconds: number): string { const hours = Math.floor(seconds / 3600); const minutes = Math.floor(seconds % 3600 / 60); return `${format(hours)}h ${minutes}m`; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
