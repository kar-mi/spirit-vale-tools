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
  | "packedInt64"
  | "packedInt32Array"
  | "packedUInt64"
  | "stringUtf8Packed"
  | "vector3IntPacked"
  | "vector2"
  | "vector3"
  | "quaternion";

export type FishNetDecodedValue = boolean | number | string | number[] | null;

export interface FishNetDecodedField {
  name: string;
  typeName?: string;
  /** `nullable` identifies the generated reference-value wrapper rather than a leaf codec. */
  codec: FishNetWireCodec | "nullable";
  value: FishNetDecodedValue;
  /** Public game-data label resolved for known IDs (currently mapId). */
  resolvedName?: string;
}
