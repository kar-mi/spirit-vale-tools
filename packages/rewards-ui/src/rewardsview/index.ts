import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";
import type { RewardsAppRpc, RewardsAppState, RewardsAppView, RewardsUiDrop } from "../app-types.ts";
import {
  bigintRatio,
  buildCumulativeTrend,
  buildRateTrend,
  trendExtent,
} from "./trend-model.ts";
import type { TrendMetric, TrendMode, TrendRange } from "./trend-model.ts";

const STATUS_TONE: Record<RewardsAppState["status"], string> = {
  waiting: "is-warn",
  watching: "is-ok",
  ready: "is-ok",
  stopped: "is-warn",
  error: "is-err",
};

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
let state: RewardsAppState | undefined;
let trendMetric: TrendMetric = "experience";
let trendMode: TrendMode = "rate";
let trendZoom: TrendRange | undefined;
let trendSessionKey = "";
let renderedTrend: RenderedTrend | undefined;
let dragStart: number | undefined;
let keyboardPoint = -1;
const rpc = Electroview.defineRPC<RewardsAppRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });

const summaryTab = button("summary-tab");
const recentTab = button("recent-tab");
const trendsTab = button("trends-tab");
const catalogButton = button("catalog-button");
const replayButton = button("replay-button");
const pin = button("pin-button");

summaryTab.addEventListener("click", () => setView("summary"));
recentTab.addEventListener("click", () => setView("recent"));
trendsTab.addEventListener("click", () => setView("trends"));
catalogButton.addEventListener("click", () => void electroview.rpc?.request.openCatalog({}));
replayButton.addEventListener("click", () => void electroview.rpc?.request.openReplayPicker({}));
button("return-live").addEventListener("click", returnToLive);
pin.addEventListener("click", () => state && void electroview.rpc?.request.setPinned({ pinned: !state.pinned }));
button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
button("trend-xp").addEventListener("click", () => setTrendMetric("experience"));
button("trend-job-xp").addEventListener("click", () => setTrendMetric("jobExperience"));
button("trend-coins").addEventListener("click", () => setTrendMetric("coins"));
button("trend-rate").addEventListener("click", () => setTrendMode("rate"));
button("trend-cumulative").addEventListener("click", () => setTrendMode("cumulative"));
button("trend-reset").addEventListener("click", () => { trendZoom = undefined; renderTrend(); });

const trendChart = element("trend-chart");
trendChart.addEventListener("pointerdown", trendPointerDown);
trendChart.addEventListener("pointermove", trendPointerMove);
trendChart.addEventListener("pointerup", trendPointerUp);
trendChart.addEventListener("pointercancel", cancelTrendDrag);
trendChart.addEventListener("pointerleave", () => { if (dragStart === undefined) hideTrendHover(); });
trendChart.addEventListener("keydown", trendKeyDown);
new ResizeObserver(() => { if (state?.view === "trends") renderTrend(); }).observe(trendChart);

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
void electroview.rpc?.request.getState({}).then(render);

function render(next: RewardsAppState): void {
  state = next;
  summaryTab.classList.toggle("active", next.view === "summary");
  recentTab.classList.toggle("active", next.view === "recent");
  trendsTab.classList.toggle("active", next.view === "trends");
  replayButton.classList.toggle("active", next.mode === "replay");
  pin.textContent = next.pinned ? "◆" : "◇";
  pin.classList.toggle("active", next.pinned);
  element("status-text").textContent = next.statusDetail;
  element("status-dot").className = `status-dot ${STATUS_TONE[next.status]}`;
  element("summary-panel").hidden = next.view !== "summary";
  element("recent-panel").hidden = next.view !== "recent";
  element("trends-panel").hidden = next.view !== "trends";
  const nextSessionKey = `${next.mode}:${next.replayFileName ?? "live"}`;
  if (nextSessionKey !== trendSessionKey) {
    trendSessionKey = nextSessionKey;
    trendZoom = undefined;
  }
  const replayBanner = element("replay-banner");
  replayBanner.hidden = next.mode !== "replay";
  element("replay-banner-text").textContent = next.mode === "replay"
    ? `Viewing replay: ${next.replayFileName ?? "selected log"}${next.replayWarnings > 0 ? ` · ${next.replayWarnings} malformed records skipped` : ""}`
    : "";
  element("total-xp").textContent = format.format(next.totalExperience);
  element("total-job-xp").textContent = format.format(next.totalJobExperience);
  element("total-coins").textContent = formatDecimal(next.totalCoins);
  element("unmatched").textContent = format.format(next.unmatched);
  const identityWarning = element("identity-warning");
  identityWarning.hidden = next.unidentified === 0;
  identityWarning.textContent = next.unidentified === 0 ? "" : `${format.format(next.unidentified)} reward ${next.unidentified === 1 ? "event came" : "events came"} from mobs whose spawn happened before capture. Change maps or wait for those mobs to respawn; newly observed mobs will be categorized.`;
  renderSession(next);
  if (next.view === "trends") queueMicrotask(renderTrend);
}

