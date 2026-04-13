/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/events
 * Purpose: Domain events for source document lifecycle operations.
 */

import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";

export interface SourceFileUploadedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.file-uploaded";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly accountId: string;
    readonly mimeType: string;
    readonly sizeBytes: number;
  };
}

export interface SourceDocumentProcessedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.document-processed";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly chunkCount: number;
  };
}

export interface SourceDocumentDeletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.document-deleted";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly accountId: string;
  };
}

export interface SourceDocumentRenamedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.source.document-renamed";
  readonly payload: {
    readonly fileId: string;
    readonly organizationId: string;
    readonly previousName: string;
    readonly newName: string;
  };
}
