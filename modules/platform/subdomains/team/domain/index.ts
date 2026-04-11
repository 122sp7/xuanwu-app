/**
 * team subdomain — domain layer public exports.
 */

export type { Team, CreateTeamInput } from "./entities/Team";
export type { TeamRepository } from "./repositories/TeamRepository";
export type { ITeamPort } from "./ports";
export * from "./aggregates";
export * from "./events";
export * from "./value-objects";
