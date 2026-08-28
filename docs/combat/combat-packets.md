# Combat packets

How `FishNetCombatTracker` turns decoded FishNet RPCs into combat events, what
each packet actually carries, and which feeds are still on the floor.

Everything here describes packets already produced by the capture layer. For how
bytes become a `CapturedFishNetPacket` in the first place — link resolution,
ambiguity, and the quarantine that survives a re-authentication — see
[packet decoding](../packet/packet-decoding.md).

## Dispatch

`consume()` in `packages/combat/src/combat-tracker.ts` matches on `rpcName` plus
the owning behaviour, and returns zero or more events per packet:

| RPC | Behaviour | Event |
| --- | --- | --- |
| `CastBegin_C`, `AutoCast_C`, `CastComplete_C`, `CastInterrupt_C`, `CastCancel_C` | `SkillsComponent` | `activation` |
| `Attack_C` | `CombatComponent` | `activation` (basic attack) |
| `ApplyDamage_C` | `HealthComponent` | `damage` |
| `Death_C` | `HealthComponent` | `death` |
| `Recover_C` | `HealthComponent` | `heal` |
| `ApplyEffect_T`, `RemoveEffect_T` | `StatusComponent` | `status` |
| `ApplyEffectDisplays_O` | `StatusComponent` | `status` (one per entry) |
| `ApplySkillDisplay_O`, `RemoveSkillDisplay_O` | `StatusComponent` | `status` |
| `ToggleBegin_C` | `SkillsComponent` | `activation` |
| `CalibrateSummons_T` | `SummoningComponent` | `summon` (one per changed skill) |
| `FullHeal_C` | `PlayerController` | `fullHeal` |

The behaviour check is `matchesBehaviour`, which passes when the packet's
behaviour type is *undefined* as well as when it matches. That deliberate
looseness lets a packet whose component binding was never established still be
handled, at the cost of accepting a same-hash RPC from another behaviour — which
is why `SkillsComponent.Recover_C` (a real, distinct RPC sharing hash 1 with
`HealthComponent.Recover_C`) is filtered out by behaviour rather than by hash.

## Status effects

Statuses arrive on **two independent feeds**, and the difference between them
matters more than anything else in this document.

### `ApplyEffect_T` / `RemoveEffect_T` — owner only

```
hash 3  targetRpc  ApplyEffect_T(statusId: string, level: packedInt32)
hash 4  targetRpc  RemoveEffect_T(statusId: string, level: packedInt32)
```

Target RPCs go to one client: the owner of the object. They are edge-triggered —
sent when a status starts or ends, and not repeated. They carry a **level** but
no duration, so the expiry has to be derived from the bundled status catalog via
`statusDurationSeconds(definition, level)`.

They are also rare. In a ~7 minute capture with heavy combat these fired **34
times across 6 actors**.

### `ApplyEffectDisplays_O` — every actor in range

```
hash 5  observersRpc  ApplyEffectDisplays_O(
          applies: QueuedEffectDisplay[],
          removes: List<string>)
```

An observers RPC, so it reports every actor the client can see, and it repeats
periodically while a status is merely still active rather than only on change.
In the same capture it fired **9,076 times across 184 actors**, carrying 12,947
entries — roughly 370× the owner-only feed.

The repetition makes it self-healing: a dropped packet costs one refresh
interval, not the whole status. The trade-off is that it carries **no level**.

#### `QueuedEffectDisplay` on the wire

The RPC map declares the array element as an opaque type, so the layout was
derived from captures. Each entry:

| Field | Codec | Meaning |
| --- | --- | --- |
| `statusId` | length-prefixed UTF-8 | catalog status id |
| `remaining` | `float32` | seconds left; negative means no expiry |
| `stacks` | packed int | current stack count |
| `maxStacks` | packed int | server-declared ceiling, `0` when none |
| — | byte `0`/`1` | meaning unestablished; validated then discarded |

Then a `List<string>` of ids to remove. `decodeEffectDisplays`
(`packages/combat/src/effect-display.ts`) is strict: it must consume the payload
exactly, or it throws and the packet is skipped rather than half-read.

Framing alone could not pin these fields — `u8` and packed int encode
identically for small values, so three candidate layouts all consumed all 9,535
captured payloads exactly. What separated them was behaviour over time:

```
ComboReady   4.000 → 3.000 → 2.667 → 1.833 → 4.000   float tracks wall clock,
                                                     resets on recast
Poison      10.000 held steady while stacks climbed
             3 → 6 → 13 → 29 → 43 → 72
```

