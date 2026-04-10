/**
 * @module workspace-flow/application/dto
 * @file remove-invoice-item.dto.ts
 * @description Command DTO for removing an item from an invoice.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface RemoveInvoiceItemDto {
  readonly invoiceId: string;
  readonly invoiceItemId: string;
}
 
