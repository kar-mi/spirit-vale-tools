# Packet Capture Workflow

This project captures Spirit Vale network traffic through a bundled Rust helper and exposes normalized TCP and UDP packets to Bun. The helper uses WinDivert for passive packet capture and Windows endpoint ownership tables to restrict emitted packets to a target executable.

## Architecture

The capture path has four stages:

1. Bun starts `spiritvale-capture.exe` with a WinDivert filter and optional process name.
2. The Rust helper captures matching network-layer packets through WinDivert.
3. The helper correlates packet endpoints with TCP and UDP endpoints owned by the target process.
4. Normalized binary records are streamed over stdout and decoded into typed Bun events.

The helper opens WinDivert with sniff and receive-only flags. It does not modify, drop, or inject network traffic.

## Prerequisites

- Windows 10 or 11 x64
- Bun 1.3 or newer
- Current stable Rust with the `x86_64-pc-windows-msvc` target
- Visual Studio 2022 Build Tools with the **Desktop development with C++** workload
- An elevated PowerShell terminal for live capture

## Initial setup

Install the JavaScript dependencies:

```powershell
bun install
```

Build and bundle the native runtime:

```powershell
bun run build:native
```

This workflow:

1. Downloads WinDivert 2.2.2 from its official distribution location.
2. Verifies the archive using the pinned SHA-256 digest.
3. Builds the Rust helper in release mode.
4. Copies the helper, WinDivert runtime, license, and notices into `dist/native/win-x64`.

The bundler preserves an identical `WinDivert64.sys` file when the Windows driver has the existing file locked.

## Capturing Spirit Vale

Start PowerShell as Administrator and run:

```powershell
bun run capture:dump
```

The CLI defaults to:

- Executable: `SpiritVale.exe`
- Protocols: TCP and UDP
- WinDivert filter: `tcp or udp`

The capture remains ready if the application is not running. It automatically follows new matching process IDs when Spirit Vale starts or restarts.

Stop capture with Ctrl+C.

In a verified live session, Spirit Vale exchanged bidirectional UDP datagrams with a game endpoint on `135.148.52.81:7007`. The user/client endpoint is intentionally omitted, and the default process-attributed capture does not hard-code the game endpoint. Payload bytes are emitted as raw hexadecimal data until their application-level meanings can be established from additional captures.

A larger capture identified the UDP transport as the LiteNetLib 1.x wire format. To keep the raw datagram line and append one decoded line per logical packet, including children unpacked from merged envelopes, run:

```powershell
bun run capture:dump -- --protocols udp --decode-litenetlib
```

### Common options

Capture for a fixed number of seconds:

```powershell
bun run capture:dump -- --duration 30
```

Capture TCP only:

```powershell
bun run capture:dump -- --protocols tcp
```

Capture UDP only:

```powershell
bun run capture:dump -- --protocols udp
```

Follow another executable:

```powershell
bun run capture:dump -- --process OtherGame.exe
```

Disable process attribution for diagnostics:

```powershell
bun run capture:dump -- --all-processes
```

Use a custom WinDivert filter:

```powershell
bun run capture:dump -- --all-processes --filter "tcp.DstPort == 443"
```

Use a specific helper build:

```powershell
bun run capture:dump -- --helper native/capture-helper/target/release/spiritvale-capture.exe
```

The selected helper directory must also contain `WinDivert.dll` and `WinDivert64.sys`.

## Bun API

```ts
import { PacketCapture } from "spiritvale-pcap";

const capture = new PacketCapture();

capture.on("targetStatus", status => {
  console.log(status.state, status.processName, status.processIds);
});

capture.on("packet", packet => {
  // Existing TCP-only event.
  console.log("tcp", packet.sourceIP, packet.destinationIP, packet.payload);
});

capture.on("udpPacket", packet => {
  console.log("udp", packet.sourcePort, packet.destinationPort, packet.payload);
});

capture.on("transportPacket", packet => {
  // Discriminated TCP | UDP union.
  if (packet.protocol === "tcp") {
    console.log(packet.sequenceNumber, packet.tcpFlags);
  }
});

capture.on("liteNetPacket", decoded => {
  console.log(decoded.packet.property, decoded.mergePath, decoded.packet.payload);
});

await capture.start({
  targetProcessName: "SpiritVale.exe",
  protocols: ["tcp", "udp"],
  decodeLiteNetLib: true,
});
```

Call `await capture.stop()` during application shutdown.

### Events

| Event | Value | Purpose |
| --- | --- | --- |
| `started` | none | The helper opened WinDivert and is ready. |
| `targetStatus` | `CaptureTargetStatus` | Reports `waiting` or `active` and the matching process IDs. |
| `packet` | `CapturedTcpPacket` | Preserved TCP-only packet event. |
| `udpPacket` | `CapturedUdpPacket` | UDP packet event. |
| `transportPacket` | `CapturedTransportPacket` | Receives both TCP and UDP packets. |
| `liteNetPacket` | `CapturedLiteNetLibPacket` | Receives flattened LiteNetLib 1.x leaves when decoding is enabled. |
| `warning` | `string` | Recoverable native warning. |
| `error` | `Error` | Capture or protocol failure. |
| `stopped` | none | Capture has stopped. |

