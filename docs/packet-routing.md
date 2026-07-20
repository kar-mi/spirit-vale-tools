# Packet routing

`@spiritvale/core` owns packet capture and protocol decoding. Other packages
interpret the resulting typed FishNet stream for a specific feature. This keeps
transport and wire-format knowledge in one place and lets domain packages
remain testable with synthetic `DecodedFishNetPacket` values.

## Type handoff

```mermaid
flowchart TD
  C[@spiritvale/core/capture] --> U[CapturedUdpPacket]
  U --> L[CapturedLiteNetLibPacket]
  L --> F[CapturedFishNetPacket]
  F --> UI[UI CaptureCoordinator]
  UI --> COM[@spiritvale/combat]
  UI --> CHR[@spiritvale/character]
  UI --> REW[@spiritvale/rewards]
  UI --> MAR[@spiritvale/market]
  COM --> LOG[@spiritvale/logging]
  REW --> LOG
  MAR --> LOG
```

| Type | Owner | What it represents | Typical consumer |
| --- | --- | --- | --- |
| `CapturedTransportPacket` | core | Normalized TCP or UDP metadata and raw transport payload | capture diagnostics/CLI |
| `CapturedUdpPacket` | core | UDP branch of the transport union | LiteNetLib decoder |
| `CapturedLiteNetLibPacket` | core | A logical LiteNetLib leaf plus its UDP source and merge path | CLI/replay, FishNet decoder |
| `DecodedFishNetPacket` | core | A decoded FishNet message; usable without live-capture provenance | domain trackers, replay |
| `CapturedFishNetPacket` | core | A decoded FishNet message plus LiteNetLib and connection provenance | desktop routing, character tracking |

`PacketCapture` emits `packet` for TCP only, `udpPacket` for UDP only,
`transportPacket` for both union branches, `liteNetPacket` for each LiteNetLib
leaf, and `fishNetPacket` for each decoded FishNet message. The last event is
the normal live-capture handoff to feature packages.

## Package responsibilities

| Package | Input from the decoded stream | Output/responsibility |
| --- | --- | --- |
| `@spiritvale/core` | Npcap frames and optional typed map configuration | Capture events, protocol types, LiteNetLib leaves, FishNet packets, RPC/SyncType/broadcast resolution |
| `@spiritvale/combat` | `DecodedFishNetPacket` | Actor identities plus combat activation, damage, and death events |
| `@spiritvale/character` | `CapturedFishNetPacket` | Local-character records and view state from PlayerSave data |
| `@spiritvale/rewards` | `DecodedFishNetPacket` | Monster/reward session state and reward events; uses combat context where needed |
| `@spiritvale/market` | `DecodedFishNetPacket` | Market response decoding, tracker state, queryable market events |
| `@spiritvale/logging` | Domain events and diagnostics | Versioned JSON Lines session streams; it does not decode packets |
| `@spiritvale/items` and `@spiritvale/skills` | Build fingerprint/catalog lookups | Static item and skill metadata used to enrich domain output; neither parses transport bytes |

The desktop `CaptureCoordinator` is the live fan-out point. It starts core
capture with UDP and FishNet decoding enabled. Character packets are considered
before active-connection admission so a valid local snapshot survives a
connection overlap; admitted packets then flow to actor, combat, rewards, and
market consumers before their resulting events are written to separate log
streams. The CLI uses the same core types for live dumps and replay; replay
retains a session decoder so link and split state behave like live capture.

Combat identity matching uses the CharacterData UID as an internal stable key;
Steam and account identifiers are not used. Shareable combat records may retain
the UID, visible IGN, actor ID, owner connection ID, and replay timing, but
exclude raw protocol payloads, arbitrary decoded fields, coordinates, and
diagnostics.

## Adding a new packet consumer

1. Prefer `DecodedFishNetPacket` unless the feature truly needs connection or
   UDP/LiteNetLib provenance; use `CapturedFishNetPacket` in that case.
2. Filter on resolved names, packet kinds, and verified fields where possible.
   Treat missing names, fields, and behaviour metadata as normal protocol
   incompleteness rather than guessing.
3. Keep feature state in the domain tracker and reset it on the applicable
   authenticated/disconnect lifecycle events.
4. Route the tracker from the desktop coordinator and/or CLI only after its
   pure decoding behavior has synthetic unit coverage.

For an explanation of the underlying byte layouts and stateful decoding rules,
see [Packet Decoding](packet-decoding.md).
