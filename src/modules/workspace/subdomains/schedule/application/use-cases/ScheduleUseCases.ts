import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { DemandRepository } from "../../domain/repositories/DemandRepository";
import { WorkDemand } from "../../domain/entities/WorkDemand";
import type { CreateWorkDemandInput, WorkDemandSnapshot } from "../../domain/entities/WorkDemand";

export class CreateWorkDemandUseCase {
  constructor(private readonly demandRepo: DemandRepository) {}

  async execute(input: CreateWorkDemandInput): Promise<CommandResult> {
    try {
      const demand = WorkDemand.create(uuid(), input);
      await this.demandRepo.save(demand.getSnapshot());
      return commandSuccess(demand.id, Date.now());
    } catch (err) {
      return commandFailureFrom("SCHEDULE_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create demand.");
    }
  }
}

export class AssignWorkDemandUseCase {
  constructor(private readonly demandRepo: DemandRepository) {}

  async execute(demandId: string, assignedUserId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.demandRepo.findById(demandId);
      if (!snapshot) return commandFailureFrom("SCHEDULE_NOT_FOUND", "Work demand not found.");
      const demand = WorkDemand.reconstitute(snapshot);
      demand.assign(assignedUserId);
      await this.demandRepo.update(demand.getSnapshot());
      return commandSuccess(demandId, Date.now());
    } catch (err) {
      return commandFailureFrom("SCHEDULE_ASSIGN_FAILED", err instanceof Error ? err.message : "Failed to assign demand.");
    }
  }
}

export class ListWorkspaceDemandsUseCase {
  constructor(private readonly demandRepo: DemandRepository) {}

  async execute(workspaceId: string): Promise<WorkDemandSnapshot[]> {
    return this.demandRepo.listByWorkspace(workspaceId);
  }
}
