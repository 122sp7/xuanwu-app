/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Re-export barrel for workspace command use cases that remain at root level.
 *          Lifecycle use cases → subdomains/lifecycle/
 *          Sharing use cases → subdomains/sharing/
 *          Queries → application/queries/
 *
 * DDD Rule 12: Command → use-cases/
 * DDD Rule 13: Read → queries/
 */

export { MountCapabilitiesUseCase } from "./workspace-capabilities.use-cases";

export { CreateWorkspaceLocationUseCase } from "./workspace-location.use-cases";
