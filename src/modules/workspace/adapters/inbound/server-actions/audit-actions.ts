"use server";

import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { RecordAuditEntrySchema } from "../../../subdomains/audit/application/dto/AuditDTO";
import { createClientAuditUseCases } from "../../outbound/firebase-composition";
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";

// actorId injection from session is pending GAP-05 ADR decision.
// Until platform.AuthAPI.requireAuth() is available, actorId is accepted from
// client input via RecordAuditEntrySchema — tracked as GAP-05.

export async function recordAuditEntryAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = RecordAuditEntrySchema.parse(rawInput);
    const { recordAuditEntry } = createClientAuditUseCases();
    return recordAuditEntry.execute(input);
  } catch (err) {
    return commandFailureFrom("AUDIT_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function listAuditEntriesByWorkspaceAction(workspaceId: string): Promise<AuditEntrySnapshot[]> {
  try {
    const { listAuditEntriesByWorkspace } = createClientAuditUseCases();
    return listAuditEntriesByWorkspace(workspaceId);
  } catch {
    return [];
  }
}
