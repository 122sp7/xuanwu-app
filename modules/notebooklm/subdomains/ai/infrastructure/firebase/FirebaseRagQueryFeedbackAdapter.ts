/**
 * Module: notebooklm/subdomains/ai
 * Layer: infrastructure/firebase
 * Purpose: FirebaseRagQueryFeedbackAdapter — implements IRagQueryFeedbackRepository
 *          using Firestore (client SDK) for feedback persistence.
 *
 * Firestore collection: ragQueryFeedback/{autoId}
 */

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

import type { IRagQueryFeedbackRepository } from "../../domain/repositories/IRagQueryFeedbackRepository";
import type {
  RagQueryFeedback,
  SubmitRagQueryFeedbackInput,
} from "../../domain/entities/rag-feedback.entities";

const COLLECTION = "ragQueryFeedback";

interface FirestoreFeedbackDoc {
  readonly id: string;
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: string;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}

export class FirebaseRagQueryFeedbackAdapter implements IRagQueryFeedbackRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback> {
    const id = generateId();
    const submittedAtISO = new Date().toISOString();

    const doc: FirestoreFeedbackDoc = {
      id,
      traceId: input.traceId,
      userQuery: input.userQuery,
      organizationId: input.organizationId,
      ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
      rating: input.rating,
      ...(input.comment ? { comment: input.comment } : {}),
      submittedByUserId: input.submittedByUserId,
      submittedAtISO,
    };

    await addDoc(collection(this.db(), COLLECTION), doc);

    return {
      id,
      traceId: input.traceId,
      userQuery: input.userQuery,
      organizationId: input.organizationId,
      ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
      rating: input.rating,
      ...(input.comment ? { comment: input.comment } : {}),
      submittedByUserId: input.submittedByUserId,
      submittedAtISO,
    };
  }

  async listByOrganization(organizationId: string, limitCount: number): Promise<RagQueryFeedback[]> {
    const q = query(
      collection(this.db(), COLLECTION),
      where("organizationId", "==", organizationId),
      orderBy("submittedAtISO", "desc"),
      limit(limitCount),
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as FirestoreFeedbackDoc;
      return {
        id: typeof data.id === "string" ? data.id : d.id,
        traceId: data.traceId,
        userQuery: data.userQuery,
        organizationId: data.organizationId,
        ...(data.workspaceId ? { workspaceId: data.workspaceId } : {}),
        rating: data.rating as RagQueryFeedback["rating"],
        ...(data.comment ? { comment: data.comment } : {}),
        submittedByUserId: data.submittedByUserId,
        submittedAtISO: data.submittedAtISO,
      };
    });
  }
}
