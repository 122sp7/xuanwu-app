module.exports = [
"[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/modules/organization/application/use-cases/organization.use-cases.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
;
class CreateOrganizationUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(command) {
        try {
            const orgId = await this.orgRepo.create(command);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(orgId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to create organization");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Failed to setup organization with team");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(command.organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Failed to update organization settings");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(organizationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to delete organization");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(inviteId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to invite member");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to recruit member");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("REMOVE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to remove member");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(input.memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Failed to update member role");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to create team");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to delete team");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Failed to update team members");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(teamId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Failed to create partner group");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(inviteId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Failed to send partner invite");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(memberId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to dismiss partner member");
        }
    }
}
}),
"[project]/modules/organization/application/use-cases/organization-policy.use-cases.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
;
class CreateOrgPolicyUseCase {
    orgRepo;
    constructor(orgRepo){
        this.orgRepo = orgRepo;
    }
    async execute(input) {
        try {
            const policy = await this.orgRepo.createPolicy(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(policy.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to create org policy");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to update org policy");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to delete org policy");
        }
    }
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/packages/integration-firebase/client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firebaseClientApp",
    ()=>firebaseClientApp
]);
/**
 * @module libs/firebase/client
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-rsc] (ecmascript)");
;
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBkniZGal_Lls4CR3eFuZvSVMZBe73STNs",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "xuanwu-i-00708880-4e2d8.firebaseapp.com",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "https://xuanwu-i-00708880-4e2d8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "xuanwu-i-00708880-4e2d8",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "xuanwu-i-00708880-4e2d8.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "65970295651",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:65970295651:web:4a1a83b030cb730ec93956",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-CJYNJP5J86"
};
const firebaseClientApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getApps"])().length === 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getApp"])();
}),
"[project]/modules/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseOrganizationRepository",
    ()=>FirebaseOrganizationRepository
]);
/**
 * FirebaseOrganizationRepository — Infrastructure adapter for organization persistence.
 * Implements the OrganizationRepository port.
 * Firebase SDK only exists in this file.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-rsc] (ecmascript)");
;
;
// ─── Mappers ──────────────────────────────────────────────────────────────────
function toOrganizationEntity(id, data) {
    return {
        id,
        name: typeof data.name === "string" ? data.name : "",
        ownerId: typeof data.ownerId === "string" ? data.ownerId : "",
        email: typeof data.email === "string" ? data.email : undefined,
        photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
        description: typeof data.description === "string" ? data.description : undefined,
        theme: data.theme != null ? data.theme : undefined,
        members: Array.isArray(data.members) ? data.members : [],
        memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
        teams: Array.isArray(data.teams) ? data.teams : [],
        partnerInvites: Array.isArray(data.partnerInvites) ? data.partnerInvites : undefined,
        createdAt: data.createdAt
    };
}
function toOrgPolicy(id, data) {
    const VALID_SCOPES = new Set([
        "workspace",
        "member",
        "global"
    ]);
    const scope = VALID_SCOPES.has(data.scope) ? data.scope : "global";
    return {
        id,
        orgId: data.orgId,
        name: typeof data.name === "string" ? data.name : "",
        description: typeof data.description === "string" ? data.description : "",
        rules: Array.isArray(data.rules) ? data.rules : [],
        scope,
        isActive: data.isActive === true,
        createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString()
    };
}
class FirebaseOrganizationRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    organizationAccountRef(organizationId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "accounts", organizationId);
    }
    buildOrganizationAccountData(data) {
        return {
            accountType: "organization",
            name: data.name ?? "",
            ownerId: data.ownerId ?? "",
            email: data.email ?? null,
            photoURL: data.photoURL ?? null,
            description: data.description ?? null,
            theme: data.theme ?? null,
            members: data.members ?? [],
            memberIds: data.memberIds ?? [],
            teams: data.teams ?? [],
            createdAt: data.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
    }
    // ─── Org Lifecycle ──────────────────────────────────────────────────────────
    async create(command) {
        const orgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "organizations"));
        const owner = {
            id: command.ownerId,
            name: command.ownerName,
            email: command.ownerEmail,
            role: "Owner",
            presence: "active"
        };
        const createdAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])();
        const organizationData = {
            name: command.organizationName,
            ownerId: command.ownerId,
            members: [
                owner
            ],
            memberIds: [
                command.ownerId
            ],
            teams: [],
            createdAt
        };
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        batch.set(orgRef, organizationData);
        batch.set(this.organizationAccountRef(orgRef.id), this.buildOrganizationAccountData({
            name: command.organizationName,
            ownerId: command.ownerId,
            members: [
                owner
            ],
            memberIds: [
                command.ownerId
            ],
            teams: [],
            createdAt
        }), {
            merge: true
        });
        await batch.commit();
        return orgRef.id;
    }
    async findById(id) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", id));
        if (!snap.exists()) return null;
        return toOrganizationEntity(snap.id, snap.data());
    }
    async save(org) {
        const orgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", org.id);
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        batch.set(orgRef, {
            name: org.name,
            ownerId: org.ownerId,
            members: org.members,
            memberIds: org.memberIds,
            teams: org.teams,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        batch.set(this.organizationAccountRef(org.id), this.buildOrganizationAccountData({
            name: org.name,
            ownerId: org.ownerId,
            email: org.email,
            photoURL: org.photoURL,
            description: org.description,
            theme: org.theme,
            members: org.members,
            memberIds: org.memberIds,
            teams: org.teams,
            createdAt: org.createdAt
        }), {
            merge: true
        });
        await batch.commit();
    }
    async updateSettings(command) {
        const orgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", command.organizationId);
        const updates = {
            accountType: "organization",
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        if (command.name !== undefined) updates.name = command.name;
        if (command.description !== undefined) updates.description = command.description;
        if (command.theme !== undefined) updates.theme = command.theme;
        if (command.photoURL !== undefined) updates.photoURL = command.photoURL;
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        batch.update(orgRef, updates);
        batch.set(this.organizationAccountRef(command.organizationId), updates, {
            merge: true
        });
        await batch.commit();
    }
    async delete(organizationId) {
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        batch.delete((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId));
        batch.delete(this.organizationAccountRef(organizationId));
        await batch.commit();
    }
    // ─── Members ────────────────────────────────────────────────────────────────
    async inviteMember(input) {
        const invite = {
            email: input.email,
            teamId: input.teamId,
            role: input.role,
            inviteState: "pending",
            protocol: input.protocol,
            invitedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        const ref = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "organizations", input.organizationId, "invites"), invite);
        return ref.id;
    }
    async recruitMember(organizationId, memberId, name, email) {
        const orgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId);
        const member = {
            id: memberId,
            name,
            email,
            role: "Member",
            presence: "active"
        };
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        batch.update(orgRef, {
            members: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(member),
            memberIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(memberId),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        batch.set(this.organizationAccountRef(organizationId), {
            members: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(member),
            memberIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(memberId),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }, {
            merge: true
        });
        await batch.commit();
    }
    async removeMember(organizationId, memberId) {
        const orgSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId));
        if (!orgSnap.exists()) return;
        const data = orgSnap.data();
        const members = Array.isArray(data.members) ? data.members.filter((m)=>m.id !== memberId) : [];
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        batch.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId), {
            members,
            memberIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayRemove"])(memberId),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        batch.set(this.organizationAccountRef(organizationId), {
            members,
            memberIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayRemove"])(memberId),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }, {
            merge: true
        });
        await batch.commit();
    }
    async updateMemberRole(input) {
        const orgSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", input.organizationId));
        if (!orgSnap.exists()) return;
        const data = orgSnap.data();
        const members = Array.isArray(data.members) ? data.members.map((m)=>m.id === input.memberId ? {
                ...m,
                role: input.role
            } : m) : [];
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        batch.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", input.organizationId), {
            members,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        batch.set(this.organizationAccountRef(input.organizationId), {
            members,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }, {
            merge: true
        });
        await batch.commit();
    }
    async getMembers(organizationId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId));
        if (!snap.exists()) return [];
        const data = snap.data();
        return Array.isArray(data.members) ? data.members : [];
    }
    subscribeToMembers(organizationId, onUpdate) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId), (snap)=>{
            if (!snap.exists()) {
                onUpdate([]);
                return;
            }
            const data = snap.data();
            onUpdate(Array.isArray(data.members) ? data.members : []);
        });
    }
    // ─── Teams ──────────────────────────────────────────────────────────────────
    async createTeam(input) {
        const teamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "organizations", input.organizationId, "teams"));
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDoc"])(teamRef, {
            name: input.name,
            description: input.description,
            type: input.type,
            memberIds: [],
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return teamRef.id;
    }
    async deleteTeam(organizationId, teamId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId, "teams", teamId));
    }
    async addMemberToTeam(organizationId, teamId, memberId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId, "teams", teamId), {
            memberIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(memberId)
        });
    }
    async removeMemberFromTeam(organizationId, teamId, memberId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "organizations", organizationId, "teams", teamId), {
            memberIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayRemove"])(memberId)
        });
    }
    async getTeams(organizationId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "organizations", organizationId, "teams"));
        return snaps.docs.map((d)=>{
            const data = d.data();
            return {
                id: d.id,
                name: typeof data.name === "string" ? data.name : "",
                description: typeof data.description === "string" ? data.description : "",
                type: data.type === "external" ? "external" : "internal",
                memberIds: Array.isArray(data.memberIds) ? data.memberIds : []
            };
        });
    }
    subscribeToTeams(organizationId, onUpdate) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "organizations", organizationId, "teams"), (snap)=>{
            const teams = snap.docs.map((d)=>{
                const data = d.data();
                return {
                    id: d.id,
                    name: typeof data.name === "string" ? data.name : "",
                    description: typeof data.description === "string" ? data.description : "",
                    type: data.type === "external" ? "external" : "internal",
                    memberIds: Array.isArray(data.memberIds) ? data.memberIds : []
                };
            });
            onUpdate(teams);
        });
    }
    // ─── Partners ────────────────────────────────────────────────────────────────
    async sendPartnerInvite(organizationId, teamId, email) {
        const ref = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "organizations", organizationId, "partnerInvites"), {
            email,
            teamId,
            role: "Guest",
            inviteState: "pending",
            invitedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return ref.id;
    }
    async dismissPartnerMember(organizationId, teamId, memberId) {
        await this.removeMemberFromTeam(organizationId, teamId, memberId);
    }
    async getPartnerInvites(organizationId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "organizations", organizationId, "partnerInvites"));
        return snaps.docs.map((d)=>{
            const data = d.data();
            return {
                id: d.id,
                email: data.email,
                teamId: data.teamId,
                role: data.role ?? "Guest",
                inviteState: data.inviteState ?? "pending",
                invitedAt: data.invitedAt,
                protocol: typeof data.protocol === "string" ? data.protocol : ""
            };
        });
    }
    // ─── Policy ──────────────────────────────────────────────────────────────────
    async createPolicy(input) {
        const now = new Date().toISOString();
        const ref = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "orgPolicies"), {
            orgId: input.orgId,
            name: input.name,
            description: input.description,
            rules: input.rules,
            scope: input.scope,
            isActive: true,
            createdAt: now,
            updatedAt: now,
            _createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return {
            id: ref.id,
            orgId: input.orgId,
            name: input.name,
            description: input.description,
            rules: input.rules,
            scope: input.scope,
            isActive: true,
            createdAt: now,
            updatedAt: now
        };
    }
    async updatePolicy(policyId, data) {
        const updates = {
            updatedAt: new Date().toISOString(),
            _updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        if (data.name !== undefined) updates.name = data.name;
        if (data.description !== undefined) updates.description = data.description;
        if (data.rules !== undefined) updates.rules = data.rules;
        if (data.scope !== undefined) updates.scope = data.scope;
        if (data.isActive !== undefined) updates.isActive = data.isActive;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "orgPolicies", policyId), updates);
    }
    async deletePolicy(policyId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "orgPolicies", policyId));
    }
    async getPolicies(orgId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "orgPolicies"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("orgId", "==", orgId));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.docs.map((d)=>toOrgPolicy(d.id, d.data()));
    }
}
}),
"[project]/modules/organization/interfaces/_actions/organization.actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4056b38801ecd039c2d4a06376acf3bcd931a55627":"updateOrganizationSettings","4095d43a0addef03b6c28043a90a69b55c3bf5875e":"deleteOrganization","40aa6a26e1e6cd89673579d6b4b144832330002ebb":"createOrgPolicy","40c5e39f129f90fb486b88c00dbf469d8f8512652c":"inviteMember","40c943a39c6a100a573db9f208a5f3025ce7095c5f":"createTeam","40ccde5f6e0512ed58a5586d880afd93c68333463c":"deleteOrgPolicy","40d820a9b690d1e8de0028caeeb609ef68a8b0a55b":"createOrganization","40fc0313328c4a8bac14afcf9cadacebd7b26d53f6":"updateMemberRole","601afdd4398b32fb04dd8ee1591289bd1dd7fa651e":"dismissMember","601ded6d8033ba02db345115a95215129e96cc42eb":"updateOrgPolicy","6049819a8c7f893af0177ebf71f64f094eb7ac015b":"createPartnerGroup","6073cfe3259cbd2d6498ce7a655cec7318a8e43267":"deleteTeam","700b487857440bcb922457f1d32eba7104f7889442":"createOrganizationWithTeam","704a8a3e03229f0450761ca26b70deb19ae21827e8":"sendPartnerInvite","7081d73d697355e5b644466b0621e23c6677c5defa":"dismissPartnerMember","7827b801833f595572fafc7bb82fdd15072cea59c4":"updateTeamMembers","784d75f4a43e5178d1476516b94b7bb1520b44eca5":"recruitMember"},"",""] */ __turbopack_context__.s([
    "createOrgPolicy",
    ()=>createOrgPolicy,
    "createOrganization",
    ()=>createOrganization,
    "createOrganizationWithTeam",
    ()=>createOrganizationWithTeam,
    "createPartnerGroup",
    ()=>createPartnerGroup,
    "createTeam",
    ()=>createTeam,
    "deleteOrgPolicy",
    ()=>deleteOrgPolicy,
    "deleteOrganization",
    ()=>deleteOrganization,
    "deleteTeam",
    ()=>deleteTeam,
    "dismissMember",
    ()=>dismissMember,
    "dismissPartnerMember",
    ()=>dismissPartnerMember,
    "inviteMember",
    ()=>inviteMember,
    "recruitMember",
    ()=>recruitMember,
    "sendPartnerInvite",
    ()=>sendPartnerInvite,
    "updateMemberRole",
    ()=>updateMemberRole,
    "updateOrgPolicy",
    ()=>updateOrgPolicy,
    "updateOrganizationSettings",
    ()=>updateOrganizationSettings,
    "updateTeamMembers",
    ()=>updateTeamMembers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * Organization Core Server Actions — thin adapter: Server Actions → Application Use Cases.
 * Covers: org lifecycle (create, update settings, delete).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/application/use-cases/organization.use-cases.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2d$policy$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/application/use-cases/organization-policy.use-cases.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const orgRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$infrastructure$2f$firebase$2f$FirebaseOrganizationRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseOrganizationRepository"]();
async function createOrganization(command) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateOrganizationUseCase"](orgRepo).execute(command);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function createOrganizationWithTeam(command, teamName, teamType = "internal") {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateOrganizationWithTeamUseCase"](orgRepo).execute(command, teamName, teamType);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function updateOrganizationSettings(command) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateOrganizationSettingsUseCase"](orgRepo).execute(command);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function deleteOrganization(organizationId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DeleteOrganizationUseCase"](orgRepo).execute(organizationId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function inviteMember(input) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["InviteMemberUseCase"](orgRepo).execute(input);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function recruitMember(organizationId, memberId, name, email) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RecruitMemberUseCase"](orgRepo).execute(organizationId, memberId, name, email);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function dismissMember(organizationId, memberId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RemoveMemberUseCase"](orgRepo).execute(organizationId, memberId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DISMISS_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function updateMemberRole(input) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateMemberRoleUseCase"](orgRepo).execute(input);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function createTeam(input) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateTeamUseCase"](orgRepo).execute(input);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function deleteTeam(organizationId, teamId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DeleteTeamUseCase"](orgRepo).execute(organizationId, teamId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function updateTeamMembers(organizationId, teamId, memberId, action) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateTeamMembersUseCase"](orgRepo).execute(organizationId, teamId, memberId, action);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function createPartnerGroup(organizationId, groupName) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreatePartnerGroupUseCase"](orgRepo).execute(organizationId, groupName);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function sendPartnerInvite(organizationId, teamId, email) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SendPartnerInviteUseCase"](orgRepo).execute(organizationId, teamId, email);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function dismissPartnerMember(organizationId, teamId, memberId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DismissPartnerMemberUseCase"](orgRepo).execute(organizationId, teamId, memberId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function createOrgPolicy(input) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2d$policy$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateOrgPolicyUseCase"](orgRepo).execute(input);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function updateOrgPolicy(policyId, data) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2d$policy$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateOrgPolicyUseCase"](orgRepo).execute(policyId, data);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function deleteOrgPolicy(policyId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$application$2f$use$2d$cases$2f$organization$2d$policy$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DeleteOrgPolicyUseCase"](orgRepo).execute(policyId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
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
    deleteOrgPolicy
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOrganization, "40d820a9b690d1e8de0028caeeb609ef68a8b0a55b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOrganizationWithTeam, "700b487857440bcb922457f1d32eba7104f7889442", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateOrganizationSettings, "4056b38801ecd039c2d4a06376acf3bcd931a55627", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteOrganization, "4095d43a0addef03b6c28043a90a69b55c3bf5875e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(inviteMember, "40c5e39f129f90fb486b88c00dbf469d8f8512652c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recruitMember, "784d75f4a43e5178d1476516b94b7bb1520b44eca5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(dismissMember, "601afdd4398b32fb04dd8ee1591289bd1dd7fa651e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateMemberRole, "40fc0313328c4a8bac14afcf9cadacebd7b26d53f6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTeam, "40c943a39c6a100a573db9f208a5f3025ce7095c5f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTeam, "6073cfe3259cbd2d6498ce7a655cec7318a8e43267", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateTeamMembers, "7827b801833f595572fafc7bb82fdd15072cea59c4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createPartnerGroup, "6049819a8c7f893af0177ebf71f64f094eb7ac015b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendPartnerInvite, "704a8a3e03229f0450761ca26b70deb19ae21827e8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(dismissPartnerMember, "7081d73d697355e5b644466b0621e23c6677c5defa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOrgPolicy, "40aa6a26e1e6cd89673579d6b4b144832330002ebb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateOrgPolicy, "601ded6d8033ba02db345115a95215129e96cc42eb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteOrgPolicy, "40ccde5f6e0512ed58a5586d880afd93c68333463c", null);
}),
"[project]/modules/workspace/application/use-cases/workspace.use-cases.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateWorkspaceLocationUseCase",
    ()=>CreateWorkspaceLocationUseCase,
    "CreateWorkspaceUseCase",
    ()=>CreateWorkspaceUseCase,
    "CreateWorkspaceWithCapabilitiesUseCase",
    ()=>CreateWorkspaceWithCapabilitiesUseCase,
    "DeleteWorkspaceUseCase",
    ()=>DeleteWorkspaceUseCase,
    "GrantIndividualAccessUseCase",
    ()=>GrantIndividualAccessUseCase,
    "GrantTeamAccessUseCase",
    ()=>GrantTeamAccessUseCase,
    "MountCapabilitiesUseCase",
    ()=>MountCapabilitiesUseCase,
    "UpdateWorkspaceSettingsUseCase",
    ()=>UpdateWorkspaceSettingsUseCase
]);
/**
 * Workspace Use Cases — pure business workflows.
 * No React, no Firebase, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
;
class CreateWorkspaceUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(command) {
        try {
            const workspaceId = await this.workspaceRepo.save({
                id: crypto.randomUUID(),
                name: command.name,
                accountId: command.accountId,
                accountType: command.accountType,
                lifecycleState: "preparatory",
                visibility: "visible",
                capabilities: [],
                grants: [],
                teamIds: [],
                createdAt: {
                    seconds: Date.now() / 1000,
                    nanoseconds: 0,
                    toDate: ()=>new Date()
                }
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create workspace");
        }
    }
}
class CreateWorkspaceWithCapabilitiesUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(command, capabilities = []) {
        try {
            const workspaceId = await this.workspaceRepo.save({
                id: crypto.randomUUID(),
                name: command.name,
                accountId: command.accountId,
                accountType: command.accountType,
                lifecycleState: "preparatory",
                visibility: "visible",
                capabilities: [],
                grants: [],
                teamIds: [],
                createdAt: {
                    seconds: Date.now() / 1000,
                    nanoseconds: 0,
                    toDate: ()=>new Date()
                }
            });
            if (capabilities.length > 0) {
                await this.workspaceRepo.mountCapabilities(workspaceId, capabilities);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_CREATE_WITH_CAPABILITIES_FAILED", err instanceof Error ? err.message : "Failed to create workspace with capabilities");
        }
    }
}
class UpdateWorkspaceSettingsUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(command) {
        try {
            const workspace = await this.workspaceRepo.findByIdForAccount(command.accountId, command.workspaceId);
            if (!workspace) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_NOT_FOUND", `Workspace ${command.workspaceId} not found`);
            }
            await this.workspaceRepo.updateSettings(command);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(command.workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_UPDATE_FAILED", err instanceof Error ? err.message : "Failed to update workspace settings");
        }
    }
}
class DeleteWorkspaceUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(workspaceId) {
        try {
            const workspace = await this.workspaceRepo.findById(workspaceId);
            if (!workspace) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_NOT_FOUND", `Workspace ${workspaceId} not found`);
            }
            await this.workspaceRepo.delete(workspaceId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_DELETE_FAILED", err instanceof Error ? err.message : "Failed to delete workspace");
        }
    }
}
class MountCapabilitiesUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(workspaceId, capabilities) {
        try {
            await this.workspaceRepo.mountCapabilities(workspaceId, capabilities);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CAPABILITIES_MOUNT_FAILED", err instanceof Error ? err.message : "Failed to mount capabilities");
        }
    }
}
class GrantTeamAccessUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(workspaceId, teamId) {
        try {
            await this.workspaceRepo.grantTeamAccess(workspaceId, teamId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_TEAM_GRANT_FAILED", err instanceof Error ? err.message : "Failed to grant team access");
        }
    }
}
class GrantIndividualAccessUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(workspaceId, grant) {
        try {
            await this.workspaceRepo.grantIndividualAccess(workspaceId, grant);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_GRANT_FAILED", err instanceof Error ? err.message : "Failed to grant individual access");
        }
    }
}
class CreateWorkspaceLocationUseCase {
    workspaceRepo;
    constructor(workspaceRepo){
        this.workspaceRepo = workspaceRepo;
    }
    async execute(workspaceId, location) {
        try {
            const locationId = await this.workspaceRepo.createLocation(workspaceId, location);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(locationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_LOCATION_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create workspace location");
        }
    }
}
}),
"[project]/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseWorkspaceRepository",
    ()=>FirebaseWorkspaceRepository,
    "toWorkspaceEntity",
    ()=>toWorkspaceEntity
]);
/**
 * FirebaseWorkspaceRepository — Infrastructure adapter for workspace persistence.
 * Translates Firestore documents ↔ Domain WorkspaceEntity.
 * Firebase SDK only exists in this file.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-rsc] (ecmascript)");
;
;
// ─── Mapper ───────────────────────────────────────────────────────────────────
const VALID_ACCOUNT_TYPES = new Set([
    "user",
    "organization"
]);
const VALID_LIFECYCLE_STATES = new Set([
    "preparatory",
    "active",
    "stopped"
]);
const VALID_VISIBILITY = new Set([
    "visible",
    "hidden"
]);
function toWorkspaceEntity(id, data) {
    const accountType = VALID_ACCOUNT_TYPES.has(data.accountType) ? data.accountType : "user";
    const lifecycleState = VALID_LIFECYCLE_STATES.has(data.lifecycleState) ? data.lifecycleState : "preparatory";
    const visibility = VALID_VISIBILITY.has(data.visibility) ? data.visibility : "visible";
    return {
        id,
        name: typeof data.name === "string" ? data.name : "",
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        accountType,
        lifecycleState,
        visibility,
        capabilities: Array.isArray(data.capabilities) ? data.capabilities : [],
        grants: Array.isArray(data.grants) ? data.grants : [],
        teamIds: Array.isArray(data.teamIds) ? data.teamIds : [],
        photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
        address: data.address != null ? data.address : undefined,
        locations: Array.isArray(data.locations) ? data.locations : undefined,
        personnel: data.personnel != null ? data.personnel : undefined,
        createdAt: data.createdAt
    };
}
class FirebaseWorkspaceRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async findById(id) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", id));
        if (!snap.exists()) return null;
        return toWorkspaceEntity(snap.id, snap.data());
    }
    async findByIdForAccount(accountId, workspaceId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "workspaces"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("accountId", "==", accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["documentId"])(), "==", workspaceId));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])(q);
        const snap = snaps.docs[0];
        if (!snap) return null;
        return toWorkspaceEntity(snap.id, snap.data());
    }
    async findAllByAccountId(accountId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "workspaces"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("accountId", "==", accountId));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.docs.map((d)=>toWorkspaceEntity(d.id, d.data()));
    }
    async save(workspace) {
        const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspace.id);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDoc"])(ref, {
            name: workspace.name,
            accountId: workspace.accountId,
            accountType: workspace.accountType,
            lifecycleState: workspace.lifecycleState,
            visibility: workspace.visibility,
            capabilities: workspace.capabilities,
            grants: workspace.grants,
            teamIds: workspace.teamIds,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return workspace.id;
    }
    async updateSettings(command) {
        const updates = {
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        if (command.name !== undefined) updates.name = command.name;
        if (command.visibility !== undefined) updates.visibility = command.visibility;
        if (command.lifecycleState !== undefined) updates.lifecycleState = command.lifecycleState;
        if (command.address !== undefined) updates.address = command.address;
        if (command.personnel !== undefined) updates.personnel = command.personnel;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", command.workspaceId), updates);
    }
    async delete(id) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", id));
    }
    async mountCapabilities(workspaceId, capabilities) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            capabilities: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(...capabilities),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async unmountCapability(workspaceId, capabilityId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId));
        if (!snap.exists()) return;
        const data = snap.data();
        const caps = (data.capabilities ?? []).filter((c)=>c.id !== capabilityId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            capabilities: caps,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async grantTeamAccess(workspaceId, teamId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            teamIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(teamId),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async revokeTeamAccess(workspaceId, teamId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            teamIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayRemove"])(teamId),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async grantIndividualAccess(workspaceId, grant) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            grants: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])(grant),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async revokeIndividualAccess(workspaceId, userId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId));
        if (!snap.exists()) return;
        const data = snap.data();
        const grants = (data.grants ?? []).filter((g)=>g.userId !== userId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            grants,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async createLocation(workspaceId, location) {
        const locationId = crypto.randomUUID();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            locations: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["arrayUnion"])({
                ...location,
                locationId
            }),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return locationId;
    }
    async updateLocation(workspaceId, location) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId));
        if (!snap.exists()) return;
        const data = snap.data();
        const locations = (data.locations ?? []).map((l)=>l.locationId === location.locationId ? location : l);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            locations,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async deleteLocation(workspaceId, locationId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId));
        if (!snap.exists()) return;
        const data = snap.data();
        const locations = (data.locations ?? []).filter((l)=>l.locationId !== locationId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "workspaces", workspaceId), {
            locations,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
}
}),
"[project]/modules/workspace/interfaces/_actions/workspace.actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40a308a42c089c4cd3d119eedf680779dcf995e40f":"createWorkspace","40af2184804a968d4307434c92ca71f71d98dfa515":"updateWorkspaceSettings","40e7bc5e766684777a974b25032fd7a94b5c5334e5":"deleteWorkspace","60380cc676700244e0ad3c0acb837e87a58fed19bf":"authorizeWorkspaceTeam","603da9620d4f71d2a91d22b34cc2b0ca832b994c83":"grantIndividualWorkspaceAccess","606601efded1b4b6f9e86d50f065254ceb1f4f2720":"createWorkspaceWithCapabilities","60b415f4135f495c97c73989ec079bb12051d4810b":"mountCapabilities","60c2a45208cf04e1ccab540b03adacf16f6d32b9dd":"createWorkspaceLocation"},"",""] */ __turbopack_context__.s([
    "authorizeWorkspaceTeam",
    ()=>authorizeWorkspaceTeam,
    "createWorkspace",
    ()=>createWorkspace,
    "createWorkspaceLocation",
    ()=>createWorkspaceLocation,
    "createWorkspaceWithCapabilities",
    ()=>createWorkspaceWithCapabilities,
    "deleteWorkspace",
    ()=>deleteWorkspace,
    "grantIndividualWorkspaceAccess",
    ()=>grantIndividualWorkspaceAccess,
    "mountCapabilities",
    ()=>mountCapabilities,
    "updateWorkspaceSettings",
    ()=>updateWorkspaceSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/application/use-cases/workspace.use-cases.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const workspaceRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseWorkspaceRepository"]();
async function createWorkspace(command) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateWorkspaceUseCase"](workspaceRepo).execute(command);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function createWorkspaceWithCapabilities(command, capabilities) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateWorkspaceWithCapabilitiesUseCase"](workspaceRepo).execute(command, capabilities);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function updateWorkspaceSettings(command) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateWorkspaceSettingsUseCase"](workspaceRepo).execute(command);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function deleteWorkspace(workspaceId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DeleteWorkspaceUseCase"](workspaceRepo).execute(workspaceId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function mountCapabilities(workspaceId, capabilities) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MountCapabilitiesUseCase"](workspaceRepo).execute(workspaceId, capabilities);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CAPABILITIES_MOUNT_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function authorizeWorkspaceTeam(workspaceId, teamId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GrantTeamAccessUseCase"](workspaceRepo).execute(workspaceId, teamId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_TEAM_AUTHORIZE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function grantIndividualWorkspaceAccess(workspaceId, grant) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GrantIndividualAccessUseCase"](workspaceRepo).execute(workspaceId, grant);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_GRANT_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function createWorkspaceLocation(workspaceId, location) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateWorkspaceLocationUseCase"](workspaceRepo).execute(workspaceId, location);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_LOCATION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createWorkspace,
    createWorkspaceWithCapabilities,
    updateWorkspaceSettings,
    deleteWorkspace,
    mountCapabilities,
    authorizeWorkspaceTeam,
    grantIndividualWorkspaceAccess,
    createWorkspaceLocation
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkspace, "40a308a42c089c4cd3d119eedf680779dcf995e40f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkspaceWithCapabilities, "606601efded1b4b6f9e86d50f065254ceb1f4f2720", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateWorkspaceSettings, "40af2184804a968d4307434c92ca71f71d98dfa515", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteWorkspace, "40e7bc5e766684777a974b25032fd7a94b5c5334e5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(mountCapabilities, "60b415f4135f495c97c73989ec079bb12051d4810b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(authorizeWorkspaceTeam, "60380cc676700244e0ad3c0acb837e87a58fed19bf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(grantIndividualWorkspaceAccess, "603da9620d4f71d2a91d22b34cc2b0ca832b994c83", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkspaceLocation, "60c2a45208cf04e1ccab540b03adacf16f6d32b9dd", null);
}),
"[project]/modules/notification/application/use-cases/notification.use-cases.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
;
class DispatchNotificationUseCase {
    notificationRepo;
    constructor(notificationRepo){
        this.notificationRepo = notificationRepo;
    }
    async execute(input) {
        try {
            const notification = await this.notificationRepo.dispatch(input);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(notification.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_DISPATCH_FAILED", err instanceof Error ? err.message : "Failed to dispatch notification");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(notificationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_MARK_READ_FAILED", err instanceof Error ? err.message : "Failed to mark notification as read");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(recipientId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Failed to mark all notifications as read");
        }
    }
}
}),
"[project]/modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseNotificationRepository",
    ()=>FirebaseNotificationRepository
]);
/**
 * FirebaseNotificationRepository — Infrastructure adapter for notifications.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-rsc] (ecmascript)");
;
;
class FirebaseNotificationRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async dispatch(input) {
        const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), {
            recipientId: input.recipientId,
            title: input.title,
            message: input.message,
            type: input.type,
            read: false,
            timestamp: Date.now(),
            sourceEventType: input.sourceEventType ?? null,
            metadata: input.metadata ?? null,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, "notifications", notificationId), {
            read: true
        });
    }
    async markAllAsRead(recipientId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("read", "==", false));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])(q);
        await Promise.all(snaps.docs.map((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])(d.ref, {
                read: true
            })));
    }
    async findByRecipient(recipientId, maxCount = 50) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["orderBy"])("timestamp", "desc"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["limit"])(maxCount));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])(q);
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
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, "notifications"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("recipientId", "==", recipientId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("read", "==", false));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.size;
    }
}
}),
"[project]/modules/notification/interfaces/_actions/notification.actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4022f040e3b75fb00e991105d96de345865740c7d5":"markAllNotificationsRead","402aecfa81a582624542f9ac31612c4dbc4bf60795":"dispatchNotification","60e0b9b1f0ec32b3e7fb944c7e8641e252aa3b5f40":"markNotificationRead"},"",""] */ __turbopack_context__.s([
    "dispatchNotification",
    ()=>dispatchNotification,
    "markAllNotificationsRead",
    ()=>markAllNotificationsRead,
    "markNotificationRead",
    ()=>markNotificationRead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * Notification Server Actions — thin adapter to use cases.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$application$2f$use$2d$cases$2f$notification$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/application/use-cases/notification.use-cases.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$infrastructure$2f$firebase$2f$FirebaseNotificationRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const notificationRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$infrastructure$2f$firebase$2f$FirebaseNotificationRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseNotificationRepository"]();
async function dispatchNotification(input) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$application$2f$use$2d$cases$2f$notification$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DispatchNotificationUseCase"](notificationRepo).execute(input);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_DISPATCH_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function markNotificationRead(notificationId, recipientId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$application$2f$use$2d$cases$2f$notification$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MarkNotificationReadUseCase"](notificationRepo).execute(notificationId, recipientId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_MARK_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function markAllNotificationsRead(recipientId) {
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$application$2f$use$2d$cases$2f$notification$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MarkAllNotificationsReadUseCase"](notificationRepo).execute(recipientId);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("NOTIFICATION_MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    dispatchNotification,
    markNotificationRead,
    markAllNotificationsRead
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(dispatchNotification, "402aecfa81a582624542f9ac31612c4dbc4bf60795", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markNotificationRead, "60e0b9b1f0ec32b3e7fb944c7e8641e252aa3b5f40", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markAllNotificationsRead, "4022f040e3b75fb00e991105d96de345865740c7d5", null);
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/modules/asset/application/use-cases/register-uploaded-rag-document.use-case.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegisterUploadedRagDocumentUseCase",
    ()=>RegisterUploadedRagDocumentUseCase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
class RegisterUploadedRagDocumentUseCase {
    ragDocumentRepository;
    constructor(ragDocumentRepository){
        this.ragDocumentRepository = ragDocumentRepository;
    }
    async execute(input) {
        const organizationId = input.organizationId.trim();
        const workspaceId = input.workspaceId.trim();
        const accountId = input.accountId.trim();
        const title = input.title.trim();
        const sourceFileName = input.sourceFileName.trim();
        const mimeType = input.mimeType.trim();
        const storagePath = input.storagePath.trim();
        if (!organizationId) {
            return {
                ok: false,
                error: {
                    code: "RAG_ORGANIZATION_REQUIRED",
                    message: "Organization is required."
                }
            };
        }
        if (!workspaceId) {
            return {
                ok: false,
                error: {
                    code: "RAG_WORKSPACE_REQUIRED",
                    message: "Workspace is required."
                }
            };
        }
        if (!accountId) {
            return {
                ok: false,
                error: {
                    code: "RAG_ACCOUNT_ID_REQUIRED",
                    message: "Account ID is required."
                }
            };
        }
        if (!title) {
            return {
                ok: false,
                error: {
                    code: "RAG_TITLE_REQUIRED",
                    message: "Document title is required."
                }
            };
        }
        if (!sourceFileName) {
            return {
                ok: false,
                error: {
                    code: "RAG_FILE_NAME_REQUIRED",
                    message: "Source file name is required."
                }
            };
        }
        if (!mimeType) {
            return {
                ok: false,
                error: {
                    code: "RAG_MIME_TYPE_REQUIRED",
                    message: "Mime type is required."
                }
            };
        }
        if (!storagePath) {
            return {
                ok: false,
                error: {
                    code: "RAG_STORAGE_PATH_REQUIRED",
                    message: "Storage path is required."
                }
            };
        }
        const nowISO = new Date().toISOString();
        const documentId = `rag-document-${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])()}`;
        const versionGroupId = input.versionGroupId?.trim() ? input.versionGroupId.trim() : documentId;
        await this.ragDocumentRepository.saveUploaded({
            id: documentId,
            organizationId,
            workspaceId,
            accountId,
            displayName: sourceFileName,
            title,
            sourceFileName,
            mimeType,
            storagePath,
            sizeBytes: input.sizeBytes ?? 0,
            status: "uploaded",
            checksum: input.checksum?.trim() || undefined,
            taxonomy: input.taxonomy?.trim() || undefined,
            category: input.category?.trim() || undefined,
            department: input.department?.trim() || undefined,
            tags: input.tags ?? [],
            language: input.language?.trim() || undefined,
            accessControl: input.accessControl ?? [],
            versionGroupId,
            versionNumber: input.versionNumber ?? 1,
            isLatest: true,
            updateLog: input.updateLog?.trim() || undefined,
            expiresAtISO: input.expiresAtISO?.trim() || undefined,
            createdAtISO: nowISO,
            updatedAtISO: nowISO
        });
        return {
            ok: true,
            data: {
                documentId,
                status: "uploaded",
                registeredAtISO: nowISO
            }
        };
    }
}
}),
"[project]/modules/asset/domain/services/complete-upload-file.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "completeUploadFile",
    ()=>completeUploadFile
]);
function completeUploadFile(input) {
    return {
        ...input.file,
        status: "active",
        updatedAtISO: input.completedAtISO,
        source: "file-upload-complete",
        detail: "File upload completed; status set to active and metadata timestamp finalized."
    };
}
}),
"[project]/modules/asset/application/use-cases/upload-complete-file.use-case.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UploadCompleteFileUseCase",
    ()=>UploadCompleteFileUseCase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$domain$2f$services$2f$complete$2d$upload$2d$file$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/domain/services/complete-upload-file.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$register$2d$uploaded$2d$rag$2d$document$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/application/use-cases/register-uploaded-rag-document.use-case.ts [app-rsc] (ecmascript)");
