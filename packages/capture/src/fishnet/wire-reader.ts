// Compatibility entry point for the published `./wire-reader` subpath.
export {
  checkedEnd,
  readFloatVector,
  readNetworkBehaviourHeader,
  readNetworkObjectReference,
  readSignedPackedWhole,
  readUnsignedPackedWhole,
  requireBytes,
} from "./decoding/wire-reader.ts";
export type {
  NetworkBehaviourHeader,
  NetworkObjectReference,
} from "./decoding/wire-reader.ts";
