/**
 * Module: asset
 * Layer: domain/repositories
 * Purpose: Repository port for the Wiki library entity.
 */

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../entities/wiki-library.types";

export interface WikiLibraryRepository {
  listByAccountId(accountId: string): Promise<WikiLibrary[]>;
  findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>;
  create(library: WikiLibrary): Promise<void>;
  createField(accountId: string, field: WikiLibraryField): Promise<void>;
  listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>;
  createRow(accountId: string, row: WikiLibraryRow): Promise<void>;
  listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>;
}
