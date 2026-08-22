---
"@kar-mi/spirit-vale-tools-items": patch
---

The item catalog (`packages/items/src/definitions/*.ts`) is now regenerated from a data-mine `items.json` export via `scripts/generate-items-map.ts`, instead of hand-pasted per category. The catalog picks up the current game build's item changes as a result: new equipment (the "Echo" gear set, the Gunslinger artifact set, and others), rebalanced equipment/card stat values, several renamed cosmetics, and a handful of removed items.

`weight` and `substatGroup` on equipment definitions have no source in the data-mine export, so the generator carries them forward by item id from the previously bundled catalog; newly added equipment gets a `weight: 0` placeholder the generator flags for manual review rather than guessing at.

`scripts/generate-rpc-map.ts` also moved from `packages/capture/scripts/` to the repo-root `scripts/` alongside the new generator, with its stale in-file path references updated to match.