;
;
function isFileScopeMatch(input) {
    return input.file.workspaceId === input.workspaceId && input.file.organizationId === input.organizationId && input.file.accountId === input.actorAccountId && input.file.currentVersionId === input.versionId;
}
function isFileAlreadyCompleted(file) {
    return file.source === "file-upload-complete";
}
class UploadCompleteFileUseCase {
    fileRepository;
    ragDocumentRepository;
    constructor(fileRepository, ragDocumentRepository){
        this.fileRepository = fileRepository;
        this.ragDocumentRepository = ragDocumentRepository;
    }
    async execute(input) {
        const workspaceId = input.workspaceId.trim();
        const organizationId = input.organizationId.trim();
        const actorAccountId = input.actorAccountId.trim();
        const fileId = input.fileId.trim();
        const versionId = input.versionId.trim();
        if (!workspaceId) {
            return {
                ok: false,
                error: {
                    code: "FILE_WORKSPACE_REQUIRED",
                    message: "Workspace is required."
                }
            };
        }
        if (!organizationId) {
            return {
                ok: false,
                error: {
                    code: "FILE_ORGANIZATION_REQUIRED",
                    message: "Organization is required."
                }
            };
        }
        if (!actorAccountId) {
            return {
                ok: false,
                error: {
                    code: "FILE_ACTOR_REQUIRED",
                    message: "Actor account is required."
                }
            };
        }
        if (!fileId) {
            return {
                ok: false,
                error: {
                    code: "FILE_ID_REQUIRED",
                    message: "File id is required."
                }
            };
        }
        if (!versionId) {
            return {
                ok: false,
                error: {
                    code: "FILE_VERSION_REQUIRED",
                    message: "Version id is required."
                }
            };
        }
        const file = await this.fileRepository.findById(fileId);
        if (!file) {
            return {
                ok: false,
                error: {
                    code: "FILE_NOT_FOUND",
                    message: "File metadata not found."
                }
            };
        }
        const version = await this.fileRepository.findVersion(fileId, versionId);
        if (!version) {
            return {
                ok: false,
                error: {
                    code: "FILE_VERSION_NOT_FOUND",
                    message: "File version metadata not found."
                }
            };
        }
        if (!isFileScopeMatch({
            file,
            workspaceId,
            organizationId,
            actorAccountId,
            versionId
        })) {
            return {
                ok: false,
                error: {
                    code: "FILE_SCOPE_MISMATCH",
                    message: "Upload completion scope does not match file metadata."
                }
            };
        }
        if (file.status !== "active") {
            return {
                ok: false,
                error: {
                    code: "FILE_STATUS_CONFLICT",
                    message: "File upload completion requires an active file record."
                }
            };
        }
        const existingRagDocument = await this.ragDocumentRepository.findByStoragePath({
            organizationId,
            workspaceId,
            storagePath: version.storagePath
        });
        const nextFile = isFileAlreadyCompleted(file) ? file : (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$domain$2f$services$2f$complete$2d$upload$2d$file$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["completeUploadFile"])({
            file,
            completedAtISO: new Date().toISOString()
        });
        if (!isFileAlreadyCompleted(file)) {
            await this.fileRepository.save(nextFile);
        }
        const ragDocument = existingRagDocument === null ? await (async ()=>{
            const registerUploadedRagDocumentUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$register$2d$uploaded$2d$rag$2d$document$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RegisterUploadedRagDocumentUseCase"](this.ragDocumentRepository);
            const ragDocumentResult = await registerUploadedRagDocumentUseCase.execute({
                organizationId,
                workspaceId,
                accountId: actorAccountId,
                title: file.name,
                sourceFileName: file.name,
                mimeType: file.mimeType,
                storagePath: version.storagePath,
                sizeBytes: file.sizeBytes,
                checksum: version.checksum,
                versionNumber: version.versionNumber
            });
            if (!ragDocumentResult.ok) {
                return ragDocumentResult;
            }
            return {
                ok: true,
                data: {
                    documentId: ragDocumentResult.data.documentId,
                    status: ragDocumentResult.data.status
                }
            };
        })() : {
            ok: true,
            data: {
                documentId: existingRagDocument.id,
                status: existingRagDocument.status
            }
        };
        if (ragDocument.ok === false) {
            return {
                ok: false,
                error: {
                    code: "FILE_RAG_REGISTRATION_FAILED",
                    message: ragDocument.error.message
                }
            };
        }
        return {
            ok: true,
            data: {
                fileId: nextFile.id,
                versionId: nextFile.currentVersionId,
                status: "active",
                ragDocumentId: ragDocument.data.documentId,
                ragDocumentStatus: ragDocument.data.status
            }
        };
    }
}
}),
"[project]/modules/asset/application/use-cases/upload-init-file.use-case.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UploadInitFileUseCase",
    ()=>UploadInitFileUseCase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
