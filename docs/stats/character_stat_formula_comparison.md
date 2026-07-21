# Character stat formula comparison

This document compares three sources:

- the formulas shared in the **game-mechanics Discord channel**, as transcribed
  in [stat_calculations.md](stat_calculations.md);
- the formulas used by the current game build;
- the calculations currently shown by this repository's character UI.

The executable, IL2CPP metadata, and generated method information were checked as
one matching build. References below use game type and method names rather than
tool-specific filenames or offsets.

## Notation and interpretation

- `floor(x)` is the game's downward integer conversion after `System.Math.Floor`.
- `ceil(x)` is an upward integer conversion. In this document it appears only
  in the combat application path, never in the character-sheet siphon value.
- `round(x)` is the game's `Extensions.Round` result. Rounding stages are shown
  because moving a `round` can change the displayed integer.
- Stats whose names end in `Mult` are stored as percentage points, so `AtkMult`
  contributes `1 + AtkMult / 100`.
- `WeaponATK` and `WeaponMATK` are the equipped weapon's base values.
- `AtkWeapon[weapon]` and `MatkWeapon[weapon]` are targeted modifiers for that
  weapon type. They correspond to the game-mechanics Discord channel's
  `MASTERY` term.
- `LSUM(n) = n * (n + 1) / 2`.
- Formulas in this document are the player branches unless a monster branch is
  explicitly identified.

The repository does not currently have every input needed by the complete game
formula. In particular, the character callback used by the UI does not expose
weapon base ATK/MATK, stance, or every runtime conditional modifier. A repository
formula described as a **scaling preview** is therefore not a complete in-game
total.

## Attack and magic attack

### Attribute scaling shared by the full formulas

| Value | Current game formula | Game-mechanics Discord channel | Repository character UI | Game reference |
| --- | --- | --- | --- | --- |
| Melee attribute term | `round(STR * 1.5) + floor(DEX / 5) + floor(LUK / 5) + STR * AtkPerStr` | `STR * 1.5 + DEX / 5 + LUK / 5` | `STR * 1.5 + floor(DEX / 5) + floor(LUK / 5)` | `Formula.GetAttackScaling(StatArray, bool, StatArray)` |
| Ranged attribute term | `DEX + floor(STR / 5) + floor(LUK / 5) + DEX * AtkPerStr` | `DEX + STR / 5 + LUK / 5` | `DEX + floor(STR / 5) + floor(LUK / 5)` | `Formula.GetAttackScaling(StatArray, bool, StatArray)` |
| Magic attribute term | `round(INT * 1.5) + floor(DEX / 5) + floor(LUK / 5) + STR * MatkPerStr` | `INT * 1.5 + DEX / 5`; no LUK or `MatkPerStr` | `INT * 1.5 + floor(DEX / 5) + floor(LUK / 5)` | `Formula.GetMagicAttackScaling(StatArray, StatArray)` |
| Attribute tier multiplier | Melee: `1 + floor(STR / 10) / 100`; ranged: `1 + floor(DEX / 10) / 100`; magic: `1 + floor(INT / 10) / 100` | Melee/ranged agree; magic says `1 + floor(INT / 1000)` | Same as the game for all three | `Formula.GetAttackScaling`; `Formula.GetMagicAttackScaling` |

The old magic multiplier is materially different. The current game adds one
percentage point per complete 10 INT; it does not jump by 100% per 1000 INT.
The repository has the right divisor but omits the two data-driven per-attribute
stats (`AtkPerStr` and `MatkPerStr`). It also does not round the `1.5` term at the
same stage as the game.

### Full player attack totals

Define:

```text
Primary = STR for melee, DEX for ranged
WeaponTerm = (WeaponATK + ATK) * (1 + Primary / 200)
RawATK = LV / 4 + AttributeTerm + AtkWeapon[weapon] + WeaponTerm

MATKWeaponTerm = (WeaponMATK + MATK) * (1 + INT / 200)
RawMATK = LV / 4 + MagicAttributeTerm + MatkWeapon[weapon] + MATKWeaponTerm
```

