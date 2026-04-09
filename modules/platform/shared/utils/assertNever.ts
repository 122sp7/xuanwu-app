/**
 * assertNever — Utility Function
 *
 * TypeScript exhaustive check helper.
 * Throws a compile-time error if a discriminated union is not fully handled.
 *
 * Usage:
 *   switch (state) {
 *     case "active": ...
 *     case "draft": ...
 *     default: assertNever(state); // compile error if new states are added
 *   }
 *
 * @see shared/value-objects/PlatformLifecycleState.ts — example usage
 */

// TODO: implement assertNever exhaustive check function
