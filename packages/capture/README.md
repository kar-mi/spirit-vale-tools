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

### Eternal Tower state

`FishNetEternalTowerTracker` consumes decoded capture packets and exposes the
server-authoritative tower phase and floor:

```ts
import { FishNetEternalTowerTracker } from "@kar-mi/spirit-vale-tools-capture";

const tower = new FishNetEternalTowerTracker();
capture.on("fishNetPacket", (packet) => {
  if (!tower.consume(packet)) return;
  const state = tower.current();
  console.log(state.known, state.inTower, state.active, state.floor);
});
```

`known` remains false until an authoritative `ETUpdateRun` or
`ETAdvanceFloor` arrives. `accept` is an active run that has not entered the
tower instance. A completed run remains `inTower` until the server clears its
run snapshot; `active` is false during that exit window.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
