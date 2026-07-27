# @kar-mi/spirit-vale-tools-statuses

## 0.2.0

### Minor Changes

- 7b7db55: Populate duration data for ~140 additional statuses (Stun, Spinning, Unyielding, Elusive, Enrage, Bleeding, Frozen, and more) by aggregating every skill/status in the data-mine that grants them (`StatusEffects[]` and `SelfStatusEffects[]`), instead of relying on the small hand-ported subset that previously left most statuses with empty `effects` and no computable duration. Added `scripts/aggregate-durations.ts` to regenerate this data going forward. A handful of statuses (e.g. `ComboReady`, `BoostBash`) still have no duration data because the data-mine has no `StatusEffects` source for them at all - likely granted through an undecoded passive-trigger mechanism. Durations also don't yet account for the target's (undecoded) status-resist stat, so they're an estimate/upper-bound.

## 0.1.3

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.
- Updated dependencies [4a996f0]
  - @kar-mi/spirit-vale-tools-capture@0.2.2

## 0.1.2

### Patch Changes

- 9ecf64b: Release the status catalog and tracking support.
- Updated dependencies [9ecf64b]
  - @kar-mi/spirit-vale-tools-capture@0.2.1

## 0.1.1

### Patch Changes

- Updated dependencies [d2d24da]
  - @kar-mi/spirit-vale-tools-capture@0.2.0
