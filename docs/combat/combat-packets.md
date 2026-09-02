# Combat packets

How `FishNetCombatTracker` turns decoded FishNet RPCs into combat events, what
each packet actually carries, and which feeds are still on the floor.

Everything here describes packets already produced by the capture layer. For how
bytes become a `CapturedFishNetPacket` in the first place — link resolution,
ambiguity, and the quarantine that survives a re-authentication — see
[packet decoding](../packet/packet-decoding.md).

## Dispatch

`consume()` in `packages/combat/src/tracking/combat-tracker.ts` routes RPCs and
SyncTypes by their owning behaviour and returns zero or more events per packet:

| Signal | Behaviour | Event |
| --- | --- | --- |
| `CastBegin_C`, `AutoCast_C`, `CastComplete_C`, `CastInterrupt_C`, `CastCancel_C` | `SkillsComponent` | `activation` |
| `Attack_C` | `CombatComponent` | `activation` (basic attack) |
| `ApplyDamage_C` | `HealthComponent` | `damage`, or `heal` when its value is negative |
| `Death_C` | `HealthComponent` | `death` |
| `Recover_C` | `HealthComponent` | `heal` |
| `ApplyEffect_T`, `RemoveEffect_T` | `StatusComponent` | `status` |
| `ApplyEffectDisplays_O` | `StatusComponent` | `status` (one per entry) |
| `ApplySkillDisplay_O`, `RemoveSkillDisplay_O` | `StatusComponent` | `status` |
| `LoadCharacter_T` | `PlayerSave` | `status` (one per saved active effect) |
| `ToggleBegin_C` | `SkillsComponent` | `activation` |
| `CalibrateSummons_T` | `SummoningComponent` | `summon` (one per changed skill) |
| `SummonerSync`, `SummonSkillSync` | `SummoningComponent` | `summon` login fallback |
| `barrierSync` | `HealthComponent` | `shield` |
| `FullHeal_C` | `PlayerController` | `fullHeal` |
| Object spawn/despawn | Object lifecycle | monster identity changes and per-object summon corrections |
| Authentication/disconnect | Connection lifecycle | identity, summon, activation, healing, and shield state resets |

Most RPC paths use `matchesBehaviour`, which also accepts a packet whose
behaviour type is unavailable. Payload validation and RPC resolution constrain
those paths. `CalibrateSummons_T` and `LoadCharacter_T` are stricter: both require
a verified resolution and their exact behaviour. `SkillsComponent.Recover_C`
(mana recovery) is filtered from the health-healing path by behaviour.

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

### `LoadCharacter_T` — login snapshot

`PlayerSave.LoadCharacter_T` carries the character save's active-effect
snapshot. The tracker accepts it only with a verified `PlayerSave` resolution
and emits an applied status for every complete `State.Effects` entry. This is
the initial source for effects that were already active when the client
connected; later status RPCs and display refreshes update the same status state.

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
(`packages/combat/src/events/effect-display.ts`) is strict: it must consume the payload
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

The target is the RPC's `objectId`; `Recover_C` has no source field.
`FloaterSettings` provides `DisableFloater`, `DisableSfx`, `Offset`, and `Scale`.
Source attribution uses targeted activations, active regeneration state, and
Guardian Bond relationships. See [healing attribution](healing-attribution.md).

## Shields

`HealthComponent.barrierSync` is the absolute shield amount for its object.
Changes emit `kind: "shield"` events with an exact `targetId`. Gains correlate
their source from barrier metadata and a targeted `CastBegin_C.targetId` or
`AutoCast_C.obj`; the SyncVar itself has no source field. Initial spawn state
sets the baseline without emitting a gain.

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
full cooldown state, not just which skill fired. The tracker uses `Id`, `Level`,
and the appropriate target field (`targetId` or `obj`).

Activations exist mainly to attribute damage and heals: `consumeDamage`
correlates a hit against recent activations by source id within `hitGraceTicks`
(default 30), and stale activations are pruned after `activationMaxAgeTicks`
(default 900).

`ToggleBegin_C` is in `SKILL_RPC_NAMES` and yields an activation; it names its skill
in a bare `id` rather than in a `SkillStateDto`.

## Summons

```
hash 0  targetRpc     CalibrateSummons_T(data: SummonSkillData[])
sync 0                 SummonerSync(owner: NetworkObject)
sync 2                 SummonSkillSync(data: SummonSkillData)
hash 4  observersRpc  CloneEffect_C()
hash 2  targetRpc     ApplyRecall_T(obj)
```

`CalibrateSummons_T` is a **complete snapshot**, not a delta: each entry is one
live summon (`SkillId`, `Id`, `Level`), so three clones means three entries with
the same `SkillId`. The capture layer decodes the repeated nested structure from
the generated RPC map, and `consumeSummonCalibration` diffs it
against the previous snapshot and emits only changed counts, which is why an
unchanged repeat produces no event.

Being a target RPC, `CalibrateSummons_T` reaches only the summoner. Only a
verified `SummoningComponent` resolution is accepted. Unnamed, recovered,
partially decoded, or trailing-data packets are ignored; summon state is never
recovered by interpreting an unresolved payload heuristically.

An existing summon is restored at login through SyncTypes on the summoned
object. `SummonSkillSync` identifies the skill and `SummonerSync` identifies the
owning actor. The two values may arrive in either order, so the summon tracker
joins them by the summoned object's network object id and counts that object
once both are known. Despawn removes a contribution established by this path.
A later `CalibrateSummons_T` snapshot becomes authoritative for its actor and
supersedes per-object fallback counting.

`CloneEffect_C` and `ApplyRecall_T` are not consumed. `CloneEffect_C` fires on the
*clone's* own object rather than the summoner's, carries no count, and lands only
some tens of milliseconds before the calibration that follows it — so it cannot
update a stack count on its own and buys no useful head start.