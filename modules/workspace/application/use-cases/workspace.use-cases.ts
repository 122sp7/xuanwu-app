/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Re-export barrel for workspace command use cases ONLY.
 *          Queries live in application/queries/ — not here.
 *
 * DDD Rule 12: Command → use-cases/
 * DDD Rule 13: Read → queries/
 */

export {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithCapabilitiesUseCase,
  UpdateWorkspaceSettingsUseCase,
  DeleteWorkspaceUseCase,
} from "./workspace-lifecycle.use-cases";

export { MountCapabilitiesUseCase } from "./workspace-capabilities.use-cases";

export {
  GrantTeamAccessUseCase,
  GrantIndividualAccessUseCase,
  CreateWorkspaceLocationUseCase,
} from "./workspace-access.use-cases";
