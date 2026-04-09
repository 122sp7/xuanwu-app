/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/repositories
 * Port: IWikiLibraryRepository — persistence contract for WikiLibrary aggregates.
 */

import type { WikiLibrary, WikiLibraryField, WikiLibraryRow } from "../entities/WikiLibrary";

export interface IWikiLibraryRepository {
  listByAccountId(accountId: string): Promise<WikiLibrary[]>;
  findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>;
  create(library: WikiLibrary): Promise<void>;
  createField(accountId: string, field: WikiLibraryField): Promise<void>;
  listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>;
  createRow(accountId: string, row: WikiLibraryRow): Promise<void>;
  listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>;
}
