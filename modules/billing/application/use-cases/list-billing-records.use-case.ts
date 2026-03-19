import type { BillingRecord, BillingRecordListScope } from "../../domain/entities/BillingRecord";
import type { BillingRepository } from "../../domain/repositories/BillingRepository";

export class ListBillingRecordsUseCase {
  constructor(private readonly billingRepository: BillingRepository) {}

  async execute(scope: BillingRecordListScope): Promise<readonly BillingRecord[]> {
    const organizationId = scope.organizationId.trim();
    const workspaceId = scope.workspaceId?.trim();

    if (!organizationId) {
      return [];
    }

    return this.billingRepository.list({
      organizationId,
      ...(workspaceId ? { workspaceId } : {}),
    });
  }
}
