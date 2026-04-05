/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgeCollectionRepository.
 *
 * Firestore collection: accounts/{accountId}/knowledgeCollections/{collectionId}
 */

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";

import type {
  KnowledgeCollection,
  CollectionColumn,
  CollectionStatus,
  CreateKnowledgeCollectionInput,
  RenameKnowledgeCollectionInput,
  AddPageToCollectionInput,
  RemovePageFromCollectionInput,
  AddCollectionColumnInput,
  ArchiveKnowledgeCollectionInput,
} from "../../domain/entities/knowledge-collection.entity";
import type { KnowledgeCollectionRepository } from "../../domain/repositories/knowledge.repositories";

function collectionsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "knowledgeCollections");
}

function collectionDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  collectionId: string,
) {
  return doc(db, "accounts", accountId, "knowledgeCollections", collectionId);
}

function toKnowledgeCollection(id: string, data: Record<string, unknown>): KnowledgeCollection {
  const columns: CollectionColumn[] = Array.isArray(data.columns)
    ? (data.columns as unknown[]).filter(
        (c): c is Record<string, unknown> => typeof c === "object" && c !== null,
      ).map((c) => ({
        id: typeof c.id === "string" ? c.id : generateId(),
        name: typeof c.name === "string" ? c.name : "",
        type: (c.type as CollectionColumn["type"]) ?? "text",
        options: Array.isArray(c.options)
          ? (c.options as unknown[]).filter((v): v is string => typeof v === "string")
          : undefined,
      }))
    : [];

  return {
    id,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : undefined,
    columns,
    pageIds: Array.isArray(data.pageIds)
      ? (data.pageIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    status: (data.status as CollectionStatus) === "archived" ? "archived" : "active",
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseKnowledgeCollectionRepository implements KnowledgeCollectionRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async create(input: CreateKnowledgeCollectionInput): Promise<KnowledgeCollection> {
    const nowISO = new Date().toISOString();
    const id = generateId();

    const columns: CollectionColumn[] = (input.columns ?? []).map((c) => ({
      id: generateId(),
      name: c.name,
      type: c.type,
      options: c.options,
    }));

    const docRef = collectionDoc(this.db, input.accountId, id);
    const data: Record<string, unknown> = {
      accountId: input.accountId,
      name: input.name,
      description: input.description ?? null,
      columns,
      pageIds: [],
      status: "active",
      createdByUserId: input.createdByUserId,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
      _serverTimestamp: serverTimestamp(),
    };

    if (input.workspaceId) {
      data.workspaceId = input.workspaceId;
    }

    await setDoc(docRef, data);

    return toKnowledgeCollection(id, { ...data, createdAtISO: nowISO, updatedAtISO: nowISO });
  }

  async rename(input: RenameKnowledgeCollectionInput): Promise<KnowledgeCollection | null> {
    const docRef = collectionDoc(this.db, input.accountId, input.collectionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(docRef, { name: input.name, updatedAtISO: nowISO });

    return toKnowledgeCollection(input.collectionId, {
      ...snap.data(),
      name: input.name,
      updatedAtISO: nowISO,
    });
  }

  async addPage(input: AddPageToCollectionInput): Promise<KnowledgeCollection | null> {
    const docRef = collectionDoc(this.db, input.accountId, input.collectionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(docRef, { pageIds: arrayUnion(input.pageId), updatedAtISO: nowISO });

    const data = snap.data() as Record<string, unknown>;
    const pageIds = Array.isArray(data.pageIds)
      ? [...(data.pageIds as string[]), input.pageId]
      : [input.pageId];

    return toKnowledgeCollection(input.collectionId, { ...data, pageIds, updatedAtISO: nowISO });
  }

  async removePage(input: RemovePageFromCollectionInput): Promise<KnowledgeCollection | null> {
    const docRef = collectionDoc(this.db, input.accountId, input.collectionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(docRef, { pageIds: arrayRemove(input.pageId), updatedAtISO: nowISO });

    const data = snap.data() as Record<string, unknown>;
    const pageIds = Array.isArray(data.pageIds)
      ? (data.pageIds as string[]).filter((id) => id !== input.pageId)
      : [];

    return toKnowledgeCollection(input.collectionId, { ...data, pageIds, updatedAtISO: nowISO });
  }

  async addColumn(input: AddCollectionColumnInput): Promise<KnowledgeCollection | null> {
    const docRef = collectionDoc(this.db, input.accountId, input.collectionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    const newColumn: CollectionColumn = {
      id: generateId(),
      name: input.column.name,
      type: input.column.type,
      options: input.column.options,
    };

    await updateDoc(docRef, { columns: arrayUnion(newColumn), updatedAtISO: nowISO });

    const data = snap.data() as Record<string, unknown>;
    const columns = Array.isArray(data.columns)
      ? [...(data.columns as CollectionColumn[]), newColumn]
      : [newColumn];

    return toKnowledgeCollection(input.collectionId, { ...data, columns, updatedAtISO: nowISO });
  }

  async archive(input: ArchiveKnowledgeCollectionInput): Promise<KnowledgeCollection | null> {
    const docRef = collectionDoc(this.db, input.accountId, input.collectionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(docRef, { status: "archived", updatedAtISO: nowISO });

    return toKnowledgeCollection(input.collectionId, {
      ...snap.data(),
      status: "archived",
      updatedAtISO: nowISO,
    });
  }

  async findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null> {
    const snap = await getDoc(collectionDoc(this.db, accountId, collectionId));
    if (!snap.exists()) return null;
    return toKnowledgeCollection(collectionId, snap.data() as Record<string, unknown>);
  }

  async listByAccountId(accountId: string): Promise<KnowledgeCollection[]> {
    const snaps = await getDocs(collectionsCol(this.db, accountId));
    return snaps.docs.map((d) =>
      toKnowledgeCollection(d.id, d.data() as Record<string, unknown>),
    );
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]> {
    const q = query(collectionsCol(this.db, accountId), where("workspaceId", "==", workspaceId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) =>
      toKnowledgeCollection(d.id, d.data() as Record<string, unknown>),
    );
  }
}
