import type { BillingRecord, BillingRecordListScope } from "../../domain/entities/BillingRecord";
import type { BillingRepository } from "../../domain/repositories/BillingRepository";

export class InMemoryBillingRepository implements BillingRepository {
  constructor(private readonly records: readonly BillingRecord[] = []) {}

  async list(scope: BillingRecordListScope): Promise<readonly BillingRecord[]> {
    return this.records.filter((record) => {
      if (record.organizationId !== scope.organizationId) {
        return false;
      }

      if (scope.workspaceId && record.workspaceId !== scope.workspaceId) {
        return false;
      }

      return true;
    });
  }
}
