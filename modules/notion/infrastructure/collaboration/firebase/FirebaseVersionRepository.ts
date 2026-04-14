/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationVersions/{versionId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { VersionSnapshot } from "../../../subdomains/collaboration/domain/aggregates/Version";
import type { VersionRepository, CreateVersionInput } from "../../../subdomains/collaboration/domain/repositories/VersionRepository";

function versionsPath(accountId: string): string {
  return `accounts/${accountId}/collaborationVersions`;
}

function versionPath(accountId: string, id: string): string {
  return `accounts/${accountId}/collaborationVersions/${id}`;
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

export class FirebaseVersionRepository implements VersionRepository {
  async create(input: CreateVersionInput): Promise<VersionSnapshot> {
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
    };
    await firestoreInfrastructureApi.set(versionPath(input.accountId, id), data);
    return toVersion(id, data);
  }

  async findById(accountId: string, versionId: string): Promise<VersionSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      versionPath(accountId, versionId),
    );
    if (!data) return null;
    return toVersion(versionId, data);
  }

  async listByContent(accountId: string, contentId: string): Promise<VersionSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      versionsPath(accountId),
      [{ field: "contentId", op: "==", value: contentId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toVersion(d.id, d.data));
  }

  async delete(accountId: string, versionId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(versionPath(accountId, versionId));
  }
}
