/**
 * FirebaseOrganizationRepository — Infrastructure adapter for organization persistence.
 * Implements the OrganizationRepository port.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { OrganizationRepository, Unsubscribe } from "../../domain/repositories/OrganizationRepository";
import type {
  OrganizationEntity,
  MemberReference,
  Team,
  OrgPolicy,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
  OrganizationRole,
} from "../../domain/entities/Organization";

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toOrganizationEntity(id: string, data: Record<string, unknown>): OrganizationEntity {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    ownerId: typeof data.ownerId === "string" ? data.ownerId : "",
    email: typeof data.email === "string" ? data.email : undefined,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    description: typeof data.description === "string" ? data.description : undefined,
    theme: data.theme != null ? (data.theme as OrganizationEntity["theme"]) : undefined,
    members: Array.isArray(data.members) ? (data.members as MemberReference[]) : [],
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
    teams: Array.isArray(data.teams) ? (data.teams as Team[]) : [],
    partnerInvites: Array.isArray(data.partnerInvites)
      ? (data.partnerInvites as PartnerInvite[])
      : undefined,
    createdAt: data.createdAt as OrganizationEntity["createdAt"],
  };
}

function toOrgPolicy(id: string, data: Record<string, unknown>): OrgPolicy {
  const VALID_SCOPES = new Set<OrgPolicy["scope"]>(["workspace", "member", "global"]);
  const scope = VALID_SCOPES.has(data.scope as OrgPolicy["scope"])
    ? (data.scope as OrgPolicy["scope"])
    : "global";
  return {
    id,
    orgId: data.orgId as string,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    rules: Array.isArray(data.rules) ? (data.rules as OrgPolicy["rules"]) : [],
    scope,
    isActive: data.isActive === true,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class FirebaseOrganizationRepository implements OrganizationRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  // ─── Org Lifecycle ──────────────────────────────────────────────────────────

  async create(command: CreateOrganizationCommand): Promise<string> {
    const orgRef = doc(collection(this.db, "organizations"));
    const owner: MemberReference = {
      id: command.ownerId,
      name: command.ownerName,
      email: command.ownerEmail,
      role: "Owner",
      presence: "active",
    };
    await setDoc(orgRef, {
      name: command.organizationName,
      ownerId: command.ownerId,
      members: [owner],
      memberIds: [command.ownerId],
      teams: [],
      createdAt: serverTimestamp(),
    });
    return orgRef.id;
  }

  async findById(id: string): Promise<OrganizationEntity | null> {
    const snap = await getDoc(doc(this.db, "organizations", id));
    if (!snap.exists()) return null;
    return toOrganizationEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async save(org: OrganizationEntity): Promise<void> {
    await setDoc(doc(this.db, "organizations", org.id), {
      name: org.name,
      ownerId: org.ownerId,
      members: org.members,
      memberIds: org.memberIds,
      teams: org.teams,
      updatedAt: serverTimestamp(),
    });
  }

  async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void> {
    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (command.name !== undefined) updates.name = command.name;
    if (command.description !== undefined) updates.description = command.description;
    if (command.theme !== undefined) updates.theme = command.theme;
    if (command.photoURL !== undefined) updates.photoURL = command.photoURL;
    await updateDoc(doc(this.db, "organizations", command.organizationId), updates);
  }

  async delete(organizationId: string): Promise<void> {
    await deleteDoc(doc(this.db, "organizations", organizationId));
  }

  // ─── Members ────────────────────────────────────────────────────────────────

  async inviteMember(input: InviteMemberInput): Promise<string> {
    const invite = {
      email: input.email,
      teamId: input.teamId,
      role: input.role,
      inviteState: "pending",
      protocol: input.protocol,
      invitedAt: serverTimestamp(),
    };
    const ref = await addDoc(
      collection(this.db, "organizations", input.organizationId, "invites"),
      invite,
    );
    return ref.id;
  }

  async recruitMember(
    organizationId: string,
    memberId: string,
    name: string,
    email: string,
  ): Promise<void> {
    const member: MemberReference = {
      id: memberId,
      name,
      email,
      role: "Member",
      presence: "active",
    };
    await updateDoc(doc(this.db, "organizations", organizationId), {
      members: arrayUnion(member),
      memberIds: arrayUnion(memberId),
      updatedAt: serverTimestamp(),
    });
  }

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    const orgSnap = await getDoc(doc(this.db, "organizations", organizationId));
    if (!orgSnap.exists()) return;
    const data = orgSnap.data() as Record<string, unknown>;
    const members = Array.isArray(data.members)
      ? (data.members as MemberReference[]).filter((m) => m.id !== memberId)
      : [];
    await updateDoc(doc(this.db, "organizations", organizationId), {
      members,
      memberIds: arrayRemove(memberId),
      updatedAt: serverTimestamp(),
    });
  }

  async updateMemberRole(input: UpdateMemberRoleInput): Promise<void> {
    const orgSnap = await getDoc(doc(this.db, "organizations", input.organizationId));
    if (!orgSnap.exists()) return;
    const data = orgSnap.data() as Record<string, unknown>;
    const members = Array.isArray(data.members)
      ? (data.members as MemberReference[]).map((m) =>
          m.id === input.memberId ? { ...m, role: input.role as OrganizationRole } : m,
        )
      : [];
    await updateDoc(doc(this.db, "organizations", input.organizationId), {
      members,
      updatedAt: serverTimestamp(),
    });
  }

  async getMembers(organizationId: string): Promise<MemberReference[]> {
    const snap = await getDoc(doc(this.db, "organizations", organizationId));
    if (!snap.exists()) return [];
    const data = snap.data() as Record<string, unknown>;
    return Array.isArray(data.members) ? (data.members as MemberReference[]) : [];
  }

  subscribeToMembers(
    organizationId: string,
    onUpdate: (members: MemberReference[]) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.db, "organizations", organizationId), (snap) => {
      if (!snap.exists()) {
        onUpdate([]);
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      onUpdate(Array.isArray(data.members) ? (data.members as MemberReference[]) : []);
    });
  }

  // ─── Teams ──────────────────────────────────────────────────────────────────

  async createTeam(input: CreateTeamInput): Promise<string> {
    const teamRef = doc(collection(this.db, "organizations", input.organizationId, "teams"));
    await setDoc(teamRef, {
      name: input.name,
      description: input.description,
      type: input.type,
      memberIds: [],
      createdAt: serverTimestamp(),
    });
    return teamRef.id;
  }

  async deleteTeam(organizationId: string, teamId: string): Promise<void> {
    await deleteDoc(doc(this.db, "organizations", organizationId, "teams", teamId));
  }

  async addMemberToTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
  ): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayUnion(memberId),
    });
  }

  async removeMemberFromTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
  ): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayRemove(memberId),
    });
  }

  async getTeams(organizationId: string): Promise<Team[]> {
    const snaps = await getDocs(
      collection(this.db, "organizations", organizationId, "teams"),
    );
    return snaps.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        name: typeof data.name === "string" ? data.name : "",
        description: typeof data.description === "string" ? data.description : "",
        type: data.type === "external" ? "external" : "internal",
        memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
      };
    });
  }

  subscribeToTeams(
    organizationId: string,
    onUpdate: (teams: Team[]) => void,
  ): Unsubscribe {
    return onSnapshot(
      collection(this.db, "organizations", organizationId, "teams"),
      (snap) => {
        const teams: Team[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            name: typeof data.name === "string" ? data.name : "",
            description: typeof data.description === "string" ? data.description : "",
            type: data.type === "external" ? "external" : "internal",
            memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
          };
        });
        onUpdate(teams);
      },
    );
  }

  // ─── Partners ────────────────────────────────────────────────────────────────

  async sendPartnerInvite(
    organizationId: string,
    teamId: string,
    email: string,
  ): Promise<string> {
    const ref = await addDoc(
      collection(this.db, "organizations", organizationId, "partnerInvites"),
      {
        email,
        teamId,
        role: "Guest",
        inviteState: "pending",
        invitedAt: serverTimestamp(),
      },
    );
    return ref.id;
  }

  async dismissPartnerMember(
    organizationId: string,
    teamId: string,
    memberId: string,
  ): Promise<void> {
    await this.removeMemberFromTeam(organizationId, teamId, memberId);
  }

  async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]> {
    const snaps = await getDocs(
      collection(this.db, "organizations", organizationId, "partnerInvites"),
    );
    return snaps.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        email: data.email as string,
        teamId: data.teamId as string,
        role: (data.role as OrganizationRole) ?? "Guest",
        inviteState: (data.inviteState as PartnerInvite["inviteState"]) ?? "pending",
        invitedAt: data.invitedAt as PartnerInvite["invitedAt"],
        protocol: typeof data.protocol === "string" ? data.protocol : "",
      };
    });
  }

  // ─── Policy ──────────────────────────────────────────────────────────────────

  async createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy> {
    const now = new Date().toISOString();
    const ref = await addDoc(collection(this.db, "orgPolicies"), {
      orgId: input.orgId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      scope: input.scope,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      _createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      orgId: input.orgId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      scope: input.scope,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void> {
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      _updatedAt: serverTimestamp(),
    };
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.rules !== undefined) updates.rules = data.rules;
    if (data.scope !== undefined) updates.scope = data.scope;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    await updateDoc(doc(this.db, "orgPolicies", policyId), updates);
  }

  async deletePolicy(policyId: string): Promise<void> {
    await deleteDoc(doc(this.db, "orgPolicies", policyId));
  }

  async getPolicies(orgId: string): Promise<OrgPolicy[]> {
    const q = query(collection(this.db, "orgPolicies"), where("orgId", "==", orgId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toOrgPolicy(d.id, d.data() as Record<string, unknown>));
  }
}
