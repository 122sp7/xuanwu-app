import { v4 as uuid } from "@lib-uuid";
import { AuditEntry, type RecordAuditEntryInput } from "../../domain/aggregates/AuditEntry";
import type { AuditDomainEventType } from "../../domain/events";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

export class RecordAuditEntryUseCase {
  constructor(private readonly repo: AuditRepository) {}

  async execute(input: RecordAuditEntryInput): Promise<AuditDomainEventType[]> {
    const id = uuid();
    const entry = AuditEntry.record(id, input);
    await this.repo.save(entry);
    return entry.pullDomainEvents();
  }
}
