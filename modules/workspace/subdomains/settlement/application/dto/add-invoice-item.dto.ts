/**
 * @module workspace-flow/application/dto
 * @file add-invoice-item.dto.ts
 * @description Command DTO for adding an item to an invoice.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */

export interface AddInvoiceItemDto {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
 
