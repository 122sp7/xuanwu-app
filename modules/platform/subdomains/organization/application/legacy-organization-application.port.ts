import {
	createOrganization,
	createOrganizationWithTeam,
	createOrgPolicy,
	createPartnerGroup,
	createTeam,
	deleteOrganization,
	deleteOrgPolicy,
	deleteTeam,
	dismissMember,
	dismissPartnerMember,
	inviteMember,
	recruitMember,
	sendPartnerInvite,
	updateMemberRole,
	updateOrganizationSettings,
	updateOrgPolicy,
	updateTeamMembers,
} from "@/modules/organization/api";

/**
 * Temporary compatibility port during migration from modules/organization.
 */
export interface LegacyOrganizationApplicationPort {
	createOrganization: typeof createOrganization;
	createOrganizationWithTeam: typeof createOrganizationWithTeam;
	updateOrganizationSettings: typeof updateOrganizationSettings;
	deleteOrganization: typeof deleteOrganization;
	inviteMember: typeof inviteMember;
	recruitMember: typeof recruitMember;
	dismissMember: typeof dismissMember;
	updateMemberRole: typeof updateMemberRole;
	createTeam: typeof createTeam;
	deleteTeam: typeof deleteTeam;
	updateTeamMembers: typeof updateTeamMembers;
	createPartnerGroup: typeof createPartnerGroup;
	sendPartnerInvite: typeof sendPartnerInvite;
	dismissPartnerMember: typeof dismissPartnerMember;
	createOrgPolicy: typeof createOrgPolicy;
	updateOrgPolicy: typeof updateOrgPolicy;
	deleteOrgPolicy: typeof deleteOrgPolicy;
}
