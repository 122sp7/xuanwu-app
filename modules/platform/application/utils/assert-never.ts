/**
 * assertNever — exhaustive union check utility.
 *
 * TypeScript compile-time guard: throws a runtime Error if a discriminated
 * union branch is reached that should be unreachable.  Useful in switch/if
 * chains to guarantee all variants are handled.
 *
 * Usage:
 *   switch (state) {
 *     case "active":  ...
 *     case "draft":   ...
 *     default: assertNever(state); // compile error when new states are added
 *   }
 *
 * @see shared/value-objects/PlatformLifecycleState.ts — example usage
 */
export function assertNever(value: never): never {
	throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
