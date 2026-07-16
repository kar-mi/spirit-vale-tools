import { describe, expect, test } from "bun:test";

import { NativeProtocolDecoder, NativeProtocolError, NativeRecordType } from "./protocol.ts";

function frame(type: number, body: Uint8Array = new Uint8Array(), version = 2): Buffer {
  const header = Buffer.alloc(12);
  header.write("SVCP", 0, "ascii");
  header.writeUInt16LE(version, 4);
  header.writeUInt8(type, 6);
  header.writeUInt32LE(body.length, 8);
  return Buffer.concat([header, Buffer.from(body)]);
}

function packetBody(payload = Buffer.from([0xaa, 0xbb])): Buffer {
  const body = Buffer.alloc(68 + payload.length);
  body.writeBigInt64LE(42n, 0);
  body.writeUInt32LE(3, 8);
  body.writeUInt32LE(4, 12);
  body.writeUInt8(1, 16);
  body.writeUInt8(4, 17);
  body.writeUInt8(0x18, 18);
  body.writeUInt8(3, 19);
  body.set([192, 0, 2, 1], 32);
  body.set([198, 51, 100, 2], 48);
  body.writeUInt16LE(1234, 52);
  body.writeUInt16LE(443, 54);
  body.writeUInt32LE(5, 56);
  body.writeUInt32LE(6, 60);
  body.writeUInt32LE(payload.length, 64);
  body.set(payload, 68);
  return body;
}

function udpBody(payload = Buffer.from([0xcc])): Buffer {
  const body = packetBody(payload).subarray(0, 60 + payload.length);
  body.writeUInt32LE(payload.length, 56);
  body.set(payload, 60);
  return body;
}

function targetBody(name: string, pids: number[]): Buffer {
  const encodedName = Buffer.from(name);
  const body = Buffer.alloc(5 + encodedName.length + pids.length * 4);
  body.writeUInt8(pids.length === 0 ? 0 : 1, 0);
  body.writeUInt16LE(encodedName.length, 1);
  body.writeUInt16LE(pids.length, 3);
  body.set(encodedName, 5);
  pids.forEach((pid, index) => body.writeUInt32LE(pid, 5 + encodedName.length + index * 4));
  return body;
}

describe("NativeProtocolDecoder", () => {
  test("reassembles frames split across arbitrary chunks", () => {
    const bytes = Buffer.concat([frame(NativeRecordType.Ready), frame(NativeRecordType.TcpPacket, packetBody())]);
    const decoder = new NativeProtocolDecoder();
    const records = [
      ...decoder.push(bytes.subarray(0, 3)),
      ...decoder.push(bytes.subarray(3, 17)),
      ...decoder.push(bytes.subarray(17)),
    ];
    decoder.finish();
    expect(records).toHaveLength(2);
    expect(records[0]).toEqual({ type: NativeRecordType.Ready });
    const packetRecord = records[1];
    expect(packetRecord?.type).toBe(NativeRecordType.TcpPacket);
    if (packetRecord?.type !== NativeRecordType.TcpPacket) throw new Error("expected packet record");
    expect(packetRecord.packet.protocol).toBe("tcp");
    expect(packetRecord.packet.sourceIP).toBe("192.0.2.1");
    expect(packetRecord.packet.destinationIP).toBe("198.51.100.2");
    expect(packetRecord.packet.direction).toBe("outbound");
    expect(packetRecord.packet.loopback).toBe(true);
    expect(packetRecord.packet.truncated).toBe(true);
    expect(packetRecord.packet.payload).toEqual(Buffer.from([0xaa, 0xbb]));
  });

  test("rejects invalid magic and protocol versions", () => {
    const decoder = new NativeProtocolDecoder();
    expect(() => decoder.push(Buffer.alloc(12))).toThrow(NativeProtocolError);
    expect(() => new NativeProtocolDecoder().push(frame(NativeRecordType.Ready, Buffer.alloc(0), 1))).toThrow(
      "unsupported capture protocol version 1",
    );
  });

  test("rejects mismatched packet payload lengths", () => {
    const body = packetBody();
    body.writeUInt32LE(99, 64);
    expect(() => new NativeProtocolDecoder().push(frame(NativeRecordType.TcpPacket, body))).toThrow(
      "packet payload length does not match",
    );
  });

  test("decodes UDP packets and target status", () => {
    const records = new NativeProtocolDecoder().push(Buffer.concat([
      frame(NativeRecordType.UdpPacket, udpBody()),
      frame(NativeRecordType.TargetStatus, targetBody("SpiritVale.exe", [30616])),
      frame(NativeRecordType.TargetStatus, targetBody("SpiritVale.exe", [])),
    ]));
    const udp = records[0];
    expect(udp?.type).toBe(NativeRecordType.UdpPacket);
    if (udp?.type !== NativeRecordType.UdpPacket) throw new Error("expected UDP packet");
    expect(udp.packet.protocol).toBe("udp");
    expect(udp.packet.payload).toEqual(Buffer.from([0xcc]));
    expect(records[1]).toEqual({
      type: NativeRecordType.TargetStatus,
      status: { processName: "SpiritVale.exe", state: "active", processIds: [30616] },
    });
    expect(records[2]).toEqual({
      type: NativeRecordType.TargetStatus,
      status: { processName: "SpiritVale.exe", state: "waiting", processIds: [] },
    });
  });

  test("rejects incomplete terminal frames", () => {
    const decoder = new NativeProtocolDecoder();
    decoder.push(frame(NativeRecordType.Ready).subarray(0, 8));
    expect(() => decoder.finish()).toThrow("incomplete frame");
  });

  test("decodes warning, error, and stopped records", () => {
    const decoder = new NativeProtocolDecoder();
    const bytes = Buffer.concat([
      frame(NativeRecordType.Warning, Buffer.from("careful")),
      frame(NativeRecordType.Error, Buffer.from("failed")),
      frame(NativeRecordType.Stopped),
    ]);
    expect(decoder.push(bytes)).toEqual([
      { type: NativeRecordType.Warning, message: "careful" },
      { type: NativeRecordType.Error, message: "failed" },
      { type: NativeRecordType.Stopped },
    ]);
  });
});
