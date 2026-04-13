import { v4 as uuid } from "@lib-uuid";
import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import type { AuditEntry } from "../../domain/aggregates/AuditEntry";
import type { AuditLogEntity, AuditLogSource } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

const VALID_AUDIT_LOG_SOURCES = new Set<AuditLogSource>([
  "workspace",
  "finance",
  "notification",
  "system",
]);

function toAuditLogEntity(id: string, data: Record<string, unknown>): AuditLogEntity {
  const source = VALID_AUDIT_LOG_SOURCES.has(data.source as AuditLogSource)
    ? (data.source as AuditLogSource)
    : "workspace";

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    actorId: typeof data.actorId === "string" ? data.actorId : "system",
    action: typeof data.action === "string" ? data.action : "unknown",
    detail: typeof data.detail === "string" ? data.detail : "",
    source,
    occurredAtISO:
      typeof data.occurredAtISO === "string"
        ? data.occurredAtISO
        : "",
  };
}

export class FirebaseAuditRepository implements AuditRepository {
  async save(entry: AuditEntry): Promise<void> {
    const id = uuid();
    await firestoreInfrastructureApi.set(`auditLogs/${id}`, entry.getSnapshot());
  }

  async findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      "auditLogs",
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );

    return docs
      .map((doc) => toAuditLogEntity(doc.id, doc.data))
      .sort((left, right) => right.occurredAtISO.localeCompare(left.occurredAtISO));
  }

  async findByWorkspaceIds(
    workspaceIds: string[],
    maxCount = 200,
  ): Promise<AuditLogEntity[]> {
    if (workspaceIds.length === 0) {
      return [];
    }

    const chunks: string[][] = [];
    for (let index = 0; index < workspaceIds.length; index += 10) {
      chunks.push(workspaceIds.slice(index, index + 10));
    }

    const perChunkLimit = Math.max(1, Math.ceil(maxCount / chunks.length));

    const documents = await Promise.all(
      chunks.map((chunk) =>
        firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
          "auditLogs",
          [{ field: "workspaceId", op: "in", value: chunk }],
          { limit: perChunkLimit },
        ),
      ),
    );

    return documents
      .flatMap((document) => document)
      .map((doc) => toAuditLogEntity(doc.id, doc.data))
      .sort((left, right) => right.occurredAtISO.localeCompare(left.occurredAtISO))
      .slice(0, maxCount);
  }
}
