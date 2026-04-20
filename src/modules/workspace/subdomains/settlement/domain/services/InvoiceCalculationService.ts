/**
 * InvoiceCalculationService — pure domain service.
 *
 * No framework or I/O dependencies. Computes invoice totals from a list of
 * LineItems and builds LineItem value objects from task data.
 *
 * taxRate defaults to Taiwan's standard VAT of 5%.
 */
import type { LineItem } from "../value-objects/LineItem";

export interface InvoiceTotals {
  readonly subtotal: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
}

export class InvoiceCalculationService {
  static fromLineItems(
    lineItems: ReadonlyArray<LineItem>,
    taxRate = 0.05,
  ): InvoiceTotals {
    const subtotal = lineItems.reduce((sum, li) => sum + li.netAmount, 0);
    const taxAmount = Math.round(subtotal * taxRate);
    return { subtotal, taxAmount, totalAmount: subtotal + taxAmount };
  }

  static buildLineItem(
    taskId: string,
    description: string,
    unitPrice: number,
    quantity: number,
  ): LineItem {
    return {
      taskId,
      description,
      unitPrice,
      quantity,
      netAmount: unitPrice * quantity,
    };
  }
}
