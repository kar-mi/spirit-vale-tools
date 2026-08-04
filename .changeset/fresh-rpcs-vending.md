---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-market": major
---

Update capture decoding for the current Spirit Vale network protocol and build fingerprint. Bundle the complete regenerated RPC map, recover client-writer-only ServerRPC registrations, correct current prefab component layouts, add signed packed 64-bit decoding, and reject RPC matches whose known signatures do not consume the payload exactly.

Migrate market decoding to the current JSON vending contracts and update persisted market stalls to use `stallId` and `slotId`. This removes the public `stallIndex` and `rotationY` fields, replaces the old binary vending DTO decoder, and bumps the market read-model schema.