function inferClassification(mimeType) {
    if (mimeType.startsWith("image/")) {
        return "image";
    }
    if (mimeType.includes("json")) {
        return "manifest";
    }
    return "other";
}
function buildUploadPath(organizationId, workspaceId, fileId, fileName) {
    const encodedName = encodeURIComponent(fileName.replace(/\s+/g, "-"));
    return `organizations/${organizationId}/workspaces/${workspaceId}/files/${fileId}/${encodedName}`;
}
class UploadInitFileUseCase {
    fileRepository;
    constructor(fileRepository){
        this.fileRepository = fileRepository;
    }
    async execute(input) {
        const workspaceId = input.workspaceId.trim();
        const organizationId = input.organizationId.trim();
        const actorAccountId = input.actorAccountId.trim();
        const fileName = input.fileName.trim();
        if (!workspaceId) {
            return {
                ok: false,
                error: {
                    code: "FILE_WORKSPACE_REQUIRED",
                    message: "Workspace is required."
                }
            };
        }
        if (!organizationId) {
            return {
                ok: false,
                error: {
                    code: "FILE_ORGANIZATION_REQUIRED",
                    message: "Organization is required."
                }
            };
        }
        if (!actorAccountId) {
            return {
                ok: false,
                error: {
                    code: "FILE_ACTOR_REQUIRED",
                    message: "Actor account is required."
                }
            };
        }
        if (!fileName) {
            return {
                ok: false,
                error: {
                    code: "FILE_NAME_REQUIRED",
                    message: "File name is required."
                }
            };
        }
        if (!Number.isFinite(input.sizeBytes) || input.sizeBytes <= 0) {
            return {
                ok: false,
                error: {
                    code: "FILE_INVALID_SIZE",
                    message: "File size must be a positive number."
                }
            };
        }
        const createdAtISO = new Date().toISOString();
        const fileId = `file-${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])()}`;
        const versionId = `file-version-${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])()}`;
        const uploadPath = buildUploadPath(organizationId, workspaceId, fileId, fileName);
        const file = {
            id: fileId,
            workspaceId,
            organizationId,
            accountId: actorAccountId,
            name: fileName,
            mimeType: input.mimeType,
            sizeBytes: input.sizeBytes,
            classification: inferClassification(input.mimeType),
            tags: [],
            currentVersionId: versionId,
            status: "active",
            source: "file-upload-init",
            detail: "File metadata persisted before binary upload is completed.",
            createdAtISO,
            updatedAtISO: createdAtISO
        };
        const version = {
            id: versionId,
            fileId,
            versionNumber: 1,
            status: "pending",
            storagePath: uploadPath,
            createdAtISO
        };
        await this.fileRepository.save(file, [
            version
        ]);
        return {
            ok: true,
            data: {
                fileId,
                versionId,
                uploadPath,
                uploadToken: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("base64url"),
                expiresAtISO: new Date(Date.now() + 15 * 60 * 1000).toISOString()
            }
        };
    }
}
}),
"[project]/modules/asset/infrastructure/firebase/FirebaseFileRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseFileRepository",
    ()=>FirebaseFileRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-rsc] (ecmascript)");
