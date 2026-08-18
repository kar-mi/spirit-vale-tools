import { expect, test } from "bun:test";

import { normalizeName } from "./rows.ts";

test("folds the two Unicode spellings of one Hangul name onto one key", () => {
  const precomposed = "김철수";
  const decomposed = precomposed.normalize("NFD");

  expect(decomposed).not.toBe(precomposed);
  expect(normalizeName(decomposed)).toBe(normalizeName(precomposed));
  expect(normalizeName(precomposed)).toBe(precomposed);
});

test("folds combining marks on Latin and Japanese names", () => {
  for (const name of ["José", "バトル"]) {
    expect(name.normalize("NFD")).not.toBe(name);
    expect(normalizeName(name.normalize("NFD"))).toBe(normalizeName(name));
  }
});

test("trims and case folds independently of host locale", () => {
  expect(normalizeName("  Aster Vale  ")).toBe("aster vale");
  expect(normalizeName("ASTER VALE")).toBe("aster vale");
  // toLocaleLowerCase would map this to a dotless i under a Turkish host locale.
  expect(normalizeName("ASTERI")).toBe("asteri");
});

test("leaves caseless scripts untouched", () => {
  expect(normalizeName("中文玩家")).toBe("中文玩家");
});
