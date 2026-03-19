# Workspace Screen Components

**Module:** `modules/workspace/`  
**Verified:** 2026-03-19

## Interface Layer — `modules/workspace/interfaces/`

### Components

| Component | File | Description |
|-----------|------|-------------|
| `WorkspaceHubScreen` | `components/WorkspaceHubScreen.tsx` | Workspace list / hub view |
| `WorkspaceDetailScreen` | `components/WorkspaceDetailScreen.tsx` | Single workspace detail view |
| `WorkspaceDailyTab` | `components/WorkspaceDailyTab.tsx` | Daily standup tab within workspace |
| `WorkspaceMembersTab` | `components/WorkspaceMembersTab.tsx` | Members management tab |

### Hooks

| Hook | File | Description |
|------|------|-------------|
| `useWorkspaceHub` | `hooks/useWorkspaceHub.ts` | Hub state and data fetching |

### Queries

| Query | File | Description |
|-------|------|-------------|
| workspace queries | `queries/workspace.queries.ts` | Workspace data queries |
| workspace member queries | `queries/workspace-member.queries.ts` | Member list queries |

### Actions

| Action file | Description |
|-------------|-------------|
| `_actions/workspace.actions.ts` | Server actions for workspace operations |

---

## App Shell Routes

| Route | Page | Renders |
|-------|------|---------|
| `app/(shell)/workspace/page.tsx` | WorkspaceHub route | `WorkspaceHubScreen` |
| `app/(shell)/workspace/[workspaceId]/page.tsx` | Dynamic workspace | `WorkspaceDetailScreen` with tabs |

---

## Shell _components Used in Workspace Context

- `shell-guard/` — protects workspace routes (auth check)
- `account-switcher/` — workspace/account selector
- `dashboard-sidebar/` — navigation sidebar

---

## Workspace Module Domain Structure

The workspace module has `ports/` (active) and standard MDDD layout:
```
modules/workspace/
├── domain/
├── application/
├── infrastructure/
├── interfaces/      ← see tables above
└── ports/
```
