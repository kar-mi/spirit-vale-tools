import { render } from "preact";
import { signal } from "@preact/signals";
import { Electroview } from "electrobun/view";
import { TitleBar } from "@spiritvale/ui-theme/title-bar";

import type { DpsSettingsRpc, DpsSettingsState } from "../app-types.ts";

const state = signal<DpsSettingsState>({ opacity: 1 });

const rpc = Electroview.defineRPC<DpsSettingsRpc>({
  handlers: { requests: {}, messages: { stateChanged: (next) => { state.value = next; } } },
});
const electroview = new Electroview({ rpc });

void electroview.rpc?.request.getState({}).then((next) => { state.value = next; });

function setOpacity(opacity: number): void {
  state.value = { ...state.value, opacity };
  void electroview.rpc?.request.setOpacity({ opacity });
}

function App() {
  const percentage = Math.round(state.value.opacity * 100);
  return (
    <main class="app-shell">
      <TitleBar
        appTag="DPS Settings"
        minWidth={560}
        minHeight={360}
        getFrame={async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 560, height: 360 }}
        setFrame={(frame) => void electroview.rpc?.request.setWindowFrame(frame)}
        onMinimize={() => void electroview.rpc?.request.windowAction({ action: "minimize" })}
        onClose={() => void electroview.rpc?.request.windowAction({ action: "close" })}
      />
      <section class="settings-content" aria-label="DPS settings">
        <header>
          <h1>Overlay opacity</h1>
          <p>Adjust how transparent the DPS overlay appears.</p>
        </header>
        <label class="opacity-field" for="opacity-slider">
          <span>Opacity</span>
          <output for="opacity-slider">{percentage}%</output>
          <input
            id="opacity-slider"
            type="range"
            min="20"
            max="100"
            step="5"
            value={percentage}
            onInput={(event) => setOpacity(Number((event.target as HTMLInputElement).value) / 100)}
          />
        </label>
      </section>
    </main>
  );
}

render(<App />, document.getElementById("root")!);
