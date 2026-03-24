/**
 * @module workspace-flow/domain/value-objects
 * @file IssueId.ts
 * @description Branded string value object for Issue identifiers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */

declare const __issueIdBrand: unique symbol;

/** Branded string that prevents mixing Issue IDs with other string IDs. */
export type IssueId = string & { readonly [__issueIdBrand]: void };

/** Creates an IssueId from a plain string (e.g. a Firestore document ID). */
export function issueId(raw: string): IssueId {
  return raw as IssueId;
}
