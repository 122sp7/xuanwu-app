/**
 * Public API boundary for the evaluation subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Migration Target (from ai subdomain)
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  FeedbackRating,
  QualityFeedback,
  SubmitFeedbackInput,
} from "../domain/entities/QualityFeedback";

// ── Port contracts ────────────────────────────────────────────────────────────
export type {
  IFeedbackPort,
} from "../domain/ports/IFeedbackPort";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  FeedbackSubmittedEvent,
} from "../domain/events/EvaluationEvents";
