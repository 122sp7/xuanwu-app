module.exports = [
"[project]/modules/organization/application/use-cases/organization.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateOrganizationUseCase",
    ()=>CreateOrganizationUseCase,
    "CreateOrganizationWithTeamUseCase",
    ()=>CreateOrganizationWithTeamUseCase,
    "CreatePartnerGroupUseCase",
    ()=>CreatePartnerGroupUseCase,
    "CreateTeamUseCase",
    ()=>CreateTeamUseCase,
    "DeleteOrganizationUseCase",
    ()=>DeleteOrganizationUseCase,
    "DeleteTeamUseCase",
    ()=>DeleteTeamUseCase,
    "DismissPartnerMemberUseCase",
    ()=>DismissPartnerMemberUseCase,
    "InviteMemberUseCase",
    ()=>InviteMemberUseCase,
    "RecruitMemberUseCase",
    ()=>RecruitMemberUseCase,
    "RemoveMemberUseCase",
    ()=>RemoveMemberUseCase,
    "SendPartnerInviteUseCase",
    ()=>SendPartnerInviteUseCase,
    "UpdateMemberRoleUseCase",
    ()=>UpdateMemberRoleUseCase,
    "UpdateOrganizationSettingsUseCase",
    ()=>UpdateOrganizationSettingsUseCase,
    "UpdateTeamMembersUseCase",
    ()=>UpdateTeamMembersUseCase
]);
/**
 * Organization Use Cases — pure business workflows.
 * Covers: org lifecycle, members, teams, partners.
 * No React, no Firebase, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-ssr] (ecmascript)");
;
class CreateOrganizationUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(command) {
        try {
            const orgId = await this.orgRepo.create(command);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(orgId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to create organization");
        }
    }
}
class CreateOrganizationWithTeamUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(command, teamName, teamType = "internal") {
        try {
            const organizationId = await this.orgRepo.create(command);
            await this.orgRepo.createTeam({
                organizationId,
                name: teamName,
                description: "",
                type: teamType
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Failed to setup organization with team");
        }
    }
}
class UpdateOrganizationSettingsUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(command) {
        try {
            await this.orgRepo.updateSettings(command);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(command.organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Failed to update organization settings");
        }
    }
}
class DeleteOrganizationUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId) {
        try {
            await this.orgRepo.delete(organizationId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to delete organization");
        }
    }
}
class InviteMemberUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(input) {
        try {
            const inviteId = await this.orgRepo.inviteMember(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(inviteId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to invite member");
        }
    }
}
class RecruitMemberUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId, memberId, name, email) {
        try {
            await this.orgRepo.recruitMember(organizationId, memberId, name, email);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to recruit member");
        }
    }
}
class RemoveMemberUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId, memberId) {
        try {
            await this.orgRepo.removeMember(organizationId, memberId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("REMOVE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to remove member");
        }
    }
}
class UpdateMemberRoleUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(input) {
        try {
            await this.orgRepo.updateMemberRole(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(input.memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Failed to update member role");
        }
    }
}
class CreateTeamUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(input) {
        try {
            const teamId = await this.orgRepo.createTeam(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to create team");
        }
    }
}
class DeleteTeamUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId, teamId) {
        try {
            await this.orgRepo.deleteTeam(organizationId, teamId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to delete team");
        }
    }
}
class UpdateTeamMembersUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId, teamId, memberId, action) {
        try {
            if (action === "add") {
                await this.orgRepo.addMemberToTeam(organizationId, teamId, memberId);
            } else {
                await this.orgRepo.removeMemberFromTeam(organizationId, teamId, memberId);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Failed to update team members");
        }
    }
}
class CreatePartnerGroupUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId, groupName) {
        try {
            const teamId = await this.orgRepo.createTeam({
                organizationId,
                name: groupName,
                description: "",
                type: "external"
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Failed to create partner group");
        }
    }
}
class SendPartnerInviteUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId, teamId, email) {
        try {
            const inviteId = await this.orgRepo.sendPartnerInvite(organizationId, teamId, email);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(inviteId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Failed to send partner invite");
        }
    }
}
class DismissPartnerMemberUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(organizationId, teamId, memberId) {
        try {
            await this.orgRepo.dismissPartnerMember(organizationId, teamId, memberId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to dismiss partner member");
        }
    }
}
}),
"[project]/modules/organization/application/use-cases/organization-policy.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateOrgPolicyUseCase",
    ()=>CreateOrgPolicyUseCase,
    "DeleteOrgPolicyUseCase",
    ()=>DeleteOrgPolicyUseCase,
    "UpdateOrgPolicyUseCase",
    ()=>UpdateOrgPolicyUseCase
]);
/**
 * Organization Policy Use Cases — pure business workflows.
 * Org policy changes flow through event bus to update workspace org-policy cache downstream.
 * No React, no Firebase, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-ssr] (ecmascript)");
;
class CreateOrgPolicyUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(input) {
        try {
            const policy = await this.orgRepo.createPolicy(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(policy.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to create org policy");
        }
    }
}
class UpdateOrgPolicyUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(policyId, data) {
        try {
            await this.orgRepo.updatePolicy(policyId, data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to update org policy");
        }
    }
}
class DeleteOrgPolicyUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(policyId) {
        try {
            await this.orgRepo.deletePolicy(policyId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to delete org policy");
        }
    }
}
}),
"[project]/modules/organization/interfaces/queries/organization.queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOrgPolicies",
    ()=>getOrgPolicies,
    "getOrganizationMembers",
    ()=>getOrganizationMembers,
    "getOrganizationTeams",
    ()=>getOrganizationTeams,
    "getPartnerInvites",
    ()=>getPartnerInvites,
    "subscribeToOrganizationMembers",
    ()=>subscribeToOrganizationMembers,
    "subscribeToOrganizationTeams",
    ()=>subscribeToOrganizationTeams
]);
/**
 * Organization Read Queries — thin wrappers for real-time subscription and one-shot reads.
 * Callable from React components/hooks, NOT server actions.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts [app-ssr] (ecmascript)");
;
const orgRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseOrganizationRepository"]();
async function getOrganizationMembers(organizationId) {
    return orgRepo.getMembers(organizationId);
}
function subscribeToOrganizationMembers(organizationId, onUpdate) {
    return orgRepo.subscribeToMembers(organizationId, onUpdate);
}
async function getOrganizationTeams(organizationId) {
    return orgRepo.getTeams(organizationId);
}
function subscribeToOrganizationTeams(organizationId, onUpdate) {
    return orgRepo.subscribeToTeams(organizationId, onUpdate);
}
async function getPartnerInvites(organizationId) {
    return orgRepo.getPartnerInvites(organizationId);
}
async function getOrgPolicies(orgId) {
    return orgRepo.getPolicies(orgId);
}
}),
"[project]/modules/organization/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * organization module public API
 */ __turbopack_context__.s([]);
