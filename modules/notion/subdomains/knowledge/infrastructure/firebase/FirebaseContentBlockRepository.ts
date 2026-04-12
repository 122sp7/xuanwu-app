/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IContentBlockRepository.
 * Firestore path: accounts/{accountId}/contentBlocks/{blockId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as _generateId } from "@lib-uuid";
import { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
import type { IContentBlockRepository } from "../../domain/repositories/IContentBlockRepository";
import type { BlockContent } from "../../domain/value-objects/BlockContent";
import { BLOCK_TYPES } from "../../domain/value-objects/BlockContent";

const VALID_TYPES = new Set<string>(BLOCK_TYPES);

function blocksPath(accountId: string): string {
  return `accounts/${accountId}/contentBlocks`;
}

function blockPath(accountId: string, blockId: string): string {
  return `accounts/${accountId}/contentBlocks/${blockId}`;
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
    childBlockIds: Array.isArray(d.childBlockIds) ? (d.childBlockIds as string[]) : [],
    createdAtISO: typeof d.createdAtISO === "string" ? d.createdAtISO : "",
    updatedAtISO: typeof d.updatedAtISO === "string" ? d.updatedAtISO : "",
  };
}

export class FirebaseContentBlockRepository implements IContentBlockRepository {
  async save(block: ContentBlock): Promise<void> {
    const snap = block.getSnapshot();
    const path = blockPath(snap.accountId, snap.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    const data: Record<string, unknown> = { ...snap };
    if (!existing) {
      await firestoreInfrastructureApi.set(path, data);
    } else {
      await firestoreInfrastructureApi.update(path, data);
    }
  }

  async findById(accountId: string, blockId: string): Promise<ContentBlock | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      blockPath(accountId, blockId),
    );
    if (!data) return null;
    return ContentBlock.reconstitute(toSnapshot(blockId, data));
  }

  async listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      blocksPath(accountId),
      [{ field: "pageId", op: "==", value: pageId }],
    );
    return docs.map((d) => ContentBlock.reconstitute(toSnapshot(d.id, d.data)));
  }

  async delete(accountId: string, blockId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(blockPath(accountId, blockId));
  }

  async nextOrder(accountId: string, pageId: string): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      blocksPath(accountId),
      [{ field: "pageId", op: "==", value: pageId }],
    );
    return docs.length;
  }

  async countByPageId(accountId: string, pageId: string): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      blocksPath(accountId),
      [{ field: "pageId", op: "==", value: pageId }],
    );
    return docs.length;
  }
}
