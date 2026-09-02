import type { JsonObject } from "@kar-mi/spirit-vale-tools-logging";

export function option(name: string, argv: readonly string[] = Bun.argv): string | undefined {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

export function options(name: string, argv: readonly string[] = Bun.argv): string[] {
  const values: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== name) continue;
    const value = argv[index + 1];
    if (value === undefined) throw new Error(`${name} requires a value`);
    values.push(value);
  }
  return values;
}

export function nonNegativeIntegerOption(name: string, argv: readonly string[] = Bun.argv): number | undefined {
  const text = option(name, argv);
  if (text === undefined) return undefined;
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
}

export function bigintOption(name: string, argv: readonly string[] = Bun.argv): bigint | undefined {
  const text = option(name, argv);
  if (text === undefined) return undefined;
  try { return BigInt(text); } catch { throw new Error(`${name} must be an integer`); }
}

export function jsonObject(value: unknown, omittedKeys: ReadonlySet<string> = new Set()): JsonObject {
  return JSON.parse(JSON.stringify(value, (key, entry) => {
    if (omittedKeys.has(key)) return undefined;
    return typeof entry === "bigint" ? entry.toString() : entry;
  })) as JsonObject;
}
