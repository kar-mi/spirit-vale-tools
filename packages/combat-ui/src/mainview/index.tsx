import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";
import { StatusDot } from "@spiritvale/ui-theme/status-dot";
import type { StatusTone } from "@spiritvale/ui-theme/status-dot";

import type { DpsAppRpc, DpsAppState, DpsAppTab } from "../app-types.ts";
import type { FishNetDpsActorRow, FishNetDpsSkillRow } from "@spiritvale/combat";

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

function App() {
  const next = state.value;
  const personalNameRef = useRef<HTMLInputElement>(null);

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
  const actorMaximum = actors[0]?.damage ?? 1;
  const personalSkills = next.snapshot?.personal?.skills ?? [];
  const personalMaximum = personalSkills[0]?.damage ?? 1;
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
        <div class="stat-tiles dps-tiles">
          <article class="stat-tile stat-pair">
            <div class="stat-metric"><span class="t-label">Party DPS</span><strong class="t-data">{formatDps(next.snapshot?.partyDps ?? 0)}</strong></div>
            <div class="stat-metric"><span class="t-label">Total damage</span><strong class="t-data">{compactFormat.format(next.snapshot?.totalDamage ?? 0)}</strong></div>
          </article>
          <article class="stat-tile stat-pair">
            <div class="stat-metric"><span class="t-label">Timer</span><strong class="t-data">{next.snapshot ? formatDuration(next.snapshot.durationMs) : "—"}</strong></div>
            <div class="stat-metric"><span class="t-label">Total kills</span><strong class="t-data">{numberFormat.format(next.snapshot?.actors.reduce((total, actor) => total + actor.kills, 0) ?? 0)}</strong></div>
          </article>
        </div>
      </section>

      <div id="storage-warning" class="banner is-warn" aria-live="polite" hidden={next.storageWarning === undefined}>{next.storageWarning ?? ""}</div>

      <nav class="seg tabs" role="tablist" aria-label="Damage views">
        <button type="button" role="tab" aria-controls="all-panel" class={allActive ? "active" : undefined} aria-selected={allActive} onClick={() => setTab("all")}>All DPS</button>
        <button type="button" role="tab" aria-controls="personal-panel" class={allActive ? undefined : "active"} aria-selected={!allActive} onClick={() => setTab("personal")}>Personal</button>
      </nav>

      <section class="panel" role="tabpanel" hidden={!allActive}>
        <div class="meter-list">
          {actors.length === 0
            ? <div class="empty-state">Player damage will appear when combat begins and identities are visible.</div>
            : actors.map((actor) => <MeterRow key={actor.actorIds[0]} name={actor.displayName} row={actor} width={actor.damage / actorMaximum} />)}
        </div>
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
        <div class="meter-list">
          {personalSkills.length === 0
            ? <div class="empty-state">{personalMatch === "matched" ? "No personal skill damage yet." : "Personal skills appear after your character is matched."}</div>
            : personalSkills.map((skill) => <MeterRow key={skill.sourceId} name={skill.sourceLabel} row={skill} width={skill.damage / personalMaximum} />)}
        </div>
      </section>
    </main>
  );
}

interface MeterRowProps {
  name: string;
  row: FishNetDpsActorRow | FishNetDpsSkillRow;
  width: number;
}

function MeterRow({ name, row, width }: MeterRowProps) {
  return (
    <article class="meter-row">
      <div class="meter-bar" style={{ width: `${Math.max(0, Math.min(100, width * 100))}%` }} />
      <div class="meter-content">
        <span class="meter-name">{name}</span>
        <strong class="meter-value">{formatDps(row.dps)} DPS</strong>
        <span class="meter-detail">{compactFormat.format(row.damage)} damage · {numberFormat.format(row.hits)} hits</span>
        <span class="meter-detail meter-percent">{Math.round(row.contribution * 100)}%</span>
        {"kills" in row && <span class="meter-detail meter-kills">Kills: {numberFormat.format(row.kills)}</span>}
      </div>
    </article>
  );
}

render(<App />, document.getElementById("root")!);
