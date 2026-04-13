/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationComments/{commentId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { CommentSnapshot, SelectionRange } from "../../../subdomains/collaboration/domain/aggregates/Comment";
import type {
  CommentRepository,
  CommentUnsubscribe,
  CreateCommentInput,
  UpdateCommentInput,
  ResolveCommentInput,
} from "../../../subdomains/collaboration/domain/repositories/CommentRepository";

function commentsPath(accountId: string): string {
  return `accounts/${accountId}/collaborationComments`;
}

function commentPath(accountId: string, id: string): string {
  return `accounts/${accountId}/collaborationComments/${id}`;
}

function toComment(id: string, data: Record<string, unknown>): CommentSnapshot {
  return {
    id,
    contentId: typeof data.contentId === "string" ? data.contentId : "",
    contentType: data.contentType === "article" ? "article" : "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    authorId: typeof data.authorId === "string" ? data.authorId : "",
    body: typeof data.body === "string" ? data.body : "",
    parentCommentId: typeof data.parentCommentId === "string" ? data.parentCommentId : null,
    blockId: typeof data.blockId === "string" ? data.blockId : null,
    selectionRange: (
      data.selectionRange !== null &&
      typeof data.selectionRange === "object" &&
      typeof (data.selectionRange as Record<string, unknown>).from === "number" &&
      typeof (data.selectionRange as Record<string, unknown>).to === "number"
    )
      ? {
          from: (data.selectionRange as Record<string, unknown>).from as number,
          to: (data.selectionRange as Record<string, unknown>).to as number,
        } as SelectionRange
      : null,
    resolvedAt: typeof data.resolvedAt === "string" ? data.resolvedAt : null,
    resolvedByUserId: typeof data.resolvedByUserId === "string" ? data.resolvedByUserId : null,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseCommentRepository implements CommentRepository {
  async create(input: CreateCommentInput): Promise<CommentSnapshot> {
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      contentId: input.contentId,
      contentType: input.contentType,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      authorId: input.authorId,
      body: input.body,
      parentCommentId: input.parentCommentId ?? null,
      blockId: input.blockId ?? null,
      selectionRange: input.selectionRange ?? null,
      resolvedAt: null,
      resolvedByUserId: null,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(commentPath(input.accountId, id), data);
    return toComment(id, data);
  }

  async update(input: UpdateCommentInput): Promise<CommentSnapshot | null> {
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      commentPath(input.accountId, input.id),
    );
    if (!existing) return null;
    const now = new Date().toISOString();
    await firestoreInfrastructureApi.update(commentPath(input.accountId, input.id), {
      body: input.body,
      updatedAtISO: now,
    });
    return toComment(input.id, { ...existing, body: input.body, updatedAtISO: now });
  }

  async resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null> {
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      commentPath(input.accountId, input.id),
    );
    if (!existing) return null;
    const now = new Date().toISOString();
    await firestoreInfrastructureApi.update(commentPath(input.accountId, input.id), {
      resolvedAt: now,
      resolvedByUserId: input.resolvedByUserId,
    });
    return toComment(input.id, { ...existing, resolvedAt: now, resolvedByUserId: input.resolvedByUserId });
  }

  async delete(accountId: string, commentId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(commentPath(accountId, commentId));
  }

  async findById(accountId: string, commentId: string): Promise<CommentSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      commentPath(accountId, commentId),
    );
    if (!data) return null;
    return toComment(commentId, data);
  }

  async listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      commentsPath(accountId),
      [{ field: "contentId", op: "==", value: contentId }],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toComment(d.id, d.data));
  }

  subscribe(accountId: string, contentId: string, onUpdate: (comments: CommentSnapshot[]) => void): CommentUnsubscribe {
    return firestoreInfrastructureApi.watchCollection<Record<string, unknown>>(
      commentsPath(accountId),
      {
        onNext: (documents) => {
          const mapped = documents
            .map((d) => toComment(d.id, d.data))
            .sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO));
          onUpdate(mapped);
        },
      },
      [{ field: "contentId", op: "==", value: contentId }],
    );
  }

  
}
