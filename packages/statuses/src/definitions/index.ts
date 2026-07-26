import { CURRENT_GAME_BUILD_FINGERPRINT } from "@kar-mi/spirit-vale-tools-capture";
import type { FishNetStatusCatalog } from "../catalog.ts";
import { StatusDefinitions } from "./statuses.ts";

export class StatusCatalogDefinitions {
  private constructor() {}

  static readonly catalog = {
    buildFingerprint: CURRENT_GAME_BUILD_FINGERPRINT,
    statuses: StatusDefinitions.values,
  } as const satisfies FishNetStatusCatalog;
}
