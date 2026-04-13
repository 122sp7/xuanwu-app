/**
 * notebooklm/source domain/ports — driven port interfaces for the source subdomain.
 *
 * SourceDocumentCommandPort and ParsedDocumentPort are the primary driven ports.
 * IRagDocumentPort, ISourceFilePort, IWikiLibraryPort re-export the legacy
 * repository contracts, making the Ports layer explicitly visible.
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
export type { RagDocumentRepository as IRagDocumentPort } from "../repositories/RagDocumentRepository";
export type { SourceFileRepository as ISourceFilePort } from "../repositories/SourceFileRepository";
export type { WikiLibraryRepository as IWikiLibraryPort } from "../repositories/WikiLibraryRepository";
export type { SourceStoragePort, SourceStorageUploadOptions } from "./SourceStoragePort";
export type { SourceDocumentWatchPort, WatchedDocument } from "./SourceDocumentWatchPort";
