# Documentation

These guides cover the reusable packages, command-line tools, protocol
implementation, and contributor references.

## Package and CLI guides

- [Capability and CLI guide](features.md) — capture, combat, character,
  rewards, market, logging, and command-line behavior.
- [Packages](packages.md) — installing reusable Bun packages from GitHub
  Packages.
- [Character stat formula comparison](stats/character_stat_formula_comparison.md)
  — notes on calculated character stats.
- [Combat packets](combat/combat-packets.md) — which RPCs become combat events,
  what each carries on the wire, and which feeds are not consumed yet.
- [Healing attribution](combat/healing-attribution.md) — why heal-to-healer
  attribution is best-effort, and its known limitations.
- [Positions and ground loot](positions.md) — consuming world coordinates for
  players, monsters, and dropped items, and why they stay live-only.

## Capture and protocol guides

- [Packet documentation](packet/README.md) — an index of capture, decoding, and
  routing references.
- [Packet capture workflow](packet/packet-capture-workflow.md) — capture
  configuration, adapter selection, command-line options, and troubleshooting.
- [Packet decoding](packet/packet-decoding.md) — wire layers, decoder state, and
  public packet types.
- [Packet routing](packet/packet-routing.md) — how decoded packets reach domain
  packages and CLI consumers.

Spirit Vale Tools performs passive parsing only. It never sends, modifies,
drops, or injects game traffic.
