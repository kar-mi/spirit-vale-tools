# @kar-mi/spirit-vale-tools-combat

Spirit Vale combat event tracking and replay utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-combat
```

## Usage

```ts
import { FishNetCombatTracker, LiveCombatService } from "@kar-mi/spirit-vale-tools-combat";

const tracker = new FishNetCombatTracker();
const meter = new LiveCombatService({ personalName: "MyCharacter" });

// packet: DecodedFishNetPacket from @kar-mi/spirit-vale-tools-capture
for (const event of tracker.consume(packet)) {
  meter.consumeCombat(event, Date.now());
}

const { current } = meter.getState();
if (current) console.log(current.dps.partyDps, current.dps.actors);
```

To build encounters yourself rather than through the live service, drive
`DamageReducer` and render each finished encounter with `renderEncounter`.

Feed the tracker every decoded FishNet packet from live capture or replay. Use
`FishNetActorDirectory` to resolve actor identities and `loadDpsReplay` /
`DpsSessionLogFollower` to rebuild encounters from recorded log sessions.

`DpsSessionLogFollower` can be followed rather than polled, which is what an
overlay should do — it wakes on a filesystem event instead of on a timer, and
yields only batches that carry something:

```ts
const follower = DpsSessionLogFollower.watch();
for await (const batch of follower) {
  if (batch.changed) apply(batch.events);
}
follower.close();
```

Each batch carries `changed` and `revision`, so a consumer can skip re-projecting
when the reducer state did not move. `FishNetStatusTracker` exposes the same
`revision` alongside `nextExpiryAtMs()`, which says when the next status is due
to lapse — enough to sleep until a chip actually disappears rather than ticking.

For bounded live UI state, use `LiveCombatService`. It exposes the current and
latest finished encounter with DPS, incoming damage-per-second (TPS), and
healing-per-second (HPS) rows without retaining the full session history.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
