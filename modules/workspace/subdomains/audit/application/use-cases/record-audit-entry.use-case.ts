import { v4 as uuid } from "@lib-uuid";
import type { RecordAuditEntryInput } from "../../domain/aggregates/AuditEntry";
import type { AuditDomainEventType } from "../../domain/events";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";
import { AuditRecordingService } from "../../domain/services/AuditRecordingService";

export class RecordAuditEntryUseCase {
  constructor(
    private readonly repo: AuditRepository,
    private readonly auditRecordingService: AuditRecordingService = new AuditRecordingService(),
  ) {}

  async execute(input: RecordAuditEntryInput): Promise<AuditDomainEventType[]> {
    const id = uuid();
    const entry = this.auditRecordingService.record(id, input);
    await this.repo.save(entry);
    return entry.pullDomainEvents();
  }
}
