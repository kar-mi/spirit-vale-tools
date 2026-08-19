---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-combat": minor
---

Decode NetworkTransform movement updates and track object positions.

`NetworkTransform`'s three movement RPCs declare a bare `ArraySegment<byte>` that the generated RPC
map cannot describe. Their layout is fixed by FishNet rather than the game build, so it is now
parsed directly: `decodeNetworkTransformData` reads the per-axis flags, the fixed-point and float32
axis forms, and the optional scale extension, and the result is exposed on a packet as
`networkTransform`.

`FishNetPositionTracker` turns those partial updates into whole positions by carrying each object's
last known axes forward from its spawn transform. It performs no local-player inference of its own —
the caller supplies the local object id from the existing identity sources.
