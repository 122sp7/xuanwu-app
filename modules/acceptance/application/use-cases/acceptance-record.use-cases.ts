import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { AcceptanceRecord, CreateAcceptanceRecordInput } from "../../domain/entities/AcceptanceRecord";
import type { AcceptanceRecordRepository, AcceptanceRecordTransitionExtra } from "../../domain/repositories/AcceptanceRecordRepository";
import { canTransitionAcceptance, type AcceptanceLifecycleStatus } from "../../domain/value-objects/acceptance-state";

export class CreateAcceptanceRecordUseCase {
  constructor(private readonly repo: AcceptanceRecordRepository) {}

  async execute(input: CreateAcceptanceRecordInput): Promise<CommandResult> {
    const tenantId = input.tenantId.trim();
    const teamId = input.teamId.trim();
    const workspaceId = input.workspaceId.trim();
    const taskId = input.taskId.trim();

    if (!tenantId) return commandFailureFrom("AR_TENANT_REQUIRED", "Tenant is required.");
    if (!teamId) return commandFailureFrom("AR_TEAM_REQUIRED", "Team is required.");
    if (!workspaceId) return commandFailureFrom("AR_WORKSPACE_REQUIRED", "Workspace is required.");
    if (!taskId) return commandFailureFrom("AR_TASK_REQUIRED", "Task id is required.");
    if (!input.items.length) return commandFailureFrom("AR_ITEMS_REQUIRED", "At least one acceptance item is required.");

    const record = await this.repo.create({ ...input, tenantId, teamId, workspaceId, taskId });
    return commandSuccess(record.id, Date.now());
  }
}

export class TransitionAcceptanceRecordUseCase {
  constructor(private readonly repo: AcceptanceRecordRepository) {}

  async execute(
    recordId: string,
    to: AcceptanceLifecycleStatus,
    extra?: AcceptanceRecordTransitionExtra,
  ): Promise<CommandResult> {
    const normalizedId = recordId.trim();
    if (!normalizedId) return commandFailureFrom("AR_ID_REQUIRED", "Record id is required.");

    const record = await this.repo.findById(normalizedId);
    if (!record) return commandFailureFrom("AR_NOT_FOUND", "Acceptance record not found.");

    if (!canTransitionAcceptance(record.status, to)) {
      return commandFailureFrom(
        "AR_INVALID_TRANSITION",
        `Cannot transition from "${record.status}" to "${to}".`,
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.repo.transitionStatus(normalizedId, to, nowISO, extra);
    if (!updated) return commandFailureFrom("AR_NOT_FOUND", "Record not found after transition.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ListAcceptanceRecordsUseCase {
  constructor(private readonly repo: AcceptanceRecordRepository) {}

  async execute(workspaceId: string): Promise<AcceptanceRecord[]> {
    const normalizedId = workspaceId.trim();
    if (!normalizedId) return [];
    return this.repo.findByWorkspaceId(normalizedId);
  }
}
