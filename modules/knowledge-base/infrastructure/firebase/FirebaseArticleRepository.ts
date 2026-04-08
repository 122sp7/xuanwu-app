/**
 * Module: knowledge-base
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbArticles/{articleId}
 */

import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Article, ArticleStatus } from "../../domain/entities/article.entity";
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";

function articlesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "kbArticles");
}

function articleDoc(db: ReturnType<typeof getFirestore>, accountId: string, articleId: string) {
  return doc(db, "accounts", accountId, "kbArticles", articleId);
}

function toArticle(id: string, data: Record<string, unknown>): Article {
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
    verificationState: (data.verificationState as Article["verificationState"]) ?? "unverified",
    ownerId: typeof data.ownerId === "string" ? data.ownerId : null,
    verifiedByUserId: typeof data.verifiedByUserId === "string" ? data.verifiedByUserId : null,
    verifiedAtISO: typeof data.verifiedAtISO === "string" ? data.verifiedAtISO : null,
    verificationExpiresAtISO: typeof data.verificationExpiresAtISO === "string" ? data.verificationExpiresAtISO : null,
    linkedArticleIds: Array.isArray(data.linkedArticleIds)
      ? (data.linkedArticleIds as unknown[]).filter((l): l is string => typeof l === "string")
      : [],
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseArticleRepository implements IArticleRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async getById(_articleId: string): Promise<Article> {
    // Note: _articleId must be scoped with accountId in compound queries;
    // for direct lookup we search across all accounts via collectionGroup if needed.
    // At this layer we expect callers to use listByWorkspace for discovery.
    // We cannot getById without accountId — this is a limitation of the Firestore path.
    // The article id from use-cases already has accountId in context.
    // We'll need to resolve via a workspace-scoped query. For now, search by docId broadly.
    // This is why save() stores accountId in the doc itself.
    throw new Error("Use getArticleById(accountId, articleId) instead");
  }

  async getArticleById(accountId: string, articleId: string): Promise<Article | null> {
    const db = this.db();
    const snap = await getDoc(articleDoc(db, accountId, articleId));
    if (!snap.exists()) return null;
    return toArticle(snap.id, snap.data() as Record<string, unknown>);
  }

  async list(params: {
    workspaceId: string;
    accountId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<Article[]> {
    const db = this.db();
    let q = query(articlesCol(db, params.accountId), where("workspaceId", "==", params.workspaceId));
    if (params.categoryId) {
      q = query(q, where("categoryId", "==", params.categoryId));
    }
    if (params.status) {
      q = query(q, where("status", "==", params.status));
    }
    q = query(q, orderBy("createdAtISO", "desc"));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => toArticle(d.id, d.data() as Record<string, unknown>));
  }

  async search(_params: { workspaceId: string; query: string; limit?: number }): Promise<Article[]> {
    // Full-text search is not supported by Firestore; delegate to search module.
    return [];
  }

  async save(article: Article): Promise<void> {
    const db = this.db();
    const ref = articleDoc(db, article.accountId, article.id);
    const { id: _id, ...data } = article;
    await setDoc(ref, { ...data, _createdAt: serverTimestamp() }, { merge: true });
  }

  async getByIds(_articleIds: string[]): Promise<Article[]> {
    // Must be called with accountId; not feasible without extra context.
    return [];
  }

  async findByLinkedArticleId(_articleId: string): Promise<Article[]> {
    // Cross-account lookup not supported without accountId scope.
    return [];
  }

  async listByLinkedArticleId(accountId: string, articleId: string): Promise<Article[]> {
    const db = this.db();
    const q = query(
      articlesCol(db, accountId),
      where("linkedArticleIds", "array-contains", articleId),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toArticle(d.id, d.data() as Record<string, unknown>));
  }

  async delete(accountId: string, articleId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(articleDoc(db, accountId, articleId));
  }
}
