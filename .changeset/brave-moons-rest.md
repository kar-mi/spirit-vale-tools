---
"@kar-mi/spirit-vale-tools-logging": minor
---

Add `pruneLogSessions`, so a consumer can bound how many session logs an install keeps.

Nothing removed session logs before, and nothing else will: they are the canonical record the read
model is rebuilt from. Left alone, an install accumulates every session it has ever recorded — a few
weeks of play reaches hundreds of sessions and hundreds of megabytes.

Pruning is deliberately conservative, because it deletes user data: a session any current-stream
pointer still refers to is never removed however old, only directories carrying a `session.json`
whose id matches the directory name are considered, symlinks are never followed, and a session that
cannot be removed is reported rather than thrown.
