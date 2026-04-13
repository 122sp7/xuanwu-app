/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: DatabaseRepository — persistence contract for the Database aggregate.
 */

import type { DatabaseSnapshot, Field, FieldType } from "../aggregates/Database";

export interface CreateDatabaseInput {
  accountId: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdByUserId: string;
}

export interface UpdateDatabaseInput {
  id: string;
  accountId: string;
  name?: string;
  description?: string;
  icon?: string;
  coverImageUrl?: string;
}

export interface AddFieldInput {
  databaseId: string;
  accountId: string;
  name: string;
  type: FieldType;
  config?: Record<string, unknown>;
  required?: boolean;
}

export interface DatabaseRepository {
  create(input: CreateDatabaseInput): Promise<DatabaseSnapshot>;
  update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot>;
  addField(input: AddFieldInput): Promise<Field>;
  archive(id: string, accountId: string): Promise<void>;
  findById(id: string, accountId: string): Promise<DatabaseSnapshot | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]>;
}
