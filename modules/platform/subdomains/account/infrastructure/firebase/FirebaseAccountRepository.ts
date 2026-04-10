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

    await runTransaction(db, async (txn) => {
      const snap = await txn.get(accountRef);
      const current = snap.exists()
        ? ((snap.data() as Record<string, unknown>).wallet as Record<string, unknown> | undefined)
        : undefined;
      const currentBalance = typeof current?.balance === "number" ? current.balance : 0;
      txn.update(accountRef, {
        "wallet.balance": currentBalance + amount,
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

    await runTransaction(db, async (txn) => {
      const snap = await txn.get(accountRef);
      const current = snap.exists()
        ? ((snap.data() as Record<string, unknown>).wallet as Record<string, unknown> | undefined)
        : undefined;
      const currentBalance = typeof current?.balance === "number" ? current.balance : 0;
      if (currentBalance < amount) {
        throw new Error(`Insufficient wallet balance: have ${currentBalance}, need ${amount}`);
      }
      txn.update(accountRef, {
        "wallet.balance": currentBalance - amount,
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
