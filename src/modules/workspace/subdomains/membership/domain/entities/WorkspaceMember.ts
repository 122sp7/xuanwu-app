import { v4 as uuid } from "uuid";
import type { MembershipDomainEventType } from "../events/MembershipDomainEvent";

export type MemberRole = "owner" | "admin" | "member" | "guest";

export const MEMBER_ROLES = ["owner", "admin", "member", "guest"] as const satisfies readonly MemberRole[];

export type MembershipStatus = "active" | "suspended" | "removed";

export interface WorkspaceMemberSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly role: MemberRole;
  readonly status: MembershipStatus;
  readonly displayName: string;
  readonly email: string | null;
  readonly joinedAtISO: string;
  readonly updatedAtISO: string;
}

export interface AddMemberInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly role: MemberRole;
  readonly displayName: string;
  readonly email?: string;
}

export class WorkspaceMember {
  private readonly _domainEvents: MembershipDomainEventType[] = [];

  private constructor(private _props: WorkspaceMemberSnapshot) {}

  static add(id: string, input: AddMemberInput): WorkspaceMember {
    const now = new Date().toISOString();
    const member = new WorkspaceMember({
      id,
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      role: input.role,
      status: "active",
      displayName: input.displayName,
      email: input.email ?? null,
      joinedAtISO: now,
      updatedAtISO: now,
    });
    member._domainEvents.push({
      type: "workspace.membership.member-added",
      eventId: uuid(),
      occurredAt: now,
      payload: { memberId: id, workspaceId: input.workspaceId, actorId: input.actorId, role: input.role },
    });
    return member;
  }

  static reconstitute(snapshot: WorkspaceMemberSnapshot): WorkspaceMember {
    return new WorkspaceMember({ ...snapshot });
  }

  changeRole(role: MemberRole): void {
    if (this._props.status !== "active") throw new Error("Cannot change role of inactive member.");
    const now = new Date().toISOString();
    this._props = { ...this._props, role, updatedAtISO: now };
  }

  remove(): void {
    if (this._props.status === "removed") throw new Error("Member is already removed.");
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "removed", updatedAtISO: now };
    this._domainEvents.push({
      type: "workspace.membership.member-removed",
      eventId: uuid(),
      occurredAt: now,
      payload: { memberId: this._props.id, workspaceId: this._props.workspaceId },
    });
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }
  get role(): MemberRole { return this._props.role; }

  getSnapshot(): Readonly<WorkspaceMemberSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): MembershipDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
