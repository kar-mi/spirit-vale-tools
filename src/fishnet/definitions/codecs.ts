export type FishNetWireCodec =
  | "boolean"
  | "uint8"
  | "int8"
  | "uint16"
  | "int16"
  | "uint32"
  | "int32"
  | "float32"
  | "float64"
  | "packedInt32"
  | "packedUInt64"
  | "stringUtf8Packed"
  | "vector3IntPacked"
  | "vector2"
  | "vector3"
  | "quaternion";

export type FishNetDecodedValue = boolean | number | string | number[];

export interface FishNetDecodedField {
  name: string;
  typeName?: string;
  codec: FishNetWireCodec;
  value: FishNetDecodedValue;
}
