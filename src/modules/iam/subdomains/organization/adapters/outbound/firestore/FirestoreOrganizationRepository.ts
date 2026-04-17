/**
 * FirestoreOrganizationRepository — iam/organization outbound adapter.
 *
 * Implements OrganizationRepository using Firebase Firestore.
 *
 * Firestore schema:
 *   accounts/{orgId}          — account-level record (queried by subscribeToAccountsForUser)
 *     accountType: "organization"
 *     ownerId: string          — owner's Firebase uid
 *     memberIds: string[]      — array-contains index for member queries
 *   organizations/{orgId}     — organisation domain document
 *   org_members/{orgId}/members/{memberId}
 *   org_teams/{orgId}/teams/{teamId}
 *   org_partner_invites/{orgId}/invites/{inviteId}
 *
 * The `accounts/{orgId}` document is maintained in sync so that the existing
 * subscribeToAccountsForUser query (which filters on `ownerId` and `memberIds`)
 * surfaces the new organisation to the creator immediately.
 *
 * This file is in adapters/outbound/firestore/ — @integration-firebase is NOT
 * directly imported; callers at module/adapters/outbound/ use @integration-firebase
 * and pass Firebase-specific helpers via the FirestoreLike port.
 */

import { v4 as uuid } from "uuid";
import type {
  OrganizationRepository,
} from "../../../domain/repositories/OrganizationRepository";
import type {
  MemberReference,
  Team,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../../../domain/entities/Organization";
import type { OrganizationSnapshot } from "../../../domain/aggregates/Organization";

// ── Infrastructure port ───────────────────────────────────────────────────────
// We keep this file Firebase-SDK-free by accepting a narrow persistence port.
// The module-level composition root wires in the real Firebase implementation.

export interface OrgFirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  getSubcollection(collection: string, parentId: string, sub: string): Promise<{ id: string; data: Record<string, unknown> }[]>;
  setSubdoc(collection: string, parentId: string, sub: string, id: string, data: Record<string, unknown>): Promise<void>;
  deleteSubdoc(collection: string, parentId: string, sub: string, id: string): Promise<void>;
}

// ── Repository ────────────────────────────────────────────────────────────────

export class FirestoreOrganizationRepository implements OrganizationRepository {
  private readonly orgCol = "organizations";
  private readonly accountCol = "accounts";

  constructor(private readonly db: OrgFirestoreLike) {}

  // ── Organisation lifecycle ─────────────────────────────────────────────────

  async create(command: CreateOrganizationCommand): Promise<string> {
    const orgId = uuid();
    const now = new Date().toISOString();

    // 1. Write organisation domain document
    await this.db.set(this.orgCol, orgId, {
      id: orgId,
      name: command.organizationName,
      ownerId: command.ownerId,
      ownerName: command.ownerName,
      ownerEmail: command.ownerEmail,
      description: "",
      photoURL: null,
      status: "active",
      createdAtISO: now,
      updatedAtISO: now,
    });

    // 2. Write account-level record so subscribeToAccountsForUser picks it up.
    //    The owner is listed in both `ownerId` (owner query) and `memberIds`
    //    (member query) to cover both Firestore subscription paths.
    await this.db.set(this.accountCol, orgId, {
      id: orgId,
      name: command.organizationName,
      accountType: "organization",
      email: command.ownerEmail,
      photoURL: null,
      bio: null,
      status: "active",
      ownerId: command.ownerId,
      memberIds: [command.ownerId],
      walletBalance: 0,
      createdAtISO: now,
      updatedAtISO: now,
    });

    // 3. Add owner as first member document
    await this.db.setSubdoc(this.orgCol, orgId, "members", command.ownerId, {
      id: command.ownerId,
      name: command.ownerName,
      email: command.ownerEmail,
      role: "Owner",
      presence: "active",
      isExternal: false,
    });

    return orgId;
  }

  async findById(id: string): Promise<OrganizationSnapshot | null> {
    const doc = await this.db.get(this.orgCol, id);
    if (!doc) return null;
    return doc as unknown as OrganizationSnapshot;
  }

