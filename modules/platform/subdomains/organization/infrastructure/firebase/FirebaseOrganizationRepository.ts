/**
 * FirebaseOrganizationRepository — Infrastructure adapter for organization persistence.
 * Firebase SDK is isolated to this file and organization-mappers.ts.
 * Dual-write: `organizations` (primary) + `accounts` (for organization account profile).
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
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { OrganizationRepository, Unsubscribe } from "../../domain/repositories/OrganizationRepository";
import type {
  OrganizationEntity,
  MemberReference,
  Team,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  OrganizationRole,
} from "../../domain/entities/Organization";
import { toOrganizationEntity, toTeam, toPartnerInvite } from "./organization-mappers";

export class FirebaseOrganizationRepository implements OrganizationRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private orgAccountRef(organizationId: string) {
    return doc(this.db, "accounts", organizationId);
  }

  private buildAccountData(data: {
    name?: string;
    ownerId?: string;
    email?: string;
    photoURL?: string;
    description?: string;
    theme?: OrganizationEntity["theme"];
    members?: MemberReference[];
    memberIds?: string[];
    teams?: Team[];
    createdAt?: OrganizationEntity["createdAt"] | ReturnType<typeof serverTimestamp>;
  }) {
    return {
      accountType: "organization" as const,
      name: data.name ?? "",
      ownerId: data.ownerId ?? "",
      email: data.email ?? null,
      photoURL: data.photoURL ?? null,
      description: data.description ?? null,
      theme: data.theme ?? null,
      members: data.members ?? [],
      memberIds: data.memberIds ?? [],
      teams: data.teams ?? [],
      createdAt: data.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }

  async create(command: CreateOrganizationCommand): Promise<string> {
    const orgRef = doc(collection(this.db, "organizations"));
    const owner: MemberReference = {
      id: command.ownerId,
      name: command.ownerName,
      email: command.ownerEmail,
      role: "Owner",
      presence: "active",
    };
    const createdAt = serverTimestamp();
    const batch = writeBatch(this.db);
    batch.set(orgRef, {
      name: command.organizationName,
      ownerId: command.ownerId,
      members: [owner],
      memberIds: [command.ownerId],
      teams: [],
      createdAt,
    });
    batch.set(
      this.orgAccountRef(orgRef.id),
      this.buildAccountData({
        name: command.organizationName,
        ownerId: command.ownerId,
        members: [owner],
        memberIds: [command.ownerId],
        teams: [],
        createdAt,
      }),
      { merge: true },
    );
    await batch.commit();
    return orgRef.id;
  }

  async findById(id: string): Promise<OrganizationEntity | null> {
    const snap = await getDoc(doc(this.db, "organizations", id));
    if (!snap.exists()) return null;
    return toOrganizationEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async save(org: OrganizationEntity): Promise<void> {
    const batch = writeBatch(this.db);
    batch.set(doc(this.db, "organizations", org.id), {
      name: org.name,
      ownerId: org.ownerId,
      members: org.members,
      memberIds: org.memberIds,
      teams: org.teams,
      updatedAt: serverTimestamp(),
    });
    batch.set(
      this.orgAccountRef(org.id),
      this.buildAccountData({
        name: org.name,
        ownerId: org.ownerId,
        email: org.email,
        photoURL: org.photoURL,
        description: org.description,
        theme: org.theme,
        members: org.members,
        memberIds: org.memberIds,
        teams: org.teams,
        createdAt: org.createdAt,
      }),
      { merge: true },
    );
    await batch.commit();
  }

  async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void> {
    const updates: Record<string, unknown> = {
      accountType: "organization",
      updatedAt: serverTimestamp(),
    };
    if (command.name !== undefined) updates.name = command.name;
    if (command.description !== undefined) updates.description = command.description;
    if (command.theme !== undefined) updates.theme = command.theme;
    if (command.photoURL !== undefined) updates.photoURL = command.photoURL;
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", command.organizationId), updates);
    batch.set(this.orgAccountRef(command.organizationId), updates, { merge: true });
    await batch.commit();
  }

  async delete(organizationId: string): Promise<void> {
    const batch = writeBatch(this.db);
    batch.delete(doc(this.db, "organizations", organizationId));
    batch.delete(this.orgAccountRef(organizationId));
    await batch.commit();
  }

  async inviteMember(input: InviteMemberInput): Promise<string> {
    const ref = await addDoc(collection(this.db, "organizations", input.organizationId, "invites"), {
      email: input.email,
      teamId: input.teamId,
      role: input.role,
      inviteState: "pending",
      protocol: input.protocol,
      invitedAt: serverTimestamp(),
    });
    return ref.id;
  }

  async recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void> {
    const member: MemberReference = { id: memberId, name, email, role: "Member", presence: "active" };
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", organizationId), {
      members: arrayUnion(member),
      memberIds: arrayUnion(memberId),
      updatedAt: serverTimestamp(),
    });
    batch.set(this.orgAccountRef(organizationId), { members: arrayUnion(member), memberIds: arrayUnion(memberId), updatedAt: serverTimestamp() }, { merge: true });
    await batch.commit();
  }

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    const snap = await getDoc(doc(this.db, "organizations", organizationId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const members = Array.isArray(data.members)
      ? (data.members as MemberReference[]).filter((m) => m.id !== memberId)
      : [];
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", organizationId), { members, memberIds: arrayRemove(memberId), updatedAt: serverTimestamp() });
    batch.set(this.orgAccountRef(organizationId), { members, memberIds: arrayRemove(memberId), updatedAt: serverTimestamp() }, { merge: true });
    await batch.commit();
  }

  async updateMemberRole(input: UpdateMemberRoleInput): Promise<void> {
    const snap = await getDoc(doc(this.db, "organizations", input.organizationId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const members = Array.isArray(data.members)
      ? (data.members as MemberReference[]).map((m) =>
          m.id === input.memberId ? { ...m, role: input.role as OrganizationRole } : m,
        )
      : [];
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", input.organizationId), { members, updatedAt: serverTimestamp() });
    batch.set(this.orgAccountRef(input.organizationId), { members, updatedAt: serverTimestamp() }, { merge: true });
    await batch.commit();
  }

  async getMembers(organizationId: string): Promise<MemberReference[]> {
    const snap = await getDoc(doc(this.db, "organizations", organizationId));
    if (!snap.exists()) return [];
    const data = snap.data() as Record<string, unknown>;
    return Array.isArray(data.members) ? (data.members as MemberReference[]) : [];
  }

  subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): Unsubscribe {
    return onSnapshot(doc(this.db, "organizations", organizationId), (snap) => {
      if (!snap.exists()) { onUpdate([]); return; }
      const data = snap.data() as Record<string, unknown>;
      onUpdate(Array.isArray(data.members) ? (data.members as MemberReference[]) : []);
    });
  }

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

  async addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayUnion(memberId),
    });
  }

  async removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayRemove(memberId),
    });
  }

  async getTeams(organizationId: string): Promise<Team[]> {
    const snaps = await getDocs(collection(this.db, "organizations", organizationId, "teams"));
    return snaps.docs.map((d) => toTeam(d.id, d.data() as Record<string, unknown>));
  }

  subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): Unsubscribe {
    return onSnapshot(collection(this.db, "organizations", organizationId, "teams"), (snap) => {
      onUpdate(snap.docs.map((d) => toTeam(d.id, d.data() as Record<string, unknown>)));
    });
  }

  async sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string> {
    const ref = await addDoc(collection(this.db, "organizations", organizationId, "partnerInvites"), {
      email,
      teamId,
      role: "Guest",
      inviteState: "pending",
      invitedAt: serverTimestamp(),
    });
    return ref.id;
  }

  async dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await this.removeMemberFromTeam(organizationId, teamId, memberId);
  }

  async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]> {
    const snaps = await getDocs(collection(this.db, "organizations", organizationId, "partnerInvites"));
    return snaps.docs.map((d) => toPartnerInvite(d.id, d.data() as Record<string, unknown>));
  }
}
