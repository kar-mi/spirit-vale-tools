import { resolveFishNetItem } from "@kar-mi/spirit-vale-tools-items";
import type { FishNetItemSubstatGroup } from "@kar-mi/spirit-vale-tools-items";

export type FishNetMarketSubstatGroup = FishNetItemSubstatGroup;

export function fishNetMarketSubstatGroup(
  baseItemId: string | undefined,
): FishNetMarketSubstatGroup | undefined {
  return resolveFishNetItem(2, baseItemId)?.substatGroup;
}
