import type { TestCaseEntity } from "../../domain/entities/TestCase";
import { ListTestCasesUseCase } from "../../application/use-cases/quality-check.use-cases";
import { FirebaseTestCaseRepository } from "../../infrastructure/firebase/FirebaseTestCaseRepository";

export async function getTestCases(workspaceId: string): Promise<TestCaseEntity[]> {
  return new ListTestCasesUseCase(new FirebaseTestCaseRepository()).execute(workspaceId);
}
