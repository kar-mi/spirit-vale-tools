import type { JsonObject } from "@spiritvale/logging";

import type {
  FishNetMarketAccount,
  FishNetMarketCatalogItem,
  FishNetMarketCollectable,
  FishNetMarketEvent,
  FishNetMarketListing,
  FishNetMarketSale,
  FishNetMarketStall,
} from "./market.ts";

export function marketEventLogData(event: FishNetMarketEvent): JsonObject {
  return JSON.parse(JSON.stringify(event, (_key, value) => typeof value === "bigint" ? value.toString() : value)) as JsonObject;
}

export function parseMarketEventLogData(value: unknown): FishNetMarketEvent | undefined {
  if (!isRecord(value) || !Number.isSafeInteger(value["tick"])) return undefined;
  const tick = value["tick"] as number;
  switch (value["kind"]) {
    case "catalog": {
      const items = nullableArray(value["items"], parseCatalogItem);
      return items === undefined ? undefined : { kind: "catalog", tick, items };
    }
    case "account": {
      const account = nullableValue(value["account"], parseAccount);
      if (account === undefined) return undefined;
      const balanceDelta = optionalBigInt(value["balanceDelta"]);
      const collectedAmount = optionalBigInt(value["collectedAmount"]);
      if (balanceDelta === INVALID || collectedAmount === INVALID) return undefined;
      return {
        kind: "account",
        tick,
        account,
        ...(balanceDelta === undefined ? {} : { balanceDelta }),
        ...(collectedAmount === undefined ? {} : { collectedAmount }),
      };
    }
    case "stalls": {
      const stalls = nullableArray(value["stalls"], (item) => nullableValue(item, parseStall));
      return stalls === undefined ? undefined : { kind: "stalls", tick, stalls };
    }
    case "stallUpsert": {
      const stall = nullableValue(value["stall"], parseStall);
      return stall === undefined ? undefined : { kind: "stallUpsert", tick, stall };
    }
    case "stallRemove":
      return nullableString(value["accountId"])
        ? { kind: "stallRemove", tick, accountId: value["accountId"] as string | null }
        : undefined;
    case "listings": {
      const listings = nullableArray(value["listings"], (item) => nullableValue(item, parseListing));
      return listings === undefined ? undefined : { kind: "listings", tick, listings };
    }
    case "collectResult":
      return typeof value["success"] === "boolean" ? { kind: "collectResult", tick, success: value["success"] } : undefined;
    default:
      return undefined;
  }
}

const INVALID = Symbol("invalid");

function parseCatalogItem(value: unknown): FishNetMarketCatalogItem | undefined {
  if (!isRecord(value) || !nullableString(value["sellerId"]) || !nullableString(value["searchText"])
    || !nullableString(value["sellerName"])) return undefined;
  const listing = nullableValue(value["listing"], parseListing);
  if (listing === undefined) return undefined;
  return {
    sellerId: value["sellerId"] as string | null,
    searchText: value["searchText"] as string | null,
    sellerName: value["sellerName"] as string | null,
    listing,
  };
}

function parseListing(value: unknown): FishNetMarketListing | undefined {
  if (!isRecord(value) || !nullableString(value["id"]) || !nullableString(value["sellerId"])
    || !nullableString(value["sellerName"]) || !nullableString(value["itemId"])
    || !Number.isSafeInteger(value["itemType"]) || !Number.isSafeInteger(value["count"])
    || !Number.isSafeInteger(value["countTraded"]) || !decimal(value["price"])
    || !nullableString(value["json"]) || !decimal(value["expiresAt"])) return undefined;
  return {
    id: value["id"] as string | null,
    sellerId: value["sellerId"] as string | null,
    sellerName: value["sellerName"] as string | null,
    itemId: value["itemId"] as string | null,
    itemType: value["itemType"] as number,
    count: value["count"] as number,
    countTraded: value["countTraded"] as number,
    price: BigInt(value["price"]),
    json: value["json"] as string | null,
    expiresAt: BigInt(value["expiresAt"]),
  };
}

function parseAccount(value: unknown): FishNetMarketAccount | undefined {
  if (!isRecord(value) || !decimal(value["balance"])) return undefined;
  const collectables = nullableArray(value["collectables"], (item) => nullableValue(item, parseCollectable));
  const saleHistory = nullableArray(value["saleHistory"], (item) => nullableValue(item, parseSale));
  const ownListings = nullableArray(value["ownListings"], (item) => nullableValue(item, parseListing));
  if (collectables === undefined || saleHistory === undefined || ownListings === undefined) return undefined;
  return { balance: BigInt(value["balance"]), collectables, saleHistory, ownListings };
}

function parseCollectable(value: unknown): FishNetMarketCollectable | undefined {
  if (!isRecord(value) || !nullableString(value["id"]) || !Number.isSafeInteger(value["itemType"])
    || !Number.isSafeInteger(value["count"]) || !nullableString(value["json"])) return undefined;
  return {
    id: value["id"] as string | null,
    itemType: value["itemType"] as number,
    count: value["count"] as number,
    json: value["json"] as string | null,
  };
}

function parseSale(value: unknown): FishNetMarketSale | undefined {
  if (!isRecord(value) || !nullableString(value["itemDisplayName"]) || !nullableString(value["itemName"])
    || !Number.isSafeInteger(value["count"]) || !decimal(value["price"])
    || !nullableString(value["buyerName"]) || !decimal(value["at"])) return undefined;
  return {
    itemDisplayName: value["itemDisplayName"] as string | null,
    itemName: value["itemName"] as string | null,
    count: value["count"] as number,
    price: BigInt(value["price"]),
    buyerName: value["buyerName"] as string | null,
    at: BigInt(value["at"]),
  };
}

function parseStall(value: unknown): FishNetMarketStall | undefined {
  if (!isRecord(value) || !nullableString(value["accountId"]) || !nullableString(value["characterId"])
    || !nullableString(value["mapId"]) || !Number.isSafeInteger(value["stallIndex"])
    || !decimal(value["expiresAt"]) || !nullableString(value["shopName"])
    || !nullableString(value["characterName"]) || !Number.isSafeInteger(value["archetype"])
    || typeof value["rotationY"] !== "number" || !Number.isFinite(value["rotationY"])) return undefined;
  return {
    accountId: value["accountId"] as string | null,
    characterId: value["characterId"] as string | null,
    mapId: value["mapId"] as string | null,
    stallIndex: value["stallIndex"] as number,
    expiresAt: BigInt(value["expiresAt"]),
    shopName: value["shopName"] as string | null,
    characterName: value["characterName"] as string | null,
    archetype: value["archetype"] as number,
    rotationY: value["rotationY"],
  };
}

function nullableArray<T>(value: unknown, parse: (item: unknown) => T | undefined): T[] | null | undefined {
  if (value === null) return null;
  if (!Array.isArray(value)) return undefined;
  const result: T[] = [];
  for (const item of value) {
    const parsed = parse(item);
    if (parsed === undefined) return undefined;
    result.push(parsed);
  }
  return result;
}

function nullableValue<T>(value: unknown, parse: (item: unknown) => T | undefined): T | null | undefined {
  return value === null ? null : parse(value);
}

function optionalBigInt(value: unknown): bigint | undefined | typeof INVALID {
  if (value === undefined) return undefined;
  return decimal(value) ? BigInt(value) : INVALID;
}

function decimal(value: unknown): value is string {
  return typeof value === "string" && /^-?\d+$/.test(value);
}

function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
