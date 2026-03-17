/**
 * FirebaseAccountQueryRepository — Infrastructure adapter for account read queries.
 * Provides real-time subscriptions and one-shot reads.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit as fbLimit,
  onSnapshot,
} from "firebase/firestore";
import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { AccountQueryRepository, WalletBalanceSnapshot, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { AccountEntity, WalletTransaction, AccountRoleRecord, OrganizationRole } from "../../domain/entities/Account";

function toAccountEntity(id: string, data: Record<string, unknown>): AccountEntity {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    accountType: (data.accountType as AccountEntity["accountType"]) === "organization"
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

export class FirebaseAccountQueryRepository implements AccountQueryRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async getUserProfile(userId: string): Promise<AccountEntity | null> {
    const snap = await getDoc(doc(this.db, "accounts", userId));
    if (!snap.exists()) return null;
    return toAccountEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: AccountEntity | null) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.db, "accounts", userId), (snap) => {
      onUpdate(snap.exists() ? toAccountEntity(snap.id, snap.data() as Record<string, unknown>) : null);
    });
  }

  async getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot> {
    const snap = await getDoc(doc(this.db, "accounts", accountId));
    if (!snap.exists()) return { balance: 0 };
    const data = snap.data() as Record<string, unknown>;
    const wallet = data.wallet as Record<string, unknown> | undefined;
    return { balance: typeof wallet?.balance === "number" ? wallet.balance : 0 };
  }

  subscribeToWalletBalance(
    accountId: string,
    onUpdate: (snapshot: WalletBalanceSnapshot) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.db, "accounts", accountId), (snap) => {
      if (!snap.exists()) {
        onUpdate({ balance: 0 });
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      const wallet = data.wallet as Record<string, unknown> | undefined;
      onUpdate({ balance: typeof wallet?.balance === "number" ? wallet.balance : 0 });
    });
  }

  subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe {
    const ref = collection(this.db, "accounts", accountId, "walletTransactions");
    const q = query(ref, orderBy("occurredAt", "desc"), fbLimit(maxCount));
    return onSnapshot(q, (snap) => {
      const txs: WalletTransaction[] = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          accountId: data.accountId as string,
          amount: data.amount as number,
          description: (data.reason as string | undefined) ?? "",
          createdAt: data.occurredAt as WalletTransaction["createdAt"],
        };
      });
      onUpdate(txs);
    });
  }

  async getAccountRole(accountId: string): Promise<AccountRoleRecord | null> {
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

  subscribeToAccountRoles(
    accountId: string,
    onUpdate: (record: AccountRoleRecord | null) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.db, "accountRoles", accountId), (snap) => {
      if (!snap.exists()) {
        onUpdate(null);
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      onUpdate({
        accountId,
        role: data.role as OrganizationRole,
        grantedBy: data.grantedBy as string,
        grantedAt: data.grantedAt as AccountRoleRecord["grantedAt"],
      });
    });
  }

  subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountEntity>) => void,
  ): Unsubscribe {
    const db = this.db;
    let ownerAccounts: Record<string, AccountEntity> = {};
    let memberAccounts: Record<string, AccountEntity> = {};

    const emit = () => {
      onUpdate({ ...ownerAccounts, ...memberAccounts });
    };

    const ownerQuery = query(
      collection(db, "accounts"),
      where("ownerId", "==", userId),
      where("accountType", "==", "organization"),
    );

    const memberQuery = query(
      collection(db, "accounts"),
      where("memberIds", "array-contains", userId),
      where("accountType", "==", "organization"),
    );

    const unsubOwner = onSnapshot(ownerQuery, (snap) => {
      ownerAccounts = {};
      snap.docs.forEach((d) => {
        ownerAccounts[d.id] = toAccountEntity(d.id, d.data() as Record<string, unknown>);
      });
      emit();
    });

    const unsubMember = onSnapshot(memberQuery, (snap) => {
      memberAccounts = {};
      snap.docs.forEach((d) => {
        memberAccounts[d.id] = toAccountEntity(d.id, d.data() as Record<string, unknown>);
      });
      emit();
    });

    return () => {
      unsubOwner();
      unsubMember();
    };
  }
}
