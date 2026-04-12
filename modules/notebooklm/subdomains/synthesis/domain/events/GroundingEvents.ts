/**
 * Module: notebooklm/subdomains/grounding
 * Layer: domain/events
 * Purpose: Domain events for grounding operations.
 */

import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";

export interface GroundingCompletedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.grounding.completed";
  readonly payload: {
    readonly traceId: string;
    readonly citationCount: number;
    readonly chunksConsidered: number;
  };
}
