/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbArticles/{articleId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

function articlesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "kbArticles");
}

function articleDoc(db: ReturnType<typeof getFirestore>, accountId: string, articleId: string) {
  return doc(db, "accounts", accountId, "kbArticles", articleId);
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

export class FirebaseArticleRepository implements IArticleRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null> {
    const db = this.db();
    const snap = await getDoc(articleDoc(db, accountId, articleId));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]> {
    const db = this.db();
    const constraints = [
      where("workspaceId", "==", params.workspaceId),
      ...(params.categoryId ? [where("categoryId", "==", params.categoryId)] : []),
      ...(params.status ? [where("status", "==", params.status)] : []),
      orderBy("updatedAtISO", "desc"),
    ];
    const q = query(articlesCol(db, params.accountId), ...constraints);
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]> {
    const db = this.db();
    const q = query(
      articlesCol(db, accountId),
      where("linkedArticleIds", "array-contains", articleId),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: ArticleSnapshot): Promise<void> {
    const db = this.db();
    const { id, accountId, ...rest } = snapshot;
    await setDoc(articleDoc(db, accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, articleId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(articleDoc(db, accountId, articleId));
  }
}
