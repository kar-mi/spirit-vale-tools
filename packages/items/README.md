# @kar-mi/spirit-vale-tools-items

Build-scoped Spirit Vale item catalog utilities.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-items
```

## Usage

```ts
import { loadBundledItemCatalog, resolveFishNetItem } from "@kar-mi/spirit-vale-tools-items";

const catalog = loadBundledItemCatalog();
console.log(catalog.buildFingerprint);

const item = resolveFishNetItem(0, "Molten Core");
if (item) {
  console.log(item.displayName, item.itemType, item.effects);
}
```

`resolveFishNetItem` returns `undefined` for unknown items; use
`requireFishNetItem` when a missing entry should throw instead.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
