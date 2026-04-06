/**
 * Module: knowledge-base
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbCategories/{categoryId}
 */

import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Category } from "../../domain/entities/category.entity";
import type { ICategoryRepository } from "../../domain/repositories/CategoryRepository";

function categoriesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "kbCategories");
}

function categoryDoc(db: ReturnType<typeof getFirestore>, accountId: string, categoryId: string) {
  return doc(db, "accounts", accountId, "kbCategories", categoryId);
}

function toCategory(id: string, data: Record<string, unknown>): Category {
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
  private _accountId: string = "";

  withAccountId(accountId: string): this {
    this._accountId = accountId;
    return this;
  }

  private db() { return getFirestore(firebaseClientApp); }

  async getById(categoryId: string): Promise<Category> {
    const db = this.db();
    const snap = await getDoc(categoryDoc(db, this._accountId, categoryId));
    if (!snap.exists()) throw new Error(`Category ${categoryId} not found`);
    return toCategory(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByWorkspace(workspaceId: string, accountId: string): Promise<Category[]> {
    const db = this.db();
    const q = query(
      categoriesCol(db, accountId),
      where("workspaceId", "==", workspaceId),
      orderBy("depth", "asc"),
      orderBy("name", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => toCategory(d.id, d.data() as Record<string, unknown>));
  }

  async listChildren(parentCategoryId: string): Promise<Category[]> {
    const db = this.db();
    const q = query(
      categoriesCol(db, this._accountId),
      where("parentCategoryId", "==", parentCategoryId),
      orderBy("name", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => toCategory(d.id, d.data() as Record<string, unknown>));
  }

  async save(category: Category): Promise<void> {
    const db = this.db();
    const ref = categoryDoc(db, category.accountId, category.id);
    const { id: _id, ...data } = category;
    await setDoc(ref, { ...data, _createdAt: serverTimestamp() }, { merge: true });
  }

  async delete(categoryId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(categoryDoc(db, this._accountId, categoryId));
  }

  async updateArticleIds(categoryId: string, articleIds: string[]): Promise<void> {
    const db = this.db();
    const snap = await getDoc(categoryDoc(db, this._accountId, categoryId));
    if (!snap.exists()) throw new Error(`Category ${categoryId} not found`);
    const existing = toCategory(snap.id, snap.data() as Record<string, unknown>);
    await this.save({ ...existing, articleIds, updatedAtISO: new Date().toISOString() });
  }
}
