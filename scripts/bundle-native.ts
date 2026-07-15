import { existsSync } from "node:fs";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const source = path.join(root, "native", "capture-helper", "target", "release", "spiritvale-capture.exe");
const vendor = path.join(root, "native", "vendor", "windivert-2.2.2");
const destination = path.join(root, "dist", "native", "win-x64");

const files: Array<[string, string]> = [
  [source, "spiritvale-capture.exe"],
  [path.join(vendor, "x64", "WinDivert.dll"), "WinDivert.dll"],
  [path.join(vendor, "x64", "WinDivert64.sys"), "WinDivert64.sys"],
  [path.join(vendor, "LICENSE"), "WinDivert-LICENSE.txt"],
];
for (const [file] of files) {
  if (!existsSync(file)) throw new Error(`Missing native bundle input: ${file}`);
}

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const [from, name] of files) await copyFile(from, path.join(destination, name));
await writeFile(
  path.join(destination, "THIRD_PARTY_NOTICES.txt"),
  [
    "WinDivert 2.2.2",
    "Copyright (C) 2019 basil00",
    "Distributed under the GNU Lesser General Public License version 3 or later.",
    "Source: https://github.com/basil00/Divert/tree/v2.2.2",
    "The complete license is included as WinDivert-LICENSE.txt.",
    "",
  ].join("\r\n"),
  "utf8",
);
console.log(`Native bundle created at ${destination}`);
