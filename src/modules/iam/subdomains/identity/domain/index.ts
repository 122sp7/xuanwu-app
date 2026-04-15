// ── Aggregate root ────────────────────────────────────────────────────────────
export {
  UserIdentity,
  type UserIdentitySnapshot,
  type CreateIdentityInput,
} from "./entities/UserIdentity";

// ── Entities ──────────────────────────────────────────────────────────────────
export {
  type IdentityEntity,
  type SignInCredentials,
  type RegistrationInput,
} from "./entities/Identity";
export {
  type TokenRefreshSignal,
  type TokenRefreshReason,
} from "./entities/TokenRefreshSignal";

// ── Value objects ─────────────────────────────────────────────────────────────
export { UserIdSchema, createUserId, unsafeUserId, type UserId } from "./value-objects/UserId";
export { EmailSchema, createEmail, unsafeEmail, type Email } from "./value-objects/Email";
export { DisplayNameSchema, createDisplayName, type DisplayName } from "./value-objects/DisplayName";
export {
  IDENTITY_STATUSES,
  canSuspend,
  canReactivate,
  type IdentityStatus,
} from "./value-objects/IdentityStatus";

// ── Domain events ─────────────────────────────────────────────────────────────
export {
  type IdentityDomainEvent,
  type IdentityCreatedEvent,
  type SignedInEvent,
  type DisplayNameUpdatedEvent,
  type EmailVerifiedEvent,
  type IdentitySuspendedEvent,
  type IdentityReactivatedEvent,
  type IdentityDomainEventType,
} from "./events/IdentityDomainEvent";

// ── Repository interfaces ─────────────────────────────────────────────────────
export { type IdentityRepository } from "./repositories/IdentityRepository";
export { type TokenRefreshRepository } from "./repositories/TokenRefreshRepository";
