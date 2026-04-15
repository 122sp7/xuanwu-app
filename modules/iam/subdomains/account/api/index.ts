/**
 * Public API boundary for the IAM account subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Token-refresh wiring is deferred: the IdentityTokenRefreshAdapter
 * auto-configures its emitter on first use via lazy require, eliminating
 * the previous import-time side effect (configureTokenRefreshEmitter call).
 */

export * from "../application";
export { accountService, createClientAccountUseCases } from "../interfaces/composition/account-service";
export type {
  AccountEntity,
  AccountType,
  OrganizationRole,
  AccountRoleRecord,
  UpdateProfileInput,
  WalletTransaction,
  ThemeConfig,
  Wallet,
} from "../domain/entities/Account";
export type {
  AccountPolicy,
  PolicyRule,
  PolicyEffect,
  CreatePolicyInput,
  UpdatePolicyInput,
} from "../domain/entities/AccountPolicy";
export type {
  AccountProfile,
  AccountProfileTheme,
  UpdateAccountProfileInput,
} from "../domain/entities/AccountProfile";
export type { WalletBalanceSnapshot, Unsubscribe } from "../domain/repositories/AccountQueryRepository";
export type { AccountQueryRepository } from "../domain/repositories/AccountQueryRepository";
export * from "../interfaces";
