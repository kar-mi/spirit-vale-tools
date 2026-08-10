# Spirit Vale Tools

Spirit Vale Tools provides reusable Bun packages and command-line utilities for
passive packet capture, protocol decoding, catalogs, combat, character,
and reward analysis. Capture uses Npcap in non-promiscuous mode and never
sends, modifies, drops, or injects game traffic.

> Looking for the Windows companion application? See
> [spirit-vale-overlay](https://github.com/kar-mi/spirit-vale-overlay).

## Packages

The public packages are published through GitHub Packages under the `@kar-mi`
scope:

| Package | Capability |
| --- | --- |
| `@kar-mi/spirit-vale-tools-capture` | Packet capture and protocol decoding |
| `@kar-mi/spirit-vale-tools-items` | Build-scoped item catalog |
| `@kar-mi/spirit-vale-tools-skills` | Build-scoped skill catalog |
| `@kar-mi/spirit-vale-tools-statuses` | Build-scoped status catalog |
| `@kar-mi/spirit-vale-tools-combat` | Combat tracking, DPS, logs, and replay |
| `@kar-mi/spirit-vale-tools-character` | Character decoding and stat calculation |
| `@kar-mi/spirit-vale-tools-rewards` | Reward decoding, tracking, trends, and replay |

See the [developer guide](developer.md) for registry setup, installation, and
public API examples.

## Development

[Bun 1.3 or newer](https://bun.sh/) is required.

```powershell
bun install
bun run check
bun run build
```

`bun run build` builds every publishable package. Live capture requires Windows
and a current [Npcap](https://npcap.com/#download) installation with WinPcap
API-compatible mode enabled.

## Command-line tools

```powershell
bun run capture:dump -- --duration 30
bun run rewards
```

More CLI behavior, package details, logging, and protocol references are
available in the [documentation](docs/README.md).
