/**
 * Module: notion/subdomains/knowledge-database
 * Layer: interfaces/queries
 * Purpose: Read-side queries for database, record, view, and automation data.
 */

import {
  makeAutomationRepo,
  makeDatabaseRepo,
  makeRecordRepo,
  makeViewRepo,
} from "../composition/repositories";
import type { DatabaseSnapshot, DatabaseRecordSnapshot, ViewSnapshot, DatabaseAutomationSnapshot } from "../../../subdomains/knowledge-database/application/dto/knowledge-database.dto";

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
