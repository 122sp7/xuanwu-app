import type { DatabaseAutomationSnapshot } from "../../domain/aggregates/DatabaseAutomation";
import type { AutomationRepository } from "../../domain/repositories/AutomationRepository";

export class ListAutomationsUseCase {
  constructor(private readonly repo: AutomationRepository) {}

  async execute(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
    return this.repo.listByDatabase(accountId, databaseId);
  }
}
