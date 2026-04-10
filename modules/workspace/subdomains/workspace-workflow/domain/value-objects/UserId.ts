/**
 * @module workspace-flow/domain/value-objects
 * @file UserId.ts
 * @description Branded string value object for User identifiers.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const UserIdBrand: unique symbol;

/** Branded string that prevents mixing User IDs with other string IDs. */
export type UserId = string & { readonly [UserIdBrand]: void };

/** Creates a UserId from a plain string (e.g. a Firebase Auth UID). */
export function userId(raw: string): UserId {
  return raw as UserId;
}
 
