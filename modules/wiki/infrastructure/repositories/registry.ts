/**
 * Module: wiki
 * Layer: infrastructure/repository-registry
 * Purpose: Module-level singleton repository instances.
 *          In-memory repositories are used during the stub phase (local dev, CI without Upstash).
 *          Swap to Upstash repositories when UPSTASH_VECTOR_REST_URL is available at runtime.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { InMemoryWikiPageRepository } from './in-memory-wiki-page.repository'
import { InMemoryWikiDocumentRepository } from './in-memory-wiki-document.repository'

export const wikiPageRepository = new InMemoryWikiPageRepository()
export const wikiDocumentRepository = new InMemoryWikiDocumentRepository()
