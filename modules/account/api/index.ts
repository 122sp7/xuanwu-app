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