// Use Cases
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/application/use-cases/organization.use-cases.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2d$policy$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/application/use-cases/organization-policy.use-cases.ts [app-ssr] (ecmascript)");
// Infrastructure
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts [app-ssr] (ecmascript)");
// Read Queries
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$queries$2f$organization$2e$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/queries/organization.queries.ts [app-ssr] (ecmascript)");
;
;
;
;
;
}),
"[project]/modules/organization/interfaces/_actions/data:4b2249 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOrganization",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40d820a9b690d1e8de0028caeeb609ef68a8b0a55b":"createOrganization"},"modules/organization/interfaces/_actions/organization.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40d820a9b690d1e8de0028caeeb609ef68a8b0a55b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createOrganization");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vb3JnYW5pemF0aW9uLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogT3JnYW5pemF0aW9uIENvcmUgU2VydmVyIEFjdGlvbnMg4oCUIHRoaW4gYWRhcHRlcjogU2VydmVyIEFjdGlvbnMg4oaSIEFwcGxpY2F0aW9uIFVzZSBDYXNlcy5cclxuICogQ292ZXJzOiBvcmcgbGlmZWN5Y2xlIChjcmVhdGUsIHVwZGF0ZSBzZXR0aW5ncywgZGVsZXRlKS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBjb21tYW5kRmFpbHVyZUZyb20sIHR5cGUgQ29tbWFuZFJlc3VsdCB9IGZyb20gXCJAc2hhcmVkLXR5cGVzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ3JlYXRlT3JnYW5pemF0aW9uVXNlQ2FzZSxcclxuICBDcmVhdGVPcmdhbml6YXRpb25XaXRoVGVhbVVzZUNhc2UsXHJcbiAgVXBkYXRlT3JnYW5pemF0aW9uU2V0dGluZ3NVc2VDYXNlLFxyXG4gIERlbGV0ZU9yZ2FuaXphdGlvblVzZUNhc2UsXHJcbiAgSW52aXRlTWVtYmVyVXNlQ2FzZSxcclxuICBSZWNydWl0TWVtYmVyVXNlQ2FzZSxcclxuICBSZW1vdmVNZW1iZXJVc2VDYXNlLFxyXG4gIFVwZGF0ZU1lbWJlclJvbGVVc2VDYXNlLFxyXG4gIENyZWF0ZVRlYW1Vc2VDYXNlLFxyXG4gIERlbGV0ZVRlYW1Vc2VDYXNlLFxyXG4gIFVwZGF0ZVRlYW1NZW1iZXJzVXNlQ2FzZSxcclxuICBDcmVhdGVQYXJ0bmVyR3JvdXBVc2VDYXNlLFxyXG4gIFNlbmRQYXJ0bmVySW52aXRlVXNlQ2FzZSxcclxuICBEaXNtaXNzUGFydG5lck1lbWJlclVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9vcmdhbml6YXRpb24udXNlLWNhc2VzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ3JlYXRlT3JnUG9saWN5VXNlQ2FzZSxcclxuICBVcGRhdGVPcmdQb2xpY3lVc2VDYXNlLFxyXG4gIERlbGV0ZU9yZ1BvbGljeVVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9vcmdhbml6YXRpb24tcG9saWN5LnVzZS1jYXNlc1wiO1xyXG5pbXBvcnQgeyBGaXJlYmFzZU9yZ2FuaXphdGlvblJlcG9zaXRvcnkgfSBmcm9tIFwiLi4vLi4vaW5mcmFzdHJ1Y3R1cmUvZmlyZWJhc2UvRmlyZWJhc2VPcmdhbml6YXRpb25SZXBvc2l0b3J5XCI7XHJcbmltcG9ydCB0eXBlIHtcclxuICBDcmVhdGVPcmdhbml6YXRpb25Db21tYW5kLFxyXG4gIFVwZGF0ZU9yZ2FuaXphdGlvblNldHRpbmdzQ29tbWFuZCxcclxuICBVcGRhdGVNZW1iZXJSb2xlSW5wdXQsXHJcbiAgQ3JlYXRlVGVhbUlucHV0LFxyXG4gIENyZWF0ZU9yZ1BvbGljeUlucHV0LFxyXG4gIFVwZGF0ZU9yZ1BvbGljeUlucHV0LFxyXG59IGZyb20gXCIuLi8uLi9kb21haW4vZW50aXRpZXMvT3JnYW5pemF0aW9uXCI7XHJcblxyXG5jb25zdCBvcmdSZXBvID0gbmV3IEZpcmViYXNlT3JnYW5pemF0aW9uUmVwb3NpdG9yeSgpO1xyXG5cclxuLy8g4pSA4pSA4pSAIE9yZyBMaWZlY3ljbGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlT3JnYW5pemF0aW9uKFxyXG4gIGNvbW1hbmQ6IENyZWF0ZU9yZ2FuaXphdGlvbkNvbW1hbmQsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IENyZWF0ZU9yZ2FuaXphdGlvblVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJDUkVBVEVfT1JHQU5JWkFUSU9OX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yZ2FuaXphdGlvbldpdGhUZWFtKFxyXG4gIGNvbW1hbmQ6IENyZWF0ZU9yZ2FuaXphdGlvbkNvbW1hbmQsXHJcbiAgdGVhbU5hbWU6IHN0cmluZyxcclxuICB0ZWFtVHlwZTogXCJpbnRlcm5hbFwiIHwgXCJleHRlcm5hbFwiID0gXCJpbnRlcm5hbFwiLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBDcmVhdGVPcmdhbml6YXRpb25XaXRoVGVhbVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShjb21tYW5kLCB0ZWFtTmFtZSwgdGVhbVR5cGUpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIlNFVFVQX09SR0FOSVpBVElPTl9XSVRIX1RFQU1fRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlT3JnYW5pemF0aW9uU2V0dGluZ3MoXHJcbiAgY29tbWFuZDogVXBkYXRlT3JnYW5pemF0aW9uU2V0dGluZ3NDb21tYW5kLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVPcmdhbml6YXRpb25TZXR0aW5nc1VzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfT1JHQU5JWkFUSU9OX1NFVFRJTkdTX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9yZ2FuaXphdGlvbihvcmdhbml6YXRpb25JZDogc3RyaW5nKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgRGVsZXRlT3JnYW5pemF0aW9uVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJERUxFVEVfT1JHQU5JWkFUSU9OX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIE1lbWJlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW52aXRlTWVtYmVyKGlucHV0OiBpbXBvcnQoXCIuLi8uLi9kb21haW4vZW50aXRpZXMvT3JnYW5pemF0aW9uXCIpLkludml0ZU1lbWJlcklucHV0KTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgSW52aXRlTWVtYmVyVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJJTlZJVEVfTUVNQkVSX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlY3J1aXRNZW1iZXIoXHJcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZyxcclxuICBtZW1iZXJJZDogc3RyaW5nLFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBlbWFpbDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBSZWNydWl0TWVtYmVyVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkLCBtZW1iZXJJZCwgbmFtZSwgZW1haWwpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIlJFQ1JVSVRfTUVNQkVSX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRpc21pc3NNZW1iZXIoXHJcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZyxcclxuICBtZW1iZXJJZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBSZW1vdmVNZW1iZXJVc2VDYXNlKG9yZ1JlcG8pLmV4ZWN1dGUob3JnYW5pemF0aW9uSWQsIG1lbWJlcklkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJESVNNSVNTX01FTUJFUl9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVNZW1iZXJSb2xlKGlucHV0OiBVcGRhdGVNZW1iZXJSb2xlSW5wdXQpOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVNZW1iZXJSb2xlVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfTUVNQkVSX1JPTEVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG4vLyDilIDilIDilIAgVGVhbXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVhbShpbnB1dDogQ3JlYXRlVGVhbUlucHV0KTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgQ3JlYXRlVGVhbVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShpbnB1dCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiQ1JFQVRFX1RFQU1fRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVGVhbShcclxuICBvcmdhbml6YXRpb25JZDogc3RyaW5nLFxyXG4gIHRlYW1JZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBEZWxldGVUZWFtVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkLCB0ZWFtSWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIkRFTEVURV9URUFNX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRlYW1NZW1iZXJzKFxyXG4gIG9yZ2FuaXphdGlvbklkOiBzdHJpbmcsXHJcbiAgdGVhbUlkOiBzdHJpbmcsXHJcbiAgbWVtYmVySWQ6IHN0cmluZyxcclxuICBhY3Rpb246IFwiYWRkXCIgfCBcInJlbW92ZVwiLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVUZWFtTWVtYmVyc1VzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShvcmdhbml6YXRpb25JZCwgdGVhbUlkLCBtZW1iZXJJZCwgYWN0aW9uKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfVEVBTV9NRU1CRVJTX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIFBhcnRuZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBhcnRuZXJHcm91cChcclxuICBvcmdhbml6YXRpb25JZDogc3RyaW5nLFxyXG4gIGdyb3VwTmFtZTogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBDcmVhdGVQYXJ0bmVyR3JvdXBVc2VDYXNlKG9yZ1JlcG8pLmV4ZWN1dGUob3JnYW5pemF0aW9uSWQsIGdyb3VwTmFtZSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiQ1JFQVRFX1BBUlRORVJfR1JPVVBfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFBhcnRuZXJJbnZpdGUoXHJcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZyxcclxuICB0ZWFtSWQ6IHN0cmluZyxcclxuICBlbWFpbDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBTZW5kUGFydG5lckludml0ZVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShvcmdhbml6YXRpb25JZCwgdGVhbUlkLCBlbWFpbCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiU0VORF9QQVJUTkVSX0lOVklURV9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXNtaXNzUGFydG5lck1lbWJlcihcclxuICBvcmdhbml6YXRpb25JZDogc3RyaW5nLFxyXG4gIHRlYW1JZDogc3RyaW5nLFxyXG4gIG1lbWJlcklkOiBzdHJpbmcsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERpc21pc3NQYXJ0bmVyTWVtYmVyVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkLCB0ZWFtSWQsIG1lbWJlcklkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJESVNNSVNTX1BBUlRORVJfTUVNQkVSX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIFBvbGljeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVPcmdQb2xpY3koaW5wdXQ6IENyZWF0ZU9yZ1BvbGljeUlucHV0KTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgQ3JlYXRlT3JnUG9saWN5VXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJDUkVBVEVfT1JHX1BPTElDWV9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVPcmdQb2xpY3koXHJcbiAgcG9saWN5SWQ6IHN0cmluZyxcclxuICBkYXRhOiBVcGRhdGVPcmdQb2xpY3lJbnB1dCxcclxuKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgVXBkYXRlT3JnUG9saWN5VXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKHBvbGljeUlkLCBkYXRhKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfT1JHX1BPTElDWV9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVPcmdQb2xpY3kocG9saWN5SWQ6IHN0cmluZyk6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERlbGV0ZU9yZ1BvbGljeVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShwb2xpY3lJZCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiREVMRVRFX09SR19QT0xJQ1lfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoidVVBMkNzQiwrTEFBQSJ9
}),
"[project]/modules/shared/domain/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseEntitySchema",
    ()=>BaseEntitySchema
]);
/**
 * 共用領域類型 — 所有模組的基礎建構塊。
 * 遵循奧卡姆剃刀：只定義跨模組真正共用的最小集合。
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$zod$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-zod/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
;
// ── 建立者摘要 ─────────────────────────────────────────────────────────────
const CreatedBySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    /** 使用者 ID */ id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 顯示名稱 */ name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 頭像 URL（選填） */ avatarUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const BaseEntitySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    /** 唯一識別碼 */ id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 建立時間（ISO 8601） */ createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 最後更新時間（ISO 8601） */ updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 所屬工作區（專案） */ workspaceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 所屬租戶（帳號），用於跨工作區聚合 */ accountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 建立者摘要 */ createdBy: CreatedBySchema
});
}),
"[project]/modules/shared/domain/events/content-updated.event.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CONTENT_UPDATED_EVENT_TYPE",
    ()=>CONTENT_UPDATED_EVENT_TYPE,
    "createContentUpdatedEvent",
    ()=>createContentUpdatedEvent
]);
/**
 * modules/shared — domain event: ContentUpdatedEvent
 *
 * Fired by the content module whenever a block's content changes.
 * Knowledge and AI modules subscribe to this event to react
 * (link extraction, vector re-indexing, etc.).
 *
 * Follows Occam's Razor: minimal fields needed to drive downstream reactions.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
;
const CONTENT_UPDATED_EVENT_TYPE = "content.block-updated";
function createContentUpdatedEvent(pageId, blockId, content) {
    return {
        eventId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
        type: CONTENT_UPDATED_EVENT_TYPE,
        aggregateId: blockId,
        occurredAt: new Date().toISOString(),
        pageId,
        blockId,
        content
    };
}
}),
"[project]/modules/workspace-audit/domain/schema.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUDIT_ACTIONS",
    ()=>AUDIT_ACTIONS,
    "AUDIT_SEVERITIES",
    ()=>AUDIT_SEVERITIES,
    "AuditLogSchema",
    ()=>AuditLogSchema
]);
/**
 * Audit 模組領域 Schema — 不可變事件流（Immutable Event Stream）。
 * 遵循奧卡姆剃刀：稽核日誌只需記錄「誰、何時、做了什麼」。
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$zod$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-zod/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$shared$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/shared/domain/types.ts [app-ssr] (ecmascript)");
;
;
const AUDIT_ACTIONS = [
    "create",
    "update",
    "delete",
    "login",
    "export"
];
const AUDIT_SEVERITIES = [
    "low",
    "medium",
    "high",
    "critical"
];
// ── 欄位變更紀錄 ──────────────────────────────────────────────────────────
const ChangeRecordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    /** 被修改的欄位名稱 */ field: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 修改前的值 */ oldValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown(),
    /** 修改後的值 */ newValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()
});
const AuditLogSchema = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$shared$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseEntitySchema"].extend({
    /** 操作類型 */ action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(AUDIT_ACTIONS),
    /** 被操作資源的類型，例如 'contract'、'daily_post'、'user_settings' */ resourceType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 被操作資源的唯一識別碼 */ resourceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    /** 事件嚴重程度 */ severity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(AUDIT_SEVERITIES),
    /** 欄位變更明細（選填，僅 update 操作有意義） */ changes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(ChangeRecordSchema).optional()
});
}),
"[project]/modules/workspace-audit/application/use-cases/audit.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListOrganizationAuditLogsUseCase",
    ()=>ListOrganizationAuditLogsUseCase,
    "ListWorkspaceAuditLogsUseCase",
    ()=>ListWorkspaceAuditLogsUseCase
]);
class ListWorkspaceAuditLogsUseCase {
    auditRepo;
    constructor(auditRepo){
        this.auditRepo = auditRepo;
    }
    execute(workspaceId) {
        return this.auditRepo.findByWorkspaceId(workspaceId);
    }
}
class ListOrganizationAuditLogsUseCase {
    auditRepo;
    constructor(auditRepo){
        this.auditRepo = auditRepo;
    }
    execute(workspaceIds, maxCount) {
        return this.auditRepo.findByWorkspaceIds(workspaceIds, maxCount);
    }
}
}),
"[project]/modules/workspace-audit/infrastructure/firebase/FirebaseAuditRepository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseAuditRepository",
    ()=>FirebaseAuditRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-ssr] (ecmascript)");
