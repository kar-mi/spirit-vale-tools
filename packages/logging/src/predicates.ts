export type LiveLogStatus = "waiting" | "watching" | "ready" | "stopped" | "error";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isMissing(error: unknown): boolean {
  return isRecord(error) && error["code"] === "ENOENT";
}

export function decimal(value: unknown): value is string {
  return typeof value === "string" && /^-?\d+$/.test(value);
}

export function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}
