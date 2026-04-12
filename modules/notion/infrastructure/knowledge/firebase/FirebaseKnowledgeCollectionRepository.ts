/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IKnowledgeCollectionRepository.
 * Firestore path: accounts/{accountId}/knowledgeCollections/{collectionId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { KnowledgeCollection } from "../../../subdomains/knowledge/domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionSnapshot } from "../../../subdomains/knowledge/domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../../subdomains/knowledge/domain/repositories/IKnowledgeCollectionRepository";

function collectionsPath(accountId: string): string {
  return `accounts/${accountId}/knowledgeCollections`;
}

function collectionPath(accountId: string, id: string): string {
  return `accounts/${accountId}/knowledgeCollections/${id}`;
}

function toSnapshot(id: string, d: Record<string, unknown>): KnowledgeCollectionSnapshot {
  return {
    id,
    accountId: typeof d.accountId === "string" ? d.accountId : "",
    workspaceId: typeof d.workspaceId === "string" ? d.workspaceId : undefined,
    name: typeof d.name === "string" ? d.name : "",
    description: typeof d.description === "string" ? d.description : undefined,
    columns: Array.isArray(d.columns) ? (d.columns as KnowledgeCollectionSnapshot["columns"]) : [],
    pageIds: Array.isArray(d.pageIds) ? (d.pageIds as string[]) : [],
    status: d.status === "archived" ? "archived" : "active",
    spaceType: d.spaceType === "wiki" ? "wiki" : "database",
    createdByUserId: typeof d.createdByUserId === "string" ? d.createdByUserId : "",
    createdAtISO: typeof d.createdAtISO === "string" ? d.createdAtISO : "",
    updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
  };
}

export class FirebaseKnowledgeCollectionRepository implements IKnowledgeCollectionRepository {
  async save(coll: KnowledgeCollection): Promise<void> {
    const snap = coll.getSnapshot();
    const path = collectionPath(snap.accountId, snap.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    const data: Record<string, unknown> = { ...snap, columns: [...snap.columns], pageIds: [...snap.pageIds] };
    if (!existing) {
      await firestoreInfrastructureApi.set(path, data);
    } else {
      await firestoreInfrastructureApi.update(path, data);
    }
  }

  async findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      collectionPath(accountId, collectionId),
    );
    if (!data) return null;
    return KnowledgeCollection.reconstitute(toSnapshot(collectionId, data));
  }

  async listByAccountId(accountId: string): Promise<KnowledgeCollection[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionsPath(accountId),
    );
    return docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionsPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    return docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data)));
  }
}
