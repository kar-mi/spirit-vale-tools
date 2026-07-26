# Documentation

These guides describe the passive capture system and the decoded packet stream
that the application packages consume.

- [Packet Capture Workflow](packet-capture-workflow.md) — installation,
  adapter selection, capture configuration, and troubleshooting.
- [Packet Decoding](packet-decoding.md) — wire layers, decoder state, output
  types, resolution rules, and extension points.
- [Packet Routing](packet-routing.md) — how decoded packet types move from
  `@kar-mi/spirit-vale-tools-capture` into domain packages, logs, and the CLI.

The protocol guides are contributor references. They describe passive parsing
only; the tools never send, modify, drop, or inject game traffic.
