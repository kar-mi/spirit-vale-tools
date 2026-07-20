import { render } from "preact";
import { signal } from "@preact/signals";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";
import { ListRow, RowHead } from "@spiritvale/ui-theme/list-row";

import type { CombatAnalysisRpc, CombatAnalysisState } from "../app-types.ts";

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const percentFormat = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });

const state = signal<CombatAnalysisState | undefined>(undefined);

const rpc = Electroview.defineRPC<CombatAnalysisRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });

void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function App() {
  const next = state.value;
  if (!next) return <main class="app-shell" />;

  const rows = next.snapshot?.actors ?? [];

  return (
    <main class="app-shell">
      <TitleBar
        appTag="Analysis"
        minWidth={680}
        minHeight={460}
        getFrame={async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 920, height: 680 }}
        setFrame={(frame) => void electroview.rpc?.request.setWindowFrame(frame)}
        onMinimize={() => void electroview.rpc?.request.windowAction({ action: "minimize" })}
        onClose={() => void electroview.rpc?.request.windowAction({ action: "close" })}
      />
      <section class="analysis-content">
        <section class="toolbar">
          <label class="encounter-picker">
            <span class="t-label">Encounter</span>
            <select
              class="input"
              aria-label="Encounter"
              disabled={next.status !== "ready" || next.encounters.length < 2}
              value={next.selectedEncounterId ?? ""}
              onChange={(event) => void electroview.rpc?.request.selectEncounter({ id: (event.target as HTMLSelectElement).value })}
            >
              {next.encounters.map((encounter) => <option key={encounter.id} value={encounter.id}>{encounter.label}</option>)}
            </select>
          </label>
          <div class="toolbar-meta">
            <span class="pill">{next.fileName ?? "Loading…"}</span>
            <span id="status" class="status-readout" aria-live="polite">{next.statusDetail}</span>
          </div>
        </section>
        <p id="warning" class="banner is-warn" hidden={next.invalidLines === 0}>
          {next.invalidLines === 0 ? "" : `${next.invalidLines} malformed record${next.invalidLines === 1 ? " was" : "s were"} skipped.`}
        </p>
        <section class="stat-tiles totals" aria-label="Encounter totals">
          <article class="stat-tile"><span class="t-label">Party DPS</span><strong class="t-data">{numberFormat.format(next.snapshot?.partyDps ?? 0)}</strong></article>
          <article class="stat-tile"><span class="t-label">Total damage</span><strong class="t-data">{compactFormat.format(next.snapshot?.totalDamage ?? 0)}</strong></article>
          <article class="stat-tile"><span class="t-label">Duration</span><strong class="t-data">{next.snapshot ? formatDuration(next.snapshot.durationMs) : "—"}</strong></article>
          <article class="stat-tile"><span class="t-label">Players</span><strong class="t-data">{numberFormat.format(rows.length)}</strong></article>
        </section>
        <section class="players-section" aria-label="Player analysis">
          <div class="section-head"><h1>Player damage</h1><p>Double-click a player for skills and damage over time.</p></div>
          <div class="list">
            {rows.map((player) => (
              <ListRow
                key={player.actorIds[0]}
                className="player-row"
                title="Double-click for player detail"
                tabIndex={0}
                onActivate={() => void electroview.rpc?.request.openPlayerDetails({ actorId: player.actorIds[0]! })}
                chips={[
                  `${numberFormat.format(player.hits)} hits`,
                  `${numberFormat.format(player.kills)} kills`,
                  `Crit rate ${player.hits === 0 ? "—" : percentFormat.format(player.criticalHits / player.hits)}`,
                ]}
              >
                <RowHead
                  title={player.displayName}
                  meta={`${numberFormat.format(player.hits)} total hits`}
                  values={[compactFormat.format(player.damage), `${numberFormat.format(player.dps)} DPS`]}
                />
              </ListRow>
            ))}
          </div>
          {next.status === "ready" && rows.length === 0 && (
            <p id="empty-state" class="empty-state">No player damage was found for this encounter.</p>
          )}
        </section>
      </section>
    </main>
  );
}

render(<App />, document.getElementById("root")!);