;
;
const FILE_COLLECTION = "workspaceFiles";
const VERSION_SUBCOLLECTION = "versions";
function isFileStatus(value) {
    return value === "active" || value === "archived" || value === "deleted";
}
function isFileClassification(value) {
    return value === "image" || value === "manifest" || value === "record" || value === "other";
}
function toStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((item)=>typeof item === "string");
}
function toFileEntity(fileId, data) {
    return {
        id: fileId,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
        organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        name: typeof data.name === "string" ? data.name : "",
        mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
        sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
        classification: isFileClassification(data.classification) ? data.classification : "other",
        tags: toStringArray(data.tags),
        currentVersionId: typeof data.currentVersionId === "string" ? data.currentVersionId : "",
        retentionPolicyId: typeof data.retentionPolicyId === "string" ? data.retentionPolicyId : undefined,
        status: isFileStatus(data.status) ? data.status : "active",
        source: typeof data.source === "string" ? data.source : undefined,
        detail: typeof data.detail === "string" ? data.detail : undefined,
        href: typeof data.href === "string" ? data.href : undefined,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
        deletedAtISO: typeof data.deletedAtISO === "string" ? data.deletedAtISO : undefined
    };
}
function isFileVersionStatus(value) {
    return value === "pending" || value === "stored" || value === "active" || value === "superseded";
}
function toFileVersionEntity(versionId, data) {
    return {
        id: versionId,
        fileId: typeof data.fileId === "string" ? data.fileId : "",
        versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 0,
        status: isFileVersionStatus(data.status) ? data.status : "pending",
        storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
        checksum: typeof data.checksum === "string" ? data.checksum : undefined,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : ""
    };
}
class FirebaseFileRepository {
    db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    get collectionRef() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, FILE_COLLECTION);
    }
    async findById(fileId) {
        const normalizedFileId = fileId.trim();
        if (!normalizedFileId) {
            return null;
        }
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, FILE_COLLECTION, normalizedFileId));
        if (!snapshot.exists()) {
            return null;
        }
        return toFileEntity(snapshot.id, snapshot.data());
    }
    async findVersion(fileId, versionId) {
        const normalizedFileId = fileId.trim();
        const normalizedVersionId = versionId.trim();
        if (!normalizedFileId || !normalizedVersionId) {
            return null;
        }
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, FILE_COLLECTION, normalizedFileId, VERSION_SUBCOLLECTION, normalizedVersionId));
        if (!snapshot.exists()) {
            return null;
        }
        return toFileVersionEntity(snapshot.id, snapshot.data());
    }
    async listByWorkspace(scope) {
        const workspaceId = scope.workspaceId.trim();
        const organizationId = scope.organizationId.trim();
        if (!workspaceId) {
            return [];
        }
        const snapshots = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(this.collectionRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("workspaceId", "==", workspaceId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("organizationId", "==", organizationId)));
        return snapshots.docs.map((snapshot)=>toFileEntity(snapshot.id, snapshot.data())).sort((left, right)=>right.updatedAtISO.localeCompare(left.updatedAtISO));
    }
    async save(file, versions = []) {
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        const fileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, FILE_COLLECTION, file.id);
        batch.set(fileRef, {
            workspaceId: file.workspaceId,
            organizationId: file.organizationId,
            accountId: file.accountId,
            name: file.name,
            mimeType: file.mimeType,
            sizeBytes: file.sizeBytes,
            classification: file.classification,
            tags: [
                ...file.tags
            ],
            currentVersionId: file.currentVersionId,
            ...file.retentionPolicyId ? {
                retentionPolicyId: file.retentionPolicyId
            } : {},
            status: file.status,
            ...file.source ? {
                source: file.source
            } : {},
            ...file.detail ? {
                detail: file.detail
            } : {},
            ...file.href ? {
                href: file.href
            } : {},
            createdAtISO: file.createdAtISO,
            updatedAtISO: file.updatedAtISO,
            ...file.deletedAtISO ? {
                deletedAtISO: file.deletedAtISO
            } : {}
        });
        versions.forEach((version)=>{
            batch.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(fileRef, VERSION_SUBCOLLECTION, version.id), {
                fileId: version.fileId,
                versionNumber: version.versionNumber,
                status: version.status,
                storagePath: version.storagePath,
                ...version.checksum ? {
                    checksum: version.checksum
                } : {},
                createdAtISO: version.createdAtISO
            });
        });
        await batch.commit();
    }
}
}),
"[project]/modules/asset/infrastructure/firebase/FirebaseRagDocumentRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseRagDocumentRepository",
    ()=>FirebaseRagDocumentRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-rsc] (ecmascript)");
