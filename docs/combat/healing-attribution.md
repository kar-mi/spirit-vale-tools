# Healing attribution

`FishNetCombatTracker` emits `FishNetCombatHealEvent` (`kind: "heal"`) for
`HealthComponent.ApplyDamage_C` with a negative damage value and for
`HealthComponent.Recover_C`. Negative `ApplyDamage_C` heals are attributed from
their wire fields; this note covers why `Recover_C` attribution is inherently
best-effort and how the tracker approximates it anyway.

## Authoritative combat heals: negative `ApplyDamage_C`

`ApplyDamage_C` carries a complete `Damage` payload. When `Damage.Value` is
negative, the tracker emits a heal whose amount is the absolute value, healer is
`Damage.AttackerId`, target is the RPC object, and source is
`Damage.DamageSourceId`. This is direct wire attribution (`"exact"`), so it
does not depend on cast timing or status correlation.

## The core problem: `Recover_C` carries no healer id

Unlike `ApplyDamage_C`/`Death_C`, whose `Damage` struct includes an explicit
`AttackerId`, `Recover_C`'s wire signature is just `(amount: int, settings:
FloaterSettings)` — see
`packages/capture/src/fishnet/rpc-definitions/generated/health-component.ts`. The
healed target is always known (it's the RPC's `objectId`), but the game
genuinely never sends who did the healing. This isn't a decoding gap or a
missing RPC-map entry; the field doesn't exist on the wire.

## How attribution works today

Since the RPC itself is silent, `combat-tracker.ts` infers the healer from
nearby skill activity instead, via two separate paths:

**Instant heals** (`HEALING_SKILL_IDS`: `Heal`, `HighHeal`, `FieldHealing`) —
when a `Recover_C` lands, the tracker looks for an activation whose skill id is
in the allowlist, whose declared cast target (`CastBegin_C`'s `targetId`)
matches the heal's recipient, and whose cast is still within its short
post-complete grace window (`hitGraceTicks`, default 30 ticks). Exactly one
match → `attribution: "exact"`/`"inferred"`; more than one overlapping
candidate → `"ambiguous"`; no match → `"unattributed"`.

**Regeneration-status heals** (`REGEN_SKILL_IDS`: `HealAll`, `Sanctuary`,
`GuardianBond`, `SanctuaryField`) — these skills grant the `Regeneration`
status (see `packages/statuses/src/definitions/statuses.ts`) rather than
healing immediately, so the same cast/target/tick correlation is applied once,
at the moment `StatusComponent.ApplyEffect_T` grants `Regeneration`. The
result is cached per target and reused for every subsequent `Recover_C` tick
on that target until `RemoveEffect_T` clears the status.

Both paths are best-effort allowlists built by hand from observed captures and
the skill/status data files, not something the game or decoder derives
automatically — skills that heal but aren't yet in one of these sets will
resolve as `"unattributed"` even though a matching cast is right there in the
activation log.

## Known limitations

- **Overlapping healers on the same target are ambiguous, not resolved.** Two
  healers casting a matching skill on the same recipient in overlapping
  windows both become candidates, and the tracker deliberately doesn't guess —
  it reports `"ambiguous"` with both candidate activation ids rather than
  picking one.
- **Heal amount isn't used as a signal.** It varies with caster stats, skill
  level, and likely randomness, so it isn't a reliable per-caster fingerprint
  at attribution time — using it risks a confident but wrong attribution,
  which is worse than an honest `"ambiguous"`.
- **No amount is available before the heal lands, either.** `CastBegin_C`'s
  `SkillStateDto` only carries cooldown/cost/timing fields (`Cooldown`,
  `Cost`, `Charges`, `CastTime`, ...) — no potency value — so there's nothing
  to cross-check against ahead of time.
- **A large share of `Recover_C` traffic is ambient regen, not player heals,
  and is correctly left unattributed.** In a real town-session capture, 448
  heal events resolved to 5 `"exact"` (all from the player's own `Heal` casts)
  and 443 `"unattributed"`. The unattributed ones were the same
  `(targetId, amount)` pairs repeating every ~30 ticks indefinitely — passive
  HP/resource regen on nearby NPCs/players with no cast behind them at all,
  not a matching failure.
- **`SkillsComponent.Recover_C` is a different RPC and is ignored.** Same
  method name, same `(amount, settings)` shape, but it lives on
  `SkillsComponent` instead of `HealthComponent`. The tracker filters by
  component, not by inferred meaning — we haven't decoded `FloaterSettings` to
  confirm it's specifically mana/resource recovery, only that it's excluded
  from heal attribution.
