import type { MemberRole } from "../entities/WorkspaceMember";

export interface MembershipDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface MemberAddedEvent extends MembershipDomainEvent {
  readonly type: "workspace.membership.member-added";
  readonly payload: { readonly memberId: string; readonly workspaceId: string; readonly actorId: string; readonly role: MemberRole };
}

export interface MemberRemovedEvent extends MembershipDomainEvent {
  readonly type: "workspace.membership.member-removed";
  readonly payload: { readonly memberId: string; readonly workspaceId: string };
}

export type MembershipDomainEventType = MemberAddedEvent | MemberRemovedEvent;
