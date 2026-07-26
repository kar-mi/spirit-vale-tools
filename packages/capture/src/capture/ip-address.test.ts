import { describe, expect, test } from "bun:test";

import { formatIpv6 } from "./ip-address.ts";

describe("formatIpv6", () => {
  test("formats an address without a compressible zero run", () => {
    expect(formatIpv6(ipv6Words(0x2001, 0x0db8, 1, 2, 3, 4, 5, 6))).toBe("2001:db8:1:2:3:4:5:6");
  });

  test("compresses leading, trailing, and all-zero runs", () => {
    expect(formatIpv6(ipv6Words(0, 0, 1, 2, 3, 4, 5, 6))).toBe("::1:2:3:4:5:6");
    expect(formatIpv6(ipv6Words(1, 2, 3, 4, 5, 0, 0, 0))).toBe("1:2:3:4:5::");
    expect(formatIpv6(ipv6Words(0, 0, 0, 0, 0, 0, 0, 0))).toBe("::");
  });

  test("compresses the first longest run and leaves a single zero uncompressed", () => {
    expect(formatIpv6(ipv6Words(1, 0, 0, 2, 0, 0, 3, 0))).toBe("1::2:0:0:3:0");
    expect(formatIpv6(ipv6Words(1, 0, 2, 3, 4, 5, 6, 7))).toBe("1:0:2:3:4:5:6:7");
  });
});

function ipv6Words(...words: number[]): Buffer {
  const data = Buffer.alloc(16);
  words.forEach((word, index) => data.writeUInt16BE(word, index * 2));
  return data;
}
