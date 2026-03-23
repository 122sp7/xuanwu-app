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
import type { IssueEntity, CreateIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import {
  ISSUE_LIFECYCLE_STATUSES,
  ISSUE_STAGES,
  type IssueLifecycleStatus,
  type IssueStage,
} from "../../domain/value-objects/issue-state";

const VALID_STATUSES = new Set<IssueLifecycleStatus>(ISSUE_LIFECYCLE_STATUSES);
const VALID_STAGES = new Set<IssueStage>(ISSUE_STAGES);
const DEFAULT_STATUS: IssueLifecycleStatus = "open";
const DEFAULT_STAGE: IssueStage = "task";

function toIssueEntity(id: string, data: Record<string, unknown>): IssueEntity {
  const rawStatus = data.status as IssueLifecycleStatus;
  const rawStage = data.stage as IssueStage;
  return {
    id,
    tenantId: typeof data.tenantId === "string" ? data.tenantId : "",
    teamId: typeof data.teamId === "string" ? data.teamId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    stage: VALID_STAGES.has(rawStage) ? rawStage : DEFAULT_STAGE,
    relatedId: typeof data.relatedId === "string" ? data.relatedId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",
    assignedTo: typeof data.assignedTo === "string" ? data.assignedTo : undefined,
    resolvedAtISO: typeof data.resolvedAtISO === "string" ? data.resolvedAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseIssueRepository implements IssueRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, "workspaceIssues");
  }

  async create(input: CreateIssueInput): Promise<IssueEntity> {
    const nowIso = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
      tenantId: input.tenantId,
      teamId: input.teamId,
      workspaceId: input.workspaceId,
      stage: input.stage,
      relatedId: input.relatedId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo ?? null,
      resolvedAtISO: null,
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
      stage: input.stage,
      relatedId: input.relatedId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async update(issueId: string, input: UpdateIssueInput): Promise<IssueEntity | null> {
    const issueRef = doc(this.db, "workspaceIssues", issueId);
    const snap = await getDoc(issueRef);
    if (!snap.exists()) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assignedTo === "string") patch.assignedTo = input.assignedTo;

    await updateDoc(issueRef, patch);
    const updated = await getDoc(issueRef);
    if (!updated.exists()) return null;
    return toIssueEntity(updated.id, updated.data() as Record<string, unknown>);
  }

  async delete(issueId: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaceIssues", issueId));
  }

  async findById(issueId: string): Promise<IssueEntity | null> {
    const snap = await getDoc(doc(this.db, "workspaceIssues", issueId));
    if (!snap.exists()) return null;
    return toIssueEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<IssueEntity[]> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        orderBy("updatedAtISO", "desc"),
      ),
    );
    return snaps.docs.map((d) => toIssueEntity(d.id, d.data() as Record<string, unknown>));
  }

  async transitionStatus(
    issueId: string,
    to: IssueLifecycleStatus,
    nowISO: string,
  ): Promise<IssueEntity | null> {
    const issueRef = doc(this.db, "workspaceIssues", issueId);
    const snap = await getDoc(issueRef);
    if (!snap.exists()) return null;

    const patch: Record<string, unknown> = {
      status: to,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    };
    if (to === "resolved") patch.resolvedAtISO = nowISO;

    await updateDoc(issueRef, patch);
    const updated = await getDoc(issueRef);
    if (!updated.exists()) return null;
    return toIssueEntity(updated.id, updated.data() as Record<string, unknown>);
  }
}
