/**
 * Module: notion/subdomains/knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing KnowledgePageRepository.
 * Firestore path: accounts/{accountId}/contentPages/{pageId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as _generateId } from "@lib-uuid";
import { KnowledgePage } from "../../../subdomains/knowledge/domain/aggregates/KnowledgePage";
import type { KnowledgePageSnapshot } from "../../../subdomains/knowledge/domain/aggregates/KnowledgePage";
import type { KnowledgePageRepository } from "../../../subdomains/knowledge/domain/repositories/KnowledgePageRepository";

function pagesPath(accountId: string): string {
  return `accounts/${accountId}/contentPages`;
}

function pagePath(accountId: string, pageId: string): string {
  return `accounts/${accountId}/contentPages/${pageId}`;
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

export class FirebaseKnowledgePageRepository implements KnowledgePageRepository {
  async save(page: KnowledgePage): Promise<void> {
    const snap = page.getSnapshot();
    const path = pagePath(snap.accountId, snap.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    const data: Record<string, unknown> = {
      ...snap,
      blockIds: [...snap.blockIds],
    };
    if (!existing) {
      await firestoreInfrastructureApi.set(path, data);
    } else {
      await firestoreInfrastructureApi.update(path, data);
    }
  }

  async findById(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(pagePath(accountId, pageId));
    if (!data) return null;
    return KnowledgePage.reconstitute(toSnapshot(pageId, data));
  }

  async listByAccountId(accountId: string): Promise<KnowledgePage[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      pagesPath(accountId),
      [{ field: "status", op: "==", value: "active" }],
      { orderBy: [{ field: "order", direction: "asc" }] },
    );
    return docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data)));
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      pagesPath(accountId),
      [
        { field: "workspaceId", op: "==", value: workspaceId },
        { field: "status", op: "==", value: "active" },
      ],
      { orderBy: [{ field: "order", direction: "asc" }] },
    );
    return docs.map((d) => KnowledgePage.reconstitute(toSnapshot(d.id, d.data)));
  }

  async countByParent(accountId: string, parentPageId: string | null): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      pagesPath(accountId),
      [{ field: "parentPageId", op: "==", value: parentPageId ?? null }],
    );
    return docs.length;
  }

  async findSnapshotById(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null> {
    const page = await this.findById(accountId, pageId);
    return page ? page.getSnapshot() : null;
  }

  async listSnapshotsByAccountId(accountId: string): Promise<KnowledgePageSnapshot[]> {
    const pages = await this.listByAccountId(accountId);
    return pages.map((p) => p.getSnapshot());
  }

  async listSnapshotsByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]> {
    const pages = await this.listByWorkspaceId(accountId, workspaceId);
    return pages.map((p) => p.getSnapshot());
  }
}
