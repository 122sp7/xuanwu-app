/**
 * Module: notion/subdomains/database
 * Layer: domain/repositories
 * Purpose: IViewRepository — persistence contract for View aggregate.
 */

import type { ViewSnapshot, ViewType } from "../aggregates/View";

export interface CreateViewInput {
  accountId: string;
  workspaceId: string;
  databaseId: string;
  name: string;
  type: ViewType;
  createdByUserId: string;
}

export interface UpdateViewInput {
  id: string;
  accountId: string;
  name?: string;
  filters?: import("../aggregates/View").FilterRule[];
  sorts?: import("../aggregates/View").SortRule[];
  visibleFieldIds?: string[];
  hiddenFieldIds?: string[];
}

export interface IViewRepository {
  create(input: CreateViewInput): Promise<ViewSnapshot>;
  update(input: UpdateViewInput): Promise<ViewSnapshot>;
  delete(id: string, accountId: string): Promise<void>;
  listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]>;
}
