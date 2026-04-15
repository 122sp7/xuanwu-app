export interface AccountDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface AccountCreatedEvent extends AccountDomainEvent {
	readonly type: "iam.account.created";
	readonly payload: {
		readonly accountId: string;
		readonly name: string;
		readonly accountType: "user" | "organization";
		readonly email: string | null;
	};
}

export interface ProfileUpdatedEvent extends AccountDomainEvent {
	readonly type: "iam.account.profile_updated";
	readonly payload: {
		readonly accountId: string;
		readonly name: string;
		readonly bio: string | null;
		readonly photoURL: string | null;
	};
}

export interface WalletCreditedEvent extends AccountDomainEvent {
	readonly type: "iam.account.wallet_credited";
	readonly payload: {
		readonly accountId: string;
		readonly amount: number;
		readonly description: string;
		readonly balance: number;
	};
}

export interface WalletDebitedEvent extends AccountDomainEvent {
	readonly type: "iam.account.wallet_debited";
	readonly payload: {
		readonly accountId: string;
		readonly amount: number;
		readonly description: string;
		readonly balance: number;
	};
}

export interface AccountSuspendedEvent extends AccountDomainEvent {
	readonly type: "iam.account.suspended";
	readonly payload: {
		readonly accountId: string;
	};
}

export interface AccountClosedEvent extends AccountDomainEvent {
	readonly type: "iam.account.closed";
	readonly payload: {
		readonly accountId: string;
	};
}

export interface AccountReactivatedEvent extends AccountDomainEvent {
	readonly type: "iam.account.reactivated";
	readonly payload: {
		readonly accountId: string;
	};
}

export type AccountDomainEventType =
	| AccountCreatedEvent
	| ProfileUpdatedEvent
	| WalletCreditedEvent
	| WalletDebitedEvent
	| AccountSuspendedEvent
	| AccountClosedEvent
	| AccountReactivatedEvent;