The current game then calculates:

```text
ATK = round(
  round(RawATK * StanceMultiplier * AttributeTierMultiplier)
  * (1 + AtkMult / 100)
  * (1 + TotalAtk / 100)
)

MATK = round(
  round(RawMATK * StanceMultiplier * MagicAttributeTierMultiplier)
  * (1 + MatkMult / 100)
  * (1 + TotalMatk / 100)
)
```

References: `Formula.GetAttack(BaseUnitController, WeaponState, StatArray)`,
`Formula.Attack(BaseUnitController, StatArray)`, and
`Formula.MagicAttack(BaseUnitController, StatArray)`.

Differences:

- The game-mechanics Discord channel has the correct broad ordering through the attribute tier and
  `AtkMult`/`MatkMult` stages, but it does not include `AtkPerStr`, `MatkPerStr`,
  `TotalAtk`, `TotalMatk`, or the current stance branches. It also misses LUK in
  magic scaling and gives the wrong INT tier divisor.
- The repository rows named "Melee attack scaling", "Ranged attack scaling", and
  "Magic attack scaling" are previews, not the full displayed game totals. They
  omit `LV / 4`, weapon values, targeted weapon modifiers, stance, and total-stat
  multipliers. The repository also adds flat ATK/MATK after its attribute tier,
  whereas the game applies the tier to the complete `RawATK`/`RawMATK` value.
- Damage-type, element, skill, and final-damage multipliers are applied later by
  `Formula.GetDamage(...)`; they are not part of the character-sheet ATK/MATK
  number. This supports the game-mechanics Discord channel's warning about unique multipliers, but the
  exact later multiplier set depends on damage type, element, skill, range, and
  target.

### Stance multipliers

For the two-handed stance, the current game uses:

```text
1.25 + TwohandedStanceBonus / 100
```

This confirms the game-mechanics Discord channel's base 25% bonus, while also showing an additional
stat-driven bonus. The branch is present in both physical and magic attack.
Reference: `Formula.GetAttack(...)` and `Formula.MagicAttack(...)`.

The dual-wield attack-total branch uses the `DualWield` stat as its stance
multiplier when that stat is positive, otherwise `1`. Attack timing has a separate
dual-wield rule described below. Reference: the same two attack methods and
`Formula.GetStanceMult(StatArray, StanceType)`.

### Worked two-handed melee validation

The following observed player-sheet result matches the current formula at level
95 with a two-handed melee stance:

```text
STR = 128, DEX = 1, LUK = 82
Displayed ATK = 598
AtkMult = 0%
DamageMelee = 25% (separate from displayed ATK)
```

With `AtkPerStr = 0`, `AtkWeapon[equipped weapon] = 0`, `TotalAtk = 0%`,
`TwohandedStanceBonus = 0%`, and a combined `WeaponATK + flat ATK` of 119:

```text
AttributeTerm = round(128 * 1.5) + floor(1 / 5) + floor(82 / 5)
              = 192 + 0 + 16
              = 208

WeaponTerm = 119 * (1 + 128 / 200)
           = 119 * 1.64
           = 195.16

RawATK = 95 / 4 + 208 + 0 + 195.16
       = 23.75 + 208 + 195.16
       = 426.91

TwoHandedStance = 1.25
AttributeTier = 1 + floor(128 / 10) / 100 = 1.12

DisplayedATK = round(round(426.91 * 1.25 * 1.12) * 1.00 * 1.00)
             = round(598 * 1.00 * 1.00)
             = 598
```

Thus the `ATK +0%` line means `AtkMult = 0`, giving a neutral multiplier of
`1 + 0/100 = 1`. It does not mean that the STR tier or two-handed stance bonus is
zero; those are already included earlier. `DamageMelee = 25%` is applied later
in `Formula.GetDamage(...)` as a melee damage multiplier and is not included in
the displayed 598 ATK. In isolation its multiplier is `1 + 25/100 = 1.25`, but
actual dealt damage also includes skill, defence, element, target, and other
damage-stage terms.

