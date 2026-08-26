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
best-known tower name, floor, and instance information:

```ts
import { FishNetEternalTowerTracker } from "@kar-mi/spirit-vale-tools-capture";

const tower = new FishNetEternalTowerTracker();
capture.on("fishNetPacket", (packet) => {
  if (!tower.consume(packet)) return;
  const state = tower.current();
  console.log(state.known, state.inTower, state.towerName, state.floor, state.instanceId);
});
```

`known` remains false until either a `DrawTitle` banner matching
`"<tower name>\nFloor <n>"` or a `ClientInstancedMapReady` with
`bindingSlot === "et"` arrives. The former supplies `towerName` and `floor`;
the latter confirms tower entry and can supply `instanceId` and
`instancedMapId`. The tracker preserves tower state across reconnects because
the server may not repeat either signal when reattaching to the same floor. A
non-tower `ClientInstancedMapReady` clears the state.

The assembly-derived RPC map still registers `PlayerController.ETUpdateRun`
and `ETAdvanceFloor` at wire hashes 95 and 96, but observed Eternal Tower
captures contain no invocations of either method. Registration proves that the
methods remain in the build; it does not prove that the server calls them.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
