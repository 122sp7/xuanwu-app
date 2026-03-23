/**
 * Module: acceptance
 * Layer: domain/event
 * Purpose: Domain events emitted by the Acceptance aggregate.
 *
 * Event flow:
 *   AcceptanceRecordCreated → AcceptanceReviewStarted
 *     → AcceptanceAccepted (triggers Finance: task eligible for invoicing)
 *     → AcceptanceRejected (triggers Issue creation)
 *       → AcceptanceReviewStarted (re-review)
 */

import type { AcceptanceLifecycleStatus } from "../value-objects/acceptance-state";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface AcceptanceRecordCreatedEvent {
  readonly type: "acceptance.record_created";
  readonly acceptanceId: string;
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface AcceptanceStatusChangedEvent {
  readonly type: "acceptance.status_changed";
  readonly acceptanceId: string;
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly from: AcceptanceLifecycleStatus;
  readonly to: AcceptanceLifecycleStatus;
  readonly occurredAtISO: string;
}

/** Emitted when client formally signs off — downstream Finance can now invoice. */
export interface AcceptanceSignedEvent {
  readonly type: "acceptance.signed";
  readonly acceptanceId: string;
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly signedBy: string;
  readonly signedAtISO: string;
  readonly occurredAtISO: string;
}

/** Emitted when acceptance is rejected — Issue domain should react. */
export interface AcceptanceRejectedEvent {
  readonly type: "acceptance.rejected";
  readonly acceptanceId: string;
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly rejectionReason: string;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type AcceptanceDomainEvent =
  | AcceptanceRecordCreatedEvent
  | AcceptanceStatusChangedEvent
  | AcceptanceSignedEvent
  | AcceptanceRejectedEvent;
