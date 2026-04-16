import { v4 as uuid } from "uuid";
import type { AccountRepository, OrganizationRole, UpdateProfileInput, WalletTransaction, AccountRoleRecord } from "../../../domain/repositories/AccountRepository";
import type { UpdateAccountProfileInput } from "../../../domain/entities/AccountProfile";
import type { AccountSnapshot } from "../../../domain/entities/Account";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}

export class FirestoreAccountRepository implements AccountRepository {
  private readonly collection = "accounts";
  private readonly rolesCollection = "account_roles";

  constructor(private readonly db: FirestoreLike) {}

  async findById(id: string): Promise<AccountSnapshot | null> {
    const doc = await this.db.get(this.collection, id);
    if (!doc) return null;
    return doc as unknown as AccountSnapshot;
  }

  async save(account: AccountSnapshot): Promise<void> {
    await this.db.set(this.collection, account.id, account as unknown as Record<string, unknown>);
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<void> {
    const existing = await this.db.get(this.collection, userId);
    if (!existing) throw new Error(`Account ${userId} not found`);
    const updated = {
      ...existing,
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.photoURL !== undefined ? { photoURL: data.photoURL } : {}),
      updatedAtISO: new Date().toISOString(),
    };
    await this.db.set(this.collection, userId, updated);
  }

  async updateAccountProfile(userId: string, input: UpdateAccountProfileInput): Promise<void> {
    const existing = await this.db.get(this.collection, userId);
    if (!existing) throw new Error(`Account ${userId} not found`);
    const updated = {
      ...existing,
      ...(input.displayName !== undefined ? { name: input.displayName } : {}),
      ...(input.bio !== undefined ? { bio: input.bio } : {}),
      ...(input.photoURL !== undefined ? { photoURL: input.photoURL } : {}),
      updatedAtISO: new Date().toISOString(),
    };
    await this.db.set(this.collection, userId, updated);
  }

  async getWalletBalance(accountId: string): Promise<number> {
    const doc = await this.db.get(this.collection, accountId);
    if (!doc) return 0;
    return typeof doc.walletBalance === "number" ? doc.walletBalance : 0;
  }

  async creditWallet(
    accountId: string,
    amount: number,
    description: string,
  ): Promise<WalletTransaction> {
    const doc = await this.db.get(this.collection, accountId);
    if (!doc) throw new Error(`Account ${accountId} not found`);
    const current = typeof doc.walletBalance === "number" ? doc.walletBalance : 0;
    await this.db.set(this.collection, accountId, {
      ...doc,
      walletBalance: current + amount,
      updatedAtISO: new Date().toISOString(),
    });
    const tx: WalletTransaction = {
      id: uuid(),
      accountId,
      amount,
      description,
      createdAt: new Date().toISOString(),
    };
    return tx;
  }

  async debitWallet(
    accountId: string,
    amount: number,
    description: string,
  ): Promise<WalletTransaction> {
    const doc = await this.db.get(this.collection, accountId);
    if (!doc) throw new Error(`Account ${accountId} not found`);
    const current = typeof doc.walletBalance === "number" ? doc.walletBalance : 0;
    if (current < amount) throw new Error("Insufficient wallet balance");
    await this.db.set(this.collection, accountId, {
      ...doc,
      walletBalance: current - amount,
      updatedAtISO: new Date().toISOString(),
    });
    const tx: WalletTransaction = {
      id: uuid(),
      accountId,
      amount,
      description,
      createdAt: new Date().toISOString(),
    };
    return tx;
  }

  async assignRole(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
  ): Promise<AccountRoleRecord> {
    const record: AccountRoleRecord = {
      accountId,
      role,
      grantedBy,
      grantedAt: new Date().toISOString(),
    };
    await this.db.set(this.rolesCollection, accountId, record as unknown as Record<string, unknown>);
    return record;
  }

  async revokeRole(accountId: string): Promise<void> {
    await this.db.delete(this.rolesCollection, accountId);
  }

  async getRole(accountId: string): Promise<AccountRoleRecord | null> {
    const doc = await this.db.get(this.rolesCollection, accountId);
    if (!doc) return null;
    return doc as unknown as AccountRoleRecord;
  }
}
