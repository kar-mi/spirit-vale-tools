import { expect, test } from "bun:test";
import { bigintOption, jsonObject, nonNegativeIntegerOption, option, options } from "./args.ts";

test("CLI argument helpers share option parsing and validation", () => {
  const argv = ["bun", "tool", "--tag", "first", "--count", "2", "--tag", "second", "--big", "9007199254740993"];
  expect(option("--count", argv)).toBe("2");
  expect(options("--tag", argv)).toEqual(["first", "second"]);
  expect(nonNegativeIntegerOption("--count", argv)).toBe(2);
  expect(bigintOption("--big", argv)).toBe(9007199254740993n);
  expect(jsonObject({ amount: 3n })).toEqual({ amount: "3" });
});
