# Feature guide

Spirit Vale Tools turns passively captured game traffic into desktop tools for
combat, character builds, rewards, and market listings. Open each tool from the
main launcher.

## Combat

The Combat window provides live DPS tracking and replay of previous combat
logs. Decoded combat data is grouped by actor and includes skill activations,
per-hit damage, and deaths. Actor and damage-source identifiers keep overlapping
skills separate when the available data permits an exact match.

Visible player names are joined to combat actors when the game supplies that
information. Combat events are still recorded when a display name is not
available.

## Overlay

The overlay displays live DPS and character stats over the game. Its layout can
be customized from Overlay Settings. Locked mode passes mouse clicks through to
the game; press `F11` to toggle the lock.

## Character

The Character window displays the detected character build across basic, gear,
advanced, and skill views. It combines the live character snapshot with
build-scoped item and skill metadata to calculate the displayed stat
breakdowns.

## Rewards

The Rewards window combines the configured mob catalog with passive live
observations. It provides:

- Confirmed recent kills
- Per-mob session totals
- Reward trends
- Configured base XP, coins, and drop chances
- Observed character XP, job XP, coins, and collected items
- Replay of recorded JSON Lines sessions

Only a uniquely correlated mob death is included in per-mob totals. Ambiguous
or unrelated reward updates are tracked separately.

For a headless session that records the same passive reward stream:

```powershell
bun run rewards
```

## Market

The Market window follows the current captured market session. Opening the
in-game market supplies the responses used to populate it; Spirit Vale Tools
does not initiate market requests.

Listings can be searched, paginated, and sorted locally. Equipment and artifacts
can also be filtered by displayed substat ranges. Market data includes vendor
catalog responses, auction-house snapshots, stall listings, and successful
collection updates supported by the current build mapping.

For a headless live session that writes the same market stream:

```powershell
bun run market -- --live
```

The CLI also accepts a recorded capture:

```powershell
bun run market -- --input <capture.jsonl>
```

Useful query options include `--query`, `--item-type`, `--min-price`,
`--max-price`, `--sort`, `--limit`, and repeatable
`--stat <name>[:minimum]` filters. Multiple stat filters must all match by
default; use `--stat-mode any` to match any filter.

## Capture and logs

The desktop app automatically selects the network adapter associated with
Windows' preferred route. A specific adapter can be selected in launcher
settings. The launcher also reports missing, restricted, or unusable Npcap
installations.

Logs use versioned JSON Lines records and separate capture, combat, and market
streams. Diagnostic capture records may include decoded packet fields. Combat
logs use a reduced replay-oriented record that excludes raw packet bytes,
coordinates, arbitrary decoded fields, account identifiers, and platform
identifiers.

Live capture normally runs without elevation when Npcap was installed without
the administrator-only restriction.

For capture options, adapter troubleshooting, and packet-processing details,
see the [packet capture workflow](packet/packet-capture-workflow.md).

## Command-line capture

Run a process-attributed capture:

```powershell
bun run capture:dump -- --duration 30
```

Decode the supported UDP protocol layers:

```powershell
bun run capture:dump -- --protocols udp --decode-fishnet
```

See the [packet documentation](packet/README.md) for protocol decoding and
package-routing details.

## Runtime and data boundaries

- Packet capture is passive and non-promiscuous.
- Npcap is installed and updated separately under its own license.
- The portable release keeps application-owned writable state beneath its
  extracted `data` directory.
- Static item, skill, reward, and market mappings are scoped to supported game
  builds. Unknown identifiers remain visible instead of being silently removed.
