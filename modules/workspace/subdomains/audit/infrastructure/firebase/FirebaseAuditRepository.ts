import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
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
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async save(entry: AuditEntry): Promise<void> {
    await addDoc(collection(this.db, "auditLogs"), entry.getSnapshot());
  }

  async findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]> {
    const snaps = await getDocs(
      query(collection(this.db, "auditLogs"), where("workspaceId", "==", workspaceId)),
    );

    return snaps.docs
      .map((doc) => toAuditLogEntity(doc.id, doc.data() as Record<string, unknown>))
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

    const snapshots = await Promise.all(
      chunks.map((chunk) =>
        getDocs(
          query(
            collection(this.db, "auditLogs"),
            where("workspaceId", "in", chunk),
            limit(perChunkLimit),
          ),
        ),
      ),
    );

    return snapshots
      .flatMap((snapshot) => snapshot.docs)
      .map((doc) => toAuditLogEntity(doc.id, doc.data() as Record<string, unknown>))
      .sort((left, right) => right.occurredAtISO.localeCompare(left.occurredAtISO))
      .slice(0, maxCount);
  }
}
