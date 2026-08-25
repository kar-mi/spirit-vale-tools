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

The tracker understands fresh and cursor-based search pages, overview and
collection results, vending-stall lifecycle events, and stall listing details.
It accepts only RPCs resolved against the supported build. Numeric identifiers,
prices, versions, and timestamps that use 64-bit wire values remain `bigint`.

Use `replayMarketCapture` to rebuild tracker state from a recorded log session
and `MarketSessionLogFollower` to follow a live session — either by polling it,
or by iterating it (`MarketSessionLogFollower.watch()`), which wakes on a
filesystem event instead of a timer and yields only batches that carry
something. Call `close()` when done.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
