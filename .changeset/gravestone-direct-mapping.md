---
"@kar-mi/spirit-vale-tools-capture": minor
---

`decodeBossGravestone` now reads the boss's kill info from the bundled RPC map's own field schema instead of byte-scanning the spawn payload's tail for three plausible strings and a timestamp. `BossGraveStone`'s `SyncVar<BossKillInfo>` was never resolved into the wire map before, so this is a data-mine extraction fix as much as a decode one: `KillTime`/`KillerName`/`BossName`/`BossId` are now generated fields like any other SyncType, decoded automatically into a spawn's `spawnSyncEntries` the same way `LootDrop`'s `Dto`/`Lock` already are.

`decodeBossGravestone`'s signature changes accordingly, from `(payload: Buffer, nowMs: number)` to `(packet: DecodedFishNetPacket)` — it now looks up the `BossGraveStone` entry in `packet.spawnSyncEntries` instead of taking a raw payload and an observation time to bound a plausible decode.

`scripts/generate-rpc-map.ts` also had a path bug fixed: it was resolving `generated/` and `game-build.ts` relative to its own location as if it lived under `packages/capture/scripts/`, when it has lived at the repo-root `scripts/` since it was added. Running it wrote a stray `src/` at the repo root instead of updating `packages/capture/src/`.
