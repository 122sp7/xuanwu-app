import type { OrganizationRepository } from "../../../domain/repositories/OrganizationRepository";
import type {
  OrganizationSnapshot,
} from "../../../domain/aggregates/Organization";
import type { MemberReference, Team, PartnerInvite, CreateOrganizationCommand, UpdateOrganizationSettingsCommand, InviteMemberInput, UpdateMemberRoleInput, CreateTeamInput } from "../../../domain/entities/Organization";
import { v4 as uuid } from "@lib-uuid";

export class InMemoryOrganizationRepository implements OrganizationRepository {
  private readonly orgs = new Map<string, OrganizationSnapshot>();
  private readonly members = new Map<string, MemberReference[]>();
  private readonly teams = new Map<string, Team[]>();
  private readonly partnerInvites = new Map<string, PartnerInvite[]>();

  async create(command: CreateOrganizationCommand): Promise<string> {
    const id = uuid();
    const now = new Date().toISOString();
    this.orgs.set(id, {
      id,
      name: command.organizationName,
      ownerId: command.ownerId,
      ownerName: command.ownerName,
      ownerEmail: command.ownerEmail,
      description: null,
      photoURL: null,
      theme: null,
      memberCount: 1,
      teamCount: 0,
      status: "active",
      createdAtISO: now,
      updatedAtISO: now,
    });
    this.members.set(id, [
      { id: command.ownerId, name: command.ownerName, email: command.ownerEmail, role: "Owner", presence: "active" },
    ]);
    this.teams.set(id, []);
    this.partnerInvites.set(id, []);
    return id;
  }

  async findById(id: string): Promise<OrganizationSnapshot | null> {
    return this.orgs.get(id) ?? null;
  }

  async save(snapshot: OrganizationSnapshot): Promise<void> {
    this.orgs.set(snapshot.id, { ...snapshot });
  }

  async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void> {
    const org = this.orgs.get(command.organizationId);
    if (!org) return;
    this.orgs.set(command.organizationId, {
      ...org,
      name: command.name ?? org.name,
      description: command.description ?? org.description,
      photoURL: command.photoURL ?? org.photoURL,
      theme: command.theme ?? org.theme,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async delete(organizationId: string): Promise<void> {
    this.orgs.delete(organizationId);
  }

  async inviteMember(input: InviteMemberInput): Promise<string> {
    const inviteId = uuid();
    const invites = this.partnerInvites.get(input.organizationId) ?? [];
    invites.push({ id: inviteId, email: input.email, teamId: input.teamId, role: input.role, inviteState: "pending", invitedAt: new Date().toISOString(), protocol: input.protocol });
    this.partnerInvites.set(input.organizationId, invites);
    return inviteId;
  }

  async recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void> {
    const list = this.members.get(organizationId) ?? [];
    if (!list.find((m) => m.id === memberId)) {
      list.push({ id: memberId, name, email, role: "Member", presence: "active" });
      this.members.set(organizationId, list);
    }
  }

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    const list = this.members.get(organizationId) ?? [];
    this.members.set(organizationId, list.filter((m) => m.id !== memberId));
  }

  async updateMemberRole(input: UpdateMemberRoleInput): Promise<void> {
    const list = this.members.get(input.organizationId) ?? [];
    this.members.set(input.organizationId, list.map((m) => m.id === input.memberId ? { ...m, role: input.role } : m));
  }

  async getMembers(organizationId: string): Promise<MemberReference[]> {
    return this.members.get(organizationId) ?? [];
  }

  subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): () => void {
    onUpdate(this.members.get(organizationId) ?? []);
    return () => {};
  }

  async createTeam(input: CreateTeamInput): Promise<string> {
    const teamId = uuid();
    const list = this.teams.get(input.organizationId) ?? [];
    list.push({ id: teamId, name: input.name, description: input.description, type: input.type, memberIds: [] });
    this.teams.set(input.organizationId, list);
    return teamId;
  }

  async deleteTeam(organizationId: string, teamId: string): Promise<void> {
    const list = this.teams.get(organizationId) ?? [];
    this.teams.set(organizationId, list.filter((t) => t.id !== teamId));
  }

  async addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    const list = this.teams.get(organizationId) ?? [];
    this.teams.set(organizationId, list.map((t) => t.id === teamId ? { ...t, memberIds: [...t.memberIds, memberId] } : t));
  }

  async removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    const list = this.teams.get(organizationId) ?? [];
    this.teams.set(organizationId, list.map((t) => t.id === teamId ? { ...t, memberIds: t.memberIds.filter((id) => id !== memberId) } : t));
  }

  async getTeams(organizationId: string): Promise<Team[]> {
    return this.teams.get(organizationId) ?? [];
  }

  subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): () => void {
    onUpdate(this.teams.get(organizationId) ?? []);
    return () => {};
  }

  async sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string> {
    const inviteId = uuid();
    const invites = this.partnerInvites.get(organizationId) ?? [];
    invites.push({ id: inviteId, email, teamId, role: "Guest", inviteState: "pending", invitedAt: new Date().toISOString(), protocol: "email" });
    this.partnerInvites.set(organizationId, invites);
    return inviteId;
  }

  async dismissPartnerMember(organizationId: string, _teamId: string, memberId: string): Promise<void> {
    await this.removeMember(organizationId, memberId);
  }

  async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]> {
    return this.partnerInvites.get(organizationId) ?? [];
  }
}
