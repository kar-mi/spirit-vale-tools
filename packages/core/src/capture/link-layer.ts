export const DATA_LINK = {
  NULL: 0,
  ETHERNET: 1,
  RAW: 12,
  LOOP: 108,
  LINUX_SLL: 113,
} as const;

export function extractIpPacket(frame: Buffer, dataLink: number): Buffer | undefined {
  if (dataLink === DATA_LINK.RAW) return ipVersion(frame) ? frame : undefined;
  if (dataLink === DATA_LINK.NULL || dataLink === DATA_LINK.LOOP) {
    return frame.length >= 4 && ipVersion(frame.subarray(4)) ? frame.subarray(4) : undefined;
  }
  if (dataLink === DATA_LINK.LINUX_SLL) {
    if (frame.length < 16) return undefined;
    const etherType = frame.readUInt16BE(14);
    return (etherType === 0x0800 || etherType === 0x86dd) ? frame.subarray(16) : undefined;
  }
  if (dataLink !== DATA_LINK.ETHERNET || frame.length < 14) return undefined;
  let offset = 14;
  let etherType = frame.readUInt16BE(12);
  while (etherType === 0x8100 || etherType === 0x88a8 || etherType === 0x9100) {
    if (frame.length < offset + 4) return undefined;
    etherType = frame.readUInt16BE(offset + 2);
    offset += 4;
  }
  return (etherType === 0x0800 || etherType === 0x86dd) && frame.length > offset
    ? frame.subarray(offset)
    : undefined;
}

export function supportsDataLink(dataLink: number): boolean {
  return Object.values(DATA_LINK).includes(dataLink as never);
}

function ipVersion(data: Buffer): 4 | 6 | undefined {
  const value = data[0]! >> 4;
  return value === 4 || value === 6 ? value : undefined;
}
