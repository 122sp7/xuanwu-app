import type { WorkspaceEntity } from "@/modules/workspace";

import { resolveFileOrganizationId } from "../../domain/services/resolve-file-organization-id";
import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { ListWorkspaceFilesUseCase } from "../../application/use-cases/list-workspace-files.use-case";
import { FirebaseFileRepository } from "../../infrastructure/firebase/FirebaseFileRepository";

export async function getWorkspaceFiles(workspace: WorkspaceEntity): Promise<WorkspaceFileListItemDto[]> {
  const listWorkspaceFilesUseCase = new ListWorkspaceFilesUseCase(new FirebaseFileRepository());
  const organizationId = resolveFileOrganizationId(workspace.accountType, workspace.accountId);

  return listWorkspaceFilesUseCase.execute({
    workspaceId: workspace.id,
    organizationId,
    actorAccountId: workspace.accountId,
  });
}
