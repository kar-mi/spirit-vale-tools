---
"@kar-mi/spirit-vale-tools-statuses": minor
---

Expose status-damage metadata for consumers:

- `statuses`: `FishNetStatusDefinition` gains per-tick damage metadata (`damage`, `damagePerc`,
  `element`) and the skill/coating application graph (`appliedBy`) for damaging statuses, plus
  an `isDamagingStatus` helper.