function renderSession(next: RewardsAppState): void {
  const summaries = element("summary-list");
  const summaryRows = next.summaries.map((mob) => row(
    mob.displayName,
    `Level ${mob.level} · ${mob.kills} ${mob.kills === 1 ? "kill" : "kills"}`,
    [`${format.format(mob.experience)} XP`, `${format.format(mob.jobExperience)} job XP`, `${formatDecimal(mob.coins)} coins`],
    mob.drops,
  ));
  if (next.unmatchedDrops.length) summaryRows.push(row(
    "Unmatched",
    "Items picked up without mob correlation",
    [],
    next.unmatchedDrops,
  ));
  summaries.replaceChildren(...(summaryRows.length ? summaryRows : [empty(next.mode === "replay" ? "No confirmed mob totals in this replay." : "Confirmed mob totals will appear here.")]));
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

interface TrendDisplayPoint {
  time: number;
  ratio: number;
  primary: string;
  secondary: string;
}

interface RenderedTrend {
  range: TrendRange;
  left: number;
  top: number;
  width: number;
  height: number;
  points: TrendDisplayPoint[];
}

function setTrendMetric(metric: TrendMetric): void {
  trendMetric = metric;
  trendZoom = undefined;
  renderTrend();
}

function setTrendMode(mode: TrendMode): void {
  trendMode = mode;
  trendZoom = undefined;
  renderTrend();
}

function renderTrend(): void {
  if (!state) return;
  button("trend-xp").classList.toggle("active", trendMetric === "experience");
  button("trend-job-xp").classList.toggle("active", trendMetric === "jobExperience");
  button("trend-coins").classList.toggle("active", trendMetric === "coins");
  button("trend-rate").classList.toggle("active", trendMode === "rate");
  button("trend-cumulative").classList.toggle("active", trendMode === "cumulative");
  button("trend-reset").hidden = trendZoom === undefined;
  hideTrendHover();
  keyboardPoint = -1;

  const svg = svgById("trend-svg");
  svg.replaceChildren();
  const emptyState = element("trend-empty");
  const extent = trendExtent(state.graphSamples);
  if (!extent || trendChart.clientWidth === 0 || trendChart.clientHeight === 0) {
    emptyState.hidden = false;
    emptyState.textContent = state.mode === "replay" ? "No timestamped rewards in this replay." : "Confirmed rewards will appear here.";
    renderedTrend = undefined;
    return;
  }
  emptyState.hidden = true;

  const chartWidth = trendChart.clientWidth;
  const chartHeight = trendChart.clientHeight;
  const left = 70;
  const top = 20;
  const right = 20;
  const bottom = 42;
  const width = Math.max(1, chartWidth - left - right);
  const height = Math.max(1, chartHeight - top - bottom);
  const range = normalizedTrendRange(trendZoom ?? extent, extent);
  svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);

  let points: TrendDisplayPoint[];
  let yLabels: string[];
  if (trendMode === "cumulative") {
    const cumulative = buildCumulativeTrend(state.graphSamples, trendMetric, range);
    const maximum = cumulative.reduce((highest, point) => point.value > highest ? point.value : highest, 0n);
    points = cumulative.map((point) => ({
      time: point.time,
      ratio: bigintRatio(point.value, maximum),
      primary: formatDecimal(point.value.toString()),
      secondary: `${metricLabel()} total`,
    }));
    yLabels = axisTicks(5).map((tick) => formatDecimal((maximum * BigInt(tick) / 4n).toString()));
  } else {
    const rates = buildRateTrend(state.graphSamples, trendMetric, range, width);
    const maximum = rates.reduce((highest, point) => Math.max(highest, point.value), 0);
    points = rates.map((point) => ({
      time: point.time,
      ratio: maximum > 0 ? point.value / maximum : 0,
      primary: `${formatRate(point.value)}/sec`,
      secondary: `${formatDecimal(point.gain.toString())} in ${formatDuration(point.seconds)}`,
    }));
    yLabels = axisTicks(5).map((tick) => formatRate(maximum * tick / 4));
  }

  drawTrendAxes(svg, range, { left, top, width, height }, yLabels);
  drawTrendLine(svg, points, range, { left, top, width, height }, trendMode === "cumulative");
  renderedTrend = { range, left, top, width, height, points };
  element("trend-chart-title").textContent = `${metricLabel()} ${trendMode === "rate" ? "rate per second" : "cumulative total"} over time`;
}

