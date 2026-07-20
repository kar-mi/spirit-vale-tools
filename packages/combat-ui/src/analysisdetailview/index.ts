import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";

import type { FishNetDpsTimelinePoint } from "@spiritvale/combat";
import type { CombatAnalysisDetailRpc, CombatAnalysisDetailState } from "../app-types.ts";

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const percentFormat = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });
let state: CombatAnalysisDetailState | undefined;
let metric: "cumulative" | "dps" = "cumulative";

const rpc = Electroview.defineRPC<CombatAnalysisDetailRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });
button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
button("cumulative-button").addEventListener("click", () => { metric = "cumulative"; if (state) render(state); });
button("dps-button").addEventListener("click", () => { metric = "dps"; if (state) render(state); });
initWindowChrome({
  titlebar: element("titlebar"), minWidth: 620, minHeight: 500,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 880, height: 720 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
});
void electroview.rpc?.request.getState({}).then(render);

function render(next: CombatAnalysisDetailState): void {
  state = next;
  element("player-name").textContent = next.player.displayName;
  element("encounter-label").textContent = `${next.fileName} · ${next.encounterLabel}`;
  renderMetrics(next);
  renderSkills(next);
  renderChart(next.player.timeline, next.encounterDurationMs);
  button("cumulative-button").classList.toggle("active", metric === "cumulative");
  button("dps-button").classList.toggle("active", metric === "dps");
  element("chart-caption").textContent = metric === "cumulative" ? "Cumulative damage across the encounter." : "Damage per second in five-second buckets.";
}

function renderMetrics(next: CombatAnalysisDetailState): void {
  const player = next.player;
  const values: [string, string][] = [
    ["Damage", compactFormat.format(player.damage)], ["DPS", numberFormat.format(player.dps)],
    ["Hits", numberFormat.format(player.hits)], ["Kills", numberFormat.format(player.kills)],
    ["Crit hits", numberFormat.format(player.criticalHits)], ["Crit rate", player.hits === 0 ? "—" : percentFormat.format(player.criticalHits / player.hits)],
  ];
  element("metrics").replaceChildren(...values.map(([label, value]) => {
    const metricNode = document.createElement("article");
    metricNode.className = "stat-tile";
    const labelNode = document.createElement("span");
    labelNode.textContent = label;
    const valueNode = document.createElement("strong");
    valueNode.textContent = value;
    metricNode.append(labelNode, valueNode);
    return metricNode;
  }));
}

function renderSkills(next: CombatAnalysisDetailState): void {
  element("skill-list").replaceChildren(...next.player.skills.map((skill) => {
    const row = document.createElement("article");
    row.className = "list-row";
    const head = document.createElement("div");
    head.className = "row-head";
    const identity = document.createElement("div");
    identity.append(text("h3", "row-title", skill.sourceLabel), text("span", "row-meta", `${numberFormat.format(skill.hits)} hits`));
    const values = document.createElement("div");
    values.className = "row-values";
    values.append(text("span", "", compactFormat.format(skill.damage)), text("span", "", `${numberFormat.format(skill.dps)} DPS`));
    head.append(identity, values);
    const chips = document.createElement("div");
    chips.className = "chips";
    chips.append(
      text("span", "chip", `${numberFormat.format(skill.hits)} hits`),
      text("span", "chip", `${numberFormat.format(skill.criticalHits)} crit hits`),
      text("span", "chip", `Crit rate ${skill.hits === 0 ? "—" : percentFormat.format(skill.criticalHits / skill.hits)}`),
    );
    row.append(head, chips);
    return row;
  }));
}

function renderChart(points: readonly FishNetDpsTimelinePoint[], durationMs: number): void {
  const chart = element("chart") as unknown as SVGSVGElement;
  chart.replaceChildren();
  const width = 760; const height = 280; const left = 52; const top = 18; const right = 18; const bottom = 34;
  const maxValue = Math.max(1, ...points.map((point) => metric === "cumulative" ? point.cumulativeDamage : point.dps));
  const duration = Math.max(1, durationMs);
  const ns = "http://www.w3.org/2000/svg";
  const line = document.createElementNS(ns, "polyline");
  line.setAttribute("class", "chart-line");
  line.setAttribute("points", points.map((point) => {
    const x = left + (point.elapsedMs / duration) * (width - left - right);
    const value = metric === "cumulative" ? point.cumulativeDamage : point.dps;
    const y = top + (1 - value / maxValue) * (height - top - bottom);
    return `${x},${y}`;
  }).join(" "));
  const baseline = document.createElementNS(ns, "line");
  baseline.setAttribute("class", "chart-axis"); baseline.setAttribute("x1", String(left)); baseline.setAttribute("x2", String(width - right)); baseline.setAttribute("y1", String(height - bottom)); baseline.setAttribute("y2", String(height - bottom));
  const maximum = document.createElementNS(ns, "text");
  maximum.setAttribute("class", "chart-label"); maximum.setAttribute("x", "0"); maximum.setAttribute("y", String(top + 4)); maximum.textContent = compactFormat.format(maxValue);
  const start = document.createElementNS(ns, "text"); start.setAttribute("class", "chart-label"); start.setAttribute("x", String(left)); start.setAttribute("y", String(height - 8)); start.textContent = "0:00";
  const end = document.createElementNS(ns, "text"); end.setAttribute("class", "chart-label"); end.setAttribute("text-anchor", "end"); end.setAttribute("x", String(width - right)); end.setAttribute("y", String(height - 8)); end.textContent = formatDuration(durationMs);
  chart.append(baseline, line, maximum, start, end);
}

function formatDuration(milliseconds: number): string { const seconds = Math.round(milliseconds / 1_000); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }
function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.className = className; node.textContent = value; return node; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
