/**
 * Module: wiki
 * Layer: infrastructure/repositories
 * Purpose: Shared types, constants, and utilities used by Upstash-backed repository adapters.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { WikiDocument } from '../../domain/entities/wiki-document.entity'
import { Taxonomy } from '../../domain/value-objects/taxonomy.vo'

// ── Upstash Vector Metadata ─────────────────────────────────────────────────

/** Metadata stored alongside each vector in the Upstash Vector index. */
export interface WikiVectorMetadata {
  [key: string]: unknown
  documentId: string
  organizationId: string
  workspaceId: string | null
  title: string
  category: string
  scope: string
}

// ── Redis Key Patterns ──────────────────────────────────────────────────────

export const REDIS_DOC_PREFIX = 'wiki:doc:'
export const REDIS_ORG_SET_PREFIX = 'wiki:org:'
export const REDIS_WS_SET_PREFIX = 'wiki:ws:'

// ── Serialised Document Record ──────────────────────────────────────────────

/** Shape of the serialised document stored in Redis. */
export interface WikiDocumentRecord {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
  organizationId: string
  workspaceId: string | null
  taxonomy: { category: string; tags: string[]; namespace: string }
  scope: string
  parentPageId: string | null
}

// ── Hydration Utility ───────────────────────────────────────────────────────

/**
 * Hydrates a WikiDocument entity from a Redis-stored record.
 * Accepts either a JSON string or an already-parsed object.
 */
export function hydrateWikiDocument(raw: string | WikiDocumentRecord): WikiDocument {
  const data: WikiDocumentRecord = typeof raw === 'string' ? JSON.parse(raw) : raw
  return new WikiDocument(
    data.id,
    data.title,
    data.content,
    data.status as WikiDocument['status'],
    new Date(data.createdAt),
    data.organizationId,
    data.workspaceId,
    new Taxonomy(data.taxonomy.category, data.taxonomy.tags, data.taxonomy.namespace),
    data.scope as WikiDocument['scope'],
    data.parentPageId,
  )
}

/**
 * Serialises a WikiDocument entity into a WikiDocumentRecord for Redis storage.
 */
export function serializeWikiDocument(entity: WikiDocument): WikiDocumentRecord {
  return {
    id: entity.id,
    title: entity.title,
    content: entity.content,
    status: entity.status,
    createdAt: entity.createdAt.toISOString(),
    organizationId: entity.organizationId,
    workspaceId: entity.workspaceId,
    taxonomy: {
      category: entity.taxonomy.category,
      tags: entity.taxonomy.tags,
      namespace: entity.taxonomy.namespace,
    },
    scope: entity.scope,
    parentPageId: entity.parentPageId,
  }
}
