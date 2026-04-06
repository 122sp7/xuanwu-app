/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgePageRepository.
 *
 * Firestore collection: accounts/{accountId}/contentPages/{pageId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";

import type {
  KnowledgePage,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ApproveKnowledgePageInput,
  VerifyKnowledgePageInput,
  RequestPageReviewInput,
  AssignPageOwnerInput,
  UpdatePageIconInput,
  UpdatePageCoverInput,
} from "../../domain/entities/knowledge-page.entity";
import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";

function pagesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "contentPages");
}

function pageDoc(db: ReturnType<typeof getFirestore>, accountId: string, pageId: string) {
  return doc(db, "accounts", accountId, "contentPages", pageId);
}

function toKnowledgePage(id: string, data: Record<string, unknown>): KnowledgePage {
  return {
    id,
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
    title: typeof data.title === "string" ? data.title : "",
    slug: typeof data.slug === "string" ? data.slug : "",
    parentPageId: typeof data.parentPageId === "string" ? data.parentPageId : null,
    order: typeof data.order === "number" ? data.order : 0,
    blockIds: Array.isArray(data.blockIds)
      ? (data.blockIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    status: data.status === "archived" ? "archived" : "active",
    approvalState: data.approvalState === "approved" ? "approved" : data.approvalState === "pending" ? "pending" : undefined,
    approvedAtISO: typeof data.approvedAtISO === "string" ? data.approvedAtISO : undefined,
    approvedByUserId: typeof data.approvedByUserId === "string" ? data.approvedByUserId : undefined,
    verificationState: data.verificationState === "verified" ? "verified" : data.verificationState === "needs_review" ? "needs_review" : undefined,
    ownerId: typeof data.ownerId === "string" ? data.ownerId : undefined,
    verifiedByUserId: typeof data.verifiedByUserId === "string" ? data.verifiedByUserId : undefined,
    verifiedAtISO: typeof data.verifiedAtISO === "string" ? data.verifiedAtISO : undefined,
    verificationExpiresAtISO: typeof data.verificationExpiresAtISO === "string" ? data.verificationExpiresAtISO : undefined,
    iconUrl: typeof data.iconUrl === "string" ? data.iconUrl : undefined,
    coverUrl: typeof data.coverUrl === "string" ? data.coverUrl : undefined,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "page";
}

export class FirebaseKnowledgePageRepository implements KnowledgePageRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async create(input: CreateKnowledgePageInput): Promise<KnowledgePage> {
    const nowISO = new Date().toISOString();
    const slug = slugify(input.title);
    const id = generateId();

    const existing = await getDocs(
      query(pagesCol(this.db, input.accountId), where("parentPageId", "==", input.parentPageId ?? null)),
    );
    const order = existing.size;

    const docRef = doc(pagesCol(this.db, input.accountId), id);
    const data: Record<string, unknown> = {
      accountId: input.accountId,
      title: input.title,
      slug,
      parentPageId: input.parentPageId ?? null,
      order,
      blockIds: [],
      status: "active",
      createdByUserId: input.createdByUserId,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (input.workspaceId) data.workspaceId = input.workspaceId;

    await setDoc(docRef, data);

    return toKnowledgePage(id, { ...data, id });
  }

  async rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      title: input.title,
      slug: slugify(input.title),
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      parentPageId: input.targetParentPageId,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      blockIds: [...input.blockIds],
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async archive(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, accountId, pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      status: "archived",
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as Record<string, unknown>;
    if (data.status === "archived") return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      approvalState: "approved",
      approvedAtISO: input.approvedAtISO,
      approvedByUserId: input.approvedByUserId,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async findById(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    const snap = await getDoc(pageDoc(this.db, accountId, pageId));
    if (!snap.exists()) return null;
    return toKnowledgePage(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByAccountId(accountId: string): Promise<KnowledgePage[]> {
    const snaps = await getDocs(
      query(
        pagesCol(this.db, accountId),
        where("status", "==", "active"),
        orderBy("order", "asc"),
      ),
    );
    return snaps.docs.map((d) => toKnowledgePage(d.id, d.data() as Record<string, unknown>));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]> {
    const snaps = await getDocs(
      query(
        pagesCol(this.db, accountId),
        where("workspaceId", "==", workspaceId),
        where("status", "==", "active"),
        orderBy("order", "asc"),
      ),
    );
    return snaps.docs.map((d) => toKnowledgePage(d.id, d.data() as Record<string, unknown>));
  }

  async verify(input: VerifyKnowledgePageInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      verificationState: "verified",
      verifiedByUserId: input.verifiedByUserId,
      verifiedAtISO: nowISO,
      verificationExpiresAtISO: input.verificationExpiresAtISO ?? null,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async requestReview(input: RequestPageReviewInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      verificationState: "needs_review",
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async assignOwner(input: AssignPageOwnerInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      ownerId: input.ownerId,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async updateIcon(input: UpdatePageIconInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      iconUrl: input.iconUrl || null,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }

  async updateCover(input: UpdatePageCoverInput): Promise<KnowledgePage | null> {
    const ref = pageDoc(this.db, input.accountId, input.pageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      coverUrl: input.coverUrl || null,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgePage(updated.id, updated.data() as Record<string, unknown>);
  }
}
