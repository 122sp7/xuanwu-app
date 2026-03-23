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
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { TestCaseEntity, CreateTestCaseInput } from "../../domain/entities/TestCase";
import type { TestCaseRepository } from "../../domain/repositories/TestCaseRepository";

function toTestCaseEntity(id: string, data: Record<string, unknown>): TestCaseEntity {
  return {
    id,
    tenantId: typeof data.tenantId === "string" ? data.tenantId : "",
    teamId: typeof data.teamId === "string" ? data.teamId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    taskId: typeof data.taskId === "string" ? data.taskId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : undefined,
    createdBy: typeof data.createdBy === "string" ? data.createdBy : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseTestCaseRepository implements TestCaseRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, "workspaceTestCases");
  }

  async create(input: CreateTestCaseInput): Promise<TestCaseEntity> {
    const nowIso = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
      tenantId: input.tenantId,
      teamId: input.teamId,
      workspaceId: input.workspaceId,
      taskId: input.taskId,
      title: input.title,
      description: input.description ?? null,
      createdBy: input.createdBy,
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
      title: input.title,
      description: input.description,
      createdBy: input.createdBy,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async delete(testCaseId: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaceTestCases", testCaseId));
  }

  async findById(testCaseId: string): Promise<TestCaseEntity | null> {
    const snap = await getDoc(doc(this.db, "workspaceTestCases", testCaseId));
    if (!snap.exists()) return null;
    return toTestCaseEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<TestCaseEntity[]> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        orderBy("createdAtISO", "desc"),
      ),
    );
    return snaps.docs.map((d) => toTestCaseEntity(d.id, d.data() as Record<string, unknown>));
  }

  async findByTaskId(taskId: string): Promise<TestCaseEntity[]> {
    const snaps = await getDocs(
      query(this.collectionRef, where("taskId", "==", taskId), orderBy("createdAtISO", "desc")),
    );
    return snaps.docs.map((d) => toTestCaseEntity(d.id, d.data() as Record<string, unknown>));
  }
}
