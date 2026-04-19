/**
 * @module infra/serialization
 * Serialization and conversion primitives.
 */

export interface JsonParseResult {
  ok: boolean;
  value: unknown;
  error: Error | null;
}

export const safeJsonParse = (input: string): JsonParseResult => {
  try {
    return {
      ok: true,
      value: JSON.parse(input),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      value: null,
      error: error instanceof Error ? error : new Error("Failed to parse JSON"),
    };
  }
};

export const toJsonString = (value: unknown): string => JSON.stringify(value);

export const encodeBase64 = (value: string): string => {
  if (typeof globalThis.btoa === "function") {
    return globalThis.btoa(value);
  }

  return Buffer.from(value, "utf8").toString("base64");
};

export const decodeBase64 = (value: string): string => {
  if (typeof globalThis.atob === "function") {
    return globalThis.atob(value);
  }

  return Buffer.from(value, "base64").toString("utf8");
};

// ─── SuperJSON ────────────────────────────────────────────────────────────────
// Type-safe serializer: preserves Date, BigInt, Set, Map, undefined, RegExp.
// Use superJsonStringify / superJsonParse for simple round-trip.
// Use superJsonSerialize / superJsonDeserialize when you need the { json, meta }
// pair (e.g. as a tRPC transformer).
// SuperJSON class is exported for isolated instances with custom registrations.

import SuperJSONLib from "superjson";

/** Serialize any value to a JSON string, preserving non-JSON types. */
export const superJsonStringify = (value: unknown): string =>
  SuperJSONLib.stringify(value);

/** Deserialize a superjson string back to the original typed value. */
export const superJsonParse = <T>(value: string): T =>
  SuperJSONLib.parse<T>(value);

/** Serialize to `{ json, meta }` pair — useful as a tRPC transformer. */
export const superJsonSerialize = (
  value: unknown,
): ReturnType<typeof SuperJSONLib.serialize> =>
  SuperJSONLib.serialize(value);

/** Deserialize from a `{ json, meta }` pair. */
export const superJsonDeserialize = <T>(
  payload: Parameters<typeof SuperJSONLib.deserialize>[0],
): T => SuperJSONLib.deserialize<T>(payload);

/** The SuperJSON class for isolated instances with custom registerClass / registerCustom. */
export { default as SuperJSON } from "superjson";
