/**
 * Module: notion/subdomains/database
 * Layer: interfaces/queries
 * Purpose: Read-side queries for database, record, view, and automation data.
 */

import {
  makeAutomationRepo,
  makeDatabaseRepo,
  makeRecordRepo,
  makeViewRepo,
} from "../../api/factories";
import type { DatabaseSnapshot } from "../../domain/aggregates/Database";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
import type { ViewSnapshot } from "../../domain/aggregates/View";
import type { DatabaseAutomationSnapshot } from "../../domain/aggregates/DatabaseAutomation";

export async function getDatabases(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]> {
  return makeDatabaseRepo().listByWorkspace(accountId, workspaceId);
}

export async function getDatabase(accountId: string, databaseId: string): Promise<DatabaseSnapshot | null> {
  return makeDatabaseRepo().findById(databaseId, accountId);
}

export async function getRecords(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]> {
  return makeRecordRepo().listByDatabase(accountId, databaseId);
}

export async function getViews(accountId: string, databaseId: string): Promise<ViewSnapshot[]> {
  return makeViewRepo().listByDatabase(accountId, databaseId);
}

export async function getAutomations(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
  return makeAutomationRepo().listByDatabase(accountId, databaseId);
}
