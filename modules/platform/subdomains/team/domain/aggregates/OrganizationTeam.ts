/**
 * OrganizationTeam — Aggregate Root
 *
 * Represents a named grouping of members within an Organization boundary.
 * OrganizationTeam is a subdomain concept of platform/team; it is NOT an
 * independent Tenant. Teams may be internal (org-only members) or external
 * (partner/guest actors included).
 *
 * Invariants:
 *   - A team must belong to exactly one Organization (organizationId is immutable)
 *   - A member may appear in a team's memberIds at most once
 *   - teamType cannot change after creation (replace-and-recreate pattern)
 *   - addMember and removeMember are idempotent: duplicate/absent memberId is a no-op (no event)
 */

import { randomUUID } from "crypto";
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

  // ── Factory — new team ────────────────────────────────────────────────────

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
      type: "team.created",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: id,
        organizationId: props.organizationId,
        name: props.name,
        teamType: props.teamType,
      },
    });
    return team;
  }

  // ── Factory — reconstitute from persistence ───────────────────────────────

  static reconstitute(snapshot: OrganizationTeamSnapshot): OrganizationTeam {
    return new OrganizationTeam(snapshot);
  }

  // ── Commands ──────────────────────────────────────────────────────────────

  /**
   * Add a member to the team.
   * Idempotent: if memberId is already in the team the call is a no-op and
   * no domain event is emitted, so callers may safely call this multiple times.
   */
  addMember(memberId: string): void {
    if (this._props.memberIds.includes(memberId)) return; // idempotent, no event emitted
    this._props = {
      ...this._props,
      memberIds: [...this._props.memberIds, memberId],
    };
    this._domainEvents.push({
      type: "team.member-added",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: this._props.id,
        organizationId: this._props.organizationId,
        memberId,
      },
    });
  }

  /**
   * Remove a member from the team.
   * Idempotent: if memberId is not in the team the call is a no-op and
   * no domain event is emitted, supporting at-least-once removal semantics.
   */
  removeMember(memberId: string): void {
    if (!this._props.memberIds.includes(memberId)) return; // idempotent, no event emitted
    this._props = {
      ...this._props,
      memberIds: this._props.memberIds.filter((id) => id !== memberId),
    };
    this._domainEvents.push({
      type: "team.member-removed",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: this._props.id,
        organizationId: this._props.organizationId,
        memberId,
      },
    });
  }

  delete(): void {
    this._domainEvents.push({
      type: "team.deleted",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: this._props.id,
        organizationId: this._props.organizationId,
      },
    });
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  get id(): TeamId {
    return this._props.id as TeamId;
  }

  getSnapshot(): Readonly<OrganizationTeamSnapshot> {
    return Object.freeze({ ...this._props, memberIds: [...this._props.memberIds] });
  }

  pullDomainEvents(): OrganizationTeamDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
