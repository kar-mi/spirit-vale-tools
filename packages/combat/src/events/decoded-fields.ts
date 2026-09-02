import type { DecodedFishNetPacket, FishNetDecodedValue } from "@kar-mi/spirit-vale-tools-capture";

export function field(packet: DecodedFishNetPacket, name: string): FishNetDecodedValue | undefined {
  return packet.decodedFields?.find((candidate) => candidate.name === name)?.value;
}

export function numberField(packet: DecodedFishNetPacket, name: string): number | undefined {
  const value = field(packet, name);
  return typeof value === "number" ? value : undefined;
}

export function nullableStringField(packet: DecodedFishNetPacket, name: string): string | null | undefined {
  const value = field(packet, name);
  return value === null || typeof value === "string" ? value : undefined;
}
