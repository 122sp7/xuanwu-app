/**
 * Module: notebooklm/subdomains/evaluation
 * Layer: domain/events
 * Purpose: Domain events for evaluation/feedback operations.
 */

import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";
import type { FeedbackRating } from "../entities/QualityFeedback";

export interface FeedbackSubmittedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.evaluation.feedback_submitted";
  readonly payload: {
    readonly feedbackId: string;
    readonly traceId: string;
    readonly rating: FeedbackRating;
    readonly organizationId: string;
  };
}