  async save(snapshot: OrganizationSnapshot): Promise<void> {
    await this.db.set(this.orgCol, snapshot.id, snapshot as unknown as Record<string, unknown>);
    // Keep the account document name in sync
    await this.db.set(this.accountCol, snapshot.id, {
      name: snapshot.name,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void> {
    const existing = await this.db.get(this.orgCol, command.organizationId);
    if (!existing) throw new Error(`Organisation ${command.organizationId} not found`);
    const now = new Date().toISOString();
    const patch: Record<string, unknown> = { updatedAtISO: now };
    if (command.name !== undefined) patch.name = command.name;
    if (command.description !== undefined) patch.description = command.description;
    if (command.photoURL !== undefined) patch.photoURL = command.photoURL;
    if (command.theme !== undefined) patch.theme = command.theme;
    await this.db.set(this.orgCol, command.organizationId, { ...existing, ...patch });
    // Sync account display name
    if (command.name !== undefined) {
      const acc = await this.db.get(this.accountCol, command.organizationId);
      if (acc) {
        await this.db.set(this.accountCol, command.organizationId, {
          ...acc,
          name: command.name,
          updatedAtISO: now,
        });
      }
    }
  }

  async delete(organizationId: string): Promise<void> {
    await this.db.delete(this.orgCol, organizationId);
    await this.db.delete(this.accountCol, organizationId);
  }

  // ── Members ────────────────────────────────────────────────────────────────

  async inviteMember(input: InviteMemberInput): Promise<string> {
    const inviteId = uuid();
    await this.db.setSubdoc(this.orgCol, input.organizationId, "invites", inviteId, {
      id: inviteId,
      email: input.email,
      teamId: input.teamId,
      role: input.role,
      inviteState: "pending",
      invitedAt: new Date().toISOString(),
      protocol: input.protocol,
    });
    return inviteId;
  }

  async recruitMember(
    organizationId: string,
    memberId: string,
    name: string,
    email: string,
  ): Promise<void> {
    await this.db.setSubdoc(this.orgCol, organizationId, "members", memberId, {
      id: memberId,
      name,
      email,
      role: "Member",
      presence: "active",
      isExternal: false,
    });
    // Update memberIds array in the account document
    const acc = await this.db.get(this.accountCol, organizationId);
    if (acc) {
      const ids = Array.isArray(acc.memberIds) ? (acc.memberIds as string[]) : [];
      if (!ids.includes(memberId)) {
        await this.db.set(this.accountCol, organizationId, {
          ...acc,
          memberIds: [...ids, memberId],
          updatedAtISO: new Date().toISOString(),
        });
      }
    }
  }

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    await this.db.deleteSubdoc(this.orgCol, organizationId, "members", memberId);
    const acc = await this.db.get(this.accountCol, organizationId);
    if (acc) {
      const ids = Array.isArray(acc.memberIds) ? (acc.memberIds as string[]) : [];
      await this.db.set(this.accountCol, organizationId, {
        ...acc,
        memberIds: ids.filter((id) => id !== memberId),
        updatedAtISO: new Date().toISOString(),
      });
    }
  }

  async updateMemberRole(input: UpdateMemberRoleInput): Promise<void> {
    const members = await this.getMembers(input.organizationId);
    const member = members.find((m) => m.id === input.memberId);
    if (!member) throw new Error(`Member ${input.memberId} not found`);
    await this.db.setSubdoc(this.orgCol, input.organizationId, "members", input.memberId, {
      ...member,
      role: input.role,
    });
  }

  async getMembers(organizationId: string): Promise<MemberReference[]> {
    const docs = await this.db.getSubcollection(this.orgCol, organizationId, "members");
    return docs.map((d) => d.data as unknown as MemberReference);
  }

  subscribeToMembers(
    _organizationId: string,
    _onUpdate: (members: MemberReference[]) => void,
  ): () => void {
    // Real-time members subscription — implement when member management UI is built.
    // For now, emit an empty list immediately and return a no-op unsubscribe.
    _onUpdate([]);
    return () => {};
  }

  // ── Teams ──────────────────────────────────────────────────────────────────

  async createTeam(input: CreateTeamInput): Promise<string> {
    const teamId = uuid();
    await this.db.setSubdoc(this.orgCol, input.organizationId, "teams", teamId, {
      id: teamId,
      name: input.name,
      description: input.description,
      type: input.type,
      memberIds: [],
    });
    return teamId;
  }

  async deleteTeam(organizationId: string, teamId: string): Promise<void> {
    await this.db.deleteSubdoc(this.orgCol, organizationId, "teams", teamId);
  }

  async addMemberToTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
  ): Promise<void> {
    const teams = await this.getTeams(organizationId);
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error(`Team ${teamId} not found`);
    if (!team.memberIds.includes(memberId)) {
      await this.db.setSubdoc(this.orgCol, organizationId, "teams", teamId, {
        ...team,
        memberIds: [...team.memberIds, memberId],
      });
    }
  }

  async removeMemberFromTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
  ): Promise<void> {
    const teams = await this.getTeams(organizationId);
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    await this.db.setSubdoc(this.orgCol, organizationId, "teams", teamId, {
      ...team,
      memberIds: team.memberIds.filter((id) => id !== memberId),
    });
  }

  async getTeams(organizationId: string): Promise<Team[]> {
    const docs = await this.db.getSubcollection(this.orgCol, organizationId, "teams");
    return docs.map((d) => d.data as unknown as Team);
  }

  subscribeToTeams(
    _organizationId: string,
    _onUpdate: (teams: Team[]) => void,
  ): () => void {
    // Real-time teams subscription — implement when team management UI is built.
    _onUpdate([]);
    return () => {};
  }

  // ── Partner invites ────────────────────────────────────────────────────────

  async sendPartnerInvite(
    organizationId: string,
    teamId: string,
    email: string,
  ): Promise<string> {
    const inviteId = uuid();
    await this.db.setSubdoc(this.orgCol, organizationId, "partner_invites", inviteId, {
      id: inviteId,
      email,
      teamId,
      role: "Guest",
      inviteState: "pending",
      invitedAt: new Date().toISOString(),
      protocol: "email",
    });
    return inviteId;
  }

  async dismissPartnerMember(
    organizationId: string,
    teamId: string,
    memberId: string,
  ): Promise<void> {
    await this.removeMemberFromTeam(organizationId, teamId, memberId);
  }

  async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]> {
    const docs = await this.db.getSubcollection(this.orgCol, organizationId, "partner_invites");
    return docs.map((d) => d.data as unknown as PartnerInvite);
  }
}
