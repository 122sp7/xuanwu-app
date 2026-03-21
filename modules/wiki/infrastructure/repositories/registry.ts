/**
 * Module: wiki
 * Layer: infrastructure/repository-registry
 * Purpose: Module-level singleton repository instances for the in-memory stub phase.
 *          Import from this file instead of calling `new Repo()` at each call-site.
 *          Guarantees that Server Actions and query helpers share the same in-process store.
 *          Replace with Firestore-backed repositories when the persistence adapter lands.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { InMemoryWikiPageRepository } from './in-memory-wiki-page.repository'
import { InMemoryWikiDocumentRepository } from './in-memory-wiki-document.repository'

export const wikiPageRepository = new InMemoryWikiPageRepository()
export const wikiDocumentRepository = new InMemoryWikiDocumentRepository()
