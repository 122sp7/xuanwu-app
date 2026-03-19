/**
 * Account Domain Entities — pure TypeScript, zero framework dependencies.
 */

import type { Timestamp } from "@/shared/types";

export type AccountType = "user" | "organization";
export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
export type Presence = "active" | "away" | "offline";

export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}

export interface Wallet {
  balance: number;
}

export interface ExpertiseBadge {
  id: string;
  name: string;
  icon?: string;
}

export interface MemberReference {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  presence: Presence;
  isExternal?: boolean;
  expiryDate?: Timestamp;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}

export interface AccountEntity {
  id: string;
  name: string;
  accountType: AccountType;
  email?: string;
  photoURL?: string;
  bio?: string;
  achievements?: string[];
  expertiseBadges?: ExpertiseBadge[];
  wallet?: Wallet;
  description?: string;
  ownerId?: string;
  role?: OrganizationRole;
  theme?: ThemeConfig;
  members?: MemberReference[];
  memberIds?: string[];
  teams?: Team[];
  createdAt?: Timestamp;
}

// ─── Value Objects ────────────────────────────────────────────────────────────

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  photoURL?: string;
  theme?: ThemeConfig;
}

export interface WalletTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  createdAt: Timestamp;
}

export type AccountRoleRecord = {
  accountId: string;
  role: OrganizationRole;
  grantedBy: string;
  grantedAt: Timestamp;
};
