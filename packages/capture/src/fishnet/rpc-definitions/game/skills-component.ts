import type { FishNetBehaviourDefinition, FishNetSyncTypeDefinition } from "../../definitions/rpc-map.ts";
import { skillsComponentRpcs } from "../generated/skills-component.ts";

export class SkillsComponentRpcDefinition {
  private constructor() {}

  static readonly typeName = "SkillsComponent";
  static readonly rpcs = skillsComponentRpcs;
  /**
   * Mana mirrors health's layout at the same two indexes, which is how
   * `packages/character/src/record-decoder.ts` has read it. Named from that observation rather than
   * from game metadata; the higher indexes this component also syncs stay unnamed.
   */
  static readonly syncTypes = [
    { "index": 0, "name": "CurrentMana", "typeName": "System.Int32", "codec": "packedInt32" },
    { "index": 1, "name": "MaxMana", "typeName": "System.Int32", "codec": "packedInt32" },
  ] as const satisfies readonly FishNetSyncTypeDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
    syncTypes: this.syncTypes,
  } as const satisfies FishNetBehaviourDefinition;
}
