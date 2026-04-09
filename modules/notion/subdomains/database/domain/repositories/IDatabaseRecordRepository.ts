/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: IDatabaseRecordRepository — persistence contract for DatabaseRecord aggregate.
 */

import type { DatabaseRecordSnapshot } from "../aggregates/DatabaseRecord";

export interface CreateRecordInput {
  accountId: string;
  workspaceId: string;
  databaseId: string;
  pageId?: string;
  properties?: Record<string, unknown>;
  createdByUserId: string;
}

export interface UpdateRecordInput {
  id: string;
  accountId: string;
  properties: Record<string, unknown>;
}

export interface IDatabaseRecordRepository {
  create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot>;
  update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot>;
  delete(id: string, accountId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]>;
}
