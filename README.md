# Spirit Vale Capture

A Windows packet-capture foundation with a Bun/TypeScript API and an isolated Rust helper. The helper uses WinDivert in sniff and receive-only mode; it never drops, modifies, or injects traffic.

See [Packet Capture Workflow](docs/packet-capture-workflow.md) for the complete build, operation, integration, and troubleshooting guide.

## Prerequisites

- Windows 10 or 11 x64
- Bun 1.3 or newer
- Rust stable with the `x86_64-pc-windows-msvc` target
- Visual Studio 2022 Build Tools with **Desktop development with C++**
- An elevated terminal for live capture

## Setup

```powershell
bun install
bun run build:native
bun test
bun run test:native
```

`build:native` downloads WinDivert 2.2.2 from its official distribution URL, verifies its pinned SHA-256, builds the Rust helper, and creates `dist/native/win-x64`.

## Spirit Vale capture

Start PowerShell as Administrator, then run:

```powershell
bun run capture:dump -- --duration 10
```

The dump command follows every `SpiritVale.exe` PID across restarts and emits only that process's TCP and UDP payloads. It refreshes Windows' PID-owned endpoint tables every 100 ms and keeps unmatched packets for at most one second so a newly-created socket can be attributed after it appears in the table.

Useful options:

```powershell
# TCP only, still restricted to SpiritVale.exe
bun run capture:dump -- --protocols tcp

# Follow another executable
bun run capture:dump -- --process OtherGame.exe

# Diagnostic capture without process attribution
bun run capture:dump -- --all-processes --filter "tcp.DstPort == 443"

# Preserve raw lines and add decoded LiteNetLib 1.x leaf packets
bun run capture:dump -- --protocols udp --decode-litenetlib

# Add stateful FishNet bundle, split-packet, and RPC Link decoding
bun run capture:dump -- --protocols udp --decode-fishnet

# Supply an external build-matched RPC map
bun run capture:dump -- --protocols udp --decode-fishnet --fishnet-map <map.json>

# Print only chronological skill, attack, and per-hit damage events
bun run capture:dump -- --protocols udp --combat-only

# Emit combat and visible-player identity records as complete JSON objects per line
bun run capture:dump -- --protocols udp --combat-json

# Passively decode and search market data from a raw capture log
bun run market -- --input <capture.log> --query <item-name>

# Watch market responses from the live game connection without sending packets
bun run market -- --live --query <item-name> --json

# Select a different bundled build map when more versions are registered
bun run capture:dump -- --protocols udp --decode-fishnet --fishnet-build <build-fingerprint>
```

`--decode-fishnet` implies `--decode-litenetlib`. It follows RPC Link
registrations from object spawns, reassembles split messages, and emits every
safely delimited message in a transport bundle. Method names are emitted only
when the registered RPC kind and compact wire hash select one verified symbol.
Schema-v2 decoders may also infer a missing component type when a fixed RPC
selects exactly one behaviour; ambiguous hashes remain unnamed until stronger
session evidence appears. Ordered structured parameters are decoded only when
their generated writer codecs are present in the map.

FishNet decoding uses the current bundled, build-fingerprinted schema by
default. Explicit map objects and `--fishnet-map` override the bundled map.
Bundled versions are selected by their full build fingerprint so older maps can
remain available when a new game build is added.

Static analysis identified Unity `6000.0.64f1`, IL2CPP metadata `31.1`, and the
FishNet packet identifier table used by the decoder. Native initialization
sequences verified 304 compact RPC registrations across game and FishNet
behaviours; generated method-name suffixes are not treated as wire values.

A sanitized replay of the latest capture mapped every observed spawn RPC-link
registration to a unique behaviour fingerprint. It named 6,721 structurally
resolved RPC Links and 1,434 fixed ServerRpc calls, associated 6,182 SyncType
messages with behaviours, named all 84 broadcasts, and completed without
replay failures.

A controlled zone-bootstrap replay isolated six local-character cast pairs in
two repeated three-skill sequences. `SkillsComponent.CastBegin_C` field
`dto.Id` mapped `AxeArc` to Twin Cleave, `AxeVortex` to Vortex Slash, and
`Whirlwind` to Whirlwind. Both repetitions matched. Repeated Inventory and
Skills Window openings produced no unique network transaction in their final
action epochs.

`--filter` uses [WinDivert filter syntax](https://reqrypt.org/windivert-doc.html#filter_language). Use `--helper <path>` to test a specific helper executable.

## Public API

```ts
import { FishNetCombatTracker, FishNetSessionDecoder, PacketCapture, decodeFishNetBundle } from "spiritvale-pcap";

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

`FishNetActorDirectory` consumes the same decoded packet stream and maintains
public player display names by actor ID. Its identity records are lifecycle
events: `upsert` supplies the display name and archetype, `remove` clears a
despawned or reused object ID, and `reset` clears the connection. Combat records
remain numeric and consumers join them using `actorId`, `targetId`, or the
decoded damage attacker ID.

`--combat-json` implies combat-only mode and emits JSON Lines. Combat records
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

The `market` command requires either `--input <capture.log>` or `--live`. Local
queries support `--query`, `--item-type`, `--min-price`, `--max-price`,
`--sort price-asc|price-desc`, and `--limit`. Add `--json` for machine-readable
output; 64-bit prices, balances, and timestamps are emitted as decimal strings.

```ts
import { FishNetMarketTracker, PacketCapture } from "spiritvale-pcap";

const capture = new PacketCapture();
const market = new FishNetMarketTracker();
capture.on("fishNetPacket", packet => {
  for (const event of market.consume(packet)) console.log(event.kind);
});

await capture.start({ protocols: ["udp"], decodeFishNet: true });

const cheapest = market.query({ text: "example item", sort: "price-asc", limit: 10 });
```

Live capture requires the Bun parent process to be elevated in this first milestone. A future elevated broker or Windows service can remove that requirement from the parent application.

## Third-party runtime

Release bundles include unmodified WinDivert 2.2.2 runtime files under the LGPLv3 option, its full license, attribution, and upstream source location. Review the applicable license obligations before distributing a product.
