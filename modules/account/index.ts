/**
 * account module public API
 */
export type {
  AccountEntity,
  AccountType,
  OrganizationRole,
  Presence,
  ThemeConfig,
  Wallet,
  ExpertiseBadge,
  MemberReference,
  Team,
  UpdateProfileInput,
  WalletTransaction,
  AccountRoleRecord,
} from "./domain/entities/Account";
export type {
  AccountPolicy,
  PolicyRule,
  PolicyEffect,
  CreatePolicyInput,
  UpdatePolicyInput,
} from "./domain/entities/AccountPolicy";
export type { AccountRepository } from "./domain/repositories/AccountRepository";
export type { AccountPolicyRepository } from "./domain/repositories/AccountPolicyRepository";
export type {
  AccountQueryRepository,
  WalletBalanceSnapshot,
  Unsubscribe,
} from "./domain/repositories/AccountQueryRepository";
export {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
} from "./application/use-cases/account.use-cases";
export {
  CreateAccountPolicyUseCase,
  UpdateAccountPolicyUseCase,
  DeleteAccountPolicyUseCase,
} from "./application/use-cases/account-policy.use-cases";
export { FirebaseAccountRepository } from "./infrastructure/firebase/FirebaseAccountRepository";
export { FirebaseAccountPolicyRepository } from "./infrastructure/firebase/FirebaseAccountPolicyRepository";
export { FirebaseAccountQueryRepository } from "./infrastructure/firebase/FirebaseAccountQueryRepository";
// Server Actions
export {
  createUserAccount,
  updateUserProfile,
  creditWallet,
  debitWallet,
  assignAccountRole,
  revokeAccountRole,
} from "./interfaces/_actions/account.actions";
export {
  createAccountPolicy,
  updateAccountPolicy,
  deleteAccountPolicy,
} from "./interfaces/_actions/account-policy.actions";
// Read queries (callable from React hooks/components)
export {
  getUserProfile,
  subscribeToUserProfile,
  getWalletBalance,
  subscribeToWalletBalance,
  subscribeToWalletTransactions,
  getAccountRole,
  subscribeToAccountRoles,
  getAccountPolicies,
  getActiveAccountPolicies,
} from "./interfaces/queries/account.queries";
