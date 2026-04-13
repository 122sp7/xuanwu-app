/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/events
 * Purpose: Pipeline-level domain events for the synthesis subdomain.
 *
 * Migrated from ai/domain/events/AiDomainEvent.ts.
 * Event discriminants updated: notebooklm.ai.* → notebooklm.synthesis.*
 */

import type { RagFeedbackRating } from "../entities/rag-feedback.entities";
import type { OrganizationScope } from "../value-objects/OrganizationScope";
import type { TopK } from "../value-objects/TopK";

export interface SynthesisPipelineDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface RagQuerySubmittedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.query-submitted";
  readonly payload: {
    readonly traceId: string;
    readonly organizationId: string;
    readonly workspaceId?: string;
    readonly userQuery: string;
    readonly topK: TopK;
  };
}

export interface RagRetrievalCompletedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.retrieval-completed";
  readonly payload: {
    readonly traceId: string;
    readonly chunkCount: number;
    readonly scope: OrganizationScope;
  };
}

export interface RagAnswerGeneratedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.answer-generated";
  readonly payload: {
    readonly traceId: string;
    readonly model: string;
    readonly citationCount: number;
  };
}

export interface RagFeedbackSubmittedEvent extends SynthesisPipelineDomainEvent {
  readonly type: "notebooklm.synthesis.feedback-submitted";
  readonly payload: {
    readonly traceId: string;
    readonly rating: RagFeedbackRating;
    readonly organizationId: string;
  };
}

export type SynthesisPipelineDomainEventType =
  | RagQuerySubmittedEvent
  | RagRetrievalCompletedEvent
  | RagAnswerGeneratedEvent
  | RagFeedbackSubmittedEvent;
