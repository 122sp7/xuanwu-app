/**
 * notebooklm/source domain/ports — driven port interfaces for the source subdomain.
 *
 * SourceDocumentCommandPort and ParsedDocumentPort are the primary driven ports.
 * Repository contracts are re-exported from domain/repositories/.
 */
export type { SourceDocumentCommandPort } from "./SourceDocumentPort";
export type { ParsedDocumentPort } from "./ParsedDocumentPort";
export type {
SourcePipelinePort,
ParseSourceDocumentInput,
ParseSourceDocumentOutput,
ReindexSourceDocumentInput,
ReindexSourceDocumentOutput,
} from "./SourcePipelinePort";
export type { RagDocumentRepository } from "../repositories/RagDocumentRepository";
export type { SourceFileRepository } from "../repositories/SourceFileRepository";
export type { WikiLibraryRepository } from "../repositories/WikiLibraryRepository";
export type { SourceStoragePort, SourceStorageUploadOptions } from "./SourceStoragePort";
export type { SourceDocumentWatchPort, WatchedDocument } from "./SourceDocumentWatchPort";
