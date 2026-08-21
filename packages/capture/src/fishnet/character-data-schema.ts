import { loadBundledFishNetRpcMap } from "./builtin-maps.ts";
import type { FishNetRpcParameter } from "./types.ts";

let cached: FishNetRpcParameter | undefined;

/**
 * `CharacterData`'s field schema, read directly from the bundled RPC map rather than duplicated
 * into a second, independently-maintained constant - `PlayerSave.LoadCharacter_T`'s `data`
 * parameter carries it, and every other RPC/behaviour that also sends a `CharacterData` uses the
 * identical shape (verified: `PlayerController.Inspect_T`, `PlayerSave.CharacterListCallback_T`/
 * `Refine_T`/`CharacterCallback_T` all reference the same generated fields in
 * `rpc-definitions/generated/player-save.ts`). One source, no drift between "the map" and "what the
 * decoders actually use".
 */
export function characterDataParameter(): FishNetRpcParameter {
  if (cached) return cached;
  const parameter = loadBundledFishNetRpcMap()
    .behaviours.find((behaviour) => behaviour.typeName === "PlayerSave")
    ?.rpcs.find((rpc) => rpc.methodName === "LoadCharacter_T")
    ?.parameters?.[0];
  if (!parameter) throw new Error("bundled RPC map has no PlayerSave.LoadCharacter_T CharacterData parameter");
  cached = parameter;
  return parameter;
}
