/**
 * account-profile domain/ports — driven port interfaces for the account-profile subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { AccountProfileQueryRepository as IAccountProfileQueryPort } from "../repositories/AccountProfileQueryRepository";
export type { AccountProfileCommandRepository as IAccountProfileCommandPort } from "../repositories/AccountProfileCommandRepository";
