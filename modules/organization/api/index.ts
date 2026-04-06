/**
 * organization 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 organization 模組內部實作。
 */

import { FirebaseOrganizationRepository } from "../infrastructure/firebase/FirebaseOrganizationRepository";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** 組織成員 DTO — 供外部模組消費，不直接暴露 MemberReference 實體。 */
export interface OrganizationMemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  /** 成員線上狀態：active（上線）、away（暫離）、offline（離線）。 */
  presence: "active" | "away" | "offline";
  isExternal?: boolean;
}

/** 組織團隊 DTO — 供外部模組消費，不直接暴露 Team 實體。 */
export interface OrganizationTeamDTO {
  id: string;
  name: string;
  memberIds: string[];
}

// ─── 內部單例 ──────────────────────────────────────────────────────────────────

const orgRepo = new FirebaseOrganizationRepository();

// ─── 公開 API Facade ──────────────────────────────────────────────────────────

export const organizationApi = {
  /**
   * 取得指定組織的所有成員清單。
   */
  async getMembers(organizationId: string): Promise<OrganizationMemberDTO[]> {
    const members = await orgRepo.getMembers(organizationId);
    return members.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      presence: m.presence,
      isExternal: m.isExternal,
    }));
  },

  /**
   * 取得指定組織的所有團隊清單。
   */
  async getTeams(organizationId: string): Promise<OrganizationTeamDTO[]> {
    const teams = await orgRepo.getTeams(organizationId);
    return teams.map((t) => ({
      id: t.id,
      name: t.name,
      memberIds: t.memberIds,
    }));
  },
} as const;

// ─── Server Actions ───────────────────────────────────────────────────────────

export {
  createOrganization,
  createOrganizationWithTeam,
  updateOrganizationSettings,
  deleteOrganization,
} from "../interfaces/_actions/organization-lifecycle.actions";
export {
  inviteMember,
  recruitMember,
  dismissMember,
  updateMemberRole,
} from "../interfaces/_actions/organization-member.actions";
export {
  createTeam,
  deleteTeam,
  updateTeamMembers,
} from "../interfaces/_actions/organization-team.actions";
export {
  createPartnerGroup,
  sendPartnerInvite,
  dismissPartnerMember,
} from "../interfaces/_actions/organization-partner.actions";
export {
  createOrgPolicy,
  updateOrgPolicy,
  deleteOrgPolicy,
} from "../interfaces/_actions/organization-policy.actions";

// ─── Query Functions ──────────────────────────────────────────────────────────

export {
  getOrganizationMembers,
  subscribeToOrganizationMembers,
  getOrganizationTeams,
  subscribeToOrganizationTeams,
  getPartnerInvites,
  getOrgPolicies,
} from "../interfaces/queries/organization.queries";
