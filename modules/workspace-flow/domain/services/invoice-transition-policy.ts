/**
 * @module workspace-flow/domain/services
 * @file invoice-transition-policy.ts
 * @description Pure domain service encapsulating allowed Invoice status transitions.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Expand with additional guard conditions as billing rules evolve
 */

import { canTransitionInvoiceStatus, type InvoiceStatus } from "../value-objects/InvoiceStatus";

export type InvoiceTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Evaluates whether an invoice lifecycle transition is permitted.
 *
 * @param from - Current invoice status
 * @param to   - Requested next status
 * @returns InvoiceTransitionResult indicating whether the transition is allowed
 */
export function evaluateInvoiceTransition(
  from: InvoiceStatus,
  to: InvoiceStatus,
): InvoiceTransitionResult {
  if (!canTransitionInvoiceStatus(from, to)) {
    return {
      allowed: false,
      reason: `Invoice transition from "${from}" to "${to}" is not permitted.`,
    };
  }
  return { allowed: true };
}
