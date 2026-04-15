import { v4 as uuid } from "@lib-uuid";
import type { InvitationDomainEventType } from "../events/InvitationDomainEvent";

export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired" | "cancelled";

export const INVITATION_STATUSES = ["pending", "accepted", "rejected", "expired", "cancelled"] as const satisfies readonly InvitationStatus[];

export interface WorkspaceInvitationSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly invitedEmail: string;
  readonly invitedByActorId: string;
  readonly role: string;
  readonly status: InvitationStatus;
  readonly token: string;
  readonly expiresAtISO: string;
  readonly acceptedAtISO: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateInvitationInput {
  readonly workspaceId: string;
  readonly invitedEmail: string;
  readonly invitedByActorId: string;
  readonly role: string;
  readonly expiresAtISO: string;
}

export class WorkspaceInvitation {
  private readonly _domainEvents: InvitationDomainEventType[] = [];

  private constructor(private _props: WorkspaceInvitationSnapshot) {}

  static create(id: string, input: CreateInvitationInput): WorkspaceInvitation {
    const now = new Date().toISOString();
    const invitation = new WorkspaceInvitation({
      id,
      workspaceId: input.workspaceId,
      invitedEmail: input.invitedEmail,
      invitedByActorId: input.invitedByActorId,
      role: input.role,
      status: "pending",
      token: uuid(),
      expiresAtISO: input.expiresAtISO,
      acceptedAtISO: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    invitation._domainEvents.push({
      type: "workspace.invitation.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { invitationId: id, workspaceId: input.workspaceId, invitedEmail: input.invitedEmail },
    });
    return invitation;
  }

  static reconstitute(snapshot: WorkspaceInvitationSnapshot): WorkspaceInvitation {
    return new WorkspaceInvitation({ ...snapshot });
  }

  accept(): void {
    if (this._props.status !== "pending") throw new Error("Cannot accept non-pending invitation.");
    if (new Date() > new Date(this._props.expiresAtISO)) throw new Error("Invitation has expired.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "accepted", acceptedAtISO: now, updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.invitation.accepted",
      eventId: uuid(),
      occurredAt: now,
      payload: { invitationId: this._props.id, workspaceId: this._props.workspaceId, invitedEmail: this._props.invitedEmail },
    });
  }

  reject(): void {
    if (this._props.status !== "pending") throw new Error("Cannot reject non-pending invitation.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "rejected", updatedAtISO: now };
  }

  cancel(): void {
    if (this._props.status !== "pending") throw new Error("Cannot cancel non-pending invitation.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "cancelled", updatedAtISO: now };
  }

  get id(): string { return this._props.id; }
  get status(): InvitationStatus { return this._props.status; }
  get token(): string { return this._props.token; }

  getSnapshot(): Readonly<WorkspaceInvitationSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): InvitationDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
