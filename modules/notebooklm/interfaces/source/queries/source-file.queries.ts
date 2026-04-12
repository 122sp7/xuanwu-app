import type { WorkspaceEntity } from "@/modules/workspace/api";

import type { WorkspaceFileListItemDto } from "../../../subdomains/source/application/dto/source-file.dto";
import { resolveSourceOrganizationId } from "../../../subdomains/source/application/dto/source.dto";
import type { RagDocumentRecord } from "../../../subdomains/source/application/dto/source.dto";
import { makeRagDocumentAdapter, makeSourceFileAdapter } from "../composition/adapters";
import { ListSourceFilesUseCase } from "../../../subdomains/source/application/queries/source-file.queries";

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
