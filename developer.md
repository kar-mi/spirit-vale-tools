# Developer guide

Spirit Vale Tools publishes reusable Bun packages through GitHub Packages. Use
them to build your own capture, replay, catalog, combat, character, or
reward tooling.

## Requirements

- Bun 1.4 or newer.
- Access to the `@kar-mi` packages on GitHub Packages.
- For live packet capture, Windows and a compatible Npcap installation. Capture
  uses Npcap in non-promiscuous mode and must run in a Bun process, not a
  browser view.

## Configure GitHub Packages

Create an `.npmrc` file in your consuming project:

```ini
@kar-mi:registry=https://npm.pkg.github.com
```

GitHub Packages requires authentication for npm packages. Use a GitHub personal
access token (classic) with `read:packages` and access to the package, then set
it in your user-level npm configuration or CI secret:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Do not commit a token to your project. In a local shell, set
`NODE_AUTH_TOKEN` before installing; in CI, provide it as a secret.

For more about GitHub Packages authentication and package access, see GitHub's
[npm registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Install packages

Add only the capability your application needs:

```powershell
bun add @kar-mi/spirit-vale-tools-capture
bun add @kar-mi/spirit-vale-tools-items
bun add @kar-mi/spirit-vale-tools-skills
bun add @kar-mi/spirit-vale-tools-statuses
bun add @kar-mi/spirit-vale-tools-combat
bun add @kar-mi/spirit-vale-tools-character
bun add @kar-mi/spirit-vale-tools-rewards
```

The package manager installs the packages' declared dependencies. You do not
need to add those separately. Internal support packages such as
`@kar-mi/spirit-vale-tools-logging` and `@kar-mi/spirit-vale-tools-sqlite` are
installed automatically this way; they are not a supported public API.

| Package | Use it for |
| --- | --- |
| `@kar-mi/spirit-vale-tools-capture` | Packet capture and protocol decoding. |
| `@kar-mi/spirit-vale-tools-items` | Built-in item catalog lookup. |
| `@kar-mi/spirit-vale-tools-skills` | Built-in skill catalog lookup. |
| `@kar-mi/spirit-vale-tools-statuses` | Built-in status-effect catalog lookup. |
| `@kar-mi/spirit-vale-tools-combat` | Combat tracking, DPS calculation, logs, and replay. |
| `@kar-mi/spirit-vale-tools-character` | Character decoding and stat calculation. |
| `@kar-mi/spirit-vale-tools-rewards` | Reward decoding, mob tracking, trends, and replay. |

## Import APIs

The capture package has three public entry points:

```ts
import {
  decodeFishNetBundle,
  decodeLiteNetLibDatagram,
} from "@kar-mi/spirit-vale-tools-capture";
import {
  getNpcapStatus,
  listNpcapDevices,
  PacketCapture,
} from "@kar-mi/spirit-vale-tools-capture/capture";
import { readUnsignedPackedWhole } from "@kar-mi/spirit-vale-tools-capture/wire-reader";
```

Use the package root for protocol decoders and shared types. Import from
`/capture` only in a Bun main process; it exposes the Windows Npcap APIs.
`/wire-reader` provides FishNet wire-format reader functions.

Catalog and domain packages export their public APIs from the package root:

```ts
import { loadBundledItemCatalog, resolveFishNetItem } from "@kar-mi/spirit-vale-tools-items";
import { loadBundledSkillCatalog, resolveFishNetSkill } from "@kar-mi/spirit-vale-tools-skills";
import { loadBundledStatusCatalog, resolveFishNetStatus } from "@kar-mi/spirit-vale-tools-statuses";
import { FishNetCombatTracker, LiveCombatService } from "@kar-mi/spirit-vale-tools-combat";
import { calculateCharacterStats, decodeCharacterRpcPayload } from "@kar-mi/spirit-vale-tools-character";
import { FishNetMobRewardTracker, queryMobRewardCatalog } from "@kar-mi/spirit-vale-tools-rewards";
```

Consult each package's README and TypeScript declarations for its complete API
and the required data flow between decoders, trackers, and replay helpers.

## Versioning

Use normal semver ranges when adding these packages. Each package is released
independently; update only the packages that expose the functionality your
application uses.
