/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/memory
 * Adapter: InMemoryWikiLibraryAdapter — in-memory implementation of WikiLibraryRepository.
 * Use case: local dev, tests, and no-firebase environments.
 */

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../../../subdomains/source/domain/entities/WikiLibrary";
import type { WikiLibraryRepository } from "../../../subdomains/source/domain/repositories/WikiLibraryRepository";

export class InMemoryWikiLibraryAdapter implements WikiLibraryRepository {
  private readonly libraries = new Map<string, WikiLibrary>();
  private readonly fields = new Map<string, WikiLibraryField>();
  private readonly rows = new Map<string, WikiLibraryRow>();

  async listByAccountId(accountId: string): Promise<WikiLibrary[]> {
    return [...this.libraries.values()]
      .filter((lib) => lib.accountId === accountId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null> {
    const lib = this.libraries.get(libraryId);
    if (!lib || lib.accountId !== accountId) return null;
    return lib;
  }

  async create(library: WikiLibrary): Promise<void> {
    this.libraries.set(library.id, library);
  }

  async createField(accountId: string, field: WikiLibraryField): Promise<void> {
    const lib = this.libraries.get(field.libraryId);
    if (!lib || lib.accountId !== accountId) throw new Error("library not found");
    this.fields.set(field.id, field);
  }

  async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]> {
    return [...this.fields.values()]
      .filter((f) => f.libraryId === libraryId)
      .filter(() => {
        const lib = this.libraries.get(libraryId);
        return !!(lib && lib.accountId === accountId);
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createRow(accountId: string, row: WikiLibraryRow): Promise<void> {
    const lib = this.libraries.get(row.libraryId);
    if (!lib || lib.accountId !== accountId) throw new Error("library not found");
    this.rows.set(row.id, row);
  }

  async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]> {
    return [...this.rows.values()]
      .filter((r) => r.libraryId === libraryId)
      .filter(() => {
        const lib = this.libraries.get(libraryId);
        return !!(lib && lib.accountId === accountId);
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}
