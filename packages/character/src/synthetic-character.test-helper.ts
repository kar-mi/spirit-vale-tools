export function syntheticCharacter(update: boolean): Buffer {
  const out: number[] = [];
  if (update) packed(out, 4);
  bool(out, false);
  string(out, "example-character-id");
  string(out, "example-account");
  packed(out, 7);
  string(out, ""); string(out, ""); string(out, "Example Hero");
  bool(out, false);
  for (let index = 0; index < 10; index += 1) packed(out, index);
  bool(out, false); list(out, [], () => undefined);
  list(out, [], () => undefined);
  string(out, "Trailblazer"); string(out, ""); string(out, "");
  list(out, [0, 12], (value) => packed(out, value));
  packed(out, 42); packed(out, 12345); packed(out, 18); packed(out, 678);
  bool(out, false);
  float(out, 1); float(out, 1); string(out, "Example Town");
  bool(out, false); float(out, 0); float(out, 0); float(out, 0);
  list(out, [], () => undefined); packed(out, 0); list(out, [], () => undefined); list(out, [], () => undefined);
  list(out, [60, 30, 10, 20, 5, 15], (value) => packed(out, value));
  list(out, [0], () => {
    bool(out, false); packed(out, 0); bool(out, false);
    list(out, [0], () => { bool(out, false); packed(out, 0); packed(out, 100); string(out, ""); });
    list(out, ["Example Card"], (value) => string(out, value));
    packed(out, 0); packed(out, 0); packed(out, -1); string(out, "example-equip-instance"); packed(out, 5); string(out, "Example Sword"); bool(out, false);
  });
  packed(out, 0);
  list(out, [], () => undefined); list(out, [], () => undefined); list(out, [], () => undefined);
  list(out, [0], () => {
    bool(out, false);
    list(out, [0], () => { bool(out, false); packed(out, 71); packed(out, 100); string(out, ""); });
    packed(out, 0);
    list(out, [0], () => { bool(out, false); string(out, "example-gem-instance"); packed(out, 1); string(out, "Example Gem"); bool(out, false); });
    string(out, "example-artifact-instance"); packed(out, 3); string(out, "Example Rune"); bool(out, false);
  });
  bool(out, false);
  list(out, [undefined], () => { bool(out, false); string(out, "Example Skill"); packed(out, 3); });
  list(out, [], () => undefined);
  bool(out, true);
  list(out, [], () => undefined);
  list(out, [], () => undefined);
  bool(out, false);
  for (let index = 0; index < 7; index += 1) list(out, [], () => undefined);
  packed(out, 0); packed(out, 3600); packed(out, 25); packed(out, 3); packed(out, 2);
  return Buffer.from(out);
}

function bool(out: number[], value: boolean): void { out.push(value ? 1 : 0); }
function string(out: number[], value: string): void { const bytes = Buffer.from(value); packed(out, bytes.length); out.push(...bytes); }
function float(out: number[], value: number): void { const bytes = Buffer.alloc(4); bytes.writeFloatLE(value); out.push(...bytes); }
function list<T>(out: number[], values: T[], write: (value: T) => void): void { packed(out, values.length); for (const value of values) write(value); }
function packed(out: number[], value: number): void {
  let remaining = (BigInt(value) << 1n) ^ (BigInt(value) >> 63n);
  while (remaining >= 0x80n) { out.push(Number((remaining & 0x7fn) | 0x80n)); remaining >>= 7n; }
  out.push(Number(remaining));
}
