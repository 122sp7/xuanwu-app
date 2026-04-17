import { v4 as randomUUID } from "uuid";
import type { TeamId } from "../value-objects/TeamId";
import type { TeamType } from "../value-objects/TeamType";
import type { OrganizationTeamDomainEvent } from "../events/OrganizationTeamDomainEvent";

export interface OrganizationTeamSnapshot {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly description: string;
  readonly teamType: TeamType;
  readonly memberIds: readonly string[];
}

export interface CreateOrganizationTeamProps {
  readonly organizationId: string;
  readonly name: string;
  readonly description?: string;
  readonly teamType: TeamType;
}

export class OrganizationTeam {
  private _domainEvents: OrganizationTeamDomainEvent[] = [];

  private constructor(private _props: OrganizationTeamSnapshot) {}

  static create(id: TeamId, props: CreateOrganizationTeamProps): OrganizationTeam {
    const team = new OrganizationTeam({
      id,
      organizationId: props.organizationId,
      name: props.name,
      description: props.description ?? "",
      teamType: props.teamType,
      memberIds: [],
    });
    team._domainEvents.push({
      type: "iam.organization.team_created",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: { teamId: id, organizationId: props.organizationId, name: props.name, teamType: props.teamType },
    });
    return team;
  }

  static reconstitute(snapshot: OrganizationTeamSnapshot): OrganizationTeam {
    return new OrganizationTeam(snapshot);
  }

  addMember(memberId: string): void {
    if (this._props.memberIds.includes(memberId)) return;
    this._props = { ...this._props, memberIds: [...this._props.memberIds, memberId] };
    this._domainEvents.push({
      type: "iam.organization.team_member_added",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: { teamId: this._props.id, organizationId: this._props.organizationId, memberId },
    });
  }

  removeMember(memberId: string): void {
    if (!this._props.memberIds.includes(memberId)) return;
    this._props = { ...this._props, memberIds: this._props.memberIds.filter((id) => id !== memberId) };
    this._domainEvents.push({
      type: "iam.organization.team_member_removed",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: { teamId: this._props.id, organizationId: this._props.organizationId, memberId },
    });
  }

  delete(): void {
    this._domainEvents.push({
      type: "iam.organization.team_deleted",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: { teamId: this._props.id, organizationId: this._props.organizationId },
    });
  }

  get id(): TeamId { return this._props.id as TeamId; }

  getSnapshot(): Readonly<OrganizationTeamSnapshot> {
    return Object.freeze({ ...this._props, memberIds: [...this._props.memberIds] });
  }

  pullDomainEvents(): OrganizationTeamDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
