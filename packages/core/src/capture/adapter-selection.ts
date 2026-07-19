import type { NpcapDevice } from "./npcap.ts";

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
  const defaultAddress = await defaultRouteAddress();
  const automatic = (defaultAddress
    ? devices.find((device) => device.addresses.includes(defaultAddress))
    : undefined) ?? devices.find(isUsable) ?? devices[0];
  return {
    device: automatic,
    usedFallback: Boolean(requestedName),
    ...(requestedName && automatic
      ? { detail: "The saved adapter is unavailable; capture is using the automatically selected adapter" }
      : {}),
  };
}

export function chooseDeviceByRouteOutput(devices: readonly NpcapDevice[], output: string): NpcapDevice | undefined {
  const routes = output.split(/\r?\n/).flatMap((line) => {
    const columns = line.trim().split(/\s+/);
    if (columns[0] !== "0.0.0.0" || columns[1] !== "0.0.0.0" || columns.length < 5) return [];
    const metric = Number(columns[4]);
    return [{ address: columns[3]!, metric: Number.isFinite(metric) ? metric : Number.MAX_SAFE_INTEGER }];
  }).sort((left, right) => left.metric - right.metric);
  for (const route of routes) {
    const match = devices.find((device) => device.addresses.includes(route.address));
    if (match) return match;
  }
  return undefined;
}

async function defaultRouteAddress(): Promise<string | undefined> {
  try {
    const child = Bun.spawn({
      cmd: ["route.exe", "PRINT", "0.0.0.0"],
      stdout: "pipe",
      stderr: "ignore",
      windowsHide: true,
    });
    const output = await new Response(child.stdout).text();
    if (await child.exited !== 0) return undefined;
    const match = output.split(/\r?\n/).flatMap((line) => {
      const columns = line.trim().split(/\s+/);
      if (columns[0] !== "0.0.0.0" || columns[1] !== "0.0.0.0" || columns.length < 5) return [];
      return [{ address: columns[3]!, metric: Number(columns[4]) }];
    }).sort((left, right) => left.metric - right.metric)[0];
    return match?.address;
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
