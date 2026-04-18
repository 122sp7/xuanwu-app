/**
 * workspace-ui-stubs — re-export barrel (backward-compatible surface).
 *
 * This file was previously a monolithic stubs file.  It is now a thin barrel
 * that re-exports from three focused modules:
 *
 *   workspace-nav-model.ts        — pure tab/group/URL model (no JSX)
 *   workspace-shell-interop.tsx   — shell integration components & hooks
 *   workspace-route-screens.tsx   — workspace-scoped route screens
 *
 * Account / organization route screens (AccountDashboard, OrganizationTeams,
 * OrganizationSchedule, OrganizationDaily, OrganizationAudit,
 * OrganizationWorkspaces) now live in platform-ui-stubs because they are owned
 * by the platform bounded context, not the workspace bounded context.
 *
 * Direct consumers of those screens must import from platform-ui-stubs instead.
 * AccountRouteDispatcher has already been updated accordingly.
 */

export * from "./workspace-nav-model";
export * from "./workspace-shell-interop";
export * from "./workspace-route-screens";
