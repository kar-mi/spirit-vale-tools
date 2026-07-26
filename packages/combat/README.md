# @kar-mi/spirit-vale-tools-combat

Spirit Vale combat event tracking and replay utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-combat
```

## Usage

```ts
import { FishNetCombatTracker, FishNetDpsMeter } from "@kar-mi/spirit-vale-tools-combat";

const tracker = new FishNetCombatTracker();
const meter = new FishNetDpsMeter({ personalName: "MyCharacter" });

// packet: DecodedFishNetPacket from @kar-mi/spirit-vale-tools-capture
for (const event of tracker.consume(packet)) {
  meter.consumeCombat(event, Date.now());
}

for (const encounter of meter.getSnapshots()) {
  console.log(encounter.partyDps, encounter.actors);
}
```

Feed the tracker every decoded FishNet packet from live capture or replay. Use
`FishNetActorDirectory` to resolve actor identities and `loadDpsReplay` /
`DpsSessionLogFollower` to rebuild encounters from recorded log sessions.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
