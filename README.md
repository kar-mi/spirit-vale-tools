# Spirit Vale Capture

A Windows packet-capture foundation with a Bun/TypeScript API and an isolated Rust helper. The helper uses WinDivert in sniff and receive-only mode; it never drops, modifies, or injects traffic.

See [Packet Capture Workflow](docs/packet-capture-workflow.md) for the complete build, operation, integration, and troubleshooting guide.

## Prerequisites

- Windows 10 or 11 x64
- Bun 1.3 or newer
- Rust stable with the `x86_64-pc-windows-msvc` target
- Visual Studio 2022 Build Tools with **Desktop development with C++**
- An elevated terminal for live capture

## Setup

```powershell
bun install
bun run build:native
bun test
bun run test:native
```

`build:native` downloads WinDivert 2.2.2 from its official distribution URL, verifies its pinned SHA-256, builds the Rust helper, and creates `dist/native/win-x64`.

## Spirit Vale capture

Start PowerShell as Administrator, then run:

```powershell
bun run capture:dump -- --duration 10
```

The dump command follows every `SpiritVale.exe` PID across restarts and emits only that process's TCP and UDP payloads. It refreshes Windows' PID-owned endpoint tables every 100 ms and keeps unmatched packets for at most one second so a newly-created socket can be attributed after it appears in the table.

Useful options:

```powershell
# TCP only, still restricted to SpiritVale.exe
bun run capture:dump -- --protocols tcp

# Follow another executable
bun run capture:dump -- --process OtherGame.exe

# Diagnostic capture without process attribution
bun run capture:dump -- --all-processes --filter "tcp.DstPort == 443"
```

`--filter` uses [WinDivert filter syntax](https://reqrypt.org/windivert-doc.html#filter_language). Use `--helper <path>` to test a specific helper executable.

## Public API

```ts
import { PacketCapture } from "spiritvale-pcap";

const capture = new PacketCapture();
capture.on("packet", packet => {
  console.log(packet.sourceIP, packet.destinationIP, packet.payload);
});
capture.on("udpPacket", packet => {
  console.log("udp", packet.sourcePort, packet.destinationPort, packet.payload);
});
capture.on("targetStatus", status => {
  console.log(status.state, status.processIds);
});
await capture.start({
  targetProcessName: "SpiritVale.exe",
  protocols: ["tcp", "udp"],
});
```

The existing `packet` event remains TCP-only. `udpPacket` is UDP-only, while `transportPacket` receives both as a discriminated union on `packet.protocol`. Omit `targetProcessName` for an unrestricted diagnostic capture.

Live capture requires the Bun parent process to be elevated in this first milestone. A future elevated broker or Windows service can remove that requirement from the parent application.

## Third-party runtime

Release bundles include unmodified WinDivert 2.2.2 runtime files under the LGPLv3 option, its full license, attribution, and upstream source location. Review the applicable license obligations before distributing a product.
