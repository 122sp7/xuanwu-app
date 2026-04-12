/**
 * identity subdomain public API boundary.
 * Consumers (e.g. infrastructure in sibling subdomains) must import through this barrel.
 */
export * from "../application";
export {
  createIdentityRepository,
  createTokenRefreshRepository,
  createClientAuthUseCases,
  identityApi,
} from "../infrastructure";
export type { EmitTokenRefreshSignalInput } from "../infrastructure";
export * from "../domain";
export * from "../interfaces";
