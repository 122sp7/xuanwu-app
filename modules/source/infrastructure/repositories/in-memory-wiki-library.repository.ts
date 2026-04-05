import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../../domain/entities/wiki-library.types";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";

function sortByDateDesc<T extends { updatedAt?: Date; createdAt?: Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = (a.updatedAt ?? a.createdAt ?? new Date(0)).getTime();
    const bTime = (b.updatedAt ?? b.createdAt ?? new Date(0)).getTime();
    return bTime - aTime;
  });
}

export class InMemoryWikiLibraryRepository implements WikiLibraryRepository {
  private readonly libraries = new Map<string, Map<string, WikiLibrary>>();
  private readonly fields = new Map<string, Map<string, WikiLibraryField>>();
  private readonly rows = new Map<string, Map<string, WikiLibraryRow>>();

  async listByAccountId(accountId: string): Promise<WikiLibrary[]> {
    const map = this.libraries.get(accountId);
    if (!map) return [];
    return sortByDateDesc(Array.from(map.values()));
  }

  async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null> {
    const map = this.libraries.get(accountId);
    if (!map) return null;
    return map.get(libraryId) ?? null;
  }

  async create(library: WikiLibrary): Promise<void> {
    const map = this.getOrCreateLibraries(library.accountId);
    if (map.has(library.id)) {
      throw new Error(`Library ${library.id} already exists`);
    }
    map.set(library.id, library);
  }

  async createField(accountId: string, field: WikiLibraryField): Promise<void> {
    const key = this.fieldsKey(accountId, field.libraryId);
    const map = this.getOrCreate(this.fields, key);
    if (map.has(field.id)) {
      throw new Error(`Field ${field.id} already exists`);
    }
    map.set(field.id, field);
  }

  async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]> {
    const key = this.fieldsKey(accountId, libraryId);
    const map = this.fields.get(key);
    if (!map) return [];
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, "zh-Hant"));
  }

  async createRow(accountId: string, row: WikiLibraryRow): Promise<void> {
    const key = this.rowsKey(accountId, row.libraryId);
    const map = this.getOrCreate(this.rows, key);
    if (map.has(row.id)) {
      throw new Error(`Row ${row.id} already exists`);
    }
    map.set(row.id, row);
  }

  async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]> {
    const key = this.rowsKey(accountId, libraryId);
    const map = this.rows.get(key);
    if (!map) return [];
    return sortByDateDesc(Array.from(map.values()));
  }

  private getOrCreateLibraries(accountId: string): Map<string, WikiLibrary> {
    return this.getOrCreate(this.libraries, accountId);
  }

  private getOrCreate<T>(bucket: Map<string, Map<string, T>>, key: string): Map<string, T> {
    const existing = bucket.get(key);
    if (existing) return existing;
    const created = new Map<string, T>();
    bucket.set(key, created);
    return created;
  }

  private fieldsKey(accountId: string, libraryId: string): string {
    return `${accountId}:${libraryId}`;
  }

  private rowsKey(accountId: string, libraryId: string): string {
    return `${accountId}:${libraryId}`;
  }
}
