# @kar-mi/spirit-vale-tools-capture

Passive Windows packet capture and Spirit Vale protocol decoding for Bun.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-capture
```

## Exports

- `@kar-mi/spirit-vale-tools-capture` — protocol decoding types and helpers
- `@kar-mi/spirit-vale-tools-capture/capture` — passive packet capture (requires Npcap)
- `@kar-mi/spirit-vale-tools-capture/wire-reader` — FishNet wire-format reader

## Usage

```ts
import { PacketCapture, getNpcapStatus } from "@kar-mi/spirit-vale-tools-capture/capture";

const status = await getNpcapStatus();
if (status.availability !== "ready") throw new Error("Npcap is not ready");

const capture = new PacketCapture();
capture.on("fishNetPacket", (packet) => {
  console.log(packet.tick, packet.packetName);
});

await capture.start({
  protocols: ["udp"],
  targetProcessName: "SpiritVale.exe",
  decodeFishNet: true,
});
```

Import from `/capture` only in a Bun main process; it exposes the Windows Npcap
APIs. The package root exports the pure protocol decoders
(`decodeLiteNetLibDatagram`, `decodeFishNetBundle`, `FishNetSessionDecoder`)
for replay and testing without a live capture.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
