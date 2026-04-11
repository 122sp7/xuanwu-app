/**
 * Sharing Subdomain — Application Layer
 *
 * Exports sharing use cases and the application service.
 */

export { GrantTeamAccessUseCase } from "./use-cases/grant-team-access.use-case";
export { GrantIndividualAccessUseCase } from "./use-cases/grant-individual-access.use-case";
export { WorkspaceSharingApplicationService } from "./services/WorkspaceSharingApplicationService";
export type { SharingServiceDependencies } from "./services/WorkspaceSharingApplicationService";
