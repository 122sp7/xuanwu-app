/**
 * SafetyCheckResult — domain value object for AI output safety evaluation.
 *
 * Owned by ai/safety subdomain.
 * ContentSafetyPort is the primary outbound port; all AI generation paths must
 * pass output through a safety check before returning to callers.
 */

export type SafetyVerdict = "safe" | "blocked" | "flagged";

export interface SafetyCategory {
  /** e.g. "hate_speech", "self_harm", "violence", "sexual" */
  readonly name: string;
  readonly score: number;
  readonly verdict: SafetyVerdict;
}

export interface SafetyCheckResult {
  readonly id: string;
  readonly inputHash: string;
  readonly overallVerdict: SafetyVerdict;
  readonly categories: readonly SafetyCategory[];
  readonly reason?: string;
  readonly checkedAtISO: string;
  readonly model?: string;
}

export interface ContentSafetyInput {
  readonly content: string;
  readonly context?: string;
  readonly model?: string;
}

/** Outbound port — implemented in infrastructure layer. */
export interface ContentSafetyPort {
  check(input: ContentSafetyInput): Promise<SafetyCheckResult>;
}
