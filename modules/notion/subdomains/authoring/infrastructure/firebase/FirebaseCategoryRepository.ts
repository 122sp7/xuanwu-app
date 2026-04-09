/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbCategories/{categoryId}
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
import type { CategorySnapshot } from "../../domain/aggregates/Category";
import type { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";

function categoriesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "kbCategories");
}

function categoryDoc(db: ReturnType<typeof getFirestore>, accountId: string, categoryId: string) {
  return doc(db, "accounts", accountId, "kbCategories", categoryId);
}

function toSnapshot(id: string, data: Record<string, unknown>): CategorySnapshot {
  return {
    id,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    name: typeof data.name === "string" ? data.name : "",
    slug: typeof data.slug === "string" ? data.slug : "",
    parentCategoryId: typeof data.parentCategoryId === "string" ? data.parentCategoryId : null,
    depth: typeof data.depth === "number" ? data.depth : 0,
    articleIds: Array.isArray(data.articleIds)
      ? (data.articleIds as unknown[]).filter((a): a is string => typeof a === "string")
      : [],
    description: typeof data.description === "string" ? data.description : null,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseCategoryRepository implements ICategoryRepository {
  private db() {
    return getFirestore(firebaseClientApp);
  }

  async getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null> {
    const db = this.db();
    const snap = await getDoc(categoryDoc(db, accountId, categoryId));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]> {
    const db = this.db();
    const q = query(
      categoriesCol(db, accountId),
      where("workspaceId", "==", workspaceId),
      orderBy("depth", "asc"),
      orderBy("name", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: CategorySnapshot): Promise<void> {
    const db = this.db();
    const { id, accountId, ...rest } = snapshot;
    await setDoc(categoryDoc(db, accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, categoryId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(categoryDoc(db, accountId, categoryId));
  }
}
