import type { FishNetRpcMap } from "../definitions/rpc-map.ts";
import {
  GENERATED_BEHAVIOURS,
  GENERATED_BROADCASTS,
  GENERATED_BUILD_FINGERPRINT,
  GENERATED_METADATA_VERSION,
  GENERATED_PREFAB_DEFINITIONS,
} from "./generated/index.ts";

export const FISHNET_RPC_MAP = {
  buildFingerprint: GENERATED_BUILD_FINGERPRINT,
  metadataVersion: GENERATED_METADATA_VERSION,
  behaviours: GENERATED_BEHAVIOURS,
  broadcasts: GENERATED_BROADCASTS,
  prefabs: GENERATED_PREFAB_DEFINITIONS,
} as const satisfies FishNetRpcMap;
