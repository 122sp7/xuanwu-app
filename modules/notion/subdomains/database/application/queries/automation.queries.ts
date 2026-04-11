import type { DatabaseAutomationSnapshot } from "../../domain/aggregates/DatabaseAutomation";
import type { IAutomationRepository } from "../../domain/repositories/IAutomationRepository";

export class ListAutomationsUseCase {
  constructor(private readonly repo: IAutomationRepository) {}

  async execute(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
    return this.repo.listByDatabase(accountId, databaseId);
  }
}
