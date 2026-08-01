import path from "node:path";

import { defaultLogDirectory } from "@kar-mi/spirit-vale-tools-logging";

/** Cache directory beside the canonical logs. Everything here is disposable and rebuildable. */
export function readModelDirectory(logDirectory = defaultLogDirectory()): string {
  return path.join(logDirectory, "cache");
}

export function readModelPath(logDirectory = defaultLogDirectory()): string {
  return path.join(readModelDirectory(logDirectory), "read-model.sqlite");
}

/** The database file plus the write-ahead-log sidecars SQLite keeps next to it. */
export function readModelFiles(databasePath: string): string[] {
  return [databasePath, `${databasePath}-wal`, `${databasePath}-shm`];
}
