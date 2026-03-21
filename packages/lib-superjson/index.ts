/**
 * @module libs/superjson
 * Thin wrapper for superjson serialization.
 *
 * superjson extends JSON to support more types: Date, Map, Set, BigInt,
 * Infinity, -0, undefined, NaN, and custom serialization hooks.
 *
 * Usage:
 *   import { stringify, parse } from "@/libs/superjson";
 *   const json = stringify(data);
 *   const result = parse<MyType>(json);
 */

export { stringify, parse } from "superjson";
export { serialize, deserialize, registerClass, registerCustom, registerSymbol, allowErrorProps } from "superjson";
export type { SuperJSONValue } from "superjson";
