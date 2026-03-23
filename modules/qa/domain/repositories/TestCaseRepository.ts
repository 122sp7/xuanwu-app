import type { TestCaseEntity, CreateTestCaseInput } from "../entities/TestCase";

export interface TestCaseRepository {
  create(input: CreateTestCaseInput): Promise<TestCaseEntity>;
  delete(testCaseId: string): Promise<void>;
  findById(testCaseId: string): Promise<TestCaseEntity | null>;
  findByWorkspaceId(workspaceId: string): Promise<TestCaseEntity[]>;
  findByTaskId(taskId: string): Promise<TestCaseEntity[]>;
}