function drawTrendAxes(
  svg: SVGSVGElement,
  range: TrendRange,
  plot: Pick<RenderedTrend, "left" | "top" | "width" | "height">,
  yLabels: readonly string[],
): void {
  for (const tick of axisTicks(5)) {
    const y = plot.top + plot.height - (tick / 4) * plot.height;
    svg.append(svgElement("line", "trend-grid", { x1: plot.left, y1: y, x2: plot.left + plot.width, y2: y }));
    const label = svgElement("text", "trend-axis-label", { x: plot.left - 10, y: y + 4, "text-anchor": "end" });
    label.textContent = yLabels[tick] ?? "0";
    svg.append(label);
  }
  for (const tick of axisTicks(5)) {
    const ratio = tick / 4;
    const x = plot.left + ratio * plot.width;
    const label = svgElement("text", "trend-axis-label", { x, y: plot.top + plot.height + 25, "text-anchor": tick === 0 ? "start" : tick === 4 ? "end" : "middle" });
    label.textContent = formatAxisTime(range.start + ratio * (range.end - range.start), range);
    svg.append(label);
  }
}

function drawTrendLine(
  svg: SVGSVGElement,
  points: readonly TrendDisplayPoint[],
  range: TrendRange,
  plot: Pick<RenderedTrend, "left" | "top" | "width" | "height">,
  stepped: boolean,
): void {
  if (!points.length) return;
  const coordinates = points.map((point) => ({
    x: plot.left + ((point.time - range.start) / Math.max(1, range.end - range.start)) * plot.width,
    y: plot.top + plot.height - point.ratio * plot.height,
  }));
  const first = coordinates[0];
  if (!first) return;
  let path = `M ${first.x} ${first.y}`;
  for (let index = 1; index < coordinates.length; index += 1) {
    const point = coordinates[index];
    if (!point) continue;
    path += stepped ? ` H ${point.x} V ${point.y}` : ` L ${point.x} ${point.y}`;
  }
  svg.append(svgElement("path", "trend-line", { d: path }));
}

function trendPointerDown(event: PointerEvent): void {
  if (!renderedTrend || event.button !== 0) return;
  dragStart = trendLocalX(event.clientX);
  trendChart.setPointerCapture(event.pointerId);
  updateTrendSelection(dragStart, dragStart);
}

function trendPointerMove(event: PointerEvent): void {
  const x = trendLocalX(event.clientX);
  if (dragStart !== undefined) updateTrendSelection(dragStart, x);
  else showTrendHover(x);
}

function trendPointerUp(event: PointerEvent): void {
  if (!renderedTrend || dragStart === undefined) return;
  const end = trendLocalX(event.clientX);
  const start = dragStart;
  dragStart = undefined;
  removeTrendSelection();
  if (trendChart.hasPointerCapture(event.pointerId)) trendChart.releasePointerCapture(event.pointerId);
  if (Math.abs(end - start) < 10) { showTrendHover(end); return; }
  const left = Math.max(renderedTrend.left, Math.min(start, end));
  const right = Math.min(renderedTrend.left + renderedTrend.width, Math.max(start, end));
  trendZoom = {
    start: trendTimeAt(left, renderedTrend),
    end: trendTimeAt(right, renderedTrend),
  };
  renderTrend();
}

function cancelTrendDrag(): void {
  dragStart = undefined;
  removeTrendSelection();
}

function trendKeyDown(event: KeyboardEvent): void {
  const points = renderedTrend?.points;
  if (!points?.length || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === "Home") keyboardPoint = 0;
  else if (event.key === "End") keyboardPoint = points.length - 1;
  else if (event.key === "ArrowLeft") keyboardPoint = Math.max(0, keyboardPoint < 0 ? points.length - 1 : keyboardPoint - 1);
  else keyboardPoint = Math.min(points.length - 1, keyboardPoint + 1);
  showTrendPoint(keyboardPoint);
}

