/**
 * Module: notion
 * Layer: domain (context-wide published language)
 * Purpose: Reference types exposed to downstream bounded contexts.
 *
 * These types represent notion's public vocabulary as defined in the context map.
 * Downstream consumers (notebooklm, workspace) receive opaque references — never
 * raw aggregates or internal domain models.
 *
 * Context Map tokens:
 *   - KnowledgeArtifactReference: opaque ref consumed by notebooklm for retrieval/grounding
 *   - AttachmentReference: traceable ref to an attachment asset
 *   - TaxonomyHint: classification hint forwarded as retrieval aid
 */

/** Opaque reference to a KnowledgePage or Article (cross-module token) */
export interface KnowledgeArtifactReference {
  readonly artifactId: string;
  readonly artifactType: "page" | "article";
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
}

/** Opaque reference to an attachment asset (cross-module token) */
export interface AttachmentReference {
  readonly attachmentId: string;
  readonly artifactId: string;
  readonly accountId: string;
  readonly displayName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

/**
 * Classification hint forwarded to downstream contexts as retrieval aid.
 * The downstream context (notebooklm) does not own taxonomy semantics —
 * it only consumes the hint for filtering and ranking.
 */
export interface TaxonomyHint {
  readonly taxonomyId: string;
  readonly label: string;
  readonly path: readonly string[];
}
