---
"@kar-mi/spirit-vale-tools-statuses": minor
"@kar-mi/spirit-vale-tools-capture": patch
"@kar-mi/spirit-vale-tools-combat": patch
---

Name the `ApplyEffectDisplays_O` wire fields and carry status re-application cooldowns.

- `capture`: the datamine now describes `StatusComponent+QueuedEffectDisplay`, so the
  generated RPC map spells out its fields (`Id`, `Duration`, `Stacks`, `StacksMax`,
  `ShowFx`) instead of an opaque array element.
- `combat`: `decodeEffectDisplays` names the trailing byte `ShowFx` — a cosmetic
  apply-flash flag — and documents that the feed is a per-(bearer, status) summary
  (latest stack total, longest remaining stack timer); per-stack application data is
  never on the wire.
- `statuses`: `FishNetStatusDefinition` gains `cooldown` (`config.Cooldown`, seconds),
  the minimum gap before the same source can re-apply a status; present only when
  non-zero.
