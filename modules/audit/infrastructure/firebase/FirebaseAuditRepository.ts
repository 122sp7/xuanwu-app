import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { AuditLogEntity, AuditLogSource } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

function toAuditLogEntity(id: string, data: Record<string, unknown>): AuditLogEntity {
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    actorId: typeof data.actorId === "string" ? data.actorId : "system",
    action: typeof data.action === "string" ? data.action : "unknown",
    detail: typeof data.detail === "string" ? data.detail : "",
    source:
      data.source === "finance" ||
      data.source === "notification" ||
      data.source === "system"
        ? (data.source as AuditLogSource)
        : "workspace",
    occurredAtISO:
      typeof data.occurredAtISO === "string"
        ? data.occurredAtISO
        : new Date(0).toISOString(),
  };
}

export class FirebaseAuditRepository implements AuditRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]> {
    const snaps = await getDocs(
      query(collection(this.db, "auditLogs"), where("workspaceId", "==", workspaceId)),
    );

    return snaps.docs
      .map((doc) => toAuditLogEntity(doc.id, doc.data() as Record<string, unknown>))
      .sort((left, right) => right.occurredAtISO.localeCompare(left.occurredAtISO));
  }
}
