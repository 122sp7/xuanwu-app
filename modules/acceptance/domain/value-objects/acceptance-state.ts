/**
 * Module: acceptance
 * Layer: domain/value-object
 * Purpose: AcceptanceRecord lifecycle status and pure transition helpers.
 *
 * Status flow:
 *   pending → reviewing → accepted
 *                       → rejected → reviewing (re-review after issue fix)
 *
 * Invariant: "accepted" is a terminal state; further changes require a new record.
 */

export type AcceptanceLifecycleStatus = "pending" | "reviewing" | "accepted" | "rejected";

export const ACCEPTANCE_STATUSES = [
  "pending",
  "reviewing",
  "accepted",
  "rejected",
] as const satisfies readonly AcceptanceLifecycleStatus[];

const ACCEPTANCE_TRANSITIONS: Readonly<
  Record<AcceptanceLifecycleStatus, readonly AcceptanceLifecycleStatus[]>
> = {
  pending: ["reviewing"],
  reviewing: ["accepted", "rejected"],
  accepted: [],             // terminal — client has signed off
  rejected: ["reviewing"],  // re-enters review after issue resolution
};

export function canTransitionAcceptance(
  from: AcceptanceLifecycleStatus,
  to: AcceptanceLifecycleStatus,
): boolean {
  return ACCEPTANCE_TRANSITIONS[from].includes(to);
}

export function isTerminalAcceptanceStatus(status: AcceptanceLifecycleStatus): boolean {
  return ACCEPTANCE_TRANSITIONS[status].length === 0;
}
