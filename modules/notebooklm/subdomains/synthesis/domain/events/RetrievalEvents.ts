/**
 * Module: notebooklm/subdomains/retrieval
 * Layer: domain/events
 * Purpose: Domain events for retrieval operations.
 */

import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";

export interface RetrievalCompletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.retrieval.completed";
  readonly payload: {
    readonly traceId: string;
    readonly chunkCount: number;
    readonly scope: "organization" | "workspace";
    readonly topK: number;
  };
}

export interface RetrievalFailedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.retrieval.failed";
  readonly payload: {
    readonly traceId: string;
    readonly errorCode: string;
    readonly errorMessage: string;
  };
}
