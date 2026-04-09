/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IContentBlockRepository.
 * Firestore path: accounts/{accountId}/contentBlocks/{blockId}
 */

import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
import type { IContentBlockRepository } from "../../domain/repositories/IContentBlockRepository";
import type { BlockContent } from "../../../../core/domain/value-objects/BlockContent";
import { BLOCK_TYPES } from "../../../../core/domain/value-objects/BlockContent";

const VALID_TYPES = new Set<string>(BLOCK_TYPES);

function blocksCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "contentBlocks");
}
function blockDoc(db: ReturnType<typeof getFirestore>, accountId: string, blockId: string) {
  return doc(db, "accounts", accountId, "contentBlocks", blockId);
}

function toBlockContent(raw: unknown): BlockContent {
  if (typeof raw !== "object" || raw === null) return { type: "text", richText: [] };
  const obj = raw as Record<string, unknown>;
  const type = typeof obj.type === "string" && VALID_TYPES.has(obj.type) ? (obj.type as BlockContent["type"]) : "text";
  return {
    type,
    richText: Array.isArray(obj.richText) ? (obj.richText as BlockContent["richText"]) : [],
    properties: typeof obj.properties === "object" && obj.properties !== null ? (obj.properties as Record<string, unknown>) : undefined,
  };
}

function toSnapshot(id: string, d: Record<string, unknown>): ContentBlockSnapshot {
  return {
    id,
    pageId: typeof d.pageId === "string" ? d.pageId : "",
    accountId: typeof d.accountId === "string" ? d.accountId : "",
    content: toBlockContent(d.content),
    order: typeof d.order === "number" ? d.order : 0,
    parentBlockId: typeof d.parentBlockId === "string" ? d.parentBlockId : null,
    createdAtISO: typeof d.createdAtISO === "string" ? d.createdAtISO : "",
    updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
  };
}

export class FirebaseContentBlockRepository implements IContentBlockRepository {
  private get db() { return getFirestore(firebaseClientApp); }

  async save(block: ContentBlock): Promise<void> {
    const snap = block.getSnapshot();
    const ref = blockDoc(this.db, snap.accountId, snap.id);
    const existing = await getDoc(ref);
    const data: Record<string, unknown> = { ...snap, updatedAt: serverTimestamp() };
    if (!existing.exists()) {
      data.createdAt = serverTimestamp();
      await setDoc(ref, data);
    } else {
      await updateDoc(ref, data);
    }
  }

  async findById(accountId: string, blockId: string): Promise<ContentBlock | null> {
    const snap = await getDoc(blockDoc(this.db, accountId, blockId));
    if (!snap.exists()) return null;
    return ContentBlock.reconstitute(toSnapshot(snap.id, snap.data() as Record<string, unknown>));
  }

  async listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]> {
    const snaps = await getDocs(
      query(blocksCol(this.db, accountId), where("pageId", "==", pageId)),
    );
    return snaps.docs.map((d) => ContentBlock.reconstitute(toSnapshot(d.id, d.data() as Record<string, unknown>)));
  }

  async delete(accountId: string, blockId: string): Promise<void> {
    await deleteDoc(blockDoc(this.db, accountId, blockId));
  }

  async nextOrder(accountId: string, pageId: string): Promise<number> {
    const snaps = await getDocs(
      query(blocksCol(this.db, accountId), where("pageId", "==", pageId)),
    );
    return snaps.size;
  }

  async countByPageId(accountId: string, pageId: string): Promise<number> {
    const snaps = await getDocs(query(blocksCol(this.db, accountId), where("pageId", "==", pageId)));
    return snaps.size;
  }
}