;
;
function buildKnowledgeDocumentRef(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firebaseClientApp"]), "knowledge_base", input.organizationId, "workspaces", input.workspaceId, "documents", input.documentId);
}
function buildKnowledgeDocumentsCollection(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firebaseClientApp"]), "knowledge_base", input.organizationId, "workspaces", input.workspaceId, "documents");
}
function toStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((item)=>typeof item === "string");
}
function toRagDocumentRecord(documentId, data, fallbackScope) {
    return {
        id: documentId,
        organizationId: typeof data.organizationId === "string" ? data.organizationId : fallbackScope.organizationId,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : fallbackScope.workspaceId,
        displayName: typeof data.displayName === "string" && data.displayName || typeof data.sourceFileName === "string" && data.sourceFileName || "",
        title: typeof data.title === "string" ? data.title : "",
        sourceFileName: typeof data.sourceFileName === "string" ? data.sourceFileName : "",
        mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
        storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
        sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
        status: data.status === "uploaded" || data.status === "processing" || data.status === "ready" || data.status === "failed" || data.status === "archived" ? data.status : "uploaded",
        statusMessage: typeof data.statusMessage === "string" ? data.statusMessage : undefined,
        checksum: typeof data.checksum === "string" ? data.checksum : undefined,
        taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : undefined,
        category: typeof data.category === "string" ? data.category : undefined,
        department: typeof data.department === "string" ? data.department : undefined,
        tags: toStringArray(data.tags),
        language: typeof data.language === "string" ? data.language : undefined,
        accessControl: toStringArray(data.accessControl),
        versionGroupId: typeof data.versionGroupId === "string" ? data.versionGroupId : documentId,
        versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 1,
        isLatest: typeof data.isLatest === "boolean" ? data.isLatest : true,
        updateLog: typeof data.updateLog === "string" ? data.updateLog : undefined,
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        chunkCount: typeof data.chunkCount === "number" ? data.chunkCount : undefined,
        indexedAtISO: typeof data.indexedAtISO === "string" ? data.indexedAtISO : undefined,
        expiresAtISO: typeof data.expiresAtISO === "string" ? data.expiresAtISO : undefined,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : ""
    };
}
class FirebaseRagDocumentRepository {
    async findByStoragePath(scope) {
        const snapshots = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(buildKnowledgeDocumentsCollection({
            organizationId: scope.organizationId,
            workspaceId: scope.workspaceId
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("storagePath", "==", scope.storagePath), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["limit"])(1)));
        const [firstMatch] = snapshots.docs;
        if (!firstMatch) {
            return null;
        }
        return toRagDocumentRecord(firstMatch.id, firstMatch.data(), {
            organizationId: scope.organizationId,
            workspaceId: scope.workspaceId
        });
    }
    async findByWorkspace(scope) {
        const snapshots = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(buildKnowledgeDocumentsCollection({
            organizationId: scope.organizationId,
            workspaceId: scope.workspaceId
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["orderBy"])("createdAtISO", "desc")));
        return snapshots.docs.map((docSnap)=>toRagDocumentRecord(docSnap.id, docSnap.data(), {
                organizationId: scope.organizationId,
                workspaceId: scope.workspaceId
            }));
    }
    async saveUploaded(record) {
        const documentRef = buildKnowledgeDocumentRef({
            organizationId: record.organizationId,
            workspaceId: record.workspaceId,
            documentId: record.id
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDoc"])(documentRef, {
            // Duplicate the document id in the payload so collection-group consumers can project
            // a stable field without depending on Firestore snapshot metadata.
            id: record.id,
            organizationId: record.organizationId,
            workspaceId: record.workspaceId,
            displayName: record.displayName,
            title: record.title,
            sourceFileName: record.sourceFileName,
            mimeType: record.mimeType,
            storagePath: record.storagePath,
            sizeBytes: record.sizeBytes,
            status: record.status,
            ...record.statusMessage ? {
                statusMessage: record.statusMessage
            } : {},
            ...record.checksum ? {
                checksum: record.checksum
            } : {},
            ...record.taxonomy ? {
                taxonomy: record.taxonomy
            } : {},
            ...record.category ? {
                category: record.category
            } : {},
            ...record.department ? {
                department: record.department
            } : {},
            tags: record.tags ?? [],
            ...record.language ? {
                language: record.language
            } : {},
            accessControl: record.accessControl ?? [],
            versionGroupId: record.versionGroupId,
            versionNumber: record.versionNumber,
            isLatest: record.isLatest,
            ...record.updateLog ? {
                updateLog: record.updateLog
            } : {},
            accountId: record.accountId,
            ...record.chunkCount !== undefined ? {
                chunkCount: record.chunkCount
            } : {},
            ...record.indexedAtISO ? {
                indexedAtISO: record.indexedAtISO
            } : {},
            ...record.expiresAtISO ? {
                expiresAtISO: record.expiresAtISO
            } : {},
            createdAtISO: record.createdAtISO,
            updatedAtISO: record.updatedAtISO,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
}
}),
"[project]/modules/knowledge/domain/entities/IngestionJob.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALLOWED_INGESTION_STATUS_TRANSITIONS",
    ()=>ALLOWED_INGESTION_STATUS_TRANSITIONS,
    "canTransitionIngestionStatus",
    ()=>canTransitionIngestionStatus
]);
const ALLOWED_INGESTION_STATUS_TRANSITIONS = {
    uploaded: [
        "parsing",
        "failed"
    ],
    parsing: [
        "chunking",
        "failed"
    ],
    chunking: [
        "embedding",
        "failed"
    ],
    embedding: [
        "indexed",
        "failed"
    ],
    indexed: [
        "stale",
        "re-indexing"
    ],
    stale: [
        "re-indexing"
    ],
    "re-indexing": [
        "parsing",
        "failed"
    ],
    failed: [
        "re-indexing"
    ]
};
function canTransitionIngestionStatus(fromStatus, toStatus) {
    return ALLOWED_INGESTION_STATUS_TRANSITIONS[fromStatus].includes(toStatus);
}
}),
"[project]/modules/knowledge/application/use-cases/advance-ingestion-stage.use-case.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdvanceIngestionStageUseCase",
    ()=>AdvanceIngestionStageUseCase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$domain$2f$entities$2f$IngestionJob$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge/domain/entities/IngestionJob.ts [app-rsc] (ecmascript)");
