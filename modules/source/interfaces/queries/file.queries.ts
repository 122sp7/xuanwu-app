import type { WorkspaceEntity } from "@/modules/workspace/api";

import { resolveFileOrganizationId } from "../../domain/services/resolve-file-organization-id";
import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { ListWorkspaceFilesUseCase } from "../../application/use-cases/list-workspace-files.use-case";
import { FirebaseFileRepository } from "../../infrastructure/firebase/FirebaseFileRepository";
import { FirebaseRagDocumentRepository } from "../../infrastructure/firebase/FirebaseRagDocumentRepository";
import type { RagDocumentRecord } from "../../domain/repositories/RagDocumentRepository";

export async function getWorkspaceFiles(workspace: WorkspaceEntity): Promise<WorkspaceFileListItemDto[]> {
  const listWorkspaceFilesUseCase = new ListWorkspaceFilesUseCase(new FirebaseFileRepository());
  const organizationId = resolveFileOrganizationId(workspace.accountType, workspace.accountId);

  return listWorkspaceFilesUseCase.execute({
    workspaceId: workspace.id,
    organizationId,
    actorAccountId: workspace.accountId,
  });
}

export async function getWorkspaceRagDocuments(
  workspace: WorkspaceEntity,
): Promise<readonly RagDocumentRecord[]> {
  const organizationId = resolveFileOrganizationId(workspace.accountType, workspace.accountId);
  const repo = new FirebaseRagDocumentRepository();

  return repo.findByWorkspace({
    organizationId,
    workspaceId: workspace.id,
  });
}
