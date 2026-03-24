/**
 * @module workspace-flow/domain/value-objects
 * @file TaskId.ts
 * @description Branded string value object for Task identifiers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const __taskIdBrand: unique symbol;

/** Branded string that prevents mixing Task IDs with other string IDs. */
export type TaskId = string & { readonly [__taskIdBrand]: void };

/** Creates a TaskId from a plain string (e.g. a Firestore document ID). */
export function taskId(raw: string): TaskId {
  return raw as TaskId;
}
