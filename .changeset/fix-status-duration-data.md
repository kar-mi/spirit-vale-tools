---
"@kar-mi/spirit-vale-tools-statuses": minor
---

Populate duration data for ~140 additional statuses (Stun, Spinning, Unyielding, Elusive, Enrage, Bleeding, Frozen, and more) by aggregating every skill/status in the data-mine that grants them (`StatusEffects[]` and `SelfStatusEffects[]`), instead of relying on the small hand-ported subset that previously left most statuses with empty `effects` and no computable duration. Added `scripts/aggregate-durations.ts` to regenerate this data going forward. A handful of statuses (e.g. `ComboReady`, `BoostBash`) still have no duration data because the data-mine has no `StatusEffects` source for them at all - likely granted through an undecoded passive-trigger mechanism. Durations also don't yet account for the target's (undecoded) status-resist stat, so they're an estimate/upper-bound.
