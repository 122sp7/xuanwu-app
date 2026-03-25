/**
 * Module: asset
 * Layer: domain/repositories
 * Purpose: Repository port for the WikiBeta library entity.
 */

import type {
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryRow,
} from "../entities/wiki-beta-library.types";

export interface WikiBetaLibraryRepository {
  listByAccountId(accountId: string): Promise<WikiBetaLibrary[]>;
  findById(accountId: string, libraryId: string): Promise<WikiBetaLibrary | null>;
  create(library: WikiBetaLibrary): Promise<void>;
  createField(accountId: string, field: WikiBetaLibraryField): Promise<void>;
  listFields(accountId: string, libraryId: string): Promise<WikiBetaLibraryField[]>;
  createRow(accountId: string, row: WikiBetaLibraryRow): Promise<void>;
  listRows(accountId: string, libraryId: string): Promise<WikiBetaLibraryRow[]>;
}
