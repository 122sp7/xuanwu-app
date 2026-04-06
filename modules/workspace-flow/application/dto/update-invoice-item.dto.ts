/**
 * @module workspace-flow/application/dto
 * @file update-invoice-item.dto.ts
 * @description Command DTO for updating the amount of an existing invoice item.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface UpdateInvoiceItemDto {
  /** Updated billing amount (must be > 0). */
  readonly amount: number;
}
