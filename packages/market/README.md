# @kar-mi/spirit-vale-tools-market

Spirit Vale market decoding and replay utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-market
```

## Usage

```ts
import { FishNetMarketTracker } from "@kar-mi/spirit-vale-tools-market";

const tracker = new FishNetMarketTracker();

// packet: DecodedFishNetPacket from @kar-mi/spirit-vale-tools-capture
tracker.consume(packet);

const listings = tracker.query({ text: "sword", statMode: "all" });
for (const listing of listings) {
  console.log(listing.displayName, listing.shopName);
}
```

Use `replayMarketCapture` to rebuild tracker state from a recorded log session
and `MarketSessionLogFollower` to follow a live session.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
