/**
 * Module: knowledge-database
 * Layer: domain/repositories
 */

import type { View, ViewType } from "../entities/view.entity";

export interface CreateViewInput {
  readonly databaseId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly type: ViewType;
  readonly createdByUserId: string;
}

export interface UpdateViewInput {
  readonly id: string;
  readonly accountId: string;
  readonly name?: string;
  readonly filters?: View["filters"];
  readonly sorts?: View["sorts"];
  readonly groupBy?: View["groupBy"];
  readonly visibleFieldIds?: string[];
  readonly hiddenFieldIds?: string[];
}

export interface IViewRepository {
  create(input: CreateViewInput): Promise<View>;
  update(input: UpdateViewInput): Promise<View | null>;
  delete(accountId: string, viewId: string): Promise<void>;
  findById(accountId: string, viewId: string): Promise<View | null>;
  listByDatabase(accountId: string, databaseId: string): Promise<View[]>;
}
