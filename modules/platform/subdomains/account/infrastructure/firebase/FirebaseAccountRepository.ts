/**
 * FirebaseAccountRepository — Infrastructure adapter for account persistence.
 * Translates Firestore documents ↔ Domain AccountEntity.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type {
  AccountEntity,
  UpdateProfileInput,
  WalletTransaction,
  AccountRoleRecord,
  OrganizationRole,
} from "../../domain/entities/Account";
import type { UpdateAccountProfileInput } from "../../domain/entities/AccountProfile";
import { Account, type AccountSnapshot } from "../../domain/aggregates/Account";

function toAccountEntity(id: string, data: Record<string, unknown>): AccountEntity {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    accountType:
      (data.accountType as AccountEntity["accountType"]) === "organization"
        ? "organization"
        : "user",
    email: typeof data.email === "string" ? data.email : undefined,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    wallet: data.wallet != null ? (data.wallet as AccountEntity["wallet"]) : undefined,
    theme: data.theme != null ? (data.theme as AccountEntity["theme"]) : undefined,
    members: Array.isArray(data.members) ? (data.members as AccountEntity["members"]) : undefined,
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : undefined,
    teams: Array.isArray(data.teams) ? (data.teams as AccountEntity["teams"]) : undefined,
    ownerId: typeof data.ownerId === "string" ? data.ownerId : undefined,
    createdAt: data.createdAt as AccountEntity["createdAt"],
  };
}

/**
 * Maps raw Firestore account data to an AccountSnapshot suitable for
 * reconstituting the Account aggregate, so domain invariants (e.g. wallet
 * balance checks) are enforced by the aggregate — not duplicated here.
 */
function toAccountSnapshot(id: string, data: Record<string, unknown>): AccountSnapshot {
  const wallet = data.wallet as Record<string, unknown> | undefined;
  const toISO = (v: unknown): string => {
    if (v instanceof Timestamp) return v.toDate().toISOString();
    if (typeof v === "string") return v;
    return new Date().toISOString();
  };
  const status = (["active", "suspended", "closed"] as const).includes(
    data.status as "active" | "suspended" | "closed",
  )
    ? (data.status as "active" | "suspended" | "closed")
    : "active";
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    accountType:
      (data.accountType as AccountSnapshot["accountType"]) === "organization"
        ? "organization"
        : "user",
    email: typeof data.email === "string" ? data.email : null,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : null,
    bio: typeof data.bio === "string" ? data.bio : null,
    status,
    walletBalance: typeof wallet?.balance === "number" ? wallet.balance : 0,
    createdAtISO: toISO(data.createdAt),
    updatedAtISO: toISO(data.updatedAt),
  };
}


export class FirebaseAccountRepository implements AccountRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<AccountEntity | null> {
    const snap = await getDoc(doc(this.db, "accounts", id));
    if (!snap.exists()) return null;
    return toAccountEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async save(account: AccountEntity): Promise<void> {
    await setDoc(doc(this.db, "accounts", account.id), {
      name: account.name,
      accountType: account.accountType,
      email: account.email ?? null,
      photoURL: account.photoURL ?? null,
      bio: account.bio ?? null,
      createdAt: serverTimestamp(),
    });
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<void> {
    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (data.name !== undefined) updates.name = data.name;
    if (data.bio !== undefined) updates.bio = data.bio;
    if (data.photoURL !== undefined) updates.photoURL = data.photoURL;
    if (data.theme !== undefined) updates.theme = data.theme;
    await updateDoc(doc(this.db, "accounts", userId), updates);
  }

  async updateAccountProfile(userId: string, input: UpdateAccountProfileInput): Promise<void> {
    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (input.displayName !== undefined) updates.name = input.displayName;
    if (input.bio !== undefined) updates.bio = input.bio;
    if (input.photoURL !== undefined) updates.photoURL = input.photoURL;
    if (input.theme !== undefined) updates.theme = input.theme;
    await updateDoc(doc(this.db, "accounts", userId), updates);
  }

  async getWalletBalance(accountId: string): Promise<number> {
    const snap = await getDoc(doc(this.db, "accounts", accountId));
    if (!snap.exists()) return 0;
    const data = snap.data() as Record<string, unknown>;
    const wallet = data.wallet as Record<string, unknown> | undefined;
    return typeof wallet?.balance === "number" ? wallet.balance : 0;
  }

  async creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction> {
    const db = this.db;
    const accountRef = doc(db, "accounts", accountId);

    let newBalance = 0;
    await runTransaction(db, async (txn) => {
      const snap = await txn.get(accountRef);
      if (!snap.exists()) throw new Error(`Account ${accountId} not found`);
      const account = Account.reconstitute(
        toAccountSnapshot(accountId, snap.data() as Record<string, unknown>),
      );
      // Delegate credit logic and invariant enforcement to the domain aggregate.
      account.creditWallet(amount, description);
      newBalance = account.walletBalance;
      txn.update(accountRef, {
        "wallet.balance": newBalance,
        updatedAt: serverTimestamp(),
      });
    });

    const txRef = await addDoc(collection(db, "accounts", accountId, "walletTransactions"), {
      accountId,
      type: "credit",
      amount,
      reason: description,
      occurredAt: serverTimestamp(),
    });

    return {
      id: txRef.id,
      accountId,
      amount,
      description,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction> {
    const db = this.db;
    const accountRef = doc(db, "accounts", accountId);

    let newBalance = 0;
    await runTransaction(db, async (txn) => {
      const snap = await txn.get(accountRef);
      if (!snap.exists()) throw new Error(`Account ${accountId} not found`);
      const account = Account.reconstitute(
        toAccountSnapshot(accountId, snap.data() as Record<string, unknown>),
      );
      // Delegate debit logic and "Insufficient balance" invariant to the domain aggregate.
      account.debitWallet(amount, description);
      newBalance = account.walletBalance;
      txn.update(accountRef, {
        "wallet.balance": newBalance,
        updatedAt: serverTimestamp(),
      });
    });

    const txRef = await addDoc(collection(db, "accounts", accountId, "walletTransactions"), {
      accountId,
      type: "debit",
      amount,
      reason: description,
      occurredAt: serverTimestamp(),
    });

    return {
      id: txRef.id,
      accountId,
      amount,
      description,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord> {
    await setDoc(
      doc(this.db, "accountRoles", accountId),
      { accountId, role, grantedBy, grantedAt: new Date().toISOString(), isActive: true, updatedAt: serverTimestamp() },
      { merge: true },
    );
    return {
      accountId,
      role,
      grantedBy,
      grantedAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async revokeRole(accountId: string): Promise<void> {
    await updateDoc(doc(this.db, "accountRoles", accountId), {
      isActive: false,
      revokedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  }

  async getRole(accountId: string): Promise<AccountRoleRecord | null> {
    const snap = await getDoc(doc(this.db, "accountRoles", accountId));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      accountId,
      role: data.role as OrganizationRole,
      grantedBy: data.grantedBy as string,
      grantedAt: data.grantedAt as AccountRoleRecord["grantedAt"],
    };
  }
}
