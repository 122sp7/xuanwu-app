/**
 * Module: platform/subdomains/team
 * Layer: api (public boundary)
 * Purpose: Exports types and use cases for the team subdomain.
 *
 * createTeamRepository is promoted to the api boundary because the
 * organization subdomain needs it for cross-subdomain team port wiring.
 * It returns the TeamRepository interface, not a concrete implementation.
 */

export type { Team, CreateTeamInput } from "../domain/entities/Team";
export type { TeamRepository } from "../domain/repositories/TeamRepository";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application/use-cases/team.use-cases";
export { createTeamRepository } from "../infrastructure/team-composition";
