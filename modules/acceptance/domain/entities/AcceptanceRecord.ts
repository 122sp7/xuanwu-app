/**
 * Module: acceptance
 * Layer: domain/entity
 * Purpose: Formal Acceptance aggregate — the client sign-off record.
 *
 * Design rationale:
 *   AcceptanceGate (existing) answers "is the workspace ready for acceptance?"
 *   AcceptanceRecord (this file) answers "has the client formally accepted this task?"
 *
 *   These are distinct concerns.  A workspace can pass all gates but still have
 *   a pending client signature.  The Acceptance aggregate captures the formal
 *   sign-off lifecycle.
 *
 * Flow:
 *   pending → reviewing → accepted | rejected
 *   rejected → reviewing  (client may re-review after issue is resolved)
 *
 * An Issue is raised (via IssueDomainEvent) when acceptance is rejected.
 * Task status does NOT move backward — regression is handled through Issue domain.
 */

import type { AcceptanceLifecycleStatus } from "../value-objects/acceptance-state";

/**
 * Convenience alias — `AcceptanceLifecycleStatus` is the canonical type in value-objects.
 * `AcceptanceStatus` is kept as a short alias for UI/DTO consumers.
 * Import `AcceptanceLifecycleStatus` directly from value-objects for state-machine logic.
 */
export type AcceptanceStatus = AcceptanceLifecycleStatus;

// ── AcceptanceRecord aggregate ────────────────────────────────────────────────

export interface AcceptanceRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  /** The Task being formally accepted. */
  readonly taskId: string;
  readonly status: AcceptanceLifecycleStatus;
  readonly items: readonly AcceptanceLineItem[];
  /** Reviewer / client identifier. */
  readonly reviewedBy?: string;
  readonly reviewedAtISO?: string;
  /** Signer identifier for final client sign-off. */
  readonly signedBy?: string;
  readonly signedAtISO?: string;
  /** Rejection reason if status === "rejected". */
  readonly rejectionReason?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── AcceptanceLineItem (value object embedded in record) ──────────────────────

export type AcceptanceLineItemStatus = "pending" | "accepted" | "rejected";

export interface AcceptanceLineItem {
  readonly id: string;
  readonly description: string;
  readonly status: AcceptanceLineItemStatus;
  readonly comment?: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateAcceptanceRecordInput {
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly taskId: string;
  readonly items: readonly Pick<AcceptanceLineItem, "description">[];
}
