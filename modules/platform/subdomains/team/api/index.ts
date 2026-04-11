/**
 * Module: platform/subdomains/team
 * Layer: api (public boundary)
 * Purpose: Exports types, use cases, and a factory function for the team
 *          subdomain. Consumers must use the TeamRepository port interface
 *          and the createTeamRepository factory — never the concrete adapter.
 */

import type { TeamRepository } from "../domain/repositories/TeamRepository";
import { FirebaseTeamRepository } from "../infrastructure/firebase/FirebaseTeamRepository";

export type { Team, CreateTeamInput } from "../domain/entities/Team";
export type { TeamRepository } from "../domain/repositories/TeamRepository";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application/use-cases/team.use-cases";

/** Factory — returns a TeamRepository backed by Firebase. */
export function createTeamRepository(): TeamRepository {
  return new FirebaseTeamRepository();
}
