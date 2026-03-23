/**
 * Module: finance
 * Layer: infrastructure/firebase
 * Purpose: FirebaseInvoiceRepository — persists Invoice aggregate to Firestore.
 *
 * Collection: workspaceInvoices
 * Replaces the old FirebaseFinanceRepository (claim/stage-based model).
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { Invoice, InvoiceStatus } from "../../domain/entities/Invoice";
import type { IInvoiceRepository, CreateInvoiceEntityInput } from "../../domain/repositories/FinanceRepository";
import { INVOICE_STATUSES } from "../../domain/value-objects/invoice-state";

const VALID_STATUSES = new Set<InvoiceStatus>(INVOICE_STATUSES);
const DEFAULT_STATUS: InvoiceStatus = "draft";

function toInvoice(id: string, data: Record<string, unknown>): Invoice {
  const rawStatus = data.status as InvoiceStatus;
  return {
    id,
    tenantId: typeof data.tenantId === "string" ? data.tenantId : "",
    teamId: typeof data.teamId === "string" ? data.teamId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    invoiceNumber: typeof data.invoiceNumber === "string" ? data.invoiceNumber : undefined,
    items: Array.isArray(data.items) ? (data.items as Invoice["items"]) : [],
    totalAmount: typeof data.totalAmount === "number" ? data.totalAmount : 0,
    currency: data.currency === "TWD" ? "TWD" : "USD",
    issuedAtISO: typeof data.issuedAtISO === "string" ? data.issuedAtISO : undefined,
    submittedAtISO: typeof data.submittedAtISO === "string" ? data.submittedAtISO : undefined,
    approvedAtISO: typeof data.approvedAtISO === "string" ? data.approvedAtISO : undefined,
    paidAtISO: typeof data.paidAtISO === "string" ? data.paidAtISO : undefined,
    closedAtISO: typeof data.closedAtISO === "string" ? data.closedAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseInvoiceRepository implements IInvoiceRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private get collectionRef() {
    return collection(this.db, "workspaceInvoices");
  }

  async create(input: CreateInvoiceEntityInput): Promise<Invoice> {
    const nowIso = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
      tenantId: input.tenantId,
      teamId: input.teamId,
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      invoiceNumber: input.invoiceNumber ?? null,
      items: [],
      totalAmount: 0,
      currency: input.currency,
      issuedAtISO: null,
      submittedAtISO: null,
      approvedAtISO: null,
      paidAtISO: null,
      closedAtISO: null,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      tenantId: input.tenantId,
      teamId: input.teamId,
      workspaceId: input.workspaceId,
      status: DEFAULT_STATUS,
      invoiceNumber: input.invoiceNumber,
      items: [],
      totalAmount: 0,
      currency: input.currency,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async findById(invoiceId: string): Promise<Invoice | null> {
    const snap = await getDoc(doc(this.db, "workspaceInvoices", invoiceId));
    if (!snap.exists()) return null;
    return toInvoice(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Invoice[]> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        orderBy("createdAtISO", "desc"),
      ),
    );
    return snaps.docs.map((d) => toInvoice(d.id, d.data() as Record<string, unknown>));
  }

  async transitionStatus(
    invoiceId: string,
    to: InvoiceStatus,
    nowISO: string,
  ): Promise<Invoice | null> {
    const invoiceRef = doc(this.db, "workspaceInvoices", invoiceId);
    const snap = await getDoc(invoiceRef);
    if (!snap.exists()) return null;

    const patch: Record<string, unknown> = {
      status: to,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    };
    if (to === "submitted") patch.submittedAtISO = nowISO;
    if (to === "approved") patch.approvedAtISO = nowISO;
    if (to === "paid") patch.paidAtISO = nowISO;
    if (to === "closed") patch.closedAtISO = nowISO;

    await updateDoc(invoiceRef, patch);
    const updated = await getDoc(invoiceRef);
    if (!updated.exists()) return null;
    return toInvoice(updated.id, updated.data() as Record<string, unknown>);
  }

  async delete(invoiceId: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaceInvoices", invoiceId));
  }
}

/** Export alias so existing module imports via infrastructure/index still work. */
export { FirebaseInvoiceRepository as FirebaseFinanceRepository };
