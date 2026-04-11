/**
 * Application-layer DTO re-exports for the account-profile subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type {
  AccountProfile,
  AccountProfileId,
  AccountProfileTheme,
} from "../../domain/entities/AccountProfile";
export type { Unsubscribe } from "../../domain/repositories/AccountProfileQueryRepository";
