export function formatIpv6(data: Buffer): string {
  const words = Array.from({ length: 8 }, (_, index) => data.readUInt16BE(index * 2));
  let bestStart = -1;
  let bestLength = 0;
  for (let start = 0; start < words.length;) {
    if (words[start] !== 0) {
      start += 1;
      continue;
    }
    let end = start;
    while (end < words.length && words[end] === 0) end += 1;
    if (end - start > bestLength && end - start > 1) {
      bestStart = start;
      bestLength = end - start;
    }
    start = end;
  }
  if (bestStart < 0) return words.map((word) => word.toString(16)).join(":");
  const before = words.slice(0, bestStart).map((word) => word.toString(16)).join(":");
  const after = words.slice(bestStart + bestLength).map((word) => word.toString(16)).join(":");
  return `${before}::${after}`;
}