If the equipped weapon does not show 119 base ATK, the same displayed total can
still be produced by flat `ATK` or targeted `AtkWeapon` bonuses. From the sheet
total alone, the constrained weapon portion is approximately:

```text
AtkWeapon[equipped weapon] + (WeaponATK + flat ATK) * 1.64 = 195.16
```

### Physical skill damage, melee damage, and critical damage

For an ordinary physical melee skill, the relevant portion of
`Formula.GetDamage(...)` can be expressed as:

```text
SkillBase = DisplayedATK * SkillCoefficient + SkillDamageFlat

PostDefenceDamage = SharedPreDefenceStages(SkillBase)
PostDefenceDamage = ApplyPhysicalDefence(PostDefenceDamage)

MeleeDamage = PostDefenceDamage
  * (1 + DamageMelee / 100)
  * (1 + TargetDamageFromMelee / 100)

HitKindMultiplier =
  CriticalDamage / 100       when the hit is critical
  RandomRange(0.95, 1.05)    when the hit is not critical

FinalDamage = round(
  MeleeDamage
  * HitKindMultiplier
  * (1 + FinalDamageStat / 100)
  * (1 - TargetFinalDamageReduction / 100)
  * (1 + TargetFinalDamageTaken / 100)
  * OtherApplicableFinalStages
)
```

The two hit-kind branches are alternatives: a critical physical hit uses the
critical-damage multiplier and does not also receive the ordinary 0.95–1.05
random multiplier. `CriticalDamage = 206` therefore means `206 / 100 = 2.06`
times damage, or 106% more than the same shared damage at a neutral ×1 roll. It
does not mean `1 + 206/100 = 3.06`.

`DamageMelee = 25` gives `1 + 25/100 = 1.25` and multiplies both critical and
non-critical melee hits. It therefore increases their absolute values but
cancels when comparing a critical hit with a non-critical hit from the same
setup.

Stomp's current configuration has `Damage.Value = 0` and
`Damage.ValueLv = 1`, so at skill level 1 its direct coefficient is 1.00, or
100% of displayed ATK, before the shared skill, element, defence, melee, target,
critical/random, and final-damage stages. References: Stomp's `SkillConfig`,
`SkillState.GetDamage(...)`, and `Formula.GetDamage(...)`.

An observed level-1 Stomp test with `DamageMelee = 25`,
`CriticalDamage = 206`, 1,189 non-critical damage, and 2,533 critical damage is
consistent with this pipeline. Combine every unchanged stage other than melee
and the hit-kind multiplier into `CommonDamage`:

```text
CommonDamage ~= 2533 / (1.25 * 2.06)
             ~= 983.69

Observed non-critical random roll
  ~= 1189 / (983.69 * 1.25)
  ~= 0.96697
```

`0.96697` lies inside the game's 0.95–1.05 non-critical range. Consequently,
`2533 / 1189 ~= 2.13036` is not the critical-damage multiplier: that raw ratio
also divides by the lower random roll on the non-critical hit. Over many hits,
the average non-critical random multiplier approaches 1.00, so the critical to
average-non-critical ratio approaches 2.06 when the other inputs stay fixed.

## Cast and attack speed

### Cast speed

The current player formula is:

```text
CastSpeedBase = 200
  - 50 * (1 - (DEX + floor(INT / 2)) / 400) / (1 + CastSpd / 100)

CastSpeed = clamp(
  CastSpeedBase + 0.5 * (floor(DEX / 10) + CastTimeReduction),
  0,
  195 + 0.5 * CastTimeReductionLimit
)

CastTimeFactor = (200 - CastSpeed) / 50
CastTimeReductionDisplayed = round((1 - CastTimeFactor) * 100)
```

References: `Formula.CastSpeed(BaseUnitController, StatArray)`,
`Formula.CastTimeFactor(BaseUnitController, StatArray)`,
`Formula.MaxCastTimeReduction(BaseUnitController)`, and `UIUnitStats.Draw()`.