and a captured `Might` entry that pins the last pair outright — `stacks = 22`,
`maxStacks = 25`, which is exactly where Might caps.

Cross-checking the float against the catalog is *misleading*: the server sends
live remaining time, not the nominal duration, so a valid `Haste` entry reads
292.5s against a catalog value of 60.

### Reconciling the two feeds

`FishNetStatusTracker.consumeStatus` merges both into one per-actor map:

- **Expiry.** A server-reported `remainingSeconds` always wins. The subtlety is
  what *absence* means. On the display feed the server states remaining time for
  everything it reports, so nothing there means the status genuinely has no
  expiry — falling back to the catalog would expire a permanent buff on a timer
  it never had. On the owner-only feed absence just means the wire carried no
  duration, and the catalog is the best answer available. `resolveExpiry`
  encodes exactly this split.
- **Level.** The display feed has none, so the tracker keeps whatever the
  owner-only feed last established rather than resetting to 1 and mis-deriving
  every level-scaled duration from then on.
- **`appliedAtMs`.** Not advanced by display refreshes, or it would creep
  forward for a status's whole lifetime.

`advance()` drops statuses whose expiry has passed, because the server does not
always send an explicit removal.

### `ApplySkillDisplay_O` / `RemoveSkillDisplay_O` — the icon feed

```
hash 1  observersRpc  ApplySkillDisplay_O(id: string, lv: packedInt32)
hash 2  observersRpc  RemoveSkillDisplay_O(id: string)
```

A third, much smaller feed announcing a *skill* shown on an actor — stances and
auras the effect feed never reports. Its ids partly overlap the effect feed, and
it carries no timing at all, so it must never answer the expiry question: doing so
would silently turn a timed buff permanent. `resolveExpiry` keeps a known expiry
when an event from this feed brings none, and its repeats do not restart
`appliedAtMs`.

## Damage and death

```
hash 0  observersRpc  ApplyDamage_C(dmg: Damage, position: vector3, origin: vector3)
hash 2  observersRpc  Death_C(dmg: Damage)
```

`Damage` is fully described in the RPC map, and unlike `Recover_C` it names the
attacker:

`Team`, `Value`, `Type`, `Hit`, `Hits`, `DamageSourceId` (string), `AttackerId`,
`IsClone`, `IsSummon`, `Element`, `WeaponType`, `Range`.

The RPC's `objectId` is the **victim**; `AttackerId` is the dealer. `Death_C`
repeats the killing blow's `Damage`, so a lethal hit appears on both feeds —
`duplicatesDamageEvent` marks the death event whose damage was already counted,
which is what keeps totals from doubling.

`Hits` is a wire-level multi-hit count, surfaced as `wireHits`.

## Healing

```
hash 1  observersRpc  Recover_C(amount: packedInt32, settings: FloaterSettings)
```

The healed target is the RPC's `objectId`. There is no healer field on the wire
at all, so attribution is inferred from nearby cast activity — see
[healing attribution](healing-attribution.md) for how, and for its limits.

## Skill activations

```
hash 6  observersRpc  CastBegin_C(dto: SkillStateDto, targetId, position, castTime, animTime)
hash 3  observersRpc  AutoCast_C(dto: SkillStateDto, obj, position)
hash 7  observersRpc  CastComplete_C()
hash 8  observersRpc  ToggleBegin_C(id: string)
```

`SkillStateDto` is rich — `Id`, `Level`, `CurrentCooldown`, `Cooldown`,
`Duration`, `CooldownRecoveryRate`, `MinCooldown`, `Cost`, `Charges`,
`CastTime`, `Delay`, `Area`, `Range`, `LeapType` — so a cast carries the caster's
full cooldown state, not just which skill fired. Only `Id`, `Level` and
`targetId` are used today.

Activations exist mainly to attribute damage and heals: `consumeDamage`
correlates a hit against recent activations by source id within `hitGraceTicks`
(default 30), and stale activations are pruned after `activationMaxAgeTicks`
(default 900).

`ToggleBegin_C` is in `SKILL_RPC_NAMES` and yields an activation; it names its skill
in a bare `id` rather than in a `SkillStateDto`.

## Summons

```
hash 0  targetRpc     CalibrateSummons_T(data: SummonSkillData[])
hash 4  observersRpc  CloneEffect_C()
hash 2  targetRpc     ApplyRecall_T(obj)
```

