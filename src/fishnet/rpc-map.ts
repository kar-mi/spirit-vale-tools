import { readFileSync } from "node:fs";

import type {
  FishNetBehaviourDefinition,
  FishNetBroadcastDefinition,
  FishNetRpcDefinition,
  FishNetRpcMap,
  FishNetRpcMapV1,
  FishNetRpcMapV2,
  FishNetRpcParameter,
  FishNetWireCodec,
} from "./types.ts";

const WIRE_CODECS = new Set<FishNetWireCodec>([
  "boolean",
  "uint8",
  "int8",
  "uint16",
  "int16",
  "uint32",
  "int32",
  "float32",
  "float64",
  "packedInt32",
  "packedUInt64",
  "stringUtf8Packed",
  "vector3IntPacked",
  "vector2",
  "vector3",
  "quaternion",
]);

export interface FishNetRpcMapLoadOptions {
  expectedBuildFingerprint?: string;
}

export function loadFishNetRpcMap(file: string, options: FishNetRpcMapLoadOptions = {}): FishNetRpcMap {
  const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
  if (!isRpcMap(parsed)) throw new Error(`invalid FishNet RPC map: ${file}`);
  if (options.expectedBuildFingerprint !== undefined && parsed.buildFingerprint !== options.expectedBuildFingerprint) {
    throw new Error(
      `FishNet RPC map build mismatch: expected ${options.expectedBuildFingerprint}, received ${parsed.buildFingerprint}`,
    );
  }
  return parsed;
}

function isRpcMap(value: unknown): value is FishNetRpcMap {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { schemaVersion?: unknown; buildFingerprint?: unknown; metadataVersion?: unknown };
  if (typeof candidate.buildFingerprint !== "string" || candidate.buildFingerprint.length === 0) return false;
  if (!Number.isInteger(candidate.metadataVersion)) return false;
  if (candidate.schemaVersion === 1) return isV1Map(value as Partial<FishNetRpcMapV1>);
  if (candidate.schemaVersion === 2) return isV2Map(value as Partial<FishNetRpcMapV2>);
  return false;
}

function isV1Map(value: Partial<FishNetRpcMapV1>): boolean {
  return Array.isArray(value.symbols) && value.symbols.every((symbol) => {
    return isObject(symbol)
      && Number.isInteger(symbol.methodHash)
      && typeof symbol.methodName === "string"
      && Array.isArray(symbol.forms);
  });
}

function isV2Map(value: Partial<FishNetRpcMapV2>): boolean {
  return Array.isArray(value.behaviours)
    && value.behaviours.every(isBehaviour)
    && (value.broadcasts === undefined || (Array.isArray(value.broadcasts) && value.broadcasts.every(isBroadcast)));
}

function isBehaviour(value: unknown): value is FishNetBehaviourDefinition {
  return isObject(value)
    && typeof value.typeName === "string"
    && value.typeName.length > 0
    && Array.isArray(value.rpcs)
    && value.rpcs.every(isRpcDefinition)
    && (value.syncTypes === undefined || (Array.isArray(value.syncTypes) && value.syncTypes.every((sync) => {
      return isObject(sync)
        && Number.isInteger(sync.index)
        && typeof sync.name === "string"
        && (sync.typeName === undefined || typeof sync.typeName === "string")
        && (sync.codec === undefined || WIRE_CODECS.has(sync.codec))
        && (sync.fields === undefined || (Array.isArray(sync.fields) && sync.fields.every(isParameter)))
        && !(sync.codec !== undefined && sync.fields !== undefined);
    })));
}

function isRpcDefinition(value: unknown): value is FishNetRpcDefinition {
  return isObject(value)
    && Number.isInteger(value.wireHash)
    && ["serverRpc", "observersRpc", "targetRpc", "reconcile"].includes(String(value.packetKind))
    && typeof value.methodName === "string"
    && (value.parameters === undefined || (Array.isArray(value.parameters) && value.parameters.every(isParameter)));
}

function isBroadcast(value: unknown): value is FishNetBroadcastDefinition {
  return isObject(value)
    && Number.isInteger(value.wireHash)
    && typeof value.typeName === "string"
    && (value.fields === undefined || (Array.isArray(value.fields) && value.fields.every(isParameter)));
}

function isParameter(value: unknown): value is FishNetRpcParameter {
  if (!isObject(value) || typeof value.name !== "string" || value.name.length === 0) return false;
  if (value.typeName !== undefined && typeof value.typeName !== "string") return false;
  if (value.codec !== undefined && !WIRE_CODECS.has(value.codec)) return false;
  if (value.fields !== undefined && (!Array.isArray(value.fields) || !value.fields.every(isParameter))) return false;
  if (value.codec !== undefined && value.fields !== undefined) return false;
  return value.codec !== undefined || value.fields !== undefined || value.typeName !== undefined;
}

function isObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === "object";
}