The game-mechanics Discord channel contains the core pre-cap formula, but omits
`CastTimeReduction`, `CastTimeReductionLimit`, the clamp, and the integer division
of INT before it is added. Its `CTR` expression is also parenthesized as
`round(1 - factor * 100)`; the game displays `round((1 - factor) * 100)`.
The repository character UI does not currently calculate cast speed.

### Attack speed and delay

The current player branch can be summarized as:

```text
AttributePart = (AGI + floor(DEX / 4)) / 250

ASPD = round(
  200
  - 50 * BAD * (1 - AttributePart) / (1 + AtkSpd / 100)
  + 0.5 * floor(AGI / 10)
  + AtkSpdFlat
)

ASPDLimit = min(193, 185 + floor(AGI / 15) + AtkSpdLimit)
ASPD = min(ASPD, ASPDLimit)
AttackDelay = (200 - ASPD) / 50
```

`SetAtkSpd` selects a separate fixed-speed branch. Summons and special weapon
states also have separate branches.

References: `Formula.AttackSpeed(BaseUnitController, StatArray)`,
`Formula.AttackSpeedLimit(BaseUnitController, StatArray)`,
`Formula.AttackDelay(BaseUnitController, StatArray)`, and
`Formula.AttackDelayBase(BaseUnitController)`.

The game-mechanics Discord channel's `AGI / 250 + DEX / 1000` is close but not identical to the current
game's `(AGI + floor(DEX / 4)) / 250`. It also omits the flat speed stat and the
dynamic cap. The repository character UI does not calculate ASPD or attack delay.

The game-mechanics Discord channel records this base attack-delay table:

| Weapon | BAD | Weapon | BAD |
| --- | ---: | --- | ---: |
| Unarmed | 0.9 | Dagger | 1.0 |
| Twinblade | 1.0 | Sword | 1.1 |
| Book | 1.1 | Mace | 1.15 |
| Instrument | 1.15 | Spear | 1.2 |
| Wand | 1.2 | Scythe | 1.2 |
| Axe | 1.3 | Bow | 1.4 |
| Pistol | 1.2 | Gatling gun | 1.4 |
| Rifle | 1.5 | Shotgun | 2.0 |
| Launcher | 2.0 | | |

The current game does not hard-code these per-weapon numbers in the calculation
method. `Formula.AttackDelayBase(...)` reads the equipped weapon timing already
materialized in `CombatComponent` data, so the individual table entries were not
independently verified from that method. They should remain marked as
game-mechanics Discord channel-only values until the corresponding weapon
configuration fields are reconstructed.

The dual-wield timing formula itself is present and is
`(BAD1 + BAD2) * 0.8`, agreeing with the game-mechanics Discord channel. Reference:
`Formula.AttackDelayBase(BaseUnitController)`.

## Defense and damage reduction

| Value | Current game formula | Difference from game-mechanics Discord channel | Repository character UI | Game reference |
| --- | --- | --- | --- | --- |
| DEF | `round(DEF * (1 + DefMult / 100))` | The old `VIT / 1000` term is not present | Not calculated | `Formula.Def(StatArray, StatArray)` |
| MDEF | `round(MDEF * (1 + MdefMult / 100))` | The old `VIT / 1000` term is not present | Not calculated | `Formula.MDef(StatArray, StatArray)` |
| Remaining damage factor | `100 / (DEF + 100)` | The old formula is correct mathematically but calls this value “DamageReduction” | Not calculated | `Formula.DamageReduction(float)` |
| Displayed reduction % | `round((1 - 100 / (DEF + 100)) * 100)` | Not stated in the game-mechanics Discord channel | Not calculated | `UIUnitStats.Draw()` calling `Formula.DamageReduction` |

`DefFlat` and `MdefFlat` are separate derived values used by damage and reflect
logic; they are not folded into the sheet's DEF/MDEF formula. References:
`Formula.DefFlat(...)` and `Formula.MdefFlat(...)`.

## Accuracy, evasion, and critical stats

