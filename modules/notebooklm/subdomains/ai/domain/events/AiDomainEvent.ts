import type { RagFeedbackRating } from "../entities/rag-feedback.entities";
import type { OrganizationScope } from "../value-objects/OrganizationScope";
import type { TopK } from "../value-objects/TopK";

export interface AiDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface RagQuerySubmittedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.query_submitted";
  readonly payload: {
    readonly traceId: string;
    readonly organizationId: string;
    readonly workspaceId?: string;
    readonly userQuery: string;
    readonly topK: TopK;
  };
}

export interface RagRetrievalCompletedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.retrieval_completed";
  readonly payload: {
    readonly traceId: string;
    readonly chunkCount: number;
    readonly scope: OrganizationScope;
  };
}

export interface RagAnswerGeneratedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.answer_generated";
  readonly payload: {
    readonly traceId: string;
    readonly model: string;
    readonly citationCount: number;
  };
}

export interface RagFeedbackSubmittedEvent extends AiDomainEvent {
  readonly type: "notebooklm.ai.feedback_submitted";
  readonly payload: {
    readonly traceId: string;
    readonly rating: RagFeedbackRating;
    readonly organizationId: string;
  };
}

export type AiDomainEventType =
  | RagQuerySubmittedEvent
  | RagRetrievalCompletedEvent
  | RagAnswerGeneratedEvent
  | RagFeedbackSubmittedEvent;
