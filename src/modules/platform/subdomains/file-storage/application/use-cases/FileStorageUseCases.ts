import { v4 as uuid } from "uuid";
import type { StoredFile } from "../../domain/entities/StoredFile";
import type { FileStorageRepository } from "../../domain/repositories/FileStorageRepository";

export interface CreateStoredFileInput {
  readonly ownerId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly url: string;
}

export interface GetStoredFileInput {
  readonly fileId: string;
}

export interface ListStoredFilesInput {
  readonly ownerId: string;
}

export interface DeleteStoredFileInput {
  readonly fileId: string;
}

export class CreateStoredFileUseCase {
  constructor(private readonly repository: FileStorageRepository) {}

  async execute(input: CreateStoredFileInput): Promise<StoredFile> {
    const now = new Date().toISOString();
    const file: StoredFile = {
      fileId: uuid(),
      ownerId: input.ownerId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      url: input.url,
      createdAtISO: now,
      deletedAtISO: null,
    };
    await this.repository.save(file);
    return file;
  }
}

export class GetStoredFileUseCase {
  constructor(private readonly repository: FileStorageRepository) {}

  async execute(input: GetStoredFileInput): Promise<StoredFile | null> {
    return this.repository.findById(input.fileId);
  }
}

export class ListStoredFilesUseCase {
  constructor(private readonly repository: FileStorageRepository) {}

  async execute(input: ListStoredFilesInput): Promise<StoredFile[]> {
    return this.repository.listByOwner(input.ownerId);
  }
}

export class DeleteStoredFileUseCase {
  constructor(private readonly repository: FileStorageRepository) {}

  async execute(input: DeleteStoredFileInput): Promise<void> {
    await this.repository.delete(input.fileId);
  }
}
