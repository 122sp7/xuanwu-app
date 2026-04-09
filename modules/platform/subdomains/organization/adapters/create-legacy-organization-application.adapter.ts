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
import type { LegacyOrganizationApplicationPort } from "../application";

export function createLegacyOrganizationApplicationAdapter(): LegacyOrganizationApplicationPort {
	return {
		createOrganization,
		createOrganizationWithTeam,
		updateOrganizationSettings,
		deleteOrganization,
		inviteMember,
		recruitMember,
		dismissMember,
		updateMemberRole,
		createTeam,
		deleteTeam,
		updateTeamMembers,
		createPartnerGroup,
		sendPartnerInvite,
		dismissPartnerMember,
		createOrgPolicy,
		updateOrgPolicy,
		deleteOrgPolicy,
	};
}
