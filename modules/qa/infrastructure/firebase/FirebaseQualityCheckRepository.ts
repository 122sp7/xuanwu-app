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

import type {
  CreateWorkspaceQualityCheckInput,
  UpdateWorkspaceQualityCheckInput,
  WorkspaceQualityCheckEntity,
  WorkspaceQualityCheckStatus,
} from "../../domain/entities/QualityCheck";
import type { QualityCheckRepository } from "../../domain/repositories/QualityCheckRepository";

const VALID_STATUSES = new Set<WorkspaceQualityCheckStatus>(["pass", "warn", "fail"]);

const DEFAULT_QA_STATUS: WorkspaceQualityCheckStatus = "warn";
const DEFAULT_QA_SOURCE = "workspace";
const DEFAULT_QA_DETAIL = "";

function toQualityCheckEntity(id: string, data: Record<string, unknown>): WorkspaceQualityCheckEntity {
  const status = VALID_STATUSES.has(data.status as WorkspaceQualityCheckStatus)
    ? (data.status as WorkspaceQualityCheckStatus)
    : DEFAULT_QA_STATUS;

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    label: typeof data.label === "string" ? data.label : "",
    detail: typeof data.detail === "string" ? data.detail : DEFAULT_QA_DETAIL,
    status,
    source: typeof data.source === "string" ? data.source : DEFAULT_QA_SOURCE,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseQualityCheckRepository implements QualityCheckRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, "workspaceQualityChecks");
  }

  async create(input: CreateWorkspaceQualityCheckInput): Promise<WorkspaceQualityCheckEntity> {
    const nowIso = new Date().toISOString();
    const status = VALID_STATUSES.has(input.status ?? DEFAULT_QA_STATUS)
      ? (input.status ?? DEFAULT_QA_STATUS)
      : DEFAULT_QA_STATUS;

    const docRef = await addDoc(this.collectionRef, {
      workspaceId: input.workspaceId,
      label: input.label,
      detail: input.detail ?? DEFAULT_QA_DETAIL,
      status,
      source: input.source ?? DEFAULT_QA_SOURCE,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      workspaceId: input.workspaceId,
      label: input.label,
      detail: input.detail ?? DEFAULT_QA_DETAIL,
      status,
      source: input.source ?? DEFAULT_QA_SOURCE,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async update(
    qualityCheckId: string,
    input: UpdateWorkspaceQualityCheckInput,
  ): Promise<WorkspaceQualityCheckEntity | null> {
    const qualityCheckRef = doc(this.db, "workspaceQualityChecks", qualityCheckId);
    const existingQualityCheck = await getDoc(qualityCheckRef);
    if (!existingQualityCheck.exists()) {
      return null;
    }

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };

    if (typeof input.label === "string") {
      patch.label = input.label;
    }
    if (typeof input.detail === "string") {
      patch.detail = input.detail;
    }
    if (typeof input.source === "string") {
      patch.source = input.source;
    }
    if (typeof input.status === "string" && VALID_STATUSES.has(input.status)) {
      patch.status = input.status;
    }

    await updateDoc(qualityCheckRef, patch);

    const updatedQualityCheck = await getDoc(qualityCheckRef);
    if (!updatedQualityCheck.exists()) {
      return null;
    }

    return toQualityCheckEntity(
      updatedQualityCheck.id,
      updatedQualityCheck.data() as Record<string, unknown>,
    );
  }

  async delete(qualityCheckId: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaceQualityChecks", qualityCheckId));
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceQualityCheckEntity[]> {
    const snaps = await getDocs(
      query(this.collectionRef, where("workspaceId", "==", workspaceId), orderBy("updatedAtISO", "desc")),
    );

    return snaps.docs.map((qualityCheckDoc) =>
      toQualityCheckEntity(qualityCheckDoc.id, qualityCheckDoc.data() as Record<string, unknown>),
    );
  }
}
