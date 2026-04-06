/**
 * Module: knowledge-database
 * Layer: domain/repositories
 */

import type { DatabaseRecord } from "../entities/record.entity";

export interface CreateRecordInput {
  readonly databaseId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly properties?: Record<string, unknown>;
  readonly createdByUserId: string;
  readonly pageId?: string | null;
}

export interface UpdateRecordInput {
  readonly id: string;
  readonly accountId: string;
  readonly properties: Record<string, unknown>;
}

export interface IDatabaseRecordRepository {
  create(input: CreateRecordInput): Promise<DatabaseRecord>;
  update(input: UpdateRecordInput): Promise<DatabaseRecord | null>;
  delete(accountId: string, recordId: string): Promise<void>;
  findById(accountId: string, recordId: string): Promise<DatabaseRecord | null>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecord[]>;
}
