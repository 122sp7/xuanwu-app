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

// ─── Repository ───────────────────────────────────────────────────────────────

export class FirebaseOrganizationRepository implements OrganizationRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private organizationAccountRef(organizationId: string) {
    return doc(this.db, "accounts", organizationId);
  }

  private buildOrganizationAccountData(
    data: {
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
    },
  ) {
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
    const createdAt = serverTimestamp();
    const organizationData = {
      name: command.organizationName,
      ownerId: command.ownerId,
      members: [owner],
      memberIds: [command.ownerId],
      teams: [],
      createdAt,
    };
    const batch = writeBatch(this.db);
    batch.set(orgRef, organizationData);
    batch.set(
      this.organizationAccountRef(orgRef.id),
      this.buildOrganizationAccountData({
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
    const orgRef = doc(this.db, "organizations", org.id);
    const batch = writeBatch(this.db);
    batch.set(orgRef, {
      name: org.name,
      ownerId: org.ownerId,
      members: org.members,
      memberIds: org.memberIds,
      teams: org.teams,
      updatedAt: serverTimestamp(),
    });
    batch.set(
      this.organizationAccountRef(org.id),
      this.buildOrganizationAccountData({
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
    const orgRef = doc(this.db, "organizations", command.organizationId);
    const updates: Record<string, unknown> = {
      accountType: "organization",
      updatedAt: serverTimestamp(),
    };
    if (command.name !== undefined) updates.name = command.name;
    if (command.description !== undefined) updates.description = command.description;
    if (command.theme !== undefined) updates.theme = command.theme;
    if (command.photoURL !== undefined) updates.photoURL = command.photoURL;
    const batch = writeBatch(this.db);
    batch.update(orgRef, updates);
    batch.set(this.organizationAccountRef(command.organizationId), updates, { merge: true });
    await batch.commit();
  }

  async delete(organizationId: string): Promise<void> {
    const batch = writeBatch(this.db);
    batch.delete(doc(this.db, "organizations", organizationId));
    batch.delete(this.organizationAccountRef(organizationId));
    await batch.commit();
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
    const orgRef = doc(this.db, "organizations", organizationId);
    const member: MemberReference = {
      id: memberId,
      name,
      email,
      role: "Member",
      presence: "active",
    };
    const batch = writeBatch(this.db);
    batch.update(orgRef, {
      members: arrayUnion(member),
      memberIds: arrayUnion(memberId),
      updatedAt: serverTimestamp(),
    });
    batch.set(
      this.organizationAccountRef(organizationId),
      {
        members: arrayUnion(member),
        memberIds: arrayUnion(memberId),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await batch.commit();
  }

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    const orgSnap = await getDoc(doc(this.db, "organizations", organizationId));
    if (!orgSnap.exists()) return;
    const data = orgSnap.data() as Record<string, unknown>;
    const members = Array.isArray(data.members)
      ? (data.members as MemberReference[]).filter((m) => m.id !== memberId)
      : [];
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", organizationId), {
      members,
      memberIds: arrayRemove(memberId),
      updatedAt: serverTimestamp(),
    });
    batch.set(
      this.organizationAccountRef(organizationId),
      {
        members,
        memberIds: arrayRemove(memberId),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await batch.commit();
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
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", input.organizationId), {
      members,
      updatedAt: serverTimestamp(),
    });
    batch.set(
      this.organizationAccountRef(input.organizationId),
      {
        members,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await batch.commit();
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
    return snaps.docs.map((d) => toTeam(d.id, d.data() as Record<string, unknown>));
  }

  subscribeToTeams(
    organizationId: string,
    onUpdate: (teams: Team[]) => void,
  ): Unsubscribe {
    return onSnapshot(
      collection(this.db, "organizations", organizationId, "teams"),
      (snap) => {
        onUpdate(snap.docs.map((d) => toTeam(d.id, d.data() as Record<string, unknown>)));
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
    return snaps.docs.map((d) => toPartnerInvite(d.id, d.data() as Record<string, unknown>));
  }
}
