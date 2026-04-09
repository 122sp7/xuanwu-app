/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IKnowledgeCollectionRepository.
 * Firestore path: accounts/{accountId}/knowledgeCollections/{collectionId}
 */

import {
  arrayRemove, arrayUnion, collection, doc, getDoc, getDocs,
  getFirestore, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import { KnowledgeCollection } from "../../domain/aggregates/KnowledgeCollection";
import type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../domain/repositories/IKnowledgeCollectionRepository";

function col(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "knowledgeCollections");
}
function docRef(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "knowledgeCollections", id);
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
  private get db() { return getFirestore(firebaseClientApp); }

  async save(coll: KnowledgeCollection): Promise<void> {
    const snap = coll.getSnapshot();
    const ref = docRef(this.db, snap.accountId, snap.id);
    const existing = await getDoc(ref);
    const data: Record<string, unknown> = { ...snap, columns: [...snap.columns], pageIds: [...snap.pageIds], updatedAt: serverTimestamp() };
    if (!existing.exists()) { data.createdAt = serverTimestamp(); await setDoc(ref, data); }
    else { await updateDoc(ref, data); }
  }

  async findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null> {
    const snap = await getDoc(docRef(this.db, accountId, collectionId));
    if (!snap.exists()) return null;
    return KnowledgeCollection.reconstitute(toSnapshot(snap.id, snap.data() as Record<string, unknown>));
  }

  async listByAccountId(accountId: string): Promise<KnowledgeCollection[]> {
    const snaps = await getDocs(col(this.db, accountId));
    return snaps.docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]> {
    const snaps = await getDocs(query(col(this.db, accountId), where("workspaceId", "==", workspaceId)));
    return snaps.docs.map((d) => KnowledgeCollection.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }
}
