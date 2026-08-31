# Healing attribution

`FishNetCombatTracker` emits `kind: "heal"` from negative
`HealthComponent.ApplyDamage_C` values and from `HealthComponent.Recover_C`.

## Negative `ApplyDamage_C`

The packet provides the complete path:

- source actor: `dmg.AttackerId`
- source skill/status: `dmg.DamageSourceId`
- target actor: RPC `objectId`
- amount: `abs(dmg.Value)`

These events use `attribution: "exact"`.

## `Recover_C`

The packet provides the target through its `objectId`, the healing amount, and
the four `FloaterSettings` fields used to classify recovery. It does not provide
a source actor or skill.

Source attribution uses these related packet paths:

1. A healing activation on the same target, using `CastBegin_C.targetId` or
   `AutoCast_C.obj`.
2. The activation that applied `Regeneration`, retained until the status is
   removed.
3. A recipient-side `SkillsComponent.BondSync` entry for Guardian Bond, where
   `Caster` is false and `Other` identifies the caster.

A single source produces `attribution: "inferred"`; multiple sources produce
`"ambiguous"`; no source produces `"unattributed"`. Heal amount is not used to
select a source.

Passive-regeneration and drain recovery are attributed to the recovering actor.
`SkillsComponent.Recover_C` represents mana recovery and is ignored.

Unattributed heals retain `targetId` and omit `actorId`. Healing meters do not
substitute the target as the healer.
