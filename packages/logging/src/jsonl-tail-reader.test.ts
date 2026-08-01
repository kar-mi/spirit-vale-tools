import { appendFile, mkdtemp, rm, truncate, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, test } from "bun:test";

import { JsonlTailReader } from "./jsonl-tail-reader.ts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function tempFile(name: string): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "spiritvale-tail-reader-"));
  temporaryDirectories.push(directory);
  return path.join(directory, name);
}

describe("JsonlTailReader", () => {
  test("reports missing for a file that doesn't exist yet", async () => {
    const file = await tempFile("missing.jsonl");
    const reader = new JsonlTailReader(file);
    expect(await reader.read()).toMatchObject({ missing: true, reset: false, lines: [] });
  });

  test("reads new complete lines incrementally and buffers a trailing partial line", async () => {
    const file = await tempFile("incremental.jsonl");
    await writeFile(file, "one\ntwo\n");
    const reader = new JsonlTailReader(file);
    expect((await reader.read()).lines).toEqual(["one", "two"]);

    await appendFile(file, "thre");
    expect((await reader.read()).lines).toEqual([]);

    await appendFile(file, "e\nfour\n");
    expect((await reader.read()).lines).toEqual(["three", "four"]);
  });

  test("detects truncation as a reset and resumes from the start", async () => {
    const file = await tempFile("reset.jsonl");
    await writeFile(file, "one\ntwo\n");
    const reader = new JsonlTailReader(file);
    expect((await reader.read()).lines).toEqual(["one", "two"]);

    await truncate(file, 0);
    await writeFile(file, "hi\n");
    const result = await reader.read();
    expect(result.reset).toBe(true);
    expect(result.lines).toEqual(["hi"]);
  });

  test("tracks the byte offset it has consumed", async () => {
    const file = await tempFile("offset.jsonl");
    await writeFile(file, "one\ntwo\n");
    const reader = new JsonlTailReader(file);
    expect(reader.offset).toBe(0);
    await reader.read();
    expect(reader.offset).toBe(8);
  });

  test("resumes from a start offset and returns only the newer lines", async () => {
    const file = await tempFile("resume.jsonl");
    await writeFile(file, "one\ntwo\n");
    const first = new JsonlTailReader(file);
    expect((await first.read()).lines).toEqual(["one", "two"]);

    await appendFile(file, "three\n");
    const resumed = new JsonlTailReader(file, { startOffset: first.offset });
    expect((await resumed.read()).lines).toEqual(["three"]);
    expect(resumed.offset).toBe(14);
  });

  test("a resumed reader reports nothing new until the file grows", async () => {
    const file = await tempFile("resume-idle.jsonl");
    await writeFile(file, "one\n");
    const resumed = new JsonlTailReader(file, { startOffset: 4 });
    expect(await resumed.read()).toMatchObject({ missing: false, reset: false, lines: [] });
  });

  test("a resumed reader still detects truncation and re-reads from the start", async () => {
    const file = await tempFile("resume-reset.jsonl");
    await writeFile(file, "one\ntwo\n");
    const resumed = new JsonlTailReader(file, { startOffset: 8 });
    await writeFile(file, "hi\n");
    const result = await resumed.read();
    expect(result.reset).toBe(true);
    expect(result.lines).toEqual(["hi"]);
    expect(resumed.offset).toBe(3);
  });

  test("excludes a buffered partial line from the offset so a resume never lands mid-record", async () => {
    const file = await tempFile("partial-offset.jsonl");
    await writeFile(file, "one\ntwo\nthre");
    const reader = new JsonlTailReader(file);
    const result = await reader.read();
    expect(result).toMatchObject({ lines: ["one", "two"], bytesRead: 12 });
    // 12 bytes were taken from the file, but only 8 of them formed complete lines.
    expect(reader.offset).toBe(8);

    await appendFile(file, "e\n");
    const resumed = new JsonlTailReader(file, { startOffset: reader.offset });
    expect((await resumed.read()).lines).toEqual(["three"]);
  });

  test("limits how much one read consumes without losing lines", async () => {
    const file = await tempFile("bounded.jsonl");
    await writeFile(file, "one\ntwo\nthree\n");
    const reader = new JsonlTailReader(file, { maxReadBytes: 5 });
    expect(await reader.read()).toMatchObject({ lines: ["one"], bytesRead: 5 });
    expect(reader.offset).toBe(4);
    expect((await reader.read()).lines).toEqual(["two"]);
    expect((await reader.read()).lines).toEqual(["three"]);
    expect(await reader.read()).toMatchObject({ lines: [], bytesRead: 0 });
    expect(reader.offset).toBe(14);
  });

  test("delivers a line longer than the read limit across several reads", async () => {
    const file = await tempFile("long-line.jsonl");
    const long = "x".repeat(50);
    await writeFile(file, `${long}\n`);
    const reader = new JsonlTailReader(file, { maxReadBytes: 8 });
    const lines: string[] = [];
    for (;;) {
      const result = await reader.read();
      if (result.bytesRead === 0) break;
      lines.push(...result.lines);
      // Nothing is committable until the line completes.
      if (lines.length === 0) expect(reader.offset).toBe(0);
    }
    expect(lines).toEqual([long]);
    expect(reader.offset).toBe(51);
  });

  test("rejects a negative or fractional start offset", () => {
    expect(() => new JsonlTailReader("synthetic.jsonl", { startOffset: -1 })).toThrow(RangeError);
    expect(() => new JsonlTailReader("synthetic.jsonl", { startOffset: 1.5 })).toThrow(RangeError);
  });

  test("uses the createDecoder hook to sniff a BOM from the first chunk", async () => {
    const file = await tempFile("utf16.jsonl");
    const bom = Buffer.from([0xff, 0xfe]);
    const text = Buffer.from("hello\n", "utf16le");
    await writeFile(file, Buffer.concat([bom, text]));
    const reader = new JsonlTailReader(file, {
      createDecoder: (firstChunk) => (firstChunk[0] === 0xff && firstChunk[1] === 0xfe ? new TextDecoder("utf-16le") : new TextDecoder("utf-8")),
    });
    expect((await reader.read()).lines).toEqual(["hello"]);
  });
});
