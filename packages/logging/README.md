# @kar-mi/spirit-vale-tools-logging

Session-oriented logging utilities for Spirit Vale tools.

> **Internal package.** This package is published only because the domain
> packages (`combat`, `market`, `rewards`) depend on it at runtime; it is
> installed automatically alongside them and is not a supported public API.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-logging
```

## Usage

```ts
import { createLogSession } from "@kar-mi/spirit-vale-tools-logging";

const session = await createLogSession({
  producer: "my-tool",
  streams: ["capture", "combat"],
});

const logger = session.logger("combat");
logger.log("combat.event", { kind: "damage", amount: 42 });

await session.close();
```

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
