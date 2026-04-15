import type {
  AccountProfile,
  UpdateAccountProfileInput,
} from "../entities/AccountProfile";

export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";

export interface WalletTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  createdAt: string; // ISO-8601
}

export interface AccountRoleRecord {
  accountId: string;
  role: OrganizationRole;
  grantedBy: string;
  grantedAt: string; // ISO-8601
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  photoURL?: string;
}

export interface AccountRepository {
  findById(id: string): Promise<import("../entities/Account").AccountSnapshot | null>;
  save(account: import("../entities/Account").AccountSnapshot): Promise<void>;
  updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;
  updateAccountProfile(userId: string, input: UpdateAccountProfileInput): Promise<void>;
  getWalletBalance(accountId: string): Promise<number>;
  creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
  revokeRole(accountId: string): Promise<void>;
  getRole(accountId: string): Promise<AccountRoleRecord | null>;
}

export type { AccountProfile, UpdateAccountProfileInput };
