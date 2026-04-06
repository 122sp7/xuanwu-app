/**
 * Organization Use Cases — barrel re-export.
 * Split into focused files per IDDD single-responsibility principle:
 *  - organization-lifecycle.use-cases.ts  (org CRUD)
 *  - organization-member.use-cases.ts     (member management)
 *  - organization-team.use-cases.ts       (team management)
 *  - organization-partner.use-cases.ts    (partner management)
 */

export {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "./organization-lifecycle.use-cases";

export {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "./organization-member.use-cases";

export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "./organization-team.use-cases";

export {
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "./organization-partner.use-cases";
