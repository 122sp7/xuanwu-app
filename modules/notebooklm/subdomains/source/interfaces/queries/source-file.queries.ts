import type { WorkspaceEntity } from "@/modules/workspace/api";

import type { WorkspaceFileListItemDto } from "../../application/dto/source-file.dto";
import { resolveSourceOrganizationId } from "../../application/dto/source.dto";
import type { RagDocumentRecord } from "../../application/dto/source.dto";
import { makeRagDocumentAdapter, makeSourceFileAdapter } from "../../api/factories";
import { ListSourceFilesUseCase } from "../../application/use-cases/list-source-files.use-case";

export async function getWorkspaceFiles(
  workspace: WorkspaceEntity,
): Promise<WorkspaceFileListItemDto[]> {
  const useCase = new ListSourceFilesUseCase(makeSourceFileAdapter());
  const organizationId = resolveSourceOrganizationId(workspace.accountType, workspace.accountId);
  return useCase.execute({ workspaceId: workspace.id, organizationId, actorAccountId: workspace.accountId });
}

export async function getWorkspaceRagDocuments(
  workspace: WorkspaceEntity,
): Promise<readonly RagDocumentRecord[]> {
  const organizationId = resolveSourceOrganizationId(workspace.accountType, workspace.accountId);
  return makeRagDocumentAdapter().findByWorkspace({
    organizationId,
    workspaceId: workspace.id,
  });
}
