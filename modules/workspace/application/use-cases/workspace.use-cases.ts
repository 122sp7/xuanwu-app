/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Re-export barrel for all workspace use cases.
 *          Split by subdomain for IDDD single-responsibility:
 *  - workspace-lifecycle.use-cases.ts  (create, update, delete)
 *  - workspace-capabilities.use-cases.ts (mount capabilities)
 *  - workspace-access.use-cases.ts      (team grants, individual grants, locations)
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

export {
  GetWorkspaceByIdForAccountUseCase,
  GetWorkspaceByIdUseCase,
  ListWorkspacesForAccountUseCase,
  SubscribeToWorkspacesForAccountUseCase,
} from "./workspace-query.use-cases";
