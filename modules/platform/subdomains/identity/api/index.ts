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
} from "../interfaces/composition/identity-service";
export type { EmitTokenRefreshSignalInput } from "../interfaces/composition/identity-service";

// Domain types — explicit exports (no wildcard to avoid leaking repos/ports/aggregates)
export type { IdentityEntity, RegistrationInput, SignInCredentials } from "../domain/entities/Identity";
export type { TokenRefreshReason, TokenRefreshSignal } from "../domain/entities/TokenRefreshSignal";

// Value objects
export type { Email } from "../domain/value-objects/Email";
export type { UserId } from "../domain/value-objects/UserId";
export type { DisplayName } from "../domain/value-objects/DisplayName";
export type { IdentityStatus } from "../domain/value-objects/IdentityStatus";

// Interfaces (UI components, hooks, providers, actions)
export * from "../interfaces";
