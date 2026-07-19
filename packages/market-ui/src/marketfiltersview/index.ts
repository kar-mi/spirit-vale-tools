import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";

import type { MarketFiltersRpc, MarketFiltersState, MarketUiFilter } from "../app-types.ts";

interface DraftFilter { enabled: boolean; min: string; max: string }

let state: MarketFiltersState | undefined;
let draftFilters = new Map<number, DraftFilter>();

const rpc = Electroview.defineRPC<MarketFiltersRpc>({ handlers: { requests: {}, messages: {} } });
const electroview = new Electroview({ rpc });
const form = element("filter-form") as HTMLFormElement;
const statQuery = input("stat-query");
const statList = element("stat-list");
const filterError = element("filter-error");

button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", close);
button("cancel-filters-button").addEventListener("click", close);
button("clear-filters-button").addEventListener("click", () => { draftFilters.clear(); filterError.textContent = ""; renderStatOptions(); });
statQuery.addEventListener("input", renderStatOptions);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const filters = appliedFilters();
  if (!filters) return;
  void electroview.rpc?.request.setFilters({ filters }).then(close);
});

initWindowChrome({
  titlebar: element("titlebar"), minWidth: 520, minHeight: 480,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 640, height: 680 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
});

void electroview.rpc?.request.getState({}).then((next) => {
  state = next;
  draftFilters = new Map(next.filters.map((filter) => [filter.stat, {
    enabled: true,
    min: filter.minValue === undefined ? "" : String(filter.minValue),
    max: filter.maxValue === undefined ? "" : String(filter.maxValue),
  }]));
  renderStatOptions();
  statQuery.focus();
});

function close(): void { void electroview.rpc?.request.windowAction({ action: "close" }); }

function renderStatOptions(): void {
  if (!state) return;
  const needle = normalize(statQuery.value);
  statList.replaceChildren(...state.statOptions.filter((option) => normalize(option.name).includes(needle)).map((option) => statRow(option.type, option.name)));
}

function statRow(type: number, name: string): HTMLElement {
  const draft = draftFilters.get(type) ?? { enabled: false, min: "", max: "" };
  const row = document.createElement("div"); row.className = "stat-row";
  const label = document.createElement("label"); label.className = "stat-toggle";
  const enabled = document.createElement("input"); enabled.type = "checkbox"; enabled.checked = draft.enabled;
  label.append(enabled, text("span", humanizeStat(name)));
  const minimum = rangeInput("Minimum", draft.min, !draft.enabled);
  const maximum = rangeInput("Maximum", draft.max, !draft.enabled);
  enabled.addEventListener("change", () => { const next = { ...draft, enabled: enabled.checked }; draftFilters.set(type, next); minimum.disabled = !next.enabled; maximum.disabled = !next.enabled; });
  minimum.addEventListener("input", () => { const current = draftFilters.get(type) ?? draft; draftFilters.set(type, { ...current, min: minimum.value }); });
  maximum.addEventListener("input", () => { const current = draftFilters.get(type) ?? draft; draftFilters.set(type, { ...current, max: maximum.value }); });
  row.append(label, minimum, maximum);
  return row;
}

function appliedFilters(): MarketUiFilter[] | undefined {
  const result: MarketUiFilter[] = [];
  for (const [stat, draft] of draftFilters) {
    if (!draft.enabled) continue;
    const minValue = numericBound(draft.min); const maxValue = numericBound(draft.max);
    if (minValue === null || maxValue === null) { filterError.textContent = "Minimum and maximum values must be finite numbers."; return undefined; }
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) { filterError.textContent = `${statName(stat)} has a minimum greater than its maximum.`; return undefined; }
    result.push({ stat, ...(minValue === undefined ? {} : { minValue }), ...(maxValue === undefined ? {} : { maxValue }) });
  }
  filterError.textContent = "";
  return result.sort((left, right) => left.stat - right.stat);
}

function statName(type: number): string { return humanizeStat(state?.statOptions.find((option) => option.type === type)?.name ?? `Stat ${type}`); }
function rangeInput(label: string, value: string, disabled: boolean): HTMLInputElement { const control = document.createElement("input"); control.className = "input range-input"; control.type = "number"; control.step = "any"; control.placeholder = label; control.setAttribute("aria-label", label); control.value = value; control.disabled = disabled; return control; }
function numericBound(value: string): number | undefined | null { if (!value.trim()) return undefined; const number = Number(value); return Number.isFinite(number) ? number : null; }
function humanizeStat(value: string): string { return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2").replace(/\bHp\b/g, "HP").replace(/\bMp\b/g, "MP"); }
function normalize(value: string): string { return value.trim().toLocaleLowerCase().replace(/[\s_-]+/g, ""); }
function text<K extends keyof HTMLElementTagNameMap>(tag: K, value: string): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.textContent = value; return node; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function input(id: string): HTMLInputElement { return element(id) as HTMLInputElement; }
