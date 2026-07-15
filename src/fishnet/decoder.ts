import type {
  DecodedFishNetPacket,
  FishNetPacketName,
  FishNetRpcMap,
  FishNetRpcSymbol,
} from "./types.ts";

const PACKET_NAMES = new Map<number, FishNetPacketName>([
  [0, "unset"],
  [1, "authenticated"],
  [2, "split"],
  [3, "objectSpawn"],
  [4, "objectDespawn"],
  [5, "predictedSpawnResult"],
  [7, "syncType"],
  [8, "serverRpc"],
  [9, "observersRpc"],
  [10, "targetRpc"],
  [11, "ownershipChange"],
  [12, "broadcast"],
  [13, "bulkSpawnOrDespawn"],
  [14, "pingPong"],
  [15, "replicate"],
  [16, "reconcile"],
  [17, "disconnect"],
  [18, "timingUpdate"],
  [19, "unused2"],
  [20, "stateUpdate"],
  [21, "version"],
]);

const RPC_PACKET_NAMES = new Set<FishNetPacketName>(["serverRpc", "observersRpc", "targetRpc"]);

export class FishNetProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FishNetProtocolError";
  }
}

/**
 * Decodes the verified common FishNet header. RPC parsing is deliberately
 * bounded: it exposes ambiguous one/two-byte hashes without guessing which is
 * correct unless a generated map contains a unique verified wire mapping.
 */
export function decodeFishNetPayload(
  payload: Buffer,
  options: { reliable: boolean; rpcMap?: FishNetRpcMap } = { reliable: false },
): DecodedFishNetPacket {
  if (payload.length < 6) {
    throw new FishNetProtocolError(`FishNet payload needs a 4-byte tick and 2-byte packet id; received ${payload.length} bytes`);
  }

  const tick = payload.readUInt32LE(0);
  const packetId = payload.readUInt16LE(4);
  const packetName = PACKET_NAMES.get(packetId) ?? "unknown";
  const decoded: DecodedFishNetPacket = {
    tick,
    packetId,
    packetName,
    raw: payload,
    payload: payload.subarray(6),
  };
  if (!RPC_PACKET_NAMES.has(packetName)) return decoded;

  let offset = 6;
  const objectId = readSignedPackedWhole(payload, offset);
  offset = objectId.nextOffset;
  requireBytes(payload, offset, 2, "network behaviour header");
  const spawned = payload[offset] !== 0;
  offset += 1;
  decoded.objectId = objectId.value;
  decoded.networkBehaviourIndex = payload[offset];
  offset += 1;
  if (!spawned) {
    throw new FishNetProtocolError("RPC network object header did not identify a spawned object");
  }

  if (options.reliable) {
    const length = readSignedPackedWhole(payload, offset);
    offset = length.nextOffset;
    if (length.value < 1 || length.value > payload.length - offset) {
      throw new FishNetProtocolError(`RPC payload length ${length.value} exceeds ${payload.length - offset} remaining bytes`);
    }
    decoded.rpcPayloadLength = length.value;
  }

  requireBytes(payload, offset, 1, "RPC hash");
  const hash8 = payload.readUInt8(offset);
  decoded.rpcHash = hash8;
  if (payload.length - offset >= 2) decoded.rpcHash16Candidate = payload.readUInt16LE(offset);

  const symbol = findWireSymbol(options.rpcMap, packetName, hash8, decoded.rpcHash16Candidate);
  const wireHash = symbol?.wireHash;
  if (symbol && wireHash !== undefined) {
    decoded.rpcHash = wireHash;
    decoded.rpcName = symbol.methodName;
  }
  const hashBytes = wireHash !== undefined && wireHash > 0xff ? 2 : 1;
  decoded.payload = payload.subarray(offset + hashBytes);
  return decoded;
}

function findWireSymbol(
  map: FishNetRpcMap | undefined,
  packetName: FishNetPacketName,
  hash8: number,
  hash16: number | undefined,
): FishNetRpcSymbol | undefined {
  if (!map) return undefined;
  const matches = map.symbols.filter((symbol) => {
    if (symbol.wireHash === undefined) return false;
    if (symbol.packetKinds && !symbol.packetKinds.includes(packetName as "serverRpc" | "observersRpc" | "targetRpc")) return false;
    return symbol.wireHash === hash8 || symbol.wireHash === hash16;
  });
  return matches.length === 1 ? matches[0] : undefined;
}

function readSignedPackedWhole(buffer: Buffer, start: number): { value: number; nextOffset: number } {
  let unsigned = 0n;
  let shift = 0n;
  let offset = start;
  while (offset < buffer.length && offset - start < 10) {
    const byte = buffer[offset] ?? 0;
    offset += 1;
    unsigned |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) {
      const signed = (unsigned >> 1n) ^ -(unsigned & 1n);
      const value = Number(signed);
      if (!Number.isSafeInteger(value)) throw new FishNetProtocolError("packed integer exceeds JavaScript's safe range");
      return { value, nextOffset: offset };
    }
    shift += 7n;
  }
  throw new FishNetProtocolError(`unterminated packed integer at byte ${start}`);
}

function requireBytes(buffer: Buffer, offset: number, count: number, description: string): void {
  if (buffer.length - offset < count) {
    throw new FishNetProtocolError(`${description} needs ${count} bytes at byte ${offset}; ${buffer.length - offset} remain`);
  }
}
