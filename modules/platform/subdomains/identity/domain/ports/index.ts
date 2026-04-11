/**
 * identity domain/ports — driven port interfaces for the identity subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { IdentityRepository as IIdentityPort } from "../repositories/IdentityRepository";
export type { TokenRefreshRepository as ITokenRefreshPort } from "../repositories/TokenRefreshRepository";
