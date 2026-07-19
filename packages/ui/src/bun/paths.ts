import { existsSync } from "node:fs";
import path from "node:path";

export function resolveLogDirectory(): string {
  const override = process.env.SPIRIT_VALE_LOG_DIRECTORY?.trim();
  if (override) return path.resolve(override);
  return path.join(resolveWorkspaceRoot(), "logs");
}

function resolveWorkspaceRoot(): string {
  let current = process.cwd();
  while (true) {
    if (existsSync(path.join(current, "bun.lock")) && existsSync(path.join(current, "packages"))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return process.cwd();
    current = parent;
  }
}
