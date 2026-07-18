export type TrendMetric = "experience" | "jobExperience" | "coins";
export type TrendMode = "rate" | "cumulative";

export interface TrendSample {
  recordedAt: string;
  experience: number;
  jobExperience: number;
  coins: string;
}

export interface TrendRange {
  start: number;
  end: number;
}

export interface CumulativeTrendPoint {
  time: number;
  value: bigint;
}

export interface RateTrendPoint {
  time: number;
  value: number;
  gain: bigint;
  seconds: number;
}

interface MetricSample {
  time: number;
  value: bigint;
}

export function trendExtent(samples: readonly TrendSample[]): TrendRange | undefined {
  const times = samples.map(({ recordedAt }) => Date.parse(recordedAt)).filter(Number.isFinite).sort((left, right) => left - right);
  const first = times[0];
  const last = times.at(-1);
  if (first === undefined || last === undefined) return undefined;
  return first === last ? { start: first - 500, end: last + 500 } : { start: first, end: last };
}

export function buildCumulativeTrend(
  samples: readonly TrendSample[],
  metric: TrendMetric,
  range: TrendRange,
): CumulativeTrendPoint[] {
  const values = metricSamples(samples, metric);
  let total = 0n;
  for (const sample of values) {
    if (sample.time > range.start) break;
    total += sample.value;
  }
  const points: CumulativeTrendPoint[] = [{ time: range.start, value: total }];
  for (const sample of values) {
    if (sample.time <= range.start) continue;
    if (sample.time > range.end) break;
    total += sample.value;
    points.push({ time: sample.time, value: total });
  }
  if (points.at(-1)?.time !== range.end) points.push({ time: range.end, value: total });
  return points;
}

export function buildRateTrend(
  samples: readonly TrendSample[],
  metric: TrendMetric,
  range: TrendRange,
  plotWidth: number,
): RateTrendPoint[] {
  const duration = Math.max(1, range.end - range.start);
  const pixelBuckets = Math.max(1, Math.floor(plotWidth / 72));
  const wholeSecondBuckets = Math.max(1, Math.ceil(duration / 1_000));
  const bucketCount = Math.min(120, pixelBuckets, wholeSecondBuckets);
  const bucketDuration = duration / bucketCount;
  const gains = Array<bigint>(bucketCount).fill(0n);
  for (const sample of metricSamples(samples, metric)) {
    if (sample.time < range.start || sample.time > range.end) continue;
    const index = Math.min(bucketCount - 1, Math.floor((sample.time - range.start) / bucketDuration));
    gains[index] = (gains[index] ?? 0n) + sample.value;
  }
  const seconds = bucketDuration / 1_000;
  return gains.map((gain, index) => ({
    time: range.start + bucketDuration * (index + 0.5),
    value: finiteNumber(gain) / seconds,
    gain,
    seconds,
  }));
}

export function bigintRatio(value: bigint, maximum: bigint): number {
  if (maximum <= 0n || value <= 0n) return 0;
  if (value >= maximum) return 1;
  return Number((value * 1_000_000n) / maximum) / 1_000_000;
}

function metricSamples(samples: readonly TrendSample[], metric: TrendMetric): MetricSample[] {
  const values: MetricSample[] = [];
  for (const sample of samples) {
    const time = Date.parse(sample.recordedAt);
    if (!Number.isFinite(time)) continue;
    try {
      const value = metric === "coins" ? BigInt(sample.coins) : BigInt(sample[metric]);
      if (value >= 0n) values.push({ time, value });
    } catch {
      // Invalid UI samples are ignored rather than breaking the chart.
    }
  }
  return values.sort((left, right) => left.time - right.time);
}

function finiteNumber(value: bigint): number {
  const converted = Number(value);
  return Number.isFinite(converted) ? converted : Number.MAX_VALUE;
}
