import type { FileRepository, ListWorkspaceFilesScope } from "../../domain/repositories/FileRepository";
import type { WorkspaceFileListItemDto } from "../dto/file.dto";

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
      source: file.source ?? "file-module",
      detail: file.detail ?? "File metadata mapped from current workspace context.",
      href: file.href,
    }));
  }
}
