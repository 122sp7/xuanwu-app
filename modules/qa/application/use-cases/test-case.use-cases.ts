import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TestCaseRepository } from "../../domain/repositories/TestCaseRepository";
import type { TestCaseEntity, CreateTestCaseInput } from "../../domain/entities/TestCase";

export class CreateTestCaseUseCase {
  constructor(private readonly testCaseRepository: TestCaseRepository) {}

  async execute(input: CreateTestCaseInput): Promise<CommandResult> {
    const tenantId = input.tenantId.trim();
    const teamId = input.teamId.trim();
    const workspaceId = input.workspaceId.trim();
    const taskId = input.taskId.trim();
    const title = input.title.trim();

    if (!tenantId) return commandFailureFrom("TC_TENANT_REQUIRED", "Tenant is required.");
    if (!teamId) return commandFailureFrom("TC_TEAM_REQUIRED", "Team is required.");
    if (!workspaceId) return commandFailureFrom("TC_WORKSPACE_REQUIRED", "Workspace is required.");
    if (!taskId) return commandFailureFrom("TC_TASK_REQUIRED", "Task id is required.");
    if (!title) return commandFailureFrom("TC_TITLE_REQUIRED", "Test case title is required.");

    const tc = await this.testCaseRepository.create({ ...input, tenantId, teamId, workspaceId, taskId, title });
    return commandSuccess(tc.id, Date.now());
  }
}

export class DeleteTestCaseUseCase {
  constructor(private readonly testCaseRepository: TestCaseRepository) {}

  async execute(testCaseId: string): Promise<CommandResult> {
    const normalizedId = testCaseId.trim();
    if (!normalizedId) return commandFailureFrom("TC_ID_REQUIRED", "Test case id is required.");
    await this.testCaseRepository.delete(normalizedId);
    return commandSuccess(normalizedId, Date.now());
  }
}

export class ListTestCasesUseCase {
  constructor(private readonly testCaseRepository: TestCaseRepository) {}

  async execute(workspaceId: string): Promise<TestCaseEntity[]> {
    const normalizedId = workspaceId.trim();
    if (!normalizedId) return [];
    return this.testCaseRepository.findByWorkspaceId(normalizedId);
  }
}
