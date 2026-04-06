/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgeBlockRepository.
 *
 * Firestore collection: accounts/{accountId}/contentBlocks/{blockId}
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

import type { KnowledgeBlock } from "../../domain/entities/content-block.entity";
import type { AddKnowledgeBlockInput, UpdateKnowledgeBlockInput, NestKnowledgeBlockInput, UnnestKnowledgeBlockInput } from "../../domain/entities/content-block.entity";
import type { KnowledgeBlockRepository } from "../../domain/repositories/knowledge.repositories";
import type { BlockContent } from "../../domain/value-objects/block-content";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";

function blocksCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "contentBlocks");
}

function blockDoc(db: ReturnType<typeof getFirestore>, accountId: string, blockId: string) {
  return doc(db, "accounts", accountId, "contentBlocks", blockId);
}

const VALID_BLOCK_TYPES = new Set<string>(BLOCK_TYPES);

function toBlockContent(raw: unknown): BlockContent {
  if (typeof raw !== "object" || raw === null) return { type: "text", richText: [] };
  const obj = raw as Record<string, unknown>;
  const type = typeof obj.type === "string" && VALID_BLOCK_TYPES.has(obj.type)
    ? (obj.type as BlockContent["type"])
    : "text";
  return {
    type,
    richText: Array.isArray(obj.richText) ? (obj.richText as BlockContent["richText"]) : [],
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
    parentBlockId: typeof data.parentBlockId === "string" ? data.parentBlockId : null,
    childBlockIds: Array.isArray(data.childBlockIds)
      ? (data.childBlockIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseKnowledgeBlockRepository implements KnowledgeBlockRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock> {
    const nowISO = new Date().toISOString();
    const id = generateId();

    const existing = await getDocs(
      query(blocksCol(this.db, input.accountId), where("pageId", "==", input.pageId)),
    );
    const order = input.index !== undefined ? input.index : existing.size;

    const data: Record<string, unknown> = {
      pageId: input.pageId,
      accountId: input.accountId,
      content: input.content,
      order,
      parentBlockId: input.parentBlockId ?? null,
      childBlockIds: [],
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

  async nest(input: NestKnowledgeBlockInput): Promise<KnowledgeBlock | null> {
    const db = this.db;
    const blockRef = blockDoc(db, input.accountId, input.blockId);
    const parentRef = blockDoc(db, input.accountId, input.parentBlockId);

    const [blockSnap, parentSnap] = await Promise.all([getDoc(blockRef), getDoc(parentRef)]);
    if (!blockSnap.exists() || !parentSnap.exists()) return null;

    const nowISO = new Date().toISOString();
    const parentData = parentSnap.data() as Record<string, unknown>;
    const existingChildren: string[] = Array.isArray(parentData.childBlockIds)
      ? (parentData.childBlockIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [];

    const idx = input.index !== undefined ? input.index : existingChildren.length;
    const updatedChildren = [...existingChildren];
    updatedChildren.splice(idx, 0, input.blockId);

    await Promise.all([
      updateDoc(blockRef, { parentBlockId: input.parentBlockId, updatedAtISO: nowISO, updatedAt: serverTimestamp() }),
      updateDoc(parentRef, { childBlockIds: updatedChildren, updatedAtISO: nowISO, updatedAt: serverTimestamp() }),
    ]);

    const updated = await getDoc(blockRef);
    if (!updated.exists()) return null;
    return toKnowledgeBlock(updated.id, updated.data() as Record<string, unknown>);
  }

  async unnest(input: UnnestKnowledgeBlockInput): Promise<KnowledgeBlock | null> {
    const db = this.db;
    const blockRef = blockDoc(db, input.accountId, input.blockId);
    const blockSnap = await getDoc(blockRef);
    if (!blockSnap.exists()) return null;

    const blockData = blockSnap.data() as Record<string, unknown>;
    const parentBlockId = typeof blockData.parentBlockId === "string" ? blockData.parentBlockId : null;
    const nowISO = new Date().toISOString();

    const updates: Promise<void>[] = [
      updateDoc(blockRef, { parentBlockId: null, updatedAtISO: nowISO, updatedAt: serverTimestamp() }),
    ];

    if (parentBlockId) {
      const parentRef = blockDoc(db, input.accountId, parentBlockId);
      const parentSnap = await getDoc(parentRef);
      if (parentSnap.exists()) {
        const parentData = parentSnap.data() as Record<string, unknown>;
        const children: string[] = Array.isArray(parentData.childBlockIds)
          ? (parentData.childBlockIds as unknown[]).filter((v): v is string => typeof v === "string")
          : [];
        const filtered = children.filter((id) => id !== input.blockId);
        updates.push(updateDoc(parentRef, { childBlockIds: filtered, updatedAtISO: nowISO, updatedAt: serverTimestamp() }));
      }
    }

    await Promise.all(updates);
    const updated = await getDoc(blockRef);
    if (!updated.exists()) return null;
    return toKnowledgeBlock(updated.id, updated.data() as Record<string, unknown>);
  }
}
