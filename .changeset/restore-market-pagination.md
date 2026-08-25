---
"@kar-mi/spirit-vale-tools-market": major
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-logging": minor
---

Restore market search, stall tracking, event logs, live following, and capture
replay with the current vending contracts. Add deterministic search-request and
stall-status field layouts to the supported FishNet map, including explicit
verified-prefix handling for late-attach search requests, and register the market
log stream. The restored market API intentionally excludes the former SQLite
history and indexed read-model interfaces. Market event logs omit seller account
identifiers while retaining seller display names, and omit stall account and
visual-snapshot and archetype data. Item compatibility fingerprints and payload
schema versions are recorded once as market metadata instead of repeated on
every listing.
