/**
 * Public API boundary for the account subdomain.
 * Cross-module consumers must import through this entry point.
 */

import { identityApi } from "../../identity/api";
import { configureTokenRefreshEmitter } from "../infrastructure/identity-token-refresh.adapter";

configureTokenRefreshEmitter(identityApi.emitTokenRefreshSignal);

export * from "../application";
export { accountService, createClientAccountUseCases, createAccountQueryRepository } from "../infrastructure";
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
export type { WalletBalanceSnapshot, Unsubscribe } from "../domain/repositories/AccountQueryRepository";
export type { AccountQueryRepository } from "../domain/repositories/AccountQueryRepository";
export * from "../interfaces";
