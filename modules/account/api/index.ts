/**
 * account 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 account 模組內部實作。
 */

// ─── 核心實體型別 ──────────────────────────────────────────────────────────────

export type {
  AccountEntity,
  AccountType,
  OrganizationRole,
  Presence,
  ThemeConfig,
  Wallet,
  ExpertiseBadge,
} from "../domain/entities/Account";

export type {
  AccountPolicy,
  PolicyRule,
  PolicyEffect,
} from "../domain/entities/AccountPolicy";

// ─── 查詢函數 (供 UI 層訂閱/讀取使用) ────────────────────────────────────────

export {
  getUserProfile,
  subscribeToUserProfile,
  subscribeToAccountsForUser,
  getAccountRole,
  subscribeToAccountRoles,
  getAccountPolicies,
  getActiveAccountPolicies,
} from "../interfaces/queries/account.queries";

// ─── Use Cases (供 composition root / app layer 使用) ────────────────────────

export { CreateUserAccountUseCase } from "../application/use-cases/account.use-cases";

// ─── Infrastructure (供 composition root 使用) ───────────────────────────────

export { FirebaseAccountRepository } from "../infrastructure/firebase/FirebaseAccountRepository";

// ─── Client-side use-case factory (client-only — do NOT import in Server Components) ──

import { FirebaseAccountRepository as _AccountRepo } from "../infrastructure/firebase/FirebaseAccountRepository";
import { CreateUserAccountUseCase as _CreateAccount } from "../application/use-cases/account.use-cases";

/**
 * Creates a wired set of client-side account use cases for use in "use client" components.
 * Keeps infrastructure wiring in the module boundary rather than in UI files.
 */
export function createClientAccountUseCases() {
  const repo = new _AccountRepo();
  return {
    createUserAccountUseCase: new _CreateAccount(repo),
  };
}
