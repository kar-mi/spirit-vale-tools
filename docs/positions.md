# Positions and ground loot

How world coordinates reach a consumer, why a position event is not simply "the
position that packet contained", and how to identify which object is yours.

Everything here describes packets already produced by the capture layer. For the
byte layouts behind them — the spawn transform header and the NetworkTransform
update format — see [packet decoding](packet/packet-decoding.md).

## Where coordinates come from

Two feeds carry world position, and a consumer needs both:

| Source | Packet | Carries |
| --- | --- | --- |
| Spawn transform | `objectSpawn` | `spawnLocalPosition`, and optionally `spawnLocalScale`/`spawnLocalRotation` |
| Movement updates | `NetworkTransform` RPCs | `networkTransform`, holding the axes that changed |

The spawn is the only packet that always carries a whole position. Movement
updates are partial by design: each axis is either resent or omitted to mean
unchanged, so a single update is usually one or two axes, not three.

Combat RPCs also carry coordinates — `Attack_C`'s `position`, `ApplyDamage_C`'s
`origin` — but those are event locations, not a movement feed, and they are
already exposed as ordinary `decodedFields`.

## Consuming position events

`FishNetPositionTracker` in `packages/combat/src/tracking/position-tracker.ts` turns the
two feeds into whole positions. Feed it every decoded packet:

```ts
import { FishNetActorDirectory, FishNetPositionTracker } from "@kar-mi/spirit-vale-tools-combat";

const directory = new FishNetActorDirectory();
const positions = new FishNetPositionTracker({ directory });

for (const packet of decodedPackets) {
  directory.consume(packet);           // names first, so a position can resolve one
  for (const event of positions.consume(packet)) {
    // event: { kind, tick, objectId, position: { x, y, z }, displayName?, self }
  }
}
```

The tracker also answers point-in-time questions without replaying events:
`get(objectId)`, `self()`, and `snapshot()` for everything currently placed.

### An event is a whole position, not a packet

The tracker carries each object's last known axes forward and applies the
changed ones. That has a consequence worth planning for: **an object emits no
events until a full position is known.** An update naming only `x` for an object
that has never been placed produces nothing, because reporting the missing axes
as `0` would put it at the world origin.

In practice an object is placed by its spawn and moves from there. An object
whose spawn was missed — anything already in the world when the capture attached
— stays silent until one update happens to carry all three axes.

### Identifying yourself

The tracker performs no local-player inference of its own. That is already
solved twice over, and a third mechanism would only be a way to disagree:

- `FishNetCharacterTracker.currentObjectId()` pins the object emitting
  `serverRpc` traffic, which only the local client sends.
- `FishNetActorDirectory` carries the local display name, decoded from
  `LoadCharacter_T` / `CharacterCallback_T`.

Hand the object id in, and every event gains a correct `self` flag:

```ts
character.consume(packet);
positions.setLocalObjectId(character.currentObjectId());
```

Your own movement arrives on outbound `ServerUpdateTransform` packets rather
than the observer feed carrying everyone else. On a capture that attached
mid-session these resolve through prefab-layout recovery; see the resolution
rules in [packet decoding](packet/packet-decoding.md).

### Resetting

`consume()` clears itself on `authenticated` and `disconnect`, because object
ids are scoped to one connection and reusing them across a boundary would place
objects with another connection's ids. A consumer that reconstructs sessions
some other way can call `reset()` directly.

## Ground loot

`FishNetLootDropTracker` in `packages/rewards/src/loot-drop-tracker.ts` tracks
items lying on the ground, combining the same spawn transform with the
`LootDrop` SyncVars:

```ts
import { FishNetLootDropTracker } from "@kar-mi/spirit-vale-tools-rewards";

const loot = new FishNetLootDropTracker();
for (const packet of decodedPackets) {
  for (const event of loot.consume(packet)) {
    // event.kind: "spawn" | "update" | "removed"
    // event.drop: { objectId, position?, displayName?, rarity?, lootType?, partyId?, playerId?, … }
  }
}
```

A drop's identity usually arrives inside its own spawn packet, so most drops are
named at `spawn` time; an `update` follows only when a later SyncType changes
something. Not every drop sends a follow-up SyncType, which is why the spawn
body is decoded rather than waited past.

`removed` means the drop left the ground. A despawn carries only an object id —
no reason and no actor — so it is never reported as a pickup by anyone.

## Positions are live state, not a log

Position is deliberately memory-only. It follows the same shape as active
statuses: a tracker holds the state, consumers subscribe to snapshots, and
nothing is persisted.

- The shareable combat stream is an allowlist. `sanitizeCombatData` copies only
  named scalar keys, so a coordinate triple could not pass it even if the key
  were added, and [packet routing](packet/packet-routing.md) states those
  records exclude coordinates.
- The volume is unlike an event stream. A single object can emit hundreds of
  updates a minute, across every object in range.

Raw `capture` streams are a different matter: they are unsanitized and already
contain every coordinate observed. That is one of the reasons capture files are
treated as sensitive and stay out of version control.

If position ever does need persisting, it wants its own stream and its own
sanitizer rather than a widening of the combat allowlist, so that a shared
combat log stays coordinate-free.
