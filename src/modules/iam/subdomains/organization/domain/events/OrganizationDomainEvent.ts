export interface OrganizationDomainEventBase {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface OrganizationCreatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.created";
  readonly payload: { readonly organizationId: string; readonly name: string; readonly ownerId: string };
}

export interface OrganizationSettingsUpdatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.settings_updated";
  readonly payload: { readonly organizationId: string; readonly name?: string; readonly description?: string };
}

export interface OrganizationDeletedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.deleted";
  readonly payload: { readonly organizationId: string };
}

export interface MemberRecruitedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.member_recruited";
  readonly payload: { readonly organizationId: string; readonly memberId: string };
}

export interface MemberRemovedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.member_removed";
  readonly payload: { readonly organizationId: string; readonly memberId: string };
}

export interface MemberRoleUpdatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.member_role_updated";
  readonly payload: { readonly organizationId: string; readonly memberId: string; readonly role: string };
}

export interface TeamCreatedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.team_created";
  readonly payload: { readonly organizationId: string; readonly teamId: string; readonly name: string; readonly teamType: "internal" | "external" };
}

export interface TeamDeletedEvent extends OrganizationDomainEventBase {
  readonly type: "iam.organization.team_deleted";
  readonly payload: { readonly organizationId: string; readonly teamId: string };
}

export type OrganizationDomainEventType =
  | OrganizationCreatedEvent
  | OrganizationSettingsUpdatedEvent
  | OrganizationDeletedEvent
  | MemberRecruitedEvent
  | MemberRemovedEvent
  | MemberRoleUpdatedEvent
  | TeamCreatedEvent
  | TeamDeletedEvent;
