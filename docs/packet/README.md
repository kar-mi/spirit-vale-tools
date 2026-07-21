# Documentation

These guides describe the passive capture system and the decoded packet stream
that the application packages consume.

- [Packet Capture Workflow](packet-capture-workflow.md) — installation,
  adapter selection, capture configuration, and troubleshooting.
- [Packet Decoding](packet-decoding.md) — wire layers, decoder state, output
  types, resolution rules, and extension points.
- [Packet Routing](packet-routing.md) — how decoded packet types move from
  `@spiritvale/core` into domain packages, logs, the CLI, and the desktop app.

The protocol guides are contributor references. They describe passive parsing
only; the application never sends, modifies, drops, or injects game traffic.
