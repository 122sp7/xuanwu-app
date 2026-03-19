import type { BillingRecord } from "../../domain/entities/BillingRecord";
import { ListBillingRecordsUseCase } from "../../application/use-cases/list-billing-records.use-case";
import { InMemoryBillingRepository } from "../../infrastructure/memory/InMemoryBillingRepository";

export async function getOrganizationBillingRecords(
  organizationId: string,
  workspaceId?: string,
): Promise<readonly BillingRecord[]> {
  const useCase = new ListBillingRecordsUseCase(new InMemoryBillingRepository());
  return useCase.execute({ organizationId, workspaceId });
}
