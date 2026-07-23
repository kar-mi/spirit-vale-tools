import { signal } from "@preact/signals";
import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";

import {
  OVERLAY_ELEMENT_IDS,
  type OverlayElementId,
  type OverlaySettingsRpc,
  type OverlayState,
} from "../app-types.ts";

const LABELS: Record<OverlayElementId, string> = {
  dpsChart: "DPS chart",
  personalDps: "Personal DPS numbers",
  partyRanking: "Party DPS ranking",
  weight: "Weight",
};
const state = signal<OverlayState | undefined>(undefined);
const rpc = Electroview.defineRPC<OverlaySettingsRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });
void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function App() {
  const next = state.value;
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameRef.current && next && document.activeElement !== nameRef.current) {
      nameRef.current.value = next.personalName;
    }
  }, [next?.personalName]);
  if (!next) return <main class="app-shell" />;
  return (
    <main class="app-shell">
      <TitleBar
        appTag="Overlay Settings"
        minWidth={560}
        minHeight={420}
        getFrame={async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 560, height: 420 }}
        setFrame={(frame) => void electroview.rpc?.request.setWindowFrame(frame)}
        onMinimize={() => void electroview.rpc?.request.windowAction({ action: "minimize" })}
        onClose={() => void electroview.rpc?.request.windowAction({ action: "close" })}
      />
      <section class="settings-content">
        <section class="settings-section">
          <div class="toggle-row">
            <span><strong>{next.locked ? "Overlay locked" : "Edit mode"}</strong></span>
            <button class="btn" type="button" onClick={() => void updateLock(!next.locked)}>
              {next.locked ? "Unlock overlay" : "Lock overlay"}
            </button>
          </div>
          <p>Locked mode lets mouse clicks pass through to the game. Unlock to drag overlay elements. Press F11 at any time to toggle the lock.</p>
        </section>
        <section class="settings-section">
          <h2>Visible elements</h2>
          {OVERLAY_ELEMENT_IDS.map((id) => (
            <label class="toggle-row" key={id}>
              <span>{LABELS[id]}</span>
              <input
                type="checkbox"
                checked={next.elements[id].enabled}
                onChange={(event) => void setEnabled(id, event.currentTarget.checked)}
              />
            </label>
          ))}
        </section>
        <section class="settings-section">
          <h2>Personal character</h2>
          <form class="name-form" onSubmit={(event) => {
            event.preventDefault();
            void setPersonalName(nameRef.current?.value ?? "");
            nameRef.current?.blur();
          }}>
            <input ref={nameRef} class="input" type="text" maxLength={64} autocomplete="off" placeholder="Exact in-game display name" defaultValue={next.personalName} />
            <button class="btn" type="submit">Save</button>
          </form>
        </section>
        <div class="actions">
          <button class="btn danger" type="button" onClick={() => void electroview.rpc?.request.closeOverlay({})}>Close overlay</button>
        </div>
      </section>
    </main>
  );
}

function updateLock(locked: boolean): Promise<void> {
  return electroview.rpc?.request.setLocked({ locked }).then((next) => { state.value = next; }) ?? Promise.resolve();
}

function setEnabled(id: OverlayElementId, enabled: boolean): Promise<void> {
  return electroview.rpc?.request.setElementEnabled({ id, enabled }).then((next) => { state.value = next; }) ?? Promise.resolve();
}

function setPersonalName(name: string): Promise<void> {
  return electroview.rpc?.request.setPersonalName({ name }).then((next) => { state.value = next; }) ?? Promise.resolve();
}

render(<App />, document.getElementById("root")!);