;
;
const VALID_AUDIT_LOG_SOURCES = new Set([
    "workspace",
    "finance",
    "notification",
    "system"
]);
function toAuditLogEntity(id, data) {
    const source = VALID_AUDIT_LOG_SOURCES.has(data.source) ? data.source : "workspace";
    return {
        id,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
        actorId: typeof data.actorId === "string" ? data.actorId : "system",
        action: typeof data.action === "string" ? data.action : "unknown",
        detail: typeof data.detail === "string" ? data.detail : "",
        source,
        occurredAtISO: typeof data.occurredAtISO === "string" ? data.occurredAtISO : ""
    };
}
class FirebaseAuditRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async findByWorkspaceId(workspaceId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(this.db, "auditLogs"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("workspaceId", "==", workspaceId)));
        return snaps.docs.map((doc)=>toAuditLogEntity(doc.id, doc.data())).sort((left, right)=>right.occurredAtISO.localeCompare(left.occurredAtISO));
    }
    async findByWorkspaceIds(workspaceIds, maxCount = 200) {
        if (workspaceIds.length === 0) {
            return [];
        }
        const chunks = [];
        for(let index = 0; index < workspaceIds.length; index += 10){
            chunks.push(workspaceIds.slice(index, index + 10));
        }
        const perChunkLimit = Math.max(1, Math.ceil(maxCount / chunks.length));
        const snapshots = await Promise.all(chunks.map((chunk)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(this.db, "auditLogs"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("workspaceId", "in", chunk), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["limit"])(perChunkLimit)))));
        return snapshots.flatMap((snapshot)=>snapshot.docs).map((doc)=>toAuditLogEntity(doc.id, doc.data())).sort((left, right)=>right.occurredAtISO.localeCompare(left.occurredAtISO)).slice(0, maxCount);
    }
}
}),
"[project]/modules/workspace-audit/interfaces/queries/audit.queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOrganizationAuditLogs",
    ()=>getOrganizationAuditLogs,
    "getWorkspaceAuditLogs",
    ()=>getWorkspaceAuditLogs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$application$2f$use$2d$cases$2f$audit$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-audit/application/use-cases/audit.use-cases.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$infrastructure$2f$firebase$2f$FirebaseAuditRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-audit/infrastructure/firebase/FirebaseAuditRepository.ts [app-ssr] (ecmascript)");
