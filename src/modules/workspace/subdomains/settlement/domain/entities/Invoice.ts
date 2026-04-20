import { v4 as uuid } from "uuid";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import { canTransitionInvoiceStatus } from "../value-objects/InvoiceStatus";
import type { InvoiceDomainEventType } from "../events/InvoiceDomainEvent";
import type { LineItem } from "../value-objects/LineItem";
import { InvoiceCalculationService } from "../services/InvoiceCalculationService";

export interface InvoiceSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly taskIds: ReadonlyArray<string>;
  readonly status: InvoiceStatus;
  readonly lineItems: ReadonlyArray<LineItem>;
  readonly currency: string;
  readonly subtotal: number;
  readonly taxRate: number;
  readonly taxAmount: number;
  readonly totalAmount: number;
  readonly submittedAtISO: string | null;
  readonly approvedAtISO: string | null;
  readonly paidAtISO: string | null;
  readonly closedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateInvoiceInput {
  readonly workspaceId: string;
  readonly taskIds?: ReadonlyArray<string>;
}

export interface CreateInvoiceFromAcceptedTasksInput {
  readonly workspaceId: string;
  readonly taskIds: ReadonlyArray<string>;
}

export class Invoice {
  private readonly _domainEvents: InvoiceDomainEventType[] = [];

  private constructor(private _props: InvoiceSnapshot) {}

  static create(id: string, input: CreateInvoiceInput): Invoice {
    const now = new Date().toISOString();
    const invoice = new Invoice({
      id,
      workspaceId: input.workspaceId,
      taskIds: input.taskIds ?? [],
      status: "draft",
      lineItems: [],
      currency: "TWD",
      subtotal: 0,
      taxRate: 0.05,
      taxAmount: 0,
      totalAmount: 0,
      submittedAtISO: null,
      approvedAtISO: null,
      paidAtISO: null,
      closedAtISO: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    invoice._domainEvents.push({
      type: "workspace.settlement.invoice-created",
      eventId: uuid(),
      occurredAt: now,
      payload: { invoiceId: id, workspaceId: input.workspaceId },
    });
    return invoice;
  }

  static reconstitute(snapshot: InvoiceSnapshot): Invoice {
    return new Invoice({ ...snapshot });
  }

  transition(to: InvoiceStatus): void {
    if (!canTransitionInvoiceStatus(this._props.status, to)) {
      throw new Error(`Cannot transition invoice from '${this._props.status}' to '${to}'.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: to,
      submittedAtISO: to === "submitted" ? now : this._props.submittedAtISO,
      approvedAtISO: to === "approved" ? now : this._props.approvedAtISO,
      paidAtISO: to === "paid" ? now : this._props.paidAtISO,
      closedAtISO: to === "closed" ? now : this._props.closedAtISO,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "workspace.settlement.invoice-status-changed",
      eventId: uuid(),
      occurredAt: now,
      payload: { invoiceId: this._props.id, workspaceId: this._props.workspaceId, to },
    });
  }

  setLineItems(items: ReadonlyArray<LineItem>): void {
    const { subtotal, taxAmount, totalAmount } = InvoiceCalculationService.fromLineItems(
      items,
      this._props.taxRate,
    );
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      lineItems: [...items],
      subtotal,
      taxAmount,
      totalAmount,
      updatedAtISO: now,
    };
  }

  get id(): string { return this._props.id; }
  get status(): InvoiceStatus { return this._props.status; }

  getSnapshot(): Readonly<InvoiceSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): InvoiceDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
