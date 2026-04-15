export interface InvitationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface InvitationCreatedEvent extends InvitationDomainEvent {
  readonly type: "workspace.invitation.created";
  readonly payload: { readonly invitationId: string; readonly workspaceId: string; readonly invitedEmail: string };
}

export interface InvitationAcceptedEvent extends InvitationDomainEvent {
  readonly type: "workspace.invitation.accepted";
  readonly payload: { readonly invitationId: string; readonly workspaceId: string; readonly invitedEmail: string };
}

export type InvitationDomainEventType = InvitationCreatedEvent | InvitationAcceptedEvent;
