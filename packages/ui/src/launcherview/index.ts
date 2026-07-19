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
const settingsPanel = element("settings-panel");
const adapterSelect = element("adapter-select") as HTMLSelectElement;
const npcapStatus = element("npcap-status");
const npcapDetail = element("npcap-detail");
const adapterDetail = element("adapter-detail");
const installNpcapButton = button("install-npcap-button");

for (const candidate of document.querySelectorAll<HTMLButtonElement>("[data-tool]")) {
  candidate.addEventListener("click", () => {
    const tool = candidate.dataset.tool as ToolWindow;
    void electroview.rpc?.request.openTool({ tool });
  });
}

button("minimize-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "minimize" }));
button("close-button").addEventListener("click", () => void electroview.rpc?.request.windowAction({ action: "close" }));
button("settings-button").addEventListener("click", () => { settingsPanel.hidden = false; });
button("settings-close-button").addEventListener("click", () => { settingsPanel.hidden = true; });
button("refresh-adapters-button").addEventListener("click", () => void electroview.rpc?.request.refreshCaptureDevices({}).then(render));
installNpcapButton.addEventListener("click", () => void electroview.rpc?.request.openNpcapDownload({}));
adapterSelect.addEventListener("change", () => {
  adapterSelect.disabled = true;
  const deviceName = adapterSelect.value === "auto" ? null : adapterSelect.value;
  void electroview.rpc?.request.setCaptureAdapter({ deviceName })
    .then(render)
    .catch((error: unknown) => { adapterDetail.textContent = error instanceof Error ? error.message : "Could not switch adapters"; })
    .finally(() => { adapterSelect.disabled = false; });
});

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
  npcapStatus.textContent = availabilityLabel(state.npcapAvailability);
  npcapDetail.textContent = state.npcapVersion ? `${state.npcapDetail} · ${state.npcapVersion}` : state.npcapDetail;
  installNpcapButton.hidden = state.npcapAvailability === "ready" || state.npcapAvailability === "checking";
  const options: HTMLOptionElement[] = [];
  const automatic = document.createElement("option");
  automatic.value = "auto";
  automatic.textContent = "Automatic (default route)";
  options.push(automatic);
  for (const adapter of state.adapters) {
    const option = document.createElement("option");
    option.value = adapter.id;
    option.textContent = adapter.label;
    options.push(option);
  }
  if (state.selectedAdapter !== "auto" && !state.adapters.some((adapter) => adapter.id === state.selectedAdapter)) {
    const unavailableOption = document.createElement("option");
    unavailableOption.value = state.selectedAdapter;
    unavailableOption.textContent = "Saved adapter (currently unavailable)";
    options.push(unavailableOption);
  }
  adapterSelect.replaceChildren(...options);
  adapterSelect.value = state.selectedAdapter;
  adapterSelect.disabled = state.npcapAvailability !== "ready";
  const effective = state.adapters.find((adapter) => adapter.id === state.effectiveAdapter)?.label;
  adapterDetail.textContent = state.adapterFallback
    ? `The saved adapter is unavailable. Currently using ${effective ?? "automatic selection"}.`
    : effective
      ? `Currently using ${effective}.`
      : "Select Automatic to follow the active default route.";
}

function availabilityLabel(value: LauncherState["npcapAvailability"]): string {
  if (value === "ready") return "Ready";
  if (value === "missing") return "Not installed";
  if (value === "admin-only") return "Administrator-only installation";
  if (value === "error") return "Unavailable";
  return "Checking…";
}

function element(id: string): HTMLElement {
  const value = document.getElementById(id);
  if (!value) throw new Error(`Missing #${id}`);
  return value;
}

function button(id: string): HTMLButtonElement { return element(id) as HTMLButtonElement; }