function showTrendHover(x: number): void {
  if (!renderedTrend?.points.length) return;
  const time = trendTimeAt(x, renderedTrend);
  let closest = 0;
  for (let index = 1; index < renderedTrend.points.length; index += 1) {
    const candidate = renderedTrend.points[index];
    const current = renderedTrend.points[closest];
    if (candidate && current && Math.abs(candidate.time - time) < Math.abs(current.time - time)) closest = index;
  }
  showTrendPoint(closest);
}

function showTrendPoint(index: number): void {
  const chart = renderedTrend;
  const point = chart?.points[index];
  if (!chart || !point) return;
  hideTrendHover();
  const x = chart.left + ((point.time - chart.range.start) / Math.max(1, chart.range.end - chart.range.start)) * chart.width;
  const y = chart.top + chart.height - point.ratio * chart.height;
  const svg = svgById("trend-svg");
  svg.append(
    svgElement("line", "trend-crosshair trend-hover", { x1: x, y1: chart.top, x2: x, y2: chart.top + chart.height }),
    svgElement("circle", "trend-marker trend-hover", { cx: x, cy: y, r: 4 }),
  );
  const tooltip = element("trend-tooltip");
  tooltip.replaceChildren(
    text("strong", "", point.primary),
    text("div", "", point.secondary),
    text("div", "", new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" }).format(point.time)),
  );
  tooltip.hidden = false;
  const tooltipWidth = 180;
  tooltip.style.left = `${Math.min(trendChart.clientWidth - tooltipWidth - 8, Math.max(8, x + 10))}px`;
  tooltip.style.top = `${Math.max(8, y - 30)}px`;
}

function hideTrendHover(): void {
  for (const node of document.querySelectorAll(".trend-hover")) node.remove();
  element("trend-tooltip").hidden = true;
}

function updateTrendSelection(start: number, end: number): void {
  const chart = renderedTrend;
  if (!chart) return;
  removeTrendSelection();
  const left = Math.max(chart.left, Math.min(start, end));
  const right = Math.min(chart.left + chart.width, Math.max(start, end));
  svgById("trend-svg").append(svgElement("rect", "trend-selection", {
    x: left, y: chart.top, width: Math.max(0, right - left), height: chart.height,
  }));
}

function removeTrendSelection(): void { document.querySelector(".trend-selection")?.remove(); }

function trendLocalX(clientX: number): number {
  const bounds = trendChart.getBoundingClientRect();
  return clientX - bounds.left;
}

function trendTimeAt(x: number, chart: RenderedTrend): number {
  const ratio = Math.max(0, Math.min(1, (x - chart.left) / chart.width));
  return chart.range.start + ratio * (chart.range.end - chart.range.start);
}

function normalizedTrendRange(range: TrendRange, extent: TrendRange): TrendRange {
  const start = Math.max(extent.start, Math.min(range.start, extent.end));
  const end = Math.min(range.end, extent.end);
  return end > start ? { start, end } : extent;
}

function metricLabel(): string {
  if (trendMetric === "experience") return "Character XP";
  if (trendMetric === "jobExperience") return "Job XP";
  return "Coins";
}

function formatRate(value: number): string {
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: value < 10 ? 2 : 1 }).format(value);
}

function formatDuration(seconds: number): string {
  return seconds >= 60 ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(seconds / 60)} min` : `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(seconds)} sec`;
}

function formatAxisTime(value: number, range: TrendRange): string {
  const longRange = range.end - range.start >= 86_400_000;
  return new Intl.DateTimeFormat(undefined, longRange
    ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(value);
}

function axisTicks(count: number): number[] { return Array.from({ length: count }, (_, index) => index); }

function svgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  className: string,
  attributes: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  node.setAttribute("class", className);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
  return node;
}

function setView(view: RewardsAppView): void { void electroview.rpc?.request.setView({ view }); }
function returnToLive(): void {
  void electroview.rpc?.request.setMode({ mode: "live" });
}
function formatDecimal(value: string): string { try { return format.format(BigInt(value)); } catch { return value; } }
function formatChance(value: number): string {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(value)}%`;
}
function empty(message: string): HTMLElement { return text("div", "empty-state", message); }
function text<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, value: string): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.className = className; node.textContent = value; return node; }
function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function svgById(id: string): SVGSVGElement { const value = document.getElementById(id); if (!(value instanceof SVGSVGElement)) throw new Error(`Missing SVG #${id}`); return value; }