`CalibrateSummons_T` is a **complete snapshot**, not a delta: each entry is one
live summon (`SkillId`, `Id`, `Level`), so three clones means three entries with
the same `SkillId`. The capture layer decodes the repeated nested structure from
the generated RPC map, and `consumeSummonCalibration` diffs it
against the previous snapshot and emits only changed counts, which is why an
unchanged repeat produces no event.

Being a target RPC it reaches only the summoner. Because it is also the *only*
signal, a missed one leaves the count stale until the next snapshot. Only a
verified `SummoningComponent` resolution is accepted. Unnamed, recovered,
partially decoded, or trailing-data packets are ignored; summon state is never
recovered by interpreting an unresolved payload heuristically.

`CloneEffect_C` and `ApplyRecall_T` are not consumed. `CloneEffect_C` fires on the
*clone's* own object rather than the summoner's, carries no count, and lands only
some tens of milliseconds before the calibration that follows it — so it cannot
update a stack count on its own and buys no useful head start.

## Feeds not consumed



| Packet | Why it is left alone |
| --- | --- |
| `SummoningComponent.CloneEffect_C`, `ApplyRecall_T` | No count on the wire, and no useful head start over the calibration. |
| Unidentified 16-bit-hash RPCs | Real traffic the map has no entry for; now correctly unresolved rather than wrongly named. |

`PlayerController.FullHeal_C` *is* consumed, as its own `fullHeal` kind rather than
a `heal`. It restores an actor outright, but the RPC declares no arguments so the
wire carries no amount, and in game it is a town NPC service rather than combat
healing. `reducers/meter.ts` only counts `kind: "heal"`, so the separate kind keeps
a full health bar out of HPS structurally instead of via a flag someone has to
remember. It fired **once** in a ~7 minute capture.

Health and mana sync are *not* in this list: `HealthComponent` syncvars 0/1
(current/max HP), `SkillsComponent` 0/1 (current/max mana) and `MoveComponent`
move speed are decoded by `packages/character/src/record-decoder.ts`, which reads
syncvar indexes positionally. The RPC map now also names those four positions, so `syncName` and a decoded field appear on
health and mana updates. Indexes whose meaning is not established stay unnamed
rather than guessed. That path is scoped to the **local** character either way, so
per-actor health for other players and mobs is still unavailable to the combat
side.

## A resolved name is not proof

`lookupRpc` matches a packet against *both* the 8-bit and 16-bit wire-hash
readings and accepts whichever finds an entry. It does not check that the chosen
method could have produced these bytes, so when a behaviour with many RPCs uses a
16-bit hash whose low byte collides with another behaviour's 8-bit hash, the wrong
method wins — and `inferBehaviourType` then binds that component index to the
wrong behaviour, so the mistake outlives the packet.

`FullHeal_C` was the clearest case. It declares no arguments, so a genuine one
carries nothing; over one capture 122 of 123 packets named `FullHeal_C` arrived
with a 1-byte payload on component index 1, which is not where `PlayerController`
sits on a player object. That byte was the high half of a 16-bit hash
(`1e66` → 26142). Exactly **one** was real.

`applyRpcLookup` now refuses a match whose declared parameter list is empty when
the packet carries bytes, and `parseFixedRpc` withdraws the inferred behaviour
rather than binding the component from a refused match. Across the same capture
that withdraws 141 names and re-points **none** — the guard can only ever take
back a name, never invent or redirect one:

| Withdrawn | |
| --- | --- |
| `PlayerController.FullHeal_C` | 122 |
| `PlayerController.StopEmote_C` | 8 |
| `SkillsComponent.CastCancel_C` | 5 |
| `MoveComponent.Dodge_O` | 2 |
| four others | 1 each |

Damage, death, heal, status and summon counts are byte-identical either way; the
only behavioural change is five phantom cast-cancels leaving the activation feed.

The rule is deliberately narrow. A method whose parameters merely fail to decode
is left alone, because the map models many payloads only partially —
`PlayerSave.CharacterCallback_T` never fully decodes and is perfectly real. Only
"declares no arguments, yet carries bytes" is airtight, and it is safe precisely
because the map generator records parameters even for types it cannot break down:
242 of 253 parameterised entries include such a type, so an empty parameter list
genuinely means none.

A softer version of the same check is still useful when investigating: decode a
payload against its resolved signature and see whether it is consumed exactly.
About 3% of resolved packets do not fit, and most of that residue is modelling
gaps rather than misresolution — treat it as "look here", not "this is wrong".
