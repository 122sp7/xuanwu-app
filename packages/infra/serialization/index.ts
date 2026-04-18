/**
 * @module infra/serialization
 * Serialization and conversion primitives.
 */

export interface JsonParseResult<T> {
  ok: boolean;
  value: T | null;
  error: Error | null;
}

export const safeJsonParse = <T>(input: string): JsonParseResult<T> => {
  try {
    return {
      ok: true,
      value: JSON.parse(input) as T,
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
