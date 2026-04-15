// ── Entities / aggregate root ─────────────────────────────────────────────────
export { Account, type AccountSnapshot, type CreateAccountInput } from "./entities/Account";
export {
  AccountProfileSchema,
  AccountProfileThemeSchema,
  UpdateAccountProfileInputSchema,
  createUpdateAccountProfileInput,
  type AccountProfile,
  type AccountProfileTheme,
  type UpdateAccountProfileInput,
} from "./entities/AccountProfile";
export {
  type AccountPolicy,
  type PolicyRule,
  type PolicyEffect,
  type CreatePolicyInput,
  type UpdatePolicyInput,
} from "./entities/AccountPolicy";

// ── Value objects ─────────────────────────────────────────────────────────────
export { AccountIdSchema, createAccountId, type AccountId } from "./value-objects/AccountId";
export {
  ACCOUNT_STATUSES,
  canSuspend,
  canClose,
  canReactivate,
  type AccountStatus,
} from "./value-objects/AccountStatus";
export {
  ACCOUNT_TYPES,
  AccountTypeSchema,
  createAccountType,
  type AccountTypeValue,
} from "./value-objects/AccountType";
export { WalletAmountSchema, createWalletAmount, type WalletAmount } from "./value-objects/WalletAmount";

// ── Domain events ─────────────────────────────────────────────────────────────
export {
  type AccountDomainEvent,
  type AccountCreatedEvent,
  type ProfileUpdatedEvent,
  type WalletCreditedEvent,
  type WalletDebitedEvent,
  type AccountSuspendedEvent,
  type AccountClosedEvent,
  type AccountReactivatedEvent,
  type AccountDomainEventType,
} from "./events/AccountDomainEvent";

// ── Repository interfaces ─────────────────────────────────────────────────────
export {
  type AccountRepository,
  type OrganizationRole,
  type WalletTransaction,
  type AccountRoleRecord,
  type UpdateProfileInput,
} from "./repositories/AccountRepository";
export {
  type AccountQueryRepository,
  type WalletBalanceSnapshot,
  type Unsubscribe,
} from "./repositories/AccountQueryRepository";
export { type AccountPolicyRepository } from "./repositories/AccountPolicyRepository";

// ── Ports ─────────────────────────────────────────────────────────────────────
export {
  type TokenRefreshPort,
  type TokenRefreshReason,
  type TokenRefreshSignalInput,
} from "./ports/TokenRefreshPort";
