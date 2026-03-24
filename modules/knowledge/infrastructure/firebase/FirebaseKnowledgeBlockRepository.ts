/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgeBlockRepository.
 *
 * Firestore collection: accounts/{accountId}/knowledgeBlocks/{blockId}
 *
 * Blocks are stored in a flat collection under the account and queried by
 * pageId. The domain's order field is kept in sync with the parent Page's
 * blockIds array — the Page aggregate is the single source of truth for order.
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
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";

import type { KnowledgeBlock } from "../../domain/entities/knowledge-block.entity";
import type { AddKnowledgeBlockInput, UpdateKnowledgeBlockInput } from "../../domain/entities/knowledge-block.entity";
import type { KnowledgeBlockRepository } from "../../domain/repositories/knowledge.repositories";
import type { BlockContent } from "../../domain/value-objects/block-content";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";

// ── Collection path helpers ───────────────────────────────────────────────────

function blocksCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "knowledgeBlocks");
}

function blockDoc(db: ReturnType<typeof getFirestore>, accountId: string, blockId: string) {
  return doc(db, "accounts", accountId, "knowledgeBlocks", blockId);
}

// ── Document mapper ───────────────────────────────────────────────────────────

const VALID_BLOCK_TYPES = new Set<string>(BLOCK_TYPES);

function toBlockContent(raw: unknown): BlockContent {
  if (typeof raw !== "object" || raw === null) return { type: "text", text: "" };
  const obj = raw as Record<string, unknown>;
  const type = typeof obj.type === "string" && VALID_BLOCK_TYPES.has(obj.type)
    ? (obj.type as BlockContent["type"])
    : "text";
  return {
    type,
    text: typeof obj.text === "string" ? obj.text : "",
    properties: typeof obj.properties === "object" && obj.properties !== null
      ? (obj.properties as Record<string, unknown>)
      : undefined,
  };
}

function toKnowledgeBlock(id: string, data: Record<string, unknown>): KnowledgeBlock {
  return {
    id,
    pageId: typeof data.pageId === "string" ? data.pageId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    content: toBlockContent(data.content),
    order: typeof data.order === "number" ? data.order : 0,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

// ── Repository implementation ─────────────────────────────────────────────────

export class FirebaseKnowledgeBlockRepository implements KnowledgeBlockRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock> {
    const nowISO = new Date().toISOString();
    const id = generateId();

    // Determine order based on existing blocks for the page
    const existing = await getDocs(
      query(blocksCol(this.db, input.accountId), where("pageId", "==", input.pageId)),
    );
    const order = input.index !== undefined ? input.index : existing.size;

    const data: Record<string, unknown> = {
      pageId: input.pageId,
      accountId: input.accountId,
      content: input.content,
      order,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(blockDoc(this.db, input.accountId, id), data);

    return toKnowledgeBlock(id, { ...data });
  }

  async update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null> {
    const ref = blockDoc(this.db, input.accountId, input.blockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const nowISO = new Date().toISOString();
    await updateDoc(ref, {
      content: input.content,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    });

    const updated = await getDoc(ref);
    if (!updated.exists()) return null;
    return toKnowledgeBlock(updated.id, updated.data() as Record<string, unknown>);
  }

  async delete(accountId: string, blockId: string): Promise<void> {
    await deleteDoc(blockDoc(this.db, accountId, blockId));
  }

  async findById(accountId: string, blockId: string): Promise<KnowledgeBlock | null> {
    const snap = await getDoc(blockDoc(this.db, accountId, blockId));
    if (!snap.exists()) return null;
    return toKnowledgeBlock(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]> {
    const snaps = await getDocs(
      query(
        blocksCol(this.db, accountId),
        where("pageId", "==", pageId),
        orderBy("order", "asc"),
      ),
    );
    return snaps.docs.map((d) => toKnowledgeBlock(d.id, d.data() as Record<string, unknown>));
  }
}
