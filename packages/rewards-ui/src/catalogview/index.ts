import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";
import type { RewardsCatalogRpc, RewardsCatalogState, RewardsUiDrop } from "../app-types.ts";

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const rpc = Electroview.defineRPC<RewardsCatalogRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });
const query = input("catalog-query");

query.addEventListener("input", () => void electroview.rpc?.request.setQuery({ query: query.value }));
button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));

const maximizeButton = button("maximize-button");
const chrome = initWindowChrome({
  titlebar: element("titlebar"),
  minWidth: 520,
  minHeight: 420,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 520, height: 420 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
  toggleMaximize: async () => (await electroview.rpc?.request.toggleMaximize({}))?.maximized ?? false,
  onMaximizedChange: (maximized) => {
    maximizeButton.textContent = maximized ? "❐" : "▢";
    maximizeButton.title = maximized ? "Restore" : "Maximize";
  },
});
maximizeButton.addEventListener("click", () => void chrome.toggleMaximize());
void electroview.rpc?.request.getState({}).then((next) => {
  render(next);
  query.focus();
});

function render(next: RewardsCatalogState): void {
  if (document.activeElement !== query) query.value = next.query;
  element("catalog-count").textContent = `${next.catalogCount} mobs`;
  const list = element("catalog-list");
  if (next.catalog.length === 0) {
    list.replaceChildren(text("div", "empty-state", next.catalogCount === 0 ? "No catalog data is bundled for this build yet." : "No mobs match this search."));
    return;
  }
  list.replaceChildren(...next.catalog.map((mob) => row(
    mob.displayName,
    `Level ${mob.level}${mob.boss ? " · Boss" : ""} · ${mob.id}`,
    [`${format.format(mob.baseExperience)} base XP`, `${format.format(mob.baseCoins)} base coins`],
    mob.drops,
  )));
}

function row(title: string, meta: string, rewards: string[], drops: RewardsUiDrop[]): HTMLElement {
  const article = document.createElement("article"); article.className = "list-row";
  const head = document.createElement("div"); head.className = "row-head";
  const identity = document.createElement("div"); identity.append(text("h3", "row-title", title), text("div", "row-meta", meta));
  const values = document.createElement("div"); values.className = "row-values"; values.append(...rewards.map((value) => text("span", "", value)));
  head.append(identity, values); article.append(head);
  if (drops.length) {
    const dropList = document.createElement("div"); dropList.className = "chips";
    dropList.append(...drops.map((drop) => text("span", "chip", `${drop.itemName} ×${drop.count}${drop.chance === undefined ? "" : ` · ${formatChance(drop.chance)}`}`)));
    article.append(dropList);
  }
  return article;
}

function formatChance(value: number): string {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(value)}%`;
}
function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.className = className; node.textContent = value; return node; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function input(id: string): HTMLInputElement { return element(id) as HTMLInputElement; }
