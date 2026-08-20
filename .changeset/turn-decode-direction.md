---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-combat": minor
---

Decode the rotation quaternion FishNet's `NetworkTransform` and spawn RPCs carry (all three wire packings: 16-byte uncompressed, and the 8- and 4-byte "smallest three" compressed forms), and derive a heading (yaw) from it. `networkTransform.rotation`/`.heading` and `spawnLocalRotation`/`spawnHeading` are now populated on `DecodedFishNetPacket` instead of being left undecoded, and `FishNetPositionTracker`'s `FishNetPosition` gained an optional `heading` field that carries forward the same way position axes do.
