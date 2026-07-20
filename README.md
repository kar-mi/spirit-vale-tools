# Spirit Vale Capture

A Windows packet-capture foundation with a Bun/TypeScript API. It uses the user's existing Npcap installation directly in passive, non-promiscuous mode and never drops, modifies, or injects traffic.

See [Packet Capture Workflow](docs/packet-capture-workflow.md) for the complete build, operation, integration, and troubleshooting guide.

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

Run:

```powershell
bun run capture:dump -- --duration 10
```

The dump command follows every `SpiritVale.exe` PID across restarts and writes only that process's TCP and UDP payloads to a new JSON Lines session. It refreshes Windows' PID-owned endpoint tables while capture is active and keeps unmatched packets for at most one second so a newly-created socket can be attributed after it appears in the table.

Useful options:

```powershell
# TCP only, still restricted to SpiritVale.exe
bun run capture:dump -- --protocols tcp

# Follow another executable
bun run capture:dump -- --process OtherGame.exe

# Diagnostic capture without process attribution
bun run capture:dump -- --all-processes --filter "tcp port 443"

# Record transport packets and decoded LiteNetLib 1.x leaf packets
bun run capture:dump -- --protocols udp --decode-litenetlib

# Add stateful FishNet bundle, split-packet, and RPC Link decoding
bun run capture:dump -- --protocols udp --decode-fishnet

# Record only chronological combat and visible-player identity events
bun run capture:dump -- --protocols udp --combat-only

# Passively decode and search market data from a capture session
bun run market -- --input <capture.jsonl> --query <item-name>

# Require equipment or artifacts with both requested stats and at least +3 Strength
bun run market -- --input <capture.jsonl> --query <item-name> --stat Str:3 --stat AtkMult

# Watch market responses from the live game connection without sending packets
bun run market -- --live --query <item-name>

# Select a different bundled build map when more versions are registered
bun run capture:dump -- --protocols udp --decode-fishnet --fishnet-build <build-fingerprint>
```

`--decode-fishnet` implies `--decode-litenetlib`. It follows RPC Link
registrations from object spawns, reassembles split messages, and emits every
safely delimited message in a transport bundle. Method names are emitted only
when the registered RPC kind and compact wire hash select one verified definition.
The decoder may also infer a missing component type when a fixed RPC
selects exactly one behaviour; ambiguous hashes remain unnamed until stronger
session evidence appears. Ordered structured parameters are decoded only when
their generated writer codecs are present in the map.

FishNet decoding uses the current bundled, game-build-fingerprinted TypeScript
definitions by default. Typed map objects supplied through the core API override
the bundled map. The fingerprint is an offline compatibility key for selecting
matching protocol maps and game-data catalogs; FishNet does not exchange or
require it during connection setup. Older maps remain selectable by their full
fingerprint when a new game build is added.

Static analysis identified Unity `6000.0.64f1`, IL2CPP metadata `31.1`, and the
FishNet packet identifier table used by the decoder. Native initialization
sequences verified 304 compact RPC registrations across game and FishNet
behaviours; generated method-name suffixes are not treated as wire values.

A sanitized replay of the latest capture mapped every observed spawn RPC-link
registration to a unique behaviour fingerprint. It named 6,721 structurally
resolved RPC Links and 1,434 fixed ServerRpc calls, associated 6,182 SyncType
messages with behaviours, named all 84 broadcasts, and completed without
replay failures.

The build-scoped skill catalog contains 390 unique active, passive, and mastery
IDs extracted from public game configuration. Shared passive/mastery records are
represented once with both kinds. Combat labels resolve from this catalog, with
compatible semantic maps retained as explicit overrides for legacy builds.

`--filter` uses standard libpcap/BPF syntax. Use `--adapter <Npcap device name>` for a manual adapter override; omit it to follow Windows' default route automatically.

## Public API

```ts
import { FishNetSessionDecoder, decodeFishNetBundle } from "@spiritvale/core";
import { PacketCapture } from "@spiritvale/core/capture";
import { FishNetCombatTracker } from "@spiritvale/combat";
import { resolveFishNetSkillDisplayName } from "@spiritvale/skills";

const capture = new PacketCapture();
capture.on("packet", packet => {
  console.log(packet.sourceIP, packet.destinationIP, packet.payload);
});
capture.on("udpPacket", packet => {
  console.log("udp", packet.sourcePort, packet.destinationPort, packet.payload);
});
capture.on("targetStatus", status => {
  console.log(status.state, status.processIds);
});
capture.on("liteNetPacket", decoded => {
  console.log(decoded.packet.property, decoded.mergePath, decoded.packet.payload);
});
capture.on("fishNetPacket", decoded => {
  console.log(decoded.tick, decoded.packetName, decoded.rpcHash, decoded.rpcName);
});
await capture.start({
  targetProcessName: "SpiritVale.exe",
  protocols: ["tcp", "udp"],
  decodeFishNet: true,
});

declare const payload: Buffer;
const messages = decodeFishNetBundle(payload, { reliable: true });
const session = new FishNetSessionDecoder();
const combat = new FishNetCombatTracker();
console.log(resolveFishNetSkillDisplayName("Whirlwind"));
const linked = session.decode(payload, {
  reliable: true,
  connectionId: "connection-1",
  direction: "inbound",
  channel: 0,
});
for (const packet of linked) {
  for (const event of combat.consume(packet)) console.log(event);
}
```

The existing `packet` event remains TCP-only. `udpPacket` is UDP-only, while `transportPacket` receives both as a discriminated union on `packet.protocol`. LiteNetLib decoding is opt-in and emits one `liteNetPacket` per logical leaf after recursively unpacking merged datagrams. FishNet decoding emits one `fishNetPacket` per safely delimited bundled message, with spawn identity, behaviour type, resolved RPC metadata, SyncType ownership, broadcast identity, and verified common fields when available. Unknown links and ambiguous symbol matches remain numeric. Schema-v2 maps are behaviour-scoped and build-fingerprinted; schema-v1 maps remain supported. Omit `targetProcessName` for an unrestricted diagnostic capture.

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
