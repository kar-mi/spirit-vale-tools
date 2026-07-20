import { open, stat } from "node:fs/promises";

import { isMissing } from "./predicates.ts";

export interface JsonlTailReadResult {
  missing: boolean;
  reset: boolean;
  lines: string[];
  size: number;
}

export interface JsonlTailReaderOptions {
  /** Chooses the decoder from the first available chunk (e.g. for BOM sniffing). Defaults to plain UTF-8. */
  createDecoder?: (firstChunk: Uint8Array) => TextDecoder;
}

/** Incrementally tails a growing JSON Lines file: stat, detect truncation, read the new bytes, and split them into complete lines. */
export class JsonlTailReader {
  private offset = 0;
  private pending = "";
  private decoder?: TextDecoder;
  private readonly createDecoder: (firstChunk: Uint8Array) => TextDecoder;

  constructor(private readonly path: string, options: JsonlTailReaderOptions = {}) {
    this.createDecoder = options.createDecoder ?? (() => new TextDecoder());
  }

  async read(): Promise<JsonlTailReadResult> {
    let size: number;
    try {
      size = (await stat(this.path)).size;
    } catch (error) {
      if (isMissing(error)) return { missing: true, reset: false, lines: [], size: this.offset };
      throw error;
    }

    const reset = size < this.offset;
    if (reset) this.reset();
    if (size === this.offset) return { missing: false, reset, lines: [], size };

    const length = size - this.offset;
    const bytes = Buffer.allocUnsafe(length);
    const file = await open(this.path, "r");
    try {
      const { bytesRead } = await file.read(bytes, 0, length, this.offset);
      this.offset += bytesRead;
      const lines = this.consume(bytes.subarray(0, bytesRead));
      return { missing: false, reset, lines, size };
    } finally {
      await file.close();
    }
  }

  reset(): void {
    this.offset = 0;
    this.pending = "";
    this.decoder = undefined;
  }

  private consume(bytes: Uint8Array): string[] {
    this.decoder ??= this.createDecoder(bytes);
    this.pending += this.decoder.decode(bytes, { stream: true });
    const lines = this.pending.split(/\r?\n/);
    this.pending = lines.pop() ?? "";
    return lines;
  }
}
