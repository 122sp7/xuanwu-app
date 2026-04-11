/**
 * notebooklm/source domain/ports — driven port interfaces for the source subdomain.
 *
 * ISourceDocumentCommandPort and IParsedDocumentPort are the primary driven ports.
 * IRagDocumentPort, ISourceFilePort, IWikiLibraryPort re-export the legacy
 * repository contracts, making the Ports layer explicitly visible.
 */
export type { ISourceDocumentCommandPort } from "./ISourceDocumentPort";
export type { IParsedDocumentPort } from "./IParsedDocumentPort";
export type { IRagDocumentRepository as IRagDocumentPort } from "../repositories/IRagDocumentRepository";
export type { ISourceFileRepository as ISourceFilePort } from "../repositories/ISourceFileRepository";
export type { IWikiLibraryRepository as IWikiLibraryPort } from "../repositories/IWikiLibraryRepository";
