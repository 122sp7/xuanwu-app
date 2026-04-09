/**
 * @module workspace-flow/domain/services
 * @file invoice-guards.ts
 * @description Pure domain guards for invoice lifecycle invariants.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add guards for additional billing invariants as rules evolve
 */

// ── Guard: item count > 0 before submit ───────────────────────────────────────

/**
 * Asserts that an invoice has at least one item before allowing submission.
 *
 * @param itemCount - Number of items currently on the invoice
 * @returns true if the invoice may be submitted; false if it has no items
 */
export function invoiceHasItems(itemCount: number): boolean {
  return itemCount > 0;
}

// ── Guard: invoice is in draft before item mutation ───────────────────────────

/**
 * Asserts that an invoice is in draft status before allowing item add/remove.
 *
 * @param status - Current invoice status
 * @returns true if items may be mutated; false otherwise
 */
export function invoiceIsEditable(status: string): boolean {
  return status === "draft";
}
 
