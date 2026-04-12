/**
 * Public API boundary for the synthesis subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Status: Tier 2 Migration Target (from ai subdomain)
 */

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  GenerationCitation,
  GenerateAnswerInput,
  GenerateAnswerOutput,
  GenerateAnswerResult,
} from "../domain/entities/SynthesisResult";

// ── Port contracts ────────────────────────────────────────────────────────────
export type {
  IGenerationPort,
} from "../domain/ports/IGenerationPort";

// ── Domain events ─────────────────────────────────────────────────────────────
export type {
  SynthesisCompletedEvent,
  SynthesisFailedEvent,
} from "../domain/events/SynthesisEvents";
