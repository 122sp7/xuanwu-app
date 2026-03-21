/**
 * Module: wiki
 * Layer: infrastructure/repositories (shared internal)
 * Purpose: Shared Upstash Vector metadata type and entity mapping helpers used by
 *          UpstashWikiDocumentRepository and UpstashRetrievalRepository.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { WikiDocument, Taxonomy } from '@wiki-core'
import type { WikiDocumentStatus, WikiDocumentScope } from '@wiki-core'

/** Flat metadata shape persisted in Upstash Vector for each WikiDocument. */
export interface WikiDocVectorMetadata extends Record<string, unknown> {
  title: string
  content: string
  status: WikiDocumentStatus
  organizationId: string
  workspaceId: string | null
  taxonomyCategory: string
  /** JSON-serialized string[]. Avoids nested array issues in metadata filters. */
  taxonomyTagsJson: string
  taxonomyNamespace: string
  scope: WikiDocumentScope
  parentPageId: string | null
  createdAt: string
}

/** Escapes a string value for safe use in Upstash Vector metadata filter expressions. */
export function escapeFilterValue(value: string): string {
  // Escape single quotes by doubling them (SQL-standard escaping).
  return value.replace(/'/g, "''")
}

export function toMetadata(entity: WikiDocument): WikiDocVectorMetadata {
  return {
    title: entity.title,
    content: entity.content,
    status: entity.status,
    organizationId: entity.organizationId,
    workspaceId: entity.workspaceId,
    taxonomyCategory: entity.taxonomy.category,
    taxonomyTagsJson: JSON.stringify(entity.taxonomy.tags),
    taxonomyNamespace: entity.taxonomy.namespace,
    scope: entity.scope,
    parentPageId: entity.parentPageId,
    createdAt: entity.createdAt.toISOString(),
  }
}

export function fromMetadata(id: string, meta: WikiDocVectorMetadata): WikiDocument {
  const tags = JSON.parse(meta.taxonomyTagsJson) as string[]
  const taxonomy = new Taxonomy(meta.taxonomyCategory, tags, meta.taxonomyNamespace)
  return new WikiDocument(
    id,
    meta.title,
    meta.content,
    meta.status,
    new Date(meta.createdAt),
    meta.organizationId,
    meta.workspaceId,
    taxonomy,
    meta.scope,
    meta.parentPageId,
  )
}
