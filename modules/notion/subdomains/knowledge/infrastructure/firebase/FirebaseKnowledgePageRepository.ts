/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IKnowledgePageRepository.
 * Firestore path: accounts/{accountId}/contentPages/{pageId}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import { KnowledgePage } from "../../domain/aggregates/KnowledgePage";
import type { KnowledgePageSnapshot } from "../../domain/aggregates/KnowledgePage";
import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";

function pagesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "contentPages");
}
function pageDoc(db: ReturnType<typeof getFirestore>, accountId: string, pageId: string) {
  return doc(db, "accounts", accountId, "contentPages", pageId);
}

function toSnapshot(id: string, d: Record<string, unknown>): KnowledgePageSnapshot {
  return {
    id,
    accountId: typeof d.accountId === "string" ? d.accountId : "",
    workspaceId: typeof d.workspaceId === "string" ? d.workspaceId : undefined,
    title: typeof d.title === "string" ? d.title : "",
    slug: typeof d.slug === "string" ? d.slug : "",
    parentPageId: typeof d.parentPageId === "string" ? d.parentPageId : null,
    order: typeof d.order === "number" ? d.order : 0,
    blockIds: Array.isArray(d.blockIds) ? (d.blockIds as string[]) : [],
    status: d.status === "archived" ? "archived" : "active",
    approvalState: d.approvalState === "approved" ? "approved" : d.approvalState === "pending" ? "pending" : undefined,
    approvedAtISO: typeof d.approvedAtISO === "string" ? d.approvedAtISO : undefined,
    approvedByUserId: typeof d.approvedByUserId === "string" ? d.approvedByUserId : undefined,
    verificationState: d.verificationState === "verified" ? "verified" : d.verificationState === "needs_review" ? "needs_review" : undefined,
    ownerId: typeof d.ownerId === "string" ? d.ownerId : undefined,
    verifiedByUserId: typeof d.verifiedByUserId === "string" ? d.verifiedByUserId : undefined,
    verifiedAtISO: typeof d.verifiedAtISO === "string" ? d.verifiedAtISO : undefined,
    verificationExpiresAtISO: typeof d.verificationExpiresAtISO === "string" ? d.verificationExpiresAtISO : undefined,
    iconUrl: typeof d.iconUrl === "string" ? d.iconUrl : undefined,
    coverUrl: typeof d.coverUrl === "string" ? d.coverUrl : undefined,
    createdByUserId: typeof d.createdByUserId === "string" ? d.createdByUserId : "",
    createdAtISO: typeof d.createdAtISO === "string" ? d.createdAtISO : "",
    updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
  };
}

export class FirebaseKnowledgePageRepository implements IKnowledgePageRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async save(page: KnowledgePage): Promise<void> {
    const snap = page.getSnapshot();
    const ref = pageDoc(this.db, snap.accountId, snap.id);
    const existing = await getDoc(ref);
    const data: Record<string, unknown> = {
      ...snap,
      blockIds: [...snap.blockIds],
      updatedAt: serverTimestamp(),
    };
    if (!existing.exists()) {
      data.createdAt = serverTimestamp();
      await setDoc(ref, data);
    } else {
      await updateDoc(ref, data);
    }
  }

  async findById(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    const snap = await getDoc(pageDoc(this.db, accountId, pageId));
    if (!snap.exists()) return null;
    return KnowledgePage.reconstitute(toSnapshot(snap.id, snap.data() as Record<string, unknown>));
  }

  async listByAccountId(accountId: string): Promise<KnowledgePage[]> {
    const snaps = await getDocs(
      query(pagesCol(this.db, accountId), where("status", "==", "active"), orderBy("order", "asc")),
    );
    return snaps.docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]> {
    const snaps = await getDocs(
      query(pagesCol(this.db, accountId), where("workspaceId", "==", workspaceId), where("status", "==", "active"), orderBy("order", "asc")),
    );
    return snaps.docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async countByParent(accountId: string, parentPageId: string | null): Promise<number> {
    const snaps = await getDocs(
      query(pagesCol(this.db, accountId), where("parentPageId", "==", parentPageId ?? null)),
    );
    return snaps.size;
  }

  async findSnapshotById(accountId: string, pageId: string): Promise<import("../../domain/aggregates/KnowledgePage").KnowledgePageSnapshot | null> {
    const page = await this.findById(accountId, pageId);
    return page ? page.getSnapshot() : null;
  }

  async listSnapshotsByAccountId(accountId: string): Promise<import("../../domain/aggregates/KnowledgePage").KnowledgePageSnapshot[]> {
    const pages = await this.listByAccountId(accountId);
    return pages.map((p) => p.getSnapshot());
  }

  async listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<import("../../domain/aggregates/KnowledgePage").KnowledgePageSnapshot[]> {
    const pages = await this.listByWorkspaceId(accountId, workspaceId);
    return pages.map((p) => p.getSnapshot());
  }
}
