import {
  isPlausibleBoundary,
  LINKED_PACKET_NAMES,
  STARTING_RPC_LINK_ID,
} from "./protocol.ts";
import type { RpcLinkRegistrationState } from "./protocol.ts";
import { bindBehaviourTypes } from "./rpc-resolution.ts";
import { checkedEnd, readNetworkObjectReference, readSignedPackedWhole, requireBytes } from "./wire-reader.ts";
import type { FishNetRpcMap } from "./types.ts";

export interface SpawnCandidate {
  end: number;
  objectId: number;
  registrations: Array<[number, RpcLinkRegistrationState]>;
  componentBindings: Array<[string, string]>;
  spawnType: "scene" | "instantiated" | "predicted";
  collectionId: number;
  ownerConnectionId: number;
  prefabId?: number;
  sceneId?: bigint;
  nested: boolean;
  /** Game-defined WritePayload bytes preceding the RPC link and SyncType sections. */
  customPayload: Buffer;
  syncPayload: Buffer;
}

export function parseObjectSpawn(
  buffer: Buffer,
  start: number,
  map: FishNetRpcMap | undefined,
): SpawnCandidate | undefined {
  try {
    requireBytes(buffer, start, 1, "spawn flags");
    const flags = buffer[start] ?? 0;
    if ((flags & ~0x1f) !== 0) return undefined;
    const kindBits = flags & 0x0e;
    if (kindBits !== 0x02 && kindBits !== 0x04 && kindBits !== 0x08) return undefined;
    const spawnType = kindBits === 0x02 ? "scene" : kindBits === 0x04 ? "instantiated" : "predicted";
    const nested = (flags & 0x01) !== 0;
    let offset = start + 1;

    if (nested) {
      requireBytes(buffer, offset, 1, "nested object component");
      offset += 1;
      const parent = readNetworkObjectReference(buffer, offset);
      offset = parent.nextOffset;
      requireBytes(buffer, offset, 1, "nested parent component");
      offset += 1;
    }

    const object = readSignedPackedWhole(buffer, offset);
    if (object.value < 0) return undefined;
    offset = object.nextOffset;
    requireBytes(buffer, offset, 2, "spawn collection id");
    const collectionId = buffer.readUInt16LE(offset);
    offset += 2;
    offset = readSignedPackedWhole(buffer, offset).nextOffset;
    const owner = readSignedPackedWhole(buffer, offset);
    offset = owner.nextOffset;
    requireBytes(buffer, offset, 1, "transform flags");
    const transformFlags = buffer[offset] ?? 0;
    if ((transformFlags & ~0x07) !== 0) return undefined;
    offset += 1;
    if ((transformFlags & 0x01) !== 0) offset = checkedEnd(buffer, offset, 12);

    const rotations = (transformFlags & 0x02) !== 0 ? [8, 4, 16] : [0];
    const candidates: SpawnCandidate[] = [];
    for (const rotationBytes of rotations) {
      try {
        let candidateOffset = checkedEnd(buffer, offset, rotationBytes);
        if ((transformFlags & 0x04) !== 0) candidateOffset = checkedEnd(buffer, candidateOffset, 12);
        let sceneId: bigint | undefined;
        let prefabId: number | undefined;
        if ((flags & 0x02) !== 0) {
          requireBytes(buffer, candidateOffset, 8, "spawn scene id");
          sceneId = buffer.readBigUInt64LE(candidateOffset);
          candidateOffset += 8;
        } else {
          const prefab = readSignedPackedWhole(buffer, candidateOffset);
          if (prefab.value < 0) continue;
          prefabId = prefab.value;
          candidateOffset = prefab.nextOffset;
        }

        requireBytes(buffer, candidateOffset, 4, "spawn payload length");
        const payloadLength = buffer.readUInt32LE(candidateOffset);
        const customPayloadStart = candidateOffset + 4;
        candidateOffset = checkedEnd(buffer, customPayloadStart, payloadLength);
        const customPayload = buffer.subarray(customPayloadStart, candidateOffset);

        requireBytes(buffer, candidateOffset, 2, "RPC Link segment length");
        const linksLength = buffer.readUInt16LE(candidateOffset);
        const linksStart = candidateOffset + 2;
        const linksEnd = checkedEnd(buffer, linksStart, linksLength);
        const registrations = parseLinkRegistrations(buffer, linksStart, linksEnd, object.value);
        if (!registrations) continue;
        const componentBindings = bindBehaviourTypes(registrations, map);
        candidateOffset = linksEnd;

        requireBytes(buffer, candidateOffset, 4, "spawn SyncType length");
        const syncLength = buffer.readUInt32LE(candidateOffset);
        const syncStart = candidateOffset + 4;
        candidateOffset = checkedEnd(buffer, syncStart, syncLength);
        const syncPayload = buffer.subarray(syncStart, candidateOffset);
        if (!isPlausibleBoundary(buffer, candidateOffset)) continue;
        candidates.push({
          end: candidateOffset,
          objectId: object.value,
          registrations,
          componentBindings,
          spawnType,
          collectionId,
          ownerConnectionId: owner.value,
          prefabId,
          sceneId,
          nested,
          customPayload,
          syncPayload,
        });
      } catch {
        // Try the next supported quaternion packing width.
      }
    }

    const unique = new Map<string, SpawnCandidate>();
    for (const candidate of candidates) {
      const links = candidate.registrations
        .map(([id, value]) => `${id}:${value.componentIndex}:${value.rpcHash}:${value.packetName}`)
        .join(",");
      unique.set(`${candidate.end}|${links}`, candidate);
    }
    return unique.size === 1 ? unique.values().next().value : undefined;
  } catch {
    return undefined;
  }
}

function parseLinkRegistrations(
  buffer: Buffer,
  start: number,
  end: number,
  objectId: number,
): Array<[number, RpcLinkRegistrationState]> | undefined {
  const registrations: Array<[number, RpcLinkRegistrationState]> = [];
  const seen = new Set<number>();
  let offset = start;
  while (offset < end) {
    if (end - offset < 3) return undefined;
    const componentIndex = buffer[offset] ?? 0;
    const count = buffer.readUInt16LE(offset + 1);
    if (count < 1 || count > Math.floor((end - offset - 3) / 6)) return undefined;
    offset += 3;
    for (let index = 0; index < count; index += 1) {
      if (end - offset < 6) return undefined;
      const linkId = buffer.readUInt16LE(offset);
      const rpcHash = buffer.readUInt16LE(offset + 2);
      const packetName = LINKED_PACKET_NAMES.get(buffer.readUInt16LE(offset + 4));
      if (linkId < STARTING_RPC_LINK_ID || !packetName || seen.has(linkId)) return undefined;
      seen.add(linkId);
      registrations.push([linkId, { objectId, componentIndex, rpcHash, packetName }]);
      offset += 6;
    }
  }
  return offset === end ? registrations : undefined;
}
