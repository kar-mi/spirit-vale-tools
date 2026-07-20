# Spirit Vale Capture

A Windows packet-capture foundation with a Bun/TypeScript API. It uses the user's existing Npcap installation directly in passive, non-promiscuous mode and never drops, modifies, or injects traffic.

See the [documentation index](docs/README.md) for capture operation, packet decoding, and package-routing guides.

## Prerequisites

- Windows 10 or 11 x64
- A current [Npcap](https://npcap.com/#download) installation
    - **Important**: During installation, select **"Install Npcap in WinPcap API-compatible Mode"** and leave **"Restrict Npcap driver's access to Administrators only"** unchecked
    - ![option](docs/npcap_option.png)
- Bun 1.3 or newer (only needed to build or run from source)

## Installation

### Option 1: Portable release

Download the latest `Spirit-Vale-portable-win-x64-v*.zip` from the GitHub Releases page, extract the complete folder, and run `Spirit Vale.exe`. Settings, capture sessions, browser state, caches, and temporary runtime files are written beneath the extracted folder's `data` directory instead of Windows AppData. Always use the top-level executable so the portable environment is applied.

### Option 2: Build from source

Follow the [Setup](#setup) and [Portable Windows build](#portable-windows-build) sections below.

## Setup

```powershell
bun install
bun test
bun run build
```

## Portable Windows build

Create the self-contained Windows x64 ZIP and its SHA-256 checksum with:

```powershell
bun run package:portable
```

The ZIP contains a versioned folder with a top-level `Spirit Vale.exe`. All application-owned writable state remains beneath that extracted folder's `data` directory. Npcap is still installed separately.

## Spirit Vale capture

The capture and protocol reference lives in [`docs/`](docs/README.md):

- [Packet Capture Workflow](docs/packet-capture-workflow.md) covers CLI options, adapter selection, and troubleshooting.
- [Packet Decoding](docs/packet-decoding.md) explains the LiteNetLib and FishNet structures, state, and public packet types.
- [Packet Routing](docs/packet-routing.md) shows how core packet types feed the combat, character, rewards, and market packages.

`FishNetCombatTracker` converts decoded packets into actor-grouped activation,
per-hit damage, and death events. A death event carries the server's lethal
`Damage` record; `duplicatesDamageEvent` identifies when the same hit was also
emitted as an ordinary damage event at that tick. The tracker does not aggregate
or summarize damage; consumers combine events using the stable actor and
`sourceId` fields. Different overlapping
skills are matched by attacker and damage-source identifiers. Multiple eligible
activations of the same source are reported as ambiguous with every candidate
activation ID instead of being force-assigned.

`@spiritvale/skills` exposes the immutable build-scoped skill catalog and lookup
helpers. Definitions contain the wire ID, public display name, and one or more
of the `active`, `passive`, and `mastery` kinds. Unknown combat source IDs remain
unchanged so incomplete or older catalogs do not suppress events.

`FishNetActorDirectory` consumes the same decoded packet stream and maintains
public player display names by actor ID. Its identity records are lifecycle
events: `upsert` supplies the display name and archetype, `remove` clears a
despawned or reused object ID, and `reset` clears the connection. Combat records
remain numeric and consumers join them using `actorId`, `targetId`, or the
decoded damage attacker ID.

All CLI logs use a versioned JSON Lines envelope containing the session ID,
sequence, recording time, producer, record type, and structured data. Each
command creates a session in the run-local `logs` directory and writes
separate `capture.jsonl`, `combat.jsonl`, or `market.jsonl` streams. Human
status remains on stderr. `--output <path>` overrides the stream destination.

Combat records
include their RPC name, tick, payload byte count, normalized properties, and a
`fields` object containing every decoded RPC field. Visible-player identity
records are emitted automatically when available; combat is still emitted when
an actor has no known display name.

## Passive market decoding

Market decoding reads the game's existing FishNet responses; it does not send,
modify, or inject market requests. The build-matched decoder recognizes the
searchable vendor catalog, auction-house account snapshots, stall metadata,
stall-specific listings, and vending collection results. A collection amount is
reported only when a successful collection is followed by an account snapshot
whose pending balance decreased.

The `market` command requires either `--input <capture.jsonl>` from a capture
session or `--live`. Local
queries support `--query`, `--item-type`, `--min-price`, `--max-price`,
`--sort price-asc|price-desc`, and `--limit`. Repeat `--stat <name>[:minimum]`
to filter equipment and artifacts by their displayed substat values. The encoded
roll is converted with the same scaling used by the game. Multiple stat filters require
all requested stats by default; `--stat-mode any` switches to any-stat matching.
Stat names are case-insensitive and ignore spaces, hyphens, and underscores.
Equipment IDs from the supported build use a build-matched substat table, including
weapons, armor, accessories, eyewear, back equipment, and grimoires. An unknown item ID
falls back to stat-based inference; if that cannot distinguish two tables with different
caps, output shows `roll:<value>` and a minimum filter does not match the unresolved value.
Listing names use a build-matched item catalog for all market item types. When an ID is
not in that catalog, the decoder falls back to the live market name and then the raw ID.
Market snapshots and query results are always written to `market.jsonl`;
64-bit prices, balances, and timestamps are represented as decimal strings.

The market browser is the Market window of the desktop app. It follows the
current market session in the shared log directory and performs text,
stat-range, sorting, and pagination queries locally. The desktop app captures
market data itself; launch it and open Market from the launcher:

```powershell
bun run dev
```

`bun run market -- --live` remains available for a headless CLI session that
writes the same `market.jsonl` stream.

The browser does not initiate game requests; opening the in-game market supplies
the responses that populate the local session.

## Mob rewards

The mob rewards package combines a build-matched catalog with passive live
observations. Catalog values are the configured base XP, coins, and drop chances;
live records contain the actual character XP, job XP, coins, and collected items
seen after party and player modifiers. Only a unique mob-death correlation enters
the per-mob totals. Ambiguous or unrelated reward updates are counted separately.

The rewards UI is the Rewards window of the desktop app; launch the app and
open Rewards from the launcher:

```powershell
bun run dev
```

`bun run rewards` remains available for a headless CLI session that records
the same passive rewards stream.

The UI provides the configured catalog, a confirmed recent-kill feed, per-mob
session totals, and JSON Lines replay. It does not send or modify game traffic.

```ts
import { PacketCapture } from "@spiritvale/core/capture";
import { FishNetMarketTracker } from "@spiritvale/market";

const capture = new PacketCapture();
const market = new FishNetMarketTracker();
capture.on("fishNetPacket", packet => {
  for (const event of market.consume(packet)) console.log(event.kind);
});

await capture.start({ protocols: ["udp"], decodeFishNet: true });

const cheapest = market.query({
  text: "example item",
  stats: [{ stat: "Str", minValue: 3 }, { stat: "AtkMult" }],
  statMode: "all",
  sort: "price-asc",
  limit: 10,
});
```

Live capture does not require the application to be elevated when Npcap was installed without its administrator-only restriction. The Tools launcher reports missing or restricted installations and provides automatic or manual network-adapter selection.

## Third-party runtime

Release bundles do not redistribute Npcap. Users install and update Npcap separately under its own license.
