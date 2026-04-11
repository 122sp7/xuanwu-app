/**
 * Lifecycle Subdomain — Application Layer
 *
 * Exports use cases and the application service for lifecycle operations.
 */

export { CreateWorkspaceUseCase, CreateWorkspaceWithCapabilitiesUseCase } from "./use-cases/create-workspace.use-case";
export { UpdateWorkspaceSettingsUseCase } from "./use-cases/update-workspace-settings.use-case";
export { DeleteWorkspaceUseCase } from "./use-cases/delete-workspace.use-case";
export { WorkspaceLifecycleApplicationService } from "./services/WorkspaceLifecycleApplicationService";
export type { LifecycleServiceDependencies } from "./services/WorkspaceLifecycleApplicationService";
