import { decimal, isRecord, nullableString } from "@kar-mi/spirit-vale-tools-logging";
import type { JsonObject } from "@kar-mi/spirit-vale-tools-logging";
import type { FishNetMarketEvent, FishNetMarketItem, FishNetMarketListing } from "./market.ts";

export function marketEventLogData(event: FishNetMarketEvent): JsonObject {
  return JSON.parse(JSON.stringify(event, (key, value) => {
    if (key === "sellerAccountId" || key === "accountId" || key === "visualSnapshotJson" || key === "archetype"
      || key === "compatibilityFingerprint" || key === "payloadSchemaVersion") return undefined;
    return typeof value === "bigint" ? value.toString() : value;
  })) as JsonObject;
}

/** Collects unique item-payload metadata for one session-level `market.metadata` record. */
export function marketLogMetadataData(value: unknown): JsonObject | undefined {
  const compatibilityFingerprints = new Set<string>();
  const payloadSchemaVersions = new Set<number>();
  collectItemMetadata(value, compatibilityFingerprints, payloadSchemaVersions);
  if (compatibilityFingerprints.size === 0 && payloadSchemaVersions.size === 0) return undefined;
  return {
    compatibilityFingerprints: [...compatibilityFingerprints].sort(),
    payloadSchemaVersions: [...payloadSchemaVersions].sort((left, right) => left - right),
  };
}

export function parseMarketEventLogData(value: unknown): FishNetMarketEvent | undefined {
  if (!isRecord(value) || !Number.isSafeInteger(value["tick"]) || typeof value["kind"] !== "string") return undefined;
  const revived = reviveBigInts(value);
  if (revived === INVALID || !isRecord(revived)) return undefined;
  normalizeRedactedItemMetadata(revived);
  const tick = value["tick"] as number;
  switch (value["kind"]) {
    case "searchRequest": {
      const request = revived["request"];
      return validSearchRequest(request) ? { kind: "searchRequest", tick, request } : undefined;
    }
    case "searchPage": {
      const page = revived["page"];
      if (isRecord(page)) normalizeRedactedSellerIds(page["listings"]);
      if (!isRecord(page) || typeof page["success"] !== "boolean" || !Number.isSafeInteger(page["code"])
        || !nullableString(page["message"]) || !nullableString(page["nextCursor"]) || typeof page["hasMore"] !== "boolean"
        || !Array.isArray(page["listings"]) || !page["listings"].every(validListing)) return undefined;
      return { kind: "searchPage", tick, page: page as unknown as Extract<FishNetMarketEvent, { kind: "searchPage" }>["page"] };
    }
    case "overview": {
      const overview = revived["overview"];
      if (isRecord(overview)) normalizeRedactedSellerIds(overview["ownListings"]);
      if (!isRecord(overview) || typeof overview["pendingCoins"] !== "bigint" || typeof overview["mailboxHasMore"] !== "boolean"
        || typeof overview["transactionsHaveMore"] !== "boolean" || typeof overview["ownListingsHaveMore"] !== "boolean"
        || !Number.isSafeInteger(overview["code"]) || !Number.isSafeInteger(overview["reason"]) || !nullableString(overview["message"])
        || !nullableObjectArray(overview["mailboxItems"]) || !nullableObjectArray(overview["transactions"])
        || !nullableListingArray(overview["ownListings"])) return undefined;
      return { kind: "overview", tick, overview: overview as unknown as Extract<FishNetMarketEvent, { kind: "overview" }>["overview"] };
    }
    case "stallStatus": {
      const status = revived["status"];
      if (status === null) return { kind: "stallStatus", tick, status: null };
      if (!isRecord(status) || typeof status["hasActiveStall"] !== "boolean" || !nullableString(status["characterId"])
        || typeof status["expiresAt"] !== "bigint" || !Number.isSafeInteger(status["occupiedCount"])
        || !Number.isSafeInteger(status["totalSpots"])) return undefined;
      return { kind: "stallStatus", tick, status: status as unknown as Extract<FishNetMarketEvent, { kind: "stallStatus" }>["status"] };
    }
    case "stalls": {
      normalizeRedactedStalls(revived["stalls"]);
      return nullableObjectArray(revived["stalls"])
        ? { kind: "stalls", tick, stalls: revived["stalls"] as Extract<FishNetMarketEvent, { kind: "stalls" }>["stalls"] } : undefined;
    }
    case "stallUpsert": {
      normalizeRedactedStall(revived["stall"]);
      return revived["stall"] === null || isRecord(revived["stall"])
        ? { kind: "stallUpsert", tick, stall: revived["stall"] as Extract<FishNetMarketEvent, { kind: "stallUpsert" }>["stall"] } : undefined;
    }
    case "stallRemove": {
      const accountId = revived["accountId"] === undefined ? null : revived["accountId"];
      return nullableString(accountId) ? { kind: "stallRemove", tick, accountId } : undefined;
    }
    case "stallListings": {
      normalizeRedactedSellerIds(revived["listings"]);
      return nullableListingArray(revived["listings"])
        ? { kind: "stallListings", tick, listings: revived["listings"] as Array<FishNetMarketListing | null> | null } : undefined;
    }
    case "collectResult": return typeof revived["success"] === "boolean" && nullableString(revived["message"])
      ? { kind: "collectResult", tick, success: revived["success"], message: revived["message"] as string | null } : undefined;
    default: return undefined;
  }
}

