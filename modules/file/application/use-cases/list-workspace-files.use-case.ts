import type { FileRepository, ListWorkspaceFilesScope } from "../../domain/repositories/FileRepository";
import type { WorkspaceFileListItemDto } from "../dto/file.dto";

const DEFAULT_FILE_SOURCE = "file-module";
const DEFAULT_FILE_DETAIL = "File metadata mapped from current workspace context.";

export class ListWorkspaceFilesUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  execute(scope: ListWorkspaceFilesScope): WorkspaceFileListItemDto[] {
    const workspaceId = scope.workspaceId.trim();
    const organizationId = scope.organizationId.trim();
    const actorAccountId = scope.actorAccountId.trim();

    if (!workspaceId || !organizationId || !actorAccountId) {
      return [];
    }

    return this.fileRepository.listByWorkspace({
      workspaceId,
      organizationId,
      actorAccountId,
    }).map((file) => ({
      id: file.id,
      workspaceId: file.workspaceId,
      organizationId: file.organizationId,
      name: file.name,
      status: file.status,
      kind: file.classification,
      source: file.source ?? DEFAULT_FILE_SOURCE,
      detail: file.detail ?? DEFAULT_FILE_DETAIL,
      href: file.href,
    }));
  }
}
