import type { WorkspaceEntity } from "@/modules/workspace";

import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { ListWorkspaceFilesUseCase } from "../../application/use-cases/list-workspace-files.use-case";
import { LegacyWorkspaceFileAssetBridge } from "../../infrastructure/legacy/LegacyWorkspaceFileAssetBridge";

function createListWorkspaceFilesUseCase(workspace: WorkspaceEntity) {
  const fileRepository = new LegacyWorkspaceFileAssetBridge(workspace);
  return new ListWorkspaceFilesUseCase(fileRepository);
}

export function getWorkspaceFiles(workspace: WorkspaceEntity): WorkspaceFileListItemDto[] {
  const listWorkspaceFilesUseCase = createListWorkspaceFilesUseCase(workspace);
  const organizationId =
    workspace.accountType === "organization" ? workspace.accountId : `personal:${workspace.accountId}`;

  return listWorkspaceFilesUseCase.execute({
    workspaceId: workspace.id,
    organizationId,
    actorAccountId: workspace.accountId,
  });
}

