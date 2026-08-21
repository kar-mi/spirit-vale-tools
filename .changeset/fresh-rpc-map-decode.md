---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-character": patch
"@kar-mi/spirit-vale-tools-combat": patch
---

Decode `CharacterData` payloads through the bundled RPC map's own field schema instead of hand-rolled, positionally-hardcoded byte readers. The old readers silently misaligned every field after a build inserted `AppliedWriteIds` into `CharacterData`, and separately truncated non-Latin display names sized as if a character were always one byte. `character`'s `decodeCharacterRpcPayload` and `combat`'s actor-name resolution now both decode through `decodeFieldRun`/`characterDataParameter()`, so they can't drift from the game build's real field layout again.

`capture` gains the schema-decoding building blocks this relies on (`decodeFieldRun`, `characterDataParameter`, and `repeated`/`dictionaryKey` array and dictionary support in the field decoder), and its bundled FishNet RPC map is now regenerated from the game build via `packages/capture/scripts/generate-rpc-map.ts` instead of hand-pasted, split into one file per network behaviour instead of one 12k+ line file.

The bundled map's `syncTypes` also gained many previously-unextracted SyncVars now that the map is build-derived instead of hand-verified per behaviour: `HealthComponent` gained `barrierSync`/`overhealSync` alongside the existing `CurrentHealth`/`MaxHealth`, `SkillsComponent` gained `BondSync` alongside `CurrentMana`/`MaxMana`, and `CombatComponent`/`MonsterController`/`MoveComponent`/`PlayerController`/`StatusComponent`/`SummoningComponent` now carry SyncVar metadata they previously had none of at all (`PlayerController` alone gained 19 - chat room state, guild info, party ID, GM/jail flags, and more).
