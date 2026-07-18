import type { FishNetBehaviourDefinition, FishNetRpcDefinition, FishNetSyncTypeDefinition } from "../../../definitions/rpc-map.ts";
import { playerControllerTraversalSessionRpcs } from "./traversal-session.ts";
import { playerControllerChatPresenceRpcs } from "./chat-presence.ts";
import { playerControllerPartyRpcs } from "./party.ts";
import { playerControllerTradeMarketRpcs } from "./trade-market.ts";
import { playerControllerEndgamePvpRpcs } from "./endgame-pvp.ts";
import { playerControllerGuildRpcs } from "./guild.ts";

export class PlayerControllerRpcDefinition {
  private constructor() {}

  static readonly typeName = "PlayerController";
  static readonly rpcs = [
    ...playerControllerTraversalSessionRpcs,
    ...playerControllerChatPresenceRpcs,
    ...playerControllerPartyRpcs,
    ...playerControllerTradeMarketRpcs,
    ...playerControllerEndgamePvpRpcs,
    ...playerControllerGuildRpcs,
  ] as const satisfies readonly FishNetRpcDefinition[];
  static readonly syncTypes = [
    {
      "index": 5,
      "name": "VisualData",
      "typeName": "CharacterVisualDto",
      "fields": [
        {
          "name": "Appearance",
          "typeName": "CharacterAppearanceDto",
          "fields": [
            {
              "name": "DisplayName",
              "typeName": "System.String",
              "codec": "stringUtf8Packed"
            },
            {
              "name": "Archetype",
              "typeName": "Archetype",
              "codec": "packedInt32"
            }
          ]
        }
      ]
    }
  ] as const satisfies readonly FishNetSyncTypeDefinition[];
  static readonly definition = {
    typeName: this.typeName,
    rpcs: this.rpcs, syncTypes: this.syncTypes,
  } as const satisfies FishNetBehaviourDefinition;
}
