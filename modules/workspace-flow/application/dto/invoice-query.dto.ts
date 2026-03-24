/**
 * @module workspace-flow/application/dto
 * @file invoice-query.dto.ts
 * @description Query parameters DTO for listing invoices.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add pagination support when invoice lists grow large
 */

export interface InvoiceQueryDto {
  /** Filter invoices by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
}
