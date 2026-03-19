# Runtime Entrypoints

**Verified:** 2026-03-19

## App Router Route Groups

### `app/(public)/`
- `page.tsx` — public landing / login page

### `app/(shell)/` — authenticated shell
Root layout: `app/(shell)/layout.tsx`

| Route | File | Component | Notes |
|-------|------|-----------|-------|
| `/dashboard` | `dashboard/page.tsx` | DashboardPage | Main hub |
| `/organization` | `organization/page.tsx` | OrganizationPage | Org management |
| `/settings` | `settings/` (dir) | — | Settings routes |
| `/workspace` | `workspace/page.tsx` | WorkspaceHubScreen | List of workspaces |
| `/workspace/[workspaceId]` | `workspace/[workspaceId]/page.tsx` | Dynamic workspace detail | Dynamic route (NEW) |

### `app/(shell)/_components/` — Shell UI components
- `account-switcher/`
- `dashboard-sidebar/`
- `header-controls/`
- `header-user-avatar/`
- `nav-user/`
- `shell-guard/` — auth guard for shell
- `translation-switcher/`

## API Routes

### `app/api/rag/`
- `upload-init/` — RAG upload initialization endpoint

## Providers

| File | Purpose |
|------|---------|
| `app/providers/app-provider.tsx` | App-level context provider |
| `app/providers/app-context.ts` | App context type |
| `app/providers/auth-provider.tsx` | Auth state provider |
| `app/providers/auth-context.ts` | Auth context type |
| `app/providers/providers.tsx` | Provider composition root |

## Root Layout

`app/layout.tsx` — root HTML/body wrapper, mounts providers

## Globals

`app/globals.css` — Tailwind global styles
