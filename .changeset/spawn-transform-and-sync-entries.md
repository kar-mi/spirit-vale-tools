---
"@kar-mi/spirit-vale-tools-capture": minor
---

Decode object spawn transforms and every SyncType in a bundled body.

`objectSpawn` previously skipped its transform header; its position and scale are now read and
exposed as `spawnLocalPosition` and `spawnLocalScale`, with `spawnLocalRotation` for the
uncompressed quaternion form. A `syncType` body carrying several SyncTypes now decodes all of them
into `syncEntries` instead of only the first, so layouts that share a payload no longer fall into
`undecodedPayload`.

An ObjectSpawn's own SyncTypes are decoded too, as `spawnSyncEntries`. That body is framed
differently from a standalone SyncType packet — each run is a component index, a count, and then
that many index-prefixed values — and it is where a short-lived object's state often arrives, since
a follow-up SyncType packet is not guaranteed.

Adds `findPrefab` for resolving a spawn's collection and prefab IDs to the build's prefab layout,
so consumers can match on `prefabName` rather than a wire ID that changes between builds.
