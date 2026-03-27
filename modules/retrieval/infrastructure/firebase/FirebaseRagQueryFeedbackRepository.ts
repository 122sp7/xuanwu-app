import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { v7 as generateId } from "@lib-uuid";
import { firebaseClientApp } from "@integration-firebase/client";

import type {
  RagQueryFeedback,
  SubmitRagQueryFeedbackInput,
} from "../../domain/entities/RagQueryFeedback";
import type { RagQueryFeedbackRepository } from "../../domain/repositories/RagQueryFeedbackRepository";

const COLLECTION = "ragQueryFeedback";

interface FirestoreRagFeedbackDoc {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: string;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}

export class FirebaseRagQueryFeedbackRepository implements RagQueryFeedbackRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback> {
    const id = generateId();
    const submittedAtISO = new Date().toISOString();

    const doc: FirestoreRagFeedbackDoc = {
      traceId: input.traceId,
      userQuery: input.userQuery,
      organizationId: input.organizationId,
      ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
      rating: input.rating,
      ...(input.comment ? { comment: input.comment } : {}),
      submittedByUserId: input.submittedByUserId,
      submittedAtISO,
    };

    await addDoc(collection(this.db(), COLLECTION), { id, ...doc });

    return {
      id,
      traceId: input.traceId,
      userQuery: input.userQuery,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      rating: input.rating,
      comment: input.comment,
      submittedByUserId: input.submittedByUserId,
      submittedAtISO,
    };
  }

  async findByTraceId(traceId: string): Promise<RagQueryFeedback[]> {
    const q = query(
      collection(this.db(), COLLECTION),
      where("traceId", "==", traceId),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as RagQueryFeedback);
  }

  async listByOrganization(
    organizationId: string,
    limitCount = 50,
  ): Promise<RagQueryFeedback[]> {
    const q = query(
      collection(this.db(), COLLECTION),
      where("organizationId", "==", organizationId),
      orderBy("submittedAtISO", "desc"),
      limit(limitCount),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as RagQueryFeedback);
  }
}
