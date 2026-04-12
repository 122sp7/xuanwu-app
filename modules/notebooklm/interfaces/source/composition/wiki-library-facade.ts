/**
 * Composition: wiki-library-facade
 *
 * Pre-wired facade functions for wiki library use cases.
 * Encapsulates the lazy singleton repository pattern so the subdomain
 * api/index.ts can re-export clean function signatures without importing
 * infrastructure directly.
 */

import type { IWikiLibraryRepository } from "../../../subdomains/source/domain/repositories/IWikiLibraryRepository";
import {
  listWikiLibraries as _listWikiLibraries,
  createWikiLibrary as _createWikiLibrary,
  addWikiLibraryField as _addWikiLibraryField,
  createWikiLibraryRow as _createWikiLibraryRow,
  getWikiLibrarySnapshot as _getWikiLibrarySnapshot,
} from "../../../subdomains/source/application/use-cases/wiki-library.use-cases";
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../../../subdomains/source/domain/entities/WikiLibrary";
import { makeWikiLibraryAdapter } from "./adapters";

// Lazy singleton — no module-scope side effects.
let _libraryRepo: IWikiLibraryRepository | null = null;

function getLibraryRepo(): IWikiLibraryRepository {
  if (!_libraryRepo) _libraryRepo = makeWikiLibraryAdapter();
  return _libraryRepo;
}

export function listWikiLibraries(accountId: string, workspaceId?: string): Promise<WikiLibrary[]> {
  return _listWikiLibraries(accountId, workspaceId, getLibraryRepo());
}

export function createWikiLibrary(input: CreateWikiLibraryInput): Promise<WikiLibrary> {
  return _createWikiLibrary(input, getLibraryRepo());
}

export function addWikiLibraryField(input: AddWikiLibraryFieldInput): Promise<WikiLibraryField> {
  return _addWikiLibraryField(input, getLibraryRepo());
}

export function createWikiLibraryRow(input: CreateWikiLibraryRowInput): Promise<WikiLibraryRow> {
  return _createWikiLibraryRow(input, getLibraryRepo());
}

export function getWikiLibrarySnapshot(
  accountId: string,
  libraryId: string,
): ReturnType<typeof _getWikiLibrarySnapshot> {
  return _getWikiLibrarySnapshot(accountId, libraryId, getLibraryRepo());
}
