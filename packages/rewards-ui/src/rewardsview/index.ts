import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";
import type { RewardsAppRpc, RewardsAppState, RewardsAppView, RewardsUiDrop } from "../app-types.ts";

const STATUS_TONE: Record<RewardsAppState["status"], string> = {
  waiting: "is-warn",
  watching: "is-ok",
  ready: "is-ok",
  stopped: "is-warn",
  error: "is-err",
};

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
let state: RewardsAppState | undefined;
const rpc = Electroview.defineRPC<RewardsAppRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });

const summaryTab = button("summary-tab");
const recentTab = button("recent-tab");
const catalogButton = button("catalog-button");
const replayButton = button("replay-button");
const openReplay = button("open-replay");
const pin = button("pin-button");
const query = input("catalog-query");

summaryTab.addEventListener("click", () => setView("summary"));
recentTab.addEventListener("click", () => setView("recent"));
catalogButton.addEventListener("click", () => openModal("catalog-modal"));
replayButton.addEventListener("click", () => openModal("replay-modal"));
openReplay.addEventListener("click", () => void electroview.rpc?.request.chooseReplay({}).then((next) => {
  render(next);
  if (next.mode === "replay" && next.replayFileName) closeModal("replay-modal");
}));
button("replay-live").addEventListener("click", returnToLive);
button("return-live").addEventListener("click", returnToLive);
pin.addEventListener("click", () => state && void electroview.rpc?.request.setPinned({ pinned: !state.pinned }));
button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));

const maximizeButton = button("maximize-button");
const chrome = initWindowChrome({
  titlebar: element("titlebar"),
  minWidth: 620,
  minHeight: 520,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 620, height: 520 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
  toggleMaximize: async () => (await electroview.rpc?.request.toggleMaximize({}))?.maximized ?? false,
  onMaximizedChange: (maximized) => {
    maximizeButton.textContent = maximized ? "❐" : "▢";
    maximizeButton.title = maximized ? "Restore" : "Maximize";
  },
});
maximizeButton.addEventListener("click", () => void chrome.toggleMaximize());
query.addEventListener("input", () => void electroview.rpc?.request.setQuery({ query: query.value }));
for (const close of document.querySelectorAll<HTMLElement>("[data-close-modal]")) {
  close.addEventListener("click", () => closeModal(close.dataset.closeModal ?? ""));
}
for (const layer of document.querySelectorAll<HTMLElement>(".modal-layer")) {
  layer.addEventListener("click", (event) => { if (event.target === layer) closeModal(layer.id); });
}
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  for (const layer of document.querySelectorAll<HTMLElement>(".modal-layer:not([hidden])")) closeModal(layer.id);
});
void electroview.rpc?.request.getState({}).then(render);

function render(next: RewardsAppState): void {
  state = next;
  summaryTab.classList.toggle("active", next.view === "summary");
  recentTab.classList.toggle("active", next.view === "recent");
  replayButton.classList.toggle("active", next.mode === "replay");
  pin.textContent = next.pinned ? "◆" : "◇";
  pin.classList.toggle("active", next.pinned);
  element("status-text").textContent = next.statusDetail;
  element("status-dot").className = `status-dot ${STATUS_TONE[next.status]}`;
  element("summary-panel").hidden = next.view !== "summary";
  element("recent-panel").hidden = next.view !== "recent";
  const replayBanner = element("replay-banner");
  replayBanner.hidden = next.mode !== "replay";
  element("replay-banner-text").textContent = next.mode === "replay" ? `Viewing replay: ${next.replayFileName ?? "selected log"}` : "";
  element("replay-detail").textContent = next.replayFileName
    ? `Loaded: ${next.replayFileName}${next.replayWarnings > 0 ? ` · ${next.replayWarnings} malformed records skipped` : ""}`
    : "No replay loaded. Choose a rewards JSON Lines log to inspect it.";
  if (document.activeElement !== query) query.value = next.query;
  element("catalog-count").textContent = `${next.catalogCount} mobs`;
  renderCatalog(next);
  element("total-xp").textContent = format.format(next.totalExperience);
  element("total-job-xp").textContent = format.format(next.totalJobExperience);
  element("total-coins").textContent = formatDecimal(next.totalCoins);
  element("unmatched").textContent = format.format(next.unmatched);
  const identityWarning = element("identity-warning");
  identityWarning.hidden = next.unidentified === 0;
  identityWarning.textContent = next.unidentified === 0 ? "" : `${format.format(next.unidentified)} reward ${next.unidentified === 1 ? "event came" : "events came"} from mobs whose spawn happened before capture. Change maps or wait for those mobs to respawn; newly observed mobs will be categorized.`;
  renderSession(next);
}

function renderCatalog(next: RewardsAppState): void {
  const list = element("catalog-list");
  if (next.catalog.length === 0) { list.replaceChildren(empty(next.catalogCount === 0 ? "No catalog data is bundled for this build yet." : "No mobs match this search.")); return; }
  list.replaceChildren(...next.catalog.map((mob) => row(
    mob.displayName,
    `Level ${mob.level}${mob.boss ? " · Boss" : ""} · ${mob.id}`,
    [`${format.format(mob.baseExperience)} base XP`, `${format.format(mob.baseCoins)} base coins`],
    mob.drops,
  )));
}

function renderSession(next: RewardsAppState): void {
  const summaries = element("summary-list");
  summaries.replaceChildren(...(next.summaries.length ? next.summaries.map((mob) => row(
    mob.displayName,
    `Level ${mob.level} · ${mob.kills} ${mob.kills === 1 ? "kill" : "kills"}`,
    [`${format.format(mob.experience)} XP`, `${format.format(mob.jobExperience)} job XP`, `${formatDecimal(mob.coins)} coins`],
    mob.drops,
  )) : [empty(next.mode === "replay" ? "No confirmed mob totals in this replay." : "Confirmed mob totals will appear here.")]));
  const kills = element("kill-list");
  kills.replaceChildren(...(next.kills.length ? next.kills.map((kill) => row(
    kill.displayName,
    `Level ${kill.level} · tick ${kill.tick}`,
    [`+${format.format(kill.experience)} XP`, `+${format.format(kill.jobExperience)} job XP`, `+${formatDecimal(kill.coins)} coins`],
    kill.drops,
  )) : [empty(next.mode === "replay" ? "No confirmed kills in this replay." : "Waiting for a confirmed mob reward.")]));
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

function setView(view: RewardsAppView): void { void electroview.rpc?.request.setView({ view }); }
function returnToLive(): void {
  closeModal("replay-modal");
  void electroview.rpc?.request.setMode({ mode: "live" });
}
function openModal(id: string): void {
  const modal = element(id);
  modal.hidden = false;
  if (id === "catalog-modal") queueMicrotask(() => query.focus());
}
function closeModal(id: string): void {
  if (!id) return;
  element(id).hidden = true;
}
function formatDecimal(value: string): string { try { return format.format(BigInt(value)); } catch { return value; } }
function formatChance(value: number): string {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(value)}%`;
}
function empty(message: string): HTMLElement { return text("div", "empty-state", message); }
function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.className = className; node.textContent = value; return node; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function input(id: string): HTMLInputElement { return element(id) as HTMLInputElement; }
