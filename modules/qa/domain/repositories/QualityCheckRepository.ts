import type {
  CreateWorkspaceQualityCheckInput,
  UpdateWorkspaceQualityCheckInput,
  WorkspaceQualityCheckEntity,
} from "../entities/QualityCheck";

export interface QualityCheckRepository {
  create(input: CreateWorkspaceQualityCheckInput): Promise<WorkspaceQualityCheckEntity>;
  update(
    qualityCheckId: string,
    input: UpdateWorkspaceQualityCheckInput,
  ): Promise<WorkspaceQualityCheckEntity | null>;
  delete(qualityCheckId: string): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceQualityCheckEntity[]>;
}
