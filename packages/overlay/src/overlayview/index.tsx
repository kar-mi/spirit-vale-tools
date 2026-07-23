import { signal } from "@preact/signals";
import { render, type ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { Electroview } from "electrobun/view";

import type { FishNetDpsTimelinePoint } from "@spiritvale/combat";
import type {
  OverlayElementId,
  OverlayElementSettings,
  OverlayRpc,
  OverlayState,
} from "../app-types.ts";

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const state = signal<OverlayState | undefined>(undefined);

const rpc = Electroview.defineRPC<OverlayRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });
void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function App() {
  const next = state.value;
  if (!next) return <main class="overlay-root" />;
  return (
    <main class={next.locked ? "overlay-root" : "overlay-root editing"}>
      {!next.locked && <div class="edit-scrim" />}
      {!next.locked && <p class="edit-hint">Drag elements to arrange the overlay. Use settings to show or hide elements.</p>}
      <OverlayElement id="dpsChart" settings={next.elements.dpsChart} locked={next.locked}>
        <DpsChartElement state={next} />
      </OverlayElement>
      <OverlayElement id="personalDps" settings={next.elements.personalDps} locked={next.locked}>
        <PersonalDpsElement state={next} />
      </OverlayElement>
      <OverlayElement id="partyRanking" settings={next.elements.partyRanking} locked={next.locked}>
        <PartyRankingElement state={next} />
      </OverlayElement>
      {!next.locked && (
        <button class="lock-pill" type="button" onClick={() => void setLocked(true)}>Lock overlay</button>
      )}
    </main>
  );
}

interface OverlayElementProps {
  id: OverlayElementId;
  settings: OverlayElementSettings;
  locked: boolean;
  children: ComponentChildren;
}

function OverlayElement({ id, settings, locked, children }: OverlayElementProps) {
  const [drag, setDrag] = useState<{ pointerId: number; originX: number; originY: number; dx: number; dy: number }>();
  if (!settings.enabled) return null;
  const move = (event: PointerEvent): void => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    setDrag({ ...drag, dx: event.clientX - drag.originX, dy: event.clientY - drag.originY });
  };
  const finish = (event: PointerEvent): void => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const x = Math.max(0, Math.min(window.innerWidth - settings.width, settings.x + drag.dx));
    const y = Math.max(0, Math.min(window.innerHeight - settings.height, settings.y + drag.dy));
    setDrag(undefined);
    void electroview.rpc?.request.setElementPosition({ id, x, y }).then((next) => { state.value = next; });
  };
  return (
    <section
      class={drag ? "overlay-element dragging" : "overlay-element"}
      style={{
        left: `${settings.x}px`,
        top: `${settings.y}px`,
        width: `${settings.width}px`,
        height: `${settings.height}px`,
        transform: drag ? `translate(${drag.dx}px, ${drag.dy}px)` : undefined,
      }}
      onPointerDown={(event) => {
        if (locked || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDrag({ pointerId: event.pointerId, originX: event.clientX, originY: event.clientY, dx: 0, dy: 0 });
      }}
      onPointerMove={move}
      onPointerUp={finish}
      onPointerCancel={() => setDrag(undefined)}
    >
      {children}
    </section>
  );
}

function DpsChartElement({ state: next }: { state: OverlayState }) {
  const personal = next.snapshot?.personal;
  const points = personal?.timeline ?? partyTimeline(next);
  const duration = next.snapshot?.durationMs ?? 0;
  return (
    <div class="element-content">
      <h2 class="element-title">{personal ? "Personal DPS over time" : "Party DPS over time"}</h2>
      {points.length ? <DamageChart points={points} durationMs={duration} /> : <div class="empty">Waiting for combat data</div>}
    </div>
  );
}

function DamageChart({ points, durationMs }: { points: readonly FishNetDpsTimelinePoint[]; durationMs: number }) {
  const width = 640;
  const height = 220;
  const left = 42;
  const top = 12;
  const right = 12;
  const bottom = 26;
  const maxValue = Math.max(1, ...points.map((point) => point.dps));
  const duration = Math.max(1, durationMs);
  const linePoints = points.map((point) => {
    const x = left + (point.elapsedMs / duration) * (width - left - right);
    const y = top + (1 - point.dps / maxValue) * (height - top - bottom);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg class="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="DPS over time chart">
      <line class="chart-grid" x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} />
      <polyline class="chart-line" points={linePoints} />
      <text class="chart-label" x="0" y={top + 4}>{compactFormat.format(maxValue)}</text>
      <text class="chart-label" x={left} y={height - 5}>0:00</text>
      <text class="chart-label" text-anchor="end" x={width - right} y={height - 5}>{formatDuration(durationMs)}</text>
    </svg>
  );
}

function PersonalDpsElement({ state: next }: { state: OverlayState }) {
  const personal = next.snapshot?.personal;
  return (
    <div class="element-content">
      <h2 class="element-title">Personal damage</h2>
      {personal ? (
        <>
          <span class="personal-value">{formatDps(personal.dps)}</span><span class="personal-unit">DPS</span>
          <div class="personal-details">
            <span>Damage<strong>{compactFormat.format(personal.damage)}</strong></span>
            <span>Crit rate<strong>{personal.hits ? `${Math.round(personal.criticalHits / personal.hits * 100)}%` : "—"}</strong></span>
          </div>
        </>
      ) : <div class="empty">{next.personalName ? "Waiting for your character" : "Set your character name in settings"}</div>}
    </div>
  );
}

function PartyRankingElement({ state: next }: { state: OverlayState }) {
  const actors = [...(next.snapshot?.actors ?? [])].sort((a, b) => b.dps - a.dps).slice(0, 8);
  const maxDps = Math.max(1, ...actors.map((actor) => actor.dps));
  return (
    <div class="element-content">
      <h2 class="element-title">Party DPS</h2>
      {actors.length ? <div class="ranking">{actors.map((actor) => (
        <div class="ranking-row" key={actor.actorIds[0]} style={`--row-fill:${actor.dps / maxDps * 100}%`}>
          <span class="ranking-name">{actor.displayName}</span>
          <span class="ranking-dps">{formatDps(actor.dps)}</span>
        </div>
      ))}</div> : <div class="empty">Waiting for party damage</div>}
    </div>
  );
}

function partyTimeline(next: OverlayState): FishNetDpsTimelinePoint[] {
  const buckets = new Map<number, FishNetDpsTimelinePoint>();
  for (const actor of next.snapshot?.actors ?? []) {
    for (const point of actor.timeline) {
      const current = buckets.get(point.elapsedMs);
      buckets.set(point.elapsedMs, {
        elapsedMs: point.elapsedMs,
        damage: (current?.damage ?? 0) + point.damage,
        dps: (current?.dps ?? 0) + point.dps,
        cumulativeDamage: (current?.cumulativeDamage ?? 0) + point.cumulativeDamage,
      });
    }
  }
  return [...buckets.values()].sort((left, right) => left.elapsedMs - right.elapsedMs);
}

function setLocked(locked: boolean): Promise<void> {
  return electroview.rpc?.request.setLocked({ locked }).then((next) => { state.value = next; }) ?? Promise.resolve();
}

function formatDps(value: number): string {
  return value >= 10_000 ? compactFormat.format(value) : numberFormat.format(value);
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

render(<App />, document.getElementById("root")!);
