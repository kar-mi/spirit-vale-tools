---
"@kar-mi/spirit-vale-tools-statuses": minor
"@kar-mi/spirit-vale-tools-capture": patch
"@kar-mi/spirit-vale-tools-combat": minor
---

Expose damaging-status metadata and preserve the complete `ApplyEffectDisplays_O` status summary.

- `statuses`: `FishNetStatusDefinition` gains per-tick damage metadata (`damage`,
  `damagePerc`, and `element`), the skill/coating application graph (`appliedBy`), and
  non-zero status re-application `cooldown` values. An `isDamagingStatus` helper identifies
  definitions with positive flat or percentage damage.
- `capture`: the generated RPC map names the `StatusComponent+QueuedEffectDisplay` fields
  (`Id`, `Duration`, `Stacks`, `StacksMax`, and `ShowFx`) instead of leaving each array
  element opaque.
- `combat`: `decodeEffectDisplays` consumes the cosmetic `ShowFx` byte and documents the
  per-bearer, per-status summary. Combat status events, replay, and active snapshots now
  preserve observer-reported `maxStacks`: zero declares no ceiling, while absence means the
  feed did not report one.
