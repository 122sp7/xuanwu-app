/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceRepository.ts
 * @description Firebase Firestore implementation of InvoiceRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Invoice, CreateInvoiceInput } from "../../domain/entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../../domain/entities/InvoiceItem";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toInvoice } from "../firebase/invoice.converter";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import {
  WF_INVOICES_COLLECTION,
  WF_INVOICE_ITEMS_COLLECTION,
} from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<InvoiceStatus>(INVOICE_STATUSES);
const DEFAULT_STATUS: InvoiceStatus = "draft";

export class FirebaseInvoiceRepository implements InvoiceRepository {
  private invoicePath(invoiceId: string): string {
    return `${WF_INVOICES_COLLECTION}/${invoiceId}`;
  }

  private itemPath(itemId: string): string {
    return `${WF_INVOICE_ITEMS_COLLECTION}/${itemId}`;
  }

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const nowISO = new Date().toISOString();
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      submittedAtISO: null,
      approvedAtISO: null,
      paidAtISO: null,
      closedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
    if (input.sourceReference) {
      docData.sourceReference = { ...input.sourceReference };
    }

    const id = generateId();
    await firestoreInfrastructureApi.set(this.invoicePath(id), docData);

    return {
      id,
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      sourceReference: input.sourceReference,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async delete(invoiceId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.invoicePath(invoiceId));
  }

  async findById(invoiceId: string): Promise<Invoice | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.invoicePath(invoiceId));
    if (!data) return null;
    return toInvoice(invoiceId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Invoice[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICES_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    const invoices = docs.map((d) => toInvoice(d.id, d.data));
    return invoices.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }

  async transitionStatus(
    invoiceId: string,
    to: InvoiceStatus,
    nowISO: string,
  ): Promise<Invoice | null> {
    const path = this.invoicePath(invoiceId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "submitted") patch.submittedAtISO = nowISO;
    if (validTo === "approved") patch.approvedAtISO = nowISO;
    if (validTo === "paid") patch.paidAtISO = nowISO;
    if (validTo === "closed") patch.closedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toInvoice(invoiceId, updated);
  }

  async addItem(input: AddInvoiceItemInput): Promise<InvoiceItem> {
    const nowISO = new Date().toISOString();
    const itemId = generateId();
    await firestoreInfrastructureApi.set(this.itemPath(itemId), {
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    // Update invoice totalAmount
    const invoicePath = this.invoicePath(input.invoiceId);
    const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
    if (invoice) {
      const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
      await firestoreInfrastructureApi.update(invoicePath, {
        totalAmount: totalAmount + input.amount,
        updatedAtISO: nowISO,
      });
    }

    return {
      id: itemId,
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async findItemById(invoiceItemId: string): Promise<InvoiceItem | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.itemPath(invoiceItemId));
    if (!data) return null;
    return toInvoiceItem(invoiceItemId, data);
  }

  async updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null> {
    const itemPath = this.itemPath(invoiceItemId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!data) return null;

    const oldAmount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";
    const nowISO = new Date().toISOString();

    await firestoreInfrastructureApi.update(itemPath, { amount, updatedAtISO: nowISO });

    if (invoiceId) {
      const invoicePath = this.invoicePath(invoiceId);
      const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
      if (invoice) {
        const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
        await firestoreInfrastructureApi.update(invoicePath, {
          totalAmount: totalAmount + (amount - oldAmount),
          updatedAtISO: nowISO,
        });
      }
    }

    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!updated) return null;
    return toInvoiceItem(invoiceItemId, updated);
  }

  async removeItem(invoiceItemId: string): Promise<void> {
    const itemPath = this.itemPath(invoiceItemId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(itemPath);
    if (!data) return;

    const amount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";

    await firestoreInfrastructureApi.delete(itemPath);

    if (invoiceId) {
      const invoicePath = this.invoicePath(invoiceId);
      const invoice = await firestoreInfrastructureApi.get<Record<string, unknown>>(invoicePath);
      if (invoice) {
        const totalAmount = typeof invoice.totalAmount === "number" ? invoice.totalAmount : 0;
        await firestoreInfrastructureApi.update(invoicePath, {
          totalAmount: totalAmount - amount,
          updatedAtISO: new Date().toISOString(),
        });
      }
    }
  }

  async listItems(invoiceId: string): Promise<InvoiceItem[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICE_ITEMS_COLLECTION,
      [{ field: "invoiceId", op: "==", value: invoiceId }],
    );
    return docs.map((d) => toInvoiceItem(d.id, d.data));
  }
}
 
