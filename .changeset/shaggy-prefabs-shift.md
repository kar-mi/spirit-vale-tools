---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-combat": patch
---

Update the bundled game build to `ae23cb62`. RPC behaviours, broadcasts and SyncTypes are unchanged from the previous build; the spawnable-prefab table was reassigned, moving the player clone to prefab 1, `SkillInstance` to 2 and leaving the real player on 4. Prefab definitions now carry `prefabName`, the only thing separating the identically shaped `Player` and `PlayerClone` layouts. Combat's actor directory derives its player prefabs from the bundled map instead of a hardcoded ID that had gone stale two builds ago, and counts both `Player` and `PlayerClone`, so spawns without RPC-link registrations name players again and clone damage is attributed to its owner instead of an anonymous actor.
