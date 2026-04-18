/**
 * FirebaseAccountQueryRepository — module-level outbound adapter (read side).
 *
 * Implements AccountQueryRepository using Firestore real-time listeners.
 * Lives at the iam module outbound boundary so that @integration-firebase
 * is allowed per ESLint boundary rules (src/modules/<context>/adapters/outbound/**).
 */

import { firebaseClientApp } from "@packages";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore";

import type {
  AccountQueryRepository,
  WalletBalanceSnapshot,
  Unsubscribe,
} from "../../subdomains/account/domain/repositories/AccountQueryRepository";
import type {
  WalletTransaction,
  AccountRoleRecord,
} from "../../subdomains/account/domain/repositories/AccountRepository";
import type { AccountSnapshot } from "../../subdomains/account/domain/entities/Account";
import type { AccountProfile } from "../../subdomains/account/domain/entities/AccountProfile";

// ─── Mapper helpers ───────────────────────────────────────────────────────────

function toISO(v: unknown): string {
  if (v && typeof v === "object" && "toDate" in v) {
    return (v as Timestamp).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return new Date().toISOString();
}

function toAccountSnapshot(id: string, data: Record<string, unknown>): AccountSnapshot {
  const walletBalance =
    typeof data.walletBalance === "number"
      ? data.walletBalance
      : typeof data.wallet === "object" && data.wallet !== null
        ? ((data.wallet as Record<string, unknown>).balance as number) ?? 0
        : 0;

  const status = (["active", "suspended", "closed"] as const).includes(
    data.status as "active" | "suspended" | "closed",
  )
    ? (data.status as AccountSnapshot["status"])
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
    walletBalance,
    createdAtISO: toISO(data.createdAtISO ?? data.createdAt),
    updatedAtISO: toISO(data.updatedAtISO ?? data.updatedAt),
  };
}

function toAccountProfile(snapshot: AccountSnapshot): AccountProfile {
  return {
    id: snapshot.id,
    displayName: snapshot.name || "Member",
    email: snapshot.email ?? undefined,
    photoURL: snapshot.photoURL ?? undefined,
    bio: snapshot.bio ?? undefined,
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class FirebaseAccountQueryRepository implements AccountQueryRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async getUserProfile(userId: string): Promise<AccountSnapshot | null> {
    const snap = await getDoc(doc(this.db, "accounts", userId));
    if (!snap.exists()) return null;
    return toAccountSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: AccountSnapshot | null) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.db, "accounts", userId), (snap) => {
      onUpdate(
        snap.exists()
          ? toAccountSnapshot(snap.id, snap.data() as Record<string, unknown>)
          : null,
      );
    });
  }

  async getAccountProfile(actorId: string): Promise<AccountProfile | null> {
    const snapshot = await this.getUserProfile(actorId);
    return snapshot ? toAccountProfile(snapshot) : null;
  }

  subscribeToAccountProfile(
    actorId: string,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe {
    return this.subscribeToUserProfile(actorId, (snapshot) => {
      onUpdate(snapshot ? toAccountProfile(snapshot) : null);
    });
  }

  async getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot> {
    const snap = await this.getUserProfile(accountId);
    return { balance: snap?.walletBalance ?? 0 };
  }

  subscribeToWalletBalance(
    accountId: string,
    onUpdate: (snapshot: WalletBalanceSnapshot) => void,
  ): Unsubscribe {
    return this.subscribeToUserProfile(accountId, (snap) => {
      onUpdate({ balance: snap?.walletBalance ?? 0 });
    });
  }

  subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe {
    const q = query(
      collection(this.db, "accounts", accountId, "transactions"),
      orderBy("createdAt", "desc"),
      firestoreLimit(maxCount),
    );
    return onSnapshot(q, (snap) => {
      const txs: WalletTransaction[] = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          accountId,
          amount: typeof data.amount === "number" ? data.amount : 0,
          description: typeof data.description === "string" ? data.description : "",
          createdAt: toISO(data.createdAt),
        };
      });
      onUpdate(txs);
    });
  }

  async getAccountRole(accountId: string): Promise<AccountRoleRecord | null> {
    const snap = await getDoc(doc(this.db, "account_roles", accountId));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      accountId,
      role: (data.role as AccountRoleRecord["role"]) ?? "Member",
      grantedBy: typeof data.grantedBy === "string" ? data.grantedBy : "",
      grantedAt: toISO(data.grantedAt),
    };
  }

  subscribeToAccountRoles(
    accountId: string,
    onUpdate: (record: AccountRoleRecord | null) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.db, "account_roles", accountId), (snap) => {
      if (!snap.exists()) {
        onUpdate(null);
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      onUpdate({
        accountId,
        role: (data.role as AccountRoleRecord["role"]) ?? "Member",
        grantedBy: typeof data.grantedBy === "string" ? data.grantedBy : "",
        grantedAt: toISO(data.grantedAt),
      });
    });
  }

  subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountSnapshot>) => void,
  ): Unsubscribe {
    const db = this.db;
    let ownerAccounts: Record<string, AccountSnapshot> = {};
    let memberAccounts: Record<string, AccountSnapshot> = {};

    const emit = () => {
      onUpdate({ ...ownerAccounts, ...memberAccounts });
    };

    // Organisations owned by the user
    const ownerQuery = query(
      collection(db, "accounts"),
      where("accountType", "==", "organization"),
      where("ownerId", "==", userId),
    );

    // Organisations where the user is a member
    const memberQuery = query(
      collection(db, "accounts"),
      where("accountType", "==", "organization"),
      where("memberIds", "array-contains", userId),
    );

    const unsubOwner = onSnapshot(ownerQuery, (snap) => {
      ownerAccounts = {};
      snap.docs.forEach((d) => {
        ownerAccounts[d.id] = toAccountSnapshot(d.id, d.data() as Record<string, unknown>);
      });
      emit();
    });

    const unsubMember = onSnapshot(memberQuery, (snap) => {
      memberAccounts = {};
      snap.docs.forEach((d) => {
        memberAccounts[d.id] = toAccountSnapshot(d.id, d.data() as Record<string, unknown>);
      });
      emit();
    });

    return () => {
      unsubOwner();
      unsubMember();
    };
  }
}
