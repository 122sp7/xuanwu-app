export interface IdentityDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface IdentityCreatedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.created";
	readonly payload: {
		readonly uid: string;
		readonly email: string | null;
		readonly isAnonymous: boolean;
	};
}

export interface SignedInEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.signed_in";
	readonly payload: {
		readonly uid: string;
		readonly signedInAtISO: string;
	};
}

export interface DisplayNameUpdatedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.display_name_updated";
	readonly payload: {
		readonly uid: string;
		readonly previousDisplayName: string | null;
		readonly displayName: string;
	};
}

export interface EmailVerifiedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.email_verified";
	readonly payload: {
		readonly uid: string;
		readonly email: string | null;
	};
}

export interface IdentitySuspendedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.suspended";
	readonly payload: {
		readonly uid: string;
	};
}

export interface IdentityReactivatedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.reactivated";
	readonly payload: {
		readonly uid: string;
	};
}

export type IdentityDomainEventType =
	| IdentityCreatedEvent
	| SignedInEvent
	| DisplayNameUpdatedEvent
	| EmailVerifiedEvent
	| IdentitySuspendedEvent
	| IdentityReactivatedEvent;
