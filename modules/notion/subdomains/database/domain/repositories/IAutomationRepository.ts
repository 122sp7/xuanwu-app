/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: Repository interface for DatabaseAutomation aggregate.
 */

import type {
  DatabaseAutomationSnapshot,
  AutomationCondition,
  AutomationAction,
  AutomationTrigger,
} from "../aggregates/DatabaseAutomation";

export interface CreateAutomationInput {
  databaseId: string;
  accountId: string;
  name: string;
  trigger: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
  createdByUserId: string;
}

export interface UpdateAutomationInput {
  id: string;
  accountId: string;
  databaseId: string;
  name?: string;
  enabled?: boolean;
  trigger?: AutomationTrigger;
  triggerFieldId?: string;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
}

export interface IAutomationRepository {
  create(input: CreateAutomationInput): Promise<DatabaseAutomationSnapshot>;
  update(input: UpdateAutomationInput): Promise<DatabaseAutomationSnapshot | null>;
  delete(id: string, accountId: string, databaseId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]>;
}
