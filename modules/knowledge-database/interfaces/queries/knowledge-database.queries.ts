/**
 * Module: knowledge-database
 * Layer: interfaces/queries
 * Direct-instantiation query functions (read-side, no server action overhead).
 */

import { FirebaseDatabaseRepository } from "../../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseRecordRepository } from "../../infrastructure/firebase/FirebaseRecordRepository";
import { FirebaseViewRepository } from "../../infrastructure/firebase/FirebaseViewRepository";
import type { Database } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";
import type { View } from "../../domain/entities/view.entity";

export async function getDatabases(accountId: string, workspaceId: string): Promise<Database[]> {
  const repo = new FirebaseDatabaseRepository();
  return repo.listByWorkspace(accountId, workspaceId);
}

export async function getDatabase(accountId: string, databaseId: string): Promise<Database | null> {
  const repo = new FirebaseDatabaseRepository();
  return repo.findById(accountId, databaseId);
}

export async function getRecords(accountId: string, databaseId: string): Promise<DatabaseRecord[]> {
  const repo = new FirebaseRecordRepository();
  return repo.listByDatabase(accountId, databaseId);
}

export async function getViews(accountId: string, databaseId: string): Promise<View[]> {
  const repo = new FirebaseViewRepository();
  return repo.listByDatabase(accountId, databaseId);
}
