# Packet Capture Workflow

Spirit Vale Tools captures TCP and UDP traffic through the user's existing Npcap installation. Bun loads the Npcap API directly, selects a network adapter, normalizes link-layer frames, and restricts emitted packets to endpoints owned by the configured executable.

The application does not bundle Npcap, install drivers, inject packets, or alter traffic.

## Prerequisites

- Windows 10 or 11 x64
- Bun 1.3 or newer for development
- A current Npcap installation from [npcap.com](https://npcap.com/#download)

To run Spirit Vale Tools without elevation, install Npcap with **Restrict Npcap driver's access to Administrators only** unchecked. If that option is enabled, the launcher reports the installation as administrator-only and does not trigger an unexpected UAC prompt.

## Desktop capture settings

Open the gear button on the main Tools launcher to view Packet capture settings.

- **Backend** is always Npcap.
- **Automatic** selects the adapter whose address owns Windows' lowest-metric default route.
- A manually selected adapter is stored for future launches.
- If a saved adapter is temporarily unavailable, capture falls back to automatic selection and reports the effective adapter.
- Changing adapters restarts capture immediately. If the new adapter cannot be opened, the previous adapter is restored.

The settings panel also reports a missing, administrator-only, or unusable Npcap installation and links to the official download page.

## Command-line capture

Run a process-attributed capture:

```powershell
bun run capture:dump -- --duration 30
```

Useful options:

```powershell
# UDP only
bun run capture:dump -- --protocols udp

# Select a stable Npcap device name
bun run capture:dump -- --adapter <device-name>

# Follow another executable
bun run capture:dump -- --process OtherGame.exe

# Capture without process attribution
bun run capture:dump -- --all-processes

# Apply a standard BPF capture filter
bun run capture:dump -- --all-processes --filter "tcp port 443"

# Decode LiteNetLib and FishNet
bun run capture:dump -- --protocols udp --decode-fishnet
```

The default filter is derived from `--protocols`. Custom filters use standard libpcap/BPF syntax.

## Capture path

1. The application verifies that the loaded capture library identifies itself as Npcap.
2. Npcap enumerates available adapters and the selected adapter is opened in non-promiscuous, immediate, nonblocking mode.
3. Ethernet, VLAN, loopback, raw-IP, and common VPN link-layer frames are reduced to IPv4 or IPv6 packets.
4. TCP and UDP headers and payloads are normalized into the public TypeScript packet types.
5. Windows process and endpoint tables are refreshed while capture is active. Only packets matching endpoints owned by the target executable are emitted.
6. UDP payloads optionally continue through LiteNetLib and FishNet decoding.

Packets that arrive before a new socket appears in the endpoint table are retained only in memory for up to one second, with a maximum of 4,096 packets. Expired unmatched packets are discarded.

## Public API

```ts
import { PacketCapture, getNpcapStatus, listNpcapDevices } from "@spiritvale/core/capture";

const status = await getNpcapStatus();
const devices = status.availability === "ready" ? await listNpcapDevices() : [];

const capture = new PacketCapture();
capture.on("targetStatus", target => console.log(target.state, target.processIds));
capture.on("udpPacket", packet => console.log(packet.sourcePort, packet.destinationPort));
capture.on("fishNetPacket", packet => console.log(packet.tick, packet.packetName));

await capture.start({
  protocols: ["udp"],
  targetProcessName: "SpiritVale.exe",
  deviceName: devices[0]?.name,
  decodeFishNet: true,
});
```

Omit `deviceName` for automatic adapter selection. Omit `targetProcessName` only for unrestricted diagnostics.

## Troubleshooting

### Npcap is not installed

Use the launcher link to install the current Npcap release, then refresh the settings panel.

### Npcap is administrator-only

Reinstall Npcap with its administrator-only restriction unchecked. Spirit Vale Tools does not bypass that security setting.

### No usable adapters are shown

Confirm Npcap is running correctly and refresh the adapter list. VPN software may expose an additional adapter that must be selected manually.

### Target remains waiting

Confirm the executable is running and that its filename matches `targetProcessName`. The comparison uses the executable filename, not the window title.

### Capture is active but no packets appear

- Try Automatic adapter selection first, then the adapter carrying the game's route.
- Remove a restrictive BPF filter.
- Use `--all-processes` temporarily to separate adapter problems from process attribution problems.
- Confirm the configured protocol includes the game's traffic.

## Safety boundaries

- Capture is passive and non-promiscuous; it does not inject, drop, or modify packets.
- Npcap must be installed separately under its own license.
- Device identifiers and adapter addresses remain in local settings/runtime state and are not written to tracked fixtures or diagnostic logs.
- UDP attribution is endpoint-based; deliberate port sharing by multiple processes can be ambiguous.
