import type { FishNetBehaviourDefinition, FishNetRpcDefinition } from "../../../definitions/rpc-map.ts";
import { playerSaveSessionCharacterRpcs } from "./session-character.ts";
import { playerSaveCharacterBuildRpcs } from "./character-build.ts";
import { playerSaveEconomyWorldStorageRpcs } from "./economy-world-storage.ts";
import { playerSaveVendingRpcs } from "./vending.ts";
import { playerSaveDebugRpcs } from "./debug.ts";
import { playerSaveSocialAccountRpcs } from "./social-account.ts";
import { playerSaveCosmeticsProgressionRpcs } from "./cosmetics-progression.ts";

export class PlayerSaveRpcDefinition {
  private constructor() {}

  static readonly typeName = "PlayerSave";
  static readonly rpcs = [
    ...playerSaveSessionCharacterRpcs,
    ...playerSaveCharacterBuildRpcs,
    ...playerSaveEconomyWorldStorageRpcs,
    ...playerSaveVendingRpcs,
    ...playerSaveDebugRpcs,
    ...playerSaveSocialAccountRpcs,
    ...playerSaveCosmeticsProgressionRpcs,
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs,
  } as const satisfies FishNetBehaviourDefinition;
}
