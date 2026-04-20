/**
 * LineItem — settlement subdomain value object.
 *
 * Represents one billable entry in an Invoice, derived from an accepted Task.
 * Immutable: netAmount = unitPrice × quantity.
 *
 * Intentionally minimal at this stage — no PO item numbers or penalty fields.
 */
export interface LineItem {
  readonly taskId: string;
  readonly description: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly netAmount: number;
}