| Value | Current player formula | Difference from game-mechanics Discord channel | Repository character UI | Game reference |
| --- | --- | --- | --- | --- |
| Hit | `round((LV + 2*DEX + floor(LUK/3) + 25 + HIT) * (1 + HitMult/100))` | The game-mechanics Discord channel omits `floor(LUK/3)` | Same formula | `Formula.Hit(BaseUnitController, StatArray)` |
| Flee before crowd penalty | `round((20 + LV + AGI + floor(LUK/5) + 3*floor(AGI/10) + FLEE) * (1 + FleeMult/100))` | The game-mechanics Discord channel omits the base `20` | Same formula before penalty | `Formula.Flee(BaseUnitController, StatArray)` |
| Flee crowd penalty | Multiply by `1 - clamp((attackers - 4) * 0.1, 0, 1)` before the final round | Agrees with the game-mechanics Discord channel, which does not mention the clamp | Not applied; attacker count is unavailable | `Formula.Flee(...)`; `CombatComponent.GetFleePenaltyCount()` |
| Hit chance | `clamp(100 + attackerHit - defenderFlee, 5, 100)` | The game-mechanics Discord channel omits the 5% floor and 100% cap | Not calculated | `Formula.HitChance(int, int)` |
| Monster Hit | `round((LV + floor(DEX/2) + HIT) * (1 + HitMult/100))` | The old `LV * 2` statement omits the monster's DEX, flat HIT, and multiplier | Not calculated | `Formula.MonsterHit(StatArray, int, StatArray)` |
| Monster Flee | `round((LV + floor(AGI/2) + FLEE) * (1 + FleeMult/100))` | The old `LV * 2` statement omits the monster's AGI, flat FLEE, and multiplier | Not calculated | `Formula.MonsterFlee(StatArray, int, StatArray)` |
| Critical chance | `round((floor(LUK/3) + floor(LUK/10) + CRIT) * (1 + CritMult/100))` | Broadly agrees, with explicit floors and final round | Repository delays the floor/round until the whole expression, which can differ | `Formula.CriticalChance(...)` |
| Critical damage | `120 + floor(LUK/5) + CritDamage` | The game-mechanics Discord channel uses `120 + 2*floor(LUK/10) + CritDamage`; the two diverge at some LUK values | Same current formula | `Formula.CriticalDamage(StatArray, StatArray)` |
| Critical defence | `floor(LUK/5) + CritDef` | Agrees | Same current formula | `Formula.CriticalDefence(StatArray, StatArray)` |
| Perfect dodge | `clamp(floor(LUK/10) + PerfectDodge, 0, 100)` | The game-mechanics Discord channel omits the clamp | Repository uses `round(LUK/10)`, which can overstate the result | `Formula.PerfectDodge(...)` |

The game character sheet derives its displayed hit/flee percentages by applying
`Formula.HitChance` to the player's values and generated monster comparison
values. Reference: `UIUnitStats.Draw()`.

## Maximum resources

### Maximum HP

```text
CappedLevel = clamp(LV, 1, 130)
Growth = LSUM(CappedLevel) * BaseArchetypeHealthGrowth

MaxHP = max(1, round(
  ((200 + LV * 10 + Growth) * (1 + VIT / 100) + HP)
  * (1 + HpMult / 100)
))
```

Reference: `Formula.MaxHealth(BaseUnitController, StatArray, bool)`, including
its call to `GameServerRuntime.GetArchetype(...)`.

The game-mechanics Discord channel's base constant is `90`; the current game uses `200`. The level-sum
growth still stops at level 130, and the old archetype growth table agrees with
the current archetype data:

| Archetype | Growth | Archetype | Growth |
| --- | ---: | --- | ---: |
| Warrior | 130% | Knight | 100% |
| Rogue | 85% | Scout | 75% |
| Acolyte | 75% | Summoner | 70% |
| Mage | 50% | Weaver | 50% |

The repository uses the current `200` base, level-130 cap, and growth values, so
its normal player Max HP formula agrees with the game for the inputs it has.

### Maximum MP

