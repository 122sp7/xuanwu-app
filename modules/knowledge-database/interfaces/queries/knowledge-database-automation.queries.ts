/**
 * Module: knowledge-database
 * Layer: interfaces/queries
 * Purpose: Automation read-side queries.
 */

import type { DatabaseAutomation } from "../../domain/entities/database-automation.entity";
import { FirebaseAutomationRepository } from "../../infrastructure/firebase/FirebaseAutomationRepository";
import { ListAutomationsUseCase } from "../../application/use-cases/automation.use-cases";

export async function getAutomations(
  accountId: string,
  databaseId: string,
): Promise<DatabaseAutomation[]> {
  return new ListAutomationsUseCase(new FirebaseAutomationRepository()).execute(accountId, databaseId);
}
