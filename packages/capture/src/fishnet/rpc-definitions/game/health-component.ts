import type { FishNetBehaviourDefinition, FishNetSyncTypeDefinition } from "../../definitions/rpc-map.ts";
import { healthComponentRpcs } from "../generated/health-component.ts";

export class HealthComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "HealthComponent";
  static readonly rpcs = healthComponentRpcs;
  /**
   * Named from observation rather than from game metadata: index 0 reconciles against accumulated
   * damage and healing on ~91% of updates in a live capture, and index 1 is written alongside it to
   * the same value on spawn and on a full restore. `packages/character/src/record-decoder.ts` has
   * read both positionally for some time; declaring them here is what puts a name on the packet.
   */
  static readonly syncTypes = [
    { "index": 0, "name": "CurrentHealth", "typeName": "System.Int32", "codec": "packedInt32" },
    { "index": 1, "name": "MaxHealth", "typeName": "System.Int32", "codec": "packedInt32" },
  ] as const satisfies readonly FishNetSyncTypeDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
    syncTypes: this.syncTypes,
  } as const satisfies FishNetBehaviourDefinition;
}
