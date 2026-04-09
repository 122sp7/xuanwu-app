import type { WorkspaceEntity } from "@/modules/workspace/api";

import { resolveSourceOrganizationId } from "../../domain/services/resolve-source-organization-id.service";
import type { WorkspaceFileListItemDto } from "../../application/dto/source-file.dto";
import type { RagDocumentRecord } from "../../domain/entities/RagDocument";
import { ListSourceFilesUseCase } from "../../application/use-cases/list-source-files.use-case";
import { FirebaseSourceFileAdapter } from "../../infrastructure/firebase/FirebaseSourceFileAdapter";
import { FirebaseRagDocumentAdapter } from "../../infrastructure/firebase/FirebaseRagDocumentAdapter";

export async function getWorkspaceFiles(
  workspace: WorkspaceEntity,
): Promise<WorkspaceFileListItemDto[]> {
  const useCase = new ListSourceFilesUseCase(new FirebaseSourceFileAdapter());
  const organizationId = resolveSourceOrganizationId(workspace.accountType, workspace.accountId);
  return useCase.execute({ workspaceId: workspace.id, organizationId, actorAccountId: workspace.accountId });
}

export async function getWorkspaceRagDocuments(
  workspace: WorkspaceEntity,
): Promise<readonly RagDocumentRecord[]> {
  const organizationId = resolveSourceOrganizationId(workspace.accountType, workspace.accountId);
  return new FirebaseRagDocumentAdapter().findByWorkspace({
    organizationId,
    workspaceId: workspace.id,
  });
}
