/**
 * @module workspace-flow/domain/entities
 * @file Invoice.ts
 * @description Invoice aggregate entity representing a billing record for accepted tasks.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */

import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import type { SourceReference } from "../value-objects/SourceReference";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Invoice {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: InvoiceStatus;
  readonly totalAmount: number;
  readonly submittedAtISO?: string;
  readonly approvedAtISO?: string;
  readonly paidAtISO?: string;
  readonly closedAtISO?: string;
  /**
   * Present when this Invoice was materialized from a KnowledgePage via the
   * `content.page_approved` event.  Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateInvoiceInput {
  readonly workspaceId: string;
  readonly sourceReference?: SourceReference;
}
