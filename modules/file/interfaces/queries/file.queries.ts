import type { WorkspaceEntity } from "@/modules/workspace";

import { resolveFileOrganizationId } from "../../domain/services/resolve-file-organization-id";
import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { ListWorkspaceFilesUseCase } from "../../application/use-cases/list-workspace-files.use-case";
import { LegacyWorkspaceFileAssetBridge } from "../../infrastructure/legacy/LegacyWorkspaceFileAssetBridge";

function createListWorkspaceFilesUseCase(workspace: WorkspaceEntity) {
  const fileRepository = new LegacyWorkspaceFileAssetBridge(workspace);
  return new ListWorkspaceFilesUseCase(fileRepository);
}

export function getWorkspaceFiles(workspace: WorkspaceEntity): WorkspaceFileListItemDto[] {
  const listWorkspaceFilesUseCase = createListWorkspaceFilesUseCase(workspace);
  const organizationId = resolveFileOrganizationId(workspace.accountType, workspace.accountId);

  return listWorkspaceFilesUseCase.execute({
    workspaceId: workspace.id,
    organizationId,
    actorAccountId: workspace.accountId,
  });
}
