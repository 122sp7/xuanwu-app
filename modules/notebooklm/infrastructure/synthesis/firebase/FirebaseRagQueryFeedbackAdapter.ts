/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: infrastructure/firebase
 * Purpose: FirebaseRagQueryFeedbackAdapter — implements RagQueryFeedbackRepository
 *          using Firestore (client SDK) for feedback persistence.
 *
 * Firestore collection: ragQueryFeedback/{autoId}
 */

import { v7 as generateId } from "@lib-uuid";
import { firestoreInfrastructureApi } from "@/modules/platform/api";

import type { RagQueryFeedbackRepository } from "../../../subdomains/synthesis/domain/repositories/RagQueryFeedbackRepository";
import type {
  RagQueryFeedback,
  SubmitRagQueryFeedbackInput,
} from "../../../subdomains/synthesis/domain/entities/rag-feedback.entities";

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

export class FirebaseRagQueryFeedbackAdapter implements RagQueryFeedbackRepository {
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

    await firestoreInfrastructureApi.set<FirestoreFeedbackDoc>(`${COLLECTION}/${id}`, doc);

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
    const docs = await firestoreInfrastructureApi.query<FirestoreFeedbackDoc>(
      COLLECTION,
      [{ field: "organizationId", op: "==", value: organizationId }],
      {
        orderBy: [{ field: "submittedAtISO", direction: "desc" }],
        limit: limitCount,
      },
    );
    return docs.map((data) => {
      return {
        id: data.id,
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
