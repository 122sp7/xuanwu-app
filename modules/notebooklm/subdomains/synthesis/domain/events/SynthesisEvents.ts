/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/events
 * Purpose: Domain events for synthesis operations.
 */

import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";

export interface SynthesisCompletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.synthesis.completed";
  readonly payload: {
    readonly traceId: string;
    readonly model: string;
    readonly citationCount: number;
    readonly answerLengthChars: number;
  };
}

export interface SynthesisFailedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.synthesis.failed";
  readonly payload: {
    readonly traceId: string;
    readonly errorCode: string;
    readonly errorMessage: string;
  };
}