const INVALID = Symbol("invalid");
const BIGINT_KEYS = new Set(["unitPrice", "version", "createdAt", "updatedAt", "expiresAt", "pendingCoins", "sellerProceeds", "completedAt"]);

function reviveBigInts(value: unknown, key = ""): unknown | typeof INVALID {
  if (BIGINT_KEYS.has(key)) return decimal(value) ? BigInt(value) : INVALID;
  if (Array.isArray(value)) {
    const result = value.map((entry) => reviveBigInts(entry));
    return result.includes(INVALID) ? INVALID : result;
  }
  if (!isRecord(value)) return value;
  const result: Record<string, unknown> = {};
  for (const [name, entry] of Object.entries(value)) {
    const revived = reviveBigInts(entry, name);
    if (revived === INVALID) return INVALID;
    result[name] = revived;
  }
  return result;
}

function validSearchRequest(value: unknown): value is Extract<FishNetMarketEvent, { kind: "searchRequest" }>["request"] {
  return isRecord(value) && nullableString(value["query"]) && nullableString(value["cursor"]) && Number.isSafeInteger(value["pageSize"]);
}
function validItem(value: unknown): value is FishNetMarketItem {
  return isRecord(value) && nullableString(value["itemId"]) && nullableString(value["instanceId"])
    && Number.isSafeInteger(value["itemType"]) && Number.isSafeInteger(value["quantity"])
    && nullableString(value["payloadJson"]) && (value["payloadSchemaVersion"] === null || Number.isSafeInteger(value["payloadSchemaVersion"]))
    && nullableString(value["compatibilityFingerprint"]);
}
function validListing(value: unknown): value is FishNetMarketListing {
  return isRecord(value) && nullableString(value["listingId"]) && nullableString(value["sellerAccountId"])
    && nullableString(value["sellerDisplayName"]) && nullableString(value["itemDisplayName"]) && validItem(value["item"])
    && Number.isSafeInteger(value["initialQuantity"]) && Number.isSafeInteger(value["availableQuantity"])
    && Number.isSafeInteger(value["soldQuantity"]) && typeof value["unitPrice"] === "bigint"
    && Number.isSafeInteger(value["status"]) && typeof value["version"] === "bigint"
    && typeof value["createdAt"] === "bigint" && typeof value["updatedAt"] === "bigint" && typeof value["expiresAt"] === "bigint";
}
function nullableListingArray(value: unknown): boolean {
  return value === null || (Array.isArray(value) && value.every((entry) => entry === null || validListing(entry)));
}
function nullableObjectArray(value: unknown): boolean {
  return value === null || (Array.isArray(value) && value.every((entry) => entry === null || isRecord(entry)));
}

/** Logged listings intentionally omit seller account identifiers; restore the model's neutral value on read. */
function normalizeRedactedSellerIds(value: unknown): void {
  if (!Array.isArray(value)) return;
  for (const entry of value) {
    if (isRecord(entry) && !Object.hasOwn(entry, "sellerAccountId")) entry["sellerAccountId"] = null;
  }
}

function normalizeRedactedStalls(value: unknown): void {
  if (!Array.isArray(value)) return;
  for (const entry of value) normalizeRedactedStall(entry);
}

function normalizeRedactedStall(value: unknown): void {
  if (!isRecord(value)) return;
  if (!Object.hasOwn(value, "accountId")) value["accountId"] = null;
  if (!Object.hasOwn(value, "visualSnapshotJson")) value["visualSnapshotJson"] = null;
  if (!Object.hasOwn(value, "archetype")) value["archetype"] = null;
}

function normalizeRedactedItemMetadata(value: unknown): void {
  if (Array.isArray(value)) {
    for (const entry of value) normalizeRedactedItemMetadata(entry);
    return;
  }
  if (!isRecord(value)) return;
  if (Object.hasOwn(value, "itemId") && Object.hasOwn(value, "itemType") && Object.hasOwn(value, "quantity")) {
    if (!Object.hasOwn(value, "compatibilityFingerprint")) value["compatibilityFingerprint"] = null;
    if (!Object.hasOwn(value, "payloadSchemaVersion")) value["payloadSchemaVersion"] = null;
  }
  for (const entry of Object.values(value)) normalizeRedactedItemMetadata(entry);
}

function collectItemMetadata(value: unknown, fingerprints: Set<string>, versions: Set<number>): void {
  if (Array.isArray(value)) {
    for (const entry of value) collectItemMetadata(entry, fingerprints, versions);
    return;
  }
  if (!isRecord(value)) return;
  if (typeof value["compatibilityFingerprint"] === "string") fingerprints.add(value["compatibilityFingerprint"]);
  if (Number.isSafeInteger(value["payloadSchemaVersion"])) versions.add(value["payloadSchemaVersion"] as number);
  for (const entry of Object.values(value)) collectItemMetadata(entry, fingerprints, versions);
}
