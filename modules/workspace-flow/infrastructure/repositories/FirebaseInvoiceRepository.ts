/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceRepository.ts
 * @description Firebase Firestore implementation of InvoiceRepository for workspace-flow.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
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
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private get invoiceCollectionRef() {
    return collection(this.db, WF_INVOICES_COLLECTION);
  }

  private get itemCollectionRef() {
    return collection(this.db, WF_INVOICE_ITEMS_COLLECTION);
  }

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const nowISO = new Date().toISOString();
    const docRef = await addDoc(this.invoiceCollectionRef, {
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      submittedAtISO: null,
      approvedAtISO: null,
      paidAtISO: null,
      closedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      totalAmount: 0,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async delete(invoiceId: string): Promise<void> {
    await deleteDoc(doc(this.db, WF_INVOICES_COLLECTION, invoiceId));
  }

  async findById(invoiceId: string): Promise<Invoice | null> {
    const snap = await getDoc(doc(this.db, WF_INVOICES_COLLECTION, invoiceId));
    if (!snap.exists()) return null;
    return toInvoice(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Invoice[]> {
    const snaps = await getDocs(
      query(
        this.invoiceCollectionRef,
        where("workspaceId", "==", workspaceId),
      ),
    );
    const invoices = snaps.docs.map((d) => toInvoice(d.id, d.data() as Record<string, unknown>));
    return invoices.sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
  }

  async transitionStatus(
    invoiceId: string,
    to: InvoiceStatus,
    nowISO: string,
  ): Promise<Invoice | null> {
    const invoiceRef = doc(this.db, WF_INVOICES_COLLECTION, invoiceId);
    const snap = await getDoc(invoiceRef);
    if (!snap.exists()) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    };
    if (validTo === "submitted") patch.submittedAtISO = nowISO;
    if (validTo === "approved") patch.approvedAtISO = nowISO;
    if (validTo === "paid") patch.paidAtISO = nowISO;
    if (validTo === "closed") patch.closedAtISO = nowISO;

    await updateDoc(invoiceRef, patch);
    const updated = await getDoc(invoiceRef);
    if (!updated.exists()) return null;
    return toInvoice(updated.id, updated.data() as Record<string, unknown>);
  }

  async addItem(input: AddInvoiceItemInput): Promise<InvoiceItem> {
    const nowISO = new Date().toISOString();
    const docRef = await addDoc(this.itemCollectionRef, {
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update invoice totalAmount
    await updateDoc(doc(this.db, WF_INVOICES_COLLECTION, input.invoiceId), {
      totalAmount: increment(input.amount),
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      invoiceId: input.invoiceId,
      taskId: input.taskId,
      amount: input.amount,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async findItemById(invoiceItemId: string): Promise<InvoiceItem | null> {
    const snap = await getDoc(doc(this.db, WF_INVOICE_ITEMS_COLLECTION, invoiceItemId));
    if (!snap.exists()) return null;
    return toInvoiceItem(snap.id, snap.data() as Record<string, unknown>);
  }

  async updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null> {
    const itemRef = doc(this.db, WF_INVOICE_ITEMS_COLLECTION, invoiceItemId);
    const snap = await getDoc(itemRef);
    if (!snap.exists()) return null;

    const data = snap.data() as Record<string, unknown>;
    const oldAmount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";
    const nowISO = new Date().toISOString();

    await updateDoc(itemRef, { amount, updatedAtISO: nowISO, updatedAt: serverTimestamp() });

    if (invoiceId) {
      await updateDoc(doc(this.db, WF_INVOICES_COLLECTION, invoiceId), {
        totalAmount: increment(amount - oldAmount),
        updatedAtISO: nowISO,
        updatedAt: serverTimestamp(),
      });
    }

    const updated = await getDoc(itemRef);
    if (!updated.exists()) return null;
    return toInvoiceItem(updated.id, updated.data() as Record<string, unknown>);
  }

  async removeItem(invoiceItemId: string): Promise<void> {
    const itemRef = doc(this.db, WF_INVOICE_ITEMS_COLLECTION, invoiceItemId);
    const snap = await getDoc(itemRef);
    if (!snap.exists()) return;

    const data = snap.data() as Record<string, unknown>;
    const amount = typeof data.amount === "number" ? data.amount : 0;
    const invoiceId = typeof data.invoiceId === "string" ? data.invoiceId : "";

    await deleteDoc(itemRef);

    if (invoiceId) {
      await updateDoc(doc(this.db, WF_INVOICES_COLLECTION, invoiceId), {
        totalAmount: increment(-amount),
        updatedAtISO: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
    }
  }

  async listItems(invoiceId: string): Promise<InvoiceItem[]> {
    const snaps = await getDocs(
      query(this.itemCollectionRef, where("invoiceId", "==", invoiceId)),
    );
    return snaps.docs.map((d) => toInvoiceItem(d.id, d.data() as Record<string, unknown>));
  }
}
