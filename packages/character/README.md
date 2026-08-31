# @kar-mi/spirit-vale-tools-character

Spirit Vale character decoding and stat calculation utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-character
```

## Usage

```ts
import { FishNetCharacterTracker, calculateCharacterStats } from "@kar-mi/spirit-vale-tools-character";

const tracker = new FishNetCharacterTracker();
tracker.subscribe((state) => console.log(state));

// packet: CapturedFishNetPacket from @kar-mi/spirit-vale-tools-capture
tracker.consume(packet);

// Server-actual local-player resources, including HealthComponent.barrierSync.
const shield = tracker.state().records?.currentShield;

const stats = calculateCharacterStats(42, { STR: 30, VIT: 25, AGI: 20, DEX: 18, INT: 5, LUK: 12 });
for (const stat of stats) {
  console.log(stat.label, stat.value);
}
```

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
