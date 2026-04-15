/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceItemRepository.ts
 * @description Firebase Firestore repository for InvoiceItem CRUD operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import { WF_INVOICE_ITEMS_COLLECTION } from "../firebase/workspace-flow.collections";

export class FirebaseInvoiceItemRepository {
  private itemPath(itemId: string): string {
    return `${WF_INVOICE_ITEMS_COLLECTION}/${itemId}`;
  }

  async findById(itemId: string): Promise<InvoiceItem | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.itemPath(itemId));
    if (!data) return null;
    return toInvoiceItem(itemId, data);
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_INVOICE_ITEMS_COLLECTION,
      [{ field: "invoiceId", op: "==", value: invoiceId }],
    );
    return docs.map((d) => toInvoiceItem(d.id, d.data));
  }

  async delete(itemId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.itemPath(itemId));
  }
}
 
