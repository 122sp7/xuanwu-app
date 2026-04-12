/**
 * source subdomain — server-only API.
 *
 * Exports composition factories for server-side wiring.
 * Server Actions, route handlers, and other server-side entry points should
 * use these factories instead of importing infrastructure adapters directly.
 */

export {
  makeSourceFileAdapter,
  makeRagDocumentAdapter,
  makeSourceDocumentCommandAdapter,
  makeParsedDocumentAdapter,
  makeSourcePipelineAdapter,
  makeKnowledgePageGateway,
  makeWikiLibraryAdapter,
  waitForParsedDocument,
} from "../../../interfaces/source/composition/adapters";
export type { SourceUseCases } from "../../../interfaces/source/composition/use-cases";
export { makeSourceUseCases } from "../../../interfaces/source/composition/use-cases";
