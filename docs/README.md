# Documentation

The README covers installation and the main feature set. These guides contain
the detailed behavior and contributor references.

## Product guides

- [Feature guide](features.md) — combat, overlay, character, rewards, market,
  logging, and command-line tools.
- [Character stat formula comparison](stats/character_stat_formula_comparison.md)
  — notes on calculated character stats.

## Capture and protocol guides

- [Packet documentation](packet/README.md) — an index of the capture, decoding,
  and routing references.
- [Packet capture workflow](packet/packet-capture-workflow.md) — capture
  configuration, adapter selection, command-line options, and troubleshooting.
- [Packet decoding](packet/packet-decoding.md) — wire layers, decoder state, and
  public packet types.
- [Packet routing](packet/packet-routing.md) — how decoded packets reach the
  application features.

Spirit Vale Tools performs passive parsing only. It never sends, modifies,
drops, or injects game traffic.
