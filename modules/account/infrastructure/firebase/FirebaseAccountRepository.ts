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
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type {
  AccountEntity,
  UpdateProfileInput,
  WalletTransaction,
  AccountRoleRecord,
  OrganizationRole,
} from "../../domain/entities/Account";

// ─── Firestore ↔ Domain Mapper ────────────────────────────────────────────────

function toAccountEntity(id: string, data: Record<string, unknown>): AccountEntity {
  return {
    id,
    name: data.name as string,
    accountType: (data.accountType as AccountEntity["accountType"]) ?? "user",
    email: data.email as string | undefined,
    photoURL: data.photoURL as string | undefined,
    bio: data.bio as string | undefined,
  };
}

// ─── Repository Implementation ────────────────────────────────────────────────

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
    await updateDoc(doc(this.db, "accounts", userId), {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.photoURL !== undefined && { photoURL: data.photoURL }),
      ...(data.theme !== undefined && { theme: data.theme }),
      updatedAt: serverTimestamp(),
    });
  }

  async getWalletBalance(accountId: string): Promise<number> {
    const snap = await getDoc(doc(this.db, "wallets", accountId));
    if (!snap.exists()) return 0;
    return (snap.data() as Record<string, unknown>).balance as number ?? 0;
  }

  async creditWallet(
    accountId: string,
    amount: number,
    description: string,
  ): Promise<WalletTransaction> {
    const txRef = await addDoc(collection(this.db, "wallets", accountId, "transactions"), {
      amount,
      description,
      type: "credit",
      createdAt: serverTimestamp(),
    });
    // Update balance
    const balanceRef = doc(this.db, "wallets", accountId);
    const snap = await getDoc(balanceRef);
    const currentBalance = snap.exists()
      ? ((snap.data() as Record<string, unknown>).balance as number ?? 0)
      : 0;
    await setDoc(balanceRef, { balance: currentBalance + amount }, { merge: true });
    return {
      id: txRef.id,
      accountId,
      amount,
      description,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async debitWallet(
    accountId: string,
    amount: number,
    description: string,
  ): Promise<WalletTransaction> {
    const txRef = await addDoc(collection(this.db, "wallets", accountId, "transactions"), {
      amount: -amount,
      description,
      type: "debit",
      createdAt: serverTimestamp(),
    });
    const balanceRef = doc(this.db, "wallets", accountId);
    const snap = await getDoc(balanceRef);
    const currentBalance = snap.exists()
      ? ((snap.data() as Record<string, unknown>).balance as number ?? 0)
      : 0;
    await setDoc(balanceRef, { balance: currentBalance - amount }, { merge: true });
    return {
      id: txRef.id,
      accountId,
      amount,
      description,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async assignRole(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
  ): Promise<AccountRoleRecord> {
    const record: Omit<AccountRoleRecord, "grantedAt"> & { grantedAt: unknown } = {
      accountId,
      role,
      grantedBy,
      grantedAt: serverTimestamp(),
    };
    await setDoc(doc(this.db, "accountRoles", accountId), record, { merge: true });
    return {
      accountId,
      role,
      grantedBy,
      grantedAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async revokeRole(accountId: string): Promise<void> {
    await updateDoc(doc(this.db, "accountRoles", accountId), { role: null, revokedAt: serverTimestamp() });
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
