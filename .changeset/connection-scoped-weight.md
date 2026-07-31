---
"@kar-mi/spirit-vale-tools-character": minor
---

Scope live character tracking to the transport connection that pinned the local player object. The client keeps several server connections open at once, so an `authenticated` or `disconnect` raised on a neighbouring connection was releasing the pin held on the live one, blanking health and mana mid-session; object ids are only unique within a connection, so buffered records now key on both. Carried weight also survives connection boundaries, despawns and re-pins now — it is character-scoped like the snapshot it is derived from, and only a complete callback can restore it, so clearing it left the panel weightless until the following map change. Health and mana keep their object-scoped lifetime, since the sync stream refills them within moments.
