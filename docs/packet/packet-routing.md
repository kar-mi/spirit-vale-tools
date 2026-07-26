# Packet routing

`@kar-mi/spirit-vale-tools-capture` owns packet capture and protocol decoding. Other packages
interpret the resulting typed FishNet stream for a specific feature. This keeps
transport and wire-format knowledge in one place and lets domain packages
remain testable with synthetic `DecodedFishNetPacket` values.

## Type handoff

```mermaid
flowchart TD
  C[@kar-mi/spirit-vale-tools-capture/capture] --> U[CapturedUdpPacket]
  U --> L[CapturedLiteNetLibPacket]
  L --> F[CapturedFishNetPacket]
  F --> FAN[Consumer fan-out]
  FAN --> COM[@kar-mi/spirit-vale-tools-combat]
  FAN --> CHR[@kar-mi/spirit-vale-tools-character]
  FAN --> REW[@kar-mi/spirit-vale-tools-rewards]
  FAN --> MAR[@kar-mi/spirit-vale-tools-market]
  COM --> LOG[@kar-mi/spirit-vale-tools-logging]
  REW --> LOG
  MAR --> LOG
```

| Type | Owner | What it represents | Typical consumer |
| --- | --- | --- | --- |
| `CapturedTransportPacket` | capture | Normalized TCP or UDP metadata and raw transport payload | capture diagnostics/CLI |
| `CapturedUdpPacket` | capture | UDP branch of the transport union | LiteNetLib decoder |
| `CapturedLiteNetLibPacket` | capture | A logical LiteNetLib leaf plus its UDP source and merge path | CLI/replay, FishNet decoder |
| `DecodedFishNetPacket` | capture | A decoded FishNet message; usable without live-capture provenance | domain trackers, replay |
| `CapturedFishNetPacket` | capture | A decoded FishNet message plus LiteNetLib and connection provenance | live routing, character tracking |

`PacketCapture` emits `packet` for TCP only, `udpPacket` for UDP only,
`transportPacket` for both union branches, `liteNetPacket` for each LiteNetLib
leaf, and `fishNetPacket` for each decoded FishNet message. The last event is
the normal live-capture handoff to feature packages.

## Package responsibilities

| Package | Input from the decoded stream | Output/responsibility |
| --- | --- | --- |
| `@kar-mi/spirit-vale-tools-capture` | Npcap frames and optional typed map configuration | Capture events, protocol types, LiteNetLib leaves, FishNet packets, RPC/SyncType/broadcast resolution |
| `@kar-mi/spirit-vale-tools-combat` | `DecodedFishNetPacket` | Actor identities plus combat activation, damage, and death events |
| `@kar-mi/spirit-vale-tools-character` | `CapturedFishNetPacket` | Local-character records and view state from PlayerSave data |
| `@kar-mi/spirit-vale-tools-rewards` | `DecodedFishNetPacket` | Monster/reward session state and reward events; uses combat context where needed |
| `@kar-mi/spirit-vale-tools-market` | `DecodedFishNetPacket` | Market response decoding, tracker state, queryable market events |
| `@kar-mi/spirit-vale-tools-logging` | Domain events and diagnostics | Versioned JSON Lines session streams; it does not decode packets |
| `@kar-mi/spirit-vale-tools-items` and `@kar-mi/spirit-vale-tools-skills` | Build fingerprint/catalog lookups | Static item and skill metadata used to enrich domain output; neither parses transport bytes |

Consumers own live fan-out. A typical integration starts packet capture with
UDP and FishNet decoding enabled, forwards decoded messages to the applicable
domain trackers, and writes resulting events to separate log streams. The CLI
uses the same capture-package types for live dumps and replay; replay retains a
session decoder so link and split state behave like live capture.

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
4. Route the tracker from the consumer or CLI only after its pure decoding
   behavior has synthetic unit coverage.

For an explanation of the underlying byte layouts and stateful decoding rules,
see [Packet Decoding](packet-decoding.md).
