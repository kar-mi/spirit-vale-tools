import { render } from "preact";
import { useState } from "preact/hooks";
import { signal } from "@preact/signals";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";
import { ListRow, RowHead } from "@spiritvale/ui-theme/list-row";

import type { FishNetDpsTimelinePoint } from "@spiritvale/combat";
import type { CombatAnalysisDetailRpc, CombatAnalysisDetailState } from "../app-types.ts";

type Metric = "cumulative" | "dps";

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const percentFormat = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });

const state = signal<CombatAnalysisDetailState | undefined>(undefined);

const rpc = Electroview.defineRPC<CombatAnalysisDetailRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });

void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function App() {
  const [metric, setMetric] = useState<Metric>("cumulative");
  const next = state.value;
  if (!next) return <main class="app-shell" />;
  const player = next.player;

  const metrics: [string, string][] = [
    ["Damage", compactFormat.format(player.damage)],
    ["DPS", numberFormat.format(player.dps)],
    ["Hits", numberFormat.format(player.hits)],
    ["Kills", numberFormat.format(player.kills)],
    ["Crit hits", numberFormat.format(player.criticalHits)],
    ["Crit rate", player.hits === 0 ? "—" : percentFormat.format(player.criticalHits / player.hits)],
  ];

  return (
    <main class="app-shell">
      <TitleBar
        appTag="Player detail"
        minWidth={620}
        minHeight={500}
        getFrame={async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 880, height: 720 }}
        setFrame={(frame) => void electroview.rpc?.request.setWindowFrame(frame)}
        onMinimize={() => void electroview.rpc?.request.windowAction({ action: "minimize" })}
        onClose={() => void electroview.rpc?.request.windowAction({ action: "close" })}
      />
      <section class="detail-content">
        <section class="toolbar">
          <div>
            <h1>{player.displayName}</h1>
            <p>{next.fileName} · {next.encounterLabel}</p>
          </div>
          <div class="seg">
            <button type="button" class={metric === "cumulative" ? "active" : undefined} onClick={() => setMetric("cumulative")}>Cumulative</button>
            <button type="button" class={metric === "dps" ? "active" : undefined} onClick={() => setMetric("dps")}>DPS / 5 sec</button>
          </div>
        </section>
        <section class="stat-tiles totals" aria-label="Player totals">
          {metrics.map(([label, value]) => (
            <article class="stat-tile" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </section>
        <section class="chart-section">
          <div class="section-head">
            <h2>Damage over time</h2>
            <p>{metric === "cumulative" ? "Cumulative damage across the encounter." : "Damage per second in five-second buckets."}</p>
          </div>
          <div class="chart-card">
            <DamageChart points={player.timeline} durationMs={next.encounterDurationMs} metric={metric} />
          </div>
        </section>
        <section class="skills-section">
          <div class="section-head">
            <h2>Skill breakdown</h2>
            <p>Damage, DPS, hits, and critical-hit performance.</p>
          </div>
          <div class="list">
            {player.skills.map((skill) => (
              <ListRow
                key={skill.sourceId}
                chips={[
                  `${numberFormat.format(skill.hits)} hits`,
                  `${numberFormat.format(skill.criticalHits)} crit hits`,
                  `Crit rate ${skill.hits === 0 ? "—" : percentFormat.format(skill.criticalHits / skill.hits)}`,
                ]}
              >
                <RowHead
                  titleTag="h3"
                  title={skill.sourceLabel}
                  meta={`${numberFormat.format(skill.hits)} hits`}
                  values={[compactFormat.format(skill.damage), `${numberFormat.format(skill.dps)} DPS`]}
                />
              </ListRow>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

interface DamageChartProps {
  points: readonly FishNetDpsTimelinePoint[];
  durationMs: number;
  metric: Metric;
}

function DamageChart({ points, durationMs, metric }: DamageChartProps) {
  const width = 760;
  const height = 280;
  const left = 52;
  const top = 18;
  const right = 18;
  const bottom = 34;
  const maxValue = Math.max(1, ...points.map((point) => (metric === "cumulative" ? point.cumulativeDamage : point.dps)));
  const duration = Math.max(1, durationMs);
  const linePoints = points
    .map((point) => {
      const x = left + (point.elapsedMs / duration) * (width - left - right);
      const value = metric === "cumulative" ? point.cumulativeDamage : point.dps;
      const y = top + (1 - value / maxValue) * (height - top - bottom);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg id="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Damage over time chart">
      <line class="chart-axis" x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} />
      <polyline class="chart-line" points={linePoints} />
      <text class="chart-label" x={0} y={top + 4}>{compactFormat.format(maxValue)}</text>
      <text class="chart-label" x={left} y={height - 8}>0:00</text>
      <text class="chart-label" text-anchor="end" x={width - right} y={height - 8}>{formatDuration(durationMs)}</text>
    </svg>
  );
}

render(<App />, document.getElementById("root")!);