;
;
const auditRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$infrastructure$2f$firebase$2f$FirebaseAuditRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseAuditRepository"]();
const listWorkspaceAuditLogsUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$application$2f$use$2d$cases$2f$audit$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListWorkspaceAuditLogsUseCase"](auditRepo);
const listOrganizationAuditLogsUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$application$2f$use$2d$cases$2f$audit$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListOrganizationAuditLogsUseCase"](auditRepo);
async function getWorkspaceAuditLogs(workspaceId) {
    const normalizedWorkspaceId = workspaceId.trim();
    if (!normalizedWorkspaceId) {
        return [];
    }
    return listWorkspaceAuditLogsUseCase.execute(normalizedWorkspaceId);
}
async function getOrganizationAuditLogs(workspaceIds, maxCount = 200) {
    const normalizedWorkspaceIds = workspaceIds.map((workspaceId)=>workspaceId.trim()).filter(Boolean);
    if (normalizedWorkspaceIds.length === 0) {
        return [];
    }
    return listOrganizationAuditLogsUseCase.execute(normalizedWorkspaceIds, maxCount);
}
}),
"[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceAuditTab",
    ()=>WorkspaceAuditTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$interfaces$2f$queries$2f$audit$2e$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-audit/interfaces/queries/audit.queries.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function formatAuditDate(value) {
    if (!value) {
        return "—";
    }
    try {
        return new Intl.DateTimeFormat("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(value));
    } catch  {
        return value;
    }
}
function WorkspaceAuditTab({ workspaceId }) {
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadState, setLoadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("loading");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadLogs() {
            setLoadState("loading");
            try {
                const nextLogs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$interfaces$2f$queries$2f$audit$2e$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWorkspaceAuditLogs"])(workspaceId);
                if (cancelled) {
                    return;
                }
                setLogs(nextLogs);
                setLoadState("loaded");
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("[WorkspaceAuditTab] Failed to load audit logs:", error);
                }
                if (!cancelled) {
                    setLogs([]);
                    setLoadState("error");
                }
            }
        }
        void loadLogs();
        return ()=>{
            cancelled = true;
        };
    }, [
        workspaceId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "border border-border/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: "Audit"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: "工作區相關行為紀錄、來源與時間軸。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-4",
                children: [
                    loadState === "loading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Loading audit log…"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    loadState === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-destructive",
                        children: "無法載入 audit log，請重新整理頁面或稍後再試。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    loadState === "loaded" && logs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "目前尚未記錄這個工作區的 audit entries。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this),
                    loadState === "loaded" && logs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: logs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-semibold text-foreground",
                                                            children: log.action
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                                            lineNumber: 110,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            children: log.source
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: log.detail || "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: [
                                                        "Actor: ",
                                                        log.actorId
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                            lineNumber: 108,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: formatAuditDate(log.occurredAtISO)
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                    lineNumber: 107,
                                    columnNumber: 17
                                }, this)
                            }, log.id, false, {
                                fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                                lineNumber: 103,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/workspace-audit/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Module: workspace-audit
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Audit domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */ // ─── Core entity types ────────────────────────────────────────────────────────
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$domain$2f$schema$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-audit/domain/schema.ts [app-ssr] (ecmascript)");
// ─── Query functions ──────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$interfaces$2f$queries$2f$audit$2e$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-audit/interfaces/queries/audit.queries.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$interfaces$2f$components$2f$WorkspaceAuditTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/modules/event/domain/entities/domain-event.entity.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: event
 * Layer: domain/entity
 * Purpose: Canonical domain event entity for capture, storage, and dispatch.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "DomainEvent",
    ()=>DomainEvent
]);
class DomainEvent {
    id;
    eventName;
    aggregateType;
    aggregateId;
    occurredAt;
    payload;
    metadata;
    dispatchedAt;
    constructor(id, eventName, aggregateType, aggregateId, occurredAt, payload, metadata = {}, dispatchedAt = null){
        this.id = id;
        this.eventName = eventName;
        this.aggregateType = aggregateType;
        this.aggregateId = aggregateId;
        this.occurredAt = occurredAt;
        this.payload = payload;
        this.metadata = metadata;
        this.dispatchedAt = dispatchedAt;
        if (!eventName.trim()) {
            throw new Error('eventName is required');
        }
        if (!aggregateType.trim()) {
            throw new Error('aggregateType is required');
        }
        if (!aggregateId.trim()) {
            throw new Error('aggregateId is required');
        }
    }
    markDispatched(dispatchedAt = new Date()) {
        this.dispatchedAt = dispatchedAt;
    }
    get isDispatched() {
        return this.dispatchedAt !== null;
    }
}
}),
"[project]/modules/event/domain/services/dispatch-policy.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: event
 * Layer: domain/service
 * Purpose: Pure dispatch-policy rules — determines retry eligibility and outbox strategy
 *          without any infrastructure or SDK dependency.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "nextRetryDelayMs",
    ()=>nextRetryDelayMs,
    "shouldRetry",
    ()=>shouldRetry
]);
function shouldRetry(attempt, policy) {
    return attempt.attemptCount < policy.maxRetries;
}
function nextRetryDelayMs(attempt, policy) {
    return policy.baseDelayMs * Math.pow(2, attempt.attemptCount);
}
}),
"[project]/modules/event/application/use-cases/publish-domain-event.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PublishDomainEventUseCase",
    ()=>PublishDomainEventUseCase
]);
/**
 * Module: event
 * Layer: application/use-case
 * Purpose: Write-side orchestration for event capture, persistence, and dispatch.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$domain$2f$entities$2f$domain$2d$event$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/domain/entities/domain-event.entity.ts [app-ssr] (ecmascript)");
;
class PublishDomainEventUseCase {
    eventStore;
    eventBus;
    constructor(eventStore, eventBus){
        this.eventStore = eventStore;
        this.eventBus = eventBus;
    }
    async execute(dto) {
        const event = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$domain$2f$entities$2f$domain$2d$event$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DomainEvent"](dto.id, dto.eventName, dto.aggregateType, dto.aggregateId, dto.occurredAt ?? new Date(), dto.payload, dto.metadata);
        await this.eventStore.save(event);
        // Skeleton only: production path should include retries/backoff/outbox strategy.
        await this.eventBus.publish(event);
        event.markDispatched(new Date());
        await this.eventStore.markDispatched(event.id, event.dispatchedAt ?? new Date());
        return event;
    }
}
}),
"[project]/modules/event/application/use-cases/list-events-by-aggregate.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: event
 * Layer: application/use-case
 * Purpose: Read-side orchestration for aggregate event timeline retrieval.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "ListEventsByAggregateUseCase",
    ()=>ListEventsByAggregateUseCase
]);
class ListEventsByAggregateUseCase {
    eventStore;
    constructor(eventStore){
        this.eventStore = eventStore;
    }
    async execute(dto) {
        return this.eventStore.findByAggregate(dto.aggregateType, dto.aggregateId);
    }
}
}),
"[project]/modules/event/infrastructure/repositories/in-memory-event-store.repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: event
 * Layer: infrastructure/repository
 * Purpose: In-memory adapter for event store contract in local development and tests.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "InMemoryEventStoreRepository",
    ()=>InMemoryEventStoreRepository
]);
class InMemoryEventStoreRepository {
    events = new Map();
    async save(event) {
        this.events.set(event.id, event);
    }
    async findById(id) {
        return this.events.get(id) ?? null;
    }
    async findByAggregate(aggregateType, aggregateId) {
        return [
            ...this.events.values()
        ].filter((event)=>event.aggregateType === aggregateType && event.aggregateId === aggregateId).sort((a, b)=>a.occurredAt.getTime() - b.occurredAt.getTime());
    }
    async findUndispatched(limit) {
        return [
            ...this.events.values()
        ].filter((event)=>!event.isDispatched).sort((a, b)=>a.occurredAt.getTime() - b.occurredAt.getTime()).slice(0, Math.max(limit, 0));
    }
    async markDispatched(id, dispatchedAt) {
        const event = this.events.get(id);
        if (!event) {
            return;
        }
        event.markDispatched(dispatchedAt);
    }
}
}),
"[project]/modules/event/infrastructure/repositories/noop-event-bus.repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: event
 * Layer: infrastructure/repository
 * Purpose: No-op event bus adapter used by scaffold/tests before real transport integration.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "NoopEventBusRepository",
    ()=>NoopEventBusRepository
]);
class NoopEventBusRepository {
    async publish(_event) {
    // Skeleton only: replace with actual transport publisher adapter.
    }
}
}),
"[project]/modules/event/interfaces/api/event.controller.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: event
 * Layer: interfaces/api
 * Purpose: Transport/controller facade delegating all actions to application use-cases.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "EventController",
    ()=>EventController
]);
class EventController {
    publishDomainEvent;
    listEventsByAggregate;
    constructor(publishDomainEvent, listEventsByAggregate){
        this.publishDomainEvent = publishDomainEvent;
        this.listEventsByAggregate = listEventsByAggregate;
    }
    async publish(input) {
        return this.publishDomainEvent.execute(input);
    }
    async listByAggregate(input) {
        return this.listEventsByAggregate.execute(input);
    }
}
}),
"[project]/modules/event/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Module: event
 * Layer: facade
 * Purpose: Public API for the event module — domain events, bus, store, and dispatch policies.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ // ── Domain: Entities ──────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$domain$2f$entities$2f$domain$2d$event$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/domain/entities/domain-event.entity.ts [app-ssr] (ecmascript)");
// ── Domain: Services ─────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$domain$2f$services$2f$dispatch$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/domain/services/dispatch-policy.ts [app-ssr] (ecmascript)");
// ── Application: Use Cases ────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$application$2f$use$2d$cases$2f$publish$2d$domain$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/application/use-cases/publish-domain-event.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$application$2f$use$2d$cases$2f$list$2d$events$2d$by$2d$aggregate$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/application/use-cases/list-events-by-aggregate.ts [app-ssr] (ecmascript)");
// ── Infrastructure ────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$event$2d$store$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/infrastructure/repositories/in-memory-event-store.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$noop$2d$event$2d$bus$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/infrastructure/repositories/noop-event-bus.repository.ts [app-ssr] (ecmascript)");
// ── Interfaces ────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$interfaces$2f$api$2f$event$2e$controller$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/interfaces/api/event.controller.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/modules/namespace/domain/entities/namespace.entity.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: namespace
 * Layer: domain/entity
 * Purpose: Canonical namespace entity — named scope for multi-tenant resource addressing.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "Namespace",
    ()=>Namespace
]);
class Namespace {
    id;
    slug;
    kind;
    ownerAccountId;
    organizationId;
    status;
    createdAt;
    updatedAt;
    constructor(id, slug, kind, ownerAccountId, organizationId, status, createdAt, updatedAt){
        this.id = id;
        this.slug = slug;
        this.kind = kind;
        this.ownerAccountId = ownerAccountId;
        this.organizationId = organizationId;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    suspend() {
        if (this.status !== 'active') {
            throw new Error(`Cannot suspend a namespace in status "${this.status}"`);
        }
        this.status = 'suspended';
        this.updatedAt = new Date();
    }
    restore() {
        if (this.status !== 'suspended') {
            throw new Error(`Cannot restore a namespace that is not suspended`);
        }
        this.status = 'active';
        this.updatedAt = new Date();
    }
    archive() {
        if (this.status === 'archived') {
            throw new Error('Namespace is already archived');
        }
        this.status = 'archived';
        this.updatedAt = new Date();
    }
    get isActive() {
        return this.status === 'active';
    }
}
}),
"[project]/modules/namespace/domain/services/slug-policy.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: namespace
 * Layer: domain/service
 * Purpose: Pure slug-validation helper — derives a safe slug candidate from a raw display name.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ /**
 * Converts a human-readable display name into a slug candidate.
 * Pure function — no side effects.
 *
 * Rules:
 *   - Lower-case
 *   - Replace spaces / underscores / dots with hyphens
 *   - Strip non-alphanumeric / non-hyphen characters
 *   - Collapse consecutive hyphens
 *   - Trim leading and trailing hyphens
 *   - Truncate to 63 characters
 */ __turbopack_context__.s([
    "deriveSlugCandidate",
    ()=>deriveSlugCandidate,
    "isValidSlug",
    ()=>isValidSlug
]);
function deriveSlugCandidate(displayName) {
    return displayName.toLowerCase().replace(/[\s_./\\]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '').slice(0, 63);
}
function isValidSlug(slug) {
    return /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(slug);
}
}),
"[project]/modules/namespace/domain/value-objects/namespace-slug.vo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NamespaceSlug",
    ()=>NamespaceSlug
]);
/**
 * Module: namespace
 * Layer: domain/value-object
 * Purpose: Immutable slug value object — validates and normalises namespace identifiers.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
class NamespaceSlug {
    value;
    constructor(value){
        this.value = value;
    }
    static create(raw) {
        const normalised = raw.trim().toLowerCase();
        if (!SLUG_PATTERN.test(normalised)) {
            throw new Error(`Invalid namespace slug "${normalised}". Must be 3–63 chars, lowercase alphanumeric with hyphens, no leading/trailing hyphen.`);
        }
        return new NamespaceSlug(normalised);
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
}),
"[project]/modules/namespace/application/use-cases/register-namespace.use-case.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegisterNamespaceUseCase",
    ()=>RegisterNamespaceUseCase
]);
/**
 * Module: namespace
 * Layer: application/use-case
 * Purpose: Write-side orchestration for registering a new namespace slug.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$entities$2f$namespace$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/entities/namespace.entity.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$value$2d$objects$2f$namespace$2d$slug$2e$vo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/value-objects/namespace-slug.vo.ts [app-ssr] (ecmascript)");
;
;
class RegisterNamespaceUseCase {
    namespaceRepo;
    constructor(namespaceRepo){
        this.namespaceRepo = namespaceRepo;
    }
    async execute(dto) {
        const slug = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$value$2d$objects$2f$namespace$2d$slug$2e$vo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NamespaceSlug"].create(dto.slug);
        const existing = await this.namespaceRepo.existsBySlug(slug.value, dto.kind);
        if (existing) {
            throw new Error(`Namespace slug "${slug.value}" is already taken for kind "${dto.kind}"`);
        }
        const namespace = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$entities$2f$namespace$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Namespace"](dto.id, slug, dto.kind, dto.ownerAccountId, dto.organizationId, 'active', new Date(), new Date());
        await this.namespaceRepo.save(namespace);
        return namespace;
    }
}
}),
"[project]/modules/namespace/application/use-cases/resolve-namespace.use-case.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: namespace
 * Layer: application/use-case
 * Purpose: Read-side orchestration for resolving a slug to its Namespace record.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "ResolveNamespaceUseCase",
    ()=>ResolveNamespaceUseCase
]);
class ResolveNamespaceUseCase {
    namespaceRepo;
    constructor(namespaceRepo){
        this.namespaceRepo = namespaceRepo;
    }
    async execute(dto) {
        return this.namespaceRepo.findBySlug(dto.slug, dto.kind);
    }
}
}),
"[project]/modules/namespace/application/use-cases/list-namespaces-by-organization.use-case.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: namespace
 * Layer: application/use-case
 * Purpose: Read-side orchestration for listing namespaces by organization scope.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "ListNamespacesByOrganizationUseCase",
    ()=>ListNamespacesByOrganizationUseCase
]);
class ListNamespacesByOrganizationUseCase {
    namespaceRepo;
    constructor(namespaceRepo){
        this.namespaceRepo = namespaceRepo;
    }
    async execute(dto) {
        return this.namespaceRepo.findByOrganization(dto.organizationId);
    }
}
}),
"[project]/modules/namespace/infrastructure/repositories/in-memory-namespace.repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: namespace
 * Layer: infrastructure/repository
 * Purpose: In-memory adapter for namespace repository — local development and tests.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "InMemoryNamespaceRepository",
    ()=>InMemoryNamespaceRepository
]);
class InMemoryNamespaceRepository {
    store = new Map();
    async save(namespace) {
        this.store.set(namespace.id, namespace);
    }
    async findById(id) {
        return this.store.get(id) ?? null;
    }
    async findBySlug(slug, kind) {
        for (const ns of this.store.values()){
            if (ns.slug.value === slug && ns.kind === kind) {
                return ns;
            }
        }
        return null;
    }
    async findByOrganization(organizationId) {
        return [
            ...this.store.values()
        ].filter((ns)=>ns.organizationId === organizationId);
    }
    async existsBySlug(slug, kind) {
        for (const ns of this.store.values()){
            if (ns.slug.value === slug && ns.kind === kind) {
                return true;
            }
        }
        return false;
    }
}
}),
"[project]/modules/namespace/interfaces/api/namespace.controller.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: namespace
 * Layer: interfaces/api
 * Purpose: HTTP/controller facade delegating all namespace actions to the application layer.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ __turbopack_context__.s([
    "NamespaceController",
    ()=>NamespaceController
]);
class NamespaceController {
    registerNamespace;
    resolveNamespace;
    constructor(registerNamespace, resolveNamespace){
        this.registerNamespace = registerNamespace;
        this.resolveNamespace = resolveNamespace;
    }
    async register(input) {
        return this.registerNamespace.execute(input);
    }
    async resolve(input) {
        return this.resolveNamespace.execute(input);
    }
}
}),
"[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NamespacePrototypeView",
    ()=>NamespacePrototypeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/services/slug-policy.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$application$2f$use$2d$cases$2f$list$2d$namespaces$2d$by$2d$organization$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/application/use-cases/list-namespaces-by-organization.use-case.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$application$2f$use$2d$cases$2f$register$2d$namespace$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/application/use-cases/register-namespace.use-case.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$namespace$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/infrastructure/repositories/in-memory-namespace.repository.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
function createNamespaceId() {
    return `ns_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function NamespacePrototypeView({ organizationId, ownerAccountId }) {
    const repositoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    if (!repositoryRef.current) {
        repositoryRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$namespace$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryNamespaceRepository"]();
    }
    const registerNamespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$application$2f$use$2d$cases$2f$register$2d$namespace$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RegisterNamespaceUseCase"](repositoryRef.current), []);
    const listNamespaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$application$2f$use$2d$cases$2f$list$2d$namespaces$2d$by$2d$organization$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListNamespacesByOrganizationUseCase"](repositoryRef.current), []);
    const [displayName, setDisplayName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [kind, setKind] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("workspace");
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [errorMessage, setErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    async function refreshRows() {
        const list = await listNamespaces.execute({
            organizationId
        });
        const mapped = list.map((item)=>({
                id: item.id,
                slug: item.slug.value,
                kind: item.kind,
                status: item.status
            })).sort((a, b)=>a.slug.localeCompare(b.slug, "zh-Hant"));
        setRows(mapped);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void refreshRows();
    }, [
        organizationId
    ]);
    async function handleCreateNamespace() {
        const trimmedName = displayName.trim();
        if (!trimmedName) {
            setErrorMessage("請先輸入名稱");
            return;
        }
        const slug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deriveSlugCandidate"])(trimmedName);
        if (!slug) {
            setErrorMessage("名稱無法產生有效 slug，請改用英文或數字");
            return;
        }
        setErrorMessage(null);
        setCreating(true);
        try {
            await registerNamespace.execute({
                id: createNamespaceId(),
                slug,
                kind,
                ownerAccountId,
                organizationId
            });
            setDisplayName("");
            await refreshRows();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "建立 namespace 失敗");
        } finally{
            setCreating(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Namespace Prototype"
                            }, void 0, false, {
                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "最小雛型：建立 namespace slug 並以 organization scope 列表檢視，供後續 pages tree 掛載使用。"
                            }, void 0, false, {
                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-2 md:grid-cols-[minmax(0,1fr)_160px_auto]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        value: displayName,
                                        onChange: (event)=>setDisplayName(event.target.value),
                                        placeholder: "例如：Product Wiki"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: kind,
                                        onChange: (event)=>setKind(event.target.value),
                                        className: "h-9 rounded-md border border-input bg-background px-3 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "workspace",
                                                children: "workspace"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                                lineNumber: 118,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "organization",
                                                children: "organization"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                                lineNumber: 119,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: ()=>void handleCreateNamespace(),
                                        disabled: creating,
                                        children: creating ? "建立中..." : "建立 Namespace"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground",
                                children: [
                                    "slug preview: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-foreground",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deriveSlugCandidate"])(displayName || "sample-namespace") || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                        lineNumber: 127,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            errorMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
                                children: errorMessage
                            }, void 0, false, {
                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Organization Namespaces"
                            }, void 0, false, {
                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: [
                                    "organizationId: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono",
                                        children: organizationId
                                    }, void 0, false, {
                                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                        lineNumber: 142,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground",
                            children: "目前尚無 namespace，先建立第一筆。"
                        }, void 0, false, {
                            fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                            lineNumber: 147,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "truncate text-sm font-medium text-foreground",
                                                    children: row.slug
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: [
                                                        "id=",
                                                        row.id
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                            lineNumber: 152,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full border border-border/60 px-2 py-1",
                                                    children: row.kind
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-full border border-border/60 px-2 py-1",
                                                    children: row.status
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                            lineNumber: 156,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, row.id, true, {
                                    fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                                    lineNumber: 151,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/namespace/interfaces/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Module: namespace
 * Layer: interfaces/barrel
 * Purpose: Public re-exports for namespace interface adapters and UI prototypes.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$interfaces$2f$api$2f$namespace$2e$controller$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/interfaces/api/namespace.controller.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$interfaces$2f$components$2f$NamespacePrototypeView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/interfaces/components/NamespacePrototypeView.tsx [app-ssr] (ecmascript)");
;
;
}),
"[project]/modules/namespace/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Module: namespace
 * Layer: facade
 * Purpose: Public API for the namespace module — namespace registration, resolution, and slug policy.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */ // ── Domain: Entities ──────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$entities$2f$namespace$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/entities/namespace.entity.ts [app-ssr] (ecmascript)");
