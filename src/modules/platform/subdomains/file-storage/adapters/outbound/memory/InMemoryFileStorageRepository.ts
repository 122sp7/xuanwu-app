import type { StoredFile } from "../../../domain/entities/StoredFile";
import type { FileStorageRepository } from "../../../domain/repositories/FileStorageRepository";

export class InMemoryFileStorageRepository implements FileStorageRepository {
  private readonly store = new Map<string, StoredFile>();

  async save(file: StoredFile): Promise<void> {
    this.store.set(file.fileId, file);
  }

  async findById(fileId: string): Promise<StoredFile | null> {
    return this.store.get(fileId) ?? null;
  }

  async listByOwner(ownerId: string): Promise<StoredFile[]> {
    return [...this.store.values()].filter((file) => file.ownerId === ownerId && file.deletedAtISO === null);
  }

  async delete(fileId: string): Promise<void> {
    const existing = this.store.get(fileId);
    if (!existing) return;
    this.store.set(fileId, {
      ...existing,
      deletedAtISO: new Date().toISOString(),
    });
  }
}
