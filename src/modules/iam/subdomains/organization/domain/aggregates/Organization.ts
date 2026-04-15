import { v4 as uuid } from "@lib-uuid";
import type { OrganizationDomainEventType } from "../events/OrganizationDomainEvent";
import type { ThemeConfig } from "../entities/Organization";
import { createOrganizationId } from "../value-objects/OrganizationId";
import { createMemberRole, type MemberRole } from "../value-objects/MemberRole";
import { canSuspend, canDissolve, canReactivate, type OrganizationStatus } from "../value-objects/OrganizationStatus";

export interface OrganizationSnapshot {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
  readonly description: string | null;
  readonly photoURL: string | null;
  readonly theme: ThemeConfig | null;
  readonly memberCount: number;
  readonly teamCount: number;
  readonly status: OrganizationStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateOrganizationInput {
  readonly name: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
  readonly description?: string | null;
  readonly photoURL?: string | null;
  readonly theme?: ThemeConfig | null;
}

export class Organization {
  private readonly _domainEvents: OrganizationDomainEventType[] = [];
  private readonly _memberRoles = new Map<string, MemberRole>();

  private constructor(private _props: OrganizationSnapshot) {}

  static create(id: string, input: CreateOrganizationInput): Organization {
    createOrganizationId(id);
    Organization.assertRequired(input.name, "Organization name is required.");
    Organization.assertRequired(input.ownerId, "Owner id is required.");
    Organization.assertRequired(input.ownerName, "Owner name is required.");
    Organization.assertRequired(input.ownerEmail, "Owner email is required.");
    const now = new Date().toISOString();
    const aggregate = new Organization({
      id,
      name: input.name.trim(),
      ownerId: input.ownerId.trim(),
      ownerName: input.ownerName.trim(),
      ownerEmail: input.ownerEmail.trim(),
      description: input.description ?? null,
      photoURL: input.photoURL ?? null,
      theme: input.theme ?? null,
      memberCount: 1,
      teamCount: 0,
      status: "active",
      createdAtISO: now,
      updatedAtISO: now,
    });
    aggregate._memberRoles.set(aggregate._props.ownerId, "Owner");
    aggregate.recordEvent({
      type: "iam.organization.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { organizationId: aggregate._props.id, name: aggregate._props.name, ownerId: aggregate._props.ownerId },
    });
    return aggregate;
  }

  static reconstitute(snapshot: OrganizationSnapshot): Organization {
    createOrganizationId(snapshot.id);
    if (snapshot.memberCount < 1) throw new Error("Organization memberCount must be at least 1.");
    if (snapshot.teamCount < 0) throw new Error("Organization teamCount cannot be negative.");
    const aggregate = new Organization({ ...snapshot });
    aggregate._memberRoles.set(snapshot.ownerId, "Owner");
    return aggregate;
  }

  updateSettings(input: { name?: string; description?: string | null; photoURL?: string | null; theme?: ThemeConfig | null }): void {
    this.ensureActive("Only active organization can update settings.");
    if (input.name !== undefined) Organization.assertRequired(input.name, "Organization name is required.");
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      name: input.name === undefined ? this._props.name : input.name.trim(),
      description: input.description === undefined ? this._props.description : input.description,
      photoURL: input.photoURL === undefined ? this._props.photoURL : input.photoURL,
      theme: input.theme === undefined ? this._props.theme : input.theme,
      updatedAtISO: now,
    };
    this.recordEvent({
      type: "iam.organization.settings_updated",
      eventId: uuid(),
      occurredAt: now,
      payload: { organizationId: this._props.id, name: this._props.name, description: this._props.description ?? undefined },
    });
  }

  addMember(memberId: string, role: MemberRole): void {
    this.ensureActive("Only active organization can add members.");
    Organization.assertRequired(memberId, "Member id is required.");
    if (memberId === this._props.ownerId || this._memberRoles.has(memberId))
      throw new Error("Member already exists in organization.");
    const normalizedRole = createMemberRole(role);
    const now = new Date().toISOString();
    this._memberRoles.set(memberId, normalizedRole);
    this._props = { ...this._props, memberCount: this._props.memberCount + 1, updatedAtISO: now };
    this.recordEvent({
      type: "iam.organization.member_recruited",
      eventId: uuid(),
      occurredAt: now,
      payload: { organizationId: this._props.id, memberId },
    });
  }

  removeMember(memberId: string): void {
    this.ensureActive("Only active organization can remove members.");
    if (memberId === this._props.ownerId) throw new Error("Cannot remove organization owner.");
    if (!this._memberRoles.has(memberId)) throw new Error("Member does not exist in organization.");
    const now = new Date().toISOString();
    this._memberRoles.delete(memberId);
    this._props = { ...this._props, memberCount: this._props.memberCount - 1, updatedAtISO: now };
    this.recordEvent({
      type: "iam.organization.member_removed",
      eventId: uuid(),
      occurredAt: now,
      payload: { organizationId: this._props.id, memberId },
    });
  }

  updateMemberRole(memberId: string, newRole: MemberRole): void {
    this.ensureActive("Only active organization can update member roles.");
    if (memberId === this._props.ownerId) throw new Error("Cannot change organization owner role.");
    if (!this._memberRoles.has(memberId)) throw new Error("Member does not exist in organization.");
    const normalizedRole = createMemberRole(newRole);
    const now = new Date().toISOString();
    this._memberRoles.set(memberId, normalizedRole);
    this._props = { ...this._props, updatedAtISO: now };
    this.recordEvent({
      type: "iam.organization.member_role_updated",
      eventId: uuid(),
      occurredAt: now,
      payload: { organizationId: this._props.id, memberId, role: normalizedRole },
    });
  }

  suspend(): void {
    if (!canSuspend(this._props.status)) throw new Error("Only active organization can be suspended.");
    this.changeStatus("suspended");
  }

  dissolve(): void {
    if (!canDissolve(this._props.status)) throw new Error("Organization is already dissolved.");
    this.changeStatus("dissolved");
  }

  reactivate(): void {
    if (!canReactivate(this._props.status)) throw new Error("Only suspended organization can be reactivated.");
    this.changeStatus("active");
  }

  get id(): string { return this._props.id; }
  get name(): string { return this._props.name; }
  get ownerId(): string { return this._props.ownerId; }
  get status(): OrganizationStatus { return this._props.status; }
  get memberCount(): number { return this._props.memberCount; }

  getSnapshot(): Readonly<OrganizationSnapshot> { return Object.freeze({ ...this._props }); }

  pullDomainEvents(): OrganizationDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private changeStatus(status: OrganizationStatus): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status, updatedAtISO: now };
    if (status === "dissolved") {
      this.recordEvent({ type: "iam.organization.deleted", eventId: uuid(), occurredAt: now, payload: { organizationId: this._props.id } });
    }
  }

  private ensureActive(message: string): void {
    if (this._props.status !== "active") throw new Error(message);
  }

  private recordEvent(event: OrganizationDomainEventType): void {
    this._domainEvents.push(event);
  }

  private static assertRequired(value: string, message: string): void {
    if (value.trim().length === 0) throw new Error(message);
  }
}
