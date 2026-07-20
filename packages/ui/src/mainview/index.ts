import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";

import type { DpsAppRpc, DpsAppState, DpsAppTab } from "../app-types.ts";
import type { FishNetDpsActorRow, FishNetDpsSkillRow } from "@spiritvale/combat";

const STATUS_TONE: Record<DpsAppState["status"], string> = {
  waiting: "is-warn",
  capturing: "is-ok",
  loading: "is-warn",
  ready: "is-ok",
  stopped: "is-warn",
  error: "is-err",
};

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
let state: DpsAppState | undefined;

const rpc = Electroview.defineRPC<DpsAppRpc>({
  handlers: {
    requests: {},
    messages: { stateChanged: render },
  },
});
const electroview = new Electroview({ rpc });

const allList = element("all-list");
const personalList = element("personal-list");
const allPanel = element("all-panel");
const personalPanel = element("personal-panel");
const allTab = button("all-tab");
const personalTab = button("personal-tab");
const openReplayButton = button("open-replay-button");
const resetButton = button("reset-button");
const pinButton = button("pin-button");
const statusDot = element("status-dot");
const statusText = element("status-text");
const partyDps = element("party-dps");
const totalDamage = element("total-damage");
const encounterDuration = element("encounter-duration");
const totalKills = element("total-kills");
const personalForm = form("personal-form");
const personalName = input("personal-name");
const personalActor = select("personal-actor");
const personalHint = element("personal-hint");

button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
button("settings-button").addEventListener("click", () => void electroview.rpc?.request.openSettings({}));
pinButton.addEventListener("click", () => state && void electroview.rpc?.request.setPinned({ pinned: !state.pinned }));
openReplayButton.addEventListener("click", () => void electroview.rpc?.request.openReplayPicker({}));
resetButton.addEventListener("click", () => void electroview.rpc?.request.resetEncounter({}));
allTab.addEventListener("click", () => setTab("all"));
personalTab.addEventListener("click", () => setTab("personal"));
personalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  void electroview.rpc?.request.setPersonalName({ name: personalName.value });
  personalName.blur();
});
personalActor.addEventListener("change", () => {
  const value = personalActor.value;
  void electroview.rpc?.request.setPersonalActor({ actorId: value === "auto" ? null : Number(value) });
});

initWindowChrome({
  titlebar: element("titlebar"),
  minWidth: 320,
  minHeight: 360,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 320, height: 360 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
});

void electroview.rpc?.request.getState({}).then(render);

function render(next: DpsAppState): void {
  state = next;
  resetButton.disabled = !next.snapshot;
  pinButton.classList.toggle("active", next.pinned);
  pinButton.textContent = next.pinned ? "◆" : "◇";
  applyOpacity(next.opacity);
  statusDot.className = `status-dot ${STATUS_TONE[next.status]}`;
  statusText.textContent = next.statusDetail;
  const storageWarning = element("storage-warning");
  storageWarning.hidden = next.storageWarning === undefined;
  storageWarning.textContent = next.storageWarning ?? "";
  partyDps.textContent = formatDps(next.snapshot?.partyDps ?? 0);
  totalDamage.textContent = compactFormat.format(next.snapshot?.totalDamage ?? 0);
  encounterDuration.textContent = next.snapshot ? formatDuration(next.snapshot.durationMs) : "—";
  totalKills.textContent = numberFormat.format(next.snapshot?.actors.reduce((total, actor) => total + actor.kills, 0) ?? 0);
  renderTab(next.tab);
  renderAll(next);
  renderPersonal(next);
}

function applyOpacity(opacity: number): void {
  document.documentElement.style.setProperty("--dps-window-opacity", String(opacity));
}

function renderTab(tab: DpsAppTab): void {
  const allActive = tab === "all";
  allTab.classList.toggle("active", allActive);
  personalTab.classList.toggle("active", !allActive);
  allTab.setAttribute("aria-selected", String(allActive));
  personalTab.setAttribute("aria-selected", String(!allActive));
  allPanel.hidden = !allActive;
  personalPanel.hidden = allActive;
}

