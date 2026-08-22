---
"@kar-mi/spirit-vale-tools-capture": major
---

Rebuild Eternal Tower state from the `DrawTitle` and `ClientInstancedMapReady` RPCs, exposing the tower name, floor, and instance information when available. This replaces the previous phase-based tracker: `FishNetEternalTowerPhase` is no longer exported.

Decode monster state and spawn SyncTypes from the bundled RPC map rather than heuristic scans of raw payload bytes. `decodeMonsterSync` is no longer exported; consume the decoded packet fields and `spawnSyncEntries` instead.
