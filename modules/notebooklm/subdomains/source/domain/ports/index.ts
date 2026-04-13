/**
 * notebooklm/source domain/ports — driven port interfaces for the source subdomain.
 *
 * ISourceDocumentCommandPort and IParsedDocumentPort are the primary driven ports.
 * IRagDocumentPort, ISourceFilePort, IWikiLibraryPort re-export the legacy
 * repository contracts, making the Ports layer explicitly visible.
 */
export type { ISourceDocumentCommandPort } from "./ISourceDocumentPort";
export type { IParsedDocumentPort } from "./IParsedDocumentPort";
export type {
	ISourcePipelinePort,
	ParseSourceDocumentInput,
	ParseSourceDocumentOutput,
	ReindexSourceDocumentInput,
	ReindexSourceDocumentOutput,
} from "./ISourcePipelinePort";
export type { RagDocumentRepository as IRagDocumentPort } from "../repositories/RagDocumentRepository";
export type { SourceFileRepository as ISourceFilePort } from "../repositories/SourceFileRepository";
export type { WikiLibraryRepository as IWikiLibraryPort } from "../repositories/WikiLibraryRepository";
export type { ISourceStoragePort, SourceStorageUploadOptions } from "./ISourceStoragePort";
export type { ISourceDocumentWatchPort, WatchedDocument } from "./ISourceDocumentWatchPort";
