import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";
import { AuditEntry } from "../../domain/entities/AuditEntry";
import type { AuditEntrySnapshot, RecordAuditEntryInput } from "../../domain/entities/AuditEntry";

export class RecordAuditEntryUseCase {
  constructor(private readonly auditRepo: AuditRepository) {}

  async execute(input: RecordAuditEntryInput): Promise<CommandResult> {
    try {
      const entry = AuditEntry.record(uuid(), input);
      await this.auditRepo.save(entry.getSnapshot());
      return commandSuccess(entry.id, Date.now());
    } catch (err) {
      return commandFailureFrom("AUDIT_RECORD_FAILED", err instanceof Error ? err.message : "Failed to record audit entry.");
    }
  }
}

export class ListWorkspaceAuditEntriesUseCase {
  constructor(private readonly auditRepo: AuditRepository) {}

  async execute(workspaceId: string): Promise<AuditEntrySnapshot[]> {
    return this.auditRepo.findByWorkspaceId(workspaceId);
  }
}
