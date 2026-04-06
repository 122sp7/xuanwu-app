/**
 * Module: organization
 * Layer: interfaces/_actions
 * Purpose: Re-export barrel for all organization Server Actions.
 *          Implementations are split by subdomain for IDDD layer-purity.
 *          Each sub-file carries its own "use server" directive; this barrel
 *          must NOT repeat it — Turbopack cannot resolve re-exports from a
 *          "use server" barrel that itself re-exports other "use server" files.
 *  - organization-lifecycle.actions.ts (create, update settings, delete)
 *  - organization-member.actions.ts    (invite, recruit, dismiss, update role)
 *  - organization-team.actions.ts      (create, delete, update members)
 *  - organization-partner.actions.ts   (create group, invite, dismiss)
 *  - organization-policy.actions.ts    (create, update, delete policy)
 */

export {
  createOrganization,
  createOrganizationWithTeam,
  updateOrganizationSettings,
  deleteOrganization,
} from "./organization-lifecycle.actions";

export {
  inviteMember,
  recruitMember,
  dismissMember,
  updateMemberRole,
} from "./organization-member.actions";

export {
  createTeam,
  deleteTeam,
  updateTeamMembers,
} from "./organization-team.actions";

export {
  createPartnerGroup,
  sendPartnerInvite,
  dismissPartnerMember,
} from "./organization-partner.actions";

export {
  createOrgPolicy,
  updateOrgPolicy,
  deleteOrgPolicy,
} from "./organization-policy.actions";