Omit `targetProcessName` to emit packets from every process allowed by the WinDivert filter.

### LiteNetLib decoding

`decodeLiteNetLibDatagram` is also exported as a strict pure function. It returns flattened logical packets with a `mergePath`; malformed input throws `LiteNetLibProtocolError` with the failing byte offset. Live capture handles that error recoverably: the raw UDP event is still emitted, a warning is raised, and only the decoded event is skipped.

The decoder targets the observed LiteNetLib 1.x property table. It handles unreliable, channeled, acknowledgement, ping, pong, control, fragmented channeled, and recursively merged packets. Spirit Vale gameplay payloads remain opaque buffers.

## Capture analysis

| Transport | Packets | Payload bytes | Treatment |
| --- | ---: | ---: | --- |
| UDP game endpoint `167.114.209.119:7004` | 10,834 | 5,355,984 | LiteNetLib 1.x decoded. |
| TCP/TLS remote endpoint `91.99.215.190:443` | 151 | 220,866 | Catalogued only; payload remains encrypted. |

All 2,694 merged UDP datagrams validated structurally and contained 5,778 immediate children. Recursive decoding produced 13,918 leaf packets with no errors: 6,870 unreliable, 3,951 channeled, 2,708 acknowledgements, 195 pings, and 194 pongs. User/client endpoint values are intentionally omitted, and game endpoints are not hard-coded.

## Process attribution

WinDivert's network layer provides packet payloads but not process IDs. The helper therefore joins two sources of information:

- Tool Help process snapshots locate every process whose executable name matches the configured target.
- Windows IP Helper tables provide TCP flows and UDP endpoints owned by those process IDs for IPv4 and IPv6.

The ownership snapshot is refreshed every 100 milliseconds. Packet direction determines which endpoint is local:

- Outbound packet: source is local and destination is remote.
- Inbound packet: destination is local and source is remote.

TCP attribution matches the complete local and remote endpoint tuple. UDP attribution matches the process-owned local address and port, including wildcard-bound addresses.

New sockets can produce traffic before they appear in an ownership table. To cover that interval, the helper retains unmatched packets in memory for no more than one second, with a maximum of 4,096 packets. When the endpoint snapshot changes, newly attributable packets are replayed once. Unmatched packets expire without being emitted or persisted.

## Native protocol

The helper and Bun parent communicate through binary protocol version 2 over stdout. It contains records for:

- Ready and stopped lifecycle notifications
- Normalized TCP packets
- Normalized UDP packets
- Target process status
- Warnings and fatal errors

Human-readable diagnostics go to stderr so they cannot corrupt the binary stdout stream.

The Bun decoder rejects invalid magic, unsupported versions, oversized records, incomplete records, and inconsistent payload lengths.

## Development workflow

After changing TypeScript:

```powershell
bun run typecheck
bun test
```

After changing Rust:

```powershell
cargo fmt --manifest-path native/capture-helper/Cargo.toml
cargo test --manifest-path native/capture-helper/Cargo.toml
cargo clippy --manifest-path native/capture-helper/Cargo.toml --all-targets -- -D warnings
cargo build --manifest-path native/capture-helper/Cargo.toml --release
```

Run the combined project checks:

```powershell
bun run check
bun run format:native
bun run lint:native
```

Refresh the distributable bundle after a release build:

```powershell
bun run bundle:native
```

## Troubleshooting

### Administrator privileges are required

WinDivert could not open its capture handle. Close the current terminal, start PowerShell with **Run as administrator**, and run the command again.

### Target remains in `waiting`

- Confirm the executable is running.
- Confirm its filename is exactly `SpiritVale.exe`, or pass the correct name through `--process`.
- The match is case-insensitive and applies to the executable filename, not the window title.

### Capture is active but no packets appear

- Generate network activity in the target application.
- Remove a restrictive custom `--filter`.
- Try `--all-processes` to determine whether capture works before process attribution.
- Confirm the selected protocols include the traffic being generated.

### Native runtime file is missing

Run `bun run build:native` or `bun run bundle:native`. The helper directory must contain:

- `spiritvale-capture.exe`
- `WinDivert.dll`
- `WinDivert64.sys`

### The WinDivert driver file is locked

Windows can keep the loaded driver file locked after a capture session. The bundler skips the driver copy when the source and destination are identical. If the driver version must change, stop applications using WinDivert or reboot before rebuilding the bundle.

## Limitations and safety boundaries

- Live capture currently requires an elevated Bun parent process.
- UDP attribution is endpoint-based. If multiple processes deliberately share the same UDP address and port, network-layer packets cannot always be assigned uniquely.
- Captured application payloads may still be encrypted by the application protocol.
- The helper captures passively and does not inject or alter packets.
- Delayed-attribution packets exist only in the bounded in-memory queue and are never written to disk by the helper.
