import type { StoredFile } from "../entities/StoredFile";

export interface FileStorageRepository {
  save(file: StoredFile): Promise<void>;
  findById(fileId: string): Promise<StoredFile | null>;
  listByOwner(ownerId: string): Promise<StoredFile[]>;
  delete(fileId: string): Promise<void>;
}
