/**
 * @module workspace-flow/domain/value-objects
 * @file SourceReference.ts
 * @description Value object representing the origin of a materialized entity (Task or Invoice).
 *
 * A SourceReference is attached to Task and Invoice entities that were created
 * by the KnowledgeToWorkflowMaterializer Process Manager in response to a
 * `knowledge.page_approved` event. It provides full audit traceability:
 *
 *   Task → sourceReference → KnowledgePage → IngestionJob → source PDF
 */

export type SourceReferenceType = "KnowledgePage";

export interface SourceReference {
  /** The type of the source aggregate. */
  readonly type: SourceReferenceType;
  /** The ID of the source aggregate (e.g. KnowledgePage.id). */
  readonly id: string;
  /**
   * causationId from the `knowledge.page_approved` event that triggered
   * materialization.  Stored for idempotency checks and audit trails.
   */
  readonly causationId: string;
  /**
   * correlationId tracing the entire business flow:
   *   ingestion → human review → approval → materialization.
   */
  readonly correlationId: string;
}
 
