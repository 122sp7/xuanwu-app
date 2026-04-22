import {
  AuditLogEntry,
  type AuditLogEntrySnapshot,
  type RecordAuditEntryInput,
} from "../../domain/entities/AuditLogEntry";
import type { AuditLogRepository, AuditLogQuery } from "../../domain/repositories/AuditLogRepository";

export class RecordAuditEntryUseCase {
  constructor(private readonly repo: AuditLogRepository) {}

  async execute(input: RecordAuditEntryInput): Promise<AuditLogEntrySnapshot> {
    const entry = AuditLogEntry.record(input);
    const snapshot = entry.getSnapshot();
    await this.repo.append(snapshot);
    return snapshot;
  }
}

export class QueryAuditLogUseCase {
  constructor(private readonly repo: AuditLogRepository) {}

  async execute(params: AuditLogQuery): Promise<AuditLogEntrySnapshot[]> {
    return this.repo.query(params);
  }
}