```text
MaxMP = max(1, round(
  ((45 + LV * 5) * (1 + INT / 100) + MP)
  * (1 + MpMult / 100)
))
```

Reference: `Formula.MaxMana(BaseUnitController, StatArray)`.

The game-mechanics Discord channel and repository agree with the current formula. The repository's
short UI formula label omits flat MP and `MpMult`, but its implementation includes
both.

## Regeneration

For a player allowed to regenerate HP, the current game calculates:

```text
HPRegen = round(
  0.5
  * (MaxHP / 200 + VIT / 5 + HpRegen)
  * (2 + VIT / 100 + HpRegenMult / 100)
  + MaxHP * HpRegenMax / 100
)
```

The game has an additional runtime branch that reduces this result to 25% when
the corresponding combat-state flag is active. `NoRegenHp` returns zero.
Reference: `Formula.HealthRegen(BaseUnitController, StatArray)`.

The game-mechanics Discord channel uses `MaxHP / 100` and a single `1 + ...` multiplier, so it does not
match the current game. The repository implements the current formula only for
the no-modifier, normal-state case; it omits flat regen, percentage regen, maximum
HP regen, the no-regen flag, and the runtime 25% branch.

For MP:

```text
MpRegenFactor = 1 + MpRegenMult / 100

MPRegen = round((
  0.5
  * (MaxMP / 100 + INT / 5 + MpRegen)
  * (2 + INT / 100 + MpRegenMult / 100)
  + MaxMP * MpRegenMax / 100
) * MpRegenFactor)
```

`NoRegenMp` returns zero. Reference:
`Formula.ManaRegen(BaseUnitController, StatArray)`.

The final `MpRegenFactor` makes the current MP formula asymmetric with HP regen.
It is present in the current game method. The game-mechanics Discord channel omits it. The repository
again matches only the zero-modifier base case and omits all explicit regen stats
and the no-regen branch.

## Healing, status damage, reflect, siphon, and leech

| Value | Current game behavior | Comparison | Game reference |
| --- | --- | --- | --- |
| Healing base | `round((LV + INT + VIT) * value * 2.5)` | Matches the old structure; `value` is supplied by the caller and is not inherently identical to `Healing%` | `Formula.GetHealing(BaseUnitController, float)` |
| Status damage base | `round((LV + STR + AGI + INT) * value / 10)` | Matches the old base structure; stacks and the status-specific multiplier are caller-level inputs | `Formula.GetStatusDamage(BaseUnitController, float)` |
| Reflect damage | `round((LV + (DEF + DefFlat + ATK) / 2) * 4 * value * (baseMult + ReflectDamage/100))` | Algebraically agrees with the old formula when `value=1` and `baseMult=0`; the game exposes both extra inputs | `Formula.GetReflectDamage(BaseUnitController, float, float)` |
| HP siphon multiplier | `(LV + VIT) / 50` | The game-mechanics Discord channel says `(LV + STR) / 25`; both attribute and divisor are different | `Formula.SiphonMult(BaseUnitController, StatArray)` |
| MP siphon multiplier | `(LV + INT) / 50` | The game-mechanics Discord channel says `/25` | `Formula.SiphonMpMult(BaseUnitController, StatArray)` |
| Final displayed HP siphon | `SiphonHp * (LV + VIT) / 50`, formatted directly as a `Single` | Not reproduced by the repository UI; the game does not apply integer rounding in this display path | `UIUnitStats.Draw()` calling `Formula.SiphonMult` and `Single.ToString()` |
| Final displayed MP siphon | `SiphonMp * (LV + INT) / 50`, formatted directly as a `Single` | Confirmed by the `5.76` and `6.36` live values; the game does not apply integer rounding in this display path | `UIUnitStats.Draw()` calling `Formula.SiphonMpMult` and `Single.ToString()` |
| HP siphon amount sent to the integer combat queue | `ceil(SiphonHp * (LV + VIT) / 50)` | Separate from the fractional sheet value; this conversion is established by static call-site analysis, not by the sheet display | `CombatComponent.ApplyLeech(...)` calling `Formula.SiphonMult` |
| MP siphon amount sent to the integer combat queue | `ceil(SiphonMp * (LV + INT) / 50)` | Separate from the fractional sheet value; this conversion is established by static call-site analysis, not by the sheet display | `CombatComponent.ApplyLeech(...)` calling `Formula.SiphonMpMult` |
| HP leech amount sent to the integer combat queue | `ceil(damage * Leech / 100 * 0.2 * HealingReceived)` | The game-mechanics Discord channel's `Leech% * damage / 3` is not current; uses the same conversion call as siphon | `CombatComponent.ApplyLeech(...)`; `Formula.HealingReceived(...)` |
| MP leech amount sent to the integer combat queue | `ceil(damage * LeechMp / 100 * 0.02)` | Not distinguished in the game-mechanics Discord channel | `CombatComponent.ApplyLeech(...)` |
| Per-hit leech queue limit | `QueuedFromHit = min(CalculatedAmount, MaxResource * 0.2)` | The queue accepts no more than 20% of the applicable maximum resource from one addition | `LeechSystem.Add(int)`; constructor defaults |

