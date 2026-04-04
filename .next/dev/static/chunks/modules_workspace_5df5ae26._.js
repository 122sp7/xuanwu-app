(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/modules/workspace/application/use-cases/workspace.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create workspace");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_CREATE_WITH_CAPABILITIES_FAILED", err instanceof Error ? err.message : "Failed to create workspace with capabilities");
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_NOT_FOUND", `Workspace ${command.workspaceId} not found`);
            }
            await this.workspaceRepo.updateSettings(command);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(command.workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_UPDATE_FAILED", err instanceof Error ? err.message : "Failed to update workspace settings");
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_NOT_FOUND", `Workspace ${workspaceId} not found`);
            }
            await this.workspaceRepo.delete(workspaceId);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_DELETE_FAILED", err instanceof Error ? err.message : "Failed to delete workspace");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CAPABILITIES_MOUNT_FAILED", err instanceof Error ? err.message : "Failed to mount capabilities");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_TEAM_GRANT_FAILED", err instanceof Error ? err.message : "Failed to grant team access");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(workspaceId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_GRANT_FAILED", err instanceof Error ? err.message : "Failed to grant individual access");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(locationId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_LOCATION_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create workspace location");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/application/use-cases/workspace-member.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FetchWorkspaceMembersUseCase",
    ()=>FetchWorkspaceMembersUseCase
]);
class FetchWorkspaceMembersUseCase {
    workspaceQueryRepo;
    constructor(workspaceQueryRepo){
        this.workspaceQueryRepo = workspaceQueryRepo;
    }
    execute(workspaceId) {
        return this.workspaceQueryRepo.getWorkspaceMembers(workspaceId);
    }
}
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
"[project]/modules/workspace/interfaces/hooks/useWorkspaceHub.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWorkspaceHub",
    ()=>useWorkspaceHub
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$45dcaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/_actions/data:45dcaf [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/queries/workspace.queries.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function sortWorkspaces(items) {
    return [
        ...items
    ].sort((left, right)=>left.name.localeCompare(right.name, "en", {
            sensitivity: "base"
        }));
}
function useWorkspaceHub({ accountId, accountType }) {
    _s();
    const [workspaces, setWorkspaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadState, setLoadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [errorMessage, setErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [createError, setCreateError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCreatingWorkspace, setIsCreatingWorkspace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchWorkspaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkspaceHub.useCallback[fetchWorkspaces]": async (nextAccountId, failureMessage)=>{
            try {
                const nextWorkspaces = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspacesForAccount"])(nextAccountId);
                setWorkspaces(sortWorkspaces(nextWorkspaces));
                setLoadState("loaded");
                setErrorMessage(null);
                return nextWorkspaces;
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("[useWorkspaceHub] Failed to load workspaces:", error);
                }
                setWorkspaces([]);
                setLoadState("error");
                setErrorMessage(failureMessage);
                return null;
            }
        }
    }["useWorkspaceHub.useCallback[fetchWorkspaces]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWorkspaceHub.useEffect": ()=>{
            async function loadWorkspaces() {
                if (!accountId) {
                    setWorkspaces([]);
                    setLoadState("loaded");
                    setErrorMessage(null);
                    return;
                }
                setLoadState("loading");
                setErrorMessage(null);
                await fetchWorkspaces(accountId, "Unable to load workspace records right now.");
            }
            void loadWorkspaces();
        }
    }["useWorkspaceHub.useEffect"], [
        accountId,
        fetchWorkspaces
    ]);
    const refreshWorkspaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkspaceHub.useCallback[refreshWorkspaces]": async ()=>{
            if (!accountId) {
                setWorkspaces([]);
                setLoadState("loaded");
                setErrorMessage(null);
                return;
            }
            await fetchWorkspaces(accountId, "工作區已建立，但清單更新失敗。請重新整理頁面以查看新的工作區。");
        }
    }["useWorkspaceHub.useCallback[refreshWorkspaces]"], [
        accountId,
        fetchWorkspaces
    ]);
    const createWorkspaceForAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkspaceHub.useCallback[createWorkspaceForAccount]": async (name)=>{
            const nextWorkspaceName = name.trim();
            if (!accountId) {
                const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_ACCOUNT_REQUIRED", "帳號資訊已失效，請重新整理頁面後再建立工作區。");
                setCreateError(error.error.message);
                return error;
            }
            if (!nextWorkspaceName) {
                const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_NAME_REQUIRED", "請輸入工作區名稱。");
                setCreateError(error.error.message);
                return error;
            }
            setIsCreatingWorkspace(true);
            setCreateError(null);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$45dcaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createWorkspace"])({
                name: nextWorkspaceName,
                accountId,
                accountType
            });
            if (!result.success) {
                setCreateError(result.error.message);
                setIsCreatingWorkspace(false);
                return result;
            }
            await refreshWorkspaces();
            setIsCreatingWorkspace(false);
            return result;
        }
    }["useWorkspaceHub.useCallback[createWorkspaceForAccount]"], [
        accountId,
        accountType,
        refreshWorkspaces
    ]);
    const workspaceStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useWorkspaceHub.useMemo[workspaceStats]": ()=>{
            return {
                total: workspaces.length,
                active: workspaces.filter({
                    "useWorkspaceHub.useMemo[workspaceStats]": (workspace)=>workspace.lifecycleState === "active"
                }["useWorkspaceHub.useMemo[workspaceStats]"]).length,
                preparatory: workspaces.filter({
                    "useWorkspaceHub.useMemo[workspaceStats]": (workspace)=>workspace.lifecycleState === "preparatory"
                }["useWorkspaceHub.useMemo[workspaceStats]"]).length
            };
        }
    }["useWorkspaceHub.useMemo[workspaceStats]"], [
        workspaces
    ]);
    const clearCreateError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkspaceHub.useCallback[clearCreateError]": ()=>{
            setCreateError(null);
        }
    }["useWorkspaceHub.useCallback[clearCreateError]"], []);
    return {
        createError,
        clearCreateError,
        createWorkspaceForAccount,
        errorMessage,
        isCreatingWorkspace,
        loadState,
        refreshWorkspaces,
        workspaceStats,
        workspaces
    };
}
_s(useWorkspaceHub, "FqE86i0/UTXaeyN88XpLm81ajXE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceHubScreen",
    ()=>WorkspaceHubScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$hooks$2f$useWorkspaceHub$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/hooks/useWorkspaceHub.ts [app-client] (ecmascript)");
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
const lifecycleBadgeVariant = {
    active: "default",
    preparatory: "secondary",
    stopped: "outline"
};
function WorkspaceHubScreen({ accountId, accountName, accountType, accountsHydrated, isBootstrapSeeded }) {
    _s();
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [workspaceName, setWorkspaceName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const { createError, clearCreateError, createWorkspaceForAccount, errorMessage, isCreatingWorkspace, loadState, workspaceStats, workspaces } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$hooks$2f$useWorkspaceHub$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkspaceHub"])({
        accountId,
        accountType
    });
    function resetCreateWorkspaceDialog() {
        setWorkspaceName("");
        clearCreateError();
    }
    async function handleCreateWorkspace(event) {
        event.preventDefault();
        const result = await createWorkspaceForAccount(workspaceName);
        if (!result.success) {
            return;
        }
        resetCreateWorkspaceDialog();
        setIsCreateWorkspaceOpen(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold tracking-tight",
                                children: "Workspace Hub"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: [
                                    "Review the workspaces connected to",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-foreground",
                                        children: accountName ?? "the active account"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>setIsCreateWorkspaceOpen(true),
                        disabled: !accountsHydrated || !accountId,
                        children: !accountsHydrated ? "同步帳號中…" : "建立工作區"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            !accountsHydrated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground",
                "aria-live": "polite",
                role: "status",
                children: isBootstrapSeeded ? "正在同步可用的組織與工作區內容，完成後即可直接建立或切換工作區。" : "正在載入帳號與工作區內容…"
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border border-border/50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                    children: "Total Workspaces"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-3xl",
                                    children: workspaceStats.total
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border border-border/50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                    children: "Active"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-3xl",
                                    children: workspaceStats.active
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border border-border/50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                    children: "Preparatory"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-3xl",
                                    children: workspaceStats.preparatory
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "border border-border/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Workspace Records"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Lifecycle, capabilities, locations, and grant counts come directly from the workspace module."
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-3",
                        children: [
                            loadState === "loading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground",
                                children: "Loading workspace records…"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this),
                            loadState === "error" && errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-destructive/30 px-4 py-3 text-sm text-destructive",
                                children: errorMessage
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this),
                            loadState === "loaded" && workspaces.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground",
                                children: [
                                    "No workspace records are linked to this account yet. You can keep shaping the account context from",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/organization",
                                        className: "font-medium text-primary hover:underline",
                                        children: "organization"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this),
                                    " ",
                                    "or",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/settings",
                                        className: "font-medium text-primary hover:underline",
                                        children: "account settings"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                        lineNumber: 174,
                                        columnNumber: 15
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this),
                            workspaces.map((workspace)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/workspace/${workspace.id}`,
                                    className: "block rounded-xl border border-border/40 px-4 py-4 shadow-sm transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-semibold text-foreground",
                                                                children: workspace.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: lifecycleBadgeVariant[workspace.lifecycleState],
                                                                children: workspace.lifecycleState
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                                lineNumber: 196,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                children: workspace.visibility
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                                lineNumber: 199,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: [
                                                            "Account scope: ",
                                                            workspace.accountType
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-medium text-primary",
                                                        children: "點擊進入工作區"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                        lineNumber: 204,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Capabilities: ",
                                                            workspace.capabilities.length
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                        lineNumber: 208,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Teams: ",
                                                            workspace.teamIds.length
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Locations: ",
                                                            workspace.locations?.length ?? 0
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Grants: ",
                                                            workspace.grants.length
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this)
                                }, workspace.id, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isCreateWorkspaceOpen,
                onOpenChange: (open)=>{
                    setIsCreateWorkspaceOpen(open);
                    if (!open) {
                        resetCreateWorkspaceDialog();
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    "aria-describedby": "create-workspace-description",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "建立工作區"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    id: "create-workspace-description",
                                    children: "建立後會直接出現在目前帳號的工作區清單中。"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                            lineNumber: 229,
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
                                            htmlFor: "workspace-name",
                                            children: "工作區名稱"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                            lineNumber: 238,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "workspace-name",
                                            value: workspaceName,
                                            onChange: (event)=>{
                                                setWorkspaceName(event.target.value);
                                                if (createError) {
                                                    clearCreateError();
                                                }
                                            },
                                            placeholder: "例如：北區營運中心",
                                            autoFocus: true,
                                            disabled: isCreatingWorkspace,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                            lineNumber: 244,
                                            columnNumber: 15
                                        }, this),
                                        createError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: createError
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>{
                                                resetCreateWorkspaceDialog();
                                                setIsCreateWorkspaceOpen(false);
                                            },
                                            disabled: isCreatingWorkspace,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isCreatingWorkspace || !accountId,
                                            children: isCreatingWorkspace ? "建立中…" : "直接建立"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                            lineNumber: 275,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                    lineNumber: 228,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(WorkspaceHubScreen, "LKAql2B9J5Idm+LtzWy+W0eTbXc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$hooks$2f$useWorkspaceHub$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkspaceHub"]
    ];
});
_c = WorkspaceHubScreen;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceHubScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/_actions/data:5b3782 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateWorkspaceSettings",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40af2184804a968d4307434c92ca71f71d98dfa515":"updateWorkspaceSettings"},"modules/workspace/interfaces/_actions/workspace.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40af2184804a968d4307434c92ca71f71d98dfa515", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateWorkspaceSettings");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vd29ya3NwYWNlLmFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG4vKipcclxuICogV29ya3NwYWNlIFNlcnZlciBBY3Rpb25zIOKAlCB0aGluIGFkYXB0ZXI6IE5leHQuanMgU2VydmVyIEFjdGlvbnMg4oaSIEFwcGxpY2F0aW9uIFVzZSBDYXNlcy5cclxuICovXHJcblxyXG5pbXBvcnQgeyBjb21tYW5kRmFpbHVyZUZyb20sIHR5cGUgQ29tbWFuZFJlc3VsdCB9IGZyb20gXCJAc2hhcmVkLXR5cGVzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ3JlYXRlV29ya3NwYWNlVXNlQ2FzZSxcclxuICBDcmVhdGVXb3Jrc3BhY2VXaXRoQ2FwYWJpbGl0aWVzVXNlQ2FzZSxcclxuICBVcGRhdGVXb3Jrc3BhY2VTZXR0aW5nc1VzZUNhc2UsXHJcbiAgRGVsZXRlV29ya3NwYWNlVXNlQ2FzZSxcclxuICBNb3VudENhcGFiaWxpdGllc1VzZUNhc2UsXHJcbiAgR3JhbnRUZWFtQWNjZXNzVXNlQ2FzZSxcclxuICBHcmFudEluZGl2aWR1YWxBY2Nlc3NVc2VDYXNlLFxyXG4gIENyZWF0ZVdvcmtzcGFjZUxvY2F0aW9uVXNlQ2FzZSxcclxufSBmcm9tIFwiLi4vLi4vYXBwbGljYXRpb24vdXNlLWNhc2VzL3dvcmtzcGFjZS51c2UtY2FzZXNcIjtcclxuaW1wb3J0IHsgRmlyZWJhc2VXb3Jrc3BhY2VSZXBvc2l0b3J5IH0gZnJvbSBcIi4uLy4uL2luZnJhc3RydWN0dXJlL2ZpcmViYXNlL0ZpcmViYXNlV29ya3NwYWNlUmVwb3NpdG9yeVwiO1xyXG5pbXBvcnQgdHlwZSB7XHJcbiAgQ3JlYXRlV29ya3NwYWNlQ29tbWFuZCxcclxuICBVcGRhdGVXb3Jrc3BhY2VTZXR0aW5nc0NvbW1hbmQsXHJcbiAgQ2FwYWJpbGl0eSxcclxuICBXb3Jrc3BhY2VHcmFudCxcclxuICBXb3Jrc3BhY2VMb2NhdGlvbixcclxufSBmcm9tIFwiLi4vLi4vZG9tYWluL2VudGl0aWVzL1dvcmtzcGFjZVwiO1xyXG5cclxuY29uc3Qgd29ya3NwYWNlUmVwbyA9IG5ldyBGaXJlYmFzZVdvcmtzcGFjZVJlcG9zaXRvcnkoKTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVXb3Jrc3BhY2UoY29tbWFuZDogQ3JlYXRlV29ya3NwYWNlQ29tbWFuZCk6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IENyZWF0ZVdvcmtzcGFjZVVzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfQ1JFQVRFX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdvcmtzcGFjZVdpdGhDYXBhYmlsaXRpZXMoXHJcbiAgY29tbWFuZDogQ3JlYXRlV29ya3NwYWNlQ29tbWFuZCxcclxuICBjYXBhYmlsaXRpZXM6IENhcGFiaWxpdHlbXSxcclxuKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgQ3JlYXRlV29ya3NwYWNlV2l0aENhcGFiaWxpdGllc1VzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZShjb21tYW5kLCBjYXBhYmlsaXRpZXMpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIldPUktTUEFDRV9DUkVBVEVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlV29ya3NwYWNlU2V0dGluZ3MoXHJcbiAgY29tbWFuZDogVXBkYXRlV29ya3NwYWNlU2V0dGluZ3NDb21tYW5kLFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBVcGRhdGVXb3Jrc3BhY2VTZXR0aW5nc1VzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZShjb21tYW5kKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfVVBEQVRFX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVdvcmtzcGFjZSh3b3Jrc3BhY2VJZDogc3RyaW5nKTogUHJvbWlzZTxDb21tYW5kUmVzdWx0PiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBhd2FpdCBuZXcgRGVsZXRlV29ya3NwYWNlVXNlQ2FzZSh3b3Jrc3BhY2VSZXBvKS5leGVjdXRlKHdvcmtzcGFjZUlkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfREVMRVRFX0ZBSUxFRFwiLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJVbmV4cGVjdGVkIGVycm9yXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1vdW50Q2FwYWJpbGl0aWVzKFxyXG4gIHdvcmtzcGFjZUlkOiBzdHJpbmcsXHJcbiAgY2FwYWJpbGl0aWVzOiBDYXBhYmlsaXR5W10sXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IE1vdW50Q2FwYWJpbGl0aWVzVXNlQ2FzZSh3b3Jrc3BhY2VSZXBvKS5leGVjdXRlKHdvcmtzcGFjZUlkLCBjYXBhYmlsaXRpZXMpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIkNBUEFCSUxJVElFU19NT1VOVF9GQUlMRURcIiwgZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiVW5leHBlY3RlZCBlcnJvclwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhdXRob3JpemVXb3Jrc3BhY2VUZWFtKFxyXG4gIHdvcmtzcGFjZUlkOiBzdHJpbmcsXHJcbiAgdGVhbUlkOiBzdHJpbmcsXHJcbik6IFByb21pc2U8Q29tbWFuZFJlc3VsdD4ge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgbmV3IEdyYW50VGVhbUFjY2Vzc1VzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZSh3b3Jrc3BhY2VJZCwgdGVhbUlkKTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfVEVBTV9BVVRIT1JJWkVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ3JhbnRJbmRpdmlkdWFsV29ya3NwYWNlQWNjZXNzKFxyXG4gIHdvcmtzcGFjZUlkOiBzdHJpbmcsXHJcbiAgZ3JhbnQ6IFdvcmtzcGFjZUdyYW50LFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBHcmFudEluZGl2aWR1YWxBY2Nlc3NVc2VDYXNlKHdvcmtzcGFjZVJlcG8pLmV4ZWN1dGUod29ya3NwYWNlSWQsIGdyYW50KTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIHJldHVybiBjb21tYW5kRmFpbHVyZUZyb20oXCJXT1JLU1BBQ0VfR1JBTlRfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlV29ya3NwYWNlTG9jYXRpb24oXHJcbiAgd29ya3NwYWNlSWQ6IHN0cmluZyxcclxuICBsb2NhdGlvbjogT21pdDxXb3Jrc3BhY2VMb2NhdGlvbiwgXCJsb2NhdGlvbklkXCI+LFxyXG4pOiBQcm9taXNlPENvbW1hbmRSZXN1bHQ+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBDcmVhdGVXb3Jrc3BhY2VMb2NhdGlvblVzZUNhc2Uod29ya3NwYWNlUmVwbykuZXhlY3V0ZSh3b3Jrc3BhY2VJZCwgbG9jYXRpb24pO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIGNvbW1hbmRGYWlsdXJlRnJvbShcIldPUktTUEFDRV9MT0NBVElPTl9DUkVBVEVfRkFJTEVEXCIsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBcIlVuZXhwZWN0ZWQgZXJyb3JcIik7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoic1VBK0NzQixvTUFBQSJ9
}),
"[project]/modules/workspace/interfaces/components/WorkspaceDailyTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceDailyTab",
    ()=>WorkspaceDailyTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace-feed/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$interfaces$2f$components$2f$WorkspaceFeedWorkspaceView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx [app-client] (ecmascript)");
"use client";
;
;
function WorkspaceDailyTab({ workspace }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$interfaces$2f$components$2f$WorkspaceFeedWorkspaceView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspaceFeedWorkspaceView"], {
        accountId: workspace.accountId,
        workspaceId: workspace.id,
        workspaceName: workspace.name
    }, void 0, false, {
        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDailyTab.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = WorkspaceDailyTab;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceDailyTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/queries/workspace-member.queries.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWorkspaceMembers",
    ()=>getWorkspaceMembers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2d$member$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/application/use-cases/workspace-member.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceQueryRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts [app-client] (ecmascript)");
;
;
const workspaceQueryRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceQueryRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseWorkspaceQueryRepository"]();
const fetchWorkspaceMembersUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2d$member$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FetchWorkspaceMembersUseCase"](workspaceQueryRepo);
async function getWorkspaceMembers(workspaceId) {
    const normalizedWorkspaceId = workspaceId.trim();
    if (!normalizedWorkspaceId) {
        return [];
    }
    return fetchWorkspaceMembersUseCase.execute(normalizedWorkspaceId);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceMembersTab",
    ()=>WorkspaceMembersTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2d$member$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/queries/workspace-member.queries.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function getMemberInitials(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return "??";
    }
    const tokens = trimmed.split(/\s+/).slice(0, 2);
    return tokens.map((token)=>token[0]?.toUpperCase() ?? "").join("");
}
function getAccessChannelKey(memberId, channel, index) {
    return [
        memberId,
        channel.source,
        channel.label,
        channel.role ?? "",
        channel.protocol ?? "",
        channel.teamId ?? "",
        String(index)
    ].join("::");
}
const presenceLabelMap = {
    active: "Active",
    away: "Away",
    offline: "Offline",
    unknown: "Unknown"
};
const sourceLabelMap = {
    owner: "Owner",
    direct: "Direct",
    team: "Team",
    personnel: "Personnel"
};
function WorkspaceMembersTab({ workspace }) {
    _s();
    const [members, setMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadState, setLoadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("loading");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspaceMembersTab.useEffect": ()=>{
            let cancelled = false;
            async function loadMembers() {
                setLoadState("loading");
                try {
                    const nextMembers = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2d$member$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceMembers"])(workspace.id);
                    if (cancelled) {
                        return;
                    }
                    setMembers(nextMembers);
                    setLoadState("loaded");
                } catch (error) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.warn("[WorkspaceMembersTab] Failed to load members:", error);
                    }
                    if (!cancelled) {
                        setMembers([]);
                        setLoadState("error");
                    }
                }
            }
            void loadMembers();
            return ({
                "WorkspaceMembersTab.useEffect": ()=>{
                    cancelled = true;
                }
            })["WorkspaceMembersTab.useEffect"];
        }
    }["WorkspaceMembersTab.useEffect"], [
        workspace.id
    ]);
    const directCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkspaceMembersTab.useMemo[directCount]": ()=>members.filter({
                "WorkspaceMembersTab.useMemo[directCount]": (member)=>member.accessChannels.some({
                        "WorkspaceMembersTab.useMemo[directCount]": (channel)=>channel.source === "direct"
                    }["WorkspaceMembersTab.useMemo[directCount]"])
            }["WorkspaceMembersTab.useMemo[directCount]"]).length
    }["WorkspaceMembersTab.useMemo[directCount]"], [
        members
    ]);
    const teamCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkspaceMembersTab.useMemo[teamCount]": ()=>members.filter({
                "WorkspaceMembersTab.useMemo[teamCount]": (member)=>member.accessChannels.some({
                        "WorkspaceMembersTab.useMemo[teamCount]": (channel)=>channel.source === "team"
                    }["WorkspaceMembersTab.useMemo[teamCount]"])
            }["WorkspaceMembersTab.useMemo[teamCount]"]).length
    }["WorkspaceMembersTab.useMemo[teamCount]"], [
        members
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "border border-border/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: "Members"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: workspace.accountType === "organization" ? "組織成員與工作區授權來源的整合檢視。" : "個人工作區目前的共享與聯絡角色摘要。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3 sm:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Visible members"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xl font-semibold",
                                        children: members.length
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Direct access"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xl font-semibold",
                                        children: directCount
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Team access"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xl font-semibold",
                                        children: teamCount
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    loadState === "loading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Loading workspace members…"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this),
                    loadState === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-destructive",
                        children: "無法載入成員資料，請重新整理頁面或稍後再試。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    loadState === "loaded" && members.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "目前尚未整理出任何工作區成員或授權來源，之後可在這裡持續擴充成員維護流程。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this),
                    loadState === "loaded" && members.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: members.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                        children: getMemberInitials(member.displayName)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold text-foreground",
                                                                    children: member.displayName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                                    lineNumber: 167,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    children: presenceLabelMap[member.presence]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                                    lineNumber: 170,
                                                                    columnNumber: 25
                                                                }, this),
                                                                member.organizationRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "secondary",
                                                                    children: member.organizationRole
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                                    lineNumber: 172,
                                                                    columnNumber: 27
                                                                }, this),
                                                                member.isExternal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    children: "External"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                                    lineNumber: 174,
                                                                    columnNumber: 47
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                            lineNumber: 166,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: member.email ?? member.id
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                            lineNumber: 176,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                            lineNumber: 161,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: member.accessChannels.map((channel, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "outline",
                                                    children: [
                                                        sourceLabelMap[channel.source],
                                                        " · ",
                                                        channel.label,
                                                        channel.role ? ` · ${channel.role}` : ""
                                                    ]
                                                }, getAccessChannelKey(member.id, channel, index), true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                    lineNumber: 160,
                                    columnNumber: 17
                                }, this)
                            }, member.id, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                                lineNumber: 156,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_s(WorkspaceMembersTab, "AbEBMDSxhSmYGydtAQnlpdYrwlU=");
_c = WorkspaceMembersTab;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceMembersTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceWikiBetaView",
    ()=>WorkspaceWikiBetaView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpenIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpenIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2Icon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2Icon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanbanIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.js [app-client] (ecmascript) <export default as FolderKanbanIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function WorkspaceWikiBetaView({ workspace }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "border-border/60 bg-card/80",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                    className: "gap-4 lg:flex-row lg:items-start lg:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "flex items-center gap-2 text-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpenIcon$3e$__["BookOpenIcon"], {
                                            className: "size-5 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                            lineNumber: 27,
                                            columnNumber: 15
                                        }, this),
                                        workspace.name,
                                        " WorkSpace Wiki-Beta"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                    children: "這是 workspace-scoped 的 Wiki-Beta。所有資料與操作都約束在目前 Account 與 Workspace。"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-2 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-border/60 px-3 py-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Account Scope"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                            lineNumber: 37,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 flex items-center gap-2 font-medium text-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2Icon$3e$__["Building2Icon"], {
                                                    className: "size-4 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                                    lineNumber: 39,
                                                    columnNumber: 17
                                                }, this),
                                                workspace.accountId
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                            lineNumber: 38,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-border/60 px-3 py-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Workspace Scope"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                            lineNumber: 44,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 flex items-center gap-2 font-medium text-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanbanIcon$3e$__["FolderKanbanIcon"], {
                                                    className: "size-4 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                                    lineNumber: 46,
                                                    columnNumber: 17
                                                }, this),
                                                workspace.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                            lineNumber: 45,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "flex flex-wrap gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            asChild: true,
                            variant: "outline",
                            size: "sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/wiki-beta",
                                children: "前往 Account Wiki-Beta"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            asChild: true,
                            variant: "outline",
                            size: "sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/wiki-beta/pages",
                                children: "查看 Account 頁面總覽"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            asChild: true,
                            variant: "outline",
                            size: "sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/wiki-beta/rag-query",
                                children: "前往 RAG Query"
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = WorkspaceWikiBetaView;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceWikiBetaView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/workspace-tabs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WORKSPACE_TAB_GROUPS",
    ()=>WORKSPACE_TAB_GROUPS,
    "WORKSPACE_TAB_META",
    ()=>WORKSPACE_TAB_META,
    "WORKSPACE_TAB_VALUES",
    ()=>WORKSPACE_TAB_VALUES,
    "getWorkspaceTabLabel",
    ()=>getWorkspaceTabLabel,
    "getWorkspaceTabMeta",
    ()=>getWorkspaceTabMeta,
    "getWorkspaceTabPrefId",
    ()=>getWorkspaceTabPrefId,
    "getWorkspaceTabStatus",
    ()=>getWorkspaceTabStatus,
    "getWorkspaceTabsByGroup",
    ()=>getWorkspaceTabsByGroup,
    "isWorkspaceTabValue",
    ()=>isWorkspaceTabValue
]);
const WORKSPACE_TAB_VALUES = [
    "Overview",
    "Favorites",
    "Recent",
    "Engineering",
    "Product",
    "Design",
    "Docs",
    "SOP",
    "Meeting Notes",
    "Members",
    "Projects",
    "Notes",
    "Documents",
    "Assets",
    "CRM",
    "Roadmap",
    "Daily",
    "Tags",
    "Files",
    "Templates",
    "Wiki",
    "Schedule",
    "Audit",
    "Trash"
];
const WORKSPACE_TAB_META = {
    Overview: {
        label: "Home",
        prefId: "home",
        group: "primary",
        status: "🏗️"
    },
    Favorites: {
        label: "Favorites",
        prefId: "favorites",
        group: "primary",
        status: "🚧"
    },
    Recent: {
        label: "Recent",
        prefId: "recent",
        group: "primary",
        status: "🚧"
    },
    Engineering: {
        label: "Engineering",
        prefId: "engineering",
        group: "spaces",
        status: "🚧"
    },
    Product: {
        label: "Product",
        prefId: "product",
        group: "spaces",
        status: "🚧"
    },
    Design: {
        label: "Design",
        prefId: "design",
        group: "spaces",
        status: "🚧"
    },
    Docs: {
        label: "Docs",
        prefId: "docs",
        group: "spaces",
        status: "🚧"
    },
    SOP: {
        label: "SOP",
        prefId: "sop",
        group: "spaces",
        status: "🚧"
    },
    "Meeting Notes": {
        label: "Meeting Notes",
        prefId: "meeting-notes",
        group: "spaces",
        status: "🚧"
    },
    Members: {
        label: "Members",
        prefId: "members",
        group: "library",
        status: "✅"
    },
    Projects: {
        label: "Projects",
        prefId: "projects",
        group: "databases",
        status: "🚧"
    },
    Notes: {
        label: "Notes",
        prefId: "notes",
        group: "databases",
        status: "🚧"
    },
    Documents: {
        label: "Documents",
        prefId: "documents",
        group: "databases",
        status: "🚧"
    },
    Assets: {
        label: "Assets",
        prefId: "assets",
        group: "databases",
        status: "🚧"
    },
    CRM: {
        label: "CRM",
        prefId: "crm",
        group: "databases",
        status: "🚧"
    },
    Roadmap: {
        label: "Roadmap",
        prefId: "roadmap",
        group: "databases",
        status: "🚧"
    },
    Daily: {
        label: "Daily",
        prefId: "daily",
        group: "modules",
        status: "✅"
    },
    Tags: {
        label: "Tags",
        prefId: "tags",
        group: "library",
        status: "🚧"
    },
    Files: {
        label: "Files",
        prefId: "files",
        group: "library",
        status: "✅"
    },
    Templates: {
        label: "Templates",
        prefId: "templates",
        group: "library",
        status: "🚧"
    },
    Wiki: {
        label: "WorkSpace Wiki-Beta",
        prefId: "wiki",
        group: "spaces",
        status: "🏗️"
    },
    Schedule: {
        label: "Schedule",
        prefId: "schedule",
        group: "modules",
        status: "✅"
    },
    Audit: {
        label: "Audit",
        prefId: "audit",
        group: "modules",
        status: "✅"
    },
    Trash: {
        label: "Trash",
        prefId: "trash",
        group: "library",
        status: "🚧"
    }
};
const WORKSPACE_TAB_GROUPS = {
    primary: [
        "Overview",
        "Recent",
        "Favorites"
    ],
    spaces: [
        "Docs",
        "Wiki",
        "Meeting Notes",
        "SOP",
        "Engineering",
        "Product",
        "Design"
    ],
    databases: [
        "Projects",
        "Roadmap",
        "Notes",
        "Documents",
        "Assets",
        "CRM"
    ],
    library: [
        "Files",
        "Tags",
        "Templates",
        "Members",
        "Trash"
    ],
    modules: [
        "Daily",
        "Schedule",
        "Audit"
    ]
};
const WORKSPACE_TAB_VALUE_SET = new Set(WORKSPACE_TAB_VALUES);
function isWorkspaceTabValue(value) {
    return WORKSPACE_TAB_VALUE_SET.has(value);
}
function getWorkspaceTabMeta(tab) {
    return WORKSPACE_TAB_META[tab];
}
function getWorkspaceTabStatus(tab) {
    return WORKSPACE_TAB_META[tab].status;
}
function getWorkspaceTabLabel(tab) {
    return WORKSPACE_TAB_META[tab].label;
}
function getWorkspaceTabPrefId(tab) {
    return WORKSPACE_TAB_META[tab].prefId;
}
function getWorkspaceTabsByGroup(group) {
    return WORKSPACE_TAB_GROUPS[group];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceDetailScreen",
    ()=>WorkspaceDetailScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-utils/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace-audit/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$interfaces$2f$components$2f$WorkspaceAuditTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/asset/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$components$2f$WorkspaceFilesTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$WorkspaceSchedulingTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$5b3782__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/_actions/data:5b3782 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceDailyTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/components/WorkspaceDailyTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceMembersTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceWikiBetaView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/queries/workspace.queries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/workspace-tabs.ts [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
const lifecycleBadgeVariant = {
    active: "default",
    preparatory: "secondary",
    stopped: "outline"
};
function getWorkspaceInitials(name) {
    const tokens = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (tokens.length === 0) {
        return "WS";
    }
    return tokens.map((token)=>token[0]?.toUpperCase() ?? "").join("");
}
function formatTimestamp(timestamp) {
    if (!timestamp) {
        return "—";
    }
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(timestamp.toDate());
    } catch  {
        return "—";
    }
}
function describeGrant(grant) {
    if (grant.teamId) {
        return "Team grant";
    }
    if (grant.userId) {
        return "User grant";
    }
    return "Unscoped grant";
}
function createSettingsDraft(workspace) {
    return {
        name: workspace.name,
        visibility: workspace.visibility,
        lifecycleState: workspace.lifecycleState,
        street: workspace.address?.street ?? "",
        city: workspace.address?.city ?? "",
        state: workspace.address?.state ?? "",
        postalCode: workspace.address?.postalCode ?? "",
        country: workspace.address?.country ?? "",
        details: workspace.address?.details ?? "",
        managerId: workspace.personnel?.managerId ?? "",
        supervisorId: workspace.personnel?.supervisorId ?? "",
        safetyOfficerId: workspace.personnel?.safetyOfficerId ?? ""
    };
}
function trimOrUndefined(value) {
    const trimmed = value.trim();
    return trimmed || undefined;
}
function renderWorkspacePlaceholderTab(tab) {
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabStatus"])(tab);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "border border-border/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: [
                            status,
                            " ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabLabel"])(tab)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: "此分頁尚在開發中，功能將逐步開放。"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "text-sm text-muted-foreground",
                children: "目前僅提供基礎導覽，敬請期待後續版本。"
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
function WorkspaceDetailScreen({ workspaceId, accountId, accountsHydrated, initialTab }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [workspace, setWorkspace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadState, setLoadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("loading");
    const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSavingWorkspace, setIsSavingWorkspace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveError, setSaveError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [settingsDraft, setSettingsDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspaceDetailScreen.useEffect": ()=>{
            let cancelled = false;
            async function loadWorkspace() {
                if (!workspaceId) {
                    setLoadState("error");
                    return;
                }
                if (!accountId || !accountsHydrated) {
                    setWorkspace(null);
                    setLoadState("loading");
                    return;
                }
                setLoadState("loading");
                try {
                    const detail = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceByIdForAccount"])(accountId, workspaceId);
                    if (cancelled) return;
                    if (!detail) {
                        router.replace("/workspace?context=unavailable");
                        return;
                    }
                    setWorkspace(detail);
                    setLoadState("loaded");
                } catch (error) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.warn("[WorkspaceDetailScreen] Failed to load workspace:", error);
                    }
                    if (!cancelled) {
                        setWorkspace(null);
                        setLoadState("error");
                    }
                }
            }
            void loadWorkspace();
            return ({
                "WorkspaceDetailScreen.useEffect": ()=>{
                    cancelled = true;
                }
            })["WorkspaceDetailScreen.useEffect"];
        }
    }["WorkspaceDetailScreen.useEffect"], [
        accountId,
        accountsHydrated,
        router,
        workspaceId
    ]);
    const personnelEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkspaceDetailScreen.useMemo[personnelEntries]": ()=>{
            if (!workspace?.personnel) {
                return [];
            }
            return [
                {
                    label: "Manager",
                    value: workspace.personnel.managerId
                },
                {
                    label: "Supervisor",
                    value: workspace.personnel.supervisorId
                },
                {
                    label: "Safety officer",
                    value: workspace.personnel.safetyOfficerId
                }
            ].filter({
                "WorkspaceDetailScreen.useMemo[personnelEntries]": (entry)=>Boolean(entry.value)
            }["WorkspaceDetailScreen.useMemo[personnelEntries]"]);
        }
    }["WorkspaceDetailScreen.useMemo[personnelEntries]"], [
        workspace
    ]);
    const addressLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkspaceDetailScreen.useMemo[addressLines]": ()=>{
            if (!workspace?.address) {
                return [];
            }
            const { street, city, state, postalCode, country, details } = workspace.address;
            return [
                street,
                [
                    city,
                    state,
                    postalCode
                ].filter(Boolean).join(", "),
                country,
                details
            ].filter(Boolean);
        }
    }["WorkspaceDetailScreen.useMemo[addressLines]"], [
        workspace
    ]);
    function renderTabContent(tab) {
        if (!workspace) {
            return null;
        }
        switch(tab){
            case "Overview":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "border border-border/50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-start lg:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                size: "lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                        src: workspace.photoURL,
                                                        alt: workspace.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                        children: getWorkspaceInitials(workspace.name)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 262,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 260,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-2xl font-semibold tracking-tight",
                                                                children: workspace.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 267,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: [
                                                                    workspace.accountType === "organization" ? "Organization" : "Personal",
                                                                    " workspace · account ",
                                                                    workspace.accountId
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 268,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 266,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: lifecycleBadgeVariant[workspace.lifecycleState],
                                                                children: workspace.lifecycleState
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 275,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                children: workspace.visibility
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 278,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                children: [
                                                                    "Created ",
                                                                    formatTimestamp(workspace.createdAt)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 279,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        variant: "outline",
                                                        size: "sm",
                                                        onClick: ()=>{
                                                            setSettingsDraft(createSettingsDraft(workspace));
                                                            setSaveError(null);
                                                            setIsEditWorkspaceOpen(true);
                                                        },
                                                        children: "編輯工作區"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 282,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 265,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[20rem]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl border border-border/40 px-4 py-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Capabilities"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-xl font-semibold",
                                                        children: workspace.capabilities.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 298,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl border border-border/40 px-4 py-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Teams"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 303,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-xl font-semibold",
                                                        children: workspace.teamIds.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 302,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl border border-border/40 px-4 py-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Locations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 307,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-xl font-semibold",
                                                        children: workspace.locations?.length ?? 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 306,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl border border-border/40 px-4 py-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Grants"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-xl font-semibold",
                                                        children: workspace.grants.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 310,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                        lineNumber: 297,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                lineNumber: 258,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                            lineNumber: 257,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 xl:grid-cols-[1.2fr_0.8fr]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "border border-border/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    children: "Capabilities"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                    children: "Runtime features currently mounted on this workspace."
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 320,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "space-y-3",
                                            children: workspace.capabilities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "No capability bindings have been added yet."
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 328,
                                                columnNumber: 21
                                            }, this) : workspace.capabilities.map((capability)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-border/40 px-4 py-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold text-foreground",
                                                                    children: capability.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 338,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    children: capability.type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 341,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: capability.status === "stable" ? "secondary" : "outline",
                                                                    children: capability.status
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 342,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 337,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-2 text-sm text-muted-foreground",
                                                            children: capability.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, capability.id, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 326,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 319,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "border border-border/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    children: "Access Model"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 359,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                    children: "Team scopes and direct grants applied to this workspace."
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 358,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-foreground",
                                                            children: "Team access"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 366,
                                                            columnNumber: 21
                                                        }, this),
                                                        workspace.teamIds.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "No team access assigned."
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 368,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-2",
                                                            children: workspace.teamIds.map((teamId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "secondary",
                                                                    children: teamId
                                                                }, teamId, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 370,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-foreground",
                                                            children: "Direct grants"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 383,
                                                            columnNumber: 21
                                                        }, this),
                                                        workspace.grants.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "No direct grants recorded."
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 385,
                                                            columnNumber: 23
                                                        }, this) : workspace.grants.map((grant, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-xl border border-border/40 px-4 py-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-medium text-foreground",
                                                                        children: describeGrant(grant)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                        lineNumber: 392,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-xs text-muted-foreground",
                                                                        children: [
                                                                            "Role: ",
                                                                            grant.role,
                                                                            grant.teamId ? ` · Team: ${grant.teamId}` : "",
                                                                            grant.userId ? ` · User: ${grant.userId}` : "",
                                                                            grant.protocol ? ` · Protocol: ${grant.protocol}` : ""
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                        lineNumber: 395,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, `grant-${grant.role}-${grant.teamId ?? "none"}-${grant.userId ?? "none"}-${grant.protocol ?? "none"}-${index}`, true, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 388,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 382,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 357,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                            lineNumber: 318,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 xl:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "border border-border/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    children: "Locations"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 412,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                    children: "Physical or logical locations linked to the workspace."
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 411,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "space-y-3",
                                            children: workspace.locations == null || workspace.locations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "No locations have been configured yet."
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                lineNumber: 419,
                                                columnNumber: 21
                                            }, this) : workspace.locations.map((location)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-border/40 px-4 py-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold text-foreground",
                                                                    children: location.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 429,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    children: location.locationId
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 432,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 25
                                                        }, this),
                                                        location.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-2 text-sm text-muted-foreground",
                                                            children: location.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-2 text-xs text-muted-foreground",
                                                            children: [
                                                                "Capacity: ",
                                                                location.capacity ?? "—"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, location.locationId, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 417,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 410,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "border border-border/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    children: "Workspace Profile"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                    children: "Operational contacts and registered workspace address."
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 449,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-foreground",
                                                            children: "Personnel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 21
                                                        }, this),
                                                        personnelEntries.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "No personnel roles assigned."
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 459,
                                                            columnNumber: 23
                                                        }, this) : personnelEntries.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between rounded-xl border border-border/40 px-4 py-3 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-muted-foreground",
                                                                        children: entry.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                        lineNumber: 468,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium text-foreground",
                                                                        children: entry.value
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                        lineNumber: 469,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, entry.label, true, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 464,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 456,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-foreground",
                                                            children: "Address"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 478,
                                                            columnNumber: 21
                                                        }, this),
                                                        addressLines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "No address information has been provided."
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 480,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground",
                                                            children: addressLines.map((line, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: line
                                                                }, `${line}-${index}`, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 486,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 484,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 455,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 448,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                            lineNumber: 409,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true);
            case "Members":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceMembersTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspaceMembersTab"], {
                    workspace: workspace
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 497,
                    columnNumber: 16
                }, this);
            case "Daily":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceDailyTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspaceDailyTab"], {
                    workspace: workspace
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 499,
                    columnNumber: 16
                }, this);
            case "Files":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$components$2f$WorkspaceFilesTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspaceFilesTab"], {
                    workspace: workspace
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 501,
                    columnNumber: 16
                }, this);
            case "Wiki":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceWikiBetaView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspaceWikiBetaView"], {
                    workspace: workspace
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 503,
                    columnNumber: 16
                }, this);
            case "Schedule":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$scheduling$2f$interfaces$2f$WorkspaceSchedulingTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspaceSchedulingTab"], {
                    workspace: workspace,
                    accountId: accountId ?? workspace.accountId,
                    currentUserId: accountId ?? "anonymous"
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 506,
                    columnNumber: 11
                }, this);
            case "Audit":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$audit$2f$interfaces$2f$components$2f$WorkspaceAuditTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspaceAuditTab"], {
                    workspaceId: workspace.id
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 513,
                    columnNumber: 16
                }, this);
            default:
                return renderWorkspacePlaceholderTab(tab);
        }
    }
    async function handleSaveWorkspaceSettings(event) {
        event.preventDefault();
        if (!workspace || !settingsDraft) {
            return;
        }
        if (!accountId) {
            setSaveError("帳號上下文尚未完成同步，請稍候再試。");
            return;
        }
        const nextWorkspaceName = settingsDraft.name.trim();
        if (!nextWorkspaceName) {
            setSaveError("請輸入工作區名稱。");
            return;
        }
        setIsSavingWorkspace(true);
        setSaveError(null);
        const hasAddressContent = Boolean(settingsDraft.street.trim() || settingsDraft.city.trim() || settingsDraft.state.trim() || settingsDraft.postalCode.trim() || settingsDraft.country.trim() || settingsDraft.details.trim());
        const hasPersonnelContent = Boolean(settingsDraft.managerId.trim() || settingsDraft.supervisorId.trim() || settingsDraft.safetyOfficerId.trim());
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$5b3782__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateWorkspaceSettings"])({
            workspaceId: workspace.id,
            accountId,
            name: nextWorkspaceName,
            visibility: settingsDraft.visibility,
            lifecycleState: settingsDraft.lifecycleState,
            address: workspace.address != null || hasAddressContent ? {
                street: settingsDraft.street.trim(),
                city: settingsDraft.city.trim(),
                state: settingsDraft.state.trim(),
                postalCode: settingsDraft.postalCode.trim(),
                country: settingsDraft.country.trim(),
                details: trimOrUndefined(settingsDraft.details)
            } : undefined,
            personnel: workspace.personnel != null || hasPersonnelContent ? {
                managerId: trimOrUndefined(settingsDraft.managerId),
                supervisorId: trimOrUndefined(settingsDraft.supervisorId),
                safetyOfficerId: trimOrUndefined(settingsDraft.safetyOfficerId)
            } : undefined
        });
        if (!result.success) {
            setSaveError(result.error.message);
            setIsSavingWorkspace(false);
            return;
        }
        try {
            const detail = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceByIdForAccount"])(accountId, workspace.id);
            if (!detail) {
                router.replace("/workspace?context=unavailable");
                return;
            }
            setWorkspace(detail);
            setLoadState("loaded");
            setSettingsDraft(detail ? createSettingsDraft(detail) : null);
            setIsEditWorkspaceOpen(false);
        } catch (error) {
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn("[WorkspaceDetailScreen] Failed to refresh workspace after save:", error);
            }
            setSaveError("工作區已更新，但重新整理資料失敗。請稍後再試。");
        } finally{
            setIsSavingWorkspace(false);
        }
    }
    const resolvedTab = initialTab && (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWorkspaceTabValue"])(initialTab) ? initialTab : "Overview";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/workspace",
                className: "inline-flex text-sm font-medium text-primary hover:underline md:hidden",
                children: "← 返回 Workspace Hub"
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 613,
                columnNumber: 7
            }, this),
            !accountsHydrated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground",
                children: "正在同步帳號內容…"
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 618,
                columnNumber: 9
            }, this),
            loadState === "loading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "border border-border/50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "px-6 py-5 text-sm text-muted-foreground",
                    children: "Loading workspace detail…"
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 625,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 624,
                columnNumber: 9
            }, this),
            loadState === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "border border-destructive/30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "px-6 py-5 text-sm text-destructive",
                    children: "無法載入工作區資料，請返回清單後重試。"
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 633,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 632,
                columnNumber: 9
            }, this),
            loadState === "loaded" && !workspace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "border border-border/50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "px-6 py-5 text-sm text-muted-foreground",
                    children: "找不到此工作區。"
                }, void 0, false, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 641,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 640,
                columnNumber: 9
            }, this),
            workspace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "outline",
                            children: [
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabStatus"])(resolvedTab),
                                " ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabLabel"])(resolvedTab)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                            lineNumber: 650,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                        lineNumber: 649,
                        columnNumber: 11
                    }, this),
                    renderTabContent(resolvedTab)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 648,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isEditWorkspaceOpen,
                onOpenChange: (open)=>{
                    setIsEditWorkspaceOpen(open);
                    if (!open) {
                        setSaveError(null);
                        if (workspace) {
                            setSettingsDraft(createSettingsDraft(workspace));
                        }
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-h-[85vh] overflow-y-auto sm:max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "編輯工作區設定"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 670,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: "更新工作區基本資料、地址與聯絡角色，讓個人與組織工作區都能直接在內頁維護。"
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 671,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                            lineNumber: 669,
                            columnNumber: 11
                        }, this),
                        settingsDraft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-6",
                            onSubmit: handleSaveWorkspaceSettings,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 sm:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 sm:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm font-medium text-foreground",
                                                    htmlFor: "workspace-detail-name",
                                                    children: "工作區名稱"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 680,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "workspace-detail-name",
                                                    value: settingsDraft.name,
                                                    onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                ...current,
                                                                name: event.target.value
                                                            } : current),
                                                    disabled: isSavingWorkspace,
                                                    maxLength: 80
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 683,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 679,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: "可見性"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 697,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                    value: settingsDraft.visibility,
                                                    onValueChange: (value)=>setSettingsDraft((current)=>current ? {
                                                                ...current,
                                                                visibility: value
                                                            } : current),
                                                    disabled: isSavingWorkspace,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 708,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 707,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: "visible",
                                                                    children: "visible"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 711,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: "hidden",
                                                                    children: "hidden"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 712,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 710,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 698,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 696,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: "生命週期"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 718,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                    value: settingsDraft.lifecycleState,
                                                    onValueChange: (value)=>setSettingsDraft((current)=>current ? {
                                                                ...current,
                                                                lifecycleState: value
                                                            } : current),
                                                    disabled: isSavingWorkspace,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                lineNumber: 729,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 728,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: "preparatory",
                                                                    children: "preparatory"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 732,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: "active",
                                                                    children: "active"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 733,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: "stopped",
                                                                    children: "stopped"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                                    lineNumber: 734,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 731,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 719,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 717,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 678,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: "聯絡角色"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 742,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "個人與組織工作區都共用同一組工作區聯絡人欄位。"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 743,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 741,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-4 sm:grid-cols-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-manager-id",
                                                            children: "Manager"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 749,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-manager-id",
                                                            value: settingsDraft.managerId,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        managerId: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 752,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 748,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-supervisor-id",
                                                            children: "Supervisor"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 764,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-supervisor-id",
                                                            value: settingsDraft.supervisorId,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        supervisorId: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 767,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 763,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-safety-officer-id",
                                                            children: "Safety officer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 779,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-safety-officer-id",
                                                            value: settingsDraft.safetyOfficerId,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        safetyOfficerId: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 782,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 778,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 747,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 740,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: "地址資訊"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 798,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "用於個人據點與組織營運工作區的基礎地址資料。"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 797,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-4 sm:grid-cols-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 sm:col-span-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-address-street",
                                                            children: "Street"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 805,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-address-street",
                                                            value: settingsDraft.street,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        street: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 808,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 804,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-address-city",
                                                            children: "City"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 820,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-address-city",
                                                            value: settingsDraft.city,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        city: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 823,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 819,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-address-state",
                                                            children: "State"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-address-state",
                                                            value: settingsDraft.state,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        state: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 838,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 834,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-address-postal-code",
                                                            children: "Postal code"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 850,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-address-postal-code",
                                                            value: settingsDraft.postalCode,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        postalCode: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 853,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 849,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-address-country",
                                                            children: "Country"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 865,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-address-country",
                                                            value: settingsDraft.country,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        country: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 868,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 864,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 sm:col-span-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm font-medium text-foreground",
                                                            htmlFor: "workspace-address-details",
                                                            children: "Details"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 880,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "workspace-address-details",
                                                            value: settingsDraft.details,
                                                            onChange: (event)=>setSettingsDraft((current)=>current ? {
                                                                        ...current,
                                                                        details: event.target.value
                                                                    } : current),
                                                            disabled: isSavingWorkspace
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                            lineNumber: 883,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                                    lineNumber: 879,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 803,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 796,
                                    columnNumber: 15
                                }, this),
                                saveError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-destructive",
                                    children: saveError
                                }, void 0, false, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 897,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>setIsEditWorkspaceOpen(false),
                                            disabled: isSavingWorkspace,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 900,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isSavingWorkspace,
                                            children: isSavingWorkspace ? "儲存中…" : "儲存設定"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                            lineNumber: 908,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                                    lineNumber: 899,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                            lineNumber: 677,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                    lineNumber: 668,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
                lineNumber: 656,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx",
        lineNumber: 612,
        columnNumber: 5
    }, this);
}
_s(WorkspaceDetailScreen, "v5g1JFqLuPc8skEO6iJz3V89PYc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = WorkspaceDetailScreen;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceDetailScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * workspace module public API
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/application/use-cases/workspace.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$application$2f$use$2d$cases$2f$workspace$2d$member$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/application/use-cases/workspace-member.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceQueryRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceHubScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/components/WorkspaceHubScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceDetailScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceMembersTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/components/WorkspaceMembersTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$components$2f$WorkspaceWikiBetaView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/components/WorkspaceWikiBetaView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/workspace-tabs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$hooks$2f$useWorkspaceHub$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/hooks/useWorkspaceHub.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/queries/workspace.queries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2d$member$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/queries/workspace-member.queries.ts [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=modules_workspace_5df5ae26._.js.map