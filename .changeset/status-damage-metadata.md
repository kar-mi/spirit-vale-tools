---
"@kar-mi/spirit-vale-tools-statuses": minor
"@kar-mi/spirit-vale-tools-combat": minor
---

Groundwork for proportional status-damage attribution in the DPS meter:

- `statuses`: `FishNetStatusDefinition` gains per-tick damage metadata (`damage`, `damagePerc`,
  `element`) and the skill/coating application graph (`appliedBy`) for damaging statuses, plus
  an `isDamagingStatus` helper.
- `combat`: new `StatusDamageAttributionTracker` that reconciles observed stack totals with
  source-specific application batches, each retaining its own expiry. Later applications do
  not refresh earlier stacks; ownership expires even when snapshots stop or totals stay level.
  Periodic damage and missed hits do not create application candidates, and each snapshot or
  removal closes its correlation interval. Unexplained counts and losses stay unattributed.
  Timers use catalog estimates, and stack counts alone do not establish per-application damage.
  Not yet wired into the reducer.
