/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceItemRepository.ts
 * @description Firebase Firestore repository for InvoiceItem CRUD operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import { WF_INVOICE_ITEMS_COLLECTION } from "../firebase/workspace-flow.collections";

export class FirebaseInvoiceItemRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private get collectionRef() {
    return collection(this.db, WF_INVOICE_ITEMS_COLLECTION);
  }

  async findById(itemId: string): Promise<InvoiceItem | null> {
    const snap = await getDoc(doc(this.db, WF_INVOICE_ITEMS_COLLECTION, itemId));
    if (!snap.exists()) return null;
    return toInvoiceItem(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    const snaps = await getDocs(
      query(this.collectionRef, where("invoiceId", "==", invoiceId)),
    );
    return snaps.docs.map((d) => toInvoiceItem(d.id, d.data() as Record<string, unknown>));
  }

  async delete(itemId: string): Promise<void> {
    await deleteDoc(doc(this.db, WF_INVOICE_ITEMS_COLLECTION, itemId));
  }
}
