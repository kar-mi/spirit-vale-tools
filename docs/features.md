# Package capabilities and command-line tools

Spirit Vale Tools turns passively captured game traffic into typed protocol
events and reusable domain state.

## Capture and decoding

`@kar-mi/spirit-vale-tools-capture` provides process-attributed Npcap capture,
LiteNetLib decoding, FishNet session decoding, and build-scoped RPC and
SyncType resolution. Capture is passive and non-promiscuous.

Run a process-attributed capture:

```powershell
bun run capture:dump -- --duration 30
```

Decode the supported UDP protocol layers:

```powershell
bun run capture:dump -- --protocols udp --decode-fishnet
```

## Domain packages

- `combat` tracks actor identity, skill activations, damage, deaths, encounter
  summaries, DPS, and replay state.
- `character` decodes character snapshots and calculates build-scoped stat
  breakdowns.
- `rewards` correlates monster deaths with XP, coins, items, session totals,
  trends, and replay data.
- `items`, `skills`, and `statuses` provide build-scoped static catalogs.
- `logging` provides internal versioned JSON Lines sessions used by domain
  packages and CLI consumers.

Unknown or incomplete protocol values remain explicit instead of being guessed
or silently discarded.

## Rewards CLI

Run a headless live reward session:

```powershell
bun run rewards
```

Only uniquely correlated monster deaths enter per-monster totals. Ambiguous or
unrelated reward updates remain separate.

## Runtime boundaries

- Live Npcap capture runs in Bun on Windows.
- Npcap is installed and updated separately under its own license.
- Static catalogs and semantic mappings are scoped to supported game builds.
- Shareable domain logs exclude raw packet bytes and sensitive account,
  platform, endpoint, and device identifiers.

See the [packet documentation](packet/README.md) for wire decoding and routing
details.
