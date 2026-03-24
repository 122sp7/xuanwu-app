/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgePageRepository.
 *
 * Firestore collection: accounts/{accountId}/knowledgePages/{pageId}
 *
 * The repository translates between Firestore documents and KnowledgePage
 * domain entities. All timestamps are stored as ISO-8601 strings for
 * portability and type safety.
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
} from "../../domain/entities/knowledge-page.entity";
import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";

// ── Collection path helpers ───────────────────────────────────────────────────

function pagesCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "knowledgePages");
}

function pageDoc(db: ReturnType<typeof getFirestore>, accountId: string, pageId: string) {
  return doc(db, "accounts", accountId, "knowledgePages", pageId);
}

// ── Document mapper ───────────────────────────────────────────────────────────

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

// ── Repository implementation ─────────────────────────────────────────────────

export class FirebaseKnowledgePageRepository implements KnowledgePageRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async create(input: CreateKnowledgePageInput): Promise<KnowledgePage> {
    const nowISO = new Date().toISOString();
    const slug = slugify(input.title);
    const id = generateId();

    // Count existing root pages to set initial order
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
}