// ── Domain: Services ─────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/services/slug-policy.ts [app-ssr] (ecmascript)");
// ── Domain: Value Objects ────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$value$2d$objects$2f$namespace$2d$slug$2e$vo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/value-objects/namespace-slug.vo.ts [app-ssr] (ecmascript)");
// ── Application: Use Cases ────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$application$2f$use$2d$cases$2f$register$2d$namespace$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/application/use-cases/register-namespace.use-case.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$application$2f$use$2d$cases$2f$resolve$2d$namespace$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/application/use-cases/resolve-namespace.use-case.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$application$2f$use$2d$cases$2f$list$2d$namespaces$2d$by$2d$organization$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/application/use-cases/list-namespaces-by-organization.use-case.ts [app-ssr] (ecmascript)");
// ── Infrastructure ────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$namespace$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/infrastructure/repositories/in-memory-namespace.repository.ts [app-ssr] (ecmascript)");
// ── Interfaces ────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$interfaces$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/namespace/interfaces/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
}),
"[project]/modules/workspace-scheduling/api/schema.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssignMemberSchema",
    ()=>AssignMemberSchema,
    "CreateDemandSchema",
    ()=>CreateDemandSchema
]);
/**
 * Module: workspace-scheduling
 * Layer: api/schema
 * Purpose: Zod validation schemas for WorkDemand commands.
 *
 * This is the boundary guard — all input from UI must be validated here
 * before reaching the application layer.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$zod$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-zod/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
;
const CreateDemandSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    workspaceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "workspaceId is required"),
    accountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "accountId is required"),
    requesterId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "requesterId is required"),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2, "標題至少需要 2 個字"),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default(""),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "medium",
        "high"
    ]).default("medium"),
    scheduledAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "請選擇排程日期")
});
const AssignMemberSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    demandId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "demandId is required"),
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "userId is required"),
    assignedBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "assignedBy is required")
});
}),
"[project]/modules/workspace-scheduling/domain/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: workspace-scheduling
 * Layer: domain
 * Purpose: Core WorkDemand entity and value types.
 *
 * Occam's Razor: minimal essential entities only.
 * No external dependencies — pure TypeScript.
 */ // ── Status ────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "DEMAND_PRIORITIES",
    ()=>DEMAND_PRIORITIES,
    "DEMAND_PRIORITY_LABELS",
    ()=>DEMAND_PRIORITY_LABELS,
    "DEMAND_STATUSES",
    ()=>DEMAND_STATUSES,
    "DEMAND_STATUS_LABELS",
    ()=>DEMAND_STATUS_LABELS
]);
const DEMAND_STATUSES = [
    "draft",
    "open",
    "in_progress",
    "completed"
];
const DEMAND_STATUS_LABELS = {
    draft: "草稿",
    open: "待處理",
    in_progress: "進行中",
    completed: "已完成"
};
const DEMAND_PRIORITIES = [
    "low",
    "medium",
    "high"
];
const DEMAND_PRIORITY_LABELS = {
    low: "低",
    medium: "中",
    high: "高"
};
}),
"[project]/modules/workspace-scheduling/interfaces/_actions/data:0a5a39 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "submitWorkDemand",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"404a15c2771ecd20031f3f2aaa61a3f3467382967b":"submitWorkDemand"},"modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("404a15c2771ecd20031f3f2aaa61a3f3467382967b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "submitWorkDemand");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vd29yay1kZW1hbmQuYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBNb2R1bGU6IHdvcmtzcGFjZS1zY2hlZHVsaW5nXHJcbiAqIExheWVyOiBpbnRlcmZhY2VzL19hY3Rpb25zXHJcbiAqIFB1cnBvc2U6IFNlcnZlciBBY3Rpb25zIOKAlCB0aGUgYXV0aG9yaXNlZCB3cml0ZSBzdXJmYWNlIGZvciB0aGUgVUkuXHJcbiAqXHJcbiAqIFVJIE1VU1QgY2FsbCB0aGVzZSBhY3Rpb25zIGZvciBhbGwgbXV0YXRpb25zLlxyXG4gKiBUaGV5IHZhbGlkYXRlIGlucHV0LCBpbnZva2UgdXNlIGNhc2VzLCBhbmQgcmV0dXJuIENvbW1hbmRSZXN1bHQuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHR5cGUgeyBDb21tYW5kUmVzdWx0IH0gZnJvbSBcIkBzaGFyZWQtdHlwZXNcIjtcclxuaW1wb3J0IHsgY29tbWFuZEZhaWx1cmVGcm9tIH0gZnJvbSBcIkBzaGFyZWQtdHlwZXNcIjtcclxuXHJcbmltcG9ydCB7IENyZWF0ZURlbWFuZFNjaGVtYSwgQXNzaWduTWVtYmVyU2NoZW1hIH0gZnJvbSBcIi4uLy4uL2FwaS9zY2hlbWFcIjtcclxuaW1wb3J0IHR5cGUgeyBDcmVhdGVEZW1hbmRJbnB1dCwgQXNzaWduTWVtYmVySW5wdXQgfSBmcm9tIFwiLi4vLi4vYXBpL3NjaGVtYVwiO1xyXG5pbXBvcnQge1xyXG4gIFN1Ym1pdFdvcmtEZW1hbmRVc2VDYXNlLFxyXG4gIEFzc2lnbldvcmtEZW1hbmRVc2VDYXNlLFxyXG59IGZyb20gXCIuLi8uLi9hcHBsaWNhdGlvbi93b3JrLWRlbWFuZC51c2UtY2FzZXNcIjtcclxuaW1wb3J0IHsgRmlyZWJhc2VEZW1hbmRSZXBvc2l0b3J5IH0gZnJvbSBcIi4uLy4uL2luZnJhc3RydWN0dXJlL2ZpcmViYXNlL0ZpcmViYXNlRGVtYW5kUmVwb3NpdG9yeVwiO1xyXG5cclxuZnVuY3Rpb24gbWFrZVJlcG8oKSB7XHJcbiAgcmV0dXJuIG5ldyBGaXJlYmFzZURlbWFuZFJlcG9zaXRvcnkoKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN1Ym1pdFdvcmtEZW1hbmQocmF3OiBDcmVhdGVEZW1hbmRJbnB1dCk6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIGNvbnN0IHBhcnNlZCA9IENyZWF0ZURlbWFuZFNjaGVtYS5zYWZlUGFyc2UocmF3KTtcclxuICBpZiAoIXBhcnNlZC5zdWNjZXNzKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiVkFMSURBVElPTl9GQUlMRURcIiwgcGFyc2VkLmVycm9yLmlzc3Vlc1swXT8ubWVzc2FnZSA/PyBcIlZhbGlkYXRpb24gZmFpbGVkXCIpO1xyXG4gIH1cclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBTdWJtaXRXb3JrRGVtYW5kVXNlQ2FzZShtYWtlUmVwbygpKS5leGVjdXRlKHBhcnNlZC5kYXRhKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXHJcbiAgICAgIFwiV09SS19ERU1BTkRfQUNUSU9OX0ZBSUxFRFwiLFxyXG4gICAgICBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIsXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzc2lnbldvcmtEZW1hbmQocmF3OiBBc3NpZ25NZW1iZXJJbnB1dCk6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIGNvbnN0IHBhcnNlZCA9IEFzc2lnbk1lbWJlclNjaGVtYS5zYWZlUGFyc2UocmF3KTtcclxuICBpZiAoIXBhcnNlZC5zdWNjZXNzKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiVkFMSURBVElPTl9GQUlMRURcIiwgcGFyc2VkLmVycm9yLmlzc3Vlc1swXT8ubWVzc2FnZSA/PyBcIlZhbGlkYXRpb24gZmFpbGVkXCIpO1xyXG4gIH1cclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBBc3NpZ25Xb3JrRGVtYW5kVXNlQ2FzZShtYWtlUmVwbygpKS5leGVjdXRlKHBhcnNlZC5kYXRhKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXHJcbiAgICAgIFwiV09SS19ERU1BTkRfQUNUSU9OX0ZBSUxFRFwiLFxyXG4gICAgICBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIsXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjRVQTBCc0IsNkxBQUEifQ==
}),
"[project]/modules/workspace-scheduling/interfaces/queries/data:3f21bb [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWorkspaceDemands",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40e9f49717506465beb1cb48489b90e9ba8ba077f4":"getWorkspaceDemands"},"modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40e9f49717506465beb1cb48489b90e9ba8ba077f4", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getWorkspaceDemands");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vd29yay1kZW1hbmQucXVlcmllcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcclxuXHJcbi8qKlxyXG4gKiBNb2R1bGU6IHdvcmtzcGFjZS1zY2hlZHVsaW5nXHJcbiAqIExheWVyOiBpbnRlcmZhY2VzL3F1ZXJpZXNcclxuICogUHVycG9zZTogUmVhZC1zaWRlIHF1ZXJ5IGhlbHBlcnMgZm9yIFdvcmtEZW1hbmQuXHJcbiAqXHJcbiAqIFRoZXNlIGFyZSBwbGFpbiBhc3luYyBmdW5jdGlvbnMgY2FsbGFibGUgZnJvbSBTZXJ2ZXIgQ29tcG9uZW50cyxcclxuICogc2VydmVyIGFjdGlvbnMsIG9yIHdyYXBwZWQgaW4gY2xpZW50IGhvb2tzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB0eXBlIHsgV29ya0RlbWFuZCB9IGZyb20gXCIuLi8uLi9kb21haW4vdHlwZXNcIjtcclxuaW1wb3J0IHtcclxuICBMaXN0V29ya3NwYWNlRGVtYW5kc1VzZUNhc2UsXHJcbiAgTGlzdEFjY291bnREZW1hbmRzVXNlQ2FzZSxcclxufSBmcm9tIFwiLi4vLi4vYXBwbGljYXRpb24vd29yay1kZW1hbmQudXNlLWNhc2VzXCI7XHJcbmltcG9ydCB7IEZpcmViYXNlRGVtYW5kUmVwb3NpdG9yeSB9IGZyb20gXCIuLi8uLi9pbmZyYXN0cnVjdHVyZS9maXJlYmFzZS9GaXJlYmFzZURlbWFuZFJlcG9zaXRvcnlcIjtcclxuXHJcbmZ1bmN0aW9uIG1ha2VSZXBvKCkge1xyXG4gIHJldHVybiBuZXcgRmlyZWJhc2VEZW1hbmRSZXBvc2l0b3J5KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXb3Jrc3BhY2VEZW1hbmRzKHdvcmtzcGFjZUlkOiBzdHJpbmcpOiBQcm9taXNlPFdvcmtEZW1hbmRbXT4ge1xyXG4gIHJldHVybiBuZXcgTGlzdFdvcmtzcGFjZURlbWFuZHNVc2VDYXNlKG1ha2VSZXBvKCkpLmV4ZWN1dGUod29ya3NwYWNlSWQpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWNjb3VudERlbWFuZHMoYWNjb3VudElkOiBzdHJpbmcpOiBQcm9taXNlPFdvcmtEZW1hbmRbXT4ge1xyXG4gIHJldHVybiBuZXcgTGlzdEFjY291bnREZW1hbmRzVXNlQ2FzZShtYWtlUmVwbygpKS5leGVjdXRlKGFjY291bnRJZCk7XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI4VUFzQnNCLGdNQUFBIn0=
}),
"[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalendarWidget",
    ()=>CalendarWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Module: workspace-scheduling
 * Layer: interfaces/components
 * Purpose: Lightweight month-view calendar widget.
 *
 * Inspired by Postiz's Calendar/Launch scheduling view.
 * Uses date-fns + CSS Grid — no heavy third-party calendar library.
 *
 * Occam's Razor: month view only, demand dots on due dates,
 * click-to-create interaction.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$date$2d$fns$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-date-fns/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addMonths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/addMonths.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$eachDayOfInterval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/eachDayOfInterval.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/endOfMonth.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$getDay$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/getDay.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isSameMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isSameMonth.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isToday$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isToday.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfMonth.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMonths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/subMonths.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/domain/types.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// ── Helpers ───────────────────────────────────────────────────────────────────
