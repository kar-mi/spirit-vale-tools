/**
 * Continuous-time exponentially-weighted rate estimator (a "leaky bucket").
 *
 * A value of `v` recorded at time `t` contributes `v / tau` to the rate immediately, then fades as
 * `e^{-(now - t) / tau}`. `tauSeconds` is a decay constant, not a cutoff: contributions never fully
 * vanish, but after ~3x tau they are negligible (about 5% of their original weight).
 *
 * Chosen over a flat rolling window because a window has a hard edge: the rate drops
 * discontinuously the instant a value ages past it, and steps to exactly zero once the window is
 * empty. For sparse events (XP, coins) a short window reads 0 between gains and a long one barely
 * moves per gain. For dense events (damage) the two are statistically equivalent — a window of
 * width `W` and an EWMA of time constant `tau` have equal estimator variance when `W = 2 * tau`,
 * and equal mean lag — so the EWMA is a drop-in that only removes the discontinuity, at O(1) state
 * instead of a retained list of every recent event.
 */
export interface EwmaRateOptions {
  /** Decay time constant, in seconds. */
  tauSeconds: number;
}

/** Cold-start correction for a `rateAt` read. See {@link EwmaRate.rateAt}. */
export interface EwmaRamp {
  /** The moment observation of this stream began. */
  fromMs: number;
  /** Floor on the elapsed time, so the first moments do not divide by a near-zero factor. Defaults to 1000ms. */
  minimumMs?: number;
}

/**
 * Durable state of an estimator, safe to persist and later restore.
 *
 * `tauSeconds` travels with the rate because the two are only meaningful together: the same
 * accumulated rate decays differently under a different time constant, so a reader that persists
 * only the number cannot reconstruct the estimator that produced it.
 */
export interface EwmaRateState {
  rate: number;
  updatedAtMs: number;
  tauSeconds: number;
}

const DEFAULT_MINIMUM_RAMP_MS = 1_000;

export class EwmaRate {
  readonly tauSeconds: number;
  private rate = 0;
  private updatedAtMs = 0;

  constructor(options: EwmaRateOptions) {
    if (!Number.isFinite(options.tauSeconds) || options.tauSeconds <= 0) {
      throw new Error("tauSeconds must be a positive finite number");
    }
    this.tauSeconds = options.tauSeconds;
  }

  /** A fresh estimator with the same time constant — for building a merge target from its sources. */
  emptyLike(): EwmaRate {
    return new EwmaRate({ tauSeconds: this.tauSeconds });
  }

  record(value: number, atMs: number): void {
    if (!(value > 0)) return;
    this.decayTo(atMs);
    this.rate += value / this.tauSeconds;
  }

  /**
   * The estimated rate per second as of `nowMs`, decayed lazily without mutating state.
   *
   * Pass `ramp` to correct the cold start: an estimator rising from zero under-reads a steady
   * stream by `1 - e^{-elapsed / tau}` (63% low at one tau). This is the continuous analogue of
   * dividing a rolling window's sum by `min(windowMs, now - start)` rather than by the full window.
   * Omit it for sparse gains, where the ramp is indistinguishable from genuinely having earned
   * nothing yet.
   */
  rateAt(nowMs: number, ramp?: EwmaRamp): number {
    const decaySeconds = Math.max(0, nowMs - this.updatedAtMs) / 1_000;
    const decayed = this.rate * Math.exp(-decaySeconds / this.tauSeconds);
    if (ramp === undefined) return decayed;
    const elapsedMs = Math.max(ramp.minimumMs ?? DEFAULT_MINIMUM_RAMP_MS, nowMs - ramp.fromMs);
    return decayed / (1 - Math.exp(-elapsedMs / 1_000 / this.tauSeconds));
  }

  reset(atMs: number): void {
    this.rate = 0;
    this.updatedAtMs = atMs;
  }

  state(): EwmaRateState {
    return { rate: this.rate, updatedAtMs: this.updatedAtMs, tauSeconds: this.tauSeconds };
  }

  /** Restores a persisted rate. The state's own `tauSeconds` must match, since the two only mean anything together. */
  restore(state: EwmaRateState): void {
    if (state.tauSeconds !== this.tauSeconds) throw new Error("cannot restore state accumulated with a different tauSeconds");
    this.rate = state.rate;
    this.updatedAtMs = state.updatedAtMs;
  }

  /**
   * Folds `other` into this estimator. The rate is linear in its inputs, so two estimators over
   * disjoint event streams combine exactly by decaying both to a common time and adding — which is
   * what lets separately-aggregated actors be merged into one row without replaying their events.
   * Both must share a time constant.
   */
  add(other: EwmaRate): void {
    if (other.tauSeconds !== this.tauSeconds) throw new Error("cannot merge estimators with different tauSeconds");
    const atMs = Math.max(this.updatedAtMs, other.updatedAtMs);
    this.decayTo(atMs);
    this.rate += other.rate * Math.exp(-Math.max(0, atMs - other.updatedAtMs) / 1_000 / this.tauSeconds);
  }

  private decayTo(atMs: number): void {
    const dtSeconds = Math.max(0, atMs - this.updatedAtMs) / 1_000;
    this.rate *= Math.exp(-dtSeconds / this.tauSeconds);
    this.updatedAtMs = Math.max(this.updatedAtMs, atMs);
  }
}
