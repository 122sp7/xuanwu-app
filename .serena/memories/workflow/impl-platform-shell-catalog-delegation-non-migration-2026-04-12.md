Scope
- Implemented second-wave non-migration downward allocation for platform shell catalogs.

What changed
- Added platform-config application service `shell-navigation-catalog.ts` owning:
  - shell route titles
  - breadcrumb segment labels
  - nav section labels
  - account/org nav item catalogs
  - nav section resolver
- Added search application service `shell-command-catalog.ts` owning command-palette nav catalog.
- Exposed both through subdomain API boundaries (`platform-config/api`, `search/api`).
- Refactored interfaces/web shell files to delegate:
  - ShellRootLayout -> `resolveShellPageTitle`
  - ShellAppBreadcrumbs -> `resolveShellBreadcrumbLabel`
  - ShellSidebarNavData -> catalogs/resolver from platform-config api while keeping icon composition local
  - ShellGlobalSearchDialog -> `listShellCommandCatalogItems`

Validation
- get_errors on changed files: no errors.
- npm run lint: 0 errors, existing warnings unchanged.
- npm run build: success.

Architecture intent
- No file migration/copy.
- Interfaces remain composition adapters.
- Ownership of policies/catalogs moved to owning subdomains and consumed via API.

Notes
- prune_index equivalent is not exposed as a Serena tool in this environment.
