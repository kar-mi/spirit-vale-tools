# Status damage and stacking

Status damage is damage emitted by an active damaging status such as Poison or Burning. It is
separate from the element of the hit that applied the status. A direct attack may deal
poison-element damage without applying Poison, while a Poison tick is status damage even though
no new application occurred.

## Application and stack count

A skill or active coating applies a status through a `SkillStatus` row. Its build-scoped fields
describe the status id, duration, application quantity, and level scaling:

```text
duration = Duration + skillLevel * DurationLv
quantity input = Chance + skillLevel * ChanceLv
               + Stacks + skillLevel * StacksLv
```

Despite the historical name, the game combines `Chance` and `Stacks` in
`SkillStatus.GetChance`. A non-positive configured total takes the game's default path. A
positive fractional total is stochastically rounded after status resistance and application
modifiers are applied. The result is an application count; it is not weighted by the direct
hit's damage value or element.

The resulting integer is passed to `StatusEffectState.AddStacks(duration, stacks, maxStacks)`.
The state stores one remaining-duration entry per added stack. Reapplication appends new timers:
it does not refresh or replace older timers. At a positive maximum, the oldest stacks are removed
first. A maximum of zero means no ceiling.

For example, a three-stack application followed by a two-stack application produces an aggregate
of five live stacks, but internally remains five timers associated with two application times.
As timers expire, the aggregate falls by the number removed on that update.

## Tick cadence and damage

`StatusEffectState.Tick` gates expiry and damage behind an approximately 0.5-second accumulator.
The threshold comes from game code rather than a status asset. Its gating role is established,
while the precise post-pass accumulator behavior remains medium-confidence.

The shared flat status-damage helper calculates:

```text
flat damage per stack = round((level + STR + AGI + INT) * StatusConfig.Damage / 10)
```

A status may also define `DamagePerc`, a target-health-relative component. The tick combines its
configured damage components and scales the result by the live stack count. The resulting combat
event names the status as its source and uses the periodic/status damage type.

Poison has flat `Damage = 1`, no percentage component, and element 1 in the current build. That
does not make every element-1 attack a Poison application. Only the Poison status produces Poison
ticks.

## What the network reports

The server owns the per-stack timer list. Observers periodically receive
`ApplyEffectDisplays_O`, containing one summary per bearer and status id:

```text
status id, longest remaining stack timer, aggregate live stack count,
declared stack ceiling, cosmetic effect flag
```

A large or growing Poison `stacks` value is therefore a count of live discrete stacks, not
potency or accumulated damage. The wire does not report each stack's applier or timer. The
owner-only status RPC carries status id and level, but generally not the observer's stack total.

Damage events are a separate feed. They carry attacker, target, source skill or status, damage
value, damage type, and element. `element` classifies damage; it does not establish a status
application. A periodic event whose source is the damaging status is a tick, not a new stack.

## Damage attribution

Periodic status damage does not need to be inferred from stack ownership. Each damage event
carries the server-provided attacker id in `dmg.AttackerId`, along with the bearer, status source,
damage value, and damage type. Consumers attribute any status tick by grouping its damage value
by that attacker identity, just as they do for a direct hit. Poison, Burning, Bleed, and other
damaging statuses all use this same damage-event path; the status id is the event's source.

Clones and other player-controlled combat objects can deal damage under an actor id distinct from
the visible player object. Spawn ownership and actor-identity continuity associate those aliases
with the owning player. The raw attacker id remains available when that association is unknown.

The observer stack aggregate is not used to distribute damage. It is unnecessary for damage
contribution because the authoritative tick already supplies both its attacker and damage value.

## Known limits

- Observer snapshots omit individual server timers and stack-applier ids, so they cannot establish
  live stack ownership.
- Resistance, modifiers, and stochastic rounding can make aggregate increases differ from catalog
  application quantities.
- Saturation hides which new stacks displaced older ones.
- Actor network ids may change during a session. Damage attribution therefore relies on actor
  identity and spawn-owner continuity when grouping player-controlled aliases.
