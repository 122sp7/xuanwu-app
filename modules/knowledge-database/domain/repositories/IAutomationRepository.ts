/**
 * Module: knowledge-database
 * Layer: domain/repositories
 * Purpose: Repository interface for DatabaseAutomation aggregate.
 */

import type {
  DatabaseAutomation,
  CreateAutomationInput,
  UpdateAutomationInput,
} from "../entities/database-automation.entity";

export interface IAutomationRepository {
  create(input: CreateAutomationInput): Promise<DatabaseAutomation>;
  update(input: UpdateAutomationInput): Promise<DatabaseAutomation | null>;
  delete(id: string, accountId: string, databaseId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomation[]>;
}
