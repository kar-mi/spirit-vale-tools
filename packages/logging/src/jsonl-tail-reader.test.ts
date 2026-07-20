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
