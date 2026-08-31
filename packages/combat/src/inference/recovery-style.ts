import type { DecodedFishNetPacket } from "@kar-mi/spirit-vale-tools-capture";

export type FishNetRecoveryStyle = "standard" | "passive-regeneration" | "drain" | "unknown";

/** Classifies the generated, structurally decoded FloaterSettings on HealthComponent.Recover_C. */
export function classifyFishNetRecoveryStyle(
  packet: Pick<DecodedFishNetPacket, "networkBehaviourType" | "rpcName" | "decodedFields">,
): FishNetRecoveryStyle {
  if (packet.rpcName !== "Recover_C" || packet.networkBehaviourType !== "HealthComponent") return "unknown";
  const value = (name: string) => packet.decodedFields?.find((field) => field.name === name)?.value;
  const disableFloater = value("settings.DisableFloater");
  const disableSfx = value("settings.DisableSfx");
  const offset = value("settings.Offset");
  const scale = value("settings.Scale");
  if (typeof disableFloater !== "boolean" || typeof disableSfx !== "boolean"
    || typeof offset !== "number" || typeof scale !== "number") return "unknown";
  if (!disableFloater && disableSfx && offset < 0 && scale > 0) return "drain";
  if (!disableFloater && disableSfx && offset === 0 && scale === 0) return "passive-regeneration";
  if (!disableFloater && !disableSfx && offset > 0 && scale === 0) return "standard";
  return "unknown";
}
