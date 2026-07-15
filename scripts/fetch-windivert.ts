import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const VERSION = "2.2.2";
const ARCHIVE_NAME = `WinDivert-${VERSION}-A.zip`;
const SOURCE_URL = `https://reqrypt.org/download/${ARCHIVE_NAME}`;
const EXPECTED_SHA256 = "63cb41763bb4b20f600b6de04e991a9c2be73279e317d4d82f237b150c5f3f15";
const projectRoot = path.resolve(import.meta.dir, "..");
const vendorBase = path.join(projectRoot, "native", "vendor");
const vendorRoot = path.join(vendorBase, `windivert-${VERSION}`);
const markerPath = path.join(vendorRoot, ".source-sha256");
const requiredFiles = [
  path.join(vendorRoot, "x64", "WinDivert.dll"),
  path.join(vendorRoot, "x64", "WinDivert64.sys"),
  path.join(vendorRoot, "LICENSE"),
];

if (
  requiredFiles.every((file) => existsSync(file)) &&
  existsSync(markerPath) &&
  (await readFile(markerPath, "utf8")).trim() === EXPECTED_SHA256
) {
  console.log(`WinDivert ${VERSION} is already verified.`);
  process.exit(0);
}

await mkdir(vendorBase, { recursive: true });
const archivePath = path.join(vendorBase, ARCHIVE_NAME);
let archive: Uint8Array;
if (existsSync(archivePath)) {
  archive = new Uint8Array(await readFile(archivePath));
} else {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) throw new Error(`Could not download ${SOURCE_URL}: HTTP ${response.status}`);
  archive = new Uint8Array(await response.arrayBuffer());
  await writeFile(archivePath, archive);
}
const hasher = new Bun.CryptoHasher("sha256");
hasher.update(archive);
const actualHash = hasher.digest("hex");
if (actualHash !== EXPECTED_SHA256) {
  throw new Error(`WinDivert checksum mismatch: expected ${EXPECTED_SHA256}, received ${actualHash}`);
}

const extractRoot = path.join(vendorBase, ".windivert-extract");
await rm(extractRoot, { recursive: true, force: true });
await rm(vendorRoot, { recursive: true, force: true });
await mkdir(extractRoot, { recursive: true });

const expansion = Bun.spawnSync(["tar", "-xf", archivePath, "-C", extractRoot], {
  stdout: "inherit",
  stderr: "inherit",
});
if (expansion.exitCode !== 0) throw new Error(`Archive extraction failed with exit code ${expansion.exitCode}`);

await rename(path.join(extractRoot, `WinDivert-${VERSION}-A`), vendorRoot);
await writeFile(markerPath, `${EXPECTED_SHA256}\n`, "utf8");
await rm(extractRoot, { recursive: true, force: true });
await rm(archivePath, { force: true });

for (const file of requiredFiles) {
  if (!existsSync(file)) throw new Error(`Verified archive is missing ${file}`);
}
console.log(`Downloaded and verified WinDivert ${VERSION}.`);