The leech handler also rejects non-positive damage and several damage categories,
and limits how many targets from one damage application can contribute. Those
conditions are outside the simple amount formula.

The analyzed build also contains tooltip text saying MP siphon is scaled by
`(LV + INT) / 25`. That text conflicts with
`Formula.SiphonMpMult(...)`, which divides by 50. A fractional character-sheet
test resolves the conflict in favor of the compiled formula:

```text
LV = 95
Gear SiphonMp = 3

At INT = 1:
Multiplier = (95 + 1) / 50 = 1.92
Final displayed MP Siphon = 3 * 1.92 = 5.76

At INT = 11:
Multiplier = (95 + 11) / 50 = 2.12
Final displayed MP Siphon = 3 * 2.12 = 6.36

With no SiphonMp from gear:
Final displayed MP Siphon = 0 * 2.12 = 0
```

The fractional `5.76` and `6.36` results prove that the final character-sheet
stat is not ceiled, floored, or rounded to an integer. The `/25` tooltip is stale
for this tested build. A value labelled simply `MP Siphon` on gear or in a
raw-stat view is the `SiphonMp` input; the character sheet multiplies that input
by the level-and-INT factor.

`CombatComponent.ApplyLeech(...)` later converts the fractional result before
passing it to `LeechSystem.Add(int)`. That is a distinct combat/recovery path and
does not alter the displayed stat formula above.

## Status resistance

For ordinary player units, define the targeted modifier for a status as
`Immune[status]`. The final sheet resistance for each status is:

| Status | Final resistance formula | Game reference |
| --- | --- | --- |
| Bleed | `clamp(round(STR * 2/3 + Immune["Bleed"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Bleed, ...)` |
| Stagger | `clamp(round(STR * 2/3 + Immune["Stagger"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Stagger, ...)` |
| Slow | `clamp(round(AGI * 2/3 + Immune["Slow"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Slow, ...)` |
| Freeze | `clamp(round(AGI * 2/3 + Immune["Freeze"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Freeze, ...)` |
| Stun | `clamp(round(VIT * 2/3 + Immune["Stun"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Stun, ...)` |
| Decay | `clamp(round(VIT * 2/3 + Immune["Decay"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Decay, ...)` |
| Silence | `clamp(round(INT * 2/3 + Immune["Silence"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Silence, ...)` |
| Burn | `clamp(round(INT * 2/3 + Immune["Burn"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Burn, ...)` |
| Poison | `clamp(round(DEX * 2/3 + Immune["Poison"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Poison, ...)` |
| Blind | `clamp(round(DEX * 2/3 + Immune["Blind"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Blind, ...)` |
| Curse | `clamp(round(LUK * 2/3 + Immune["Curse"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Curse, ...)` |
| Weaken | `clamp(round(LUK * 2/3 + Immune["Weaken"]), 0, 100)` | `Formula.StatusResist(..., StatusDebuff.Weaken, ...)` |

