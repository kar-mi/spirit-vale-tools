---
"@kar-mi/spirit-vale-tools-rewards": patch
---

Drop the `node:readline` dependency from `loadRewardReplay`, which broke browser bundles.

The package's bundle is a single entry point, so a Node builtin anywhere in it reaches every
consumer. A browser build that imports this package only for its pure trend helpers
(`buildCumulativeTrend`, `buildRateTrend`, `trendExtent`, `bigintRatio`) failed outright with
"Browser build cannot import Node.js builtin: readline". `loadRewardReplay` now splits the stream
with a `TextDecoder`, the same way the combat package's replay loader does, so nothing in the graph
pulls a builtin. Behaviour, including CRLF handling, is unchanged.
