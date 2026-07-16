import { describe, expect, test } from "bun:test";

import { decodeLiteNetLibDatagram, LiteNetLibProtocolError } from "./decoder.ts";

function hex(value: string): Buffer {
  return Buffer.from(value.replaceAll(" ", ""), "hex");
}

describe("decodeLiteNetLibDatagram", () => {
  test("decodes observed ping and pong packets", () => {
    const ping = decodeLiteNetLibDatagram(hex("03 2000"))[0];
    expect(ping?.mergePath).toEqual([]);
    expect(ping?.packet).toMatchObject({ property: "ping", sequence: 0x20, connectionNumber: 0 });

    const pong = decodeLiteNetLibDatagram(hex("04 2000 e68b47f982e2de08"))[0]?.packet;
    expect(pong).toMatchObject({ property: "pong", sequence: 0x20 });
    if (pong?.property !== "pong") throw new Error("expected pong");
    expect(pong.timestamp).toBe(639197249289030630n);
  });

  test("decodes unreliable, channeled, and ack payloads", () => {
    expect(decodeLiteNetLibDatagram(hex("00 aabb"))[0]?.packet).toMatchObject({
      property: "unreliable",
      payload: hex("aabb"),
    });
    expect(decodeLiteNetLibDatagram(hex("01 5001 02 aabb"))[0]?.packet).toMatchObject({
      property: "channeled",
      sequence: 0x150,
      channel: 2,
      payload: hex("aabb"),
    });
    expect(decodeLiteNetLibDatagram(hex("02 1201 02 ffffffffffffffff00"))[0]?.packet).toMatchObject({
      property: "ack",
      sequence: 0x112,
      channel: 2,
      payload: hex("ffffffffffffffff00"),
    });
  });

  test("preserves unobserved LiteNetLib 1.x control packets as opaque payloads", () => {
    expect(decodeLiteNetLibDatagram(hex("05 aabb"))[0]?.packet).toMatchObject({
      propertyId: 5,
      property: "connectRequest",
      payload: hex("aabb"),
    });
  });

  test("recursively flattens merged packets and records child paths", () => {
    const datagram = hex("0c 0300 032000 1300 0c 0300 033100 0b00 0431000100000000000000");
    const decoded = decodeLiteNetLibDatagram(datagram);
    expect(decoded.map((entry) => [entry.packet.property, entry.mergePath])).toEqual([
      ["ping", [0]],
      ["ping", [1, 0]],
      ["pong", [1, 1]],
    ]);
  });

  test("decodes connection and fragmented channeled fields", () => {
    const packet = decodeLiteNetLibDatagram(hex("a1 3412 07 0201 0403 0605 aabb"))[0]?.packet;
    expect(packet).toMatchObject({
      property: "channeled",
      connectionNumber: 1,
      fragmented: true,
      sequence: 0x1234,
      channel: 7,
      fragment: { id: 0x0102, part: 0x0304, total: 0x0506 },
      payload: hex("aabb"),
    });
  });

  test("rejects invalid properties and malformed headers", () => {
    expect(() => decodeLiteNetLibDatagram(Buffer.alloc(0))).toThrow(LiteNetLibProtocolError);
    expect(() => decodeLiteNetLibDatagram(hex("12"))).toThrow("unknown LiteNetLib 1.x property 18 at byte 0");
    expect(() => decodeLiteNetLibDatagram(hex("8c"))).toThrow(
      "fragmentation flag is valid only on channeled packets at byte 0",
    );
    expect(() => decodeLiteNetLibDatagram(hex("04 0100"))).toThrow("pong header is truncated at byte 3");
    expect(() => decodeLiteNetLibDatagram(hex("0c"))).toThrow("merged packet has no children at byte 0");
    expect(() => decodeLiteNetLibDatagram(hex("0c 0000"))).toThrow("merged child length is zero at byte 1");
    expect(() => decodeLiteNetLibDatagram(hex("0c 0500 032000"))).toThrow("merged child is truncated at byte 6");
  });

  test("limits malicious merged nesting", () => {
    let packet = hex("032000");
    for (let index = 0; index < 33; index += 1) {
      const length = Buffer.alloc(2);
      length.writeUInt16LE(packet.length);
      packet = Buffer.concat([Buffer.from([0x0c]), length, packet]);
    }
    expect(() => decodeLiteNetLibDatagram(packet)).toThrow("LiteNetLib merged nesting exceeds 32");
  });
});
