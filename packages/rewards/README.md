# @kar-mi/spirit-vale-tools-rewards

Spirit Vale reward tracking and replay utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-rewards
```

## Usage

```ts
import {
  FishNetMobRewardTracker,
  loadBundledMobRewardCatalog,
  queryMobRewardCatalog,
} from "@kar-mi/spirit-vale-tools-rewards";

const tracker = new FishNetMobRewardTracker();

// packet: DecodedFishNetPacket from @kar-mi/spirit-vale-tools-capture
for (const event of tracker.consume(packet)) {
  console.log(event);
}

const catalogMobs = queryMobRewardCatalog(loadBundledMobRewardCatalog(), { text: "slime" });
console.log(catalogMobs.length);
```

Use `loadRewardReplay` to rebuild reward state from a recorded log session and
`RewardSessionLogFollower` to follow a live session.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
