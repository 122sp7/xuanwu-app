import type { FinanceAggregateEntity } from "../../domain/entities/Finance";
import { FirebaseFinanceRepository } from "../../infrastructure/firebase/FirebaseFinanceRepository";

const financeRepo = new FirebaseFinanceRepository();

export async function getFinanceByWorkspaceId(
  workspaceId: string,
): Promise<FinanceAggregateEntity | null> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return null;
  }

  return financeRepo.findByWorkspaceId(normalizedWorkspaceId);
}
