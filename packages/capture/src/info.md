  - generated/ — script-owned RPC maps and map-name data only.
  - mapping/ — deterministic lookup and access to generated mappings.
  - inference/ — fallback RPC inference, recovery classification, and semantic heuristics.
  - decoding/ — packet, field, spawn, session, transform, quaternion, and wire decoding.
  - schema/ — protocol, codec, RPC-map, and character-data types.
  - tracking/ — monster, boss gravestone, and Eternal Tower state.

  The former mixed rpc-resolution.ts was split into:

  - packages/capture/src/fishnet/mapping/rpc-map.ts for exact generated-map lookup.
  - packages/capture/src/fishnet/inference/rpc-inference.ts for narrowing and recovery heuristics.