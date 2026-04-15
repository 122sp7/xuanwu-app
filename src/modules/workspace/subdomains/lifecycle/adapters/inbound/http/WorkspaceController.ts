import type { WorkspaceRepository } from "../../../domain/repositories/WorkspaceRepository";
import { CreateWorkspaceUseCase, ActivateWorkspaceUseCase, StopWorkspaceUseCase } from "../../../application/use-cases/WorkspaceLifecycleUseCases";

export class WorkspaceController {
  private readonly createWorkspace: CreateWorkspaceUseCase;
  private readonly activateWorkspace: ActivateWorkspaceUseCase;
  private readonly stopWorkspace: StopWorkspaceUseCase;

  constructor(workspaceRepo: WorkspaceRepository) {
    this.createWorkspace = new CreateWorkspaceUseCase(workspaceRepo);
    this.activateWorkspace = new ActivateWorkspaceUseCase(workspaceRepo);
    this.stopWorkspace = new StopWorkspaceUseCase(workspaceRepo);
  }
}
