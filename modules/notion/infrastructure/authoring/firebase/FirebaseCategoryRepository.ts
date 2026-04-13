/**
 * Module: notion/subdomains/authoring
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbCategories/{categoryId}
 * Note: Preserves same collection path as previous knowledge-base module for data continuity.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { CategorySnapshot } from "../../../subdomains/authoring/domain/aggregates/Category";
import type { CategoryRepository } from "../../../subdomains/authoring/domain/repositories/CategoryRepository";

function categoriesPath(accountId: string): string {
  return `accounts/${accountId}/kbCategories`;
}

function categoryPath(accountId: string, categoryId: string): string {
  return `accounts/${accountId}/kbCategories/${categoryId}`;
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

export class FirebaseCategoryRepository implements CategoryRepository {
  async getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      categoryPath(accountId, categoryId),
    );
    if (!data) return null;
    return toSnapshot(categoryId, data);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      categoriesPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
      { orderBy: [{ field: "depth", direction: "asc" }, { field: "name", direction: "asc" }] },
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }

  async save(snapshot: CategorySnapshot): Promise<void> {
    const { id, accountId, ...rest } = snapshot;
    await firestoreInfrastructureApi.set(categoryPath(accountId, id), { ...rest, accountId, id });
  }

  async delete(accountId: string, categoryId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(categoryPath(accountId, categoryId));
  }
}