;
class AdvanceIngestionStageUseCase {
    ingestionJobRepository;
    constructor(ingestionJobRepository){
        this.ingestionJobRepository = ingestionJobRepository;
    }
    async execute(input) {
        const documentId = input.documentId.trim();
        if (!documentId) {
            return {
                ok: false,
                error: {
                    code: "KN_DOCUMENT_REQUIRED",
                    message: "Document id is required."
                }
            };
        }
        const job = await this.ingestionJobRepository.findByDocumentId(documentId);
        if (!job) {
            return {
                ok: false,
                error: {
                    code: "KN_DOCUMENT_NOT_FOUND",
                    message: "Ingestion document not found."
                }
            };
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$domain$2f$entities$2f$IngestionJob$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canTransitionIngestionStatus"])(job.status, input.nextStatus)) {
            return {
                ok: false,
                error: {
                    code: "KN_INVALID_STATUS_TRANSITION",
                    message: `Cannot transition ingestion status from ${job.status} to ${input.nextStatus}.`
                }
            };
        }
        const updated = await this.ingestionJobRepository.updateStatus({
            documentId,
            status: input.nextStatus,
            statusMessage: input.statusMessage,
            updatedAtISO: new Date().toISOString()
        });
        if (!updated) {
            return {
                ok: false,
                error: {
                    code: "KN_UPDATE_FAILED",
                    message: "Failed to update ingestion status."
                }
            };
        }
        return {
            ok: true,
            data: updated
        };
    }
}
}),
"[project]/modules/knowledge/application/use-cases/register-ingestion-document.use-case.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegisterIngestionDocumentUseCase",
    ()=>RegisterIngestionDocumentUseCase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
class RegisterIngestionDocumentUseCase {
    ingestionJobRepository;
    constructor(ingestionJobRepository){
        this.ingestionJobRepository = ingestionJobRepository;
    }
    async execute(input) {
        const organizationId = input.organizationId.trim();
        const workspaceId = input.workspaceId.trim();
        const sourceFileId = input.sourceFileId.trim();
        const title = input.title.trim();
        const mimeType = input.mimeType.trim();
        if (!organizationId) {
            return {
                ok: false,
                error: {
                    code: "KN_ORGANIZATION_REQUIRED",
                    message: "Organization is required."
                }
            };
        }
        if (!workspaceId) {
            return {
                ok: false,
                error: {
                    code: "KN_WORKSPACE_REQUIRED",
                    message: "Workspace is required."
                }
            };
        }
        if (!sourceFileId) {
            return {
                ok: false,
                error: {
                    code: "KN_SOURCE_FILE_REQUIRED",
                    message: "Source file id is required."
                }
            };
        }
        if (!title) {
            return {
                ok: false,
                error: {
                    code: "KN_TITLE_REQUIRED",
                    message: "Document title is required."
                }
            };
        }
        if (!mimeType) {
            return {
                ok: false,
                error: {
                    code: "KN_MIME_TYPE_REQUIRED",
                    message: "Mime type is required."
                }
            };
        }
        const now = new Date().toISOString();
        const document = {
            id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
            organizationId,
            workspaceId,
            sourceFileId,
            title,
            mimeType,
            createdAtISO: now,
            updatedAtISO: now
        };
        const job = {
            id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
            document,
            status: "uploaded",
            updatedAtISO: now
        };
        await this.ingestionJobRepository.save(job);
        return {
            ok: true,
            data: job
        };
    }
}
}),
"[project]/modules/knowledge/infrastructure/InMemoryIngestionJobRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InMemoryIngestionJobRepository",
    ()=>InMemoryIngestionJobRepository
]);
class InMemoryIngestionJobRepository {
    jobsByDocumentId = new Map();
    async findByDocumentId(documentId) {
        return this.jobsByDocumentId.get(documentId) ?? null;
    }
    async listByWorkspace(input) {
        return [
            ...this.jobsByDocumentId.values()
        ].filter((job)=>job.document.organizationId === input.organizationId && job.document.workspaceId === input.workspaceId);
    }
    async save(job) {
        this.jobsByDocumentId.set(job.document.id, job);
    }
    async updateStatus(input) {
        const current = this.jobsByDocumentId.get(input.documentId);
        if (!current) {
            return null;
        }
        const updated = {
            ...current,
            status: input.status,
            statusMessage: input.statusMessage,
            updatedAtISO: input.updatedAtISO,
            document: {
                ...current.document,
                updatedAtISO: input.updatedAtISO
            }
        };
        this.jobsByDocumentId.set(input.documentId, updated);
        return updated;
    }
}
}),
"[project]/modules/knowledge/api/knowledge-ingestion-api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KnowledgeIngestionApi",
    ()=>KnowledgeIngestionApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$application$2f$use$2d$cases$2f$advance$2d$ingestion$2d$stage$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge/application/use-cases/advance-ingestion-stage.use-case.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$application$2f$use$2d$cases$2f$register$2d$ingestion$2d$document$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge/application/use-cases/register-ingestion-document.use-case.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$infrastructure$2f$InMemoryIngestionJobRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge/infrastructure/InMemoryIngestionJobRepository.ts [app-rsc] (ecmascript)");
;
;
;
class KnowledgeIngestionApi {
    repository = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$infrastructure$2f$InMemoryIngestionJobRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["InMemoryIngestionJobRepository"]();
    registerUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$application$2f$use$2d$cases$2f$register$2d$ingestion$2d$document$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RegisterIngestionDocumentUseCase"](this.repository);
    advanceUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$application$2f$use$2d$cases$2f$advance$2d$ingestion$2d$stage$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AdvanceIngestionStageUseCase"](this.repository);
    async registerDocument(input) {
        return this.registerUseCase.execute(input);
    }
    async advanceStage(input) {
        return this.advanceUseCase.execute(input);
    }
    async listWorkspaceJobs(input) {
        return this.repository.listByWorkspace(input);
    }
}
}),
"[project]/modules/knowledge-graph/infrastructure/InMemoryGraphRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * modules/knowledge-graph — infrastructure/in-memory
 * Purpose: In-memory adapter for GraphRepository.
 *          Uses plain Map — no external database required.
 *          Designed for local demos and unit tests.
 */ __turbopack_context__.s([
    "InMemoryGraphRepository",
    ()=>InMemoryGraphRepository
]);
class InMemoryGraphRepository {
    nodes = new Map();
    links = new Map();
    async upsertNode(node) {
        this.nodes.set(node.id, node);
    }
    async addLink(link) {
        this.links.set(link.id, link);
    }
    async findLinksBySourceId(sourceId) {
        return [
            ...this.links.values()
        ].filter((l)=>l.sourceId === sourceId);
    }
    async findLinksByTargetId(targetId) {
        return [
            ...this.links.values()
        ].filter((l)=>l.targetId === targetId);
    }
    async findLinksByType(type) {
        return [
            ...this.links.values()
        ].filter((l)=>l.type === type);
    }
    async listNodes() {
        return [
            ...this.nodes.values()
        ];
    }
    async listLinks() {
        return [
            ...this.links.values()
        ];
    }
}
}),
"[project]/packages/lib-uuid/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @module libs/uuid
 * Thin wrapper for uuid v13.
 *
 * Provides stable import paths for RFC-compliant UUID generation and
 * validation.  All functions are pure and safe to import from any layer.
 *
 *   v4  — random UUID (general-purpose, most common)
 *   v7  — time-ordered random UUID (preferred for database primary keys;
 *          monotonically increasing within the same millisecond)
 *
 * Usage:
 *   import { v4, v7 } from "@/libs/uuid";
 *   const id     = v4();            // "110e8400-e29b-41d4-a716-446655440000"
 *   const dbKey  = v7();            // time-sortable UUID for Firestore docs
 *   const isUUID = validate(id);    // true
 */ // ── Generators ─────────────────────────────────────────────────────────────
