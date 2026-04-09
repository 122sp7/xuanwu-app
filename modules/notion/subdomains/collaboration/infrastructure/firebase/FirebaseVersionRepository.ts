/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationVersions/{versionId}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { VersionSnapshot } from "../../domain/aggregates/Version";
import type { IVersionRepository, CreateVersionInput } from "../../domain/repositories/IVersionRepository";

function versionsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "collaborationVersions");
}

function versionDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "collaborationVersions", id);
}

function toVersion(id: string, data: Record<string, unknown>): VersionSnapshot {
  return {
    id,
    contentId: typeof data.contentId === "string" ? data.contentId : "",
    contentType: data.contentType === "article" ? "article" : "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    snapshotBlocks: Array.isArray(data.snapshotBlocks) ? data.snapshotBlocks : [],
    label: typeof data.label === "string" ? data.label : null,
    description: typeof data.description === "string" ? data.description : null,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
  };
}

export class FirebaseVersionRepository implements IVersionRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateVersionInput): Promise<VersionSnapshot> {
    const db = this.db();
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      contentId: input.contentId,
      contentType: input.contentType,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      snapshotBlocks: input.snapshotBlocks,
      label: input.label ?? null,
      description: input.description ?? null,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      _createdAt: serverTimestamp(),
    };
    await setDoc(versionDoc(db, input.accountId, id), data);
    return toVersion(id, data);
  }

  async findById(accountId: string, versionId: string): Promise<VersionSnapshot | null> {
    const db = this.db();
    const snap = await getDoc(versionDoc(db, accountId, versionId));
    if (!snap.exists()) return null;
    return toVersion(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]> {
    const db = this.db();
    const q = query(versionsCol(db, accountId), where("contentId", "==", contentId), orderBy("createdAtISO", "desc"));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toVersion(d.id, d.data() as Record<string, unknown>));
  }

  async delete(accountId: string, versionId: string): Promise<void> {
    const db = this.db();
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(versionDoc(db, accountId, versionId));
  }
}
