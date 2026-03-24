/**
 * Module: billing
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Billing domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type {
  BillingRecord,
  BillingRecordListScope,
  BillingStatus,
} from "../domain/entities/BillingRecord";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getOrganizationBillingRecords } from "../interfaces/queries/billing.queries";
