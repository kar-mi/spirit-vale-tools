import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { signal } from "@preact/signals";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";
import { StatusDot } from "@spiritvale/ui-theme/status-dot";
import type { StatusTone } from "@spiritvale/ui-theme/status-dot";

import type { DpsAppRpc, DpsAppState, DpsAppTab } from "../app-types.ts";

const STATUS_TONE: Record<DpsAppState["status"], StatusTone> = {
  waiting: "is-warn",
  capturing: "is-ok",
  loading: "is-warn",
  ready: "is-ok",
  stopped: "is-warn",
  error: "is-err",
};

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

type ActorSortKey = "dps" | "damage" | "contribution" | "critRate" | "kills";
type SortDirection = "ascending" | "descending";
interface ActorSort { key: ActorSortKey; direction: SortDirection }

const state = signal<DpsAppState | undefined>(undefined);

const rpc = Electroview.defineRPC<DpsAppRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });

void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function setTab(tab: DpsAppTab): void {
  if (state.value) state.value = { ...state.value, tab };
  void electroview.rpc?.request.setTab({ tab });
}

function formatDps(value: number): string {
  return value >= 10_000 ? compactFormat.format(value) : numberFormat.format(value);
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1_000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatCritRate(hits: number, criticalHits: number): string {
  return hits === 0 ? "—" : formatPercent(criticalHits / hits);
}

function actorSortValue(actor: NonNullable<DpsAppState["snapshot"]>["actors"][number], key: ActorSortKey): number {
  if (key === "critRate") return actor.hits === 0 ? 0 : actor.criticalHits / actor.hits;
  return actor[key];
}

function App() {
  const next = state.value;
  const personalNameRef = useRef<HTMLInputElement>(null);
  const [actorSort, setActorSort] = useState<ActorSort>({ key: "dps", direction: "descending" });

  // Only sync from server state when the user isn't actively editing the field —
  // mirrors the original imperative guard against clobbering keystrokes.
  useEffect(() => {
    const input = personalNameRef.current;
    if (input && next && document.activeElement !== input) input.value = next.personalName;
  }, [next?.personalName]);

  useEffect(() => {
    document.documentElement.style.setProperty("--dps-window-opacity", String(next?.opacity ?? 1));
  }, [next?.opacity]);

  if (!next) return <main class="app-shell" />;

  const actors = next.snapshot?.actors ?? [];
  const sortedActors = [...actors].sort((left, right) => {
    const difference = actorSortValue(left, actorSort.key) - actorSortValue(right, actorSort.key);
    if (difference !== 0) return actorSort.direction === "ascending" ? difference : -difference;
    return left.displayName.localeCompare(right.displayName);
  });
  const sortActorsBy = (key: ActorSortKey): void => {
    setActorSort((current) => ({
      key,
      direction: current.key === key && current.direction === "descending" ? "ascending" : "descending",
    }));
  };
  const personalSkills = next.snapshot?.personal?.skills ?? [];
  const personalMatch = next.snapshot?.personalMatch ?? (next.personalName ? "missing" : "unconfigured");
  const allActive = next.tab === "all";

  return (
    <main class="app-shell">
      <TitleBar
        appTag="DPS"
        minWidth={320}
        minHeight={360}
        getFrame={async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 320, height: 360 }}
        setFrame={(frame) => void electroview.rpc?.request.setWindowFrame(frame)}
        onMinimize={() => void electroview.rpc?.request.windowAction({ action: "minimize" })}
        onClose={() => void electroview.rpc?.request.windowAction({ action: "close" })}
        extraControls={
          <>
            <button class="icon-button" type="button" aria-label="Open DPS settings" title="DPS settings" onClick={() => void electroview.rpc?.request.openSettings({})}>⚙</button>
            <button
              class={next.pinned ? "icon-button active" : "icon-button"}
              type="button"
              aria-label="Toggle always on top"
              title="Always on top"
              onClick={() => void electroview.rpc?.request.setPinned({ pinned: !next.pinned })}
            >
              {next.pinned ? "◆" : "◇"}
            </button>
          </>
        }
      />

      <section class="command-bar">
        <button class="btn" type="button" onClick={() => void electroview.rpc?.request.openReplayPicker({})}>Open log</button>
        <button class="btn" type="button" disabled={!next.snapshot} onClick={() => void electroview.rpc?.request.resetEncounter({})}>Reset</button>
      </section>

      <section class="status-strip" aria-live="polite">
        <StatusDot tone={STATUS_TONE[next.status]} detail={next.statusDetail} />
        <div class="table-scroll summary-table-scroll">
          <table class="data-table summary-table" aria-label="Encounter totals">
            <thead><tr><th>Timer</th><th>Party</th><th>Total damage</th><th>Total kills</th></tr></thead>
            <tbody><tr>
              <td>{next.snapshot ? formatDuration(next.snapshot.durationMs) : "—"}</td>
              <td>{formatDps(next.snapshot?.partyDps ?? 0)}</td>
              <td>{compactFormat.format(next.snapshot?.totalDamage ?? 0)}</td>
              <td>{numberFormat.format(next.snapshot?.actors.reduce((total, actor) => total + actor.kills, 0) ?? 0)}</td>
            </tr></tbody>
          </table>
        </div>
      </section>

      <div id="storage-warning" class="banner is-warn" aria-live="polite" hidden={next.storageWarning === undefined}>{next.storageWarning ?? ""}</div>

      <nav class="seg tabs" role="tablist" aria-label="Damage views">
        <button type="button" role="tab" aria-controls="all-panel" class={allActive ? "active" : undefined} aria-selected={allActive} onClick={() => setTab("all")}>All DPS</button>
        <button type="button" role="tab" aria-controls="personal-panel" class={allActive ? undefined : "active"} aria-selected={!allActive} onClick={() => setTab("personal")}>Personal</button>
      </nav>

      <section class="panel" role="tabpanel" hidden={!allActive}>
        {actors.length === 0
          ? <div class="empty-state">Player damage will appear when combat begins and identities are visible.</div>
          : <div class="table-scroll meter-table-scroll">
              <table class="data-table meter-table party-meter-table" aria-label="Party damage">
                <thead><tr>
                  <th>IGN</th>
                  <SortableHeader label="DPS" sortKey="dps" sort={actorSort} onSort={sortActorsBy} />
                  <SortableHeader label="DMG" sortKey="damage" sort={actorSort} onSort={sortActorsBy} />
                  <SortableHeader label="DMG %" sortKey="contribution" sort={actorSort} onSort={sortActorsBy} />
                  <SortableHeader label="CRT %" sortKey="critRate" sort={actorSort} onSort={sortActorsBy} />
                  <SortableHeader label="Kills" sortKey="kills" sort={actorSort} onSort={sortActorsBy} />
                </tr></thead>
                <tbody>{sortedActors.map((actor) => (
                  <tr key={actor.actorIds[0]} class="meter-table-row" style={`--row-fill:${Math.max(0, Math.min(100, actor.contribution * 100))}%`}>
                    <th scope="row">{actor.displayName}</th>
                    <td>{formatDps(actor.dps)}</td>
                    <td>{compactFormat.format(actor.damage)}</td>
                    <td>{formatPercent(actor.contribution)}</td>
                    <td>{formatCritRate(actor.hits, actor.criticalHits)}</td>
                    <td>{numberFormat.format(actor.kills)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>}
      </section>

      <section class="panel" role="tabpanel" hidden={allActive}>
        <form
          class="personal-form"
          onSubmit={(event) => {
            event.preventDefault();
            void electroview.rpc?.request.setPersonalName({ name: personalNameRef.current?.value ?? "" });
            personalNameRef.current?.blur();
          }}
        >
          <label class="t-label" for="personal-name">Character</label>
          <div class="input-row">
            <input id="personal-name" ref={personalNameRef} class="input" type="text" maxLength={64} autocomplete="off" placeholder="Enter display name" defaultValue={next.personalName} />
            <button class="btn" type="submit">Save</button>
          </div>
          <label class="t-label actor-label" for="personal-actor">Damage actor</label>
          <select
            id="personal-actor"
            class="input"
            aria-label="Personal damage actor"
            value={next.personalActorId === undefined ? "auto" : String(next.personalActorId)}
            onChange={(event) => {
              const value = (event.target as HTMLSelectElement).value;
              void electroview.rpc?.request.setPersonalActor({ actorId: value === "auto" ? null : Number(value) });
            }}
          >
            <option value="auto">Automatic (name or local actions)</option>
            {actors.flatMap((actor) => actor.actorIds.map((actorId) => (
              <option key={actorId} value={String(actorId)}>{actor.displayName} · {compactFormat.format(actor.damage)} damage</option>
            )))}
          </select>
        </form>
        <p class="personal-hint">
          {personalMatch === "unconfigured"
            ? "Save your exact in-game display name to match personal damage."
            : personalMatch === "missing"
              ? "Waiting for a matching visible player identity."
              : personalMatch === "ambiguous"
                ? "More than one visible player matches this name."
                : "Matched to the current encounter."}
        </p>
        {personalSkills.length === 0
          ? <div class="empty-state">{personalMatch === "matched" ? "No personal skill damage yet." : "Personal skills appear after your character is matched."}</div>
          : <div class="table-scroll meter-table-scroll">
              <table class="data-table meter-table" aria-label="Personal skill damage">
                <thead><tr><th>Skill</th><th>DPS</th><th>Damage</th><th>Share</th><th>Hits</th><th>Crits</th><th>Crit rate</th></tr></thead>
                <tbody>{personalSkills.map((skill) => (
                  <tr key={skill.sourceId} class="meter-table-row" style={`--row-fill:${Math.max(0, Math.min(100, skill.contribution * 100))}%`}>
                    <th scope="row">{skill.sourceLabel}</th>
                    <td>{formatDps(skill.dps)}</td>
                    <td>{compactFormat.format(skill.damage)}</td>
                    <td>{formatPercent(skill.contribution)}</td>
                    <td>{numberFormat.format(skill.hits)}</td>
                    <td>{numberFormat.format(skill.criticalHits)}</td>
                    <td>{formatCritRate(skill.hits, skill.criticalHits)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>}
      </section>
    </main>
  );
}

interface SortableHeaderProps {
  label: string;
  sortKey: ActorSortKey;
  sort: ActorSort;
  onSort(key: ActorSortKey): void;
}

function SortableHeader({ label, sortKey, sort, onSort }: SortableHeaderProps) {
  const active = sort.key === sortKey;
  return (
    <th class="sortable-column" aria-sort={active ? sort.direction : undefined}>
      <button
        class="sort-button"
        type="button"
        onClick={() => onSort(sortKey)}
      >
        <span>{label}</span>
        <span class={active ? "sort-indicator active" : "sort-indicator"} aria-hidden="true">{active ? (sort.direction === "descending" ? "▼" : "▲") : "↕"}</span>
      </button>
    </th>
  );
}

render(<App />, document.getElementById("root")!);
