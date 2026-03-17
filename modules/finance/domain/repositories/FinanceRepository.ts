/**
 * FinanceRepository — Port for finance aggregate persistence.
 */

import type { FinanceAggregateEntity, FinanceLifecycleStage, FinanceClaimLineItem } from "../entities/Finance";

export interface FinanceRepository {
  findByWorkspaceId(workspaceId: string): Promise<FinanceAggregateEntity | null>;
  save(finance: FinanceAggregateEntity): Promise<void>;
  advanceStage(workspaceId: string, stage: FinanceLifecycleStage): Promise<void>;
  submitClaim(workspaceId: string, lineItems: FinanceClaimLineItem[]): Promise<void>;
  recordPaymentReceived(workspaceId: string, amount: number, receivedAt: string): Promise<void>;
}
