import type { NpcapDevice } from "./npcap.ts";
import { defaultRouteIpv4Address } from "./win32-system.ts";

export interface AdapterResolution {
  device?: NpcapDevice;
  usedFallback: boolean;
  detail?: string;
}

export async function resolveCaptureDevice(
  devices: readonly NpcapDevice[],
  requestedName?: string,
): Promise<AdapterResolution> {
  if (requestedName) {
    const requested = devices.find((device) => device.name === requestedName);
    if (requested) return { device: requested, usedFallback: false };
  }
  const automatic = defaultRouteDevice(devices) ?? devices.find(isUsable) ?? devices[0];
  return {
    device: automatic,
    usedFallback: Boolean(requestedName),
    ...(requestedName && automatic
      ? { detail: "The saved adapter is unavailable; capture is using the automatically selected adapter" }
      : {}),
  };
}

export function chooseDeviceByRouteAddress(
  devices: readonly NpcapDevice[],
  address: string,
): NpcapDevice | undefined {
  return devices.find((device) => device.addresses.includes(address));
}

function defaultRouteDevice(devices: readonly NpcapDevice[]): NpcapDevice | undefined {
  try {
    const address = defaultRouteIpv4Address();
    return address ? chooseDeviceByRouteAddress(devices, address) : undefined;
  } catch {
    return undefined;
  }
}

function isUsable(device: NpcapDevice): boolean {
  const label = `${device.name} ${device.description}`.toLowerCase();
  return !device.loopback
    && device.addresses.length > 0
    && !["bluetooth", "wan miniport", "vmware", "hyper-v", "zerotier"].some((value) => label.includes(value));
}
