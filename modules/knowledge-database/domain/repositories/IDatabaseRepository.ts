/**
 * Module: knowledge-database
 * Layer: domain/repositories
 */

import type { Database, Field } from "../entities/database.entity";

export interface CreateDatabaseInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly description?: string | null;
  readonly createdByUserId: string;
}

export interface UpdateDatabaseInput {
  readonly id: string;
  readonly accountId: string;
  readonly name?: string;
  readonly description?: string | null;
  readonly icon?: string | null;
  readonly coverImageUrl?: string | null;
}

export interface AddFieldInput {
  readonly databaseId: string;
  readonly accountId: string;
  readonly field: Omit<Field, "id" | "order">;
}

export interface IDatabaseRepository {
  create(input: CreateDatabaseInput): Promise<Database>;
  update(input: UpdateDatabaseInput): Promise<Database | null>;
  addField(input: AddFieldInput): Promise<Database | null>;
  archive(accountId: string, databaseId: string): Promise<void>;
  findById(accountId: string, databaseId: string): Promise<Database | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<Database[]>;
}
