/**
 * Module: platform/subdomains/organization/subdomains/team
 * Layer: api (public boundary)
 * Purpose: Exports types, use cases, and the Firebase adapter
 *          for the team subdomain.
 */

export type { Team, CreateTeamInput } from "../domain/entities/Team";
export type { TeamRepository } from "../domain/repositories/TeamRepository";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application/use-cases/team.use-cases";
export { FirebaseTeamRepository } from "../adapters/firebase/FirebaseTeamRepository";
