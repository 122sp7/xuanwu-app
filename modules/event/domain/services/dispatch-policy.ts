/**
 * Module: event
 * Layer: domain/service
 * Purpose: Pure dispatch-policy rules — determines retry eligibility and outbox strategy
 *          without any infrastructure or SDK dependency.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */

export interface DispatchAttempt {
  attemptCount: number
  lastAttemptAt: Date | null
}

export interface DispatchPolicy {
  maxRetries: number
  baseDelayMs: number
}

/**
 * Returns true when an event should be retried according to the given policy.
 * Pure function — no side effects, no external dependencies.
 */
export function shouldRetry(attempt: DispatchAttempt, policy: DispatchPolicy): boolean {
  return attempt.attemptCount < policy.maxRetries
}

/**
 * Computes the next retry delay in milliseconds using exponential back-off.
 * Pure function — no side effects, no external dependencies.
 */
export function nextRetryDelayMs(attempt: DispatchAttempt, policy: DispatchPolicy): number {
  return policy.baseDelayMs * Math.pow(2, attempt.attemptCount)
}
