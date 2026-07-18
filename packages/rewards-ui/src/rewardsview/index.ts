import { Electroview } from "electrobun/view";
import type { RewardsAppRpc, RewardsAppState, RewardsAppView, RewardsUiDrop } from "../app-types.ts";

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
let state: RewardsAppState | undefined;
const rpc = Electroview.defineRPC<RewardsAppRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });

const catalogTab = button("catalog-tab");
const sessionTab = button("session-tab");
const liveMode = button("live-mode");
const replayMode = button("replay-mode");
const openReplay = button("open-replay");
const pin = button("pin-button");
const query = input("catalog-query");

catalogTab.addEventListener("click", () => setView("catalog"));
sessionTab.addEventListener("click", () => setView("session"));
liveMode.addEventListener("click", () => void electroview.rpc?.request.setMode({ mode: "live" }));
replayMode.addEventListener("click", () => void electroview.rpc?.request.setMode({ mode: "replay" }));
openReplay.addEventListener("click", () => void electroview.rpc?.request.chooseReplay({}));
pin.addEventListener("click", () => state && void electroview.rpc?.request.setPinned({ pinned: !state.pinned }));
button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
query.addEventListener("input", () => void electroview.rpc?.request.setQuery({ query: query.value }));
void electroview.rpc?.request.getState({}).then(render);

function render(next: RewardsAppState): void {
  state = next;
  catalogTab.classList.toggle("active", next.view === "catalog");
  sessionTab.classList.toggle("active", next.view === "session");
  liveMode.classList.toggle("active", next.mode === "live");
  replayMode.classList.toggle("active", next.mode === "replay");
  openReplay.hidden = next.mode !== "replay";
  pin.textContent = next.pinned ? "◆" : "◇";
  element("status-text").textContent = next.statusDetail;
  element("status-dot").className = `status-dot ${next.status}`;
  element("catalog-panel").hidden = next.view !== "catalog";
  element("session-panel").hidden = next.view !== "session";
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
  )) : [empty("Confirmed mob totals will appear here.")]));
  const kills = element("kill-list");
  kills.replaceChildren(...(next.kills.length ? next.kills.map((kill) => row(
    kill.displayName,
    `Level ${kill.level} · tick ${kill.tick}`,
    [`+${format.format(kill.experience)} XP`, `+${format.format(kill.jobExperience)} job XP`, `+${formatDecimal(kill.coins)} coins`],
    kill.drops,
  )) : [empty(next.mode === "replay" ? "Open a rewards log to replay it." : "Waiting for a confirmed mob reward.")]));
}

function row(title: string, meta: string, rewards: string[], drops: RewardsUiDrop[]): HTMLElement {
  const article = document.createElement("article"); article.className = "row";
  const head = document.createElement("div"); head.className = "row-head";
  const identity = document.createElement("div"); identity.append(text("h3", "", title), text("div", "meta", meta));
  const values = document.createElement("div"); values.className = "rewards"; values.append(...rewards.map((value) => text("span", "", value)));
  head.append(identity, values); article.append(head);
  if (drops.length) {
    const dropList = document.createElement("div"); dropList.className = "drops";
    dropList.append(...drops.map((drop) => text("span", "drop", `${drop.itemName} ×${drop.count}${drop.chance === undefined ? "" : ` · ${formatChance(drop.chance)}`}`)));
    article.append(dropList);
  }
  return article;
}

function setView(view: RewardsAppView): void { void electroview.rpc?.request.setView({ view }); }
function formatDecimal(value: string): string { try { return format.format(BigInt(value)); } catch { return value; } }
function formatChance(value: number): string {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(value)}%`;
}
function empty(message: string): HTMLElement { return text("div", "empty", message); }
function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.className = className; node.textContent = value; return node; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function input(id: string): HTMLInputElement { return element(id) as HTMLInputElement; }
