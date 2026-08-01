import { open, stat } from "node:fs/promises";

import { isMissing } from "./predicates.ts";

const NEWLINE = 0x0a;

export interface JsonlTailReadResult {
  missing: boolean;
  reset: boolean;
  lines: string[];
  size: number;
  /** Bytes taken from the file by this read, including any that only formed a partial line. */
  bytesRead: number;
}

export interface JsonlTailReaderOptions {
  /** Chooses the decoder from the first available chunk (e.g. for BOM sniffing). Defaults to plain UTF-8. */
  createDecoder?: (firstChunk: Uint8Array) => TextDecoder;
  /**
   * Byte offset to resume from, e.g. one persisted by an earlier process. Defaults to 0.
   *
   * A non-zero offset means the first chunk handed to {@link JsonlTailReaderOptions.createDecoder}
   * is from the middle of the file, so byte-order marks are no longer visible. Resume only on files
   * known to be UTF-8; a truncation still resets the reader to 0, where sniffing works again.
   */
  startOffset?: number;
  /**
   * Most bytes to take in one {@link JsonlTailReader.read}. Defaults to unlimited. A line longer
   * than this is still delivered — it simply spans several reads.
   */
  maxReadBytes?: number;
}

/** Incrementally tails a growing JSON Lines file: stat, detect truncation, read the new bytes, and split them into complete lines. */
export class JsonlTailReader {
  private readOffset: number;
  private partialBytes = 0;
  private pending = "";
  private decoder?: TextDecoder;
  private readonly createDecoder: (firstChunk: Uint8Array) => TextDecoder;
  private readonly maxReadBytes: number;

  constructor(private readonly path: string, options: JsonlTailReaderOptions = {}) {
    this.createDecoder = options.createDecoder ?? (() => new TextDecoder());
    const startOffset = options.startOffset ?? 0;
    if (!Number.isSafeInteger(startOffset) || startOffset < 0) {
      throw new RangeError("startOffset must be a non-negative integer");
    }
    const maxReadBytes = options.maxReadBytes ?? Number.POSITIVE_INFINITY;
    if (maxReadBytes < 1) throw new RangeError("maxReadBytes must be at least 1");
    this.maxReadBytes = maxReadBytes;
    this.readOffset = startOffset;
  }

  /**
   * Byte position just past the last complete line, excluding any buffered partial line. This is the
   * safe point to persist and hand back as `startOffset`; resuming there re-reads the partial line.
   *
   * Assumes newline-delimited UTF-8, as written by this package's logger.
   */
  get offset(): number {
    return this.readOffset - this.partialBytes;
  }

  async read(): Promise<JsonlTailReadResult> {
    let size: number;
    try {
      size = (await stat(this.path)).size;
    } catch (error) {
      if (isMissing(error)) return { missing: true, reset: false, lines: [], size: this.offset, bytesRead: 0 };
      throw error;
    }

    const reset = size < this.readOffset;
    if (reset) this.reset();
    if (size === this.readOffset) return { missing: false, reset, lines: [], size, bytesRead: 0 };

    const length = Math.min(size - this.readOffset, this.maxReadBytes);
    const bytes = Buffer.allocUnsafe(length);
    const file = await open(this.path, "r");
    try {
      const { bytesRead } = await file.read(bytes, 0, length, this.readOffset);
      this.readOffset += bytesRead;
      const chunk = bytes.subarray(0, bytesRead);
      this.trackPartial(chunk);
      return { missing: false, reset, lines: this.consume(chunk), size, bytesRead };
    } finally {
      await file.close();
    }
  }

  reset(): void {
    this.readOffset = 0;
    this.partialBytes = 0;
    this.pending = "";
    this.decoder = undefined;
  }

  /** Measures the trailing partial line in raw bytes, so {@link offset} never lands mid-record. */
  private trackPartial(chunk: Uint8Array): void {
    const lastNewline = chunk.lastIndexOf(NEWLINE);
    this.partialBytes = lastNewline === -1
      ? this.partialBytes + chunk.length
      : chunk.length - lastNewline - 1;
  }

  private consume(bytes: Uint8Array): string[] {
    this.decoder ??= this.createDecoder(bytes);
    this.pending += this.decoder.decode(bytes, { stream: true });
    const lines = this.pending.split(/\r?\n/);
    this.pending = lines.pop() ?? "";
    return lines;
  }
}
