Scope
- Evaluated platform shell web files for downward allocation into owning subdomains without file copy/move.

Decisions
- Keep interfaces/web as composition adapters.
- Downward allocation pattern: extract rules/catalogs/services into subdomain application/domain, expose through subdomain api, consume from shell components.
- Already applied pattern: organization-account access/fallback policy now owned by access-control service and consumed by shell layout/nav.

File-to-owner highlights
- ShellRootLayout route access checks -> access-control.
- ShellSidebarNavData section/account catalogs -> platform-config (catalog) + access-control (gates).
- ShellGlobalSearchDialog NAV_ITEMS -> search (catalog/query source).
- ShellAppRail organization governance rail policy -> organization + access-control.
- ShellDashboardSidebar cross-context quick-create orchestration -> platform application service (delegating to notion/workspace APIs).
- ShellThemeToggle/ShellTranslationSwitcher remain interfaces (client preference UI state).

Validation
- Serena symbol overview queries succeeded on target shell files.
- Current project lint/build baseline remains successful with warnings only (no errors).

Open Questions
- Whether platform-config subdomain should own all shell catalogs or split between platform-config and search based on lifecycle.
- Whether AppRail should consume one unified navigation policy API to reduce local branching.
