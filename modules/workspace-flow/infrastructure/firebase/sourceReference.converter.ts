/**
 * @module workspace-flow/infrastructure/firebase
 * @file sourceReference.converter.ts
 * @description Firestore document-to-value-object converter for SourceReference.
 * Shared by task.converter.ts and invoice.converter.ts.
 */

import type { SourceReference } from "../../domain/value-objects/SourceReference";

/**
 * Convert a raw Firestore field value to a typed SourceReference value object.
 * Returns `undefined` if the value is absent or does not conform to the expected shape.
 */
export function toSourceReference(raw: unknown): SourceReference | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (r.type !== "KnowledgePage") return undefined;
  if (
    typeof r.id !== "string" ||
    typeof r.causationId !== "string" ||
    typeof r.correlationId !== "string"
  ) {
    return undefined;
  }
  return { type: "KnowledgePage", id: r.id, causationId: r.causationId, correlationId: r.correlationId };
}
