import type { FishNetRecoveryStyle, FishNetSemanticMap } from "./semantic-map.ts";
import type { DecodedFishNetPacket } from "./types.ts";

/**
 * Classifies the game-defined FloaterSettings trailing a HealthComponent.Recover_C payload.
 * Build-specific payload signatures come from the selected semantic map.
 */
export function classifyFishNetRecoveryStyle(
  packet: Pick<DecodedFishNetPacket, "networkBehaviourType" | "rpcName" | "undecodedPayload">,
  semanticMap: Pick<FishNetSemanticMap, "recoveryStyles"> | undefined,
): FishNetRecoveryStyle {
  const settings = packet.undecodedPayload;
  if (!settings || !semanticMap) return "unknown";
  const payloadHex = settings.toString("hex");
  return semanticMap.recoveryStyles?.find((definition) =>
    definition.rpcName === packet.rpcName
    && (packet.networkBehaviourType === undefined
      || definition.networkBehaviourType === packet.networkBehaviourType)
    && definition.undecodedPayloadHex === payloadHex
  )?.style ?? "unknown";
}
