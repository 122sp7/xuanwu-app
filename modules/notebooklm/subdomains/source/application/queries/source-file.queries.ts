/**
 * Module: notebooklm/subdomains/source
 * Layer: application/use-cases
 * Use Case: ListSourceFilesUseCase — lists workspace files as view-model DTOs.
 */

import type { ListSourceFilesScope } from "../../domain/repositories/SourceFileRepository";
import type { SourceFileRepository } from "../../domain/repositories/SourceFileRepository";
import type { WorkspaceFileListItemDto } from "../dto/source-file.dto";

const DEFAULT_FILE_SOURCE = "source-module";
const DEFAULT_FILE_DETAIL = "File metadata mapped from current workspace context.";

export class ListSourceFilesUseCase {
  constructor(private readonly fileRepository: SourceFileRepository) {}

  async execute(scope: ListSourceFilesScope): Promise<WorkspaceFileListItemDto[]> {
    const workspaceId = scope.workspaceId.trim();
    const organizationId = scope.organizationId.trim();
    const actorAccountId = scope.actorAccountId.trim();

    if (!workspaceId || !organizationId || !actorAccountId) {
      return [];
    }

    const files = await this.fileRepository.listByWorkspace({ workspaceId, organizationId, actorAccountId });

    return files.map((file) => ({
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
