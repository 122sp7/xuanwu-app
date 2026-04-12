/**
 * notebooklm/source domain — public exports.
 */
export type { IRagDocumentRepository } from "./repositories/IRagDocumentRepository";
export type { ISourceFileRepository } from "./repositories/ISourceFileRepository";
export type { IWikiLibraryRepository } from "./repositories/IWikiLibraryRepository";
export * from "./ports";
export type {
  SourceFileUploadedEvent,
  SourceDocumentProcessedEvent,
  SourceDocumentDeletedEvent,
  SourceDocumentRenamedEvent,
} from "./events/SourceEvents";
