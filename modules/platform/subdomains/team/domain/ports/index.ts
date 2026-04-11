/**
 * team domain/ports — driven port interfaces for the team subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { TeamRepository as ITeamPort } from "../repositories/TeamRepository";