__turbopack_context__.s([]);
;
;
;
;
}),
"[project]/modules/shared/domain/events/content-updated.event.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-rsc] (ecmascript) <export default as v7>");
;
const CONTENT_UPDATED_EVENT_TYPE = "content.block-updated";
function createContentUpdatedEvent(pageId, blockId, content) {
    return {
        eventId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
        type: CONTENT_UPDATED_EVENT_TYPE,
        aggregateId: blockId,
        occurredAt: new Date().toISOString(),
        pageId,
        blockId,
        content
    };
}
}),
"[project]/modules/knowledge-graph/application/link-extractor.service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LinkExtractorService",
    ()=>LinkExtractorService
]);
/**
 * modules/knowledge-graph — application
 * Purpose: LinkExtractorService — subscribes to ContentUpdatedEvent and
 *          extracts [[WikiLink]] references to build graph edges.
 *
 * Wikilink syntax: [[Target Page Name]]
 *   - The target label becomes both the node id (lowercased slug) and label.
 *   - Links are of type "explicit" (user-authored inline reference).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$shared$2f$domain$2f$events$2f$content$2d$updated$2e$event$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/shared/domain/events/content-updated.event.ts [app-rsc] (ecmascript)");
;
const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;
function slugify(label) {
    return label.trim().toLowerCase().replace(/\s+/g, "-");
}
class LinkExtractorService {
    graphRepo;
    constructor(graphRepo){
        this.graphRepo = graphRepo;
    }
    /**
   * Register this service as a subscriber on the provided event bus.
   * Call once during application bootstrap.
   */ registerOn(eventBus) {
        eventBus.subscribe(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$shared$2f$domain$2f$events$2f$content$2d$updated$2e$event$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CONTENT_UPDATED_EVENT_TYPE"], this.handleContentUpdated.bind(this));
    }
    /**
   * React to a ContentUpdatedEvent:
   * 1. Parse all [[WikiLink]] targets from the new content.
   * 2. Upsert a GraphNode for each target.
   * 3. Create an explicit Link from the source page to each target.
   */ async handleContentUpdated(event) {
        const targets = this.extractWikiLinks(event.content);
        for (const targetLabel of targets){
            const targetId = slugify(targetLabel);
            // Ensure the target node exists in the graph.
            await this.graphRepo.upsertNode({
                id: targetId,
                label: targetLabel.trim(),
                type: "page"
            });
            // Create a directed edge from the source page to the target.
            const linkId = `${event.pageId}→${targetId}`;
            await this.graphRepo.addLink({
                id: linkId,
                sourceId: event.pageId,
                targetId,
                type: "explicit"
            });
        }
    }
    /** Extract all [[…]] targets from a content string. */ extractWikiLinks(content) {
        const targets = [];
        let match;
        WIKI_LINK_REGEX.lastIndex = 0;
        while((match = WIKI_LINK_REGEX.exec(content)) !== null){
            const label = match[1];
            if (label) targets.push(label);
        }
        return targets;
    }
}
}),
"[project]/modules/knowledge-graph/api/knowledge-graph-api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * modules/knowledge-graph — api/knowledge-graph-api
 * Layer: api (cross-module facade)
 * Purpose: KnowledgeGraphApi — lightweight facade that wires in-memory
 *          adapters and exposes the knowledge-graph surface needed by
 *          consumers (e.g. system.ts composition root, debug pages).
 *
 * Bootstraps the LinkExtractorService and registers it on the shared event
 * bus so the knowledge-graph module reacts to content changes automatically.
 */ __turbopack_context__.s([
    "KnowledgeGraphApi",
    ()=>KnowledgeGraphApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2d$graph$2f$application$2f$link$2d$extractor$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge-graph/application/link-extractor.service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2d$graph$2f$infrastructure$2f$InMemoryGraphRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge-graph/infrastructure/InMemoryGraphRepository.ts [app-rsc] (ecmascript)");
;
;
class KnowledgeGraphApi {
    graphRepo;
    linkExtractor;
    constructor(eventBus){
        this.graphRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2d$graph$2f$infrastructure$2f$InMemoryGraphRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["InMemoryGraphRepository"]();
        this.linkExtractor = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2d$graph$2f$application$2f$link$2d$extractor$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LinkExtractorService"](this.graphRepo);
        this.linkExtractor.registerOn(eventBus);
    }
    /** Return all nodes currently in the graph. */ async listNodes() {
        return this.graphRepo.listNodes();
    }
    /** Return all links currently in the graph. */ async listLinks() {
        return this.graphRepo.listLinks();
    }
    /** Return outgoing explicit links from a given source page. */ async getOutgoingLinks(pageId) {
        return this.graphRepo.findLinksBySourceId(pageId);
    }
    /**
   * Return a GraphDataDTO summarising the full in-memory graph.
   * Shape: `{ nodes: [...], edges: [...] }`.
   */ async getGraphData() {
        const [nodes, links] = await Promise.all([
            this.graphRepo.listNodes(),
            this.graphRepo.listLinks()
        ]);
        return {
            nodes: nodes.map((n)=>({
                    id: n.id,
                    label: n.label,
                    group: n.type
                })),
            edges: links.map((l)=>({
                    from: l.sourceId,
                    to: l.targetId,
                    type: l.type
                }))
        };
    }
}
}),
"[project]/modules/knowledge/api/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * modules/knowledge — public API barrel.
 *
 * @deprecated All graph symbols have moved to modules/knowledge-graph.
 * This barrel is a temporary re-export bridge.
 * This module (knowledge) is being repurposed for Layer 2 Ingestion Pipeline.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$api$2f$knowledge$2d$ingestion$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge/api/knowledge-ingestion-api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2d$graph$2f$infrastructure$2f$InMemoryGraphRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge-graph/infrastructure/InMemoryGraphRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2d$graph$2f$application$2f$link$2d$extractor$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge-graph/application/link-extractor.service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2d$graph$2f$api$2f$knowledge$2d$graph$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge-graph/api/knowledge-graph-api.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/modules/asset/interfaces/_actions/file.actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4020cffc0142bb9d5c55c1766585b676e0ebc0028c":"registerUploadedRagDocument","4067b68307f0349ed04dd488d1b366c69ee93db14d":"uploadCompleteFile","40ae90a46eb874ae059c11615225a78d26448a3b54":"uploadInitFile"},"",""] */ __turbopack_context__.s([
    "registerUploadedRagDocument",
    ()=>registerUploadedRagDocument,
    "uploadCompleteFile",
    ()=>uploadCompleteFile,
    "uploadInitFile",
    ()=>uploadInitFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$register$2d$uploaded$2d$rag$2d$document$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/application/use-cases/register-uploaded-rag-document.use-case.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$upload$2d$complete$2d$file$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/application/use-cases/upload-complete-file.use-case.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$upload$2d$init$2d$file$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/application/use-cases/upload-init-file.use-case.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseFileRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/infrastructure/firebase/FirebaseFileRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseRagDocumentRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/infrastructure/firebase/FirebaseRagDocumentRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$api$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/knowledge/api/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$api$2f$knowledge$2d$ingestion$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/knowledge/api/knowledge-ingestion-api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const knowledgeIngestionApi = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$knowledge$2f$api$2f$knowledge$2d$ingestion$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnowledgeIngestionApi"]();
function createCommandId(idempotencyKey) {
    const normalized = idempotencyKey?.trim();
    if (normalized) {
        return normalized;
    }
    return `file-upload-init-${crypto.randomUUID()}`;
}
async function uploadInitFile(input) {
    const commandId = createCommandId(input.idempotencyKey);
    const useCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$upload$2d$init$2d$file$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UploadInitFileUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseFileRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseFileRepository"]());
    const result = await useCase.execute(input);
    return {
        ...result,
        commandId
    };
}
async function uploadCompleteFile(input) {
    const fileRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseFileRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseFileRepository"]();
    const useCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$upload$2d$complete$2d$file$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UploadCompleteFileUseCase"](fileRepository, new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseRagDocumentRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseRagDocumentRepository"]());
    const commandId = createCommandId(input.versionId);
    const result = await useCase.execute(input);
    // Best-effort handoff: upload completion can proceed even if ingestion registration fails.
    if (result.ok) {
        const file = await fileRepository.findById(input.fileId);
        const registration = await knowledgeIngestionApi.registerDocument({
            organizationId: input.organizationId,
            workspaceId: input.workspaceId,
            sourceFileId: input.fileId,
            title: file?.name ?? `uploaded-file-${input.fileId}`,
            mimeType: file?.mimeType ?? "application/octet-stream"
        });
        if (!registration.ok && ("TURBOPACK compile-time value", "development") !== "production") {
            console.warn("[uploadCompleteFile] Knowledge ingestion registration failed:", registration.error.code, registration.error.message);
        }
    }
    return {
        ...result,
        commandId
    };
}
async function registerUploadedRagDocument(input) {
    const useCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$register$2d$uploaded$2d$rag$2d$document$2e$use$2d$case$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RegisterUploadedRagDocumentUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseRagDocumentRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseRagDocumentRepository"]());
    const commandId = createCommandId(input.storagePath);
    const result = await useCase.execute(input);
    return {
        ...result,
        commandId
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    uploadInitFile,
    uploadCompleteFile,
    registerUploadedRagDocument
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadInitFile, "40ae90a46eb874ae059c11615225a78d26448a3b54", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadCompleteFile, "4067b68307f0349ed04dd488d1b366c69ee93db14d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerUploadedRagDocument, "4020cffc0142bb9d5c55c1766585b676e0ebc0028c", null);
}),
"[project]/packages/lib-zod/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @module libs/zod
 * Thin wrapper for Zod v4 schema validation.
 *
 * Provides a single import path for schema definition, validation, and error
 * handling.  Safe to import from Server Components, Client Components,
 * utilities, and domain layers.
 *
 * Usage:
 *   import { z } from "@/libs/zod";
 *
 *   const UserSchema = z.object({
 *     id:    z.string().uuid(),
 *     email: z.email(),
 *     age:   z.number().int().min(0),
 *   });
 *
 *   type User = z.infer<typeof UserSchema>;
 *
 * Coercion (e.g. query-string params):
 *   import { z, coerce } from "@/libs/zod";
 *   const schema = z.object({ page: coerce.number().default(1) });
 */ // ── Primary namespace (covers ~95 % of usage) ──────────────────────────────
