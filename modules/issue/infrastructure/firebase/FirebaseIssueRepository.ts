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

import { firebaseClientApp } from "@/infrastructure/firebase/client";

import type {
  CreateWorkspaceIssueInput,
  UpdateWorkspaceIssueInput,
  WorkspaceIssueEntity,
  WorkspaceIssueSeverity,
  WorkspaceIssueStatus,
} from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";

const VALID_SEVERITIES = new Set<WorkspaceIssueSeverity>(["low", "medium", "high"]);
const VALID_STATUSES = new Set<WorkspaceIssueStatus>(["open", "in-progress", "resolved"]);

const DEFAULT_ISSUE_SEVERITY: WorkspaceIssueSeverity = "medium";
const DEFAULT_ISSUE_STATUS: WorkspaceIssueStatus = "open";
const DEFAULT_ISSUE_SOURCE = "workspace";
const DEFAULT_ISSUE_DETAIL = "";

function toIssueEntity(id: string, data: Record<string, unknown>): WorkspaceIssueEntity {
  const severity = VALID_SEVERITIES.has(data.severity as WorkspaceIssueSeverity)
    ? (data.severity as WorkspaceIssueSeverity)
    : DEFAULT_ISSUE_SEVERITY;
  const status = VALID_STATUSES.has(data.status as WorkspaceIssueStatus)
    ? (data.status as WorkspaceIssueStatus)
    : DEFAULT_ISSUE_STATUS;

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    title: typeof data.title === "string" ? data.title : "",
    detail: typeof data.detail === "string" ? data.detail : DEFAULT_ISSUE_DETAIL,
    severity,
    status,
    source: typeof data.source === "string" ? data.source : DEFAULT_ISSUE_SOURCE,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseIssueRepository implements IssueRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, "workspaceIssues");
  }

  async create(input: CreateWorkspaceIssueInput): Promise<WorkspaceIssueEntity> {
    const nowIso = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
      workspaceId: input.workspaceId,
      title: input.title,
      detail: input.detail ?? DEFAULT_ISSUE_DETAIL,
      severity: input.severity ?? DEFAULT_ISSUE_SEVERITY,
      status: DEFAULT_ISSUE_STATUS,
      source: input.source ?? DEFAULT_ISSUE_SOURCE,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      workspaceId: input.workspaceId,
      title: input.title,
      detail: input.detail ?? DEFAULT_ISSUE_DETAIL,
      severity: input.severity ?? DEFAULT_ISSUE_SEVERITY,
      status: DEFAULT_ISSUE_STATUS,
      source: input.source ?? DEFAULT_ISSUE_SOURCE,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async update(issueId: string, input: UpdateWorkspaceIssueInput): Promise<WorkspaceIssueEntity | null> {
    const issueRef = doc(this.db, "workspaceIssues", issueId);
    const existingIssue = await getDoc(issueRef);
    if (!existingIssue.exists()) {
      return null;
    }

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };

    if (typeof input.title === "string") {
      patch.title = input.title;
    }
    if (typeof input.detail === "string") {
      patch.detail = input.detail;
    }
    if (typeof input.source === "string") {
      patch.source = input.source;
    }
    if (typeof input.severity === "string" && VALID_SEVERITIES.has(input.severity)) {
      patch.severity = input.severity;
    }
    if (typeof input.status === "string" && VALID_STATUSES.has(input.status)) {
      patch.status = input.status;
    }

    await updateDoc(issueRef, patch);

    const updatedIssue = await getDoc(issueRef);
    if (!updatedIssue.exists()) {
      return null;
    }

    return toIssueEntity(updatedIssue.id, updatedIssue.data() as Record<string, unknown>);
  }

  async delete(issueId: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaceIssues", issueId));
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceIssueEntity[]> {
    const snaps = await getDocs(
      query(this.collectionRef, where("workspaceId", "==", workspaceId), orderBy("updatedAtISO", "desc")),
    );

    return snaps.docs.map((issueDoc) =>
      toIssueEntity(issueDoc.id, issueDoc.data() as Record<string, unknown>),
    );
  }
}
