import { Electroview } from "electrobun/view";
import { initWindowChrome } from "@spiritvale/ui-theme/window-chrome";

import type { LauncherRpc, LauncherState, ToolWindow } from "../launcher-types.ts";

const rpc = Electroview.defineRPC<LauncherRpc>({
  handlers: { requests: {}, messages: { stateChanged: render } },
});
const electroview = new Electroview({ rpc });

const statusPanel = element("capture-status");
const statusDot = element("status-dot");
const statusText = element("status-text");

for (const candidate of document.querySelectorAll<HTMLButtonElement>("[data-tool]")) {
  candidate.addEventListener("click", () => {
    const tool = candidate.dataset.tool as ToolWindow;
    void electroview.rpc?.request.openTool({ tool });
  });
}

button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));

initWindowChrome({
  titlebar: element("titlebar"),
  minWidth: 420,
  minHeight: 300,
  getFrame: async () => (await electroview.rpc?.request.getWindowFrame({})) ?? { x: 0, y: 0, width: 520, height: 340 },
  setFrame: (frame) => void electroview.rpc?.request.setWindowFrame(frame),
});

void electroview.rpc?.request.getState({}).then(render);

function render(state: LauncherState): void {
  const unavailable = state.captureStatus === "unavailable";
  statusPanel.classList.toggle("is-error", unavailable);
  statusDot.className = `status-dot ${unavailable ? "is-err" : state.captureStatus === "capturing" ? "is-ok" : "is-idle"}`;
  statusText.textContent = state.statusDetail;
}

function element(id: string): HTMLElement {
  const value = document.getElementById(id);
  if (!value) throw new Error(`Missing #${id}`);
  return value;
}

function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
