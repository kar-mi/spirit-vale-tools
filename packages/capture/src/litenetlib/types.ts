import type { CapturedUdpPacket } from "../types.ts";

export type LiteNetLibPacketProperty =
  | "unreliable"
  | "channeled"
  | "ack"
  | "ping"
  | "pong"
  | "connectRequest"
  | "connectAccept"
  | "disconnect"
  | "unconnectedMessage"
  | "mtuCheck"
  | "mtuOk"
  | "broadcast"
  | "shutdownOk"
  | "peerNotFound"
  | "invalidProtocol"
  | "natMessage"
  | "empty";

export interface LiteNetLibFragment {
  id: number;
  part: number;
  total: number;
}

interface LiteNetLibPacketBase {
  propertyId: number;
  property: LiteNetLibPacketProperty;
  connectionNumber: number;
  fragmented: boolean;
  raw: Buffer;
  payload: Buffer;
}

export interface LiteNetLibUnreliablePacket extends LiteNetLibPacketBase {
  propertyId: 0;
  property: "unreliable";
}

export interface LiteNetLibChanneledPacket extends LiteNetLibPacketBase {
  propertyId: 1;
  property: "channeled";
  sequence: number;
  channel: number;
  fragment?: LiteNetLibFragment;
}

export interface LiteNetLibAckPacket extends LiteNetLibPacketBase {
  propertyId: 2;
  property: "ack";
  sequence: number;
  channel: number;
}

export interface LiteNetLibPingPacket extends LiteNetLibPacketBase {
  propertyId: 3;
  property: "ping";
  sequence: number;
}

export interface LiteNetLibPongPacket extends LiteNetLibPacketBase {
  propertyId: 4;
  property: "pong";
  sequence: number;
  timestamp: bigint;
}

export interface LiteNetLibControlPacket extends LiteNetLibPacketBase {
  propertyId: 5 | 6 | 7 | 8 | 9 | 10 | 11 | 13 | 14 | 15 | 16 | 17;
  property: Exclude<LiteNetLibPacketProperty, "unreliable" | "channeled" | "ack" | "ping" | "pong">;
}

export type LiteNetLibPacket =
  | LiteNetLibUnreliablePacket
  | LiteNetLibChanneledPacket
  | LiteNetLibAckPacket
  | LiteNetLibPingPacket
  | LiteNetLibPongPacket
  | LiteNetLibControlPacket;

export interface DecodedLiteNetLibPacket {
  packet: LiteNetLibPacket;
  /** Child indexes traversed through merged envelopes; empty for a top-level leaf. */
  mergePath: number[];
}

export interface CapturedLiteNetLibPacket extends DecodedLiteNetLibPacket {
  udpPacket: CapturedUdpPacket;
}
