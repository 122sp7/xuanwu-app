/**
 * Module: platform/subdomains/team
 * Layer: api (public boundary)
 * Purpose: Exports types and use cases for the team subdomain.
 *          Infrastructure composition (repository wiring) is internal
 *          and NOT exposed through the api boundary.
 */

export type { Team, CreateTeamInput } from "../domain/entities/Team";
export type { TeamRepository } from "../domain/repositories/TeamRepository";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application/use-cases/team.use-cases";