function renderAll(next: DpsAppState): void {
  const actors = next.snapshot?.actors ?? [];
  if (actors.length === 0) {
    allList.replaceChildren(emptyState("Player damage will appear when combat begins and identities are visible."));
    return;
  }
  const maximum = actors[0]?.damage ?? 1;
  allList.replaceChildren(...actors.map((actor) => meterRow(actor.displayName, actor, actor.damage / maximum)));
}

function renderPersonal(next: DpsAppState): void {
  if (document.activeElement !== personalName) personalName.value = next.personalName;
  renderPersonalActors(next);
  const match = next.snapshot?.personalMatch ?? (next.personalName ? "missing" : "unconfigured");
  personalHint.textContent = match === "unconfigured"
    ? "Save your exact in-game display name to match personal damage."
    : match === "missing"
      ? "Waiting for a matching visible player identity."
      : match === "ambiguous"
        ? "More than one visible player matches this name."
        : "Matched to the current encounter.";
  const skills = next.snapshot?.personal?.skills ?? [];
  if (skills.length === 0) {
    personalList.replaceChildren(emptyState(match === "matched" ? "No personal skill damage yet." : "Personal skills appear after your character is matched."));
    return;
  }
  const maximum = skills[0]?.damage ?? 1;
  personalList.replaceChildren(...skills.map((skill) => meterRow(skill.sourceLabel, skill, skill.damage / maximum)));
}

function renderPersonalActors(next: DpsAppState): void {
  const options: HTMLOptionElement[] = [];
  const automatic = document.createElement("option");
  automatic.value = "auto";
  automatic.textContent = "Automatic (name or local actions)";
  automatic.selected = next.personalActorId === undefined;
  options.push(automatic);
  for (const actor of next.snapshot?.actors ?? []) {
    for (const actorId of actor.actorIds) {
      const option = document.createElement("option");
      option.value = String(actorId);
      option.textContent = `${actor.displayName} · ${compactFormat.format(actor.damage)} damage`;
      option.selected = actorId === next.personalActorId;
      options.push(option);
    }
  }
  personalActor.replaceChildren(...options);
}

function meterRow(name: string, row: FishNetDpsActorRow | FishNetDpsSkillRow, width: number): HTMLElement {
  const container = document.createElement("article");
  container.className = "meter-row";
  const bar = document.createElement("div");
  bar.className = "meter-bar";
  bar.style.width = `${Math.max(0, Math.min(100, width * 100))}%`;
  const content = document.createElement("div");
  content.className = "meter-content";
  const details = [
    text("span", "meter-name", name),
    text("strong", "meter-value", `${formatDps(row.dps)} DPS`),
    text("span", "meter-detail", `${compactFormat.format(row.damage)} damage · ${numberFormat.format(row.hits)} hits`),
    text("span", "meter-detail meter-percent", `${Math.round(row.contribution * 100)}%`),
  ];
  if ("kills" in row) details.push(text("span", "meter-detail meter-kills", `Kills: ${numberFormat.format(row.kills)}`));
  content.append(...details);
  container.append(bar, content);
  return container;
}

function emptyState(message: string): HTMLElement {
  return text("div", "empty-state", message);
}

function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = value;
  return node;
}

function setTab(tab: DpsAppTab): void {
  renderTab(tab);
  void electroview.rpc?.request.setTab({ tab });
}

function formatDps(value: number): string {
  return value >= 10_000 ? compactFormat.format(value) : numberFormat.format(value);
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function element(id: string): HTMLElement {
  const value = document.getElementById(id);
  if (!value) throw new Error(`Missing #${id}`);
  return value;
}

function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function input(id: string): HTMLInputElement { return element(id) as HTMLInputElement; }
function select(id: string): HTMLSelectElement { return element(id) as HTMLSelectElement; }
function form(id: string): HTMLFormElement { return element(id) as HTMLFormElement; }