Reference: `Formula.StatusResist(BaseUnitController, StatusDebuff, StatArray)`.

The final application values for a normal resistible status are:

```text
R = FinalResistance / 100
FinalApplicationChance = BaseApplicationChance * (1 - R)
FinalDuration = BaseDuration * (1 - R)
```

The application code preserves fractional chance by rolling the remaining
fraction after its integer chance roll. Some statuses explicitly fixed to a
one-second duration and configuration branches that bypass duration scaling are
exceptions to the duration formula.

The game uses exactly `2 / 3` before rounding, not a stored `0.66`, and adds a
status-targeted `StatusImmune` modifier before clamping. Monster and summon
branches differ. The repository uses `round(Attribute * 2 / 3)` and clamps it,
but cannot apply the targeted modifier because its basic rows are grouped only by
attribute, not by individual debuff.

The game-mechanics Discord channel's statement that resistance reduces both application chance and
duration therefore agrees with the normal game path. Reference:
`StatusComponent` status-application paths calling `Formula.StatusResist(...)`,
`SkillStatus.GetChance(...)`, and `SkillStatus.GetDuration(...)`.

## Move speed (not covered by the game-mechanics Discord channel)

In an ordinary, non-casting player state, the repository uses:

```text
MoveSpeed = 7.5 * (1 + MoveSpd / 100)
```

The game starts from its unit movement base and applies both additive `MoveSpd`
and multiplicative `MoveSpdMult` factors. Casting can replace the normal factor
with `FreeCastMove / 100`, or `0.01` without that stat:

```text
MoveSpeed = UnitBaseSpeed
  * CastingMovementFactor
  * (1 + MoveSpd / 100)
  * (1 + MoveSpdMult / 100)
```

Reference: `MoveComponent.CalibrateMoveSpeed()`.

The repository's 7.5 player base was verified against the synchronized game
value. Its calculation is correct for a normal player with no `MoveSpdMult`, but
does not represent the casting or multiplicative branches.

## Autocast notes

The current build contains the stated separation between autocast trigger types
and invokes autocasts through `AutocastHandler.Trigger(...)`. Auto-spell execution
is handled by `SkillsComponent.BeginAutoSpell()` and
`SkillsComponent.ApplyAutoSpell(...)`.

The following specific game-mechanics Discord channel claims were not recoverable as general formulas
from the character-stat methods and should be treated as configuration- or
skill-specific observations rather than universal current-build rules:

- autocast level is 30% of the skill maximum, rounded up;
- Heal, Soulstrike, and Thunderbolt map to the listed fixed autocast levels;
- learned skill level raises the autocast level;
- multihits count as one trigger and only autoattacks can trigger the listed
  autocasts.

The repository character UI displays learned passive effects, but does not
calculate autocast levels or chances.

## Repository implementation summary

| Repository row | Relationship to current game |
| --- | --- |
| Melee/ranged/magic attack scaling | Partial preview; missing full weapon, level, stance, total-stat, and per-attribute stages |
| Hit | Matches the current player formula |
| Flee | Matches before the live crowd penalty |
| Critical chance | Nearly equivalent but floors at a different stage |
| Critical damage and defence | Match |
| Perfect dodge | Uses `round` where the game uses `floor` |
| Maximum HP and MP | Match for available normal-player inputs |
| Base HP/MP regeneration | Match only when all explicit regen modifiers are zero and no special runtime branch applies |
| Attribute status-resistance rows | Match the base attribute contribution, without status-targeted modifiers |
| Move speed | Matches an ordinary player with no multiplicative move-speed modifier |
| Advanced gear rows | Raw gear totals only; the UI explicitly reports that no base formula is known |

The repository's “Actual” column is independent of these formula reconstructions:
it uses synchronized server values for maximum HP, maximum MP, and move speed when
those records are available. References in repository code:
`packages/character/src/formulas.ts`, `packages/character/src/tracker.ts`, and
`packages/ui/src/characterview/index.ts`.