__turbopack_context__.s([]);
;
;
;
;
;
}),
"[project]/modules/workspace-scheduling/api/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$zod$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-zod/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const CreateDemandSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    workspaceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "workspaceId is required"),
    accountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "accountId is required"),
    requesterId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "requesterId is required"),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2, "標題至少需要 2 個字"),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default(""),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "medium",
        "high"
    ]).default("medium"),
    scheduledAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "請選擇排程日期")
});
const AssignMemberSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    demandId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "demandId is required"),
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "userId is required"),
    assignedBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "assignedBy is required")
});
}),
"[project]/modules/workspace-scheduling/application/work-demand.use-cases.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: workspace-scheduling
 * Layer: application/use-cases
 * Purpose: Application services — orchestrate domain logic.
 *
 * Each use case is a pure function of its inputs and the repository port.
 * No framework dependencies; no direct DB calls.
 */ __turbopack_context__.s([
    "AssignWorkDemandUseCase",
    ()=>AssignWorkDemandUseCase,
    "ListAccountDemandsUseCase",
    ()=>ListAccountDemandsUseCase,
    "ListWorkspaceDemandsUseCase",
    ()=>ListWorkspaceDemandsUseCase,
    "SubmitWorkDemandUseCase",
    ()=>SubmitWorkDemandUseCase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
;
class SubmitWorkDemandUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        try {
            const id = crypto.randomUUID();
            const now = new Date().toISOString();
            const demand = {
                id,
                workspaceId: input.workspaceId,
                accountId: input.accountId,
                requesterId: input.requesterId,
                title: input.title,
                description: input.description,
                priority: input.priority,
                scheduledAt: input.scheduledAt,
                status: "open",
                createdAtISO: now,
                updatedAtISO: now
            };
            await this.repo.save(demand);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORK_DEMAND_SUBMIT_FAILED", err instanceof Error ? err.message : "Failed to submit work demand");
        }
    }
}
class AssignWorkDemandUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        try {
            const demand = await this.repo.findById(input.demandId);
            if (!demand) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DEMAND_NOT_FOUND", `Demand ${input.demandId} not found`);
            }
            const updated = {
                ...demand,
                assignedUserId: input.userId,
                status: "in_progress",
                updatedAtISO: new Date().toISOString()
            };
            await this.repo.update(updated);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandSuccess"])(input.demandId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORK_DEMAND_ASSIGN_FAILED", err instanceof Error ? err.message : "Failed to assign work demand");
        }
    }
}
class ListWorkspaceDemandsUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(workspaceId) {
        return this.repo.listByWorkspace(workspaceId);
    }
}
class ListAccountDemandsUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(accountId) {
        return this.repo.listByAccount(accountId);
    }
}
}),
"[project]/modules/workspace-scheduling/infrastructure/firebase/FirebaseDemandRepository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseDemandRepository",
    ()=>FirebaseDemandRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-rsc] (ecmascript)");
;
;
const DEMANDS_COLLECTION = "workspacePlannerDemands";
function toWorkDemand(id, data) {
    const status = data.status;
    const priority = data.priority;
    return {
        id,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        requesterId: typeof data.requesterId === "string" ? data.requesterId : "",
        title: typeof data.title === "string" ? data.title : "",
        description: typeof data.description === "string" ? data.description : "",
        status: status === "draft" || status === "open" || status === "in_progress" || status === "completed" ? status : "draft",
        priority: priority === "low" || priority === "medium" || priority === "high" ? priority : "medium",
        scheduledAt: typeof data.scheduledAt === "string" ? data.scheduledAt : "",
        assignedUserId: typeof data.assignedUserId === "string" ? data.assignedUserId : undefined,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : ""
    };
}
class FirebaseDemandRepository {
    db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    get collectionRef() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(this.db, DEMANDS_COLLECTION);
    }
    async listByWorkspace(workspaceId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(this.collectionRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("workspaceId", "==", workspaceId)));
        return snaps.docs.map((item)=>toWorkDemand(item.id, item.data())).sort((a, b)=>b.updatedAtISO.localeCompare(a.updatedAtISO));
    }
    async listByAccount(accountId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(this.collectionRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["where"])("accountId", "==", accountId)));
        return snaps.docs.map((item)=>toWorkDemand(item.id, item.data())).sort((a, b)=>b.updatedAtISO.localeCompare(a.updatedAtISO));
    }
    async save(demand) {
        const demandRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, DEMANDS_COLLECTION, demand.id);
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])(demandRef);
        if (existing.exists()) {
            await this.update(demand);
            return;
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDoc"])(demandRef, {
            workspaceId: demand.workspaceId,
            accountId: demand.accountId,
            requesterId: demand.requesterId,
            title: demand.title,
            description: demand.description,
            status: demand.status,
            priority: demand.priority,
            scheduledAt: demand.scheduledAt,
            assignedUserId: demand.assignedUserId ?? null,
            createdAtISO: demand.createdAtISO,
            updatedAtISO: demand.updatedAtISO,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async update(demand) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, DEMANDS_COLLECTION, demand.id), {
            workspaceId: demand.workspaceId,
            accountId: demand.accountId,
            requesterId: demand.requesterId,
            title: demand.title,
            description: demand.description,
            status: demand.status,
            priority: demand.priority,
            scheduledAt: demand.scheduledAt,
            assignedUserId: demand.assignedUserId ?? null,
            updatedAtISO: demand.updatedAtISO,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }, {
            merge: true
        });
    }
    async findById(id) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(this.db, DEMANDS_COLLECTION, id));
        if (!snap.exists()) return null;
        return toWorkDemand(snap.id, snap.data());
    }
}
}),
"[project]/modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40156d093a68ec8957bf5f0c9af3918c2241440536":"assignWorkDemand","404a15c2771ecd20031f3f2aaa61a3f3467382967b":"submitWorkDemand"},"",""] */ __turbopack_context__.s([
    "assignWorkDemand",
    ()=>assignWorkDemand,
    "submitWorkDemand",
    ()=>submitWorkDemand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$api$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/api/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$application$2f$work$2d$demand$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/application/work-demand.use-cases.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$infrastructure$2f$firebase$2f$FirebaseDemandRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/infrastructure/firebase/FirebaseDemandRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
function makeRepo() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$infrastructure$2f$firebase$2f$FirebaseDemandRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseDemandRepository"]();
}
async function submitWorkDemand(raw) {
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$api$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateDemandSchema"].safeParse(raw);
    if (!parsed.success) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("VALIDATION_FAILED", parsed.error.issues[0]?.message ?? "Validation failed");
    }
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$application$2f$work$2d$demand$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SubmitWorkDemandUseCase"](makeRepo()).execute(parsed.data);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORK_DEMAND_ACTION_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
async function assignWorkDemand(raw) {
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$api$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AssignMemberSchema"].safeParse(raw);
    if (!parsed.success) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("VALIDATION_FAILED", parsed.error.issues[0]?.message ?? "Validation failed");
    }
    try {
        return await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$application$2f$work$2d$demand$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AssignWorkDemandUseCase"](makeRepo()).execute(parsed.data);
    } catch (err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORK_DEMAND_ACTION_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    submitWorkDemand,
    assignWorkDemand
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitWorkDemand, "404a15c2771ecd20031f3f2aaa61a3f3467382967b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(assignWorkDemand, "40156d093a68ec8957bf5f0c9af3918c2241440536", null);
}),
"[project]/modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40abef61db6a615c07950b98b8246268990caecd65":"getAccountDemands","40e9f49717506465beb1cb48489b90e9ba8ba077f4":"getWorkspaceDemands"},"",""] */ __turbopack_context__.s([
    "getAccountDemands",
    ()=>getAccountDemands,
    "getWorkspaceDemands",
    ()=>getWorkspaceDemands
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$application$2f$work$2d$demand$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/application/work-demand.use-cases.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$infrastructure$2f$firebase$2f$FirebaseDemandRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/infrastructure/firebase/FirebaseDemandRepository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
function makeRepo() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$infrastructure$2f$firebase$2f$FirebaseDemandRepository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FirebaseDemandRepository"]();
}
async function getWorkspaceDemands(workspaceId) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$application$2f$work$2d$demand$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ListWorkspaceDemandsUseCase"](makeRepo()).execute(workspaceId);
}
async function getAccountDemands(accountId) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$application$2f$work$2d$demand$2e$use$2d$cases$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ListAccountDemandsUseCase"](makeRepo()).execute(accountId);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getWorkspaceDemands,
    getAccountDemands
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkspaceDemands, "40e9f49717506465beb1cb48489b90e9ba8ba077f4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAccountDemands, "40abef61db6a615c07950b98b8246268990caecd65", null);
}),
"[project]/.next-internal/server/app/(shell)/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/modules/organization/interfaces/_actions/organization.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/modules/workspace/interfaces/_actions/workspace.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/modules/notification/interfaces/_actions/notification.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/modules/asset/interfaces/_actions/file.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$organization$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/_actions/organization.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$workspace$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/_actions/workspace.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$notification$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/_actions/notification.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$file$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/_actions/file.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$_actions$2f$work$2d$demand$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$queries$2f$work$2d$demand$2e$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(shell)/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/modules/organization/interfaces/_actions/organization.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/modules/workspace/interfaces/_actions/workspace.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/modules/notification/interfaces/_actions/notification.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/modules/asset/interfaces/_actions/file.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4022f040e3b75fb00e991105d96de345865740c7d5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$notification$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markAllNotificationsRead"],
    "404a15c2771ecd20031f3f2aaa61a3f3467382967b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$_actions$2f$work$2d$demand$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitWorkDemand"],
    "4067b68307f0349ed04dd488d1b366c69ee93db14d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$file$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadCompleteFile"],
    "40a308a42c089c4cd3d119eedf680779dcf995e40f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$workspace$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createWorkspace"],
    "40ae90a46eb874ae059c11615225a78d26448a3b54",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$file$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadInitFile"],
    "40af2184804a968d4307434c92ca71f71d98dfa515",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$workspace$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateWorkspaceSettings"],
    "40d820a9b690d1e8de0028caeeb609ef68a8b0a55b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$organization$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createOrganization"],
    "40e9f49717506465beb1cb48489b90e9ba8ba077f4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$queries$2f$work$2d$demand$2e$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkspaceDemands"],
    "60e0b9b1f0ec32b3e7fb944c7e8641e252aa3b5f40",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$notification$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markNotificationRead"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$shell$292f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$organization$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$workspace$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$notification$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$file$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$_actions$2f$work$2d$demand$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$queries$2f$work$2d$demand$2e$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(shell)/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/modules/organization/interfaces/_actions/organization.actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/modules/workspace/interfaces/_actions/workspace.actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/modules/notification/interfaces/_actions/notification.actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/modules/asset/interfaces/_actions/file.actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$organization$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/_actions/organization.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$workspace$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/_actions/workspace.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$notification$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/_actions/notification.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$file$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/_actions/file.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$_actions$2f$work$2d$demand$2e$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$queries$2f$work$2d$demand$2e$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7f4f7888._.js.map