/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Re-export barrel for workspace command use cases ONLY.
 *          Queries live in application/queries/ — not here.
 *          Lifecycle use cases live in subdomains/lifecycle/ — not here.
 *
 * DDD Rule 12: Command → use-cases/
 * DDD Rule 13: Read → queries/
 */

export { MountCapabilitiesUseCase } from "./workspace-capabilities.use-cases";

export {
  GrantTeamAccessUseCase,
  GrantIndividualAccessUseCase,
  CreateWorkspaceLocationUseCase,
} from "./workspace-access.use-cases";
