/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbArticles/{articleId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../../../subdomains/authoring/domain/aggregates/Article";
import type { ArticleRepository } from "../../../subdomains/authoring/domain/repositories/ArticleRepository";

function articlesPath(accountId: string): string {
  return `accounts/${accountId}/kbArticles`;
}

function articlePath(accountId: string, articleId: string): string {
  return `accounts/${accountId}/kbArticles/${articleId}`;
}

function toSnapshot(id: string, data: Record<string, unknown>): ArticleSnapshot {
  return {
    id,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    categoryId: typeof data.categoryId === "string" ? data.categoryId : null,
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",
    tags: Array.isArray(data.tags)
      ? (data.tags as unknown[]).filter((t): t is string => typeof t === "string")
      : [],
    status: (data.status as ArticleStatus) ?? "draft",
    version: typeof data.version === "number" ? data.version : 1,
    verificationState: (data.verificationState as ArticleVerificationState) ?? "unverified",
    ownerId: typeof data.ownerId === "string" ? data.ownerId : null,
    verifiedByUserId: typeof data.verifiedByUserId === "string" ? data.verifiedByUserId : null,
    verifiedAtISO: typeof data.verifiedAtISO === "string" ? data.verifiedAtISO : null,
    verificationExpiresAtISO:
      typeof data.verificationExpiresAtISO === "string" ? data.verificationExpiresAtISO : null,
    linkedArticleIds: Array.isArray(data.linkedArticleIds)
      ? (data.linkedArticleIds as unknown[]).filter((l): l is string => typeof l === "string")
      : [],
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseArticleRepository implements ArticleRepository {
  async getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      articlePath(accountId, articleId),
    );
    if (!data) return null;
    return toSnapshot(articleId, data);
  }

  async list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]> {
    const where = [
      { field: "workspaceId", op: "==", value: params.workspaceId } as const,
      ...(params.categoryId ? [{ field: "categoryId", op: "==", value: params.categoryId } as const] : []),
      ...(params.status ? [{ field: "status", op: "==", value: params.status } as const] : []),
    ];
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      articlesPath(params.accountId),
      where,
      { orderBy: [{ field: "updatedAtISO", direction: "desc" }] },
    );
    const limited = typeof params.limit === "number" && params.limit > 0 ? docs.slice(0, params.limit) : docs;
    return limited.map((d) => toSnapshot(d.id, d.data));
  }

  async listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      articlesPath(accountId),
      [{ field: "linkedArticleIds", op: "array-contains", value: articleId }],
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }

  async save(snapshot: ArticleSnapshot): Promise<void> {
    const { id, accountId, ...rest } = snapshot;
    await firestoreInfrastructureApi.set(articlePath(accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, articleId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(articlePath(accountId, articleId));
  }
}
