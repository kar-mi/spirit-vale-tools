import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";

import type { CombatAnalysisRpc, CombatAnalysisState } from "../app-types.ts";

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const percentFormat = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });

const rpc = Electroview.defineRPC<CombatAnalysisRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });
const encounterSelect = select("encounter-select");

button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
encounterSelect.addEventListener("change", () => void electroview.rpc?.request.selectEncounter({ id: encounterSelect.value }));

initWindowChrome({
  titlebar: element("titlebar"), minWidth: 680, minHeight: 460,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 920, height: 680 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
});
void electroview.rpc?.request.getState({}).then(render);

function render(state: CombatAnalysisState): void {
  element("file-name").textContent = state.fileName ?? "Combat log";
  element("status").textContent = state.statusDetail;
  const warning = element("warning");
  warning.hidden = state.invalidLines === 0;
  warning.textContent = state.invalidLines === 0 ? "" : `${state.invalidLines} malformed record${state.invalidLines === 1 ? " was" : "s were"} skipped.`;
  encounterSelect.replaceChildren(...state.encounters.map((encounter) => option(encounter.id, encounter.label, encounter.id === state.selectedEncounterId)));
  encounterSelect.disabled = state.status !== "ready" || state.encounters.length < 2;
  const rows = state.snapshot?.actors ?? [];
  const list = element("player-list");
  list.replaceChildren(...rows.map((player) => playerRow(player)));
  element("party-dps").textContent = numberFormat.format(state.snapshot?.partyDps ?? 0);
  element("total-damage").textContent = compactFormat.format(state.snapshot?.totalDamage ?? 0);
  element("duration").textContent = state.snapshot ? formatDuration(state.snapshot.durationMs) : "—";
  element("player-count").textContent = numberFormat.format(rows.length);
  element("empty-state").hidden = state.status !== "ready" || rows.length !== 0;
}

function playerRow(player: NonNullable<CombatAnalysisState["snapshot"]>["actors"][number]): HTMLElement {
  const row = document.createElement("article");
  row.className = "list-row player-row";
  row.tabIndex = 0;
  row.title = "Double-click for player detail";
  const open = () => void electroview.rpc?.request.openPlayerDetails({ actorId: player.actorIds[0]! });
  row.addEventListener("dblclick", open);
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
  });
  const head = document.createElement("div");
  head.className = "row-head";
  const identity = document.createElement("div");
  identity.append(text("h2", "row-title", player.displayName), text("span", "row-meta", `${numberFormat.format(player.hits)} total hits`));
  const values = document.createElement("div");
  values.className = "row-values";
  values.append(text("span", "", compactFormat.format(player.damage)), text("span", "", `${numberFormat.format(player.dps)} DPS`));
  head.append(identity, values);
  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(
    text("span", "chip", `${numberFormat.format(player.hits)} hits`),
    text("span", "chip", `${numberFormat.format(player.kills)} kills`),
    text("span", "chip", `Crit rate ${player.hits === 0 ? "—" : percentFormat.format(player.criticalHits / player.hits)}`),
  );
  row.append(head, chips);
  return row;
}

function option(value: string, label: string, selected: boolean): HTMLOptionElement {
  const node = document.createElement("option"); node.value = value; node.textContent = label; node.selected = selected; return node;
}
function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.className = className; node.textContent = value; return node; }
function formatDuration(milliseconds: number): string { const seconds = Math.round(milliseconds / 1_000); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function select(id: string): HTMLSelectElement { return element(id) as HTMLSelectElement; }
