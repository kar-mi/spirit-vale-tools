import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";

import type { DpsSettingsRpc, DpsSettingsState } from "../app-types.ts";

const rpc = Electroview.defineRPC<DpsSettingsRpc>({ handlers: { requests: {}, messages: { stateChanged: render } } });
const electroview = new Electroview({ rpc });
const slider = input("opacity-slider");
const value = element("opacity-value");

button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
slider.addEventListener("input", () => {
  const opacity = Number(slider.value) / 100;
  render({ opacity });
  void electroview.rpc?.request.setOpacity({ opacity });
});

initWindowChrome({
  titlebar: element("titlebar"), minWidth: 560, minHeight: 360,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 560, height: 360 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
});

void electroview.rpc?.request.getState({}).then(render);

function render(state: DpsSettingsState): void {
  const percentage = Math.round(state.opacity * 100);
  slider.value = String(percentage);
  value.textContent = `${percentage}%`;
}

function element(id: string): HTMLElement { const value = document.getElementById(id); if (!value) throw new Error(`Missing #${id}`); return value; }
function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
function input(id: string): HTMLInputElement { return element(id) as HTMLInputElement; }
