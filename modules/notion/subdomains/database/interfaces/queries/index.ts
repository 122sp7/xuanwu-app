/**
 * Module: notion/subdomains/database
 * Layer: interfaces/queries
 * Purpose: Read-side queries for database, record, view, and automation data.
 */

import { FirebaseDatabaseRepository } from "../../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseDatabaseRecordRepository } from "../../infrastructure/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseViewRepository } from "../../infrastructure/firebase/FirebaseViewRepository";
import { FirebaseAutomationRepository } from "../../infrastructure/firebase/FirebaseAutomationRepository";
import type { DatabaseSnapshot } from "../../domain/aggregates/Database";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";
import type { ViewSnapshot } from "../../domain/aggregates/View";
import type { DatabaseAutomationSnapshot } from "../../domain/aggregates/DatabaseAutomation";

export async function getDatabases(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]> {
  return new FirebaseDatabaseRepository().listByWorkspace(accountId, workspaceId);
}

export async function getDatabase(accountId: string, databaseId: string): Promise<DatabaseSnapshot | null> {
  return new FirebaseDatabaseRepository().findById(databaseId, accountId);
}

export async function getRecords(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]> {
  return new FirebaseDatabaseRecordRepository().listByDatabase(accountId, databaseId);
}

export async function getViews(accountId: string, databaseId: string): Promise<ViewSnapshot[]> {
  return new FirebaseViewRepository().listByDatabase(accountId, databaseId);
}

export async function getAutomations(accountId: string, databaseId: string): Promise<DatabaseAutomationSnapshot[]> {
  return new FirebaseAutomationRepository().listByDatabase(accountId, databaseId);
}
