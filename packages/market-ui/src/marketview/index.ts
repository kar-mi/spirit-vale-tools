import { Electroview } from "electrobun/view";

import type {
  MarketUiFilter,
  MarketUiListing,
  MarketUiRpc,
  MarketUiState,
  MarketUiStat,
} from "../app-types.ts";

interface DraftFilter {
  enabled: boolean;
  min: string;
  max: string;
}

const STATUS_TONE: Record<MarketUiState["status"], string> = {
  waiting: "is-warn",
  watching: "is-ok",
  ready: "is-ok",
  stopped: "is-warn",
  error: "is-err",
};

const numberFormat = new Intl.NumberFormat();
let state: MarketUiState | undefined;
let queryTimer: ReturnType<typeof setTimeout> | undefined;
let draftFilters = new Map<number, DraftFilter>();

const rpc = Electroview.defineRPC<MarketUiRpc>({
  handlers: {
    requests: {},
    messages: { stateChanged: render },
  },
});
const electroview = new Electroview({ rpc });

const marketQuery = input("market-query");
const filterButton = button("filter-button");
const filterCount = element("filter-count");
const statusDot = element("status-dot");
const statusText = element("status-text");
const resultCount = element("result-count");
const results = element("results");
const loadMoreButton = button("load-more-button");
const filterDialog = element("filter-dialog") as HTMLDialogElement;
const filterForm = form("filter-form");
const statQuery = input("stat-query");
const statList = element("stat-list");
const filterError = element("filter-error");

filterButton.addEventListener("click", openFilters);
button("filter-close-button").addEventListener("click", closeFilters);
button("cancel-filters-button").addEventListener("click", closeFilters);
button("clear-filters-button").addEventListener("click", () => {
  draftFilters.clear();
  filterError.textContent = "";
  renderStatOptions();
});
filterDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeFilters();
});
filterDialog.addEventListener("click", (event) => {
  if (event.target === filterDialog) closeFilters();
});
filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const filters = appliedFilters();
  if (!filters) return;
  void electroview.rpc?.request.setFilters({ filters }).then((next) => {
    render(next);
    filterDialog.close();
  });
});
statQuery.addEventListener("input", renderStatOptions);
marketQuery.addEventListener("input", () => {
  if (queryTimer) clearTimeout(queryTimer);
  queryTimer = setTimeout(() => {
    void electroview.rpc?.request.setQuery({ query: marketQuery.value }).then(render);
  }, 150);
});
loadMoreButton.addEventListener("click", () => void electroview.rpc?.request.loadMore({}).then(render));

void electroview.rpc?.request.getState({}).then(render);

function render(next: MarketUiState): void {
  state = next;
  if (document.activeElement !== marketQuery) marketQuery.value = next.query;
  statusDot.className = `status-dot ${STATUS_TONE[next.status]}`;
  statusText.textContent = next.statusDetail;
  resultCount.textContent = `${numberFormat.format(next.matchCount)} ${next.matchCount === 1 ? "result" : "results"}`;
  filterCount.textContent = String(next.filters.length);
  filterCount.hidden = next.filters.length === 0;
  filterButton.classList.toggle("active", next.filters.length > 0);
  loadMoreButton.hidden = !next.hasMore;
  renderListings(next);
}

function renderListings(next: MarketUiState): void {
  if (next.listings.length === 0) {
    const message = next.status === "waiting"
      ? "No active market session. Start the passive market command, then open the in-game market."
      : next.capturedCount === 0
        ? "Waiting for market listings from the current session."
        : "No captured listings match this search and filter set.";
    results.replaceChildren(text("div", "empty-state", message));
    return;
  }
  results.replaceChildren(...next.listings.map(listingCard));
}

function listingCard(listing: MarketUiListing): HTMLElement {
  const card = document.createElement("article");
  card.className = "list-row listing";
  const metadata = [listing.seller, listing.shopName, listing.mapId].filter(Boolean).join(" · ");
  card.append(
    text("strong", "row-title", listing.name),
    text("strong", "listing-price", formatPrice(listing.price)),
    text("span", "row-meta", metadata || listing.itemId || "Market listing"),
    text("span", "row-meta listing-quantity", `${numberFormat.format(listing.available)} available`),
  );
  if (listing.stats.length > 0) {
    const chips = document.createElement("div");
    chips.className = "chips";
    chips.replaceChildren(...listing.stats.map((stat) => text("span", "chip", formatStat(stat))));
    card.append(chips);
  }
  return card;
}

