import type { AuditLogEntrySnapshot, AuditAction } from "../../../domain/entities/AuditLogEntry";
import type { AuditLogRepository, AuditLogQuery } from "../../../domain/repositories/AuditLogRepository";

export class InMemoryAuditLogRepository implements AuditLogRepository {
  private readonly entries: AuditLogEntrySnapshot[] = [];

  async append(snapshot: AuditLogEntrySnapshot): Promise<void> {
    this.entries.push(snapshot);
  }

  async query(params: AuditLogQuery): Promise<AuditLogEntrySnapshot[]> {
    let results = [...this.entries];
    if (params.organizationId) results = results.filter((e) => e.organizationId === params.organizationId);
    if (params.workspaceId) results = results.filter((e) => e.workspaceId === params.workspaceId);
    if (params.actorId) results = results.filter((e) => e.actorId === params.actorId);
    if (params.action) results = results.filter((e) => e.action === (params.action as AuditAction));
    if (params.resourceType) results = results.filter((e) => e.resourceType === params.resourceType);
    if (params.resourceId) results = results.filter((e) => e.resourceId === params.resourceId);
    if (params.fromISO) results = results.filter((e) => e.occurredAtISO >= params.fromISO!);
    if (params.toISO) results = results.filter((e) => e.occurredAtISO <= params.toISO!);
    const offset = params.offset ?? 0;
    return results.slice(offset, offset + (params.limit ?? 100));
  }
}
