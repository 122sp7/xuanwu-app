import type { ThemeConfig } from "../entities/Organization";
import type { MemberRole, OrganizationStatus } from "../value-objects";

export interface OrganizationDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface OrganizationCreatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.created";
	readonly payload: {
		readonly organizationId: string;
		readonly name: string;
		readonly ownerId: string;
		readonly ownerName: string;
		readonly ownerEmail: string;
		readonly theme: ThemeConfig | null;
	};
}

export interface SettingsUpdatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.settings_updated";
	readonly payload: {
		readonly organizationId: string;
		readonly name: string;
		readonly description: string | null;
		readonly photoURL: string | null;
		readonly theme: ThemeConfig | null;
	};
}

export interface MemberAddedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.member_added";
	readonly payload: {
		readonly organizationId: string;
		readonly memberId: string;
		readonly name: string;
		readonly email: string;
		readonly role: MemberRole;
		readonly memberCount: number;
	};
}

export interface MemberRemovedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.member_removed";
	readonly payload: {
		readonly organizationId: string;
		readonly memberId: string;
		readonly memberCount: number;
	};
}

export interface MemberRoleUpdatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.member_role_updated";
	readonly payload: {
		readonly organizationId: string;
		readonly memberId: string;
		readonly previousRole: MemberRole;
		readonly role: MemberRole;
	};
}

export interface OrganizationSuspendedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.suspended";
	readonly payload: {
		readonly organizationId: string;
		readonly status: OrganizationStatus;
	};
}

export interface OrganizationDissolvedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.dissolved";
	readonly payload: {
		readonly organizationId: string;
		readonly status: OrganizationStatus;
	};
}

export interface OrganizationReactivatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.reactivated";
	readonly payload: {
		readonly organizationId: string;
		readonly status: OrganizationStatus;
	};
}

export type OrganizationDomainEventType =
	| OrganizationCreatedEvent
	| SettingsUpdatedEvent
	| MemberAddedEvent
	| MemberRemovedEvent
	| MemberRoleUpdatedEvent
	| OrganizationSuspendedEvent
	| OrganizationDissolvedEvent
	| OrganizationReactivatedEvent;