function openFilters(): void {
  if (!state) return;
  draftFilters = new Map(state.filters.map((filter) => [filter.stat, {
    enabled: true,
    min: filter.minValue === undefined ? "" : String(filter.minValue),
    max: filter.maxValue === undefined ? "" : String(filter.maxValue),
  }]));
  statQuery.value = "";
  filterError.textContent = "";
  renderStatOptions();
  filterDialog.showModal();
  statQuery.focus();
}

function closeFilters(): void {
  filterDialog.close();
}

function renderStatOptions(): void {
  if (!state) return;
  const needle = normalize(statQuery.value);
  const options = state.statOptions.filter((option) => normalize(option.name).includes(needle));
  statList.replaceChildren(...options.map((option) => statRow(option.type, option.name)));
}

function statRow(type: number, name: string): HTMLElement {
  const draft = draftFilters.get(type) ?? { enabled: false, min: "", max: "" };
  const row = document.createElement("div");
  row.className = "stat-row";
  const label = document.createElement("label");
  label.className = "stat-toggle";
  const enabled = document.createElement("input");
  enabled.type = "checkbox";
  enabled.checked = draft.enabled;
  label.append(enabled, text("span", "", humanizeStat(name)));
  const minimum = rangeInput("Minimum", draft.min, !draft.enabled);
  const maximum = rangeInput("Maximum", draft.max, !draft.enabled);

  enabled.addEventListener("change", () => {
    const next = { ...draft, enabled: enabled.checked };
    draftFilters.set(type, next);
    minimum.disabled = !next.enabled;
    maximum.disabled = !next.enabled;
  });
  minimum.addEventListener("input", () => {
    const current = draftFilters.get(type) ?? draft;
    draftFilters.set(type, { ...current, min: minimum.value });
  });
  maximum.addEventListener("input", () => {
    const current = draftFilters.get(type) ?? draft;
    draftFilters.set(type, { ...current, max: maximum.value });
  });
  row.append(label, minimum, maximum);
  return row;
}

function appliedFilters(): MarketUiFilter[] | undefined {
  const result: MarketUiFilter[] = [];
  for (const [stat, draft] of draftFilters) {
    if (!draft.enabled) continue;
    const minValue = numericBound(draft.min);
    const maxValue = numericBound(draft.max);
    if (minValue === null || maxValue === null) {
      filterError.textContent = "Minimum and maximum values must be finite numbers.";
      return undefined;
    }
    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
      filterError.textContent = `${statName(stat)} has a minimum greater than its maximum.`;
      return undefined;
    }
    result.push({ stat, ...(minValue === undefined ? {} : { minValue }), ...(maxValue === undefined ? {} : { maxValue }) });
  }
  filterError.textContent = "";
  return result.sort((left, right) => left.stat - right.stat);
}

function statName(type: number): string {
  return humanizeStat(state?.statOptions.find((option) => option.type === type)?.name ?? `Stat ${type}`);
}

function rangeInput(label: string, value: string, disabled: boolean): HTMLInputElement {
  const control = document.createElement("input");
  control.className = "input range-input";
  control.type = "number";
  control.step = "any";
  control.placeholder = label;
  control.setAttribute("aria-label", label);
  control.value = value;
  control.disabled = disabled;
  return control;
}

function numericBound(value: string): number | undefined | null {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatPrice(value: string): string {
  try {
    return numberFormat.format(BigInt(value));
  } catch {
    return value;
  }
}

function formatStat(stat: MarketUiStat): string {
  const value = stat.value === undefined ? `roll ${numberFormat.format(stat.roll)}` : `${numberFormat.format(stat.value)}${stat.percent ? "%" : ""}`;
  return `${humanizeStat(stat.name)} ${value}`;
}

function humanizeStat(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/\bHp\b/g, "HP")
    .replace(/\bMp\b/g, "MP");
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/[\s_-]+/g, "");
}

function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = value;
  return node;
}

function element(id: string): HTMLElement {
  const value = document.getElementById(id);
  if (!value) throw new Error(`Missing #${id}`);
  return value;
}

function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function input(id: string): HTMLInputElement { return element(id) as HTMLInputElement; }
function form(id: string): HTMLFormElement { return element(id) as HTMLFormElement; }
