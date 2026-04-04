(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/shared-types/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── Primitive types ──────────────────────────────────────────────────────────
__turbopack_context__.s([
    "commandFailure",
    ()=>commandFailure,
    "commandFailureFrom",
    ()=>commandFailureFrom,
    "commandSuccess",
    ()=>commandSuccess
]);
function commandSuccess(aggregateId, version) {
    return {
        success: true,
        aggregateId,
        version
    };
}
function commandFailure(error) {
    return {
        success: false,
        error
    };
}
function commandFailureFrom(code, message, context) {
    return commandFailure({
        code,
        message,
        context
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/organization/application/use-cases/organization.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
;
class CreateOrganizationUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(command) {
        try {
            const orgId = await this.orgRepo.create(command);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(orgId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to create organization");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Failed to setup organization with team");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(command.organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Failed to update organization settings");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to delete organization");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(inviteId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to invite member");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to recruit member");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("REMOVE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to remove member");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(input.memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Failed to update member role");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to create team");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to delete team");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Failed to update team members");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Failed to create partner group");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(inviteId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Failed to send partner invite");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to dismiss partner member");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/organization/application/use-cases/organization-policy.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
;
class CreateOrgPolicyUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(input) {
        try {
            const policy = await this.orgRepo.createPolicy(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(policy.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to create org policy");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to update org policy");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to delete org policy");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/organization/interfaces/queries/organization.queries.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts [app-client] (ecmascript)");
;
const orgRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseOrganizationRepository"]();
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/organization/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * organization module public API
 */ __turbopack_context__.s([]);
// Use Cases
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/application/use-cases/organization.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2d$policy$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/application/use-cases/organization-policy.use-cases.ts [app-client] (ecmascript)");
// Infrastructure
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts [app-client] (ecmascript)");
// Read Queries
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$queries$2f$organization$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/queries/organization.queries.ts [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/organization/interfaces/_actions/data:4b2249 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOrganization",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40d820a9b690d1e8de0028caeeb609ef68a8b0a55b":"createOrganization"},"modules/organization/interfaces/_actions/organization.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40d820a9b690d1e8de0028caeeb609ef68a8b0a55b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createOrganization");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vb3JnYW5pemF0aW9uLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogT3JnYW5pemF0aW9uIENvcmUgU2VydmVyIEFjdGlvbnMg4oCUIHRoaW4gYWRhcHRlcjogU2VydmVyIEFjdGlvbnMg4oaSIEFwcGxpY2F0aW9uIFVzZSBDYXNlcy5cclxuICogQ292ZXJzOiBvcmcgbGlmZWN5Y2xlIChjcmVhdGUsIHVwZGF0ZSBzZXR0aW5ncywgZGVsZXRlKS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBjb21tYW5kRmFpbHVyZUZyb20sIHR5cGUgQ29tbWFuZFJlc3VsdCB9IGZyb20gXCJAc2hhcmVkLXR5cGVzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ3JlYXRlT3JnYW5pemF0aW9uVXNlQ2FzZSxcclxuICBDcmVhdGVPcmdhbml6YXRpb25XaXRoVGVhbVVzZUNhc2UsXHJcbiAgVXBkYXRlT3JnYW5pemF0aW9uU2V0dGluZ3NVc2VDYXNlLFxyXG4gIERlbGV0ZU9yZ2FuaXphdGlvblVzZUNhc2UsXHJcbiAgSW52aXRlTWVtYmVyVXNlQ2FzZSxcclxuICBSZWNydWl0TWVtYmVyVXNlQ2FzZSxcclxuICBSZW1vdmVNZW1iZXJVc2VDYXNlLFxyXG4gIFVwZGF0ZU1lbWJlclJvbGVVc2VDYXNlLFxyXG4gIENyZWF0ZVRlYW1Vc2VDYXNlLFxyXG4gIERlbGV0ZVRlYW1Vc2VDYXNlLFxyXG4gIFVwZGF0ZVRlYW1NZW1iZXJzVXNlQ2FzZSxcclxuICBDcmVhdGVQYXJ0bmVyR3JvdXBVc2VDYXNlLFxyXG4gIFNlbmRQYXJ0bmVySW52aXRlVXNlQ2FzZSxcclxuICBEaXNtaXNzUGFydG5lck1lbWJlclVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9vcmdhbml6YXRpb24udXNlLWNhc2VzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ3JlYXRlT3JnUG9saWN5VXNlQ2FzZSxcclxuICBVcGRhdGVPcmdQb2xpY3lVc2VDYXNlLFxyXG4gIERlbGV0ZU9yZ1BvbGljeVVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9vcmdhbml6YXRpb24tcG9saWN5LnVzZS1jYXNlc1wiO1xyXG5pbXBvcnQgeyBGaXJlYmFzZU9yZ2FuaXphdGlvblJlcG9zaXRvcnkgfSBmcm9tIFwiLi4vLi4vaW5mcmFzdHJ1Y3R1cmUvZmlyZWJhc2UvRmlyZWJhc2VPcmdhbml6YXRpb25SZXBvc2l0b3J5XCI7XHJcbmltcG9ydCB0eXBlIHtcclxuICBDcmVhdGVPcmdhbml6YXRpb25Db21tYW5kLFxyXG4gIFVwZGF0ZU9yZ2FuaXphdGlvblNldHRpbmdzQ29tbWFuZCxcclxuICBVcGRhdGVNZW1iZXJSb2xlSW5wdXQsXHJcbiAgQ3JlYXRlVGVhbUlucHV0LFxyXG4gIENyZWF0ZU9yZ1BvbGljeUlucHV0LFxyXG4gIFVwZGF0ZU9yZ1BvbGljeUlucHV0LFxyXG59IGZyb20gXCIuLi8uLi9kb21haW4vZW50aXRpZXMvT3JnYW5pemF0aW9uXCI7XHJcblxyXG5jb25zdCBvcmdSZXBvID0gbmV3IEZpcmViYXNlT3JnYW5pemF0aW9uUmVwb3NpdG9yeSgpO1xyXG5cclxuLy8g4pSA4pSA4pSAIE9yZyBMaWZlY3ljbGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlT3JnYW5pemF0aW9uKFxyXG4gIGNvbW1hbmQ6IENyZWF0ZU9yZ2FuaXphdGlvbkNvbW1hbmQsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IENyZWF0ZU9yZ2FuaXphdGlvblVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJDUkVBVEVfT1JHQU5JWkFUSU9OX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU9yZ2FuaXphdGlvbldpdGhUZWFtKFxyXG4gIGNvbW1hbmQ6IENyZWF0ZU9yZ2FuaXphdGlvbkNvbW1hbmQsXHJcbiAgdGVhbU5hbWU6IHN0cmluZyxcclxuICB0ZWFtVHlwZTogXCJpbnRlcm5hbFwiIHwgXCJleHRlcm5hbFwiID0gXCJpbnRlcm5hbFwiLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBDcmVhdGVPcmdhbml6YXRpb25XaXRoVGVhbVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShjb21tYW5kLCB0ZWFtTmFtZSwgdGVhbVR5cGUpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIlNFVFVQX09SR0FOSVpBVElPTl9XSVRIX1RFQU1fRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlT3JnYW5pemF0aW9uU2V0dGluZ3MoXHJcbiAgY29tbWFuZDogVXBkYXRlT3JnYW5pemF0aW9uU2V0dGluZ3NDb21tYW5kLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVPcmdhbml6YXRpb25TZXR0aW5nc1VzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfT1JHQU5JWkFUSU9OX1NFVFRJTkdTX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU9yZ2FuaXphdGlvbihvcmdhbml6YXRpb25JZDogc3RyaW5nKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgRGVsZXRlT3JnYW5pemF0aW9uVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJERUxFVEVfT1JHQU5JWkFUSU9OX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIE1lbWJlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW52aXRlTWVtYmVyKGlucHV0OiBpbXBvcnQoXCIuLi8uLi9kb21haW4vZW50aXRpZXMvT3JnYW5pemF0aW9uXCIpLkludml0ZU1lbWJlcklucHV0KTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgSW52aXRlTWVtYmVyVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJJTlZJVEVfTUVNQkVSX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlY3J1aXRNZW1iZXIoXHJcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZyxcclxuICBtZW1iZXJJZDogc3RyaW5nLFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBlbWFpbDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBSZWNydWl0TWVtYmVyVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkLCBtZW1iZXJJZCwgbmFtZSwgZW1haWwpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIlJFQ1JVSVRfTUVNQkVSX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRpc21pc3NNZW1iZXIoXHJcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZyxcclxuICBtZW1iZXJJZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBSZW1vdmVNZW1iZXJVc2VDYXNlKG9yZ1JlcG8pLmV4ZWN1dGUob3JnYW5pemF0aW9uSWQsIG1lbWJlcklkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJESVNNSVNTX01FTUJFUl9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVNZW1iZXJSb2xlKGlucHV0OiBVcGRhdGVNZW1iZXJSb2xlSW5wdXQpOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVNZW1iZXJSb2xlVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfTUVNQkVSX1JPTEVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG4vLyDilIDilIDilIAgVGVhbXMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVhbShpbnB1dDogQ3JlYXRlVGVhbUlucHV0KTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgQ3JlYXRlVGVhbVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShpbnB1dCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiQ1JFQVRFX1RFQU1fRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVGVhbShcclxuICBvcmdhbml6YXRpb25JZDogc3RyaW5nLFxyXG4gIHRlYW1JZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBEZWxldGVUZWFtVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkLCB0ZWFtSWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIkRFTEVURV9URUFNX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRlYW1NZW1iZXJzKFxyXG4gIG9yZ2FuaXphdGlvbklkOiBzdHJpbmcsXHJcbiAgdGVhbUlkOiBzdHJpbmcsXHJcbiAgbWVtYmVySWQ6IHN0cmluZyxcclxuICBhY3Rpb246IFwiYWRkXCIgfCBcInJlbW92ZVwiLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVUZWFtTWVtYmVyc1VzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShvcmdhbml6YXRpb25JZCwgdGVhbUlkLCBtZW1iZXJJZCwgYWN0aW9uKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfVEVBTV9NRU1CRVJTX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIFBhcnRuZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBhcnRuZXJHcm91cChcclxuICBvcmdhbml6YXRpb25JZDogc3RyaW5nLFxyXG4gIGdyb3VwTmFtZTogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBDcmVhdGVQYXJ0bmVyR3JvdXBVc2VDYXNlKG9yZ1JlcG8pLmV4ZWN1dGUob3JnYW5pemF0aW9uSWQsIGdyb3VwTmFtZSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiQ1JFQVRFX1BBUlRORVJfR1JPVVBfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFBhcnRuZXJJbnZpdGUoXHJcbiAgb3JnYW5pemF0aW9uSWQ6IHN0cmluZyxcclxuICB0ZWFtSWQ6IHN0cmluZyxcclxuICBlbWFpbDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBTZW5kUGFydG5lckludml0ZVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShvcmdhbml6YXRpb25JZCwgdGVhbUlkLCBlbWFpbCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiU0VORF9QQVJUTkVSX0lOVklURV9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXNtaXNzUGFydG5lck1lbWJlcihcclxuICBvcmdhbml6YXRpb25JZDogc3RyaW5nLFxyXG4gIHRlYW1JZDogc3RyaW5nLFxyXG4gIG1lbWJlcklkOiBzdHJpbmcsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERpc21pc3NQYXJ0bmVyTWVtYmVyVXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKG9yZ2FuaXphdGlvbklkLCB0ZWFtSWQsIG1lbWJlcklkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJESVNNSVNTX1BBUlRORVJfTUVNQkVSX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIFBvbGljeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVPcmdQb2xpY3koaW5wdXQ6IENyZWF0ZU9yZ1BvbGljeUlucHV0KTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgQ3JlYXRlT3JnUG9saWN5VXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJDUkVBVEVfT1JHX1BPTElDWV9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVPcmdQb2xpY3koXHJcbiAgcG9saWN5SWQ6IHN0cmluZyxcclxuICBkYXRhOiBVcGRhdGVPcmdQb2xpY3lJbnB1dCxcclxuKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgVXBkYXRlT3JnUG9saWN5VXNlQ2FzZShvcmdSZXBvKS5leGVjdXRlKHBvbGljeUlkLCBkYXRhKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJVUERBVEVfT1JHX1BPTElDWV9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVPcmdQb2xpY3kocG9saWN5SWQ6IHN0cmluZyk6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERlbGV0ZU9yZ1BvbGljeVVzZUNhc2Uob3JnUmVwbykuZXhlY3V0ZShwb2xpY3lJZCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gY29tbWFuZEZhaWx1cmVGcm9tKFwiREVMRVRFX09SR19QT0xJQ1lfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoidVVBMkNzQiwrTEFBQSJ9
}),
"[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript) <export * as Slot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
            outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
            ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
            destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
            xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
            lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
            icon: "size-8",
            "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
            "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
            "icon-lg": "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__["Slot"].Root : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        "data-variant": variant,
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/button.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript) <export * as Dialog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
"use client";
;
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Root, {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_c = Dialog;
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Trigger, {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
_c1 = DialogTrigger;
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Portal, {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
_c2 = DialogPortal;
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 31,
        columnNumber: 10
    }, this);
}
_c3 = DialogClose;
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Overlay, {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c4 = DialogOverlay;
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Content, {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-background p-4 text-sm ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
                        "data-slot": "dialog-close",
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            className: "absolute top-2 right-2",
                            size: "icon-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                    fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                                    lineNumber: 77,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sr-only",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_c5 = DialogContent;
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_c6 = DialogHeader;
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end", className),
        ...props,
        children: [
            children,
            showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Close, {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    children: "Close"
                }, void 0, false, {
                    fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                    lineNumber: 118,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_c7 = DialogFooter;
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Title, {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-base leading-none font-medium", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_c8 = DialogTitle;
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Dialog$3e$__["Dialog"].Description, {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dialog.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_c9 = DialogDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogPortal");
__turbopack_context__.k.register(_c3, "DialogClose");
__turbopack_context__.k.register(_c4, "DialogOverlay");
__turbopack_context__.k.register(_c5, "DialogContent");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/account-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountSwitcher",
    ()=>AccountSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/organization/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/_actions/data:4b2249 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function AccountSwitcher({ personalAccount, organizationAccounts, activeAccountId, onSelectPersonal, onSelectOrganization, onOrganizationCreated }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { state: { accountsHydrated, bootstrapPhase } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [organizationName, setOrganizationName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [organizationError, setOrganizationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCreatingOrganization, setIsCreatingOrganization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function resetCreateOrganizationDialog() {
        setOrganizationName("");
        setOrganizationError(null);
        setIsCreatingOrganization(false);
    }
    async function handleCreateOrganization(event) {
        event.preventDefault();
        if (!personalAccount) {
            setOrganizationError("帳號資訊已失效，請重新登入後再建立組織。");
            return;
        }
        const nextOrganizationName = organizationName.trim();
        if (!nextOrganizationName) {
            setOrganizationError("請輸入組織名稱。");
            return;
        }
        setIsCreatingOrganization(true);
        setOrganizationError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createOrganization"])({
            organizationName: nextOrganizationName,
            ownerId: personalAccount.id,
            ownerName: personalAccount.name,
            ownerEmail: personalAccount.email
        });
        if (!result.success) {
            setOrganizationError(result.error.message);
            setIsCreatingOrganization(false);
            return;
        }
        onOrganizationCreated?.({
            id: result.aggregateId,
            name: nextOrganizationName,
            accountType: "organization",
            ownerId: personalAccount.id
        });
        resetCreateOrganizationDialog();
        setIsCreateOrganizationOpen(false);
        router.push("/organization");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                        children: "帳號情境"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        "aria-label": "切換帳號情境",
                        value: activeAccountId ?? "",
                        onChange: (event)=>{
                            const nextId = event.target.value;
                            if (nextId === "__create_organization__") {
                                setIsCreateOrganizationOpen(true);
                                return;
                            }
                            if (!nextId || nextId === personalAccount?.id) {
                                onSelectPersonal();
                                return;
                            }
                            const nextAccount = organizationAccounts.find((account)=>account.id === nextId);
                            if (nextAccount) {
                                onSelectOrganization(nextAccount);
                            }
                        },
                        className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground",
                        children: [
                            personalAccount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: personalAccount.id,
                                children: [
                                    personalAccount.name,
                                    "（個人）"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                lineNumber: 124,
                                columnNumber: 13
                            }, this),
                            organizationAccounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: account.id,
                                    children: [
                                        account.name,
                                        "（組織）"
                                    ]
                                }, account.id, true, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "__create_organization__",
                                children: "+建立組織"
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    !accountsHydrated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: bootstrapPhase === "seeded" ? "正在同步組織上下文…" : "正在載入帳號上下文…"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isCreateOrganizationOpen,
                onOpenChange: (open)=>{
                    setIsCreateOrganizationOpen(open);
                    if (!open) {
                        resetCreateOrganizationDialog();
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    "aria-describedby": "create-organization-description",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "建立新組織"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    id: "create-organization-description",
                                    children: "輸入名稱後會直接建立組織並切換到新的組織內容。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            onSubmit: handleCreateOrganization,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground",
                                            htmlFor: "organization-name",
                                            children: "組織名稱"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "organization-name",
                                            value: organizationName,
                                            onChange: (event)=>{
                                                setOrganizationName(event.target.value);
                                                if (organizationError) {
                                                    setOrganizationError(null);
                                                }
                                            },
                                            placeholder: "例如：Gig Team",
                                            autoFocus: true,
                                            disabled: isCreatingOrganization,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 162,
                                            columnNumber: 15
                                        }, this),
                                        organizationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: organizationError
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 176,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>{
                                                resetCreateOrganizationDialog();
                                                setIsCreateOrganizationOpen(false);
                                            },
                                            disabled: isCreatingOrganization,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isCreatingOrganization || !personalAccount,
                                            children: isCreatingOrganization ? "建立中…" : "直接建立"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(AccountSwitcher, "E1nH++TEFOWbjJq4TOIR1lw4LJw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = AccountSwitcher;
var _c;
__turbopack_context__.k.register(_c, "AccountSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/app-breadcrumbs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppBreadcrumbs",
    ()=>AppBreadcrumbs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const SEGMENT_LABELS = {
    "dashboard": "儀表板",
    "organization": "組織",
    "workspace": "工作區",
    "wiki-beta": "Wiki-Beta",
    "rag-query": "RAG 查詢",
    "documents": "文件",
    "libraries": "Libraries",
    "pages": "頁面",
    "pages-dnd": "頁面 (DnD)",
    "block-editor": "區塊編輯器",
    "rag-reindex": "RAG 重新索引",
    "settings": "設定",
    "ai-chat": "AI 對話",
    "dev-tools": "開發工具",
    "namespaces": "命名空間",
    "members": "成員",
    "teams": "團隊",
    "permissions": "權限",
    "workspaces": "工作區清單",
    "schedule": "排程",
    "daily": "每日",
    "audit": "稽核"
};
function segmentLabel(segment) {
    return SEGMENT_LABELS[segment] ?? segment;
}
function AppBreadcrumbs() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const segments = pathname.split("/").filter(Boolean);
    // Only render when there's more than one segment (i.e., not just root page).
    if (segments.length <= 1) return null;
    const crumbs = segments.map((seg, idx)=>({
            label: segmentLabel(seg),
            href: "/" + segments.slice(0, idx + 1).join("/")
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Breadcrumb",
        className: "hidden items-center gap-1 text-xs text-muted-foreground sm:flex",
        children: crumbs.map((crumb, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center gap-1",
                children: [
                    idx > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        className: "size-3 opacity-40"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                        lineNumber: 52,
                        columnNumber: 23
                    }, this),
                    idx < crumbs.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: crumb.href,
                        className: "transition hover:text-foreground",
                        children: crumb.label
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                        lineNumber: 54,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-foreground",
                        children: crumb.label
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                        lineNumber: 61,
                        columnNumber: 13
                    }, this)
                ]
            }, crumb.href, true, {
                fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(AppBreadcrumbs, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppBreadcrumbs;
var _c;
__turbopack_context__.k.register(_c, "AppBreadcrumbs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/_actions/data:45dcaf [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWorkspace",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40a308a42c089c4cd3d119eedf680779dcf995e40f":"createWorkspace"},"modules/workspace/interfaces/_actions/workspace.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40a308a42c089c4cd3d119eedf680779dcf995e40f", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createWorkspace");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vd29ya3NwYWNlLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogV29ya3NwYWNlIFNlcnZlciBBY3Rpb25zIOKAlCB0aGluIGFkYXB0ZXI6IE5leHQuanMgU2VydmVyIEFjdGlvbnMg4oaSIEFwcGxpY2F0aW9uIFVzZSBDYXNlcy5cclxuICovXHJcblxyXG5pbXBvcnQgeyBjb21tYW5kRmFpbHVyZUZyb20sIHR5cGUgQ29tbWFuZFJlc3VsdCB9IGZyb20gXCJAc2hhcmVkLXR5cGVzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ3JlYXRlV29ya3NwYWNlVXNlQ2FzZSxcclxuICBDcmVhdGVXb3Jrc3BhY2VXaXRoQ2FwYWJpbGl0aWVzVXNlQ2FzZSxcclxuICBVcGRhdGVXb3Jrc3BhY2VTZXR0aW5nc1VzZUNhc2UsXHJcbiAgRGVsZXRlV29ya3NwYWNlVXNlQ2FzZSxcclxuICBNb3VudENhcGFiaWxpdGllc1VzZUNhc2UsXHJcbiAgR3JhbnRUZWFtQWNjZXNzVXNlQ2FzZSxcclxuICBHcmFudEluZGl2aWR1YWxBY2Nlc3NVc2VDYXNlLFxyXG4gIENyZWF0ZVdvcmtzcGFjZUxvY2F0aW9uVXNlQ2FzZSxcclxufSBmcm9tIFwiLi4vLi4vYXBwbGljYXRpb24vdXNlLWNhc2VzL3dvcmtzcGFjZS51c2UtY2FzZXNcIjtcclxuaW1wb3J0IHsgRmlyZWJhc2VXb3Jrc3BhY2VSZXBvc2l0b3J5IH0gZnJvbSBcIi4uLy4uL2luZnJhc3RydWN0dXJlL2ZpcmViYXNlL0ZpcmViYXNlV29ya3NwYWNlUmVwb3NpdG9yeVwiO1xyXG5pbXBvcnQgdHlwZSB7XHJcbiAgQ3JlYXRlV29ya3NwYWNlQ29tbWFuZCxcclxuICBVcGRhdGVXb3Jrc3BhY2VTZXR0aW5nc0NvbW1hbmQsXHJcbiAgQ2FwYWJpbGl0eSxcclxuICBXb3Jrc3BhY2VHcmFudCxcclxuICBXb3Jrc3BhY2VMb2NhdGlvbixcclxufSBmcm9tIFwiLi4vLi4vZG9tYWluL2VudGl0aWVzL1dvcmtzcGFjZVwiO1xyXG5cclxuY29uc3Qgd29ya3NwYWNlUmVwbyA9IG5ldyBGaXJlYmFzZVdvcmtzcGFjZVJlcG9zaXRvcnkoKTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVXb3Jrc3BhY2UoY29tbWFuZDogQ3JlYXRlV29ya3NwYWNlQ29tbWFuZCk6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IENyZWF0ZVdvcmtzcGFjZVVzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfQ1JFQVRFX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdvcmtzcGFjZVdpdGhDYXBhYmlsaXRpZXMoXHJcbiAgY29tbWFuZDogQ3JlYXRlV29ya3NwYWNlQ29tbWFuZCxcclxuICBjYXBhYmlsaXRpZXM6IENhcGFiaWxpdHlbXSxcclxuKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgQ3JlYXRlV29ya3NwYWNlV2l0aENhcGFiaWxpdGllc1VzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZShjb21tYW5kLCBjYXBhYmlsaXRpZXMpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIldPUktTUEFDRV9DUkVBVEVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlV29ya3NwYWNlU2V0dGluZ3MoXHJcbiAgY29tbWFuZDogVXBkYXRlV29ya3NwYWNlU2V0dGluZ3NDb21tYW5kLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVXb3Jrc3BhY2VTZXR0aW5nc1VzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfVVBEQVRFX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVdvcmtzcGFjZSh3b3Jrc3BhY2VJZDogc3RyaW5nKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgRGVsZXRlV29ya3NwYWNlVXNlQ2FzZSh3b3Jrc3BhY2VSZXBvKS5leGVjdXRlKHdvcmtzcGFjZUlkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfREVMRVRFX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1vdW50Q2FwYWJpbGl0aWVzKFxyXG4gIHdvcmtzcGFjZUlkOiBzdHJpbmcsXHJcbiAgY2FwYWJpbGl0aWVzOiBDYXBhYmlsaXR5W10sXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IE1vdW50Q2FwYWJpbGl0aWVzVXNlQ2FzZSh3b3Jrc3BhY2VSZXBvKS5leGVjdXRlKHdvcmtzcGFjZUlkLCBjYXBhYmlsaXRpZXMpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIkNBUEFCSUxJVElFU19NT1VOVF9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhdXRob3JpemVXb3Jrc3BhY2VUZWFtKFxyXG4gIHdvcmtzcGFjZUlkOiBzdHJpbmcsXHJcbiAgdGVhbUlkOiBzdHJpbmcsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IEdyYW50VGVhbUFjY2Vzc1VzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZSh3b3Jrc3BhY2VJZCwgdGVhbUlkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfVEVBTV9BVVRIT1JJWkVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ3JhbnRJbmRpdmlkdWFsV29ya3NwYWNlQWNjZXNzKFxyXG4gIHdvcmtzcGFjZUlkOiBzdHJpbmcsXHJcbiAgZ3JhbnQ6IFdvcmtzcGFjZUdyYW50LFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBHcmFudEluZGl2aWR1YWxBY2Nlc3NVc2VDYXNlKHdvcmtzcGFjZVJlcG8pLmV4ZWN1dGUod29ya3NwYWNlSWQsIGdyYW50KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfR1JBTlRfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlV29ya3NwYWNlTG9jYXRpb24oXHJcbiAgd29ya3NwYWNlSWQ6IHN0cmluZyxcclxuICBsb2NhdGlvbjogT21pdDxXb3Jrc3BhY2VMb2NhdGlvbiwgXCJsb2NhdGlvbklkXCI+LFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBDcmVhdGVXb3Jrc3BhY2VMb2NhdGlvblVzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZSh3b3Jrc3BhY2VJZCwgbG9jYXRpb24pO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIldPUktTUEFDRV9MT0NBVElPTl9DUkVBVEVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOFRBNEJzQiw0TEFBQSJ9
}),
"[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "AvatarBadge",
    ()=>AvatarBadge,
    "AvatarFallback",
    ()=>AvatarFallback,
    "AvatarGroup",
    ()=>AvatarGroup,
    "AvatarGroupCount",
    ()=>AvatarGroupCount,
    "AvatarImage",
    ()=>AvatarImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-avatar/dist/index.mjs [app-client] (ecmascript) <export * as Avatar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Avatar({ className, size = "default", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__["Avatar"].Root, {
        "data-slot": "avatar",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/avatar.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = Avatar;
function AvatarImage({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__["Avatar"].Image, {
        "data-slot": "avatar-image",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("aspect-square size-full rounded-full object-cover", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/avatar.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c1 = AvatarImage;
function AvatarFallback({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__["Avatar"].Fallback, {
        "data-slot": "avatar-fallback",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/avatar.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_c2 = AvatarFallback;
function AvatarBadge({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "avatar-badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none", "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden", "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2", "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/avatar.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_c3 = AvatarBadge;
function AvatarGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "avatar-group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/avatar.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
_c4 = AvatarGroup;
function AvatarGroupCount({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "avatar-group-count",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/avatar.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_c5 = AvatarGroupCount;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Avatar");
__turbopack_context__.k.register(_c1, "AvatarImage");
__turbopack_context__.k.register(_c2, "AvatarFallback");
__turbopack_context__.k.register(_c3, "AvatarBadge");
__turbopack_context__.k.register(_c4, "AvatarGroup");
__turbopack_context__.k.register(_c5, "AvatarGroupCount");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuCheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuGroup",
    ()=>DropdownMenuGroup,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuPortal",
    ()=>DropdownMenuPortal,
    "DropdownMenuRadioGroup",
    ()=>DropdownMenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>DropdownMenuRadioItem,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuShortcut",
    ()=>DropdownMenuShortcut,
    "DropdownMenuSub",
    ()=>DropdownMenuSub,
    "DropdownMenuSubContent",
    ()=>DropdownMenuSubContent,
    "DropdownMenuSubTrigger",
    ()=>DropdownMenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript) <export * as DropdownMenu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
"use client";
;
;
;
;
function DropdownMenu({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Root, {
        "data-slot": "dropdown-menu",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = DropdownMenu;
function DropdownMenuPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Portal, {
        "data-slot": "dropdown-menu-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c1 = DropdownMenuPortal;
function DropdownMenuTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Trigger, {
        "data-slot": "dropdown-menu-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c2 = DropdownMenuTrigger;
function DropdownMenuContent({ className, align = "start", sideOffset = 4, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Portal, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Content, {
            "data-slot": "dropdown-menu-content",
            sideOffset: sideOffset,
            align: align,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_c3 = DropdownMenuContent;
function DropdownMenuGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Group, {
        "data-slot": "dropdown-menu-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c4 = DropdownMenuGroup;
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Item, {
        "data-slot": "dropdown-menu-item",
        "data-inset": inset,
        "data-variant": variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_c5 = DropdownMenuItem;
function DropdownMenuCheckboxItem({ className, children, checked, inset, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].CheckboxItem, {
        "data-slot": "dropdown-menu-checkbox-item",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute right-2 flex items-center justify-center",
                "data-slot": "dropdown-menu-checkbox-item-indicator",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].ItemIndicator, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {}, void 0, false, {
                        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_c6 = DropdownMenuCheckboxItem;
function DropdownMenuRadioGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].RadioGroup, {
        "data-slot": "dropdown-menu-radio-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c7 = DropdownMenuRadioGroup;
function DropdownMenuRadioItem({ className, children, inset, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].RadioItem, {
        "data-slot": "dropdown-menu-radio-item",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute right-2 flex items-center justify-center",
                "data-slot": "dropdown-menu-radio-item-indicator",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].ItemIndicator, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {}, void 0, false, {
                        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_c8 = DropdownMenuRadioItem;
function DropdownMenuLabel({ className, inset, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Label, {
        "data-slot": "dropdown-menu-label",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this);
}
_c9 = DropdownMenuLabel;
function DropdownMenuSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Separator, {
        "data-slot": "dropdown-menu-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-border", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
_c10 = DropdownMenuSeparator;
function DropdownMenuShortcut({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "dropdown-menu-shortcut",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
_c11 = DropdownMenuShortcut;
function DropdownMenuSub({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Sub, {
        "data-slot": "dropdown-menu-sub",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 213,
        columnNumber: 10
    }, this);
}
_c12 = DropdownMenuSub;
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].SubTrigger, {
        "data-slot": "dropdown-menu-sub-trigger",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                className: "ml-auto"
            }, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
_c13 = DropdownMenuSubTrigger;
function DropdownMenuSubContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].SubContent, {
        "data-slot": "dropdown-menu-sub-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 min-w-[96px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/dropdown-menu.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
_c14 = DropdownMenuSubContent;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14;
__turbopack_context__.k.register(_c, "DropdownMenu");
__turbopack_context__.k.register(_c1, "DropdownMenuPortal");
__turbopack_context__.k.register(_c2, "DropdownMenuTrigger");
__turbopack_context__.k.register(_c3, "DropdownMenuContent");
__turbopack_context__.k.register(_c4, "DropdownMenuGroup");
__turbopack_context__.k.register(_c5, "DropdownMenuItem");
__turbopack_context__.k.register(_c6, "DropdownMenuCheckboxItem");
__turbopack_context__.k.register(_c7, "DropdownMenuRadioGroup");
__turbopack_context__.k.register(_c8, "DropdownMenuRadioItem");
__turbopack_context__.k.register(_c9, "DropdownMenuLabel");
__turbopack_context__.k.register(_c10, "DropdownMenuSeparator");
__turbopack_context__.k.register(_c11, "DropdownMenuShortcut");
__turbopack_context__.k.register(_c12, "DropdownMenuSub");
__turbopack_context__.k.register(_c13, "DropdownMenuSubTrigger");
__turbopack_context__.k.register(_c14, "DropdownMenuSubContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/tooltip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip,
    "TooltipContent",
    ()=>TooltipContent,
    "TooltipProvider",
    ()=>TooltipProvider,
    "TooltipTrigger",
    ()=>TooltipTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tooltip/dist/index.mjs [app-client] (ecmascript) <export * as Tooltip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function TooltipProvider({ delayDuration = 0, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Provider, {
        "data-slot": "tooltip-provider",
        delayDuration: delayDuration,
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/tooltip.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = TooltipProvider;
function Tooltip({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Root, {
        "data-slot": "tooltip",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/tooltip.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c1 = Tooltip;
function TooltipTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Trigger, {
        "data-slot": "tooltip-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/tooltip.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c2 = TooltipTrigger;
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Portal, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Content, {
            "data-slot": "tooltip-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Tooltip$3e$__["Tooltip"].Arrow, {
                    className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground"
                }, void 0, false, {
                    fileName: "[project]/packages/ui-shadcn/ui/tooltip.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui-shadcn/ui/tooltip.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/tooltip.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c3 = TooltipContent;
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "TooltipProvider");
__turbopack_context__.k.register(_c1, "Tooltip");
__turbopack_context__.k.register(_c2, "TooltipTrigger");
__turbopack_context__.k.register(_c3, "TooltipContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/app-rail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppRail",
    ()=>AppRail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: app-rail.tsx
 * Purpose: render the narrow leftmost icon rail (app rail) of the authenticated shell.
 * Responsibilities: app logo, account context switcher, top-level section icon nav with
 *   tooltips, and quick sign-out via user avatar dropdown at the bottom.
 * Constraints: UI-only; follows the two-column sidebar pattern from Plane's AppRailRoot.
 *   `h-full` ensures it fills the parent `h-screen` container.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/notebook-text.js [app-client] (ecmascript) <export default as NotebookText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.js [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/organization/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/_actions/data:4b2249 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$45dcaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/_actions/data:45dcaf [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/tooltip.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
;
function isExactOrChildPath(targetPath, pathname) {
    return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}
function getInitial(name) {
    return name?.trim().charAt(0).toUpperCase() || "U";
}
function AppRail({ pathname, user, activeAccount, organizationAccounts, workspaces, workspacesHydrated, isOrganizationAccount, onSelectPersonal, onSelectOrganization, activeWorkspaceId, onSelectWorkspace, onOrganizationCreated, onSignOut }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isCreateOrgOpen, setIsCreateOrgOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [orgName, setOrgName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [orgError, setOrgError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCreating, setIsCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [workspaceName, setWorkspaceName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [workspaceCreateError, setWorkspaceCreateError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCreatingWorkspace, setIsCreatingWorkspace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function resetDialog() {
        setOrgName("");
        setOrgError(null);
        setIsCreating(false);
    }
    function resetWorkspaceDialog() {
        setWorkspaceName("");
        setWorkspaceCreateError(null);
        setIsCreatingWorkspace(false);
    }
    async function handleCreateWorkspace(event) {
        event.preventDefault();
        const name = workspaceName.trim();
        if (!name) {
            setWorkspaceCreateError("請輸入工作區名稱。");
            return;
        }
        if (!activeAccount) {
            setWorkspaceCreateError("帳號資訊已失效，請重新登入後再建立工作區。");
            return;
        }
        setIsCreatingWorkspace(true);
        setWorkspaceCreateError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$45dcaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createWorkspace"])({
            name,
            accountId: activeAccount.id,
            accountType: isOrganizationAccount ? "organization" : "user"
        });
        if (!result.success) {
            setWorkspaceCreateError(result.error.message);
            setIsCreatingWorkspace(false);
            return;
        }
        resetWorkspaceDialog();
        setIsCreateWorkspaceOpen(false);
        router.push("/workspace");
    }
    async function handleCreateOrg(event) {
        event.preventDefault();
        if (!user) {
            setOrgError("帳號資訊已失效，請重新登入後再建立組織。");
            return;
        }
        const name = orgName.trim();
        if (!name) {
            setOrgError("請輸入組織名稱。");
            return;
        }
        setIsCreating(true);
        setOrgError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createOrganization"])({
            organizationName: name,
            ownerId: user.id,
            ownerName: user.name,
            ownerEmail: user.email
        });
        if (!result.success) {
            setOrgError(result.error.message);
            setIsCreating(false);
            return;
        }
        const newAccount = {
            id: result.aggregateId,
            name,
            accountType: "organization",
            ownerId: user.id
        };
        onOrganizationCreated?.(newAccount);
        resetDialog();
        setIsCreateOrgOpen(false);
        router.push("/organization");
    }
    function isActive(href) {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    const railItems = [
        {
            href: "/workspace",
            label: "工作區中心",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 194,
                columnNumber: 13
            }, this)
        },
        {
            href: "/wiki-beta",
            label: "Account Wiki-Beta",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 199,
                columnNumber: 13
            }, this)
        },
        {
            href: "/ai-chat",
            label: "AI 對話",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 204,
                columnNumber: 13
            }, this)
        },
        {
            href: "/organization/members",
            label: "成員",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 209,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/members", currentPathname)
        },
        {
            href: "/organization/teams",
            label: "團隊",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 216,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/teams", currentPathname)
        },
        {
            href: "/organization/permissions",
            label: "權限",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 223,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/permissions", currentPathname)
        },
        {
            href: "/organization/daily",
            label: "每日",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookText$3e$__["NotebookText"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 230,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/daily", currentPathname)
        },
        {
            href: "/organization/schedule",
            label: "排程",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 237,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/schedule", currentPathname)
        },
        {
            href: "/organization/audit",
            label: "稽核",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 244,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/audit", currentPathname)
        },
        {
            href: "/dev-tools",
            label: "開發工具",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 251,
                columnNumber: 13
            }, this)
        }
    ];
    /** Settings is pinned above the avatar, separate from main nav */ const settingsHref = "/settings";
    const visibleRailItems = railItems.filter((item)=>item.show !== false);
    const sortedWorkspaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AppRail.useMemo[sortedWorkspaces]": ()=>[
                ...workspaces
            ].sort({
                "AppRail.useMemo[sortedWorkspaces]": (a, b)=>a.name.localeCompare(b.name, "zh-Hant")
            }["AppRail.useMemo[sortedWorkspaces]"])
    }["AppRail.useMemo[sortedWorkspaces]"], [
        workspaces
    ]);
    function buildWikiBetaWorkspaceHref(workspaceId) {
        if (pathname.startsWith("/wiki-beta")) {
            const targetPath = pathname === "/wiki-beta" ? "/wiki-beta/documents" : pathname;
            return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
        }
        return `/wiki-beta/documents?workspaceId=${encodeURIComponent(workspaceId)}`;
    }
    const accountName = activeAccount?.name ?? user?.name ?? "—";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipProvider"], {
        delayDuration: 400,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                "aria-label": "App navigation rail",
                className: "hidden h-full w-12 shrink-0 flex-col items-center border-r border-border/50 bg-card/40 py-2 md:flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "aria-label": "切換帳號情境",
                                                className: "mb-1 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tracking-tight text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                                children: getInitial(accountName)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                        side: "right",
                                        className: "max-w-[180px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium",
                                                children: accountName
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 296,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: isOrganizationAccount ? "組織帳號" : "個人帳號"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 297,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 295,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                side: "right",
                                align: "start",
                                className: "w-52",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                        className: "text-xs text-muted-foreground",
                                        children: "切換帳號"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 304,
                                        columnNumber: 13
                                    }, this),
                                    user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: onSelectPersonal,
                                        className: activeAccount?.id === user.id ? "bg-primary/10 text-primary" : "",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: [
                                                user.name,
                                                " (Personal)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 310,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 306,
                                        columnNumber: 15
                                    }, this),
                                    organizationAccounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>{
                                                onSelectOrganization(account);
                                            },
                                            className: activeAccount?.id === account.id ? "bg-primary/10 text-primary" : "",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate",
                                                children: account.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 321,
                                                columnNumber: 17
                                            }, this)
                                        }, account.id, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 314,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 324,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>{
                                            setIsCreateOrgOpen(true);
                                        },
                                        className: "gap-2 text-primary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "size-3.5 shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 331,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "建立組織"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 332,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "my-2 h-px w-7 bg-border/50"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex flex-col items-center gap-0.5",
                        "aria-label": "主要導覽",
                        children: visibleRailItems.map((item)=>{
                            const active = item.isActive?.(pathname) ?? isActive(item.href);
                            if (item.href === "/workspace") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                        asChild: true,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "aria-current": active ? "page" : undefined,
                                                            "aria-label": "工作區中心：切換工作區",
                                                            className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                            children: item.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 350,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 348,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                    side: "right",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs",
                                                        children: "工作區中心：切換工作區"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 364,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 347,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            side: "right",
                                            align: "start",
                                            className: "w-56",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 370,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: ()=>{
                                                        router.push("/workspace");
                                                    },
                                                    className: pathname === "/workspace" ? "bg-primary/10 text-primary" : "",
                                                    children: "工作區中心"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 21
                                                }, this),
                                                !workspacesHydrated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "工作區載入中..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "目前帳號沒有工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.map((workspace)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>{
                                                            onSelectWorkspace(workspace.id);
                                                            router.push(`/workspace/${workspace.id}`);
                                                        },
                                                        className: activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate",
                                                            children: workspace.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, workspace.id, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 25
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: ()=>{
                                                        setIsCreateWorkspaceOpen(true);
                                                    },
                                                    className: "gap-2 text-primary",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            className: "size-3.5 shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "建立工作區"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 406,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 369,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 346,
                                    columnNumber: 17
                                }, this);
                            }
                            if (item.href === "/wiki-beta") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                        asChild: true,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "aria-current": active ? "page" : undefined,
                                                            "aria-label": "Account Wiki-Beta: 切換工作區",
                                                            className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                            children: item.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                    side: "right",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs",
                                                        children: "Account Wiki-Beta: 切換工作區"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 416,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            side: "right",
                                            align: "start",
                                            className: "w-56",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "選擇工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 439,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: ()=>{
                                                        onSelectWorkspace(null);
                                                        router.push("/wiki-beta");
                                                    },
                                                    className: !activeWorkspaceId ? "bg-primary/10 text-primary" : "",
                                                    children: "Account Wiki-Beta 首頁"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 21
                                                }, this),
                                                !workspacesHydrated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "工作區載入中..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "目前帳號沒有工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.map((workspace)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>{
                                                            onSelectWorkspace(workspace.id);
                                                            router.push(buildWikiBetaWorkspaceHref(workspace.id));
                                                        },
                                                        className: activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate",
                                                            children: workspace.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 464,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, workspace.id, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 438,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 415,
                                    columnNumber: 17
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.href,
                                            "aria-current": active ? "page" : undefined,
                                            "aria-label": item.label,
                                            className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 476,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 475,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                        side: "right",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs",
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 490,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 489,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 474,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 498,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: settingsHref,
                                        "aria-current": isActive(settingsHref) ? "page" : undefined,
                                        "aria-label": "個人設定",
                                        className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${isActive(settingsHref) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                            className: "size-[18px]"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 514,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 504,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 503,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                    side: "right",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs",
                                        children: "個人設定"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 518,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 517,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 502,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 501,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "aria-label": "開啟使用者選單",
                                                className: "rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                    size: "sm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                        className: "bg-primary/10 text-xs font-semibold text-primary",
                                                        children: getInitial(user?.name)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 528,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 527,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 526,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                        side: "right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium",
                                                children: user?.name ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 542,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: user?.email ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 543,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 541,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 525,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                side: "right",
                                align: "end",
                                className: "w-48",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                        className: "space-y-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-sm font-medium",
                                                children: user?.name ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 549,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-xs text-muted-foreground",
                                                children: user?.email ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 550,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 548,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 552,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        variant: "destructive",
                                        onClick: onSignOut,
                                        children: "登出"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 553,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 547,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 524,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 559,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isCreateOrgOpen,
                onOpenChange: (open)=>{
                    setIsCreateOrgOpen(open);
                    if (!open) resetDialog();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    "aria-describedby": "rail-create-org-description",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "建立新組織"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 572,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    id: "rail-create-org-description",
                                    children: "輸入名稱後會直接建立組織並切換到新的組織內容。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 573,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 571,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            onSubmit: handleCreateOrg,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground",
                                            htmlFor: "rail-organization-name",
                                            children: "組織名稱"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 579,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "rail-organization-name",
                                            value: orgName,
                                            onChange: (e)=>{
                                                setOrgName(e.target.value);
                                                if (orgError) setOrgError(null);
                                            },
                                            placeholder: "例如：Gig Team",
                                            autoFocus: true,
                                            disabled: isCreating,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 582,
                                            columnNumber: 15
                                        }, this),
                                        orgError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: orgError
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 594,
                                            columnNumber: 28
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 578,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>{
                                                resetDialog();
                                                setIsCreateOrgOpen(false);
                                            },
                                            disabled: isCreating,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 597,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isCreating || !user,
                                            children: isCreating ? "建立中…" : "直接建立"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 608,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 596,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 577,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                    lineNumber: 570,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 563,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isCreateWorkspaceOpen,
                onOpenChange: (open)=>{
                    setIsCreateWorkspaceOpen(open);
                    if (!open) resetWorkspaceDialog();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    "aria-describedby": "rail-create-workspace-description",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "建立新工作區"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 626,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    id: "rail-create-workspace-description",
                                    children: "輸入名稱後會直接建立工作區並加入目前帳號的工作區清單中。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 627,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 625,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            onSubmit: handleCreateWorkspace,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground",
                                            htmlFor: "rail-workspace-name",
                                            children: "工作區名稱"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 633,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "rail-workspace-name",
                                            value: workspaceName,
                                            onChange: (e)=>{
                                                setWorkspaceName(e.target.value);
                                                if (workspaceCreateError) setWorkspaceCreateError(null);
                                            },
                                            placeholder: "例如：Project Alpha",
                                            autoFocus: true,
                                            disabled: isCreatingWorkspace,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 636,
                                            columnNumber: 15
                                        }, this),
                                        workspaceCreateError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: workspaceCreateError
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 648,
                                            columnNumber: 40
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 632,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>{
                                                resetWorkspaceDialog();
                                                setIsCreateWorkspaceOpen(false);
                                            },
                                            disabled: isCreatingWorkspace,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 651,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isCreatingWorkspace || !activeAccount,
                                            children: isCreatingWorkspace ? "建立中…" : "直接建立"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 662,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 650,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 631,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                    lineNumber: 624,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 617,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
        lineNumber: 276,
        columnNumber: 5
    }, this);
}
_s(AppRail, "RMMNgS/Tuhll6lqbfJ6ElW6QBZU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppRail;
var _c;
__turbopack_context__.k.register(_c, "AppRail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/lib-dragdrop/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * @module libs/dragdrop
 * Thin wrapper for Atlaskit Pragmatic Drag and Drop.
 *
 * Provides a single import path for all drag-and-drop primitives:
 *   - Element drag adapter     — draggable, dropTargetForElements, monitorForElements
 *   - External drag adapter    — dropTargetForExternal, monitorForExternal
 *   - Utilities                — combine, reorder, preventUnhandled, once
 *   - Preview helpers          — setCustomNativeDragPreview, disableNativeDragPreview, etc.
 *   - Hitbox                   — closest-edge (flat lists), list-item / tree-item (reorderable trees)
 *   - Drop indicator           — DropIndicator React component for box targets
 *
 * All exports are client-side.  Do not use in Server Components.
 *
 * Usage:
 *   import { draggable, dropTargetForElements, DropIndicator } from "@/libs/dragdrop";
 *   import { attachClosestEdge, extractClosestEdge } from "@/libs/dragdrop";
 */ // ── Combine ────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$combine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/combine.js [app-client] (ecmascript) <locals>");
// ── Element adapter ────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$element$2f$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/element/adapter.js [app-client] (ecmascript) <locals>");
// ── Element preview helpers ────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$element$2f$set$2d$custom$2d$native$2d$drag$2d$preview$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/element/set-custom-native-drag-preview.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$element$2f$pointer$2d$outside$2d$of$2d$preview$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/element/pointer-outside-of-preview.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$element$2f$disable$2d$native$2d$drag$2d$preview$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/element/disable-native-drag-preview.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$element$2f$center$2d$under$2d$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/element/center-under-pointer.js [app-client] (ecmascript) <locals>");
// ── Utilities ──────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$reorder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/reorder.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$prevent$2d$unhandled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/prevent-unhandled.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$entry$2d$point$2f$once$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/once.js [app-client] (ecmascript) <locals>");
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
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Checkbox$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript) <export * as Checkbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
"use client";
;
;
;
;
function Checkbox({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Checkbox$3e$__["Checkbox"].Root, {
        "data-slot": "checkbox",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Checkbox$3e$__["Checkbox"].Indicator, {
            "data-slot": "checkbox-indicator",
            className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {}, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/checkbox.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/packages/ui-shadcn/ui/checkbox.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/checkbox.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Checkbox;
;
var _c;
__turbopack_context__.k.register(_c, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Label$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript) <export * as Label>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Label$3e$__["Label"].Root, {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Separator$3e$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript) <export * as Separator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Separator$3e$__["Separator"].Root, {
        "data-slot": "separator",
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/separator.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Separator;
;
var _c;
__turbopack_context__.k.register(_c, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/customize-navigation-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomizeNavigationDialog",
    ()=>CustomizeNavigationDialog,
    "readNavPreferences",
    ()=>readNavPreferences
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: customize-navigation-dialog.tsx
 * Purpose: Let users pick which nav items stay pinned in the secondary sidebar.
 * Responsibilities: checkbox toggles per item, workspace nav-style radio, show-N-workspaces
 *   preference, all persisted to localStorage.
 * Constraints: UI-only; pure preference storage, no backend call.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$dragdrop$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-dragdrop/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop-hitbox/dist/esm/closest-edge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$combine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/public-utils/combine.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/adapter/element-adapter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$react$2d$drop$2d$indicator$2f$dist$2f$esm$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/dist/esm/box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$reorder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/public-utils/reorder.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/separator.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
const STORAGE_KEY = "xuanwu:nav-preferences";
// ── Personal nav items ─────────────────────────────────────────────────────
const PERSONAL_ITEMS = [
    {
        id: "recent-workspaces",
        labelKey: "recentWorkspaces"
    }
];
// ── Workspace / org-management items ──────────────────────────────────────
const WORKSPACE_NAV_ITEMS = [
    {
        id: "home",
        tabKey: "Overview",
        fallbackLabel: "Home"
    },
    {
        id: "recent",
        tabKey: "Recent",
        fallbackLabel: "Recent"
    },
    {
        id: "favorites",
        tabKey: "Favorites",
        fallbackLabel: "Favorites"
    },
    {
        id: "workspace-modules",
        tabKey: "workspaceModules",
        fallbackLabel: "Workspace Modules"
    },
    {
        id: "spaces",
        tabKey: "Spaces",
        fallbackLabel: "Spaces"
    },
    {
        id: "docs",
        tabKey: "Docs",
        fallbackLabel: "Docs"
    },
    {
        id: "wiki",
        tabKey: "Wiki",
        fallbackLabel: "WorkSpace Wiki-Beta"
    },
    {
        id: "meeting-notes",
        tabKey: "Meeting Notes",
        fallbackLabel: "Meeting Notes"
    },
    {
        id: "sop",
        tabKey: "SOP",
        fallbackLabel: "SOP"
    },
    {
        id: "engineering",
        tabKey: "Engineering",
        fallbackLabel: "Engineering"
    },
    {
        id: "product",
        tabKey: "Product",
        fallbackLabel: "Product"
    },
    {
        id: "design",
        tabKey: "Design",
        fallbackLabel: "Design"
    },
    {
        id: "databases",
        tabKey: "Databases",
        fallbackLabel: "Databases"
    },
    {
        id: "projects",
        tabKey: "Projects",
        fallbackLabel: "Projects"
    },
    {
        id: "roadmap",
        tabKey: "Roadmap",
        fallbackLabel: "Roadmap"
    },
    {
        id: "notes",
        tabKey: "Notes",
        fallbackLabel: "Notes"
    },
    {
        id: "documents",
        tabKey: "Documents",
        fallbackLabel: "Documents"
    },
    {
        id: "assets",
        tabKey: "Assets",
        fallbackLabel: "Assets"
    },
    {
        id: "crm",
        tabKey: "CRM",
        fallbackLabel: "CRM"
    },
    {
        id: "files",
        tabKey: "Files",
        fallbackLabel: "Files"
    },
    {
        id: "tags",
        tabKey: "Tags",
        fallbackLabel: "Tags"
    },
    {
        id: "templates",
        tabKey: "Templates",
        fallbackLabel: "Templates"
    },
    {
        id: "members",
        tabKey: "Members",
        fallbackLabel: "Members"
    },
    {
        id: "trash",
        tabKey: "Trash",
        fallbackLabel: "Trash"
    },
    {
        id: "daily",
        tabKey: "Daily",
        fallbackLabel: "Daily"
    },
    {
        id: "schedule",
        tabKey: "Schedule",
        fallbackLabel: "Schedule"
    },
    {
        id: "audit",
        tabKey: "Audit",
        fallbackLabel: "Audit"
    }
];
const ORGANIZATION_NAV_ITEMS = [
    {
        id: "teams",
        zhLabel: "團隊",
        enLabel: "Teams"
    },
    {
        id: "permissions",
        zhLabel: "權限",
        enLabel: "Permissions"
    },
    {
        id: "workspaces",
        zhLabel: "工作區",
        enLabel: "Workspaces"
    }
];
const DIALOG_TEXT = {
    zh: {
        title: "Customize navigation",
        description: "已勾選項目會固定顯示於側欄。此設定僅影響你自己的介面，不會影響其他成員。",
        sectionPersonal: "個人",
        sectionWorkspace: "工作區",
        sectionOrganization: "組織管理",
        sectionDisplay: "顯示設定",
        limitedLabel: "側欄僅顯示固定數量的最近工作區",
        limitedInputLabel: "工作區數量",
        done: "完成",
        recentWorkspaces: "最近工作區"
    },
    en: {
        title: "Customize navigation",
        description: "Checked items stay visible in your sidebar. This setting is personal and does not affect other members.",
        sectionPersonal: "Personal",
        sectionWorkspace: "Workspace",
        sectionOrganization: "Organization",
        sectionDisplay: "Display",
        limitedLabel: "Show a limited number of recent workspaces in sidebar",
        limitedInputLabel: "Number of workspaces",
        done: "Done",
        recentWorkspaces: "Recent workspaces"
    }
};
const DEFAULT_PREFS = {
    pinnedPersonal: [
        "recent-workspaces"
    ],
    pinnedWorkspace: [
        ...WORKSPACE_NAV_ITEMS.map((item)=>item.id),
        ...ORGANIZATION_NAV_ITEMS.map((item)=>item.id)
    ],
    showLimitedWorkspaces: true,
    maxWorkspaces: 10,
    workspaceOrder: WORKSPACE_NAV_ITEMS.map((item)=>item.id)
};
const VALID_PERSONAL_ITEM_IDS = new Set(PERSONAL_ITEMS.map((item)=>item.id));
const VALID_WORKSPACE_ITEM_IDS = new Set([
    ...WORKSPACE_NAV_ITEMS.map((item)=>item.id),
    ...ORGANIZATION_NAV_ITEMS.map((item)=>item.id)
]);
const VALID_WORKSPACE_ORDER_IDS = new Set(WORKSPACE_NAV_ITEMS.map((item)=>item.id));
function normalizePinnedIds(ids, validSet, fallback) {
    if (!Array.isArray(ids)) {
        return fallback;
    }
    const normalized = ids.filter((id)=>typeof id === "string").filter((id)=>validSet.has(id));
    return normalized.length > 0 ? Array.from(new Set(normalized)) : fallback;
}
function normalizeWorkspaceOrder(order) {
    const fallback = DEFAULT_PREFS.workspaceOrder;
    if (!Array.isArray(order)) {
        return fallback;
    }
    const validOrder = order.filter((id)=>typeof id === "string").filter((id)=>VALID_WORKSPACE_ORDER_IDS.has(id));
    const deduped = Array.from(new Set(validOrder));
    for (const id of fallback){
        if (!deduped.includes(id)) {
            deduped.push(id);
        }
    }
    return deduped;
}
function readNavPreferences() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_PREFS;
        const parsed = JSON.parse(raw);
        return {
            pinnedPersonal: normalizePinnedIds(parsed.pinnedPersonal, VALID_PERSONAL_ITEM_IDS, DEFAULT_PREFS.pinnedPersonal),
            pinnedWorkspace: normalizePinnedIds(parsed.pinnedWorkspace, VALID_WORKSPACE_ITEM_IDS, DEFAULT_PREFS.pinnedWorkspace),
            showLimitedWorkspaces: parsed.showLimitedWorkspaces ?? DEFAULT_PREFS.showLimitedWorkspaces,
            maxWorkspaces: typeof parsed.maxWorkspaces === "number" ? parsed.maxWorkspaces : DEFAULT_PREFS.maxWorkspaces,
            workspaceOrder: normalizeWorkspaceOrder(parsed.workspaceOrder)
        };
    } catch  {
        return DEFAULT_PREFS;
    }
}
function writeNavPreferences(prefs) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
function CheckRow({ id, label, checked, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                className: "size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 231,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                id: `nav-check-${id}`,
                checked: checked,
                onCheckedChange: onToggle,
                className: "shrink-0"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                htmlFor: `nav-check-${id}`,
                className: "cursor-pointer select-none text-sm font-normal",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_c = CheckRow;
function WorkspaceCheckRow({ id, label, checked, activeDropEdge, isDropTarget, onToggle, onDragOverItem, onDragLeaveItem, onReorder }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspaceCheckRow.useEffect": ()=>{
            const element = ref.current;
            if (!element) {
                return;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$combine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["combine"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["draggable"])({
                element,
                getInitialData: {
                    "WorkspaceCheckRow.useEffect": ()=>({
                            type: "workspace-nav-item",
                            itemId: id
                        })
                }["WorkspaceCheckRow.useEffect"]
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropTargetForElements"])({
                element,
                canDrop: {
                    "WorkspaceCheckRow.useEffect": ({ source })=>{
                        return source.data.type === "workspace-nav-item" && source.data.itemId !== id;
                    }
                }["WorkspaceCheckRow.useEffect"],
                getData: {
                    "WorkspaceCheckRow.useEffect": ({ input, element: dropElement })=>{
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attachClosestEdge"])({
                            type: "workspace-nav-item",
                            itemId: id
                        }, {
                            input,
                            element: dropElement,
                            allowedEdges: [
                                "top",
                                "bottom"
                            ]
                        });
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDragEnter: {
                    "WorkspaceCheckRow.useEffect": ({ self })=>{
                        onDragOverItem(id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractClosestEdge"])(self.data));
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDrag: {
                    "WorkspaceCheckRow.useEffect": ({ self })=>{
                        onDragOverItem(id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractClosestEdge"])(self.data));
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDragLeave: {
                    "WorkspaceCheckRow.useEffect": ()=>{
                        onDragLeaveItem(id);
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDrop: {
                    "WorkspaceCheckRow.useEffect": ({ source, self })=>{
                        const sourceId = typeof source.data.itemId === "string" ? source.data.itemId : null;
                        if (!sourceId || sourceId === id) {
                            onDragLeaveItem(id);
                            return;
                        }
                        onReorder(sourceId, id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractClosestEdge"])(self.data));
                        onDragLeaveItem(id);
                    }
                }["WorkspaceCheckRow.useEffect"]
            }));
        }
    }["WorkspaceCheckRow.useEffect"], [
        id,
        onDragLeaveItem,
        onDragOverItem,
        onReorder
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                        className: "size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        id: `nav-check-${id}`,
                        checked: checked,
                        onCheckedChange: onToggle,
                        className: "shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                        htmlFor: `nav-check-${id}`,
                        className: "cursor-pointer select-none text-sm font-normal",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            isDropTarget && activeDropEdge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$react$2d$drop$2d$indicator$2f$dist$2f$esm$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropIndicator"], {
                    edge: activeDropEdge
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 347,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 346,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
        lineNumber: 328,
        columnNumber: 5
    }, this);
}
_s(WorkspaceCheckRow, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c1 = WorkspaceCheckRow;
function CustomizeNavigationDialog({ open, onOpenChange, onPreferencesChange }) {
    _s1();
    const [prefs, setPrefs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CustomizeNavigationDialog.useState": ()=>readNavPreferences()
    }["CustomizeNavigationDialog.useState"]);
    const [dragTarget, setDragTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const uiLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CustomizeNavigationDialog.useMemo[uiLocale]": ()=>{
            if (typeof navigator === "undefined") {
                return "zh";
            }
            const language = navigator.language?.toLowerCase() ?? "";
            return language.startsWith("zh") ? "zh" : "en";
        }
    }["CustomizeNavigationDialog.useMemo[uiLocale]"], []);
    const [localeBundle, setLocaleBundle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomizeNavigationDialog.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const localeFile = uiLocale === "zh" ? "/localized-files/zh-TW.json" : "/localized-files/en.json";
            let canceled = false;
            fetch(localeFile).then({
                "CustomizeNavigationDialog.useEffect": (res)=>{
                    if (!res.ok) {
                        throw new Error(`Failed to load locale file: ${res.status}`);
                    }
                    return res.json();
                }
            }["CustomizeNavigationDialog.useEffect"]).then({
                "CustomizeNavigationDialog.useEffect": (json)=>{
                    if (!canceled) {
                        setLocaleBundle(json);
                    }
                }
            }["CustomizeNavigationDialog.useEffect"]).catch({
                "CustomizeNavigationDialog.useEffect": ()=>{
                    if (!canceled) {
                        setLocaleBundle(null);
                    }
                }
            }["CustomizeNavigationDialog.useEffect"]);
            return ({
                "CustomizeNavigationDialog.useEffect": ()=>{
                    canceled = true;
                }
            })["CustomizeNavigationDialog.useEffect"];
        }
    }["CustomizeNavigationDialog.useEffect"], [
        uiLocale
    ]);
    const text = DIALOG_TEXT[uiLocale];
    const workspaceItemsById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CustomizeNavigationDialog.useMemo[workspaceItemsById]": ()=>Object.fromEntries(WORKSPACE_NAV_ITEMS.map({
                "CustomizeNavigationDialog.useMemo[workspaceItemsById]": (item)=>[
                        item.id,
                        item
                    ]
            }["CustomizeNavigationDialog.useMemo[workspaceItemsById]"]))
    }["CustomizeNavigationDialog.useMemo[workspaceItemsById]"], []);
    const orderedWorkspaceItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]": ()=>{
            return prefs.workspaceOrder.map({
                "CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]": (id)=>workspaceItemsById[id]
            }["CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]"]).filter({
                "CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]": (item)=>item != null
            }["CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]"]);
        }
    }["CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]"], [
        prefs.workspaceOrder,
        workspaceItemsById
    ]);
    const getWorkspaceLabel = (item)=>{
        return localeBundle?.workspace?.tabLabels?.[item.tabKey] ?? item.fallbackLabel;
    };
    const getOrganizationLabel = (item)=>{
        return uiLocale === "zh" ? item.zhLabel : item.enLabel;
    };
    function updatePrefs(update) {
        const next = {
            ...prefs,
            ...update
        };
        writeNavPreferences(next);
        setPrefs(next);
        onPreferencesChange?.(next);
    }
    function togglePersonal(id) {
        const next = prefs.pinnedPersonal.includes(id) ? prefs.pinnedPersonal.filter((x)=>x !== id) : [
            ...prefs.pinnedPersonal,
            id
        ];
        updatePrefs({
            pinnedPersonal: next
        });
    }
    function toggleWorkspace(id) {
        const next = prefs.pinnedWorkspace.includes(id) ? prefs.pinnedWorkspace.filter((x)=>x !== id) : [
            ...prefs.pinnedWorkspace,
            id
        ];
        updatePrefs({
            pinnedWorkspace: next
        });
    }
    function reorderWorkspaceItems(sourceId, targetId, edge) {
        const startIndex = prefs.workspaceOrder.indexOf(sourceId);
        const targetIndex = prefs.workspaceOrder.indexOf(targetId);
        if (startIndex === -1 || targetIndex === -1) {
            return;
        }
        const destinationIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
        const nextOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$reorder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reorder"])({
            list: prefs.workspaceOrder,
            startIndex,
            finishIndex: destinationIndex
        });
        updatePrefs({
            workspaceOrder: nextOrder
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-h-[85vh] overflow-y-auto sm:max-w-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: text.title
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 473,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: text.description
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 474,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 472,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-2 space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionPersonal
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 479,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50",
                            children: PERSONAL_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckRow, {
                                    id: item.id,
                                    label: text[item.labelKey],
                                    checked: prefs.pinnedPersonal.includes(item.id),
                                    onToggle: ()=>{
                                        togglePersonal(item.id);
                                    }
                                }, item.id, false, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 484,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 482,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 478,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                    className: "my-2"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 497,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionWorkspace
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 501,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50",
                            children: orderedWorkspaceItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkspaceCheckRow, {
                                    id: item.id,
                                    label: getWorkspaceLabel(item),
                                    checked: prefs.pinnedWorkspace.includes(item.id),
                                    isDropTarget: dragTarget?.id === item.id,
                                    activeDropEdge: dragTarget?.id === item.id ? dragTarget.edge : null,
                                    onToggle: ()=>{
                                        toggleWorkspace(item.id);
                                    },
                                    onDragOverItem: (targetId, edge)=>{
                                        setDragTarget({
                                            id: targetId,
                                            edge
                                        });
                                    },
                                    onDragLeaveItem: (targetId)=>{
                                        setDragTarget((current)=>current?.id === targetId ? null : current);
                                    },
                                    onReorder: reorderWorkspaceItems
                                }, item.id, false, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 506,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 504,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 500,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                    className: "my-2"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 528,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionOrganization
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 532,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50",
                            children: ORGANIZATION_NAV_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckRow, {
                                    id: item.id,
                                    label: getOrganizationLabel(item),
                                    checked: prefs.pinnedWorkspace.includes(item.id),
                                    onToggle: ()=>{
                                        toggleWorkspace(item.id);
                                    }
                                }, item.id, false, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 537,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 535,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 531,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                    className: "my-2"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 550,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionDisplay
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 554,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50 px-4 py-3 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                            id: "nav-limit-workspaces",
                                            checked: prefs.showLimitedWorkspaces,
                                            onCheckedChange: (checked)=>{
                                                updatePrefs({
                                                    showLimitedWorkspaces: Boolean(checked)
                                                });
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 561,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "nav-limit-workspaces",
                                            className: "cursor-pointer text-sm font-medium",
                                            children: text.limitedLabel
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 568,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 560,
                                    columnNumber: 13
                                }, this),
                                prefs.showLimitedWorkspaces && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 pl-7",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "nav-max-workspaces",
                                            className: "text-xs text-muted-foreground",
                                            children: text.limitedInputLabel
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 574,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "nav-max-workspaces",
                                            type: "number",
                                            min: 1,
                                            max: 50,
                                            value: prefs.maxWorkspaces,
                                            onChange: (e)=>{
                                                const val = parseInt(e.target.value, 10);
                                                if (!isNaN(val) && val >= 1) {
                                                    updatePrefs({
                                                        maxWorkspaces: Math.min(val, 50)
                                                    });
                                                }
                                            },
                                            className: "w-full"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 577,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 573,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 559,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 553,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end pt-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        onClick: ()=>{
                            onOpenChange(false);
                        },
                        children: text.done
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 598,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 597,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
            lineNumber: 471,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
        lineNumber: 470,
        columnNumber: 5
    }, this);
}
_s1(CustomizeNavigationDialog, "ricU83cylus+Fiy8S+xyzSmiDE0=");
_c2 = CustomizeNavigationDialog;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CheckRow");
__turbopack_context__.k.register(_c1, "WorkspaceCheckRow");
__turbopack_context__.k.register(_c2, "CustomizeNavigationDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/dashboard-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardSidebar",
    ()=>DashboardSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list.  Top-level section navigation is in AppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.js [app-client] (ecmascript) <export default as PanelLeftClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.js [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/workspace-tabs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/firestore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$customize$2d$navigation$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/customize-navigation-dialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const ORGANIZATION_MANAGEMENT_ITEMS = [];
const ACCOUNT_NAV_ITEMS = [
    {
        id: "schedule",
        label: "排程",
        href: "/organization/schedule"
    },
    {
        id: "dispatcher",
        label: "調度台",
        href: "/organization/schedule/dispatcher"
    },
    {
        id: "daily",
        label: "每日",
        href: "/organization/daily"
    },
    {
        id: "audit",
        label: "稽核",
        href: "/organization/audit"
    }
];
const ACCOUNT_SECTION_MATCHERS = [
    "/organization/daily",
    "/organization/schedule",
    "/organization/audit"
];
const MAX_VISIBLE_RECENT_WORKSPACES = 10;
const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";
function createWorkspaceLinkItems(group) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabsByGroup"])(group).map((value)=>({
            value,
            label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabLabel"])(value)
        }));
}
const WORKSPACE_PRIMARY_LINK_ITEMS = createWorkspaceLinkItems("primary");
const WORKSPACE_SPACE_ITEMS = createWorkspaceLinkItems("spaces");
const WORKSPACE_DATABASE_ITEMS = createWorkspaceLinkItems("databases");
const WORKSPACE_LIBRARY_LINK_ITEMS = createWorkspaceLinkItems("library");
const WORKSPACE_MODULE_LINK_ITEMS = createWorkspaceLinkItems("modules");
function getStorageKey(accountId) {
    return `${RECENT_WORKSPACES_STORAGE_PREFIX}${accountId}`;
}
function readRecentWorkspaceIds(accountId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(getStorageKey(accountId));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item)=>typeof item === "string" && item.length > 0);
    } catch  {
        return [];
    }
}
function persistRecentWorkspaceIds(accountId, workspaceIds) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(workspaceIds));
}
function trackWorkspaceFromPath(pathname, accountId) {
    const match = pathname.match(/^\/workspace\/([^/]+)/);
    if (!match) return;
    const workspaceId = decodeURIComponent(match[1]);
    const recentIds = readRecentWorkspaceIds(accountId);
    const deduped = [
        workspaceId,
        ...recentIds.filter((id)=>id !== workspaceId)
    ].slice(0, 50);
    persistRecentWorkspaceIds(accountId, deduped);
}
function getWorkspaceIdFromPath(pathname) {
    const match = pathname.match(/^\/workspace\/([^/]+)/);
    if (!match) return null;
    return decodeURIComponent(match[1]);
}
function resolveNavSection(pathname) {
    if (pathname.startsWith("/workspace") || pathname.startsWith("/dashboard")) return "workspace";
    if (pathname.startsWith("/wiki-beta")) return "wiki-beta";
    if (pathname.startsWith("/ai-chat")) return "ai-chat";
    if (ACCOUNT_SECTION_MATCHERS.some((prefix)=>pathname === prefix || pathname.startsWith(`${prefix}/`))) return "account";
    if (pathname.startsWith("/organization")) return "organization";
    if (pathname.startsWith("/settings")) return "settings";
    return "other";
}
// ── Section icon labels for the title bar ────────────────────────────────────
const SECTION_TITLES = {
    workspace: {
        label: "工作區",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 139,
            columnNumber: 36
        }, ("TURBOPACK compile-time value", void 0))
    },
    "wiki-beta": {
        label: "Account Wiki-Beta",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 140,
            columnNumber: 52
        }, ("TURBOPACK compile-time value", void 0))
    },
    "ai-chat": {
        label: "AI Chat",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 141,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0))
    },
    account: {
        label: "Account",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 142,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    organization: {
        label: "組織",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 143,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    settings: {
        label: "設定",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 144,
            columnNumber: 34
        }, ("TURBOPACK compile-time value", void 0))
    },
    other: {
        label: "導覽",
        icon: null
    }
};
function isActiveOrganizationAccount(activeAccount) {
    return activeAccount != null && "accountType" in activeAccount && activeAccount.accountType === "organization";
}
function DashboardSidebar({ pathname, activeAccount, workspaces, workspacesHydrated, activeWorkspaceId, collapsed, onToggleCollapsed, onSelectWorkspace }) {
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isWikiBetaWorkspacesExpanded, setIsWikiBetaWorkspacesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wikiBetaQuickCreateOpen, setWikiBetaQuickCreateOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [creatingKind, setCreatingKind] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isWorkspaceSpacesExpanded, setIsWorkspaceSpacesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isWorkspaceDatabasesExpanded, setIsWorkspaceDatabasesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isWorkspaceModulesExpanded, setIsWorkspaceModulesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [navPrefs, setNavPrefs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DashboardSidebar.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$customize$2d$navigation$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readNavPreferences"])()
    }["DashboardSidebar.useState"]);
    const [customizeOpen, setCustomizeOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localeBundle, setLocaleBundle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    function toggleCollapsed() {
        onToggleCollapsed();
    }
    const showAccountManagement = isActiveOrganizationAccount(activeAccount);
    const visibleOrganizationManagementItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[visibleOrganizationManagementItems]": ()=>{
            return ORGANIZATION_MANAGEMENT_ITEMS.filter({
                "DashboardSidebar.useMemo[visibleOrganizationManagementItems]": (item)=>navPrefs.pinnedWorkspace.includes(item.id)
            }["DashboardSidebar.useMemo[visibleOrganizationManagementItems]"]);
        }
    }["DashboardSidebar.useMemo[visibleOrganizationManagementItems]"], [
        navPrefs.pinnedWorkspace
    ]);
    const visibleAccountItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[visibleAccountItems]": ()=>{
            return ACCOUNT_NAV_ITEMS.filter({
                "DashboardSidebar.useMemo[visibleAccountItems]": (item)=>navPrefs.pinnedWorkspace.includes(item.id)
            }["DashboardSidebar.useMemo[visibleAccountItems]"]);
        }
    }["DashboardSidebar.useMemo[visibleAccountItems]"], [
        navPrefs.pinnedWorkspace
    ]);
    // Whether to show recent workspaces section (controlled by personal prefs)
    const showRecentWorkspaces = navPrefs.pinnedPersonal.includes("recent-workspaces");
    // Max workspaces to show (apply user preference)
    const effectiveMaxWorkspaces = navPrefs.showLimitedWorkspaces ? navPrefs.maxWorkspaces : MAX_VISIBLE_RECENT_WORKSPACES;
    function isActiveRoute(href) {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    // Track recently visited workspaces in localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardSidebar.useEffect": ()=>{
            const accountId = activeAccount?.id;
            if (!accountId) return;
            trackWorkspaceFromPath(pathname, accountId);
        }
    }["DashboardSidebar.useEffect"], [
        activeAccount?.id,
        pathname
    ]);
    const workspacesById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[workspacesById]": ()=>Object.fromEntries(workspaces.map({
                "DashboardSidebar.useMemo[workspacesById]": (workspace)=>[
                        workspace.id,
                        workspace
                    ]
            }["DashboardSidebar.useMemo[workspacesById]"]))
    }["DashboardSidebar.useMemo[workspacesById]"], [
        workspaces
    ]);
    const recentWorkspaceIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[recentWorkspaceIds]": ()=>{
            const accountId = activeAccount?.id;
            if (!accountId) return [];
            const stored = readRecentWorkspaceIds(accountId);
            const currentId = getWorkspaceIdFromPath(pathname);
            if (!currentId) return stored;
            return [
                currentId,
                ...stored.filter({
                    "DashboardSidebar.useMemo[recentWorkspaceIds]": (id)=>id !== currentId
                }["DashboardSidebar.useMemo[recentWorkspaceIds]"])
            ];
        }
    }["DashboardSidebar.useMemo[recentWorkspaceIds]"], [
        activeAccount?.id,
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardSidebar.useEffect": ()=>{
            const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
            if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
                onSelectWorkspace(pathWorkspaceId);
                return;
            }
            if (("TURBOPACK compile-time value", "object") === "undefined" || !pathname.startsWith("/wiki-beta")) {
                return;
            }
            const searchWorkspaceId = new URLSearchParams(window.location.search).get("workspaceId")?.trim() || "";
            if (searchWorkspaceId && searchWorkspaceId !== activeWorkspaceId) {
                onSelectWorkspace(searchWorkspaceId);
            }
        }
    }["DashboardSidebar.useEffect"], [
        pathname,
        activeWorkspaceId,
        onSelectWorkspace
    ]);
    const recentWorkspaceLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[recentWorkspaceLinks]": ()=>{
            return recentWorkspaceIds.map({
                "DashboardSidebar.useMemo[recentWorkspaceLinks]": (workspaceId)=>{
                    const ws = workspacesById[workspaceId];
                    if (!ws) return null;
                    return {
                        id: ws.id,
                        name: ws.name,
                        href: `/workspace/${ws.id}`
                    };
                }
            }["DashboardSidebar.useMemo[recentWorkspaceLinks]"]).filter({
                "DashboardSidebar.useMemo[recentWorkspaceLinks]": (item)=>item !== null
            }["DashboardSidebar.useMemo[recentWorkspaceLinks]"]);
        }
    }["DashboardSidebar.useMemo[recentWorkspaceLinks]"], [
        recentWorkspaceIds,
        workspacesById
    ]);
    const hasOverflow = recentWorkspaceLinks.length > effectiveMaxWorkspaces;
    const visibleRecentWorkspaceLinks = isExpanded ? recentWorkspaceLinks : recentWorkspaceLinks.slice(0, effectiveMaxWorkspaces);
    const buildWorkspaceContextHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardSidebar.useCallback[buildWorkspaceContextHref]": (workspaceId)=>{
            if (pathname.startsWith("/wiki-beta")) {
                const targetPath = pathname === "/wiki-beta" ? "/wiki-beta/documents" : pathname;
                return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
            }
            return `/workspace/${workspaceId}`;
        }
    }["DashboardSidebar.useCallback[buildWorkspaceContextHref]"], [
        pathname
    ]);
    const allWorkspaceLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[allWorkspaceLinks]": ()=>{
            return Object.values(workspacesById).map({
                "DashboardSidebar.useMemo[allWorkspaceLinks]": (workspace)=>({
                        id: workspace.id,
                        name: workspace.name,
                        href: buildWorkspaceContextHref(workspace.id)
                    })
            }["DashboardSidebar.useMemo[allWorkspaceLinks]"]).sort({
                "DashboardSidebar.useMemo[allWorkspaceLinks]": (a, b)=>a.name.localeCompare(b.name, "zh-Hant")
            }["DashboardSidebar.useMemo[allWorkspaceLinks]"]);
        }
    }["DashboardSidebar.useMemo[allWorkspaceLinks]"], [
        workspacesById,
        buildWorkspaceContextHref
    ]);
    const section = resolveNavSection(pathname);
    const sectionMeta = SECTION_TITLES[section];
    const workspacePathId = getWorkspaceIdFromPath(pathname);
    const rawWorkspaceTab = searchParams.get("tab") ?? "Overview";
    const activeWorkspaceTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWorkspaceTabValue"])(rawWorkspaceTab) ? rawWorkspaceTab : "Overview";
    function buildWorkspaceTabHref(workspaceId, tab) {
        return `/workspace/${workspaceId}?tab=${encodeURIComponent(tab)}`;
    }
    function tWorkspaceTab(tab, fallback) {
        return localeBundle?.workspace?.tabLabels?.[tab] ?? fallback;
    }
    function tWorkspaceTabWithDevStatus(tab, fallback) {
        if (tab === "Wiki") {
            const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabStatus"])(tab);
            return `${status} WorkSpace Wiki-Beta`;
        }
        const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabStatus"])(tab);
        return `${status} ${tWorkspaceTab(tab, fallback)}`;
    }
    function tWorkspaceGroup(groupKey, fallback) {
        return localeBundle?.workspace?.groups?.[groupKey] ?? fallback;
    }
    function getWorkspacePrefId(tabValue) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWorkspaceTabValue"])(tabValue)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabPrefId"])(tabValue);
        }
        return tabValue.toLowerCase().replace(/\s+/g, "-");
    }
    function isWorkspaceItemEnabled(prefId) {
        return navPrefs.pinnedWorkspace.includes(prefId);
    }
    function getWorkspaceItemOrder(prefId) {
        const index = navPrefs.workspaceOrder.indexOf(prefId);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    }
    function sortWorkspaceItemsByPreferenceOrder(items) {
        return [
            ...items
        ].sort((left, right)=>getWorkspaceItemOrder(getWorkspacePrefId(left.value)) - getWorkspaceItemOrder(getWorkspacePrefId(right.value)));
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardSidebar.useEffect": ()=>{
            let cancelled = false;
            async function loadSidebarLocale() {
                const isZhHant = typeof navigator !== "undefined" && /^(zh-TW|zh-HK|zh-MO|zh-Hant)/i.test(navigator.language);
                const localeFile = isZhHant ? "zh-TW.json" : "en.json";
                try {
                    const response = await fetch(`/localized-files/${localeFile}`, {
                        cache: "no-store"
                    });
                    if (!response.ok) return;
                    const data = await response.json();
                    if (!cancelled) {
                        setLocaleBundle(data);
                    }
                } catch  {
                // Keep fallback labels when localization files are unavailable.
                }
            }
            void loadSidebarLocale();
            return ({
                "DashboardSidebar.useEffect": ()=>{
                    cancelled = true;
                }
            })["DashboardSidebar.useEffect"];
        }
    }["DashboardSidebar.useEffect"], []);
    async function handleWikiBetaQuickCreate(kind) {
        const accountId = activeAccount?.id ?? "";
        if (!accountId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("目前沒有 active account，無法建立");
            return;
        }
        setCreatingKind(kind);
        try {
            const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
            const collectionName = kind === "page" ? "pages" : "databases";
            const baseTitle = kind === "page" ? "未命名頁面" : "未命名資料庫";
            const payload = {
                title: baseTitle,
                kind,
                accountId,
                createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].serverTimestamp(),
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].serverTimestamp()
            };
            if (activeWorkspaceId) {
                payload.spaceId = activeWorkspaceId;
            }
            if (kind === "database") {
                payload.template = "task-governance";
                payload.metadata = {
                    model: [
                        "tasks",
                        "task_dependencies",
                        "skills",
                        "task_skill_thresholds"
                    ],
                    description: "任務依賴與技能門檻分類模板"
                };
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].addDoc(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].collection(db, "accounts", accountId, collectionName), payload);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(kind === "page" ? "已建立頁面" : "已建立資料庫");
            setWikiBetaQuickCreateOpen(false);
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(kind === "page" ? "建立頁面失敗" : "建立資料庫失敗");
        } finally{
            setCreatingKind(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                "aria-label": "Secondary navigation",
                className: `hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex ${collapsed ? "w-0" : "w-52 border-r border-border/50 bg-card/30"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 items-center border-b border-border/40 px-2 py-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex flex-1 items-center gap-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                    children: [
                                        sectionMeta.icon,
                                        sectionMeta.label
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 425,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-0.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            title: "設定",
                                            "aria-label": "設定",
                                            onClick: ()=>{
                                                setCustomizeOpen(true);
                                            },
                                            className: "flex size-5 items-center justify-center rounded text-muted-foreground/70 transition hover:bg-muted hover:text-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                className: "size-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 431,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: toggleCollapsed,
                                            "aria-label": "收起側欄",
                                            title: "收起側欄",
                                            className: "flex size-5 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__["PanelLeftClose"], {
                                                className: "size-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 449,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 442,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 430,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto px-3 py-3",
                            children: [
                                section === "account" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        showAccountManagement && visibleAccountItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                            className: "space-y-0.5",
                                            "aria-label": "Account navigation",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                                    children: "Account"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 21
                                                }, this),
                                                visibleAccountItems.map((item)=>{
                                                    const active = isActiveRoute(item.href);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        "aria-current": active ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: item.label
                                                    }, item.href, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 466,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 459,
                                            columnNumber: 19
                                        }, this),
                                        !showAccountManagement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "px-2 py-4 text-[11px] text-muted-foreground",
                                            children: "請切換到組織帳號以查看 Account 選項。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 483,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true),
                                section === "organization" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        showAccountManagement && visibleOrganizationManagementItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                            className: "space-y-0.5",
                                            "aria-label": "Organization management",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                                    children: "組織管理"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 494,
                                                    columnNumber: 21
                                                }, this),
                                                visibleOrganizationManagementItems.map((item)=>{
                                                    const active = isActiveRoute(item.href);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        "aria-current": active ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: item.label
                                                    }, item.href, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 500,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 493,
                                            columnNumber: 19
                                        }, this),
                                        !showAccountManagement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "px-2 py-4 text-[11px] text-muted-foreground",
                                            children: "請切換到組織帳號以查看管理選項。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 517,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true),
                                section === "workspace" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: workspacePathId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        className: "space-y-3",
                                        "aria-label": "Workspace navigation",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_PRIMARY_LINK_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                    const isActive = activeWorkspaceTab === item.value;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                        "aria-current": isActive ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                    }, item.value, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 528,
                                                columnNumber: 21
                                            }, this),
                                            isWorkspaceItemEnabled("workspace-modules") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "my-1.5 border-t border-border/40"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 551,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: isWorkspaceItemEnabled("workspace-modules") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setIsWorkspaceModulesExpanded((prev)=>!prev);
                                                            },
                                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                                            "aria-expanded": isWorkspaceModulesExpanded,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: tWorkspaceGroup("workspaceModules", "Workspace Modules")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 565,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isWorkspaceModulesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 566,
                                                                    columnNumber: 59
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 566,
                                                                    columnNumber: 98
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 27
                                                        }, this),
                                                        isWorkspaceModulesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5 pl-2",
                                                            children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_MODULE_LINK_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                                const isActive = activeWorkspaceTab === item.value;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                                    "aria-current": isActive ? "page" : undefined,
                                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                                    children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                                }, item.value, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 576,
                                                                    columnNumber: 35
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 554,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: isWorkspaceItemEnabled("spaces") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setIsWorkspaceSpacesExpanded((prev)=>!prev);
                                                            },
                                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                                            "aria-expanded": isWorkspaceSpacesExpanded,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: tWorkspaceGroup("spaces", "Spaces")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 607,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isWorkspaceSpacesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 608,
                                                                    columnNumber: 58
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 608,
                                                                    columnNumber: 97
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 599,
                                                            columnNumber: 27
                                                        }, this),
                                                        isWorkspaceSpacesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5 pl-2",
                                                            children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_SPACE_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                                const isActive = activeWorkspaceTab === item.value;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                                    "aria-current": isActive ? "page" : undefined,
                                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                                    children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                                }, item.value, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 618,
                                                                    columnNumber: 35
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 612,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 596,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: isWorkspaceItemEnabled("databases") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setIsWorkspaceDatabasesExpanded((prev)=>!prev);
                                                            },
                                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                                            "aria-expanded": isWorkspaceDatabasesExpanded,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: tWorkspaceGroup("databases", "Databases")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 649,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isWorkspaceDatabasesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 650,
                                                                    columnNumber: 61
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 650,
                                                                    columnNumber: 100
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 641,
                                                            columnNumber: 27
                                                        }, this),
                                                        isWorkspaceDatabasesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5 pl-2",
                                                            children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_DATABASE_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                                const isActive = activeWorkspaceTab === item.value;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                                    "aria-current": isActive ? "page" : undefined,
                                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                                    children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                                }, item.value, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 660,
                                                                    columnNumber: 35
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 638,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_LIBRARY_LINK_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                    const isActive = activeWorkspaceTab === item.value;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                        "aria-current": isActive ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                    }, item.value, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 686,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 680,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                        lineNumber: 527,
                                        columnNumber: 19
                                    }, this) : // ── Workspace hub: show recent workspaces ──────────────
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: showRecentWorkspaces && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-0.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                                    children: "最近工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 708,
                                                    columnNumber: 25
                                                }, this),
                                                visibleRecentWorkspaceLinks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "px-2 py-2 text-[11px] text-muted-foreground",
                                                    children: "尚無最近開啟的工作區。"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 712,
                                                    columnNumber: 27
                                                }, this) : visibleRecentWorkspaceLinks.map((ws)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: ws.href,
                                                        onClick: ()=>{
                                                            onSelectWorkspace(ws.id);
                                                        },
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${activeWorkspaceId === ws.id || isActiveRoute(ws.href) ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted hover:text-foreground"}`,
                                                        title: ws.name,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate",
                                                            children: ws.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 730,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, ws.id, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 717,
                                                        columnNumber: 29
                                                    }, this)),
                                                hasOverflow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        setIsExpanded((prev)=>!prev);
                                                    },
                                                    className: "px-2 py-1 text-[11px] font-medium text-primary hover:underline",
                                                    children: isExpanded ? "收起" : "顯示更多"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 735,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 707,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false)
                                }, void 0, false),
                                section === "wiki-beta" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-0.5",
                                    "aria-label": "Account Wiki-Beta navigation",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                            children: "Account Wiki-Beta"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 754,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/wiki-beta",
                                                label: "知識總覽"
                                            },
                                            {
                                                href: "/wiki-beta/block-editor",
                                                label: "區塊編輯器"
                                            },
                                            {
                                                href: "/wiki-beta/pages-dnd",
                                                label: "頁面 (DnD)"
                                            },
                                            {
                                                href: "/wiki-beta/rag-query",
                                                label: "RAG Query"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 767,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex items-center rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/wiki-beta/documents",
                                                    "aria-current": isActiveRoute("/wiki-beta/documents") ? "page" : undefined,
                                                    className: `flex-1 ${isActiveRoute("/wiki-beta/documents") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
                                                    children: "Documents"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 783,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: (event)=>{
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        setWikiBetaQuickCreateOpen((prev)=>!prev);
                                                    },
                                                    className: "ml-1 inline-flex size-5 items-center justify-center rounded transition hover:bg-muted-foreground/15",
                                                    "aria-label": "快速新增頁面或資料庫",
                                                    title: "快速新增",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "size-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 805,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 19
                                                }, this),
                                                wikiBetaQuickCreateOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-0 top-8 z-10 min-w-36 rounded-md border border-border/60 bg-popover p-1 shadow-md",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void handleWikiBetaQuickCreate("page"),
                                                            disabled: creatingKind !== null,
                                                            className: "flex w-full items-center rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted disabled:opacity-50",
                                                            children: creatingKind === "page" ? "建立中..." : "新增頁面"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 810,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void handleWikiBetaQuickCreate("database"),
                                                            disabled: creatingKind !== null,
                                                            className: "flex w-full items-center rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted disabled:opacity-50",
                                                            children: creatingKind === "database" ? "建立中..." : "新增資料庫"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 818,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 809,
                                                    columnNumber: 21
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 782,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/wiki-beta/pages",
                                                label: "Pages"
                                            },
                                            {
                                                href: "/wiki-beta/libraries",
                                                label: "Libraries"
                                            },
                                            {
                                                href: "/wiki-beta/rag-reindex",
                                                label: "RAG Reindex"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 839,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "my-1.5 border-t border-border/40"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 854,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setIsWikiBetaWorkspacesExpanded((prev)=>!prev);
                                            },
                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                            "aria-expanded": isWikiBetaWorkspacesExpanded,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Workspaces"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 864,
                                                    columnNumber: 19
                                                }, this),
                                                isWikiBetaWorkspacesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: "size-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 865,
                                                    columnNumber: 51
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "size-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 865,
                                                    columnNumber: 90
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 856,
                                            columnNumber: 17
                                        }, this),
                                        isWikiBetaWorkspacesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-0.5 pl-2",
                                            children: !workspacesHydrated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "px-2 py-1.5 text-[11px] text-muted-foreground",
                                                children: "工作區載入中..."
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 871,
                                                columnNumber: 23
                                            }, this) : allWorkspaceLinks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "px-2 py-1.5 text-[11px] text-muted-foreground",
                                                children: "目前帳號沒有工作區"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 873,
                                                columnNumber: 23
                                            }, this) : allWorkspaceLinks.map((workspace)=>{
                                                const active = activeWorkspaceId === workspace.id;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: workspace.href,
                                                    onClick: ()=>{
                                                        onSelectWorkspace(workspace.id);
                                                    },
                                                    "aria-current": active ? "page" : undefined,
                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                    title: workspace.name,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "truncate",
                                                        children: workspace.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 892,
                                                        columnNumber: 29
                                                    }, this)
                                                }, workspace.id, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 878,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 869,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 753,
                                    columnNumber: 15
                                }, this),
                                section === "ai-chat" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-0.5",
                                    "aria-label": "AI Chat navigation",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                            children: "AI Chat"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 904,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/ai-chat",
                                                label: "對話紀錄"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 914,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 903,
                                    columnNumber: 15
                                }, this),
                                section === "settings" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-0.5",
                                    "aria-label": "Settings navigation",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                            children: "個人設定"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 933,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/settings/profile",
                                                label: "個人資料"
                                            },
                                            {
                                                href: "/settings/general",
                                                label: "一般"
                                            },
                                            {
                                                href: "/settings/notifications",
                                                label: "推播通知"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 945,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 932,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                            lineNumber: 455,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                lineNumber: 415,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$customize$2d$navigation$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CustomizeNavigationDialog"], {
                open: customizeOpen,
                onOpenChange: setCustomizeOpen,
                onPreferencesChange: setNavPrefs
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                lineNumber: 965,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_s(DashboardSidebar, "w8Z87pcJZdwzZZcBU1MXpemslrE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = DashboardSidebar;
var _c;
__turbopack_context__.k.register(_c, "DashboardSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/input-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InputGroup",
    ()=>InputGroup,
    "InputGroupAddon",
    ()=>InputGroupAddon,
    "InputGroupButton",
    ()=>InputGroupButton,
    "InputGroupInput",
    ()=>InputGroupInput,
    "InputGroupText",
    ()=>InputGroupText,
    "InputGroupTextarea",
    ()=>InputGroupTextarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/textarea.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function InputGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "input-group",
        role: "group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/input-group.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = InputGroup;
const inputGroupAddonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4", {
    variants: {
        align: {
            "inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
            "inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
            "block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
            "block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
        }
    },
    defaultVariants: {
        align: "inline-start"
    }
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "group",
        "data-slot": "input-group-addon",
        "data-align": align,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(inputGroupAddonVariants({
            align
        }), className),
        onClick: (e)=>{
            if (e.target.closest("button")) {
                return;
            }
            e.currentTarget.parentElement?.querySelector("input")?.focus();
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/input-group.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c1 = InputGroupAddon;
const inputGroupButtonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("flex items-center gap-2 text-sm shadow-none", {
    variants: {
        size: {
            xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
            sm: "",
            "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
            "icon-sm": "size-8 p-0 has-[>svg]:p-0"
        }
    },
    defaultVariants: {
        size: "xs"
    }
});
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        type: type,
        "data-size": size,
        variant: variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(inputGroupButtonVariants({
            size
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/input-group.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c2 = InputGroupButton;
function InputGroupText({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/input-group.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_c3 = InputGroupText;
function InputGroupInput({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
        "data-slot": "input-group-control",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/input-group.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c4 = InputGroupInput;
function InputGroupTextarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
        "data-slot": "input-group-control",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/input-group.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_c5 = InputGroupTextarea;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "InputGroup");
__turbopack_context__.k.register(_c1, "InputGroupAddon");
__turbopack_context__.k.register(_c2, "InputGroupButton");
__turbopack_context__.k.register(_c3, "InputGroupText");
__turbopack_context__.k.register(_c4, "InputGroupInput");
__turbopack_context__.k.register(_c5, "InputGroupTextarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/ui-shadcn/ui/command.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Command",
    ()=>Command,
    "CommandDialog",
    ()=>CommandDialog,
    "CommandEmpty",
    ()=>CommandEmpty,
    "CommandGroup",
    ()=>CommandGroup,
    "CommandInput",
    ()=>CommandInput,
    "CommandItem",
    ()=>CommandItem,
    "CommandList",
    ()=>CommandList,
    "CommandSeparator",
    ()=>CommandSeparator,
    "CommandShortcut",
    ()=>CommandShortcut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cmdk/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as SearchIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
"use client";
;
;
;
;
;
;
function Command({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
        "data-slot": "command",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = Command;
function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, className, showCloseButton = false, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                className: "sr-only",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0", className),
                showCloseButton: showCloseButton,
                children: children
            }, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c1 = CommandDialog;
function CommandInput({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "command-input-wrapper",
        className: "p-1 pb-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroup"], {
            className: "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Input, {
                    "data-slot": "command-input",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className),
                    ...props
                }, void 0, false, {
                    fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputGroupAddon"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__["SearchIcon"], {
                        className: "size-4 shrink-0 opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_c2 = CommandInput;
function CommandList({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].List, {
        "data-slot": "command-list",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_c3 = CommandList;
function CommandEmpty({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Empty, {
        "data-slot": "command-empty",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-6 text-center text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_c4 = CommandEmpty;
function CommandGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Group, {
        "data-slot": "command-group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_c5 = CommandGroup;
function CommandSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Separator, {
        "data-slot": "command-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 h-px bg-border", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_c6 = CommandSeparator;
function CommandItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Item, {
        "data-slot": "command-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                className: "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
            }, void 0, false, {
                fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_c7 = CommandItem;
function CommandShortcut({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "command-shortcut",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/ui-shadcn/ui/command.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
_c8 = CommandShortcut;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "Command");
__turbopack_context__.k.register(_c1, "CommandDialog");
__turbopack_context__.k.register(_c2, "CommandInput");
__turbopack_context__.k.register(_c3, "CommandList");
__turbopack_context__.k.register(_c4, "CommandEmpty");
__turbopack_context__.k.register(_c5, "CommandGroup");
__turbopack_context__.k.register(_c6, "CommandSeparator");
__turbopack_context__.k.register(_c7, "CommandItem");
__turbopack_context__.k.register(_c8, "CommandShortcut");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/global-search-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalSearchDialog",
    ()=>GlobalSearchDialog,
    "useGlobalSearch",
    ()=>useGlobalSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panels-top-left.js [app-client] (ecmascript) <export default as Layout>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/command.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const NAV_ITEMS = [
    {
        href: "/dashboard",
        label: "儀表板",
        group: "導覽"
    },
    {
        href: "/wiki-beta",
        label: "Account Wiki-Beta",
        group: "導覽"
    },
    {
        href: "/wiki-beta/block-editor",
        label: "區塊編輯器",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/pages-dnd",
        label: "頁面樹 (DnD)",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/libraries",
        label: "Libraries 表格",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/rag-query",
        label: "RAG 查詢",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/documents",
        label: "文件管理",
        group: "Wiki-Beta"
    },
    {
        href: "/settings",
        label: "個人設定",
        group: "設定"
    }
];
const GROUP_ICONS = {
    "導覽": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__["Layout"], {
        className: "size-4 mr-2 opacity-60"
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 29,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    "Wiki-Beta": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
        className: "size-4 mr-2 opacity-60"
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 30,
        columnNumber: 16
    }, ("TURBOPACK compile-time value", void 0)),
    "設定": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
        className: "size-4 mr-2 opacity-60"
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 31,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0))
};
function GlobalSearchDialog({ open, onOpenChange }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    function handleSelect(href) {
        onOpenChange(false);
        router.push(href);
    }
    const groups = Array.from(new Set(NAV_ITEMS.map((i)=>i.group)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandDialog"], {
        title: "全域搜尋",
        description: "搜尋頁面或功能",
        open: open,
        onOpenChange: onOpenChange,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                placeholder: "搜尋頁面或功能…"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                        children: "找不到結果。"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    groups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                            heading: group,
                            children: NAV_ITEMS.filter((i)=>i.group === group).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                    onSelect: ()=>handleSelect(item.href),
                                    children: [
                                        GROUP_ICONS[group],
                                        item.label,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandShortcut"], {
                                            className: "text-[10px] opacity-50",
                                            children: item.href
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                                            lineNumber: 68,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, this))
                        }, group, false, {
                            fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(GlobalSearchDialog, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = GlobalSearchDialog;
function useGlobalSearch() {
    _s1();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGlobalSearch.useEffect": ()=>{
            function onKeyDown(event) {
                if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                    event.preventDefault();
                    setOpen({
                        "useGlobalSearch.useEffect.onKeyDown": (prev)=>!prev
                    }["useGlobalSearch.useEffect.onKeyDown"]);
                }
            }
            document.addEventListener("keydown", onKeyDown);
            return ({
                "useGlobalSearch.useEffect": ()=>document.removeEventListener("keydown", onKeyDown)
            })["useGlobalSearch.useEffect"];
        }
    }["useGlobalSearch.useEffect"], []);
    return {
        open,
        setOpen
    };
}
_s1(useGlobalSearch, "e27cRtNMdAs0U0o1oHlS6A8OEBo=");
var _c;
__turbopack_context__.k.register(_c, "GlobalSearchDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseNotificationRepository",
    ()=>FirebaseNotificationRepository
]);
/**
 * FirebaseNotificationRepository — Infrastructure adapter for notifications.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
class FirebaseNotificationRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async dispatch(input) {
        const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), {
            recipientId: input.recipientId,
            title: input.title,
            message: input.message,
            type: input.type,
            read: false,
            timestamp: Date.now(),
            sourceEventType: input.sourceEventType ?? null,
            metadata: input.metadata ?? null,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "notifications", notificationId), {
            read: true
        });
    }
    async markAllAsRead(recipientId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("read", "==", false));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        await Promise.all(snaps.docs.map((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(d.ref, {
                read: true
            })));
    }
    async findByRecipient(recipientId, maxCount = 50) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])("timestamp", "desc"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(maxCount));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
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
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("read", "==", false));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.size;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/notification/interfaces/queries/notification.queries.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNotificationsForRecipient",
    ()=>getNotificationsForRecipient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$infrastructure$2f$firebase$2f$FirebaseNotificationRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts [app-client] (ecmascript)");
;
const notificationRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$infrastructure$2f$firebase$2f$FirebaseNotificationRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseNotificationRepository"]();
async function getNotificationsForRecipient(recipientId, limit = 50) {
    const normalizedRecipientId = recipientId.trim();
    if (!normalizedRecipientId) {
        return [];
    }
    return notificationRepo.findByRecipient(normalizedRecipientId, limit);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/notification/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Module: notification
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Notification domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */ // ─── Core entity types ────────────────────────────────────────────────────────
__turbopack_context__.s([]);
// ─── Query functions ──────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$queries$2f$notification$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/queries/notification.queries.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/notification/interfaces/_actions/data:b33af8 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markAllNotificationsRead",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4022f040e3b75fb00e991105d96de345865740c7d5":"markAllNotificationsRead"},"modules/notification/interfaces/_actions/notification.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4022f040e3b75fb00e991105d96de345865740c7d5", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "markAllNotificationsRead");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90aWZpY2F0aW9uLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogTm90aWZpY2F0aW9uIFNlcnZlciBBY3Rpb25zIOKAlCB0aGluIGFkYXB0ZXIgdG8gdXNlIGNhc2VzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNvbW1hbmRGYWlsdXJlRnJvbSwgdHlwZSBDb21tYW5kUmVzdWx0IH0gZnJvbSBcIkBzaGFyZWQtdHlwZXNcIjtcclxuaW1wb3J0IHtcclxuICBEaXNwYXRjaE5vdGlmaWNhdGlvblVzZUNhc2UsXHJcbiAgTWFya05vdGlmaWNhdGlvblJlYWRVc2VDYXNlLFxyXG4gIE1hcmtBbGxOb3RpZmljYXRpb25zUmVhZFVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9ub3RpZmljYXRpb24udXNlLWNhc2VzXCI7XHJcbmltcG9ydCB7IEZpcmViYXNlTm90aWZpY2F0aW9uUmVwb3NpdG9yeSB9IGZyb20gXCIuLi8uLi9pbmZyYXN0cnVjdHVyZS9maXJlYmFzZS9GaXJlYmFzZU5vdGlmaWNhdGlvblJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHR5cGUgeyBEaXNwYXRjaE5vdGlmaWNhdGlvbklucHV0IH0gZnJvbSBcIi4uLy4uL2RvbWFpbi9lbnRpdGllcy9Ob3RpZmljYXRpb25cIjtcclxuXHJcbmNvbnN0IG5vdGlmaWNhdGlvblJlcG8gPSBuZXcgRmlyZWJhc2VOb3RpZmljYXRpb25SZXBvc2l0b3J5KCk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlzcGF0Y2hOb3RpZmljYXRpb24oXHJcbiAgaW5wdXQ6IERpc3BhdGNoTm90aWZpY2F0aW9uSW5wdXQsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERpc3BhdGNoTm90aWZpY2F0aW9uVXNlQ2FzZShub3RpZmljYXRpb25SZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJOT1RJRklDQVRJT05fRElTUEFUQ0hfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya05vdGlmaWNhdGlvblJlYWQoXHJcbiAgbm90aWZpY2F0aW9uSWQ6IHN0cmluZyxcclxuICByZWNpcGllbnRJZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrTm90aWZpY2F0aW9uUmVhZFVzZUNhc2Uobm90aWZpY2F0aW9uUmVwbykuZXhlY3V0ZShub3RpZmljYXRpb25JZCwgcmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX1JFQURfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkKHJlY2lwaWVudElkOiBzdHJpbmcpOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrQWxsTm90aWZpY2F0aW9uc1JlYWRVc2VDYXNlKG5vdGlmaWNhdGlvblJlcG8pLmV4ZWN1dGUocmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX0FMTF9SRUFEX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjZVQXNDc0IscU1BQUEifQ==
}),
"[project]/modules/notification/interfaces/_actions/data:c5c06d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markNotificationRead",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60e0b9b1f0ec32b3e7fb944c7e8641e252aa3b5f40":"markNotificationRead"},"modules/notification/interfaces/_actions/notification.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60e0b9b1f0ec32b3e7fb944c7e8641e252aa3b5f40", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "markNotificationRead");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90aWZpY2F0aW9uLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogTm90aWZpY2F0aW9uIFNlcnZlciBBY3Rpb25zIOKAlCB0aGluIGFkYXB0ZXIgdG8gdXNlIGNhc2VzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNvbW1hbmRGYWlsdXJlRnJvbSwgdHlwZSBDb21tYW5kUmVzdWx0IH0gZnJvbSBcIkBzaGFyZWQtdHlwZXNcIjtcclxuaW1wb3J0IHtcclxuICBEaXNwYXRjaE5vdGlmaWNhdGlvblVzZUNhc2UsXHJcbiAgTWFya05vdGlmaWNhdGlvblJlYWRVc2VDYXNlLFxyXG4gIE1hcmtBbGxOb3RpZmljYXRpb25zUmVhZFVzZUNhc2UsXHJcbn0gZnJvbSBcIi4uLy4uL2FwcGxpY2F0aW9uL3VzZS1jYXNlcy9ub3RpZmljYXRpb24udXNlLWNhc2VzXCI7XHJcbmltcG9ydCB7IEZpcmViYXNlTm90aWZpY2F0aW9uUmVwb3NpdG9yeSB9IGZyb20gXCIuLi8uLi9pbmZyYXN0cnVjdHVyZS9maXJlYmFzZS9GaXJlYmFzZU5vdGlmaWNhdGlvblJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHR5cGUgeyBEaXNwYXRjaE5vdGlmaWNhdGlvbklucHV0IH0gZnJvbSBcIi4uLy4uL2RvbWFpbi9lbnRpdGllcy9Ob3RpZmljYXRpb25cIjtcclxuXHJcbmNvbnN0IG5vdGlmaWNhdGlvblJlcG8gPSBuZXcgRmlyZWJhc2VOb3RpZmljYXRpb25SZXBvc2l0b3J5KCk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlzcGF0Y2hOb3RpZmljYXRpb24oXHJcbiAgaW5wdXQ6IERpc3BhdGNoTm90aWZpY2F0aW9uSW5wdXQsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IERpc3BhdGNoTm90aWZpY2F0aW9uVXNlQ2FzZShub3RpZmljYXRpb25SZXBvKS5leGVjdXRlKGlucHV0KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJOT1RJRklDQVRJT05fRElTUEFUQ0hfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya05vdGlmaWNhdGlvblJlYWQoXHJcbiAgbm90aWZpY2F0aW9uSWQ6IHN0cmluZyxcclxuICByZWNpcGllbnRJZDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrTm90aWZpY2F0aW9uUmVhZFVzZUNhc2Uobm90aWZpY2F0aW9uUmVwbykuZXhlY3V0ZShub3RpZmljYXRpb25JZCwgcmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX1JFQURfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya0FsbE5vdGlmaWNhdGlvbnNSZWFkKHJlY2lwaWVudElkOiBzdHJpbmcpOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBNYXJrQWxsTm90aWZpY2F0aW9uc1JlYWRVc2VDYXNlKG5vdGlmaWNhdGlvblJlcG8pLmV4ZWN1dGUocmVjaXBpZW50SWQpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIk5PVElGSUNBVElPTl9NQVJLX0FMTF9SRUFEX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlVQTJCc0IsaU1BQUEifQ==
}),
"[project]/app/(shell)/_components/translation-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TranslationSwitcher",
    ()=>TranslationSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: translation-switcher.tsx
 * Purpose: provide a reusable locale switch control for shell-level UI.
 * Responsibilities: persist locale preference and sync html lang attribute.
 * Constraints: keep state client-side and avoid coupling to business modules.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const LOCALE_STORAGE_KEY = "xuanwu_locale";
const localeOptions = [
    {
        value: "en",
        label: "English"
    },
    {
        value: "zh-TW",
        label: "繁體中文"
    }
];
function isLocaleValue(value) {
    return value === "en" || value === "zh-TW";
}
function TranslationSwitcher() {
    _s();
    const [locale, setLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "TranslationSwitcher.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const storedValue = window.localStorage.getItem(LOCALE_STORAGE_KEY);
            return isLocaleValue(storedValue) ? storedValue : "en";
        }
    }["TranslationSwitcher.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TranslationSwitcher.useEffect": ()=>{
            document.documentElement.lang = locale;
            window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        }
    }["TranslationSwitcher.useEffect"], [
        locale
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: "outline",
                    size: "icon-sm",
                    "aria-label": "Switch language",
                    className: "text-muted-foreground",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                className: "w-40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                        children: "Language"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioGroup"], {
                        value: locale,
                        onValueChange: (value)=>{
                            if (isLocaleValue(value)) {
                                setLocale(value);
                            }
                        },
                        children: localeOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                                value: option.value,
                                children: option.label
                            }, option.value, false, {
                                fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(TranslationSwitcher, "dJ1yLvb1i1TTfCoJY8Tb6GrYGVo=");
_c = TranslationSwitcher;
var _c;
__turbopack_context__.k.register(_c, "TranslationSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/header-controls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderControls",
    ()=>HeaderControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: header-controls.tsx
 * Purpose: compose shell header utility controls.
 * Responsibilities: language switch, theme toggle, and notification entry.
 * Constraints: presentation-only, no domain orchestration.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/notification/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$b33af8__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/_actions/data:b33af8 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$c5c06d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/_actions/data:c5c06d [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$queries$2f$notification$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/queries/notification.queries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$translation$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/translation-switcher.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const THEME_KEY = "xuanwu_theme";
const NOTIFICATION_LIMIT = 20;
function formatNotificationTime(timestamp) {
    return new Intl.DateTimeFormat("zh-TW", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}
function HeaderControls() {
    _s();
    const { state: authState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "HeaderControls.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const storedTheme = window.localStorage.getItem(THEME_KEY);
            if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
            return document.documentElement.classList.contains("dark") ? "dark" : "light";
        }
    }["HeaderControls.useState"]);
    const [isNotificationOpen, setIsNotificationOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNotificationLoading, setIsNotificationLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNotificationMutating, setIsNotificationMutating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const recipientId = authState.user?.id ?? "";
    const unreadCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeaderControls.useMemo[unreadCount]": ()=>notifications.reduce({
                "HeaderControls.useMemo[unreadCount]": (count, notification)=>count + (notification.read ? 0 : 1)
            }["HeaderControls.useMemo[unreadCount]"], 0)
    }["HeaderControls.useMemo[unreadCount]"], [
        notifications
    ]);
    const loadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeaderControls.useCallback[loadNotifications]": async ()=>{
            if (!recipientId) {
                setNotifications([]);
                return;
            }
            setIsNotificationLoading(true);
            try {
                const nextNotifications = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$queries$2f$notification$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationsForRecipient"])(recipientId, NOTIFICATION_LIMIT);
                setNotifications(nextNotifications);
            } finally{
                setIsNotificationLoading(false);
            }
        }
    }["HeaderControls.useCallback[loadNotifications]"], [
        recipientId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderControls.useEffect": ()=>{
            document.documentElement.classList.toggle("dark", theme === "dark");
            window.localStorage.setItem(THEME_KEY, theme);
        }
    }["HeaderControls.useEffect"], [
        theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderControls.useEffect": ()=>{
            void loadNotifications();
        }
    }["HeaderControls.useEffect"], [
        loadNotifications
    ]);
    function toggleTheme() {
        setTheme((current)=>current === "light" ? "dark" : "light");
    }
    async function handleNotificationOpenChange(nextOpen) {
        setIsNotificationOpen(nextOpen);
        if (nextOpen) {
            await loadNotifications();
        }
    }
    async function handleMarkOneRead(notificationId) {
        if (!recipientId) return;
        setIsNotificationMutating(true);
        const previous = notifications;
        setNotifications((current)=>current.map((notification)=>notification.id === notificationId ? {
                    ...notification,
                    read: true
                } : notification));
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$c5c06d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["markNotificationRead"])(notificationId, recipientId);
            if (!result.success) {
                setNotifications(previous);
            }
        } finally{
            setIsNotificationMutating(false);
        }
    }
    async function handleMarkAllRead() {
        if (!recipientId || unreadCount === 0) return;
        setIsNotificationMutating(true);
        const previous = notifications;
        setNotifications((current)=>current.map((notification)=>({
                    ...notification,
                    read: true
                })));
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$b33af8__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["markAllNotificationsRead"])(recipientId);
            if (!result.success) {
                setNotifications(previous);
            }
        } finally{
            setIsNotificationMutating(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$translation$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TranslationSwitcher"], {}, void 0, false, {
                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "outline",
                size: "icon-sm",
                onClick: toggleTheme,
                "aria-label": "Toggle theme",
                className: "text-muted-foreground",
                children: theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                    lineNumber: 135,
                    columnNumber: 30
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                    lineNumber: 135,
                    columnNumber: 61
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                open: isNotificationOpen,
                onOpenChange: handleNotificationOpenChange,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            size: "icon-sm",
                            "aria-label": "Open notifications",
                            className: "relative text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground",
                                    children: unreadCount > 99 ? "99+" : unreadCount
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                        align: "end",
                        className: "w-80 p-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between px-3 py-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold",
                                        children: "Notifications"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-7 px-2 text-xs",
                                        disabled: isNotificationMutating || unreadCount === 0,
                                        onClick: handleMarkAllRead,
                                        children: "Mark all read"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-h-80 overflow-y-auto",
                                children: isNotificationLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "px-3 py-6 text-center text-sm text-muted-foreground",
                                    children: "Loading..."
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, this) : notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "px-3 py-6 text-center text-sm text-muted-foreground",
                                    children: "No notifications"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this) : notifications.map((notification)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>void handleMarkOneRead(notification.id),
                                        disabled: isNotificationMutating,
                                        className: "block w-full border-b border-border/60 px-3 py-2 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium",
                                                        children: notification.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 21
                                                    }, this),
                                                    !notification.read ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-primary",
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 23
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                lineNumber: 182,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
                                                children: notification.message
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                lineNumber: 188,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-[11px] text-muted-foreground",
                                                children: formatNotificationTime(notification.timestamp)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                lineNumber: 191,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, notification.id, true, {
                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(HeaderControls, "vcnFljCU5kyuPeItf/Oav4C8Mbo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = HeaderControls;
var _c;
__turbopack_context__.k.register(_c, "HeaderControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/header-user-avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderUserAvatar",
    ()=>HeaderUserAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: header-user-avatar.tsx
 * Purpose: render top-right signed-in user identity as avatar with quick actions.
 * Responsibilities: display user identity and expose sign-out action.
 * Constraints: keep header interaction lightweight and presentation-oriented.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function toInitial(name, email) {
    const source = name.trim() || email.trim();
    return source.charAt(0).toUpperCase() || "U";
}
function HeaderUserAvatar({ name, email, onSignOut }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "aria-label": "開啟使用者選單",
                    className: "rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                        size: "sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                            className: "bg-primary/10 text-xs font-semibold text-primary",
                            children: toInitial(name, email)
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                className: "w-64",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-2 px-4 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                size: "lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                    className: "bg-primary/10 text-lg font-semibold text-primary",
                                    children: toInitial(name, email)
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-foreground",
                                        children: name
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: email
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/settings",
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    className: "size-4 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "設定"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/settings?tab=preferences",
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                    className: "size-4 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "偏好設定"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        variant: "destructive",
                        onClick: onSignOut,
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                className: "size-4 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "登出"
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = HeaderUserAvatar;
var _c;
__turbopack_context__.k.register(_c, "HeaderUserAvatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/application/identity-error-message.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/application/use-cases/identity.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/identity-error-message.ts [app-client] (ecmascript)");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_IN_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Sign-in failed"));
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_IN_ANONYMOUS_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Anonymous sign-in failed"));
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("REGISTRATION_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Registration failed"));
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(email, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("PASSWORD_RESET_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Password reset failed"));
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(aggregateId, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_OUT_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Sign-out failed"));
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/application/use-cases/token-refresh.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmitTokenRefreshSignalUseCase",
    ()=>EmitTokenRefreshSignalUseCase
]);
/**
 * Token Refresh Use Cases — pure business workflows for [S6] Claims refresh.
 * No React, no Firebase SDK, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
;
class EmitTokenRefreshSignalUseCase {
    tokenRefreshRepo;
    constructor(tokenRefreshRepo){
        this.tokenRefreshRepo = tokenRefreshRepo;
    }
    async execute(accountId, reason, traceId) {
        // Guard: accountId must be a safe document ID (alphanumeric + hyphen/underscore)
        if (!/^[\w-]+$/.test(accountId)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("TOKEN_REFRESH_INVALID_ACCOUNT_ID", `accountId '${accountId}' is not a valid Firestore document ID`);
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(accountId, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("TOKEN_REFRESH_EMIT_FAILED", err instanceof Error ? err.message : "Failed to emit token refresh signal");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseIdentityRepository",
    ()=>FirebaseIdentityRepository
]);
/**
 * FirebaseIdentityRepository — Infrastructure adapter implementing IdentityRepository port.
 * Translates Firebase Auth SDK calls into domain entities.
 * Firebase SDK only exists in this file, never in domain or application layers.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async signInWithEmailAndPassword(credentials) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(this.auth, credentials.email, credentials.password);
        return toIdentityEntity(result.user);
    }
    async signInAnonymously() {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInAnonymously"])(this.auth);
        return toIdentityEntity(result.user);
    }
    async createUserWithEmailAndPassword(input) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(this.auth, input.email, input.password);
        return toIdentityEntity(result.user);
    }
    async updateDisplayName(uid, displayName) {
        const currentUser = this.auth.currentUser;
        if (currentUser && currentUser.uid === uid) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(currentUser, {
                displayName
            });
        }
    }
    async sendPasswordResetEmail(email) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendPasswordResetEmail"])(this.auth, email);
    }
    async signOut() {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(this.auth);
    }
    getCurrentUser() {
        const user = this.auth.currentUser;
        return user ? toIdentityEntity(user) : null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseTokenRefreshRepository",
    ()=>FirebaseTokenRefreshRepository
]);
/**
 * FirebaseTokenRefreshRepository — Infrastructure adapter for [S6] TOKEN_REFRESH_SIGNAL.
 * Writes/reads `tokenRefreshSignals/{accountId}` in Firestore.
 * Firebase SDK only exists in this file.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
const COLLECTION = "tokenRefreshSignals";
class FirebaseTokenRefreshRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async emit(signal) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, COLLECTION, signal.accountId), {
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
        const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, COLLECTION, accountId);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(ref, ()=>{
            if (isFirstEmission) {
                isFirstEmission = false;
                return;
            }
            onSignal();
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integration-firebase/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const tokenRefreshRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseTokenRefreshRepository"]();
function useTokenRefreshListener(accountId) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTokenRefreshListener.useEffect": ()=>{
            if (!accountId) return;
            // Guard: accountId must be a valid Firestore document ID
            if (!/^[\w-]+$/.test(accountId)) return;
            const unsubscribe = tokenRefreshRepo.subscribe(accountId, {
                "useTokenRefreshListener.useEffect.unsubscribe": ()=>{
                    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseAuth"])();
                    const currentUser = auth.currentUser;
                    if (!currentUser) return;
                    // [S6] Force-refresh the ID token so subsequent requests carry updated Custom Claims.
                    void currentUser.getIdToken(/* forceRefresh */ true).catch({
                        "useTokenRefreshListener.useEffect.unsubscribe": ()=>{
                        // Non-fatal: token refreshes naturally on next expiry cycle.
                        }
                    }["useTokenRefreshListener.useEffect.unsubscribe"]);
                }
            }["useTokenRefreshListener.useEffect.unsubscribe"]);
            return ({
                "useTokenRefreshListener.useEffect": ()=>unsubscribe()
            })["useTokenRefreshListener.useEffect"];
        }
    }["useTokenRefreshListener.useEffect"], [
        accountId
    ]);
}
_s(useTokenRefreshListener, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * identity module public API
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/identity.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$token$2d$refresh$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/token-refresh.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseIdentityRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-client] (ecmascript)");
// Client-only hook — must be imported from the module barrel only from "use client" files
// to avoid RSC bundle contamination.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/shell-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShellGuard",
    ()=>ShellGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * shell-guard.tsx
 * Client-side auth guard for the authenticated shell.
 *
 * Responsibilities:
 *  1. Redirect to `/` (public auth page) when auth status is "unauthenticated"
 *  2. Mount useTokenRefreshListener for [S6] Claims refresh (Party 3)
 *  3. Show a loading state while auth is initializing
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/identity/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ShellGuard({ children }) {
    _s();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { user, status } = state;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // [S6] Party 3: force-refresh ID token when a TOKEN_REFRESH_SIGNAL is emitted
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTokenRefreshListener"])(user?.id ?? null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShellGuard.useEffect": ()=>{
            if (status === "unauthenticated") {
                router.replace("/");
            }
        }
    }["ShellGuard.useEffect"], [
        status,
        router
    ]);
    if (status === "initializing") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center bg-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/shell-guard.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/shell-guard.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    if (status === "unauthenticated") {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(ShellGuard, "fX6TzYGk4Ak4M53uRycFGjIykN8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTokenRefreshListener"]
    ];
});
_c = ShellGuard;
var _c;
__turbopack_context__.k.register(_c, "ShellGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShellLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: shell layout
 * Purpose: compose authenticated shell frame with sidebar, header, and content area.
 * Responsibilities: account switching, route guards, and shell-level UI composition.
 * Constraints: keep business logic in modules and providers, not layout rendering.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.js [app-client] (ecmascript) <export default as PanelLeftOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$account$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/account-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$breadcrumbs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/app-breadcrumbs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$rail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/app-rail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$dashboard$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/dashboard-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/global-search-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/header-controls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/header-user-avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$shell$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/shell-guard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
;
;
;
const routeTitles = {
    "/dashboard": "儀表板",
    "/organization": "組織治理",
    "/organization/daily": "Account · 每日",
    "/organization/schedule": "Account · 排程",
    "/organization/schedule/dispatcher": "Account · 調度台",
    "/organization/audit": "Account · 稽核",
    "/workspace": "工作區中心",
    "/wiki-beta": "Account Wiki-Beta",
    "/wiki-beta/rag-query": "Account Wiki-Beta · RAG 查詢",
    "/wiki-beta/documents": "Account Wiki-Beta · 文件",
    "/ai-chat": "AI 對話",
    "/settings": "個人設定",
    "/dev-tools": "開發工具"
};
/** Used only by the mobile header nav strip (md:hidden). Desktop nav is in AppRail. */ const mobileNavItems = [
    {
        href: "/dashboard",
        label: "儀表板"
    },
    {
        href: "/workspace",
        label: "工作區"
    },
    {
        href: "/settings",
        label: "個人設定"
    }
];
const organizationManagementItems = [
    {
        label: "成員",
        href: "/organization/members"
    },
    {
        label: "團隊",
        href: "/organization/teams"
    },
    {
        label: "權限",
        href: "/organization/permissions"
    },
    {
        label: "工作區",
        href: "/organization/workspaces"
    },
    {
        label: "排程",
        href: "/organization/schedule"
    },
    {
        label: "每日",
        href: "/organization/daily"
    },
    {
        label: "稽核",
        href: "/organization/audit"
    }
];
function isOrganizationAccount(activeAccount) {
    return activeAccount != null && "accountType" in activeAccount && activeAccount.accountType === "organization";
}
function resolveShellRouteForAccount(pathname, nextAccount) {
    const nextAccountIsOrganization = nextAccount != null && "accountType" in nextAccount && nextAccount.accountType === "organization";
    if (pathname === "/settings" && nextAccountIsOrganization) {
        return "/organization";
    }
    if (pathname === "/organization" && !nextAccountIsOrganization) {
        return "/settings";
    }
    return null;
}
function ShellLayout({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { state: authState, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { state: appState, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [logoutError, setLogoutError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { open: searchOpen, setOpen: setSearchOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalSearch"])();
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ShellLayout.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return window.localStorage.getItem("xuanwu:sidebar-collapsed") === "true";
        }
    }["ShellLayout.useState"]);
    function toggleSidebar() {
        setSidebarCollapsed((prev)=>{
            const next = !prev;
            if ("TURBOPACK compile-time truthy", 1) {
                window.localStorage.setItem("xuanwu:sidebar-collapsed", String(next));
            }
            return next;
        });
    }
    const pageTitle = routeTitles[pathname] ?? "工作區";
    const organizationAccounts = Object.values(appState.accounts ?? {});
    const accountWorkspaces = Object.values(appState.workspaces ?? {});
    const showAccountManagement = isOrganizationAccount(appState.activeAccount);
    function isActiveRoute(href) {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    function handleSelectOrganization(account) {
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: account
        });
        const nextRoute = resolveShellRouteForAccount(pathname, account);
        if (nextRoute) {
            router.replace(nextRoute);
        }
    }
    function handleSelectPersonal() {
        if (!authState.user) return;
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: authState.user
        });
        const nextRoute = resolveShellRouteForAccount(pathname, authState.user);
        if (nextRoute) {
            router.replace(nextRoute);
        }
    }
    function handleOrganizationCreated(account) {
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: account
        });
    }
    function handleSelectWorkspace(workspaceId) {
        dispatch({
            type: "SET_ACTIVE_WORKSPACE",
            payload: workspaceId
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShellLayout.useEffect": ()=>{
            if (!appState.accountsHydrated || !appState.activeAccount) {
                return;
            }
            const nextRoute = resolveShellRouteForAccount(pathname, appState.activeAccount);
            if (nextRoute && nextRoute !== pathname) {
                router.replace(nextRoute);
            }
        }
    }["ShellLayout.useEffect"], [
        appState.accountsHydrated,
        appState.activeAccount,
        pathname,
        router
    ]);
    async function handleLogout() {
        setLogoutError(null);
        try {
            await logout();
        } catch  {
            setLogoutError("登出失敗，請稍後再試。");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$shell$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShellGuard"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlobalSearchDialog"], {
                open: searchOpen,
                onOpenChange: setSearchOpen
            }, void 0, false, {
                fileName: "[project]/app/(shell)/layout.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-screen overflow-hidden bg-background",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$rail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppRail"], {
                        pathname: pathname,
                        user: authState.user,
                        activeAccount: appState.activeAccount,
                        organizationAccounts: organizationAccounts,
                        workspaces: accountWorkspaces,
                        workspacesHydrated: appState.workspacesHydrated,
                        isOrganizationAccount: showAccountManagement,
                        onSelectPersonal: handleSelectPersonal,
                        onSelectOrganization: handleSelectOrganization,
                        activeWorkspaceId: appState.activeWorkspaceId,
                        onSelectWorkspace: handleSelectWorkspace,
                        onOrganizationCreated: handleOrganizationCreated,
                        onSignOut: ()=>{
                            void handleLogout();
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/layout.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$dashboard$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardSidebar"], {
                        pathname: pathname,
                        activeAccount: appState.activeAccount,
                        workspaces: accountWorkspaces,
                        workspacesHydrated: appState.workspacesHydrated,
                        activeWorkspaceId: appState.activeWorkspaceId,
                        collapsed: sidebarCollapsed,
                        onToggleCollapsed: toggleSidebar,
                        onSelectWorkspace: handleSelectWorkspace
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/layout.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-w-0 flex-1 flex-col overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                className: "shrink-0 border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-12 items-center justify-between gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex items-center gap-3",
                                                children: [
                                                    sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: toggleSidebar,
                                                        "aria-label": "展開側欄",
                                                        title: "展開側欄",
                                                        className: "hidden size-7 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__["PanelLeftOpen"], {
                                                            className: "size-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/layout.tsx",
                                                            lineNumber: 208,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-sm font-semibold tracking-tight",
                                                        children: pageTitle
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$breadcrumbs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppBreadcrumbs"], {}, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        "aria-label": "全域搜尋",
                                                        className: "hidden items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-border hover:bg-muted sm:flex",
                                                        onClick: ()=>setSearchOpen(true),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                className: "size-3 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                                lineNumber: 220,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "搜尋…"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                                lineNumber: 221,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground/60",
                                                                children: "⌘K"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                                lineNumber: 222,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ml-auto flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeaderControls"], {}, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeaderUserAvatar"], {
                                                        name: authState.user?.name ?? "Dimension Member",
                                                        email: authState.user?.email ?? "—",
                                                        onSignOut: ()=>{
                                                            void handleLogout();
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 226,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/layout.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 pb-3 md:hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$account$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountSwitcher"], {
                                                personalAccount: authState.user,
                                                organizationAccounts: organizationAccounts,
                                                activeAccountId: appState.activeAccount?.id ?? null,
                                                onSelectPersonal: handleSelectPersonal,
                                                onSelectOrganization: handleSelectOrganization,
                                                onOrganizationCreated: handleOrganizationCreated
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 239,
                                                columnNumber: 15
                                            }, this),
                                            showAccountManagement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                                "aria-label": "Organization management",
                                                className: "flex gap-2 overflow-auto",
                                                children: organizationManagementItems.map((item)=>{
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        className: "whitespace-nowrap rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted",
                                                        children: item.label
                                                    }, item.href, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/layout.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        "aria-label": "Main navigation",
                                        className: "flex gap-2 overflow-auto pb-3 md:hidden",
                                        children: mobileNavItems.map((item)=>{
                                            const isActive = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": isActive ? "page" : undefined,
                                                className: `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "border border-border/60 text-muted-foreground hover:bg-muted"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 269,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/layout.tsx",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/layout.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this),
                            logoutError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 px-4 pt-3 text-xs text-destructive md:px-6",
                                children: logoutError
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/layout.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: "flex-1 overflow-auto p-6",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/layout.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/layout.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/layout.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/layout.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_s(ShellLayout, "5fzwlf5jS9xOsFbe8N2hHi19yCU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalSearch"]
    ];
});
_c = ShellLayout;
var _c;
__turbopack_context__.k.register(_c, "ShellLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_77cd9dc2._.js.map