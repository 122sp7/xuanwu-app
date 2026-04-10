/**
 * Module: workspace/subdomains/scheduling
 * Layer: application/use-cases
 * Purpose: Application services — orchestrate domain logic.
 */

import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";

import type { WorkDemand } from "../domain/types";
import type { IDemandRepository } from "../domain/repository";
import type { AssignMemberInput, CreateDemandInput } from "./dto/work-demand.dto";

export class SubmitWorkDemandUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(input: CreateDemandInput): Promise<CommandResult> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const demand: WorkDemand = {
        id,
        workspaceId: input.workspaceId,
        accountId: input.accountId,
        requesterId: input.requesterId,
        title: input.title,
        description: input.description ?? "",
        priority: input.priority,
        scheduledAt: input.scheduledAt,
        status: "open",
        createdAtISO: now,
        updatedAtISO: now,
      };
      await this.repo.save(demand);
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORK_DEMAND_SUBMIT_FAILED",
        err instanceof Error ? err.message : "Failed to submit work demand",
      );
    }
  }
}

export class AssignWorkDemandUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(input: AssignMemberInput): Promise<CommandResult> {
    try {
      const demand = await this.repo.findById(input.demandId);
      if (!demand) {
        return commandFailureFrom("DEMAND_NOT_FOUND", `Demand ${input.demandId} not found`);
      }
      const updated: WorkDemand = {
        ...demand,
        assignedUserId: input.userId,
        status: "in_progress",
        updatedAtISO: new Date().toISOString(),
      };
      await this.repo.update(updated);
      return commandSuccess(input.demandId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WORK_DEMAND_ASSIGN_FAILED",
        err instanceof Error ? err.message : "Failed to assign work demand",
      );
    }
  }
}

export class ListWorkspaceDemandsUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(workspaceId: string): Promise<WorkDemand[]> {
    return this.repo.listByWorkspace(workspaceId);
  }
}

export class ListAccountDemandsUseCase {
  constructor(private readonly repo: IDemandRepository) {}

  async execute(accountId: string): Promise<WorkDemand[]> {
    return this.repo.listByAccount(accountId);
  }
}
