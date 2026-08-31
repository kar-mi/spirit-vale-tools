import { loadBundledFishNetRpcMap } from "../mapping/bundled-rpc-map.ts";
import type { FishNetRpcParameter } from "../types.ts";

let cached: FishNetRpcParameter | undefined;

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
