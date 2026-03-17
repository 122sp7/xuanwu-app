/**
 * Organization Domain Entities — pure TypeScript, zero framework dependencies.
 */

import type { Timestamp } from "@/shared/types";
import type { OrganizationRole, MemberReference, Team } from "@/modules/account/domain/entities/Account";

export interface OrganizationEntity {
  id: string;
  name: string;
  ownerId: string;
  email?: string;
  photoURL?: string;
  description?: string;
  members: MemberReference[];
  memberIds: string[];
  teams: Team[];
  createdAt: Timestamp;
}

// ─── Value Objects ────────────────────────────────────────────────────────────

export interface InviteMemberInput {
  organizationId: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  protocol: string;
}

export interface UpdateMemberRoleInput {
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
}

export interface CreateTeamInput {
  organizationId: string;
  name: string;
  description: string;
  type: "internal" | "external";
}

export type { OrganizationRole, MemberReference, Team };
