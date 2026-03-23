import {
  addDoc,
  collection,
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
import type { AcceptanceRecord, CreateAcceptanceRecordInput } from "../../domain/entities/AcceptanceRecord";
import type { AcceptanceLifecycleStatus } from "../../domain/value-objects/acceptance-state";
import { ACCEPTANCE_STATUSES } from "../../domain/value-objects/acceptance-state";

const VALID_STATUSES = new Set<AcceptanceLifecycleStatus>(ACCEPTANCE_STATUSES);
const DEFAULT_STATUS: AcceptanceLifecycleStatus = "pending";

function toRecord(id: string, data: Record<string, unknown>): AcceptanceRecord {
  const rawStatus = data.status as AcceptanceLifecycleStatus;
  return {
    id,
    tenantId: typeof data.tenantId === "string" ? data.tenantId : "",
    teamId: typeof data.teamId === "string" ? data.teamId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    items: Array.isArray(data.items) ? (data.items as AcceptanceRecord["items"]) : [],
    reviewedBy: typeof data.reviewedBy === "string" ? data.reviewedBy : undefined,
    reviewedAtISO: typeof data.reviewedAtISO === "string" ? data.reviewedAtISO : undefined,
    signedBy: typeof data.signedBy === "string" ? data.signedBy : undefined,
    signedAtISO: typeof data.signedAtISO === "string" ? data.signedAtISO : undefined,
    rejectionReason: typeof data.rejectionReason === "string" ? data.rejectionReason : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseAcceptanceRecordRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, "workspaceAcceptanceRecords");
  }

  async create(input: CreateAcceptanceRecordInput): Promise<AcceptanceRecord> {
    const nowIso = new Date().toISOString();
    const items = input.items.map((item, i) => ({
      id: `item-${i}`,
      description: item.description,
      status: "pending" as const,
    }));

    const docRef = await addDoc(this.collectionRef, {
      tenantId: input.tenantId,
      teamId: input.teamId,
      workspaceId: input.workspaceId,
      taskId: input.taskId,
      status: DEFAULT_STATUS,
      items,
      reviewedBy: null,
      reviewedAtISO: null,
      signedBy: null,
      signedAtISO: null,
      rejectionReason: null,
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
      taskId: input.taskId,
      status: DEFAULT_STATUS,
      items,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async findById(recordId: string): Promise<AcceptanceRecord | null> {
    const snap = await getDoc(doc(this.db, "workspaceAcceptanceRecords", recordId));
    if (!snap.exists()) return null;
    return toRecord(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<AcceptanceRecord[]> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        orderBy("createdAtISO", "desc"),
      ),
    );
    return snaps.docs.map((d) => toRecord(d.id, d.data() as Record<string, unknown>));
  }

  async transitionStatus(
    recordId: string,
    to: AcceptanceLifecycleStatus,
    nowISO: string,
    extra?: { reviewedBy?: string; signedBy?: string; rejectionReason?: string },
  ): Promise<AcceptanceRecord | null> {
    const ref = doc(this.db, "workspaceAcceptanceRecords", recordId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const patch: Record<string, unknown> = {
      status: to,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    };
    if (to === "reviewing" && extra?.reviewedBy) {
      patch.reviewedBy = extra.reviewedBy;
      patch.reviewedAtISO = nowISO;
    }
    if (to === "accepted" && extra?.signedBy) {
      patch.signedBy = extra.signedBy;
      patch.signedAtISO = nowISO;
    }
    if (to === "rejected" && extra?.rejectionReason) {
      patch.rejectionReason = extra.rejectionReason;
    }

    await updateDoc(ref, patch);
    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toRecord(updated.id, updated.data() as Record<string, unknown>);
  }
}
