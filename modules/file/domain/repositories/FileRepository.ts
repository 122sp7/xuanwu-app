import type { File } from "../entities/File";
import type { FileVersion } from "../entities/FileVersion";

export interface ListWorkspaceFilesScope {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
}

export interface FileRepository {
  findById(fileId: string): Promise<File | null>;
  listByWorkspace(scope: ListWorkspaceFilesScope): Promise<readonly File[]>;
  save(file: File, versions?: readonly FileVersion[]): Promise<void>;
}
