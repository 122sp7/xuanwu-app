/**
 * source subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseSourceFileAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceFileAdapter";
export { FirebaseRagDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseRagDocumentAdapter";
export { FirebaseSourceDocumentCommandAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceDocumentCommandAdapter";
export { FirebaseParsedDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseParsedDocumentAdapter";
export { PlatformSourcePipelineAdapter } from "../../../infrastructure/source/platform/PlatformSourcePipelineAdapter";
export { FirebaseWikiLibraryAdapter } from "../../../infrastructure/source/firebase/FirebaseWikiLibraryAdapter";
export {
  makeSourceFileAdapter,
  makeRagDocumentAdapter,
  makeSourceDocumentCommandAdapter,
  makeParsedDocumentAdapter,
  makeSourcePipelineAdapter,
  makeKnowledgePageGateway,
  waitForParsedDocument,
} from "../../../interfaces/source/composition/adapters";
export type { SourceUseCases } from "../../../interfaces/source/composition/use-cases";
export { makeSourceUseCases } from "../../../interfaces/source/composition/use-cases";
