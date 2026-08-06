# @kar-mi/spirit-vale-tools-metrics

Shared rate-estimation primitives for Spirit Vale tools.

> **Internal package.** This package is published only because the domain
> packages (`combat`, `rewards`) depend on it at runtime; it is installed
> automatically alongside them and is not a supported public API.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-metrics
```

## Usage

`RateTracker` accumulates one metric — experience, coins, or anything else countable — into a
running total, an exponentially-weighted per-second rate, and a bucketed timeline for graphing. It
is value-agnostic, so a second instance fed a different metric behaves identically:

```ts
import { RateTracker } from "@kar-mi/spirit-vale-tools-metrics";

const experience = new RateTracker();
const coins = new RateTracker();

experience.record(kill.experience, recordedAtMs);
coins.record(kill.coins, recordedAtMs);

const { total, perSecond, perHour, timeline } = experience.snapshot(Date.now());
```

`ewmaSeries` replays a snapshot's `timeline` to reconstruct `perSecond` over time, so a chart and
the single number beside it stay in step:

```ts
import { ewmaSeries } from "@kar-mi/spirit-vale-tools-metrics";

const points = ewmaSeries(timeline, { start: Date.now() - 600_000, end: Date.now() });
```

`EwmaRate` is the underlying O(1) estimator, used directly where the caller keeps its own timeline
(the combat meter's `currentDps`). Recording a value of `v` adds `v / tau` to the rate, which then
fades as `e^{-elapsed / tau}` — no window edge, and no discontinuity when an old event ages out.

### Choosing a time constant

A flat rolling window of width `W` and an EWMA of time constant `tau` have equal estimator variance
when `W = 2 * tau`, and equal mean lag. A 5-second window is therefore reproduced by
`tauSeconds: 2.5`. Sparse metrics want a much longer constant — `RateTracker` defaults to 20
seconds, which keeps a single kill visible for about a minute.

`rateAt(nowMs, rampFromMs)` corrects the cold start: an estimator rising from zero under-reads a
steady stream by `1 - e^{-elapsed / tau}` (63% low at one tau). Pass the moment observation began
for dense streams read from the first instant; omit it for sparse gains, where the ramp is
indistinguishable from genuinely having earned nothing yet.

## License

See [LICENSE.txt](../../LICENSE.txt).
