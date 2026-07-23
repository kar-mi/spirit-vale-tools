import { FishNetDpsMeter } from "@spiritvale/combat";
import type { CharacterViewState } from "@spiritvale/character";

export function detectedPersonalName(state: CharacterViewState): string {
  return state.snapshot?.name.trim() ?? "";
}

export function createPersonalDpsMeter(state: CharacterViewState): FishNetDpsMeter {
  return new FishNetDpsMeter({ personalName: detectedPersonalName(state) });
}

export function syncPersonalCharacter(meter: FishNetDpsMeter, state: CharacterViewState): void {
  meter.setPersonalName(detectedPersonalName(state));
}
