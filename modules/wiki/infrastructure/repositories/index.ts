/**
 * Module: wiki
 * Layer: infrastructure/repositories
 * Purpose: Barrel re-export for all wiki repository adapters.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

export { UpstashWikiDocumentRepository } from './upstash-wiki-document.repository'
export { InMemoryWikiDocumentRepository } from './in-memory-wiki-document.repository'
export { InMemoryWikiPageRepository } from './in-memory-wiki-page.repository'
export { OpenAIEmbeddingRepository } from './openai-embedding.repository'
