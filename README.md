# Spirit Vale Capture

A Windows packet-capture foundation with a Bun/TypeScript API and an isolated Rust helper. The helper uses WinDivert in sniff and receive-only mode; it never drops, modifies, or injects traffic.

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

## Raw capture

Start PowerShell as Administrator, then run:

```powershell
bun run capture:dump -- --filter "tcp" --duration 10
```

The filter uses [WinDivert filter syntax](https://reqrypt.org/windivert-doc.html#filter_language). Use `--helper <path>` to test a specific helper executable.

## Public API

```ts
import { PacketCapture } from "spiritvale-pcap";

const capture = new PacketCapture();
capture.on("packet", packet => {
  console.log(packet.sourceIP, packet.destinationIP, packet.payload);
});
await capture.start({ filter: "tcp" });
```

Live capture requires the Bun parent process to be elevated in this first milestone. A future elevated broker or Windows service can remove that requirement from the parent application.

## Third-party runtime

Release bundles include unmodified WinDivert 2.2.2 runtime files under the LGPLv3 option, its full license, attribution, and upstream source location. Review the applicable license obligations before distributing a product.
