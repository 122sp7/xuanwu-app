/**
 * account-profile domain/ports — driven port interfaces for the account-profile subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { AccountProfileQueryRepository } from "../repositories/AccountProfileQueryRepository";
export type { AccountProfileCommandRepository } from "../repositories/AccountProfileCommandRepository";
