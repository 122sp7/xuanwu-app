import { v4 as uuid } from "@lib-uuid";
import type { AccountDomainEventType } from "../events/AccountDomainEvent";
import {
  canClose,
  canReactivate,
  canSuspend,
  type AccountStatus,
} from "../value-objects/AccountStatus";
import {
  createAccountId,
  createAccountType,
  createWalletAmount,
} from "../value-objects";

export interface AccountSnapshot {
  readonly id: string;
  readonly name: string;
  readonly accountType: "user" | "organization";
  readonly email: string | null;
  readonly photoURL: string | null;
  readonly bio: string | null;
  readonly status: "active" | "suspended" | "closed";
  readonly walletBalance: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateAccountInput {
  readonly name: string;
  readonly accountType: "user" | "organization";
  readonly email?: string | null;
  readonly photoURL?: string | null;
  readonly bio?: string | null;
}

export class Account {
  private readonly _domainEvents: AccountDomainEventType[] = [];

  private constructor(private _props: AccountSnapshot) {}

  static create(id: string, input: CreateAccountInput): Account {
    createAccountId(id);
    createAccountType(input.accountType);
    const now = new Date().toISOString();
    const account = new Account({
      id,
      name: input.name,
      accountType: input.accountType,
      email: input.email ?? null,
      photoURL: input.photoURL ?? null,
      bio: input.bio ?? null,
      status: "active",
      walletBalance: 0,
      createdAtISO: now,
      updatedAtISO: now,
    });
    account._domainEvents.push({
      type: "iam.account.created",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        accountId: id,
        name: input.name,
        accountType: input.accountType,
        email: input.email ?? null,
      },
    });
    return account;
  }

  static reconstitute(snapshot: AccountSnapshot): Account {
    createAccountId(snapshot.id);
    createAccountType(snapshot.accountType);
    if (snapshot.walletBalance < 0) {
      throw new Error("Wallet balance cannot be negative.");
    }
    return new Account({ ...snapshot });
  }

  updateProfile(input: {
    name?: string;
    bio?: string | null;
    photoURL?: string | null;
  }): void {
    if (this._props.status !== "active") {
      throw new Error("Only active account can update profile.");
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      name: input.name ?? this._props.name,
      bio: input.bio === undefined ? this._props.bio : input.bio,
      photoURL: input.photoURL === undefined ? this._props.photoURL : input.photoURL,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "iam.account.profile_updated",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        accountId: this._props.id,
        name: this._props.name,
        bio: this._props.bio,
        photoURL: this._props.photoURL,
      },
    });
  }

  creditWallet(amount: number, description: string): void {
    const creditAmount = createWalletAmount(amount);
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      walletBalance: this._props.walletBalance + creditAmount,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "iam.account.wallet_credited",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        accountId: this._props.id,
        amount: creditAmount,
        description,
        balance: this._props.walletBalance,
      },
    });
  }

  debitWallet(amount: number, description: string): void {
    const debitAmount = createWalletAmount(amount);
    if (this._props.walletBalance < debitAmount) {
      throw new Error("Insufficient wallet balance.");
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      walletBalance: this._props.walletBalance - debitAmount,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "iam.account.wallet_debited",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        accountId: this._props.id,
        amount: debitAmount,
        description,
        balance: this._props.walletBalance,
      },
    });
  }

  suspend(): void {
    if (!canSuspend(this._props.status)) {
      throw new Error("Only active account can be suspended.");
    }
    this.changeStatus("suspended", "iam.account.suspended");
  }

  close(): void {
    if (!canClose(this._props.status)) {
      throw new Error("Account is already closed.");
    }
    this.changeStatus("closed", "iam.account.closed");
  }

  reactivate(): void {
    if (!canReactivate(this._props.status)) {
      throw new Error("Only suspended account can be reactivated.");
    }
    this.changeStatus("active", "iam.account.reactivated");
  }

  get id(): string {
    return this._props.id;
  }

  get name(): string {
    return this._props.name;
  }

  get accountType(): "user" | "organization" {
    return this._props.accountType;
  }

  get email(): string | null {
    return this._props.email;
  }

  get photoURL(): string | null {
    return this._props.photoURL;
  }

  get bio(): string | null {
    return this._props.bio;
  }

  get status(): AccountStatus {
    return this._props.status;
  }

  get walletBalance(): number {
    return this._props.walletBalance;
  }

  get createdAtISO(): string {
    return this._props.createdAtISO;
  }

  get updatedAtISO(): string {
    return this._props.updatedAtISO;
  }

  getSnapshot(): Readonly<AccountSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): AccountDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private changeStatus(
    status: AccountStatus,
    eventType: "iam.account.suspended" | "iam.account.closed" | "iam.account.reactivated",
  ): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status, updatedAtISO: now };
    this._domainEvents.push({
      type: eventType,
      eventId: uuid(),
      occurredAt: now,
      payload: { accountId: this._props.id },
    });
  }
}
