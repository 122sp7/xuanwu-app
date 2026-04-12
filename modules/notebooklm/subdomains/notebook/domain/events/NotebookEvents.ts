/**
 * Module: notebooklm/subdomains/notebook
 * Layer: domain/events
 * Purpose: Domain events for notebook AI generation operations.
 */

import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";

export interface NotebookResponseGeneratedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.notebook.response_generated";
  readonly payload: {
    readonly model: string;
    readonly finishReason?: string;
  };
}

export interface NotebookResponseFailedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.notebook.response_failed";
  readonly payload: {
    readonly errorCode: string;
    readonly errorMessage: string;
  };
}
