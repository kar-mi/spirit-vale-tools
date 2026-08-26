import { open } from "node:fs/promises";

import { isMissing } from "@kar-mi/spirit-vale-tools-logging";

/** Enough to cover a first log record comfortably; longer first lines simply hash their prefix. */
const FINGERPRINT_BYTES = 8192;

/** Identifies a log file by its first line, which is immutable for an append-only log and carries the session id, sequence 1, and a timestamp. */
export async function fingerprintSource(sourcePath: string): Promise<string | undefined> {
  let handle;
  try {
    handle = await open(sourcePath, "r");
  } catch (error) {
    if (isMissing(error)) return undefined;
    throw error;
  }
  try {
    const bytes = Buffer.allocUnsafe(FINGERPRINT_BYTES);
    const { bytesRead } = await handle.read(bytes, 0, FINGERPRINT_BYTES, 0);
    if (bytesRead === 0) return undefined;
    const read = bytes.subarray(0, bytesRead);
    const newline = read.indexOf(0x0a);
    const line = newline === -1 ? read : read.subarray(0, newline + 1);
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(line);
    return hasher.digest("hex");
  } finally {
    await handle.close();
  }
}
