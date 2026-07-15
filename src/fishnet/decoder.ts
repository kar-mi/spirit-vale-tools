import { classifyPacket, FishNetProtocolError, RPC_PACKET_NAMES } from "./protocol.ts";
import { applyRpcLookup, lookupRpc } from "./rpc-resolution.ts";
import { FishNetSessionDecoder } from "./session-decoder.ts";
import { readSignedPackedWhole, requireBytes } from "./wire-reader.ts";
import type {
  DecodedFishNetPacket,
  FishNetDecodeOptions,
  FishNetRpcMap,
  FishNetRpcPacketName,
} from "./types.ts";

export { FishNetProtocolError, FishNetSessionDecoder };

/**
 * Decodes one FishNet message with its transport tick. This strict, pure API is
 * retained for callers which do not need bundle or session state.
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
  const packetName = classifyPacket(packetId);
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
  if (!spawned) throw new FishNetProtocolError("RPC network object header did not identify a spawned object");

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

  const lookup = lookupRpc(options.rpcMap, undefined, packetName as FishNetRpcPacketName, hash8, decoded.rpcHash16Candidate);
  const wireHash = lookup.wireHash;
  if (wireHash !== undefined) decoded.rpcHash = wireHash;
  const hashBytes = wireHash !== undefined && wireHash > 0xff ? 2 : 1;
  decoded.payload = payload.subarray(offset + hashBytes);
  applyRpcLookup(decoded, lookup);
  return decoded;
}

/** Decodes all safely-delimited messages in one FishNet transport payload. */
export function decodeFishNetBundle(
  payload: Buffer,
  options: FishNetDecodeOptions = { reliable: false },
): DecodedFishNetPacket[] {
  return new FishNetSessionDecoder(options.rpcMap).decode(payload, options);
}
