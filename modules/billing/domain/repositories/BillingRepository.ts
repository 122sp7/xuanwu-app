import type { BillingRecord, BillingRecordListScope } from "../entities/BillingRecord";

export interface BillingRepository {
  list(scope: BillingRecordListScope): Promise<readonly BillingRecord[]>;
}
