import { resolveFishNetItem } from "@spiritvale/items";
import type { FishNetItemSubstatGroup } from "@spiritvale/items";

export type FishNetMarketSubstatGroup = FishNetItemSubstatGroup;

export function fishNetMarketSubstatGroup(
  baseItemId: string | undefined,
): FishNetMarketSubstatGroup | undefined {
  return resolveFishNetItem(2, baseItemId)?.substatGroup;
}
