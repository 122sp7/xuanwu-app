/**
 * Module: platform/subdomains/team
 * Layer: infrastructure/firebase
 * Purpose: Firebase implementation of TeamRepository.
 *          Directly accesses the organizations/{orgId}/teams sub-collection.
 */

import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { TeamRepository } from "../../domain/repositories/TeamRepository";
import type { Team, CreateTeamInput } from "../../domain/entities/Team";

function toTeam(id: string, data: Record<string, unknown>): Team {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    type: data.type === "external" ? "external" : "internal",
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
  };
}

export class FirebaseTeamRepository implements TeamRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
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
}
