/**
 * Module: acceptance
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Acceptance domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type {
  AcceptanceGate,
  AcceptanceGateStatus,
  WorkspaceAcceptanceSummary,
} from "../domain/entities/AcceptanceGate";

export type {
  AcceptanceRecord,
  AcceptanceStatus,
  AcceptanceLineItem,
  AcceptanceLineItemStatus,
} from "../domain/entities/AcceptanceRecord";

// ─── Lifecycle state machine ──────────────────────────────────────────────────

export type { AcceptanceLifecycleStatus } from "../domain/value-objects/acceptance-state";

export {
  ACCEPTANCE_STATUSES,
  canTransitionAcceptance,
  isTerminalAcceptanceStatus,
} from "../domain/value-objects/acceptance-state";

// ─── Domain events (cross-domain) ────────────────────────────────────────────

export type {
  AcceptanceDomainEvent,
  AcceptanceRecordCreatedEvent,
  AcceptanceStatusChangedEvent,
  AcceptanceSignedEvent,
  AcceptanceRejectedEvent,
} from "../domain/events/acceptance.events";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getWorkspaceAcceptanceSummary } from "../interfaces/queries/acceptance.queries";
export { getAcceptanceRecords } from "../interfaces/queries/acceptance-record.queries";
