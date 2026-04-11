# Wave 3: Shell Rail, Context Config, Mobile/Org Nav, Cross-Domain Delegation

## Scope
Continued platform interfaces → subdomain delegation for Hexagonal DDD compliance.

## Changes

### platform-config subdomain (shell-navigation-catalog.ts)
Extended with:
- `ShellRailCatalogItem`, `ShellContextSectionConfig` types
- `isExactOrChildPath()` — unified route matcher (replaces duplicate local functions)
- `SHELL_RAIL_CATALOG_ITEMS` (8 items), `listShellRailCatalogItems(isOrganization)`
- `SHELL_CONTEXT_SECTION_CONFIG` (5 sections: knowledge-base, knowledge-database, source, notebook, ai-chat)
- `SHELL_MOBILE_NAV_ITEMS`, `SHELL_ORG_PRIMARY_NAV_ITEMS`, `SHELL_ORG_SECONDARY_NAV_ITEMS`

### platform application services (shell-quick-create.ts) — NEW
- Cross-bounded-context orchestration for shell quick-create actions
- `quickCreateKnowledgePage()` delegates to notion/api `createKnowledgePage`
- Removes direct notion import from platform interfaces layer

### ShellAppRail.tsx
- Removed local `isExactOrChildPath`, local `railItems` array
- Delegates to `listShellRailCatalogItems()` from platform-config
- Keeps `RAIL_ICON_MAP` locally (pure UI concern — icon mapping)

### ShellSidebarBody.tsx
- Removed local `CONTEXT_SECTION_CONFIG`
- Uses `SHELL_CONTEXT_SECTION_CONFIG` from platform-config

### ShellRootLayout.tsx
- Removed local `mobileNavItems`, `orgPrimaryItems`, `orgSecondaryItems`
- Removed `isActiveRoute` import from ShellSidebarNavData
- Uses `SHELL_MOBILE_NAV_ITEMS`, `SHELL_ORG_PRIMARY_NAV_ITEMS`, `SHELL_ORG_SECONDARY_NAV_ITEMS` from platform-config
- Uses `isExactOrChildPath` from platform-config

### ShellDashboardSidebar.tsx
- Removed direct `createKnowledgePage` import from `@/modules/notion/api`
- Uses `quickCreateKnowledgePage` from platform application services (cross-domain orchestration)

### ShellSidebarNavData.tsx
- `isActiveRoute` now delegates to `isExactOrChildPath` from platform-config (still exported for backward compat)

## Validation
- TypeScript: 0 errors
- ESLint: 0 errors, 11 warnings (all pre-existing)
- max-lines on ShellAppRail: was ~380, now 320 (pre-existing warning, improved)

## Remaining
- ShellAppRail still has max-lines warning (320 > 300) — pure UI rendering, correctly placed
- All pre-existing warnings unchanged