const DAY_HEADERS = [
    "日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六"
];
const STATUS_DOT_CLASSES = {
    draft: "bg-muted-foreground",
    open: "bg-blue-500",
    in_progress: "bg-amber-500",
    completed: "bg-green-500"
};
function CalendarDayCell({ day, isCurrentMonth, dayDemands, onDayClick }) {
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isToday$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isToday"])(day);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "button",
        tabIndex: 0,
        "aria-label": (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(day, "yyyy-MM-dd"),
        onClick: ()=>onDayClick?.(day),
        onKeyDown: (e)=>{
            if (e.key === "Enter" || e.key === " ") onDayClick?.(day);
        },
        className: [
            "relative min-h-[72px] rounded-lg border p-1.5 text-sm transition-colors",
            isCurrentMonth ? "border-border/50 bg-card hover:bg-accent/40 cursor-pointer" : "border-transparent bg-muted/20 text-muted-foreground cursor-default",
            today ? "ring-2 ring-primary ring-offset-1" : ""
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    today ? "bg-primary text-primary-foreground" : ""
                ].filter(Boolean).join(" "),
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(day, "d")
            }, void 0, false, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 space-y-0.5",
                children: [
                    dayDemands.slice(0, 3).map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            title: `${d.title} (${__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_STATUS_LABELS"][d.status]})`,
                            className: "flex items-center gap-1 truncate",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `inline-block h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT_CLASSES[d.status]}`
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate text-[10px] leading-none text-foreground/80",
                                    children: d.title
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, d.id, true, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)),
                    dayDemands.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-muted-foreground",
                        children: [
                            "+",
                            dayDemands.length - 3,
                            " more"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
function CalendarWidget({ demands, onDayClick }) {
    const [currentMonth, setCurrentMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startOfMonth"])(new Date()));
    // All days in the current month
    const monthDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$eachDayOfInterval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachDayOfInterval"])({
            start: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startOfMonth"])(currentMonth),
            end: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endOfMonth"])(currentMonth)
        }), [
        currentMonth
    ]);
    // Leading empty cells to align the first day to the correct weekday column
    const leadingBlanks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$getDay$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startOfMonth"])(currentMonth)), [
        currentMonth
    ]);
    // Build demand-by-date lookup for O(1) access
    const demandsByDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = new Map();
        for (const d of demands){
            const key = d.scheduledAt.slice(0, 10); // "YYYY-MM-DD"
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(d);
        }
        return map;
    }, [
        demands
    ]);
    function getDayDemands(day) {
        return demandsByDate.get((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(day, "yyyy-MM-dd")) ?? [];
    }
    // Build legend for the status colours
    const legendEntries = [
        {
            status: "open",
            label: __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_STATUS_LABELS"].open
        },
        {
            status: "in_progress",
            label: __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_STATUS_LABELS"].in_progress
        },
        {
            status: "completed",
            label: __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_STATUS_LABELS"].completed
        },
        {
            status: "draft",
            label: __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_STATUS_LABELS"].draft
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-base font-semibold",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(currentMonth, "yyyy 年 M 月")
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                "aria-label": "上個月",
                                onClick: ()=>setCurrentMonth((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMonths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subMonths"])(m, 1)),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>setCurrentMonth((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startOfMonth"])(new Date())),
                                children: "今天"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                "aria-label": "下個月",
                                onClick: ()=>setCurrentMonth((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addMonths$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addMonths"])(m, 1)),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-3",
                children: legendEntries.map(({ status, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `h-2 w-2 rounded-full ${STATUS_DOT_CLASSES[status]}`
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this)
                        ]
                    }, status, true, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-7 gap-1",
                children: [
                    DAY_HEADERS.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pb-1 text-center text-xs font-medium text-muted-foreground",
                            children: h
                        }, h, false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this)),
                    Array.from({
                        length: leadingBlanks
                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, `blank-${i}`, false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this)),
                    monthDays.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarDayCell, {
                            day: day,
                            isCurrentMonth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isSameMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSameMonth"])(day, currentMonth),
                            dayDemands: getDayDemands(day),
                            onDayClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isSameMonth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSameMonth"])(day, currentMonth) ? onDayClick : undefined
                        }, day.toISOString(), false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateDemandForm",
    ()=>CreateDemandForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Module: workspace-scheduling
 * Layer: interfaces/components
 * Purpose: Quick-capture form for creating a new WorkDemand.
 *
 * Inspired by Postiz's "Schedule Post" dialog — focused, minimal,
 * opens when the user clicks a calendar day or "New Demand" button.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$date$2d$fns$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-date-fns/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/domain/types.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
function CreateDemandForm({ open, initialDate, onClose, onSubmit }) {
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [priority, setPriority] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("medium");
    const [scheduledAt, setScheduledAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(initialDate, "yyyy-MM-dd") : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "yyyy-MM-dd"));
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Re-sync date when the prop changes (e.g. user clicks a different day)
    const handleOpen = (isOpen)=>{
        if (isOpen && initialDate) {
            setScheduledAt((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(initialDate, "yyyy-MM-dd"));
        }
        if (!isOpen) handleClose();
    };
    function handleClose() {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setScheduledAt(initialDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(initialDate, "yyyy-MM-dd") : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "yyyy-MM-dd"));
        setError(null);
        onClose();
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const t = title.trim();
        if (!t) {
            setError("請輸入需求標題。");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await onSubmit({
                title: t,
                description: description.trim(),
                priority,
                scheduledAt
            });
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "提交失敗，請再試一次。");
        } finally{
            setSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: handleOpen,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "建立工作需求"
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "填寫需求詳情後送出，Account 管理員將收到通知並指派成員。"
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "demand-title",
                                    children: "標題 *"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    id: "demand-title",
                                    placeholder: "需要完成什麼工作？",
                                    value: title,
                                    onChange: (e)=>setTitle(e.target.value),
                                    disabled: submitting,
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "demand-description",
                                    children: "描述（選填）"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                    id: "demand-description",
                                    placeholder: "詳細說明需求背景或驗收條件…",
                                    rows: 3,
                                    value: description,
                                    onChange: (e)=>setDescription(e.target.value),
                                    disabled: submitting
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "demand-priority",
                                            children: "優先級"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                            lineNumber: 148,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                            value: priority,
                                            onValueChange: (v)=>setPriority(v),
                                            disabled: submitting,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    id: "demand-priority",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: [
                                                        "low",
                                                        "medium",
                                                        "high"
                                                    ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: p,
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_PRIORITY_LABELS"][p]
                                                        }, p, false, {
                                                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                                            lineNumber: 159,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                            lineNumber: 149,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "demand-date",
                                            children: "排程日期 *"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "demand-date",
                                            type: "date",
                                            value: scheduledAt,
                                            onChange: (e)=>setScheduledAt(e.target.value),
                                            disabled: submitting
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                            lineNumber: 169,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            role: "alert",
                            className: "text-sm text-destructive",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    onClick: handleClose,
                                    disabled: submitting,
                                    children: "取消"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    disabled: submitting,
                                    children: submitting ? "提交中…" : "建立需求"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
            lineNumber: 110,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceSchedulingTab",
    ()=>WorkspaceSchedulingTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Module: workspace-scheduling
 * Layer: interfaces
 * Purpose: Workspace (tenant) view — submit demands, view own schedule.
 *
 * Occam's Razor: calendar + quick-capture form only.
 * No complex state machines — useState + server actions.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/domain/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$_actions$2f$data$3a$0a5a39__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/_actions/data:0a5a39 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$queries$2f$data$3a$3f21bb__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/queries/data:3f21bb [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$components$2f$CalendarWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$components$2f$CreateDemandForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
// ── Status badge variant ──────────────────────────────────────────────────────
const STATUS_VARIANT = {
    draft: "outline",
    open: "secondary",
    in_progress: "default",
    completed: "default"
};
const PRIORITY_CLASS = {
    low: "text-muted-foreground",
    medium: "text-amber-600",
    high: "text-red-600"
};
function WorkspaceSchedulingTab({ workspace, accountId, currentUserId }) {
    const [demands, setDemands] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadState, setLoadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("loading");
    const [formOpen, setFormOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [actionError, setActionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadDemands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoadState("loading");
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$queries$2f$data$3a$3f21bb__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getWorkspaceDemands"])(workspace.id);
            setDemands(data);
            setLoadState("loaded");
        } catch  {
            setLoadState("error");
        }
    }, [
        workspace.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        void (async ()=>{
            if (!cancelled) await loadDemands();
        })();
        return ()=>{
            cancelled = true;
        };
    }, [
        loadDemands
    ]);
    function handleDayClick(date) {
        setSelectedDate(date);
        setFormOpen(true);
    }
    function handleNewDemand() {
        setSelectedDate(undefined);
        setFormOpen(true);
    }
    async function handleSubmit(values) {
        setActionError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$_actions$2f$data$3a$0a5a39__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["submitWorkDemand"])({
            workspaceId: workspace.id,
            accountId,
            requesterId: currentUserId,
            title: values.title,
            description: values.description,
            priority: values.priority,
            scheduledAt: values.scheduledAt
        });
        if (!result.success) {
            throw new Error(result.error.message);
        }
        await loadDemands();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold",
                                children: [
                                    workspace.name,
                                    " — 工作規劃"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "點擊日期或「新增需求」快速建立工作需求。"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        size: "sm",
                        onClick: handleNewDemand,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "mr-1.5 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            "新增需求"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            actionError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "alert",
                className: "text-sm text-destructive",
                children: actionError
            }, void 0, false, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-sm font-medium",
                                children: "排程日曆"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                className: "text-xs",
                                children: "點擊日期快速排程新需求"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: loadState === "loading" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-48 items-center justify-center text-sm text-muted-foreground",
                            children: "載入中…"
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$components$2f$CalendarWidget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CalendarWidget"], {
                            demands: demands,
                            onDayClick: handleDayClick
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-medium text-muted-foreground uppercase tracking-wide",
                        children: [
                            "需求列表 (",
                            demands.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    loadState === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-destructive",
                        children: "載入失敗，請重新整理。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    loadState === "loaded" && demands.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
                        children: "目前尚無需求。點擊日曆日期或「新增需求」開始排程。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                        lineNumber: 173,
                        columnNumber: 11
                    }, this),
                    demands.map((demand)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between rounded-lg border border-border/60 bg-card px-4 py-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "truncate font-medium text-sm",
                                            children: demand.title
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                            lineNumber: 184,
                                            columnNumber: 15
                                        }, this),
                                        demand.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-0.5 truncate text-xs text-muted-foreground",
                                            children: demand.description
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs text-muted-foreground",
                                            children: [
                                                "排程日期：",
                                                demand.scheduledAt
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                            lineNumber: 190,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ml-4 flex shrink-0 flex-col items-end gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: STATUS_VARIANT[demand.status],
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_STATUS_LABELS"][demand.status]
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                            lineNumber: 195,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-xs font-medium ${PRIORITY_CLASS[demand.priority]}`,
                                            children: [
                                                __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$domain$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMAND_PRIORITY_LABELS"][demand.priority],
                                                "優先"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                            lineNumber: 198,
                                            columnNumber: 15
                                        }, this),
                                        demand.assignedUserId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-muted-foreground",
                                            children: "已指派"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                            lineNumber: 202,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, demand.id, true, {
                            fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$components$2f$CreateDemandForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CreateDemandForm"], {
                open: formOpen,
                initialDate: selectedDate,
                onClose: ()=>setFormOpen(false),
                onSubmit: handleSubmit
            }, void 0, false, {
                fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/workspace-scheduling/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Module: workspace-scheduling
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer for the WorkDemand API contract.
 *
 * Other modules and UI layers import schemas and types from here.
 * Direct imports into domain/, application/, or infrastructure/ are forbidden.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$api$2f$schema$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/api/schema.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$WorkspaceSchedulingTab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx [app-ssr] (ecmascript)");
;
;
}),
"[project]/modules/notification/application/use-cases/notification.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DispatchNotificationUseCase",
    ()=>DispatchNotificationUseCase,
    "MarkAllNotificationsReadUseCase",
    ()=>MarkAllNotificationsReadUseCase,
    "MarkNotificationReadUseCase",
    ()=>MarkNotificationReadUseCase
]);
/**
 * Notification Use Cases — pure business workflows.
 * notification-hub = sole side-effect outlet. All notification dispatch routes through here.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-ssr] (ecmascript)");
;
class DispatchNotificationUseCase {
    notificationRepo;
    constructor(notificationRepo){
        this.notificationRepo = notificationRepo;
    }
    async execute(input) {
        try {
            const notification = await this.notificationRepo.dispatch(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(notification.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_DISPATCH_FAILED", err instanceof Error ? err.message : "Failed to dispatch notification");
        }
    }
}
class MarkNotificationReadUseCase {
    notificationRepo;
    constructor(notificationRepo){
        this.notificationRepo = notificationRepo;
    }
    async execute(notificationId, recipientId) {
        try {
            await this.notificationRepo.markAsRead(notificationId, recipientId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(notificationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_MARK_READ_FAILED", err instanceof Error ? err.message : "Failed to mark notification as read");
        }
    }
}
class MarkAllNotificationsReadUseCase {
    notificationRepo;
    constructor(notificationRepo){
        this.notificationRepo = notificationRepo;
    }
    async execute(recipientId) {
        try {
            await this.notificationRepo.markAllAsRead(recipientId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(recipientId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Failed to mark all notifications as read");
        }
    }
}
}),
"[project]/modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseNotificationRepository",
    ()=>FirebaseNotificationRepository
]);
/**
 * FirebaseNotificationRepository — Infrastructure adapter for notifications.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-ssr] (ecmascript)");
;
;
class FirebaseNotificationRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async dispatch(input) {
        const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), {
            recipientId: input.recipientId,
            title: input.title,
            message: input.message,
            type: input.type,
            read: false,
            timestamp: Date.now(),
            sourceEventType: input.sourceEventType ?? null,
            metadata: input.metadata ?? null,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return {
            id: docRef.id,
            recipientId: input.recipientId,
            title: input.title,
            message: input.message,
            type: input.type,
            read: false,
            timestamp: Date.now(),
            sourceEventType: input.sourceEventType,
            metadata: input.metadata
        };
    }
    async markAsRead(notificationId, _recipientId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(this.db, "notifications", notificationId), {
            read: true
        });
    }
    async markAllAsRead(recipientId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("read", "==", false));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(q);
        await Promise.all(snaps.docs.map((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(d.ref, {
                read: true
            })));
    }
    async findByRecipient(recipientId, maxCount = 50) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderBy"])("timestamp", "desc"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["limit"])(maxCount));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.docs.map((d)=>{
            const data = d.data();
            return {
                id: d.id,
                recipientId: data.recipientId,
                title: data.title,
                message: data.message,
                type: data.type,
                read: data.read,
                timestamp: data.timestamp,
                sourceEventType: data.sourceEventType,
                metadata: data.metadata
            };
        });
    }
    async getUnreadCount(recipientId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("read", "==", false));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.size;
    }
}
}),
"[project]/modules/notification/interfaces/queries/notification.queries.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNotificationsForRecipient",
    ()=>getNotificationsForRecipient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$infrastructure$2f$firebase$2f$FirebaseNotificationRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts [app-ssr] (ecmascript)");
;
const notificationRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$infrastructure$2f$firebase$2f$FirebaseNotificationRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseNotificationRepository"]();
async function getNotificationsForRecipient(recipientId, limit = 50) {
    const normalizedRecipientId = recipientId.trim();
    if (!normalizedRecipientId) {
        return [];
    }
    return notificationRepo.findByRecipient(normalizedRecipientId, limit);
}
}),
"[project]/modules/notification/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * notification module public API
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$application$2f$use$2d$cases$2f$notification$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/application/use-cases/notification.use-cases.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$infrastructure$2f$firebase$2f$FirebaseNotificationRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$queries$2f$notification$2e$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/queries/notification.queries.ts [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/modules/notification/interfaces/_actions/data:b33af8 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markAllNotificationsRead",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4022f040e3b75fb00e991105d96de345865740c7d5":"markAllNotificationsRead"},"modules/notification/interfaces/_actions/notification.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("4022f040e3b75fb00e991105d96de345865740c7d5", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "markAllNotificationsRead");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90aWZpY2F0aW9uLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogTm90aWZpY2F0aW9uIFNlcnZlciBBY3Rpb25zIOKAlCB0aGluIGFkYXB0ZXIgdG8gdXNlIGNhc2VzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNvbW1hbmRGYWlsdXJlRnJvbSwgdHlwZSBDb21tYW5kUmVzdWx0IH0gZnJvbSBcIkBzaGFyZWQtdHlwZXNcIjtcclxuaW1wb3J0IHtcclxuICBEaXNwYXRjaE5vdGlmaWNhdGlvblVzZUNhc2UsXHJcbiAgTWFya05vdGlmaWNhdGlvblJlYWRVc2VDYXNlLFxyXG4gIE1hcmtBbGxOb3RpZmljYXRpb25zUmVhZFVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9ub3RpZmljYXRpb24udXNlLWNhc2VzXCI7XHJcbmltcG9ydCB7IEZpcmViYXNlTm90aWZpY2F0aW9uUmVwb3NpdG9yeSB9IGZyb20gXCIuLi8uLi9pbmZyYXN0cnVjdHVyZS9maXJlYmFzZS9GaXJlYmFzZU5vdGlmaWNhdGlvblJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHR5cGUgeyBEaXNwYXRjaE5vdGlmaWNhdGlvbklucHV0IH0gZnJvbSBcIi4uLy4uL2RvbWFpbi9lbnRpdGllcy9Ob3RpZmljYXRpb25cIjtcclxuXHJcbmNvbnN0IG5vdGlmaWNhdGlvblJlcG8gPSBuZXcgRmlyZWJhc2VOb3RpZmljYXRpb25SZXBvc2l0b3J5KCk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlzcGF0Y2hOb3RpZmljYXRpb24oXHJcbiAgaW5wdXQ6IERpc3BhdGNoTm90aWZpY2F0aW9uSW5wdXQsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERpc3BhdGNoTm90aWZpY2F0aW9uVXNlQ2FzZShub3RpZmljYXRpb25SZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJOT1RJRklDQVRJT05fRElTUEFUQ0hfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya05vdGlmaWNhdGlvblJlYWQoXHJcbiAgbm90aWZpY2F0aW9uSWQ6IHN0cmluZyxcclxuICByZWNpcGllbnRJZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrTm90aWZpY2F0aW9uUmVhZFVzZUNhc2Uobm90aWZpY2F0aW9uUmVwbykuZXhlY3V0ZShub3RpZmljYXRpb25JZCwgcmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX1JFQURfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkKHJlY2lwaWVudElkOiBzdHJpbmcpOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrQWxsTm90aWZpY2F0aW9uc1JlYWRVc2VDYXNlKG5vdGlmaWNhdGlvblJlcG8pLmV4ZWN1dGUocmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX0FMTF9SRUFEX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjZVQXNDc0IscU1BQUEifQ==
}),
"[project]/modules/notification/interfaces/_actions/data:c5c06d [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markNotificationRead",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60e0b9b1f0ec32b3e7fb944c7e8641e252aa3b5f40":"markNotificationRead"},"modules/notification/interfaces/_actions/notification.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("60e0b9b1f0ec32b3e7fb944c7e8641e252aa3b5f40", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "markNotificationRead");
;
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90aWZpY2F0aW9uLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogTm90aWZpY2F0aW9uIFNlcnZlciBBY3Rpb25zIOKAlCB0aGluIGFkYXB0ZXIgdG8gdXNlIGNhc2VzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNvbW1hbmRGYWlsdXJlRnJvbSwgdHlwZSBDb21tYW5kUmVzdWx0IH0gZnJvbSBcIkBzaGFyZWQtdHlwZXNcIjtcclxuaW1wb3J0IHtcclxuICBEaXNwYXRjaE5vdGlmaWNhdGlvblVzZUNhc2UsXHJcbiAgTWFya05vdGlmaWNhdGlvblJlYWRVc2VDYXNlLFxyXG4gIE1hcmtBbGxOb3RpZmljYXRpb25zUmVhZFVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9ub3RpZmljYXRpb24udXNlLWNhc2VzXCI7XHJcbmltcG9ydCB7IEZpcmViYXNlTm90aWZpY2F0aW9uUmVwb3NpdG9yeSB9IGZyb20gXCIuLi8uLi9pbmZyYXN0cnVjdHVyZS9maXJlYmFzZS9GaXJlYmFzZU5vdGlmaWNhdGlvblJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHR5cGUgeyBEaXNwYXRjaE5vdGlmaWNhdGlvbklucHV0IH0gZnJvbSBcIi4uLy4uL2RvbWFpbi9lbnRpdGllcy9Ob3RpZmljYXRpb25cIjtcclxuXHJcbmNvbnN0IG5vdGlmaWNhdGlvblJlcG8gPSBuZXcgRmlyZWJhc2VOb3RpZmljYXRpb25SZXBvc2l0b3J5KCk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlzcGF0Y2hOb3RpZmljYXRpb24oXHJcbiAgaW5wdXQ6IERpc3BhdGNoTm90aWZpY2F0aW9uSW5wdXQsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERpc3BhdGNoTm90aWZpY2F0aW9uVXNlQ2FzZShub3RpZmljYXRpb25SZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJOT1RJRklDQVRJT05fRElTUEFUQ0hfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya05vdGlmaWNhdGlvblJlYWQoXHJcbiAgbm90aWZpY2F0aW9uSWQ6IHN0cmluZyxcclxuICByZWNpcGllbnRJZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrTm90aWZpY2F0aW9uUmVhZFVzZUNhc2Uobm90aWZpY2F0aW9uUmVwbykuZXhlY3V0ZShub3RpZmljYXRpb25JZCwgcmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX1JFQURfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkKHJlY2lwaWVudElkOiBzdHJpbmcpOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrQWxsTm90aWZpY2F0aW9uc1JlYWRVc2VDYXNlKG5vdGlmaWNhdGlvblJlcG8pLmV4ZWN1dGUocmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX0FMTF9SRUFEX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlVQTJCc0IsaU1BQUEifQ==
}),
"[project]/modules/identity/application/identity-error-message.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Narrow error shape used by auth flows when SDK or browser-thrown errors expose
 * only a code/message pair.
 */ __turbopack_context__.s([
    "toIdentityErrorMessage",
    ()=>toIdentityErrorMessage
]);
const IDENTITY_ERROR_MESSAGES = {
    // Firebase/browser-thrown auth failures have surfaced both hyphenated and
    // underscored credential codes in different environments, so we normalize both.
    "auth/network-request-failed": "We couldn’t reach the sign-in service. Check your connection and try again.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-login-credentials": "The email or password is incorrect.",
    "auth/invalid_login_credentials": "The email or password is incorrect.",
    "auth/user-not-found": "The email or password is incorrect.",
    "auth/wrong-password": "The email or password is incorrect.",
    "auth/email-already-in-use": "This email is already registered. Try signing in instead.",
    "auth/weak-password": "Password must be at least 6 characters long.",
    "auth/too-many-requests": "Too many attempts were made. Please wait a moment and try again.",
    "auth/user-disabled": "This account is currently disabled. Contact support for help.",
    "auth/operation-not-allowed": "This sign-in method is not available right now.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/missing-email": "Enter an email address.",
    "auth/missing-password": "Enter a password."
};
function toIdentityErrorMessage(error, fallback) {
    /**
   * Extract Firebase auth codes from raw error messages and strip SDK-specific
   * prefixes so the UI never renders noisy Firebase boilerplate.
   */ const resolveFromMessage = (message)=>{
        const normalizedMessage = message.trim();
        const matchedCode = normalizedMessage.match(/auth\/[a-z][a-z0-9_-]*/)?.[0]?.toLowerCase();
        if (matchedCode && matchedCode in IDENTITY_ERROR_MESSAGES) {
            return IDENTITY_ERROR_MESSAGES[matchedCode];
        }
        return normalizedMessage.replace(/^Firebase:\s*/i, "").replace(/^Error\s*/i, "").trim();
    };
    if (typeof error === "object" && error !== null) {
        const { code, message } = error;
        if (code && code in IDENTITY_ERROR_MESSAGES) {
            return IDENTITY_ERROR_MESSAGES[code];
        }
        if (typeof message === "string" && message.trim().length > 0) {
            return resolveFromMessage(message);
        }
    }
    if (error instanceof Error && error.message.trim().length > 0) {
        return resolveFromMessage(error.message);
    }
    return fallback;
}
}),
"[project]/modules/identity/application/use-cases/identity.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegisterUseCase",
    ()=>RegisterUseCase,
    "SendPasswordResetEmailUseCase",
    ()=>SendPasswordResetEmailUseCase,
    "SignInAnonymouslyUseCase",
    ()=>SignInAnonymouslyUseCase,
    "SignInUseCase",
    ()=>SignInUseCase,
    "SignOutUseCase",
    ()=>SignOutUseCase
]);
/**
 * Identity Use Cases — pure business workflows.
 * No React, no Firebase SDK, no UI framework.
 * Depends only on the IdentityRepository port.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/identity-error-message.ts [app-ssr] (ecmascript)");
;
;
class SignInUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute(credentials) {
        try {
            const identity = await this.identityRepo.signInWithEmailAndPassword(credentials);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_IN_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Sign-in failed"));
        }
    }
}
class SignInAnonymouslyUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute() {
        try {
            const identity = await this.identityRepo.signInAnonymously();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_IN_ANONYMOUS_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Anonymous sign-in failed"));
        }
    }
}
class RegisterUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute(input) {
        try {
            const identity = await this.identityRepo.createUserWithEmailAndPassword(input);
            await this.identityRepo.updateDisplayName(identity.uid, input.name);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("REGISTRATION_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Registration failed"));
        }
    }
}
class SendPasswordResetEmailUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute(email) {
        try {
            await this.identityRepo.sendPasswordResetEmail(email);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(email, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("PASSWORD_RESET_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Password reset failed"));
        }
    }
}
class SignOutUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute() {
        const currentUser = this.identityRepo.getCurrentUser();
        const aggregateId = currentUser?.uid ?? "anonymous";
        try {
            await this.identityRepo.signOut();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(aggregateId, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_OUT_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Sign-out failed"));
        }
    }
}
}),
"[project]/modules/identity/application/use-cases/token-refresh.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmitTokenRefreshSignalUseCase",
    ()=>EmitTokenRefreshSignalUseCase
]);
/**
 * Token Refresh Use Cases — pure business workflows for [S6] Claims refresh.
 * No React, no Firebase SDK, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-ssr] (ecmascript)");
;
class EmitTokenRefreshSignalUseCase {
    tokenRefreshRepo;
    constructor(tokenRefreshRepo){
        this.tokenRefreshRepo = tokenRefreshRepo;
    }
    async execute(accountId, reason, traceId) {
        // Guard: accountId must be a safe document ID (alphanumeric + hyphen/underscore)
        if (!/^[\w-]+$/.test(accountId)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("TOKEN_REFRESH_INVALID_ACCOUNT_ID", `accountId '${accountId}' is not a valid Firestore document ID`);
        }
        try {
            await this.tokenRefreshRepo.emit({
                accountId,
                reason,
                issuedAt: new Date().toISOString(),
                ...traceId ? {
                    traceId
                } : {}
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(accountId, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("TOKEN_REFRESH_EMIT_FAILED", err instanceof Error ? err.message : "Failed to emit token refresh signal");
        }
    }
}
}),
"[project]/modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseIdentityRepository",
    ()=>FirebaseIdentityRepository
]);
/**
 * FirebaseIdentityRepository — Infrastructure adapter implementing IdentityRepository port.
 * Translates Firebase Auth SDK calls into domain entities.
 * Firebase SDK only exists in this file, never in domain or application layers.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-ssr] (ecmascript)");
;
;
// ─── Mapper: Firebase User → Domain IdentityEntity ──────────────────────────
function toIdentityEntity(user) {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        emailVerified: user.emailVerified
    };
}
class FirebaseIdentityRepository {
    get auth() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async signInWithEmailAndPassword(credentials) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(this.auth, credentials.email, credentials.password);
        return toIdentityEntity(result.user);
    }
    async signInAnonymously() {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInAnonymously"])(this.auth);
        return toIdentityEntity(result.user);
    }
    async createUserWithEmailAndPassword(input) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(this.auth, input.email, input.password);
        return toIdentityEntity(result.user);
    }
    async updateDisplayName(uid, displayName) {
        const currentUser = this.auth.currentUser;
        if (currentUser && currentUser.uid === uid) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProfile"])(currentUser, {
                displayName
            });
        }
    }
    async sendPasswordResetEmail(email) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sendPasswordResetEmail"])(this.auth, email);
    }
    async signOut() {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])(this.auth);
    }
    getCurrentUser() {
        const user = this.auth.currentUser;
        return user ? toIdentityEntity(user) : null;
    }
}
}),
"[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseTokenRefreshRepository",
    ()=>FirebaseTokenRefreshRepository
]);
/**
 * FirebaseTokenRefreshRepository — Infrastructure adapter for [S6] TOKEN_REFRESH_SIGNAL.
 * Writes/reads `tokenRefreshSignals/{accountId}` in Firestore.
 * Firebase SDK only exists in this file.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-ssr] (ecmascript)");
;
;
const COLLECTION = "tokenRefreshSignals";
class FirebaseTokenRefreshRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async emit(signal) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(this.db, COLLECTION, signal.accountId), {
            accountId: signal.accountId,
            reason: signal.reason,
            issuedAt: signal.issuedAt,
            ...signal.traceId ? {
                traceId: signal.traceId
            } : {}
        }, {
            merge: true
        });
    }
    subscribe(accountId, onSignal) {
        let isFirstEmission = true;
        const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(this.db, COLLECTION, accountId);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(ref, ()=>{
            if (isFirstEmission) {
                isFirstEmission = false;
                return;
            }
            onSignal();
        });
    }
}
}),
"[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTokenRefreshListener",
    ()=>useTokenRefreshListener
]);
/**
 * useTokenRefreshListener — Client Token Refresh Listener [S6].
 *
 * Party 3 of the three-way Claims refresh handshake:
 *   Party 1 (Claims Handler) — emits TOKEN_REFRESH_SIGNAL to `tokenRefreshSignals/{accountId}`
 *   Party 2 (IER CRITICAL_LANE) — routes role/policy change events
 *   Party 3 (this hook) — listens for signal and force-refreshes Firebase ID token
 *
 * Client obligation per SK_TOKEN_REFRESH_CONTRACT [S6]:
 *   On receiving TOKEN_REFRESH_SIGNAL → getIdToken(true) → new token on subsequent requests.
 *
 * Must be mounted once per authenticated session (e.g. shell layout).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integration-firebase/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const tokenRefreshRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseTokenRefreshRepository"]();
function useTokenRefreshListener(accountId) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!accountId) return;
        // Guard: accountId must be a valid Firestore document ID
        if (!/^[\w-]+$/.test(accountId)) return;
        const unsubscribe = tokenRefreshRepo.subscribe(accountId, ()=>{
            const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseAuth"])();
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            // [S6] Force-refresh the ID token so subsequent requests carry updated Custom Claims.
            void currentUser.getIdToken(/* forceRefresh */ true).catch(()=>{
            // Non-fatal: token refreshes naturally on next expiry cycle.
            });
        });
        return ()=>unsubscribe();
    }, [
        accountId
    ]);
}
}),
"[project]/modules/identity/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * identity module public API
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/identity.use-cases.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$token$2d$refresh$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/token-refresh.use-cases.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseIdentityRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-ssr] (ecmascript)");
// Client-only hook — must be imported from the module barrel only from "use client" files
// to avoid RSC bundle contamination.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
}),
];

//# sourceMappingURL=modules_430172a9._.js.map