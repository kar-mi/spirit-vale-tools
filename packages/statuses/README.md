# @kar-mi/spirit-vale-tools-statuses

Build-scoped Spirit Vale status effect catalog utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-statuses
```

## Usage

```ts
import { resolveFishNetStatus, statusDurationSeconds } from "@kar-mi/spirit-vale-tools-statuses";

const status = resolveFishNetStatus("Burn");
if (status) {
  console.log(status.displayName, status.effects);
  console.log("duration:", statusDurationSeconds(status, 1));
}
```

`resolveFishNetStatus` returns `undefined` for unknown statuses; use
`requireFishNetStatus` when a missing entry should throw instead.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
