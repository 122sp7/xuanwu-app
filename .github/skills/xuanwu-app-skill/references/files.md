# Files

## File: .agents/skills
````
../.github/skills
````

## File: .firebaserc
````
{
  "projects": {
    "default": "xuanwu-i-00708880-4e2d8"
  }
}
````

## File: .gitattributes
````
# Use bd merge for beads JSONL files
.beads/issues.jsonl merge=beads
````

## File: .mcp.json
````json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp"
      ]
    },
    "filesystem": {                                                  
      "command": "npx",                                              
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."] 
    },                                                  
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ]
    }
  }
}
````

## File: AGENTS.md
````markdown
# Agent Guide — Xuanwu App

This file is the entry point for AI agents (GitHub Copilot, Claude, OpenCode, etc.) working in this repository.

## Development Status Workflow

Use the following status flow for issues, tasks, and features:

| Order | Status | Emoji | Description |
|------|--------|-------|-------------|
| 0 | Idea | 💡 | Initial idea or feature request |
| 1 | Backlog | 📥 | Stored in backlog, not scheduled |
| 2 | Planned | 📅 | Planned and scheduled |
| 3 | Designing | 🎨 | Architecture / UI / schema design |
| 4 | Ready | 🟢 | Ready for development |
| 5 | Developing | 🚧 | Active development |
| 6 | Midway | 🏗️ | Development partially completed |
| 7 | Testing | 🧪 | Testing / QA |
| 8 | Fixing | 🔧 | Bug fixing |
| 9 | Review | 🔍 | Code review / acceptance review |
|10 | Staging | 🚀 | Staging / pre-production |
|11 | Done | ✅ | Development completed |
|12 | Delivered | 📦 | Delivered / deployed to production |
|13 | Archived | 🗄️ | Archived / closed / inactive |

## Quick Start

1. Read [`.github/agents/README.md`](.github/agents/README.md) — rules index and overview
2. Read [`.github/agents/knowledge-base.md`](.github/agents/knowledge-base.md) — domain knowledge and module inventory
3. Read [`.github/agents/commands.md`](.github/agents/commands.md) — build, lint, deploy commands
4. Read [`.github/README.md`](.github/README.md) — customization index for agents, prompts, skills, and instructions

## Key Rules

### Architecture

- Follow **Module-Driven Domain Design (MDDD)**: code belongs in `modules/<context>/`.
- Treat every `modules/<module-name>/` as an isolated bounded context.
- Cross-module interaction must go through `modules/<module-name>/api/` only.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must stay framework-free (no Firebase SDK, React, HTTP clients).
- Keep boundaries explicit: business logic stays in `application/` + `domain/`, while UI/UX concerns stay in `interfaces/` and `app/` composition.
- Import shared code through `@alias` package aliases, never with relative paths across modules.

### Import Aliases

```ts
import type { CommandResult } from "@shared-types";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { getFirebaseFirestore } from "@integration-firebase";
```

Never use legacy paths: `@/shared/*`, `@/libs/*`, `@/infrastructure/*`, `@/ui/*`.

### Runtime Boundary

- **Next.js** owns browser-facing APIs, upload UX, auth/session, Server Actions, streaming AI responses.
- **`py_fn/`** owns ingestion, parsing, chunking, embedding, and background jobs.
- Do not add chat streaming or auth logic to `py_fn/`.

## Validation Commands

```bash
npm install          # Install dependencies
npm run lint         # ESLint (0 errors expected; pre-existing warnings are OK)
npm run build        # Next.js production build + TypeScript type-check

# Python worker
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## Common Patterns

### Server Action (write-side)

```ts
"use server";
export async function myAction(input: MyInput): Promise<CommandResult> {
  // validate → use case → return CommandResult
}
```

### Use Case

```ts
// modules/<context>/application/use-cases/MyUseCase.ts
export class MyUseCase {
  constructor(private readonly repo: MyRepository) {}
  async execute(input: MyInput): Promise<CommandResult> { ... }
}
```

### Repository

- Interface in `domain/repositories/`.
- Firebase implementation in `infrastructure/firebase/`.

## IDDD 領域驅動設計規範 (Implementing Domain-Driven Design)

本專案已導入 Vaughn Vernon《Implementing Domain-Driven Design》(IDDD) 規範，以確保 Copilot 生成的程式碼符合通用語言、限界上下文與事件驅動架構原則。

### DDD 審查 Agent

- **[Domain Architect](.github/agents/domain-architect.agent.md)** — IDDD 領域架構審查，負責確認聚合根設計、限界上下文邊界、通用語言一致性與領域事件規範。

### DDD 指令文件 (Instructions)

| 文件 | 用途 |
|------|------|
| [ubiquitous-language](.github/instructions/ubiquitous-language.instructions.md) | 強制查閱 `terminology-glossary.md`，規範通用語言命名 |
| [bounded-context-rules](.github/instructions/bounded-context-rules.instructions.md) | 限界上下文邊界與模組依賴方向規範 |
| [domain-modeling](.github/instructions/domain-modeling.instructions.md) | 聚合根、實體與值對象的 Immutable 設計與 Zod 驗證規範 |
| [event-driven-state](.github/instructions/event-driven-state.instructions.md) | XState 與領域事件互動、SuperJSON 序列化規範 |

### DDD Prompt 模板

- [`generate-aggregate`](.github/prompts/generate-aggregate.prompt.md) — 生成符合 IDDD 規範的 TypeScript 聚合根骨架。
- [`generate-domain-event`](.github/prompts/generate-domain-event.prompt.md) — 生成領域事件定義（Zod Schema + 型別推導）。

### DDD 術語表

DDD 相關術語定義（聚合根、限界上下文、通用語言等）請查閱 [`.github/terminology-glossary.md`](.github/terminology-glossary.md) 的「DDD 戰略設計術語」與「DDD 戰術設計術語」章節。

## Spec-Driven Development

When asked to use spec-driven development, follow [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## Copilot Delivery Workflow

This repository also maintains a formal Copilot delivery chain for non-trivial work:

1. Planner
2. Implementer
3. Reviewer
4. QA

Use `.github/copilot-instructions.md` as the Copilot-specific baseline and see [`docs/handoffs.md`](docs/handoffs.md) for the formal stage transitions.

## Permissions

For the RBAC/role model used in this project, see [`PERMISSIONS.md`](PERMISSIONS.md).

## Full Rules

See [`.github/agents/README.md`](.github/agents/README.md), [`.github/instructions/`](.github/instructions/), and [`.github/prompts/`](.github/prompts/) for the active rule and workflow set.
````

## File: agents/agents
````
../.github/agents
````

## File: agents/hooks
````
../.github/hooks
````

## File: agents/instructions
````
../.github/instructions
````

## File: agents/prompts
````
../.github/prompts
````

## File: agents/rules
````
../.github/rules
````

## File: agents/skills
````
../.github/skills
````

## File: app/(public)/page.tsx
````typescript
/**
 * app/(public)/page.tsx
 * Public landing page with top-right auth entry and inline auth panel.
 * Uses identity module use cases directly on the client so Firebase auth state
 * actually updates AuthProvider via onAuthStateChanged.
 */
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/app/providers/auth-provider";
import {
  FirebaseIdentityRepository,
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
} from "@/modules/identity/api";
import { CreateUserAccountUseCase, FirebaseAccountRepository } from "@/modules/account/api";
import {
  createDevDemoUser,
  isDevDemoCredential,
  isLocalDevDemoAllowed,
  writeDevDemoSession,
} from "@/app/providers/dev-demo-auth";
type Tab = "login" | "register";
⋮----
async function handleSubmit(e: React.FormEvent)
async function handleGuestAccess()
⋮----
// Dev-mode fallback: when Firebase anonymous auth is unavailable (e.g. network
// blocked in sandboxes), create a local guest session so the shell can be tested.
⋮----
async function handlePasswordReset()
⋮----
setError(null);
setResetSent(false);
setIsAuthPanelOpen((prev)
````

## File: app/(shell)/_components/account-switcher.tsx
````typescript
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/app/providers/auth-context";
import { useApp } from "@/app/providers/app-provider";
import type { AccountEntity } from "@/modules/account/api";
import { createOrganization } from "@/modules/organization/api";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated?: (account: AccountEntity) => void;
}
⋮----
function resetCreateOrganizationDialog()
async function handleCreateOrganization(event: FormEvent<HTMLFormElement>)
⋮----
setIsCreateOrganizationOpen(open);
⋮----
resetCreateOrganizationDialog();
setIsCreateOrganizationOpen(false);
````

## File: app/(shell)/_components/customize-navigation-dialog.tsx
````typescript
/**
 * Module: customize-navigation-dialog.tsx
 * Purpose: Let users pick which nav items stay pinned in the secondary sidebar.
 * Responsibilities: checkbox toggles per item, workspace nav-style radio, show-N-workspaces
 *   preference, all persisted to localStorage.
 * Constraints: UI-only; pure preference storage, no backend call.
 */
import { GripVertical } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  attachClosestEdge,
  combine,
  draggable,
  DropIndicator,
  dropTargetForElements,
  extractClosestEdge,
  reorder,
  type Edge,
} from "@lib-dragdrop";
import { Button } from "@ui-shadcn/ui/button";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Separator } from "@ui-shadcn/ui/separator";
// ── Types ──────────────────────────────────────────────────────────────────
export interface NavPreferences {
  /** IDs of personal nav items that are pinned */
  pinnedPersonal: string[];
  /** IDs of workspace org-management items that are pinned */
  pinnedWorkspace: string[];
  /** Whether to show a limited number of workspaces */
  showLimitedWorkspaces: boolean;
  /** Max number of workspaces to show (when showLimitedWorkspaces = true) */
  maxWorkspaces: number;
  /** Explicit display order of workspace items for sidebar and customize dialog */
  workspaceOrder: string[];
}
⋮----
/** IDs of personal nav items that are pinned */
⋮----
/** IDs of workspace org-management items that are pinned */
⋮----
/** Whether to show a limited number of workspaces */
⋮----
/** Max number of workspaces to show (when showLimitedWorkspaces = true) */
⋮----
/** Explicit display order of workspace items for sidebar and customize dialog */
⋮----
// ── Personal nav items ─────────────────────────────────────────────────────
⋮----
// ── Workspace / org-management items ──────────────────────────────────────
⋮----
interface SidebarLocaleBundle {
  workspace?: {
    groups?: Record<string, string>;
    tabLabels?: Record<string, string>;
  };
}
⋮----
function normalizePinnedIds(
  ids: unknown,
  validSet: Set<string>,
  fallback: string[],
)
function normalizeWorkspaceOrder(order: unknown)
// ── localStorage helpers ───────────────────────────────────────────────────
export function readNavPreferences(): NavPreferences
function writeNavPreferences(prefs: NavPreferences)
// ── Sub-components ─────────────────────────────────────────────────────────
interface CheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}
function CheckRow(
interface WorkspaceCheckRowProps {
  id: string;
  label: string;
  checked: boolean;
  activeDropEdge: Edge | null;
  isDropTarget: boolean;
  onToggle: () => void;
  onDragOverItem: (targetId: string, edge: Edge | null) => void;
  onDragLeaveItem: (targetId: string) => void;
  onReorder: (sourceId: string, targetId: string, edge: Edge | null) => void;
}
⋮----
// ── Main component ─────────────────────────────────────────────────────────
⋮----
const getWorkspaceLabel = (item: (typeof WORKSPACE_NAV_ITEMS)[number]) =>
const getOrganizationLabel = (item: (typeof ORGANIZATION_NAV_ITEMS)[number]) =>
⋮----
function toggleWorkspace(id: string)
function reorderWorkspaceItems(sourceId: string, targetId: string, edge: Edge | null)
⋮----
{/* ── Personal items ─────────────────────────────────────────── */}
⋮----
togglePersonal(item.id);
⋮----
label=
⋮----
toggleWorkspace(item.id);
⋮----
setDragTarget(
⋮----
setDragTarget((current)
⋮----
{/* Show limited workspaces */}
⋮----
updatePrefs(
⋮----
{/* ── Footer ─────────────────────────────────────────────────── */}
⋮----
onOpenChange(false);
````

## File: app/(shell)/_components/header-user-avatar.tsx
````typescript
/**
 * Module: header-user-avatar.tsx
 * Purpose: render top-right signed-in user identity as avatar with quick actions.
 * Responsibilities: display user identity and expose sign-out action.
 * Constraints: keep header interaction lightweight and presentation-oriented.
 */
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
interface HeaderUserAvatarProps {
  readonly name: string;
  readonly email: string;
  readonly onSignOut: () => void;
}
function toInitial(name: string, email: string)
export function HeaderUserAvatar(
⋮----
{/* Profile header */}
````

## File: app/(shell)/_components/nav-user.tsx
````typescript
import { Button } from "@ui-shadcn/ui/button";
interface NavUserProps {
  name: string;
  email: string;
  onSignOut: () => void;
}
export function NavUser(
````

## File: app/(shell)/_components/shell-guard.tsx
````typescript
/**
 * shell-guard.tsx
 * Client-side auth guard for the authenticated shell.
 *
 * Responsibilities:
 *  1. Redirect to `/` (public auth page) when auth status is "unauthenticated"
 *  2. Mount useTokenRefreshListener for [S6] Claims refresh (Party 3)
 *  3. Show a loading state while auth is initializing
 */
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { useTokenRefreshListener } from "@/modules/identity/api";
interface ShellGuardProps {
  children: ReactNode;
}
export function ShellGuard(
⋮----
// [S6] Party 3: force-refresh ID token when a TOKEN_REFRESH_SIGNAL is emitted
````

## File: app/(shell)/_components/translation-switcher.tsx
````typescript
/**
 * Module: translation-switcher.tsx
 * Purpose: provide a reusable locale switch control for shell-level UI.
 * Responsibilities: persist locale preference and sync html lang attribute.
 * Constraints: keep state client-side and avoid coupling to business modules.
 */
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@ui-shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
⋮----
type LocaleValue = (typeof localeOptions)[number]["value"];
function isLocaleValue(value: string | null): value is LocaleValue
export function TranslationSwitcher()
⋮----
<DropdownMenuRadioGroup value=
````

## File: app/(shell)/dashboard/page.tsx
````typescript
/**
 * /dashboard — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";
export default function DashboardPage()
````

## File: app/(shell)/organization/_utils.ts
````typescript
import type { AccountEntity } from "@/modules/account/api";
import type { ActiveAccount } from "@/app/providers/app-context";
export function isOrganizationAccount(
  activeAccount: ActiveAccount | null,
): activeAccount is AccountEntity &
export function formatDateTime(value: string | Date | null | undefined): string
````

## File: app/(shell)/organization/audit/page.tsx
````typescript
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/app/providers/app-provider";
import { AuditStream, getOrganizationAuditLogs } from "@/modules/workspace-audit/api";
import { getWorkspacesForAccount } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { formatDateTime, isOrganizationAccount } from "../_utils";
⋮----
async function load()
⋮----
{/* ── 稽核時間軸（新版 AuditStream）─────────────────────────────── */}
````

## File: app/(shell)/organization/daily/page.tsx
````typescript
import { useApp } from "@/app/providers/app-provider";
import { WorkspaceFeedAccountView } from "@/modules/workspace-feed/api";
import { isOrganizationAccount } from "../_utils";
export default function OrganizationDailyPage()
````

## File: app/(shell)/organization/members/page.tsx
````typescript
import { useEffect, useState } from "react";
import { useApp } from "@/app/providers/app-provider";
import { getOrganizationMembers } from "@/modules/organization/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";
⋮----
async function load()
````

## File: app/(shell)/organization/permissions/page.tsx
````typescript
import { useEffect, useState } from "react";
import { useApp } from "@/app/providers/app-provider";
import { getOrgPolicies } from "@/modules/organization/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";
export default function OrganizationPermissionsPage()
⋮----
async function load()
````

## File: app/(shell)/organization/schedule/dispatcher/page.tsx
````typescript
import { redirect } from "next/navigation";
/**
 * Dispatcher page — redirects to the organization schedule view.
 * Route: /organization/schedule/dispatcher
 */
export default function DispatcherPage()
````

## File: app/(shell)/organization/schedule/page.tsx
````typescript
import { useApp } from "@/app/providers/app-provider";
import { AccountSchedulingView } from "@/modules/workspace-scheduling/api";
import { isOrganizationAccount } from "../_utils";
export default function OrganizationSchedulePage()
````

## File: app/(shell)/organization/teams/page.tsx
````typescript
import { useEffect, useState } from "react";
import { useApp } from "@/app/providers/app-provider";
import { getOrganizationTeams } from "@/modules/organization/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";
⋮----
async function load()
````

## File: app/(shell)/organization/workspaces/page.tsx
````typescript
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/app/providers/app-provider";
import { getWorkspacesForAccount } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";
⋮----
async function load()
````

## File: app/(shell)/settings/general/page.tsx
````typescript
/**
 * /settings/general — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";
export default function SettingsGeneralPage()
````

## File: app/(shell)/settings/notifications/page.tsx
````typescript
/**
 * /settings/notifications — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";
export default function SettingsNotificationsPage()
````

## File: app/(shell)/settings/page.tsx
````typescript
/**
 * /settings — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";
export default function SettingsPage()
````

## File: app/(shell)/settings/profile/page.tsx
````typescript
/**
 * /settings/profile — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";
export default function SettingsProfilePage()
````

## File: app/(shell)/workspace/[workspaceId]/page.tsx
````typescript
import { useParams, useSearchParams } from "next/navigation";
import { useApp } from "@/app/providers/app-provider";
import { WorkspaceDetailScreen } from "@/modules/workspace/api";
````

## File: app/(shell)/workspace/page.tsx
````typescript
import { useSearchParams } from "next/navigation";
import type { ActiveAccount } from "@/app/providers/app-context";
import { useApp } from "@/app/providers/app-provider";
import { WorkspaceHubScreen } from "@/modules/workspace/api";
function isOrganizationAccount(activeAccount: ActiveAccount | null): activeAccount is ActiveAccount &
function getActiveAccountType(activeAccount: ActiveAccount | null)
````

## File: app/globals.css
````css
@theme inline {
:root {
.dark {
@layer base {
⋮----
* {
body {
html {
⋮----
@apply font-sans;
````

## File: app/layout.tsx
````typescript
import type { Metadata } from "next";
⋮----
import { Geist } from "next/font/google";
import { cn } from "@shared-utils";
import { Providers } from "@/app/providers/providers";
⋮----
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
````

## File: app/providers/app-context.ts
````typescript
/**
 * app-context.ts
 * Defines the AppContext contract: the cross-cutting "active account" state.
 *
 * Holds the set of accounts visible to the current user plus the currently
 * active account selection. Consumed by feature pages and sidebar nav.
 */
import { createContext, type Dispatch } from "react";
import type { AccountEntity } from "@/modules/account/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import type { AuthUser } from "./auth-context";
export type ActiveAccount = AccountEntity | AuthUser;
export interface AppState {
  /** All organization accounts visible to the signed-in user. */
  accounts: Record<string, AccountEntity>;
  /** True once the first Firestore snapshot has been received. */
  accountsHydrated: boolean;
  /** Bootstrap phase for optimistic seeding. */
  bootstrapPhase: "idle" | "seeded" | "hydrated";
  /** Currently selected account (personal user account or an organization). */
  activeAccount: ActiveAccount | null;
  /** Currently selected workspace context under the active account. */
  activeWorkspaceId: string | null;
  /** Workspaces visible under the active account (single source for shell UI). */
  workspaces: Record<string, WorkspaceEntity>;
  /** True once the first active-account workspace snapshot has been received. */
  workspacesHydrated: boolean;
}
⋮----
/** All organization accounts visible to the signed-in user. */
⋮----
/** True once the first Firestore snapshot has been received. */
⋮----
/** Bootstrap phase for optimistic seeding. */
⋮----
/** Currently selected account (personal user account or an organization). */
⋮----
/** Currently selected workspace context under the active account. */
⋮----
/** Workspaces visible under the active account (single source for shell UI). */
⋮----
/** True once the first active-account workspace snapshot has been received. */
⋮----
export type AppAction =
  | {
      type: "SEED_ACTIVE_ACCOUNT";
      payload: { user: AuthUser };
    }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: AuthUser;
        preferredActiveAccountId?: string | null;
      };
    }
  | {
      type: "SET_WORKSPACES";
      payload: {
        workspaces: Record<string, WorkspaceEntity>;
        hydrated: boolean;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "RESET_STATE" };
export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}
````

## File: app/providers/app-provider.tsx
````typescript
/**
 * app-provider.tsx
 * Hosts the app-level active-account lifecycle and exposes useApp().
 *
 * Responsibilities:
 *  1. Watch AuthProvider state for sign-in / sign-out events
 *  2. Subscribe to the user's visible accounts (orgs) via account module queries
 *  3. Maintain activeAccount selection (default: personal user account from auth)
 *  4. Expose state + dispatch via AppContext
 */
import {
  useReducer,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { subscribeToAccountsForUser, type AccountEntity } from "@/modules/account/api";
import {
  subscribeToWorkspacesForAccount,
  type WorkspaceEntity,
} from "@/modules/workspace/api";
import { AppContext, type AppState, type AppAction } from "./app-context";
import type { AuthUser } from "./auth-context";
import { useAuth } from "./auth-provider";
// ─── Initial State ────────────────────────────────────────────────────────────
⋮----
function getWorkspaceStorageKey(accountId: string)
⋮----
function toWorkspaceMap(workspaces: WorkspaceEntity[])
// ─── Reducer ──────────────────────────────────────────────────────────────────
function resolveActiveAccount(
  state: AppState,
  accounts: Record<string, AccountEntity>,
  user: AuthUser,
  preferredActiveAccountId?: string | null,
)
⋮----
// During the initial seeded phase we only know about the personal account.
// Once the real organization snapshot arrives, prefer the last persisted
// account so re-login restores the user's previous working context instead of
// leaving them in the optimistic personal fallback.
⋮----
function appReducer(state: AppState, action: AppAction): AppState
// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider(
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
⋮----
// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp()
````

## File: app/providers/auth-context.ts
````typescript
/**
 * auth-context.ts
 * Defines the AuthContext contract: state shape, actions, and React context.
 * Consumed by AuthProvider and useAuth().
 */
import { createContext, type Dispatch } from "react";
export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";
/** Minimal user record surfaced from Firebase auth state. */
export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}
export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}
export type AuthAction =
  | { type: "SET_AUTH_STATE"; payload: { user: AuthUser | null; status: AuthStatus } }
  | { type: "UPDATE_DISPLAY_NAME"; payload: { name: string } };
export interface AuthContextValue {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  logout: () => Promise<void>;
}
````

## File: app/providers/dev-demo-auth.ts
````typescript
import type { AuthUser } from "./auth-context";
⋮----
// Localhost-only development fallback secret for the requested smoke-test account.
// Never reuse this pattern for production authentication flows.
⋮----
function isLocalhostHost(hostname: string): boolean
export function isLocalDevDemoAllowed(): boolean
export function isDevDemoCredential(email: string, password: string): boolean
export function createDevDemoUser(): AuthUser
export function readDevDemoSession(): AuthUser | null
export function writeDevDemoSession(user: AuthUser): void
export function clearDevDemoSession(): void
````

## File: app/providers/providers.tsx
````typescript
/**
 * providers.tsx
 * Composed root providers tree.
 * Import <Providers> into app/layout.tsx to wrap the entire application.
 *
 * Provider nesting order (outermost → innermost):
 *   AuthProvider   — Firebase auth state
 *   AppProvider    — Active account + org accounts (depends on AuthProvider)
 */
import type { ReactNode } from "react";
import { Toaster } from "@ui-shadcn/ui/sonner";
import { AuthProvider } from "./auth-provider";
import { AppProvider } from "./app-provider";
export function Providers(
````

## File: apphosting.yaml
````yaml
# Settings for Backend (on Cloud Run).
# See https://firebase.google.com/docs/app-hosting/configure#cloud-run
runConfig:
  minInstances: 0
  # maxInstances: 100
  # concurrency: 80
  # cpu: 1
  # memoryMiB: 512
# Environment variables and secrets.
env:
  # --- Firebase Web configuration ---
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    value: "AIzaSyBkniZGal_Lls4CR3eFuZvSVMZBe73STNs"
  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    value: "xuanwu-i-00708880-4e2d8.firebaseapp.com"
  - variable: NEXT_PUBLIC_FIREBASE_DATABASE_URL
    value: "https://xuanwu-i-00708880-4e2d8-default-rtdb.asia-southeast1.firebasedatabase.app"
  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: "xuanwu-i-00708880-4e2d8"
  - variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    value: "xuanwu-i-00708880-4e2d8.firebasestorage.app"
  - variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    value: "65970295651"
  - variable: NEXT_PUBLIC_FIREBASE_APP_ID
    value: "1:65970295651:web:e97e482f1444afbdc93956"
  # --- Web Push (VAPID) ---
  - variable: NEXT_PUBLIC_VAPID_PUBLIC_KEY
    value: "BGnZm6Y1hqYG-N-hMnwWuJiEEM9LDO85L69kLqggG9IimGXGjrQpfxhmU9f0DCU_S4G2Ujb9_etDZHWzSpGk0co"
  - variable: VAPID_PRIVATE_KEY
    secret: VAPID_PRIVATE_KEY
  # --- App Check ---
  # 注意：Site Key 是公開的，直接放 value 即可；只有 Secret Key 才需要放 secret
  - variable: NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY
    value: "6LfSHGgsAAAAAAjTO77dmeQ7rZntLtaB6kOv4qPT"
  # --- Google API ---
  - variable: GOOGLE_API_KEY
    secret: GOOGLE_API_KEY
  # --- Document AI Runtime (non-secret) ---
  - variable: DOCAI_PROJECT_NUMBER
    value: "65970295651"
  - variable: DOCAI_LOCATION
    value: "asia-southeast1"
  - variable: DOCAI_CLASSIFIER_PROCESSOR_ID
    value: "94f84cf3b653b085"
  - variable: DOCAI_EXTRACTOR_PROCESSOR_ID
    value: "86a3e4af9c5bba38"
  - variable: DOCAI_HTTP_TIMEOUT_MS
    value: "45000"
````

## File: CLAUDE.md
````markdown
# CLAUDE.md — Xuanwu App Context

Quick reference for Claude working in this Next.js 16 + MDDD repository.

## Context

**Xuanwu App**: Next.js 16, React 19, Firebase, Python workers (`py_fn/`)

**Architecture**: Module-Driven Domain Design (MDDD) — 19 bounded-context modules

**Essential**: Read AGENTS.md for rules, commands, and patterns.

## Quick Commands

```bash
npm run lint      # ESLint (0 errors)
npm run build     # Type-check + Next.js build
cd py_fn && python -m pytest tests/ -v
```

See [.github/agents/commands.md](.github/agents/commands.md) for full list.

## Key Principles

1. **Module isolation**: `modules/` are bounded contexts — use `api/` boundaries only
2. **Dependency direction**: `UI → App → Domain ← Infrastructure`
3. **Aliases**: Always use `@shared-*`, `@ui-*`, `@lib-*`, `@integration-*` — never `@/`
4. **Runtime split**: Next.js = frontend + orchestration; `py_fn/` = ingestion + workers

## Common Patterns (See AGENTS.md for full examples)

```ts
// Server Action: orchestrate use case, return CommandResult
"use server";
export async function action(input) { return useCase.execute(input); }

// Use Case: `application/use-cases/*.ts` orchestrates domain
// Repository: interface in `domain/`, impl in `infrastructure/`
```

## Full Reference

- **[AGENTS.md](AGENTS.md)** — Complete rules, commands, architecture, patterns
- **[.github/agents/knowledge-base.md](.github/agents/knowledge-base.md)** — Module inventory, tech stack
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — Copilot delivery workflow
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@ui-shadcn/components",
    "utils": "@ui-shadcn/utils",
    "ui": "@ui-shadcn/ui",
    "lib": "@ui-shadcn/lib",
    "hooks": "@ui-shadcn/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
````

## File: CONTRIBUTING.md
````markdown
# Contributing to Xuanwu App

Contributions are welcome. Please follow these guidelines to keep the codebase consistent and easy to review.

## House Rules

### 👥 Prevent Work Duplication

Before opening a new issue or PR, check whether it already exists in [Issues](https://github.com/122sp7/xuanwu-app/issues) or [Pull Requests](https://github.com/122sp7/xuanwu-app/pulls).

### ✅ Work on Approved Issues

For new feature requests, wait for a maintainer to approve the issue before starting implementation. Bug fixes, security, performance, and documentation improvements can begin immediately.

### 🚫 One Concern per PR

Keep PRs small and focused. A PR should address one feature, bug, or refactor. Split large changes into a sequence of smaller PRs that can be reviewed and merged independently.

### 📚 Write for Future Readers

Every PR contributes to the long-term understanding of the codebase. Write clearly enough that someone — possibly you — can revisit it months later and still understand what happened and why.

### ✅ Summarize Your PR

Provide a short summary at the top of every PR describing the intent. Use `Closes #123` or `Fixes #456` in the description to auto-link related issues.

### 🧪 Describe What Was Tested

Explain how you validated your changes. For example: _"Tested locally with npm run dev, verified the new route renders without errors."_

---

## Development

### Prerequisites

- Node.js 24
- npm

### Setup

```bash
npm install
npm run dev      # Start Next.js dev server (port 3000)
```

### Validation

Before pushing, ensure these all pass:

```bash
npm run lint     # ESLint — must have 0 errors
npm run build    # Next.js production build + TypeScript type-check
```

For the Python worker:

```bash
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

---

## Architecture Conventions

This project follows **Module-Driven Domain Design (MDDD)**. Before making changes, read:

- [`.github/agents/README.md`](.github/agents/README.md) — rules index
- [`.github/agents/knowledge-base.md`](.github/agents/knowledge-base.md) — domain knowledge and module inventory
- [`CLAUDE.md`](CLAUDE.md) — key architecture rules and patterns

### Key Rules

- Business logic lives in `modules/<context>/` with four layers: `domain/`, `application/`, `infrastructure/`, `interfaces/`.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must be framework-free.
- Use `@alias` package imports (e.g., `@shared-types`, `@ui-shadcn`). Never use legacy `@/shared/*`, `@/libs/*`, `@/ui/*` paths.
- Keep Next.js Server Actions thin — delegate to use cases, return `CommandResult`.

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Domain entity | `PascalCase.ts` | `Organization.ts` |
| Repository interface | `MyRepository.ts` | `WorkspaceRepository.ts` |
| Firebase repository | `FirebaseMyRepository.ts` | `FirebaseWorkspaceRepository.ts` |
| Use case | `my-use-case.ts` | `create-workspace.ts` |
| Server Action | `*.actions.ts` | `workspace.actions.ts` |
| React component | `PascalCase.tsx` | `WorkspaceCard.tsx` |

---

## Making a Pull Request

1. Fork the repository and create a branch from `main`.
2. Make focused, incremental changes.
3. Ensure `npm run lint` and `npm run build` pass with no new errors.
4. Fill out the PR description with intent, changes, and testing notes.
5. Link related issues with `Closes #N` or `Refs #N`.
6. Request a review.

---

## Spec-Driven Development

For larger features, consider using spec-driven development. See [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## AI Delivery Workflow

For larger or cross-module changes, prefer the formal Copilot delivery workflow:

- Plan first with [`docs/swarm.md`](docs/swarm.md)
- Use the implementation plan as the execution contract for implementation, review, and QA
- Keep documentation updates in the same change whenever scope, boundaries, or public workflows move
````

## File: firebase.apphosting.json
````json
{
  "apphosting": {
    "backendId": "xuanwu",
    "rootDir": "/",
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log"
    ],
    "alwaysDeployFromSource": true
  }
}
````

## File: firebase.json
````json
{
  "firestore": {
    "database": "(default)",
    "location": "asia-east1",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules",
    "bucket": "xuanwu-i-00708880-4e2d8.firebasestorage.app"
  },
  "functions": [
    {
      "codebase": "py-fn",
      "runtime": "python312",
      "ignore": [
        "venv",
        ".venv",
        "__pycache__",
        ".pytest_cache",
        ".mypy_cache",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "source": "py_fn"
    }
  ],
  "apphosting": {
    "backendId": "xuanwu",
    "rootDir": "/",
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log",
      "functions"
    ]
  },
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "i18n": {
      "root": "/localized-files"
    }
  },
  "emulators": {
    "dataconnect": {
      "dataDir": "dataconnect/.dataconnect/pgliteData"
    }
  },
  "dataconnect": {
    "source": "dataconnect"
  }
}
````

## File: firestore.rules
````
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
````

## File: llms.txt
````
# Xuanwu App

Xuanwu App is a Next.js 16 and React 19 knowledge-management and AI-assisted workspace platform.

This file is the AI-first documentation router for the repository. Read this before opening detailed docs.

## Primary repository truths

- AGENTS.md: repository-wide operating rules
- .github/copilot-instructions.md: Copilot delivery baseline
- agents/knowledge-base.md: MDDD architecture, module boundaries, package aliases
- agents/commands.md: build, lint, test, and deployment commands
- docs/README.md: documentation root index

## Documentation reading order

Read from high level to detail:

1. docs/README.md
2. docs/development-reference/specification/system-overview.md
3. agents/knowledge-base.md
4. docs/development-reference/reference/development-contracts/overview.md
5. the nearest docs README in the relevant subfolder
6. the specific contract, guide, or architecture page
7. diagrams or ADRs only after the relevant higher-level page is identified

## Topic routing

- Repository rules and contribution workflow:
  - AGENTS.md
  - CONTRIBUTING.md
  - agents/README.md
- Architecture and module boundaries:
  - agents/knowledge-base.md
  - docs/decision-architecture/architecture/
  - docs/decision-architecture/adr/
- Development workflows and implementation rules:
  - docs/development-reference/development/README.md
  - docs/development-reference/reference/
- Contract-governed workflows:
  - docs/development-reference/reference/development-contracts/overview.md
  - specific contract pages in docs/development-reference/reference/development-contracts/
- AI workflow and Copilot customization assets:
  - docs/development-reference/reference/ai/customizations-index.md
  - docs/how-to-user/how-to/
  - .github/skills/
- Diagrams and explanatory support:
  - docs/diagrams-events-explanations/diagrams/README.md
  - docs/diagrams-events-explanations/explanation/

## Document layers

- High layer:
  - docs/README.md
  - docs/development-reference/specification/system-overview.md
  - agents/knowledge-base.md
- Mid layer:
  - folder READMEs
  - development guides
  - contract indexes
  - how-to guides
- Low layer:
  - ADRs
  - detailed diagrams
  - deep technical explanations

Use the smallest useful layer first.

## Documentation organization rule

When adding or changing docs:

1. keep one canonical file per topic,
2. add a short summary near the top,
3. use clear headings for section-based chunking,
4. update the nearest README index,
5. update docs/README.md or this file if routing changes.

## AI working rule

If a question is broad, inspect summaries and README indexes before opening detailed files.
If multiple files appear to overlap, identify the canonical file and treat others as supporting context.
````

## File: modules/account/api/index.ts
````typescript
/**
 * account 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 account 模組內部實作。
 */
// ─── 核心實體型別 ──────────────────────────────────────────────────────────────
⋮----
// ─── 查詢函數 (供 UI 層訂閱/讀取使用) ────────────────────────────────────────
⋮----
// ─── Use Cases (供 composition root / app layer 使用) ────────────────────────
⋮----
// ─── Infrastructure (供 composition root 使用) ───────────────────────────────
````

## File: modules/account/application/use-cases/account-policy.use-cases.ts
````typescript
/**
 * Account Policy Use Cases — pure business workflows.
 * Per [S6]: account policy changes trigger CUSTOM_CLAIMS refresh (via TOKEN_REFRESH_SIGNAL).
 * No React, no Firebase, no UI framework.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";
import { identityApi } from "@/modules/identity/api";
// ─── Create Account Policy ────────────────────────────────────────────────────
export class CreateAccountPolicyUseCase {
⋮----
constructor(
async execute(input: CreatePolicyInput): Promise<CommandResult>
⋮----
// [S6] Emit token refresh signal after policy change so frontend refreshes claims.
⋮----
// ─── Update Account Policy ────────────────────────────────────────────────────
export class UpdateAccountPolicyUseCase {
⋮----
async execute(
    policyId: string,
    accountId: string,
    data: UpdatePolicyInput,
): Promise<CommandResult>
⋮----
// [S6] Emit refresh signal after policy change.
⋮----
// ─── Delete Account Policy ────────────────────────────────────────────────────
export class DeleteAccountPolicyUseCase {
⋮----
async execute(policyId: string, accountId: string): Promise<CommandResult>
⋮----
// [S6] Emit refresh signal after policy deletion.
````

## File: modules/account/application/use-cases/account.use-cases.ts
````typescript
/**
 * Account Use Cases — pure business workflows.
 * No React, no Firebase, no UI framework.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type { UpdateProfileInput, OrganizationRole } from "../../domain/entities/Account";
import { identityApi } from "@/modules/identity/api";
// ─── Create Account ───────────────────────────────────────────────────────────
export class CreateUserAccountUseCase {
⋮----
constructor(private readonly accountRepo: AccountRepository)
async execute(userId: string, name: string, email: string): Promise<CommandResult>
⋮----
// ─── Update Profile ───────────────────────────────────────────────────────────
export class UpdateUserProfileUseCase {
⋮----
async execute(userId: string, data: UpdateProfileInput): Promise<CommandResult>
⋮----
// ─── Credit Wallet ────────────────────────────────────────────────────────────
export class CreditWalletUseCase {
⋮----
async execute(
    accountId: string,
    amount: number,
    description: string,
): Promise<CommandResult>
⋮----
// ─── Debit Wallet ─────────────────────────────────────────────────────────────
export class DebitWalletUseCase {
// ─── Assign Role ──────────────────────────────────────────────────────────────
export class AssignAccountRoleUseCase {
⋮----
constructor(
async execute(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
    traceId?: string,
): Promise<CommandResult>
⋮----
// [S6] Emit TOKEN_REFRESH_SIGNAL so frontend force-refreshes Custom Claims.
⋮----
// ─── Revoke Role ──────────────────────────────────────────────────────────────
export class RevokeAccountRoleUseCase {
⋮----
async execute(accountId: string): Promise<CommandResult>
⋮----
// [S6] Emit TOKEN_REFRESH_SIGNAL after role revocation.
````

## File: modules/account/domain/entities/Account.ts
````typescript
/**
 * Account Domain Entities — pure TypeScript, zero framework dependencies.
 */
import type { Timestamp } from "@shared-types";
export type AccountType = "user" | "organization";
export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
export type Presence = "active" | "away" | "offline";
export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}
export interface Wallet {
  balance: number;
}
export interface ExpertiseBadge {
  id: string;
  name: string;
  icon?: string;
}
export interface MemberReference {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  presence: Presence;
  isExternal?: boolean;
  expiryDate?: Timestamp;
}
export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}
export interface AccountEntity {
  id: string;
  name: string;
  accountType: AccountType;
  email?: string;
  photoURL?: string;
  bio?: string;
  achievements?: string[];
  expertiseBadges?: ExpertiseBadge[];
  wallet?: Wallet;
  description?: string;
  ownerId?: string;
  role?: OrganizationRole;
  theme?: ThemeConfig;
  members?: MemberReference[];
  memberIds?: string[];
  teams?: Team[];
  createdAt?: Timestamp;
}
// ─── Value Objects ────────────────────────────────────────────────────────────
export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  photoURL?: string;
  theme?: ThemeConfig;
}
export interface WalletTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  createdAt: Timestamp;
}
export type AccountRoleRecord = {
  accountId: string;
  role: OrganizationRole;
  grantedBy: string;
  grantedAt: Timestamp;
};
````

## File: modules/account/domain/entities/AccountPolicy.ts
````typescript
/**
 * AccountPolicy — Domain Entity.
 * Represents an access-control policy attached to an account.
 * Per [S6] account-level policies trigger CUSTOM_CLAIMS refresh.
 * Zero external dependencies.
 */
export type PolicyEffect = "allow" | "deny";
export interface PolicyRule {
  resource: string;
  actions: string[];
  effect: PolicyEffect;
  conditions?: Record<string, string>;
}
export interface AccountPolicy {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly isActive: boolean;
  readonly createdAt: string; // ISO-8601
  readonly updatedAt: string; // ISO-8601
  /** Trace ID from CBG_ENTRY for auditability [R8]. */
  readonly traceId?: string;
}
⋮----
readonly createdAt: string; // ISO-8601
readonly updatedAt: string; // ISO-8601
/** Trace ID from CBG_ENTRY for auditability [R8]. */
⋮----
// ─── Value Objects (Commands) ─────────────────────────────────────────────────
export interface CreatePolicyInput {
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly traceId?: string;
}
export interface UpdatePolicyInput {
  readonly name?: string;
  readonly description?: string;
  readonly rules?: PolicyRule[];
  readonly isActive?: boolean;
}
````

## File: modules/account/domain/repositories/AccountPolicyRepository.ts
````typescript
/**
 * AccountPolicyRepository — Port for account policy persistence.
 * Domain defines the interface; Infrastructure implements it.
 */
import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../entities/AccountPolicy";
export interface AccountPolicyRepository {
  findById(id: string): Promise<AccountPolicy | null>;
  findAllByAccountId(accountId: string): Promise<AccountPolicy[]>;
  findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>;
  create(input: CreatePolicyInput): Promise<AccountPolicy>;
  update(id: string, data: UpdatePolicyInput): Promise<void>;
  delete(id: string): Promise<void>;
}
⋮----
findById(id: string): Promise<AccountPolicy | null>;
findAllByAccountId(accountId: string): Promise<AccountPolicy[]>;
findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>;
create(input: CreatePolicyInput): Promise<AccountPolicy>;
update(id: string, data: UpdatePolicyInput): Promise<void>;
delete(id: string): Promise<void>;
````

## File: modules/account/domain/repositories/AccountQueryRepository.ts
````typescript
/**
 * AccountQueryRepository — Port for account read operations.
 * Separated from the write-side AccountRepository for CQRS clarity.
 */
import type { AccountEntity } from "../entities/Account";
import type { WalletTransaction } from "../entities/Account";
import type { AccountRoleRecord } from "../entities/Account";
export interface WalletBalanceSnapshot {
  balance: number;
}
export type Unsubscribe = () => void;
export interface AccountQueryRepository {
  /** Fetch the user profile/account document. */
  getUserProfile(userId: string): Promise<AccountEntity | null>;
  /** Real-time subscription to user profile. */
  subscribeToUserProfile(userId: string, onUpdate: (profile: AccountEntity | null) => void): Unsubscribe;
  /** Fetch wallet balance. */
  getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;
  /** Real-time subscription to wallet balance. */
  subscribeToWalletBalance(accountId: string, onUpdate: (snapshot: WalletBalanceSnapshot) => void): Unsubscribe;
  /** Real-time subscription to wallet transaction history. */
  subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe;
  /** Fetch the current role record for an account. */
  getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;
  /** Real-time subscription to account roles. */
  subscribeToAccountRoles(accountId: string, onUpdate: (record: AccountRoleRecord | null) => void): Unsubscribe;
  /**
   * Real-time subscription to ALL accounts visible to a user:
   * — organization accounts where ownerId === userId
   * — organization accounts where memberIds contains userId
   * Returns a merged Record<accountId, AccountEntity> suitable for populating
   * the app-level account switcher.
   */
  subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountEntity>) => void,
  ): Unsubscribe;
}
⋮----
/** Fetch the user profile/account document. */
getUserProfile(userId: string): Promise<AccountEntity | null>;
/** Real-time subscription to user profile. */
subscribeToUserProfile(userId: string, onUpdate: (profile: AccountEntity | null)
/** Fetch wallet balance. */
getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;
/** Real-time subscription to wallet balance. */
subscribeToWalletBalance(accountId: string, onUpdate: (snapshot: WalletBalanceSnapshot)
/** Real-time subscription to wallet transaction history. */
subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe;
/** Fetch the current role record for an account. */
getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;
/** Real-time subscription to account roles. */
subscribeToAccountRoles(accountId: string, onUpdate: (record: AccountRoleRecord | null)
/**
   * Real-time subscription to ALL accounts visible to a user:
   * — organization accounts where ownerId === userId
   * — organization accounts where memberIds contains userId
   * Returns a merged Record<accountId, AccountEntity> suitable for populating
   * the app-level account switcher.
   */
subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountEntity>) => void,
  ): Unsubscribe;
````

## File: modules/account/domain/repositories/AccountRepository.ts
````typescript
/**
 * AccountRepository — Port for account persistence.
 * Domain defines the interface; Infrastructure implements it.
 */
import type { AccountEntity, UpdateProfileInput, WalletTransaction, AccountRoleRecord, OrganizationRole } from "../entities/Account";
export interface AccountRepository {
  findById(id: string): Promise<AccountEntity | null>;
  save(account: AccountEntity): Promise<void>;
  updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;
  // Wallet
  getWalletBalance(accountId: string): Promise<number>;
  creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  // Role
  assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
  revokeRole(accountId: string): Promise<void>;
  getRole(accountId: string): Promise<AccountRoleRecord | null>;
}
⋮----
findById(id: string): Promise<AccountEntity | null>;
save(account: AccountEntity): Promise<void>;
updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;
// Wallet
getWalletBalance(accountId: string): Promise<number>;
creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
// Role
assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
revokeRole(accountId: string): Promise<void>;
getRole(accountId: string): Promise<AccountRoleRecord | null>;
````

## File: modules/account/index.ts
````typescript
/**
 * account module public API
 */
⋮----
// Server Actions
⋮----
// Read queries (callable from React hooks/components)
````

## File: modules/account/infrastructure/firebase/FirebaseAccountPolicyRepository.ts
````typescript
/**
 * FirebaseAccountPolicyRepository — Infrastructure adapter for account policy persistence.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";
function toAccountPolicy(id: string, data: Record<string, unknown>): AccountPolicy
export class FirebaseAccountPolicyRepository implements AccountPolicyRepository {
⋮----
private get db()
async findById(id: string): Promise<AccountPolicy | null>
async findAllByAccountId(accountId: string): Promise<AccountPolicy[]>
async findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>
async create(input: CreatePolicyInput): Promise<AccountPolicy>
async update(id: string, data: UpdatePolicyInput): Promise<void>
async delete(id: string): Promise<void>
````

## File: modules/account/infrastructure/firebase/FirebaseAccountQueryRepository.ts
````typescript
/**
 * FirebaseAccountQueryRepository — Infrastructure adapter for account read queries.
 * Provides real-time subscriptions and one-shot reads.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit as fbLimit,
  onSnapshot,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountQueryRepository, WalletBalanceSnapshot, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { AccountEntity, WalletTransaction, AccountRoleRecord, OrganizationRole } from "../../domain/entities/Account";
function toAccountEntity(id: string, data: Record<string, unknown>): AccountEntity
export class FirebaseAccountQueryRepository implements AccountQueryRepository {
⋮----
private get db()
async getUserProfile(userId: string): Promise<AccountEntity | null>
subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: AccountEntity | null) => void,
): Unsubscribe
async getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>
subscribeToWalletBalance(
    accountId: string,
    onUpdate: (snapshot: WalletBalanceSnapshot) => void,
): Unsubscribe
subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
): Unsubscribe
async getAccountRole(accountId: string): Promise<AccountRoleRecord | null>
subscribeToAccountRoles(
    accountId: string,
    onUpdate: (record: AccountRoleRecord | null) => void,
): Unsubscribe
subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountEntity>) => void,
): Unsubscribe
⋮----
const emit = () =>
````

## File: modules/account/infrastructure/firebase/FirebaseAccountRepository.ts
````typescript
/**
 * FirebaseAccountRepository — Infrastructure adapter for account persistence.
 * Translates Firestore documents ↔ Domain AccountEntity.
 * Firebase SDK only exists in this file.
 * Wallet operations use Firestore transactions for atomic balance enforcement.
 */
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type {
  AccountEntity,
  UpdateProfileInput,
  WalletTransaction,
  AccountRoleRecord,
  OrganizationRole,
} from "../../domain/entities/Account";
// ─── Firestore ↔ Domain Mapper ────────────────────────────────────────────────
function toAccountEntity(id: string, data: Record<string, unknown>): AccountEntity
// ─── Repository Implementation ────────────────────────────────────────────────
export class FirebaseAccountRepository implements AccountRepository {
⋮----
private get db()
async findById(id: string): Promise<AccountEntity | null>
async save(account: AccountEntity): Promise<void>
async updateProfile(userId: string, data: UpdateProfileInput): Promise<void>
async getWalletBalance(accountId: string): Promise<number>
async creditWallet(
    accountId: string,
    amount: number,
    description: string,
): Promise<WalletTransaction>
⋮----
// Append ledger entry
⋮----
async debitWallet(
    accountId: string,
    amount: number,
    description: string,
): Promise<WalletTransaction>
async assignRole(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
): Promise<AccountRoleRecord>
async revokeRole(accountId: string): Promise<void>
async getRole(accountId: string): Promise<AccountRoleRecord | null>
````

## File: modules/account/interfaces/_actions/account-policy.actions.ts
````typescript
/**
 * Account Policy Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateAccountPolicyUseCase,
  UpdateAccountPolicyUseCase,
  DeleteAccountPolicyUseCase,
} from "../../application/use-cases/account-policy.use-cases";
import { FirebaseAccountPolicyRepository } from "../../infrastructure/firebase/FirebaseAccountPolicyRepository";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";
⋮----
export async function createAccountPolicy(input: CreatePolicyInput): Promise<CommandResult>
export async function updateAccountPolicy(
  policyId: string,
  accountId: string,
  data: UpdatePolicyInput,
): Promise<CommandResult>
export async function deleteAccountPolicy(
  policyId: string,
  accountId: string,
): Promise<CommandResult>
````

## File: modules/account/interfaces/_actions/account.actions.ts
````typescript
/**
 * Account Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
} from "../../application/use-cases/account.use-cases";
import { FirebaseAccountRepository } from "../../infrastructure/firebase/FirebaseAccountRepository";
import type { UpdateProfileInput, OrganizationRole } from "../../domain/entities/Account";
⋮----
export async function createUserAccount(
  userId: string,
  name: string,
  email: string,
): Promise<CommandResult>
export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput,
): Promise<CommandResult>
export async function creditWallet(
  accountId: string,
  amount: number,
  description: string,
): Promise<CommandResult>
export async function debitWallet(
  accountId: string,
  amount: number,
  description: string,
): Promise<CommandResult>
export async function assignAccountRole(
  accountId: string,
  role: OrganizationRole,
  grantedBy: string,
  traceId?: string,
): Promise<CommandResult>
⋮----
// TOKEN_REFRESH_SIGNAL is emitted inside AssignAccountRoleUseCase after role change [S6].
⋮----
export async function revokeAccountRole(accountId: string): Promise<CommandResult>
````

## File: modules/account/interfaces/queries/account.queries.ts
````typescript
/**
 * Account Read Queries — thin wrappers exposing read operations via the AccountQueryRepository port.
 * These are NOT Server Actions — they are callable from React components/hooks.
 */
import { FirebaseAccountQueryRepository } from "../../infrastructure/firebase/FirebaseAccountQueryRepository";
import type { AccountEntity, WalletTransaction, AccountRoleRecord } from "../../domain/entities/Account";
import type { WalletBalanceSnapshot, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { AccountPolicy } from "../../domain/entities/AccountPolicy";
⋮----
// ─── User Profile ─────────────────────────────────────────────────────────────
export async function getUserProfile(userId: string): Promise<AccountEntity | null>
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: AccountEntity | null) => void,
): Unsubscribe
// ─── Wallet ───────────────────────────────────────────────────────────────────
export async function getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>
export function subscribeToWalletBalance(
  accountId: string,
  onUpdate: (snapshot: WalletBalanceSnapshot) => void,
): Unsubscribe
export function subscribeToWalletTransactions(
  accountId: string,
  maxCount: number,
  onUpdate: (txs: WalletTransaction[]) => void,
): Unsubscribe
// ─── Role ─────────────────────────────────────────────────────────────────────
export async function getAccountRole(accountId: string): Promise<AccountRoleRecord | null>
export function subscribeToAccountRoles(
  accountId: string,
  onUpdate: (record: AccountRoleRecord | null) => void,
): Unsubscribe
// ─── Account Policy ───────────────────────────────────────────────────────────
export async function getAccountPolicies(accountId: string): Promise<AccountPolicy[]>
⋮----
// Keep client bundles free of server-only policy repository dependencies.
⋮----
export async function getActiveAccountPolicies(accountId: string): Promise<AccountPolicy[]>
⋮----
// Keep client bundles free of server-only policy repository dependencies.
⋮----
// ─── Multi-Account (App-Level) ────────────────────────────────────────────────
export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountEntity>) => void,
): Unsubscribe
````

## File: modules/account/ports/.gitkeep
````

````

## File: modules/ai/.gitkeep
````

````

## File: modules/ai/api/knowledge-ingestion-api.ts
````typescript
import { AdvanceIngestionStageUseCase } from "../application/use-cases/advance-ingestion-stage.use-case";
import {
  RegisterIngestionDocumentUseCase,
  type RegisterIngestionDocumentInput,
} from "../application/use-cases/register-ingestion-document.use-case";
import type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
import { InMemoryIngestionJobRepository } from "../infrastructure/InMemoryIngestionJobRepository";
export class KnowledgeIngestionApi {
⋮----
async registerDocument(input: RegisterIngestionDocumentInput): Promise<
    | { ok: true; data: IngestionJob }
    | { ok: false; error: { code: string; message: string } }
  > {
    return this.registerUseCase.execute(input);
async advanceStage(input: {
    readonly documentId: string;
    readonly nextStatus: IngestionStatus;
    readonly statusMessage?: string;
  }): Promise<
    | { ok: true; data: IngestionJob }
    | { ok: false; error: { code: string; message: string } }
  > {
    return this.advanceUseCase.execute(input);
async listWorkspaceJobs(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
}): Promise<readonly IngestionJob[]>
````

## File: modules/ai/application/link-extractor.service.ts
````typescript
/**
 * @deprecated This file has moved to modules/wiki/application/link-extractor.service.ts
 * modules/knowledge is being repurposed for Layer 2 Ingestion Pipeline (Parse→Chunk→Embed).
 * No new code should be added here.
 */
````

## File: modules/ai/application/use-cases/advance-ingestion-stage.use-case.ts
````typescript
import {
  canTransitionIngestionStatus,
  type IngestionJob,
  type IngestionStatus,
} from "../../domain/entities/IngestionJob";
import type { IngestionJobRepository } from "../../domain/repositories/IngestionJobRepository";
export interface AdvanceIngestionStageInput {
  readonly documentId: string;
  readonly nextStatus: IngestionStatus;
  readonly statusMessage?: string;
}
export type AdvanceIngestionStageResult =
  | { ok: true; data: IngestionJob }
  | { ok: false; error: { code: string; message: string } };
export class AdvanceIngestionStageUseCase {
⋮----
constructor(private readonly ingestionJobRepository: IngestionJobRepository)
async execute(input: AdvanceIngestionStageInput): Promise<AdvanceIngestionStageResult>
````

## File: modules/ai/application/use-cases/register-ingestion-document.use-case.ts
````typescript
import { randomUUID } from "node:crypto";
import type { IngestionDocument } from "../../domain/entities/IngestionDocument";
import type { IngestionJob } from "../../domain/entities/IngestionJob";
import type { IngestionJobRepository } from "../../domain/repositories/IngestionJobRepository";
export interface RegisterIngestionDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
}
export type RegisterIngestionDocumentResult =
  | { ok: true; data: IngestionJob }
  | { ok: false; error: { code: string; message: string } };
export class RegisterIngestionDocumentUseCase {
⋮----
constructor(private readonly ingestionJobRepository: IngestionJobRepository)
async execute(input: RegisterIngestionDocumentInput): Promise<RegisterIngestionDocumentResult>
````

## File: modules/ai/domain/entities/graph-node.ts
````typescript
/**
 * @deprecated This file has moved to modules/wiki/domain/entities/graph-node.ts
 * modules/knowledge is being repurposed for Layer 2 Ingestion Pipeline (Parse→Chunk→Embed).
 * No new code should be added here.
 */
````

## File: modules/ai/domain/entities/IngestionChunk.ts
````typescript
export interface IngestionChunk {
  readonly id: string;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
  readonly metadata: {
    readonly sourceDocId: string;
    readonly section?: string;
    readonly pageNumber?: number;
  };
}
````

## File: modules/ai/domain/entities/IngestionDocument.ts
````typescript
export interface IngestionDocument {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/ai/domain/entities/IngestionJob.ts
````typescript
import type { IngestionDocument } from "./IngestionDocument";
export type IngestionStatus =
  | "uploaded"
  | "parsing"
  | "chunking"
  | "embedding"
  | "indexed"
  | "stale"
  | "re-indexing"
  | "failed";
⋮----
export function canTransitionIngestionStatus(
  fromStatus: IngestionStatus,
  toStatus: IngestionStatus,
): boolean
export interface IngestionJob {
  readonly id: string;
  readonly document: IngestionDocument;
  readonly status: IngestionStatus;
  readonly statusMessage?: string;
  readonly updatedAtISO: string;
}
````

## File: modules/ai/domain/entities/link.ts
````typescript
/**
 * @deprecated This file has moved to modules/wiki/domain/entities/link.ts
 * modules/knowledge is being repurposed for Layer 2 Ingestion Pipeline (Parse→Chunk→Embed).
 * No new code should be added here.
 */
````

## File: modules/ai/domain/repositories/GraphRepository.ts
````typescript
/**
 * @deprecated This file has moved to modules/wiki/domain/repositories/GraphRepository.ts
 * modules/knowledge is being repurposed for Layer 2 Ingestion Pipeline (Parse→Chunk→Embed).
 * No new code should be added here.
 */
````

## File: modules/ai/domain/repositories/IngestionJobRepository.ts
````typescript
import type { IngestionJob, IngestionStatus } from "../entities/IngestionJob";
export interface IngestionJobRepository {
  findByDocumentId(documentId: string): Promise<IngestionJob | null>;
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]>;
  save(job: IngestionJob): Promise<void>;
  updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null>;
}
⋮----
findByDocumentId(documentId: string): Promise<IngestionJob | null>;
listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]>;
save(job: IngestionJob): Promise<void>;
updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null>;
````

## File: modules/ai/infrastructure/InMemoryGraphRepository.ts
````typescript
/**
 * @deprecated This file has moved to modules/wiki/infrastructure/InMemoryGraphRepository.ts
 * modules/knowledge is being repurposed for Layer 2 Ingestion Pipeline (Parse→Chunk→Embed).
 * No new code should be added here.
 */
````

## File: modules/ai/infrastructure/InMemoryIngestionJobRepository.ts
````typescript
import type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
import type { IngestionJobRepository } from "../domain/repositories/IngestionJobRepository";
export class InMemoryIngestionJobRepository implements IngestionJobRepository {
⋮----
async findByDocumentId(documentId: string): Promise<IngestionJob | null>
async listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
}): Promise<readonly IngestionJob[]>
async save(job: IngestionJob): Promise<void>
async updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
}): Promise<IngestionJob | null>
````

## File: modules/identity/api/index.ts
````typescript
/**
 * identity 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 identity 模組內部實作。
 */
import { FirebaseTokenRefreshRepository } from "../infrastructure/firebase/FirebaseTokenRefreshRepository";
import { EmitTokenRefreshSignalUseCase } from "../application/use-cases/token-refresh.use-cases";
import type { TokenRefreshReason } from "../domain/entities/TokenRefreshSignal";
// ─── DTO ──────────────────────────────────────────────────────────────────────
/** 發送 Token Refresh 訊號所需的輸入參數。 */
export interface EmitTokenRefreshSignalInput {
  accountId: string;
  reason: TokenRefreshReason;
  traceId?: string;
}
// ─── 內部單例 ──────────────────────────────────────────────────────────────────
⋮----
// ─── 公開 API Facade ──────────────────────────────────────────────────────────
⋮----
/**
   * [S6] 發送 TOKEN_REFRESH_SIGNAL，通知前端重新整理 Custom Claims。
   * 應在角色或政策變更後呼叫。
   */
async emitTokenRefreshSignal(input: EmitTokenRefreshSignalInput): Promise<void>
⋮----
// ─── 公開 Use Cases & Infrastructure (供 composition root 使用) ──────────────
⋮----
// ─── Server Actions ───────────────────────────────────────────────────────────
⋮----
// ─── Client-only hook (import only from "use client" files) ──────────────────
````

## File: modules/identity/application/identity-error-message.ts
````typescript
/**
 * Narrow error shape used by auth flows when SDK or browser-thrown errors expose
 * only a code/message pair.
 */
type StructuredError = {
  code?: string
  message?: string
}
⋮----
// Firebase/browser-thrown auth failures have surfaced both hyphenated and
// underscored credential codes in different environments, so we normalize both.
⋮----
/**
 * Convert Firebase/browser auth failures into stable user-facing copy.
 * Falls back to the supplied message when no mapped auth code can be found.
 */
export function toIdentityErrorMessage(error: unknown, fallback: string): string
⋮----
/**
   * Extract Firebase auth codes from raw error messages and strip SDK-specific
   * prefixes so the UI never renders noisy Firebase boilerplate.
   */
const resolveFromMessage = (message: string) =>
````

## File: modules/identity/application/use-cases/identity.use-cases.ts
````typescript
/**
 * Identity Use Cases — pure business workflows.
 * No React, no Firebase SDK, no UI framework.
 * Depends only on the IdentityRepository port.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IdentityRepository } from "../../domain/repositories/IdentityRepository";
import type { SignInCredentials, RegistrationInput } from "../../domain/entities/Identity";
import { toIdentityErrorMessage } from "../identity-error-message";
// ─── Sign In ──────────────────────────────────────────────────────────────────
export class SignInUseCase {
⋮----
constructor(private readonly identityRepo: IdentityRepository)
async execute(credentials: SignInCredentials): Promise<CommandResult>
⋮----
// ─── Anonymous Sign In ────────────────────────────────────────────────────────
export class SignInAnonymouslyUseCase {
⋮----
async execute(): Promise<CommandResult>
⋮----
// ─── Register ─────────────────────────────────────────────────────────────────
export class RegisterUseCase {
⋮----
async execute(input: RegistrationInput): Promise<CommandResult>
⋮----
// ─── Password Reset ───────────────────────────────────────────────────────────
export class SendPasswordResetEmailUseCase {
⋮----
async execute(email: string): Promise<CommandResult>
⋮----
// ─── Sign Out ─────────────────────────────────────────────────────────────────
export class SignOutUseCase {
````

## File: modules/identity/application/use-cases/token-refresh.use-cases.ts
````typescript
/**
 * Token Refresh Use Cases — pure business workflows for [S6] Claims refresh.
 * No React, no Firebase SDK, no UI framework.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { TokenRefreshRepository } from "../../domain/repositories/TokenRefreshRepository";
import type { TokenRefreshReason } from "../../domain/entities/TokenRefreshSignal";
/**
 * EmitTokenRefreshSignalUseCase — Claims Handler [S6].
 * Emits a TOKEN_REFRESH_SIGNAL after role or policy changes.
 * Party 1 of the three-way Claims refresh handshake.
 */
export class EmitTokenRefreshSignalUseCase {
⋮----
constructor(private readonly tokenRefreshRepo: TokenRefreshRepository)
async execute(
    accountId: string,
    reason: TokenRefreshReason,
    traceId?: string,
): Promise<CommandResult>
⋮----
// Guard: accountId must be a safe document ID (alphanumeric + hyphen/underscore)
````

## File: modules/identity/domain/entities/Identity.ts
````typescript
/**
 * Identity Domain Entity — represents an authenticated user session.
 * Zero external dependencies.
 */
export interface IdentityEntity {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
}
/** Value Object — credentials for sign-in */
export interface SignInCredentials {
  readonly email: string;
  readonly password: string;
}
/** Value Object — registration input */
export interface RegistrationInput {
  readonly email: string;
  readonly password: string;
  readonly name: string;
}
````

## File: modules/identity/domain/entities/TokenRefreshSignal.ts
````typescript
/**
 * TokenRefreshSignal — Domain Value Object.
 * Represents the signal written to Firestore when Custom Claims change.
 * Per 00-logic-overview.md [S6] three-way Claims refresh handshake.
 * Zero external dependencies.
 */
export type TokenRefreshReason = "role:changed" | "policy:changed";
export interface TokenRefreshSignal {
  readonly accountId: string;
  readonly reason: TokenRefreshReason;
  readonly issuedAt: string; // ISO-8601
  readonly traceId?: string;
}
⋮----
readonly issuedAt: string; // ISO-8601
````

## File: modules/identity/domain/repositories/IdentityRepository.ts
````typescript
/**
 * IdentityRepository — Port (interface) for auth operations.
 * Domain layer defines this interface; Infrastructure layer implements it.
 * No Firebase SDK or framework leakage here.
 */
import type { IdentityEntity, SignInCredentials, RegistrationInput } from "../entities/Identity";
export interface IdentityRepository {
  /** Sign in with email + password. Returns the authenticated identity. */
  signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity>;
  /** Sign in anonymously. */
  signInAnonymously(): Promise<IdentityEntity>;
  /** Register a new user. Returns the new identity. */
  createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity>;
  /** Update the display name of the current user. */
  updateDisplayName(uid: string, displayName: string): Promise<void>;
  /** Send a password reset email. */
  sendPasswordResetEmail(email: string): Promise<void>;
  /** Sign out the current user. */
  signOut(): Promise<void>;
  /** Get the currently authenticated user, or null. */
  getCurrentUser(): IdentityEntity | null;
}
⋮----
/** Sign in with email + password. Returns the authenticated identity. */
signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity>;
/** Sign in anonymously. */
signInAnonymously(): Promise<IdentityEntity>;
/** Register a new user. Returns the new identity. */
createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity>;
/** Update the display name of the current user. */
updateDisplayName(uid: string, displayName: string): Promise<void>;
/** Send a password reset email. */
sendPasswordResetEmail(email: string): Promise<void>;
/** Sign out the current user. */
signOut(): Promise<void>;
/** Get the currently authenticated user, or null. */
getCurrentUser(): IdentityEntity | null;
````

## File: modules/identity/domain/repositories/TokenRefreshRepository.ts
````typescript
/**
 * TokenRefreshRepository — Port for emitting and observing token refresh signals.
 * Defined in domain; implemented in infrastructure.
 * Per [S6] SK_TOKEN_REFRESH_CONTRACT.
 */
import type { TokenRefreshSignal } from "../entities/TokenRefreshSignal";
export interface TokenRefreshRepository {
  /**
   * Emit a token refresh signal for the given account.
   * Called by Claims Handler after role or policy changes.
   */
  emit(signal: TokenRefreshSignal): Promise<void>;
  /**
   * Subscribe to token refresh signals for a given accountId.
   * Fires callback on every signal change (skip first emission to avoid no-op refresh).
   * Returns an unsubscribe function.
   */
  subscribe(accountId: string, onSignal: () => void): () => void;
}
⋮----
/**
   * Emit a token refresh signal for the given account.
   * Called by Claims Handler after role or policy changes.
   */
emit(signal: TokenRefreshSignal): Promise<void>;
/**
   * Subscribe to token refresh signals for a given accountId.
   * Fires callback on every signal change (skip first emission to avoid no-op refresh).
   * Returns an unsubscribe function.
   */
subscribe(accountId: string, onSignal: ()
````

## File: modules/identity/index.ts
````typescript
/**
 * identity module public API
 */
⋮----
// Client-only hook — must be imported from the module barrel only from "use client" files
// to avoid RSC bundle contamination.
````

## File: modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts
````typescript
/**
 * FirebaseIdentityRepository — Infrastructure adapter implementing IdentityRepository port.
 * Translates Firebase Auth SDK calls into domain entities.
 * Firebase SDK only exists in this file, never in domain or application layers.
 */
import {
  getAuth,
  signInWithEmailAndPassword as fbSignIn,
  signInAnonymously as fbSignInAnonymously,
  createUserWithEmailAndPassword as fbCreateUser,
  updateProfile,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { firebaseClientApp } from "@integration-firebase/client";
import type { IdentityRepository } from "../../domain/repositories/IdentityRepository";
import type {
  IdentityEntity,
  SignInCredentials,
  RegistrationInput,
} from "../../domain/entities/Identity";
// ─── Mapper: Firebase User → Domain IdentityEntity ──────────────────────────
function toIdentityEntity(user: User): IdentityEntity
// ─── Adapter ─────────────────────────────────────────────────────────────────
export class FirebaseIdentityRepository implements IdentityRepository {
⋮----
private get auth()
async signInWithEmailAndPassword(
    credentials: SignInCredentials,
): Promise<IdentityEntity>
async signInAnonymously(): Promise<IdentityEntity>
async createUserWithEmailAndPassword(
    input: RegistrationInput,
): Promise<IdentityEntity>
async updateDisplayName(uid: string, displayName: string): Promise<void>
async sendPasswordResetEmail(email: string): Promise<void>
async signOut(): Promise<void>
getCurrentUser(): IdentityEntity | null
````

## File: modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts
````typescript
/**
 * FirebaseTokenRefreshRepository — Infrastructure adapter for [S6] TOKEN_REFRESH_SIGNAL.
 * Writes/reads `tokenRefreshSignals/{accountId}` in Firestore.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { TokenRefreshRepository } from "../../domain/repositories/TokenRefreshRepository";
import type { TokenRefreshSignal } from "../../domain/entities/TokenRefreshSignal";
⋮----
export class FirebaseTokenRefreshRepository implements TokenRefreshRepository {
⋮----
private get db()
async emit(signal: TokenRefreshSignal): Promise<void>
subscribe(accountId: string, onSignal: () => void): () => void
````

## File: modules/identity/interfaces/_actions/identity.actions.ts
````typescript
/**
 * Identity Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 * Responsibilities: call use cases, NO business logic.
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  SignInUseCase,
  SignInAnonymouslyUseCase,
  RegisterUseCase,
  SendPasswordResetEmailUseCase,
  SignOutUseCase,
} from "../../application/use-cases/identity.use-cases";
import { toIdentityErrorMessage } from "../../application/identity-error-message";
import { FirebaseIdentityRepository } from "../../infrastructure/firebase/FirebaseIdentityRepository";
⋮----
export async function signIn(email: string, password: string): Promise<CommandResult>
export async function signInAnonymously(): Promise<CommandResult>
export async function register(
  email: string,
  password: string,
  name: string,
): Promise<CommandResult>
export async function sendPasswordResetEmail(email: string): Promise<CommandResult>
export async function signOut(): Promise<CommandResult>
````

## File: modules/identity/interfaces/hooks/useTokenRefreshListener.tsx
````typescript
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
 */
import { useEffect } from "react";
import { getFirebaseAuth } from "@integration-firebase";
import { FirebaseTokenRefreshRepository } from "../../infrastructure/firebase/FirebaseTokenRefreshRepository";
⋮----
/**
 * @param accountId - Authenticated user's account ID, or null/undefined when signed out.
 */
export function useTokenRefreshListener(accountId: string | null | undefined): void
⋮----
// Guard: accountId must be a valid Firestore document ID
⋮----
// [S6] Force-refresh the ID token so subsequent requests carry updated Custom Claims.
void currentUser.getIdToken(/* forceRefresh */ true).catch(() => {
// Non-fatal: token refreshes naturally on next expiry cycle.
````

## File: modules/identity/ports/.gitkeep
````

````

## File: modules/knowledge/api/events.ts
````typescript
/**
 * Module: knowledge
 * Layer: api/events
 * Purpose: Public event contracts emitted by the Content domain.
 *
 * External modules (e.g. workspace-flow) MUST import event types only from
 * this path. Never import from content/domain/events directly.
 */
⋮----
// ── Event-type constants (for switch/case subscribers) ────────────────────────
⋮----
export type KnowledgeEventType = (typeof KNOWLEDGE_EVENT_TYPES)[keyof typeof KNOWLEDGE_EVENT_TYPES];
````

## File: modules/knowledge/api/knowledge-api.ts
````typescript
/**
 * Module: knowledge
 * Layer: api (cross-module facade)
 * Purpose: KnowledgeApi — lightweight facade that wires in-memory adapters and
 *          exposes the minimal surface needed by the demo-flow script and by
 *          other modules that communicate through the event bus.
 *
 * This is intentionally separate from KnowledgeFacade (which uses Firebase).
 * KnowledgeApi uses InMemory repos so it can run without any external service.
 */
import {
  createKnowledgePageCreatedEvent,
} from "../../shared/domain/events/knowledge-page-created.event";
import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";
import type { KnowledgeBlock } from "../domain/entities/content-block.entity";
import type { KnowledgePage } from "../domain/entities/content-page.entity";
import { BlockService } from "../application/block-service";
import {
  InMemoryKnowledgePageRepository,
  InMemoryKnowledgeBlockRepository,
} from "../infrastructure/InMemoryKnowledgeRepository";
export class KnowledgeApi {
⋮----
constructor(eventBus: SimpleEventBus)
/**
   * Create a new page in the in-memory store and publish a
   * `KnowledgePageCreatedEvent` so the knowledge-graph module can
   * automatically register a GraphNode for the new page.
   */
async createPage(
    accountId: string,
    title: string,
    createdByUserId = "system",
    options?: { workspaceId?: string; parentPageId?: string | null },
): Promise<KnowledgePage>
/** Add a block to an existing page and return the new block. */
async addBlock(accountId: string, pageId: string, text: string): Promise<KnowledgeBlock>
/**
   * Update a block's text content.
   * Publishes `KnowledgeUpdatedEvent` via the event bus so downstream modules
   * (e.g. knowledge) can react.
   */
async updateBlock(
    accountId: string,
    blockId: string,
    text: string,
): Promise<KnowledgeBlock | null>
/** Return all pages for an account. */
async listPages(accountId: string): Promise<KnowledgePage[]>
/** Return the page with all its blocks (flat list, ordered). */
async getPageStructure(
    accountId: string,
    pageId: string,
): Promise<
````

## File: modules/knowledge/api/knowledge-facade.ts
````typescript
/**
 * Module: knowledge
 * Layer: api
 * Purpose: KnowledgeFacade — the ONLY authorised entry point for cross-domain
 * access to the Content domain.
 *
 * BOUNDARY RULE:
 *   Other modules MUST import from here:
 *     import { knowledgeFacade } from "@/modules/knowledge";
 *   They must NEVER reach into domain/, application/, infrastructure/ or
 *   interfaces/ directly.
 */
import type { KnowledgePageRepository, KnowledgeBlockRepository } from "../domain/repositories/knowledge.repositories";
import type { KnowledgePage, KnowledgePageTreeNode } from "../domain/entities/content-page.entity";
import type { KnowledgeBlock } from "../domain/entities/content-block.entity";
import type { KnowledgeVersion } from "../domain/entities/content-version.entity";
import type { BlockContent } from "../domain/value-objects/block-content";
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  GetKnowledgePageTreeUseCase,
} from "../application/use-cases/knowledge-page.use-cases";
import {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
  ListKnowledgeBlocksUseCase,
} from "../application/use-cases/knowledge-block.use-cases";
import { FirebaseKnowledgePageRepository } from "../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseKnowledgeBlockRepository } from "../infrastructure/firebase/FirebaseContentBlockRepository";
export interface KnowledgeCreatePageParams {
  accountId: string;
  workspaceId?: string;
  title: string;
  parentPageId?: string | null;
  createdByUserId: string;
}
export interface KnowledgeRenamePageParams {
  accountId: string;
  pageId: string;
  title: string;
}
export interface KnowledgeMovePageParams {
  accountId: string;
  pageId: string;
  targetParentPageId: string | null;
}
export interface KnowledgeAddBlockParams {
  accountId: string;
  pageId: string;
  content: BlockContent;
  index?: number;
}
export interface KnowledgeUpdateBlockParams {
  accountId: string;
  blockId: string;
  content: BlockContent;
}
export class KnowledgeFacade {
⋮----
constructor(
    pageRepo: KnowledgePageRepository = new FirebaseKnowledgePageRepository(),
    blockRepo: KnowledgeBlockRepository = new FirebaseKnowledgeBlockRepository(),
)
async createPage(params: KnowledgeCreatePageParams): Promise<string | null>
async renamePage(params: KnowledgeRenamePageParams): Promise<boolean>
async movePage(params: KnowledgeMovePageParams): Promise<boolean>
async archivePage(accountId: string, pageId: string): Promise<boolean>
async getPage(accountId: string, pageId: string): Promise<KnowledgePage | null>
async listPages(accountId: string): Promise<KnowledgePage[]>
async getPageTree(accountId: string): Promise<KnowledgePageTreeNode[]>
async addBlock(params: KnowledgeAddBlockParams): Promise<string | null>
async updateBlock(params: KnowledgeUpdateBlockParams): Promise<boolean>
async deleteBlock(accountId: string, blockId: string): Promise<boolean>
async listBlocks(accountId: string, pageId: string): Promise<KnowledgeBlock[]>
async listVersions(_accountId: string, _pageId: string): Promise<KnowledgeVersion[]>
````

## File: modules/knowledge/application/block-service.ts
````typescript
/**
 * Module: knowledge
 * Layer: application
 * Purpose: BlockService — orchestrates block updates and fires KnowledgeUpdatedEvent.
 *
 * Follows Occam's Razor: minimal logic to prove the event-driven loop.
 * The service wraps the existing UpdateKnowledgeBlockUseCase and adds event
 * publishing so downstream modules (knowledge, AI) can react.
 */
import {
  type KnowledgeUpdatedEvent,
  KNOWLEDGE_UPDATED_EVENT_TYPE,
  createKnowledgeUpdatedEvent,
} from "../../shared/domain/events/knowledge-updated.event";
import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";
import type { KnowledgeBlock } from "../domain/entities/content-block.entity";
import type { KnowledgeBlockRepository } from "../domain/repositories/knowledge.repositories";
export interface BlockServiceUpdateInput {
  readonly accountId: string;
  readonly blockId: string;
  /** New plain-text or rich-text content */
  readonly text: string;
}
⋮----
/** New plain-text or rich-text content */
⋮----
export class BlockService {
⋮----
constructor(
/**
   * Update a block's text content and publish a `KnowledgeUpdatedEvent`.
   * Returns the updated block, or `null` when the block is not found.
   */
async updateBlock(input: BlockServiceUpdateInput): Promise<KnowledgeBlock | null>
````

## File: modules/knowledge/application/use-cases/knowledge-block.use-cases.ts
````typescript
/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Block use cases — add, update, delete, list.
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { KnowledgeBlock } from "../../domain/entities/content-block.entity";
import type { KnowledgeBlockRepository } from "../../domain/repositories/knowledge.repositories";
import {
  AddKnowledgeBlockSchema,
  type AddKnowledgeBlockDto,
  UpdateKnowledgeBlockSchema,
  type UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockSchema,
  type DeleteKnowledgeBlockDto,
} from "../dto/knowledge.dto";
export class AddKnowledgeBlockUseCase {
⋮----
constructor(private readonly repo: KnowledgeBlockRepository)
async execute(input: AddKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class UpdateKnowledgeBlockUseCase {
⋮----
async execute(input: UpdateKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class DeleteKnowledgeBlockUseCase {
⋮----
async execute(input: DeleteKnowledgeBlockDto): Promise<CommandResult>
⋮----
export class ListKnowledgeBlocksUseCase {
⋮----
async execute(accountId: string, pageId: string): Promise<KnowledgeBlock[]>
````

## File: modules/knowledge/application/use-cases/knowledge-version.use-cases.ts
````typescript
/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Version use cases — publish a version snapshot and retrieve history.
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { KnowledgeVersion } from "../../domain/entities/content-version.entity";
import type { KnowledgeVersionRepository } from "../../domain/repositories/knowledge.repositories";
import {
  CreateKnowledgeVersionSchema,
  type CreateKnowledgeVersionDto,
} from "../dto/knowledge.dto";
export class PublishKnowledgeVersionUseCase {
⋮----
constructor(private readonly repo: KnowledgeVersionRepository)
async execute(input: CreateKnowledgeVersionDto): Promise<CommandResult>
⋮----
export class ListKnowledgeVersionsUseCase {
⋮----
async execute(accountId: string, pageId: string): Promise<KnowledgeVersion[]>
````

## File: modules/knowledge/domain/entities/content-block.entity.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Block entity — the atomic content unit inside a Page.
 */
import type { BlockContent } from "../value-objects/block-content";
export interface KnowledgeBlock {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
export interface AddKnowledgeBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly index?: number;
}
export interface UpdateKnowledgeBlockInput {
  readonly accountId: string;
  readonly blockId: string;
  readonly content: BlockContent;
}
export interface DeleteKnowledgeBlockInput {
  readonly accountId: string;
  readonly blockId: string;
}
````

## File: modules/knowledge/domain/entities/content-version.entity.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Version entity — immutable snapshot of a page at a point in time.
 */
import type { BlockContent } from "../value-objects/block-content";
export interface KnowledgeVersionBlock {
  readonly blockId: string;
  readonly order: number;
  readonly content: BlockContent;
}
export interface KnowledgeVersion {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly label: string;
  readonly titleSnapshot: string;
  readonly blocks: readonly KnowledgeVersionBlock[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
}
export interface CreateKnowledgeVersionInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly label?: string;
  readonly createdByUserId: string;
}
````

## File: modules/knowledge/domain/value-objects/block-content.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/value-object
 * Purpose: BlockContent — immutable typed content snapshot for a Block.
 *
 * BlockContent is a VALUE OBJECT: equality is determined by value, not identity.
 * Changing any property produces a conceptually new BlockContent.
 *
 * Supported block types follow the Notion-like content model:
 *   text, heading-1/2/3, image, code, bullet-list, numbered-list, divider, quote.
 *
 * The domain layer keeps this type-only (no Zod) to remain framework-free.
 * Zod schemas live in the application/dto layer.
 */
// ── Block types ───────────────────────────────────────────────────────────────
export type BlockType =
  | "text"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "image"
  | "code"
  | "bullet-list"
  | "numbered-list"
  | "divider"
  | "quote";
⋮----
export interface BlockContent {
  readonly type: BlockType;
  readonly text: string;
  readonly properties?: Readonly<Record<string, unknown>>;
}
export function blockContentEquals(a: BlockContent, b: BlockContent): boolean
⋮----
const sortedKeys = (obj: Record<string, unknown>): string
⋮----
export function emptyTextBlockContent(): BlockContent
````

## File: modules/knowledge/infrastructure/firebase/FirebaseContentBlockRepository.ts
````typescript
/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgeBlockRepository.
 *
 * Firestore collection: accounts/{accountId}/contentBlocks/{blockId}
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { KnowledgeBlock } from "../../domain/entities/content-block.entity";
import type { AddKnowledgeBlockInput, UpdateKnowledgeBlockInput } from "../../domain/entities/content-block.entity";
import type { KnowledgeBlockRepository } from "../../domain/repositories/knowledge.repositories";
import type { BlockContent } from "../../domain/value-objects/block-content";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";
function blocksCol(db: ReturnType<typeof getFirestore>, accountId: string)
function blockDoc(db: ReturnType<typeof getFirestore>, accountId: string, blockId: string)
⋮----
function toBlockContent(raw: unknown): BlockContent
function toKnowledgeBlock(id: string, data: Record<string, unknown>): KnowledgeBlock
export class FirebaseKnowledgeBlockRepository implements KnowledgeBlockRepository {
⋮----
private get db()
async add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock>
async update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null>
async delete(accountId: string, blockId: string): Promise<void>
async findById(accountId: string, blockId: string): Promise<KnowledgeBlock | null>
async listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]>
````

## File: modules/knowledge/interfaces/index.ts
````typescript
/**
 * Module: knowledge
 * Layer: interfaces/barrel
 */
````

## File: modules/notebook/.gitkeep
````

````

## File: modules/notebook/application/index.ts
````typescript

````

## File: modules/notebook/application/use-cases/answer-rag-query.use-case.ts
````typescript
/**
 * @deprecated AnswerRagQueryUseCase ownership is in modules/search.
 */
````

## File: modules/notebook/domain/entities/AgentGeneration.ts
````typescript
import type { DomainError } from "@shared-types";
export interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;
  readonly system?: string;
}
export interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
export type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };
````

## File: modules/notebook/domain/entities/message.ts
````typescript
/**
 * modules/notebook — domain entity: Message
 */
import type { ID } from "@shared-types";
export type MessageRole = "user" | "assistant" | "system";
export interface Message {
  readonly id: ID;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAt: string;
}
````

## File: modules/notebook/domain/entities/RagQuery.ts
````typescript
/**
 * @deprecated Retrieval query contracts moved to modules/search.
 */
````

## File: modules/notebook/domain/repositories/RagGenerationRepository.ts
````typescript
/**
 * @deprecated RAG generation contracts moved to modules/search.
 */
````

## File: modules/notebook/domain/repositories/RagRetrievalRepository.ts
````typescript
/**
 * @deprecated Retrieval repository contracts moved to modules/search.
 */
````

## File: modules/notebook/index.ts
````typescript

````

## File: modules/notebook/infrastructure/firebase/FirebaseRagRetrievalRepository.ts
````typescript
/**
 * @deprecated Retrieval adapter ownership moved to modules/search.
 */
````

## File: modules/notebook/infrastructure/firebase/index.ts
````typescript

````

## File: modules/notebook/infrastructure/genkit/client.ts
````typescript
/**
 * @module modules/notebook/infrastructure/genkit/client
 */
import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";
⋮----
export type GenkitClientOptions = {
  model?: string;
};
export function getConfiguredGenkitModel(model?: string)
export function createGenkitClient(options?: GenkitClientOptions)
````

## File: modules/notebook/infrastructure/index.ts
````typescript

````

## File: modules/notebook/interfaces/index.ts
````typescript

````

## File: modules/notification/application/use-cases/notification.use-cases.ts
````typescript
/**
 * Notification Use Cases — pure business workflows.
 * notification-hub = sole side-effect outlet. All notification dispatch routes through here.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";
export class DispatchNotificationUseCase {
⋮----
constructor(private readonly notificationRepo: NotificationRepository)
async execute(input: DispatchNotificationInput): Promise<CommandResult>
⋮----
export class MarkNotificationReadUseCase {
⋮----
async execute(notificationId: string, recipientId: string): Promise<CommandResult>
⋮----
export class MarkAllNotificationsReadUseCase {
⋮----
async execute(recipientId: string): Promise<CommandResult>
````

## File: modules/notification/domain/entities/Notification.ts
````typescript
/**
 * Notification Domain Entities — pure TypeScript, zero framework dependencies.
 */
export type NotificationType = "info" | "alert" | "success" | "warning";
export interface NotificationEntity {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: number;
  sourceEventType?: string;
  metadata?: Record<string, unknown>;
}
// ─── Value Objects ────────────────────────────────────────────────────────────
export interface DispatchNotificationInput {
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  sourceEventType?: string;
  metadata?: Record<string, unknown>;
}
````

## File: modules/notification/domain/repositories/NotificationRepository.ts
````typescript
import type { NotificationEntity, DispatchNotificationInput } from "../entities/Notification";
export interface NotificationRepository {
  dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>;
  markAsRead(notificationId: string, recipientId: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  findByRecipient(recipientId: string, limit?: number): Promise<NotificationEntity[]>;
  getUnreadCount(recipientId: string): Promise<number>;
}
⋮----
dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>;
markAsRead(notificationId: string, recipientId: string): Promise<void>;
markAllAsRead(recipientId: string): Promise<void>;
findByRecipient(recipientId: string, limit?: number): Promise<NotificationEntity[]>;
getUnreadCount(recipientId: string): Promise<number>;
````

## File: modules/notification/infrastructure/firebase/FirebaseNotificationRepository.ts
````typescript
/**
 * FirebaseNotificationRepository — Infrastructure adapter for notifications.
 */
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type {
  NotificationEntity,
  DispatchNotificationInput,
} from "../../domain/entities/Notification";
export class FirebaseNotificationRepository implements NotificationRepository {
⋮----
private get db()
async dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>
async markAsRead(notificationId: string, _recipientId: string): Promise<void>
async markAllAsRead(recipientId: string): Promise<void>
async findByRecipient(
    recipientId: string,
    maxCount = 50,
): Promise<NotificationEntity[]>
async getUnreadCount(recipientId: string): Promise<number>
````

## File: modules/notification/interfaces/_actions/notification.actions.ts
````typescript
/**
 * Notification Server Actions — thin adapter to use cases.
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  DispatchNotificationUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
} from "../../application/use-cases/notification.use-cases";
import { FirebaseNotificationRepository } from "../../infrastructure/firebase/FirebaseNotificationRepository";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";
⋮----
export async function dispatchNotification(
  input: DispatchNotificationInput,
): Promise<CommandResult>
export async function markNotificationRead(
  notificationId: string,
  recipientId: string,
): Promise<CommandResult>
export async function markAllNotificationsRead(recipientId: string): Promise<CommandResult>
````

## File: modules/notification/interfaces/queries/notification.queries.ts
````typescript
import type { NotificationEntity } from "../../domain/entities/Notification";
import { FirebaseNotificationRepository } from "../../infrastructure/firebase/FirebaseNotificationRepository";
⋮----
export async function getNotificationsForRecipient(
  recipientId: string,
  limit = 50,
): Promise<NotificationEntity[]>
````

## File: modules/notification/ports/.gitkeep
````

````

## File: modules/organization/api/index.ts
````typescript
/**
 * organization 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 organization 模組內部實作。
 */
import { FirebaseOrganizationRepository } from "../infrastructure/firebase/FirebaseOrganizationRepository";
// ─── DTOs ─────────────────────────────────────────────────────────────────────
/** 組織成員 DTO — 供外部模組消費，不直接暴露 MemberReference 實體。 */
export interface OrganizationMemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  /** 成員線上狀態：active（上線）、away（暫離）、offline（離線）。 */
  presence: "active" | "away" | "offline";
  isExternal?: boolean;
}
⋮----
/** 成員線上狀態：active（上線）、away（暫離）、offline（離線）。 */
⋮----
/** 組織團隊 DTO — 供外部模組消費，不直接暴露 Team 實體。 */
export interface OrganizationTeamDTO {
  id: string;
  name: string;
  memberIds: string[];
}
// ─── 內部單例 ──────────────────────────────────────────────────────────────────
⋮----
// ─── 公開 API Facade ──────────────────────────────────────────────────────────
⋮----
/**
   * 取得指定組織的所有成員清單。
   */
async getMembers(organizationId: string): Promise<OrganizationMemberDTO[]>
/**
   * 取得指定組織的所有團隊清單。
   */
async getTeams(organizationId: string): Promise<OrganizationTeamDTO[]>
⋮----
// ─── Server Actions ───────────────────────────────────────────────────────────
⋮----
// ─── Query Functions ──────────────────────────────────────────────────────────
````

## File: modules/organization/application/use-cases/organization-policy.use-cases.ts
````typescript
/**
 * Organization Policy Use Cases — pure business workflows.
 * Org policy changes flow through event bus to update workspace org-policy cache downstream.
 * No React, no Firebase, no UI framework.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type { CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";
// ─── Create Org Policy ────────────────────────────────────────────────────────
export class CreateOrgPolicyUseCase {
⋮----
constructor(private readonly orgRepo: OrganizationRepository)
async execute(input: CreateOrgPolicyInput): Promise<CommandResult>
⋮----
// ─── Update Org Policy ────────────────────────────────────────────────────────
export class UpdateOrgPolicyUseCase {
⋮----
async execute(policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult>
⋮----
// ─── Delete Org Policy ────────────────────────────────────────────────────────
export class DeleteOrgPolicyUseCase {
⋮----
async execute(policyId: string): Promise<CommandResult>
````

## File: modules/organization/application/use-cases/organization.use-cases.ts
````typescript
/**
 * Organization Use Cases — pure business workflows.
 * Covers: org lifecycle, members, teams, partners.
 * No React, no Firebase, no UI framework.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type {
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
} from "../../domain/entities/Organization";
// ─── Org Lifecycle ────────────────────────────────────────────────────────────
export class CreateOrganizationUseCase {
⋮----
constructor(private readonly orgRepo: OrganizationRepository)
async execute(command: CreateOrganizationCommand): Promise<CommandResult>
⋮----
export class CreateOrganizationWithTeamUseCase {
⋮----
async execute(
    command: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
): Promise<CommandResult>
⋮----
export class UpdateOrganizationSettingsUseCase {
⋮----
async execute(command: UpdateOrganizationSettingsCommand): Promise<CommandResult>
⋮----
export class DeleteOrganizationUseCase {
⋮----
async execute(organizationId: string): Promise<CommandResult>
⋮----
// ─── Members ─────────────────────────────────────────────────────────────────
export class InviteMemberUseCase {
⋮----
async execute(input: InviteMemberInput): Promise<CommandResult>
⋮----
export class RecruitMemberUseCase {
⋮----
async execute(
    organizationId: string,
    memberId: string,
    name: string,
    email: string,
): Promise<CommandResult>
⋮----
export class RemoveMemberUseCase {
⋮----
async execute(organizationId: string, memberId: string): Promise<CommandResult>
⋮----
export class UpdateMemberRoleUseCase {
⋮----
async execute(input: UpdateMemberRoleInput): Promise<CommandResult>
⋮----
// ─── Teams ───────────────────────────────────────────────────────────────────
export class CreateTeamUseCase {
⋮----
async execute(input: CreateTeamInput): Promise<CommandResult>
⋮----
export class DeleteTeamUseCase {
⋮----
async execute(organizationId: string, teamId: string): Promise<CommandResult>
⋮----
export class UpdateTeamMembersUseCase {
⋮----
async execute(
    organizationId: string,
    teamId: string,
    memberId: string,
    action: "add" | "remove",
): Promise<CommandResult>
⋮----
// ─── Partners ─────────────────────────────────────────────────────────────────
export class CreatePartnerGroupUseCase {
⋮----
async execute(organizationId: string, groupName: string): Promise<CommandResult>
⋮----
export class SendPartnerInviteUseCase {
⋮----
async execute(
    organizationId: string,
    teamId: string,
    email: string,
): Promise<CommandResult>
⋮----
export class DismissPartnerMemberUseCase {
⋮----
async execute(
    organizationId: string,
    teamId: string,
    memberId: string,
): Promise<CommandResult>
````

## File: modules/organization/domain/entities/Organization.ts
````typescript
/**
 * Organization Domain Entities — pure TypeScript, zero framework dependencies.
 */
import type { Timestamp } from "@shared-types";
// ─── Re-export shared types (avoid cross-module domain imports) ───────────────
export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
export type Presence = "active" | "away" | "offline";
export type InviteState = "pending" | "accepted" | "expired";
export type PolicyEffect = "allow" | "deny";
export interface MemberReference {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  presence: Presence;
  isExternal?: boolean;
  expiryDate?: Timestamp;
}
export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}
export interface PartnerInvite {
  id: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  inviteState: InviteState;
  invitedAt: Timestamp;
  protocol: string;
}
export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}
// ─── Organization Aggregate ───────────────────────────────────────────────────
export interface OrganizationEntity {
  id: string;
  name: string;
  ownerId: string;
  email?: string;
  photoURL?: string;
  description?: string;
  theme?: ThemeConfig;
  members: MemberReference[];
  memberIds: string[];
  teams: Team[];
  partnerInvites?: PartnerInvite[];
  createdAt: Timestamp;
}
// ─── Org Policy ───────────────────────────────────────────────────────────────
export interface OrgPolicyRule {
  resource: string;
  actions: string[];
  effect: PolicyEffect;
  conditions?: Record<string, string>;
}
export type OrgPolicyScope = "workspace" | "member" | "global";
export interface OrgPolicy {
  readonly id: string;
  readonly orgId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: OrgPolicyRule[];
  readonly scope: OrgPolicyScope;
  readonly isActive: boolean;
  readonly createdAt: string; // ISO-8601
  readonly updatedAt: string; // ISO-8601
}
⋮----
readonly createdAt: string; // ISO-8601
readonly updatedAt: string; // ISO-8601
⋮----
// ─── Value Objects (Commands) ─────────────────────────────────────────────────
export interface CreateOrganizationCommand {
  readonly organizationName: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
}
export interface UpdateOrganizationSettingsCommand {
  readonly organizationId: string;
  readonly name?: string;
  readonly description?: string;
  readonly theme?: ThemeConfig | null;
  readonly photoURL?: string;
}
export interface InviteMemberInput {
  organizationId: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  protocol: string;
}
export interface UpdateMemberRoleInput {
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
}
export interface CreateTeamInput {
  organizationId: string;
  name: string;
  description: string;
  type: "internal" | "external";
}
export interface CreateOrgPolicyInput {
  orgId: string;
  name: string;
  description: string;
  rules: OrgPolicyRule[];
  scope: OrgPolicyScope;
}
export interface UpdateOrgPolicyInput {
  name?: string;
  description?: string;
  rules?: OrgPolicyRule[];
  scope?: OrgPolicyScope;
  isActive?: boolean;
}
````

## File: modules/organization/domain/repositories/OrganizationRepository.ts
````typescript
/**
 * OrganizationRepository — Port for organization persistence.
 * Domain defines the interface; Infrastructure implements it.
 */
import type {
  OrganizationEntity,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  MemberReference,
  Team,
  OrgPolicy,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
  PartnerInvite,
} from "../entities/Organization";
export type Unsubscribe = () => void;
export interface OrganizationRepository {
  // ─── Org Lifecycle ─────────────────────────────────────────────────────────
  create(command: CreateOrganizationCommand): Promise<string>;
  findById(id: string): Promise<OrganizationEntity | null>;
  save(org: OrganizationEntity): Promise<void>;
  updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>;
  delete(organizationId: string): Promise<void>;
  // ─── Members ───────────────────────────────────────────────────────────────
  inviteMember(input: InviteMemberInput): Promise<string>;
  recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void>;
  removeMember(organizationId: string, memberId: string): Promise<void>;
  updateMemberRole(input: UpdateMemberRoleInput): Promise<void>;
  getMembers(organizationId: string): Promise<MemberReference[]>;
  subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): Unsubscribe;
  // ─── Teams ─────────────────────────────────────────────────────────────────
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
  subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): Unsubscribe;
  // ─── Partners ──────────────────────────────────────────────────────────────
  sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string>;
  dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>;
  // ─── Policy ────────────────────────────────────────────────────────────────
  createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>;
  updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>;
  deletePolicy(policyId: string): Promise<void>;
  getPolicies(orgId: string): Promise<OrgPolicy[]>;
}
⋮----
// ─── Org Lifecycle ─────────────────────────────────────────────────────────
create(command: CreateOrganizationCommand): Promise<string>;
findById(id: string): Promise<OrganizationEntity | null>;
save(org: OrganizationEntity): Promise<void>;
updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>;
delete(organizationId: string): Promise<void>;
// ─── Members ───────────────────────────────────────────────────────────────
inviteMember(input: InviteMemberInput): Promise<string>;
recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void>;
removeMember(organizationId: string, memberId: string): Promise<void>;
updateMemberRole(input: UpdateMemberRoleInput): Promise<void>;
getMembers(organizationId: string): Promise<MemberReference[]>;
subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[])
// ─── Teams ─────────────────────────────────────────────────────────────────
createTeam(input: CreateTeamInput): Promise<string>;
deleteTeam(organizationId: string, teamId: string): Promise<void>;
addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
getTeams(organizationId: string): Promise<Team[]>;
subscribeToTeams(organizationId: string, onUpdate: (teams: Team[])
// ─── Partners ──────────────────────────────────────────────────────────────
sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string>;
dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void>;
getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>;
// ─── Policy ────────────────────────────────────────────────────────────────
createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>;
updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>;
deletePolicy(policyId: string): Promise<void>;
getPolicies(orgId: string): Promise<OrgPolicy[]>;
````

## File: modules/organization/index.ts
````typescript
/**
 * organization module public API
 */
⋮----
// Use Cases
⋮----
// Infrastructure
⋮----
// Server Actions
⋮----
// Read Queries
````

## File: modules/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts
````typescript
/**
 * FirebaseOrganizationRepository — Infrastructure adapter for organization persistence.
 * Implements the OrganizationRepository port.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { OrganizationRepository, Unsubscribe } from "../../domain/repositories/OrganizationRepository";
import type {
  OrganizationEntity,
  MemberReference,
  Team,
  OrgPolicy,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
  OrganizationRole,
} from "../../domain/entities/Organization";
// ─── Mappers ──────────────────────────────────────────────────────────────────
function toOrganizationEntity(id: string, data: Record<string, unknown>): OrganizationEntity
function toOrgPolicy(id: string, data: Record<string, unknown>): OrgPolicy
// ─── Repository ───────────────────────────────────────────────────────────────
export class FirebaseOrganizationRepository implements OrganizationRepository {
⋮----
private get db()
private organizationAccountRef(organizationId: string)
private buildOrganizationAccountData(
    data: {
      name?: string;
      ownerId?: string;
      email?: string;
      photoURL?: string;
      description?: string;
      theme?: OrganizationEntity["theme"];
      members?: MemberReference[];
      memberIds?: string[];
      teams?: Team[];
      createdAt?: OrganizationEntity["createdAt"] | ReturnType<typeof serverTimestamp>;
    },
)
// ─── Org Lifecycle ──────────────────────────────────────────────────────────
async create(command: CreateOrganizationCommand): Promise<string>
async findById(id: string): Promise<OrganizationEntity | null>
async save(org: OrganizationEntity): Promise<void>
async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>
async delete(organizationId: string): Promise<void>
// ─── Members ────────────────────────────────────────────────────────────────
async inviteMember(input: InviteMemberInput): Promise<string>
async recruitMember(
    organizationId: string,
    memberId: string,
    name: string,
    email: string,
): Promise<void>
async removeMember(organizationId: string, memberId: string): Promise<void>
async updateMemberRole(input: UpdateMemberRoleInput): Promise<void>
async getMembers(organizationId: string): Promise<MemberReference[]>
subscribeToMembers(
    organizationId: string,
    onUpdate: (members: MemberReference[]) => void,
): Unsubscribe
// ─── Teams ──────────────────────────────────────────────────────────────────
async createTeam(input: CreateTeamInput): Promise<string>
async deleteTeam(organizationId: string, teamId: string): Promise<void>
async addMemberToTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
): Promise<void>
async removeMemberFromTeam(
    organizationId: string,
    teamId: string,
    memberId: string,
): Promise<void>
async getTeams(organizationId: string): Promise<Team[]>
subscribeToTeams(
    organizationId: string,
    onUpdate: (teams: Team[]) => void,
): Unsubscribe
// ─── Partners ────────────────────────────────────────────────────────────────
async sendPartnerInvite(
    organizationId: string,
    teamId: string,
    email: string,
): Promise<string>
async dismissPartnerMember(
    organizationId: string,
    teamId: string,
    memberId: string,
): Promise<void>
async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>
// ─── Policy ──────────────────────────────────────────────────────────────────
async createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>
async updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>
async deletePolicy(policyId: string): Promise<void>
async getPolicies(orgId: string): Promise<OrgPolicy[]>
````

## File: modules/organization/interfaces/_actions/organization.actions.ts
````typescript
/**
 * Organization Core Server Actions — thin adapter: Server Actions → Application Use Cases.
 * Covers: org lifecycle (create, update settings, delete).
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "../../application/use-cases/organization.use-cases";
import {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../../application/use-cases/organization-policy.use-cases";
import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../../domain/entities/Organization";
⋮----
// ─── Org Lifecycle ────────────────────────────────────────────────────────────
export async function createOrganization(
  command: CreateOrganizationCommand,
): Promise<CommandResult>
export async function createOrganizationWithTeam(
  command: CreateOrganizationCommand,
  teamName: string,
  teamType: "internal" | "external" = "internal",
): Promise<CommandResult>
export async function updateOrganizationSettings(
  command: UpdateOrganizationSettingsCommand,
): Promise<CommandResult>
export async function deleteOrganization(organizationId: string): Promise<CommandResult>
// ─── Members ─────────────────────────────────────────────────────────────────
export async function inviteMember(input: import("../../domain/entities/Organization").InviteMemberInput): Promise<CommandResult>
export async function recruitMember(
  organizationId: string,
  memberId: string,
  name: string,
  email: string,
): Promise<CommandResult>
export async function dismissMember(
  organizationId: string,
  memberId: string,
): Promise<CommandResult>
export async function updateMemberRole(input: UpdateMemberRoleInput): Promise<CommandResult>
// ─── Teams ───────────────────────────────────────────────────────────────────
export async function createTeam(input: CreateTeamInput): Promise<CommandResult>
export async function deleteTeam(
  organizationId: string,
  teamId: string,
): Promise<CommandResult>
export async function updateTeamMembers(
  organizationId: string,
  teamId: string,
  memberId: string,
  action: "add" | "remove",
): Promise<CommandResult>
// ─── Partners ─────────────────────────────────────────────────────────────────
export async function createPartnerGroup(
  organizationId: string,
  groupName: string,
): Promise<CommandResult>
export async function sendPartnerInvite(
  organizationId: string,
  teamId: string,
  email: string,
): Promise<CommandResult>
export async function dismissPartnerMember(
  organizationId: string,
  teamId: string,
  memberId: string,
): Promise<CommandResult>
// ─── Policy ───────────────────────────────────────────────────────────────────
export async function createOrgPolicy(input: CreateOrgPolicyInput): Promise<CommandResult>
export async function updateOrgPolicy(
  policyId: string,
  data: UpdateOrgPolicyInput,
): Promise<CommandResult>
export async function deleteOrgPolicy(policyId: string): Promise<CommandResult>
````

## File: modules/organization/interfaces/queries/organization.queries.ts
````typescript
/**
 * Organization Read Queries — thin wrappers for real-time subscription and one-shot reads.
 * Callable from React components/hooks, NOT server actions.
 */
import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import type { MemberReference, Team, PartnerInvite, OrgPolicy } from "../../domain/entities/Organization";
import type { Unsubscribe } from "../../domain/repositories/OrganizationRepository";
⋮----
// ─── Members ─────────────────────────────────────────────────────────────────
export async function getOrganizationMembers(organizationId: string): Promise<MemberReference[]>
export function subscribeToOrganizationMembers(
  organizationId: string,
  onUpdate: (members: MemberReference[]) => void,
): Unsubscribe
// ─── Teams ───────────────────────────────────────────────────────────────────
export async function getOrganizationTeams(organizationId: string): Promise<Team[]>
export function subscribeToOrganizationTeams(
  organizationId: string,
  onUpdate: (teams: Team[]) => void,
): Unsubscribe
// ─── Partners ─────────────────────────────────────────────────────────────────
export async function getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>
// ─── Policy ───────────────────────────────────────────────────────────────────
export async function getOrgPolicies(orgId: string): Promise<OrgPolicy[]>
````

## File: modules/organization/ports/.gitkeep
````

````

## File: modules/search/api/server.ts
````typescript
/**
 * modules/search — server-only API barrel.
 *
 * Exports concrete implementation classes that depend on server-only packages
 * (genkit, gRPC, google-auth-library, etc.).
 * MUST NOT be imported by client components or the client-side bundle.
 * Server actions and server-only modules use this barrel.
 */
````

## File: modules/search/application/use-cases/answer-rag-query.use-case.ts
````typescript
import { randomUUID } from "node:crypto";
import type { RagGenerationRepository } from "../../domain/repositories/RagGenerationRepository";
import type { RagRetrievalRepository } from "../../domain/repositories/RagRetrievalRepository";
import type {
  AnswerRagQueryInput,
  AnswerRagQueryResult,
  RagRetrievalSummary,
} from "../../domain/entities/RagQuery";
⋮----
function normalizeTopK(value?: number)
export class AnswerRagQueryUseCase {
⋮----
constructor(
async execute(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult>
````

## File: modules/search/application/use-cases/submit-rag-feedback.use-case.ts
````typescript
/**
 * modules/search — application/use-cases
 * Purpose: SubmitRagQueryFeedbackUseCase — persists user feedback on a RAG
 *          answer and returns a CommandResult.
 *
 * This closes the RAG feedback loop:
 *   User rates answer → SubmitRagQueryFeedbackUseCase → Firestore
 *   → analytics / fine-tuning pipeline can consume
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import type { RagQueryFeedbackRepository } from "../../domain/repositories/RagQueryFeedbackRepository";
import type { SubmitRagQueryFeedbackInput, RagFeedbackRating } from "../../domain/entities/RagQueryFeedback";
⋮----
export class SubmitRagQueryFeedbackUseCase {
⋮----
constructor(private readonly feedbackRepo: RagQueryFeedbackRepository)
async execute(input: SubmitRagQueryFeedbackInput): Promise<CommandResult>
⋮----
// Validate required fields
⋮----
/** Convenience factory for production wiring (used by Server Actions). */
export function createFeedbackId(): string
````

## File: modules/search/domain/entities/RagQuery.ts
````typescript
import type { DomainError } from "@shared-types";
export interface RagRetrievedChunk {
  readonly chunkId: string;
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly taxonomy: string;
  readonly text: string;
  readonly score: number;
}
export interface RagCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}
export interface RagRetrievalSummary {
  readonly mode: "skeleton-metadata-filter";
  readonly scope: "organization" | "workspace";
  readonly retrievedChunkCount: number;
  readonly topK: number;
  readonly taxonomy?: string;
}
export interface RagStreamEvent {
  readonly type: "token" | "citation" | "done" | "error";
  readonly traceId: string;
  readonly payload: string | RagCitation | RagRetrievalSummary | DomainError;
}
export interface AnswerRagQueryInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly taxonomy?: string;
  readonly topK?: number;
  readonly model?: string;
}
export interface AnswerRagQueryOutput {
  readonly answer: string;
  readonly citations: readonly RagCitation[];
  readonly retrievalSummary: RagRetrievalSummary;
  readonly model: string;
  readonly traceId: string;
  readonly events: readonly RagStreamEvent[];
}
export type AnswerRagQueryResult =
  | { ok: true; data: AnswerRagQueryOutput }
  | { ok: false; error: DomainError };
````

## File: modules/search/domain/entities/RagQueryFeedback.ts
````typescript
/**
 * modules/search — domain/entities
 * Purpose: RagQueryFeedback — captures user signal on RAG answer quality.
 *
 * This entity records whether a generated answer was helpful or not,
 * enabling continuous improvement of the RAG pipeline.
 *
 * Firestore path: ragQueryFeedback/{feedbackId}
 */
export type RagFeedbackRating = "helpful" | "not_helpful" | "partially_helpful";
export interface RagQueryFeedback {
  /** Unique identifier for this feedback record */
  readonly id: string;
  /** The trace ID from the RAG answer that generated this feedback */
  readonly traceId: string;
  /** The original user query */
  readonly userQuery: string;
  /** Organization scope of the query */
  readonly organizationId: string;
  /** Optional workspace scope */
  readonly workspaceId?: string;
  /** User's rating of the answer quality */
  readonly rating: RagFeedbackRating;
  /** Optional free-text comment from the user */
  readonly comment?: string;
  /** ID of the user submitting feedback */
  readonly submittedByUserId: string;
  /** ISO 8601 timestamp */
  readonly submittedAtISO: string;
}
⋮----
/** Unique identifier for this feedback record */
⋮----
/** The trace ID from the RAG answer that generated this feedback */
⋮----
/** The original user query */
⋮----
/** Organization scope of the query */
⋮----
/** Optional workspace scope */
⋮----
/** User's rating of the answer quality */
⋮----
/** Optional free-text comment from the user */
⋮----
/** ID of the user submitting feedback */
⋮----
/** ISO 8601 timestamp */
⋮----
export interface SubmitRagQueryFeedbackInput {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: RagFeedbackRating;
  readonly comment?: string;
  readonly submittedByUserId: string;
}
````

## File: modules/search/domain/ports/vector-store.ts
````typescript
/**
 * modules/search — domain port: IVectorStore
 *
 * Hexagonal architecture port that abstracts the underlying vector database
 * (e.g. Upstash Vector, Pinecone).  Infrastructure layer must implement this
 * interface; no concrete SDK details belong here.
 */
/** A document to index in the vector store */
export interface VectorDocument {
  /** Unique identifier (e.g. BlockId or PageId) */
  readonly id: string;
  /** Raw text content used to generate the embedding */
  readonly content: string;
  /** Arbitrary metadata for filtering (e.g. { pageId, workspaceId }) */
  readonly metadata?: Record<string, string | number | boolean>;
}
⋮----
/** Unique identifier (e.g. BlockId or PageId) */
⋮----
/** Raw text content used to generate the embedding */
⋮----
/** Arbitrary metadata for filtering (e.g. { pageId, workspaceId }) */
⋮----
/** A search result returned by the vector store */
export interface VectorSearchResult {
  /** The matched document's ID */
  readonly id: string;
  /** Similarity score (0–1, higher is more similar) */
  readonly score: number;
  /** Metadata attached to the matched document */
  readonly metadata?: Record<string, string | number | boolean>;
}
⋮----
/** The matched document's ID */
⋮----
/** Similarity score (0–1, higher is more similar) */
⋮----
/** Metadata attached to the matched document */
⋮----
/**
 * Port that every vector-store adapter must satisfy.
 * Domain and application layers depend ONLY on this interface.
 */
export interface IVectorStore {
  /**
   * Insert or update documents in the vector store.
   * Embeddings are computed by the adapter implementation.
   */
  upsert(documents: VectorDocument[]): Promise<void>;
  /**
   * Find the top-K documents most similar to the query text.
   * @param query   - Natural-language query string
   * @param k       - Number of results to return
   * @param filter  - Optional metadata filter
   */
  search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;
}
⋮----
/**
   * Insert or update documents in the vector store.
   * Embeddings are computed by the adapter implementation.
   */
upsert(documents: VectorDocument[]): Promise<void>;
/**
   * Find the top-K documents most similar to the query text.
   * @param query   - Natural-language query string
   * @param k       - Number of results to return
   * @param filter  - Optional metadata filter
   */
search(
    query: string,
    k: number,
    filter?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;
````

## File: modules/search/domain/repositories/RagGenerationRepository.ts
````typescript
import type { DomainError } from "@shared-types";
import type { RagCitation, RagRetrievedChunk } from "../entities/RagQuery";
export interface GenerateRagAnswerInput {
  readonly traceId: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly chunks: readonly RagRetrievedChunk[];
  readonly model?: string;
}
export interface GenerateRagAnswerOutput {
  readonly answer: string;
  readonly citations: readonly RagCitation[];
  readonly model: string;
}
export type GenerateRagAnswerResult =
  | { ok: true; data: GenerateRagAnswerOutput }
  | { ok: false; error: DomainError };
export interface RagGenerationRepository {
  generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
}
⋮----
generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>;
````

## File: modules/search/domain/repositories/RagQueryFeedbackRepository.ts
````typescript
/**
 * modules/search — domain/repositories
 * Purpose: Port interface for RAG query feedback persistence.
 */
import type { RagQueryFeedback, SubmitRagQueryFeedbackInput } from "../entities/RagQueryFeedback";
export interface RagQueryFeedbackRepository {
  /** Persist a new feedback record and return the persisted entity. */
  save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;
  /** Retrieve all feedback for a specific trace ID. */
  findByTraceId(traceId: string): Promise<RagQueryFeedback[]>;
  /** Retrieve recent feedback for an organization (for analytics). */
  listByOrganization(organizationId: string, limitCount?: number): Promise<RagQueryFeedback[]>;
}
⋮----
/** Persist a new feedback record and return the persisted entity. */
save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>;
/** Retrieve all feedback for a specific trace ID. */
findByTraceId(traceId: string): Promise<RagQueryFeedback[]>;
/** Retrieve recent feedback for an organization (for analytics). */
listByOrganization(organizationId: string, limitCount?: number): Promise<RagQueryFeedback[]>;
````

## File: modules/search/domain/repositories/RagRetrievalRepository.ts
````typescript
import type { RagRetrievedChunk } from "../entities/RagQuery";
export interface RetrieveRagChunksInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
}
export interface RagRetrievalRepository {
  retrieve(input: RetrieveRagChunksInput): Promise<readonly RagRetrievedChunk[]>;
}
⋮----
retrieve(input: RetrieveRagChunksInput): Promise<readonly RagRetrievedChunk[]>;
````

## File: modules/search/domain/repositories/WikiContentRepository.ts
````typescript
/**
 * Module: search
 * Layer: domain/repositories
 * Purpose: Repository port for Wiki RAG content operations (query + reindex).
 */
import type {
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../entities/WikiRagTypes";
export interface WikiContentRepository {
  runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options?: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    },
  ): Promise<WikiRagQueryResult>;
  reindexDocument(input: WikiReindexInput): Promise<void>;
  listParsedDocuments(accountId: string, limitCount: number): Promise<WikiParsedDocument[]>;
}
⋮----
runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options?: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    },
  ): Promise<WikiRagQueryResult>;
reindexDocument(input: WikiReindexInput): Promise<void>;
listParsedDocuments(accountId: string, limitCount: number): Promise<WikiParsedDocument[]>;
````

## File: modules/search/index.ts
````typescript
/**
 * modules/search — module root barrel.
 *
 * Re-exports the full public surface including "use client" UI components.
 * "use server" code must import from "@/modules/search/api" (no UI components).
 * "use client" code and route files can import from here.
 */
⋮----
// ── UI components ("use client" — safe for client-only callers) ───────────────
````

## File: modules/search/infrastructure/firebase/FirebaseRagQueryFeedbackRepository.ts
````typescript
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { v7 as generateId } from "@lib-uuid";
import { firebaseClientApp } from "@integration-firebase/client";
import type {
  RagQueryFeedback,
  SubmitRagQueryFeedbackInput,
} from "../../domain/entities/RagQueryFeedback";
import type { RagQueryFeedbackRepository } from "../../domain/repositories/RagQueryFeedbackRepository";
⋮----
interface FirestoreRagFeedbackDoc {
  readonly traceId: string;
  readonly userQuery: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly rating: string;
  readonly comment?: string;
  readonly submittedByUserId: string;
  readonly submittedAtISO: string;
}
export class FirebaseRagQueryFeedbackRepository implements RagQueryFeedbackRepository {
⋮----
private db()
async save(input: SubmitRagQueryFeedbackInput): Promise<RagQueryFeedback>
async findByTraceId(traceId: string): Promise<RagQueryFeedback[]>
async listByOrganization(
    organizationId: string,
    limitCount = 50,
): Promise<RagQueryFeedback[]>
````

## File: modules/search/infrastructure/firebase/FirebaseRagRetrievalRepository.ts
````typescript
import { collectionGroup, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { RagRetrievedChunk } from "../../domain/entities/RagQuery";
import type {
  RagRetrievalRepository,
  RetrieveRagChunksInput,
} from "../../domain/repositories/RagRetrievalRepository";
interface FirestoreRagDocument {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly status?: string;
  readonly taxonomy?: string;
}
⋮----
interface FirestoreRagChunk {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly docId?: string;
  readonly text?: string;
  readonly taxonomy?: string;
  readonly page?: number;
  readonly chunkIndex?: number;
}
function tokenize(value: string): readonly string[]
function scoreChunk(queryTokens: readonly string[], text: string)
export class FirebaseRagRetrievalRepository implements RagRetrievalRepository {
⋮----
async retrieve(input: RetrieveRagChunksInput): Promise<readonly RagRetrievedChunk[]>
````

## File: modules/search/infrastructure/firebase/FirebaseWikiContentRepository.ts
````typescript
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import type { WikiContentRepository } from "../../domain/repositories/WikiContentRepository";
import type {
  WikiCitation,
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../../domain/entities/WikiRagTypes";
function isRecord(value: unknown): value is Record<string, unknown>
function objectOrEmpty(value: unknown): Record<string, unknown>
function toDateOrNull(value: unknown): Date | null
function toCitations(value: unknown): WikiCitation[]
function toNumberOrDefault(value: unknown, fallback = 0): number
function resolveDocumentFilename(data: Record<string, unknown>): string
function mapToParsedDocument(id: string, data: Record<string, unknown>): WikiParsedDocument
function sortByUploadedAtDesc(documents: WikiParsedDocument[]): WikiParsedDocument[]
export class FirebaseWikiContentRepository implements WikiContentRepository {
⋮----
async runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    } = {},
): Promise<WikiRagQueryResult>
async reindexDocument(input: WikiReindexInput): Promise<void>
async listParsedDocuments(accountId: string, limitCount: number): Promise<WikiParsedDocument[]>
````

## File: modules/search/infrastructure/genkit/client.ts
````typescript
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
⋮----
export function getConfiguredGenkitModel(model?: string): string
````

## File: modules/search/infrastructure/genkit/GenkitRagGenerationRepository.ts
````typescript
import type {
  GenerateRagAnswerInput,
  GenerateRagAnswerResult,
  RagGenerationRepository,
} from "../../domain/repositories/RagGenerationRepository";
import { aiClient, getConfiguredGenkitModel } from "./client";
function formatChunkForPrompt(input: GenerateRagAnswerInput["chunks"][number])
function buildPrompt(input: GenerateRagAnswerInput)
export class GenkitRagGenerationRepository implements RagGenerationRepository {
⋮----
async generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult>
````

## File: modules/search/interfaces/components/RagQueryView.tsx
````typescript
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { DEV_DEMO_ACCOUNT_EMAIL } from "@/app/providers/dev-demo-auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@ui-shadcn/ui/accordion";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Textarea } from "@ui-shadcn/ui/textarea";
import {
  runWikiRagQuery,
  type WikiCitation,
} from "../../api";
interface RagQueryViewProps {
  readonly workspaceId?: string;
}
/** Minimal RAG query chat interface. Uses local useState only – no streaming, no global state. */
⋮----
async function handleSubmit()
⋮----
// Compatibility fallback for older vectors without ready status.
⋮----
{/* Query input */}
⋮----
<Button onClick=
````

## File: modules/shared/api/index.ts
````typescript
/**
 * modules/shared — public API barrel.
 * Re-exports all shared domain primitives for cross-module consumption.
 */
⋮----
// ── Slug utilities (moved from modules/namespace) ─────────────────────────────
⋮----
// ── Event-store primitives (moved from modules/event) ─────────────────────────
````

## File: modules/shared/application/publish-domain-event.ts
````typescript
/**
 * modules/shared — application: PublishDomainEventUseCase
 * Moved from modules/event/application/use-cases/publish-domain-event.ts.
 *
 * Write-side orchestration for event capture, persistence, and dispatch.
 */
import {
  EventRecord,
  EventRecordPayload,
  EventMetadata,
  IEventBusRepository,
  IEventStoreRepository,
} from '../domain/event-record';
export interface PublishDomainEventDTO {
  id: string;
  eventName: string;
  aggregateType: string;
  aggregateId: string;
  payload: EventRecordPayload;
  metadata?: EventMetadata;
  occurredAt?: Date;
}
export class PublishDomainEventUseCase {
⋮----
constructor(
async execute(dto: PublishDomainEventDTO): Promise<EventRecord>
````

## File: modules/shared/domain/event-record.ts
````typescript
/**
 * modules/shared — domain: event store primitives
 * Moved from modules/event/domain/* during event module decomposition.
 *
 * NOTE: `EventRecord` is the rich event-store entity (id, eventName, payload, etc.).
 * It is distinct from the lightweight `DomainEvent` bus-message interface
 * already in modules/shared/domain/events.ts.
 */
// ── Metadata value object ─────────────────────────────────────────────────────
export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  actorId?: string;
  organizationId?: string;
  workspaceId?: string;
  traceId?: string;
}
// ── Payload ───────────────────────────────────────────────────────────────────
export interface EventRecordPayload {
  [key: string]: unknown;
}
// ── Entity ────────────────────────────────────────────────────────────────────
export class EventRecord {
⋮----
constructor(
    public readonly id: string,
    public readonly eventName: string,
    public readonly aggregateType: string,
    public readonly aggregateId: string,
    public readonly occurredAt: Date,
    public readonly payload: EventRecordPayload,
    public readonly metadata: EventMetadata = {},
    public dispatchedAt: Date | null = null,
)
markDispatched(dispatchedAt: Date = new Date()): void
get isDispatched(): boolean
⋮----
// ── Repository ports ──────────────────────────────────────────────────────────
export interface IEventStoreRepository {
  save(event: EventRecord): Promise<void>;
  findById(id: string): Promise<EventRecord | null>;
  findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>;
  findUndispatched(limit: number): Promise<EventRecord[]>;
  markDispatched(id: string, dispatchedAt: Date): Promise<void>;
}
⋮----
save(event: EventRecord): Promise<void>;
findById(id: string): Promise<EventRecord | null>;
findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>;
findUndispatched(limit: number): Promise<EventRecord[]>;
markDispatched(id: string, dispatchedAt: Date): Promise<void>;
⋮----
export interface IEventBusRepository {
  publish(event: EventRecord): Promise<void>;
}
⋮----
publish(event: EventRecord): Promise<void>;
````

## File: modules/shared/domain/events.ts
````typescript
/**
 * modules/shared — 跨模組共用的領域事件基礎介面。
 * 遵循奧卡姆剃刀：只定義跨領域事件所需的最小結構。
 */
/** 所有領域事件的基礎介面。 */
export interface DomainEvent {
  /** 事件的唯一識別碼 */
  readonly eventId: string;
  /** 事件類型（格式：module.event-name，例如 content.block-updated） */
  readonly type: string;
  /** 觸發此事件的聚合根 ID */
  readonly aggregateId: string;
  /** 事件發生時間（ISO 8601） */
  readonly occurredAt: string;
}
⋮----
/** 事件的唯一識別碼 */
⋮----
/** 事件類型（格式：module.event-name，例如 content.block-updated） */
⋮----
/** 觸發此事件的聚合根 ID */
⋮----
/** 事件發生時間（ISO 8601） */
````

## File: modules/shared/domain/events/knowledge-page-created.event.ts
````typescript
/**
 * modules/shared — domain event: KnowledgePageCreatedEvent
 *
 * Fired by the content module whenever a new page is created.
 * The knowledge-graph module subscribes to this event to automatically
 * register a GraphNode for the new page (auto-link trigger pipeline).
 *
 * Follows Occam's Razor: minimal fields to drive downstream reactions.
 */
import { v7 as generateId } from "@lib-uuid";
import type { DomainEvent } from "../events";
⋮----
export interface KnowledgePageCreatedEvent extends DomainEvent {
  readonly type: typeof KNOWLEDGE_PAGE_CREATED_EVENT_TYPE;
  /** ID of the newly created page */
  readonly pageId: string;
  /** Human-readable title of the page */
  readonly title: string;
  /** Account that owns the page */
  readonly accountId: string;
  /** Optional workspace the page belongs to */
  readonly workspaceId?: string;
  /** Optional parent page for hierarchy tracking */
  readonly parentPageId?: string | null;
  /** User who created the page */
  readonly createdByUserId: string;
}
⋮----
/** ID of the newly created page */
⋮----
/** Human-readable title of the page */
⋮----
/** Account that owns the page */
⋮----
/** Optional workspace the page belongs to */
⋮----
/** Optional parent page for hierarchy tracking */
⋮----
/** User who created the page */
⋮----
export function createKnowledgePageCreatedEvent(
  pageId: string,
  title: string,
  accountId: string,
  createdByUserId: string,
  options?: { workspaceId?: string; parentPageId?: string | null },
): KnowledgePageCreatedEvent
````

## File: modules/shared/domain/events/knowledge-updated.event.ts
````typescript
/**
 * modules/shared — domain event: KnowledgeUpdatedEvent
 *
 * Fired by the content module whenever a block's content changes.
 * Knowledge and AI modules subscribe to this event to react
 * (link extraction, vector re-indexing, etc.).
 *
 * Follows Occam's Razor: minimal fields needed to drive downstream reactions.
 */
import { v7 as generateId } from "@lib-uuid";
import type { DomainEvent } from "../events";
⋮----
export interface KnowledgeUpdatedEvent extends DomainEvent {
  readonly type: typeof KNOWLEDGE_UPDATED_EVENT_TYPE;
  /** ID of the page that owns the block */
  readonly pageId: string;
  /** ID of the block that was updated */
  readonly blockId: string;
  /** The new plain-text content of the block */
  readonly content: string;
}
⋮----
/** ID of the page that owns the block */
⋮----
/** ID of the block that was updated */
⋮----
/** The new plain-text content of the block */
⋮----
export function createKnowledgeUpdatedEvent(
  pageId: string,
  blockId: string,
  content: string,
): KnowledgeUpdatedEvent
````

## File: modules/shared/domain/slug-utils.ts
````typescript
/**
 * modules/shared — domain: slug utilities
 * Pure slug derivation and validation helpers shared across domains.
 * Moved from modules/namespace/domain/services/slug-policy.ts.
 */
/**
 * Converts a human-readable display name into a slug candidate.
 * Pure function — no side effects.
 */
export function deriveSlugCandidate(displayName: string): string
/**
 * Returns true when the slug string passes namespace slug rules.
 * Pure function — no side effects.
 */
export function isValidSlug(slug: string): boolean
````

## File: modules/shared/domain/types.ts
````typescript
/**
 * 共用領域類型 — 所有模組的基礎建構塊。
 * 遵循奧卡姆剃刀：只定義跨模組真正共用的最小集合。
 */
import { z } from "@lib-zod";
// ── 建立者摘要 ─────────────────────────────────────────────────────────────
⋮----
/** 使用者 ID */
⋮----
/** 顯示名稱 */
⋮----
/** 頭像 URL（選填） */
⋮----
// ── 基礎實體 Schema ────────────────────────────────────────────────────────
/**
 * 所有領域物件共用的基礎欄位。
 * 包含租戶隔離（accountId / workspaceId）與稽核追蹤（createdBy）。
 */
⋮----
/** 唯一識別碼 */
⋮----
/** 建立時間（ISO 8601） */
⋮----
/** 最後更新時間（ISO 8601） */
⋮----
/** 所屬工作區（專案） */
⋮----
/** 所屬租戶（帳號），用於跨工作區聚合 */
⋮----
/** 建立者摘要 */
⋮----
export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type CreatedBy = z.infer<typeof CreatedBySchema>;
// ── 查詢範圍 ────────────────────────────────────────────────────────────────
/**
 * 支援帳號層級或工作區層級的查詢範圍過濾。
 * workspaceId 為空時，查詢涵蓋該租戶所有工作區。
 */
export interface QueryScope {
  /** 租戶 ID（必填） */
  accountId: string;
  /** 工作區 ID（選填，空則跨工作區聚合） */
  workspaceId?: string;
}
⋮----
/** 租戶 ID（必填） */
⋮----
/** 工作區 ID（選填，空則跨工作區聚合） */
````

## File: modules/shared/index.ts
````typescript
/**
 * modules/shared — 跨模組共用的領域基礎類型。
 */
⋮----
// ── Slug utilities (moved from modules/namespace) ─────────────────────────────
⋮----
// ── Event-store primitives (moved from modules/event) ─────────────────────────
````

## File: modules/shared/infrastructure/InMemoryEventStoreRepository.ts
````typescript
/**
 * modules/shared — infrastructure: InMemoryEventStoreRepository
 * Moved from modules/event/infrastructure/repositories/in-memory-event-store.repository.ts.
 *
 * In-memory adapter for the event store — used in local development and tests.
 */
import { EventRecord, IEventStoreRepository } from '../domain/event-record';
export class InMemoryEventStoreRepository implements IEventStoreRepository {
⋮----
async save(event: EventRecord): Promise<void>
async findById(id: string): Promise<EventRecord | null>
async findByAggregate(aggregateType: string, aggregateId: string): Promise<EventRecord[]>
async findUndispatched(limit: number): Promise<EventRecord[]>
async markDispatched(id: string, dispatchedAt: Date): Promise<void>
````

## File: modules/shared/infrastructure/NoopEventBusRepository.ts
````typescript
/**
 * modules/shared — infrastructure: NoopEventBusRepository
 * Moved from modules/event/infrastructure/repositories/noop-event-bus.repository.ts.
 *
 * No-op event bus adapter used in tests and scaffold before a real transport is wired.
 */
import { EventRecord, IEventBusRepository } from '../domain/event-record';
export class NoopEventBusRepository implements IEventBusRepository {
⋮----
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async publish(_event: EventRecord): Promise<void>
⋮----
// Intentional no-op: replace with a real transport adapter when needed.
````

## File: modules/shared/infrastructure/SimpleEventBus.ts
````typescript
/**
 * modules/shared — infrastructure: SimpleEventBus
 *
 * A minimal in-memory pub/sub bus.  Follows Occam's Razor: the simplest
 * implementation that proves the event-driven flow works end-to-end.
 *
 * Usage:
 *   const bus = new SimpleEventBus();
 *   bus.subscribe("knowledge.block-updated", async (event) => { ... });
 *   await bus.publish(someEvent);
 */
import type { DomainEvent } from "../domain/events";
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;
export class SimpleEventBus {
⋮----
/**
   * Subscribe a handler to events of the given type.
   * Multiple handlers for the same type are all called in registration order.
   */
subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void
/**
   * Publish an event.  All registered handlers for the event's type are
   * invoked sequentially and awaited.
   */
async publish<T extends DomainEvent>(event: T): Promise<void>
/** Remove all subscriptions (useful for test teardown). */
clear(): void
````

## File: modules/source/application/dto/file.dto.ts
````typescript
import type { File } from "../../domain/entities/File";
import type { RagDocumentStatus } from "../../domain/repositories/RagDocumentRepository";
export interface WorkspaceFileListItemDto {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly status: File["status"];
  readonly kind: File["classification"];
  readonly source: string;
  readonly detail: string;
  readonly href?: string;
}
export interface UploadInitFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly idempotencyKey?: string;
}
export interface UploadInitFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly uploadPath: string;
  readonly uploadToken: string;
  readonly expiresAtISO: string;
}
export interface UploadCompleteFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileId: string;
  readonly versionId: string;
}
export interface UploadCompleteFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly status: "active";
  readonly ragDocumentId: string;
  readonly ragDocumentStatus: RagDocumentStatus;
}
export type FileCommandErrorCode =
  | "FILE_WORKSPACE_REQUIRED"
  | "FILE_ORGANIZATION_REQUIRED"
  | "FILE_ACTOR_REQUIRED"
  | "FILE_NAME_REQUIRED"
  | "FILE_ID_REQUIRED"
  | "FILE_VERSION_REQUIRED"
  | "FILE_VERSION_NOT_FOUND"
  | "FILE_INVALID_SIZE"
  | "FILE_NOT_FOUND"
  | "FILE_SCOPE_MISMATCH"
  | "FILE_STATUS_CONFLICT"
  | "FILE_RAG_REGISTRATION_FAILED";
````

## File: modules/source/application/dto/rag-document.dto.ts
````typescript
export interface RegisterUploadedRagDocumentInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
  /** Account ID of the actor who uploaded this document. */
  readonly accountId: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes?: number;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  readonly language?: string;
  readonly accessControl?: readonly string[];
  readonly versionGroupId?: string;
  readonly versionNumber?: number;
  readonly updateLog?: string;
  readonly expiresAtISO?: string;
}
⋮----
/** Account ID of the actor who uploaded this document. */
⋮----
export interface RegisterUploadedRagDocumentOutputDto {
  readonly documentId: string;
  readonly status: "uploaded";
  readonly registeredAtISO: string;
}
export type RegisterUploadedRagDocumentResult =
  | {
      ok: true;
      data: RegisterUploadedRagDocumentOutputDto;
      commandId: string;
    }
  | {
      ok: false;
      error: {
        code:
          | "RAG_ORGANIZATION_REQUIRED"
          | "RAG_WORKSPACE_REQUIRED"
          | "RAG_ACCOUNT_ID_REQUIRED"
          | "RAG_TITLE_REQUIRED"
          | "RAG_FILE_NAME_REQUIRED"
          | "RAG_MIME_TYPE_REQUIRED"
          | "RAG_STORAGE_PATH_REQUIRED";
        message: string;
      };
      commandId: string;
    };
````

## File: modules/source/application/index.ts
````typescript

````

## File: modules/source/application/use-cases/list-workspace-files.use-case.ts
````typescript
import type { FileRepository, ListWorkspaceFilesScope } from "../../domain/repositories/FileRepository";
import type { WorkspaceFileListItemDto } from "../dto/file.dto";
⋮----
export class ListWorkspaceFilesUseCase {
⋮----
constructor(private readonly fileRepository: FileRepository)
async execute(scope: ListWorkspaceFilesScope): Promise<WorkspaceFileListItemDto[]>
````

## File: modules/source/application/use-cases/register-uploaded-rag-document.use-case.ts
````typescript
import { randomUUID } from "node:crypto";
import type { RagDocumentRepository } from "../../domain/repositories/RagDocumentRepository";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentOutputDto,
} from "../dto/rag-document.dto";
type RegisterUploadedRagDocumentUseCaseResult =
  | { ok: true; data: RegisterUploadedRagDocumentOutputDto }
  | {
      ok: false;
      error: {
        code:
          | "RAG_ORGANIZATION_REQUIRED"
          | "RAG_WORKSPACE_REQUIRED"
          | "RAG_ACCOUNT_ID_REQUIRED"
          | "RAG_TITLE_REQUIRED"
          | "RAG_FILE_NAME_REQUIRED"
          | "RAG_MIME_TYPE_REQUIRED"
          | "RAG_STORAGE_PATH_REQUIRED";
        message: string;
      };
    };
export class RegisterUploadedRagDocumentUseCase {
⋮----
constructor(private readonly ragDocumentRepository: RagDocumentRepository)
async execute(
    input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentUseCaseResult>
````

## File: modules/source/application/use-cases/upload-complete-file.use-case.ts
````typescript
import type { File } from "../../domain/entities/File";
import type { FileRepository } from "../../domain/repositories/FileRepository";
import { completeUploadFile } from "../../domain/services/complete-upload-file";
import type { RagDocumentRepository } from "../../domain/repositories/RagDocumentRepository";
import type {
  FileCommandErrorCode,
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
} from "../dto/file.dto";
import { RegisterUploadedRagDocumentUseCase } from "./register-uploaded-rag-document.use-case";
type UploadCompleteFileUseCaseResult =
  | { ok: true; data: UploadCompleteFileOutputDto }
  | { ok: false; error: { code: FileCommandErrorCode; message: string } };
function isFileScopeMatch(input: {
  readonly file: File;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly versionId: string;
}): boolean
function isFileAlreadyCompleted(file: File): boolean
export class UploadCompleteFileUseCase {
⋮----
constructor(
async execute(input: UploadCompleteFileInputDto): Promise<UploadCompleteFileUseCaseResult>
````

## File: modules/source/application/use-cases/upload-init-file.use-case.ts
````typescript
import { randomBytes, randomUUID } from "node:crypto";
import type { File } from "../../domain/entities/File";
import type { FileVersion } from "../../domain/entities/FileVersion";
import type { FileRepository } from "../../domain/repositories/FileRepository";
import type {
  FileCommandErrorCode,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../dto/file.dto";
type UploadInitFileUseCaseResult =
  | { ok: true; data: UploadInitFileOutputDto }
  | { ok: false; error: { code: FileCommandErrorCode; message: string } };
function inferClassification(mimeType: string): File["classification"]
function buildUploadPath(
  organizationId: string,
  workspaceId: string,
  fileId: string,
  fileName: string,
)
export class UploadInitFileUseCase {
⋮----
constructor(private readonly fileRepository: FileRepository)
async execute(input: UploadInitFileInputDto): Promise<UploadInitFileUseCaseResult>
````

## File: modules/source/domain/entities/AuditRecord.ts
````typescript
export type FileAuditAction =
  | "upload_init"
  | "upload_complete"
  | "list_files"
  | "download_url_issued"
  | "archive"
  | "restore";
export interface AuditRecord {
  readonly id: string;
  readonly fileId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly action: FileAuditAction;
  readonly occurredAtISO: string;
  readonly detail?: string;
}
````

## File: modules/source/domain/entities/File.ts
````typescript
export type FileStatus = "active" | "archived" | "deleted";
export interface File {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: "image" | "manifest" | "record" | "other";
  readonly tags: readonly string[];
  readonly currentVersionId: string;
  readonly retentionPolicyId?: string;
  readonly status: FileStatus;
  readonly source?: string;
  readonly detail?: string;
  readonly href?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;
}
⋮----
export function canArchiveFile(file: File): boolean
export function canRestoreFile(file: File): boolean
````

## File: modules/source/domain/entities/FileVersion.ts
````typescript
export type FileVersionStatus = "pending" | "stored" | "active" | "superseded";
export interface FileVersion {
  readonly id: string;
  readonly fileId: string;
  readonly versionNumber: number;
  readonly status: FileVersionStatus;
  readonly storagePath: string;
  readonly checksum?: string;
  readonly createdAtISO: string;
}
export function isVersionImmutable(version: FileVersion): boolean
````

## File: modules/source/domain/entities/PermissionSnapshot.ts
````typescript
export interface PermissionSnapshot {
  readonly actorAccountId: string;
  readonly actorRole: string;
  readonly organizationPolicyVersion: number;
  readonly workspaceGrantVersion: number;
  readonly canRead: boolean;
  readonly canUpload: boolean;
  readonly canDownload: boolean;
  readonly canArchive: boolean;
  readonly canRestore: boolean;
  readonly resolvedAtISO: string;
}
````

## File: modules/source/domain/entities/RetentionPolicy.ts
````typescript
export interface RetentionPolicy {
  readonly id: string;
  readonly organizationId: string;
  readonly retentionDays: number;
  readonly legalHold: boolean;
  readonly purgeMode: "soft-delete" | "hard-delete";
  readonly updatedAtISO: string;
}
````

## File: modules/source/domain/index.ts
````typescript

````

## File: modules/source/domain/ports/ActorContextPort.ts
````typescript
export interface ActorFileContext {
  readonly actorAccountId: string;
  readonly actorRole: string;
  readonly organizationIds: readonly string[];
}
export interface ActorContextPort {
  getActorFileContext(actorAccountId: string): ActorFileContext | null;
}
⋮----
getActorFileContext(actorAccountId: string): ActorFileContext | null;
````

## File: modules/source/domain/ports/OrganizationPolicyPort.ts
````typescript
import type { RetentionPolicy } from "../entities/RetentionPolicy";
export interface OrganizationFilePolicySnapshot {
  readonly organizationId: string;
  readonly policyVersion: number;
  readonly denyRead: boolean;
  readonly denyUpload: boolean;
  readonly denyDownload: boolean;
  readonly denyArchive: boolean;
  readonly denyRestore: boolean;
  readonly retentionPolicy?: RetentionPolicy;
}
export interface OrganizationPolicyPort {
  getOrganizationFilePolicy(organizationId: string): OrganizationFilePolicySnapshot | null;
}
⋮----
getOrganizationFilePolicy(organizationId: string): OrganizationFilePolicySnapshot | null;
````

## File: modules/source/domain/ports/WorkspaceGrantPort.ts
````typescript
export interface WorkspaceGrantSnapshot {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly grantVersion: number;
  readonly canRead: boolean;
  readonly canUpload: boolean;
  readonly canDownload: boolean;
  readonly canArchive: boolean;
  readonly canRestore: boolean;
}
export interface WorkspaceGrantPort {
  getWorkspaceGrantSnapshot(workspaceId: string, actorAccountId: string): WorkspaceGrantSnapshot | null;
}
⋮----
getWorkspaceGrantSnapshot(workspaceId: string, actorAccountId: string): WorkspaceGrantSnapshot | null;
````

## File: modules/source/domain/repositories/FileRepository.ts
````typescript
import type { File } from "../entities/File";
import type { FileVersion } from "../entities/FileVersion";
export interface ListWorkspaceFilesScope {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
}
export interface FileRepository {
  findById(fileId: string): Promise<File | null>;
  findVersion(fileId: string, versionId: string): Promise<FileVersion | null>;
  listByWorkspace(scope: ListWorkspaceFilesScope): Promise<readonly File[]>;
  save(file: File, versions?: readonly FileVersion[]): Promise<void>;
}
⋮----
findById(fileId: string): Promise<File | null>;
findVersion(fileId: string, versionId: string): Promise<FileVersion | null>;
listByWorkspace(scope: ListWorkspaceFilesScope): Promise<readonly File[]>;
save(file: File, versions?: readonly FileVersion[]): Promise<void>;
````

## File: modules/source/domain/repositories/RagDocumentRepository.ts
````typescript
export type RagDocumentStatus = "uploaded" | "processing" | "ready" | "failed" | "archived";
⋮----
export function canTransitionRagDocumentStatus(
  fromStatus: RagDocumentStatus,
  toStatus: RagDocumentStatus,
): boolean
/**
 * RAG document record stored in Firestore at:
 * /knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}
 *
 * Fields align with knowledge.md §2.1 (files collection spec).
 */
export interface RagDocumentRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  /** User-visible file name (preserves original filename semantics). */
  readonly displayName: string;
  /** System / legacy title (same as displayName for initial uploads). */
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  /** Error detail written back when status is "failed". */
  readonly statusMessage?: string;
  readonly checksum?: string;
  /** Semantic document taxonomy / category hierarchy (e.g. "規章制度"). */
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  /** Primary language of the document content (ISO 639-1, e.g. "zh-TW"). */
  readonly language?: string;
  /** Allowed OrganizationRole values or accountId allowlist for RBAC. */
  readonly accessControl?: readonly string[];
  /**
   * Version group identifier — all versions of the same logical document share
   * this ID.  Defaults to the document's own id for the first upload.
   */
  readonly versionGroupId: string;
  /** 1-based version counter within the versionGroupId. */
  readonly versionNumber: number;
  /** True when this record is the current canonical version for its group. */
  readonly isLatest: boolean;
  /** Free-text description of what changed in this version. */
  readonly updateLog?: string;
  /** Account ID of the person who uploaded this document. */
  readonly accountId: string;
  /** Total chunk count — written back by the ingestion worker after processing. */
  readonly chunkCount?: number;
  /** ISO-8601 timestamp set by the ingestion worker when indexing completes. */
  readonly indexedAtISO?: string;
  /** ISO-8601 expiry timestamp; the document is auto-archived when reached. */
  readonly expiresAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/** User-visible file name (preserves original filename semantics). */
⋮----
/** System / legacy title (same as displayName for initial uploads). */
⋮----
/** Error detail written back when status is "failed". */
⋮----
/** Semantic document taxonomy / category hierarchy (e.g. "規章制度"). */
⋮----
/** Primary language of the document content (ISO 639-1, e.g. "zh-TW"). */
⋮----
/** Allowed OrganizationRole values or accountId allowlist for RBAC. */
⋮----
/**
   * Version group identifier — all versions of the same logical document share
   * this ID.  Defaults to the document's own id for the first upload.
   */
⋮----
/** 1-based version counter within the versionGroupId. */
⋮----
/** True when this record is the current canonical version for its group. */
⋮----
/** Free-text description of what changed in this version. */
⋮----
/** Account ID of the person who uploaded this document. */
⋮----
/** Total chunk count — written back by the ingestion worker after processing. */
⋮----
/** ISO-8601 timestamp set by the ingestion worker when indexing completes. */
⋮----
/** ISO-8601 expiry timestamp; the document is auto-archived when reached. */
⋮----
export interface RagDocumentRepository {
  findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null>;
  findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]>;
  saveUploaded(record: RagDocumentRecord): Promise<void>;
}
⋮----
findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null>;
findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]>;
saveUploaded(record: RagDocumentRecord): Promise<void>;
````

## File: modules/source/domain/repositories/WikiLibraryRepository.ts
````typescript
/**
 * Module: source
 * Layer: domain/repositories
 * Purpose: Repository port for the Wiki library entity.
 */
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../entities/wiki-library.types";
export interface WikiLibraryRepository {
  listByAccountId(accountId: string): Promise<WikiLibrary[]>;
  findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>;
  create(library: WikiLibrary): Promise<void>;
  createField(accountId: string, field: WikiLibraryField): Promise<void>;
  listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>;
  createRow(accountId: string, row: WikiLibraryRow): Promise<void>;
  listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>;
}
⋮----
listByAccountId(accountId: string): Promise<WikiLibrary[]>;
findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>;
create(library: WikiLibrary): Promise<void>;
createField(accountId: string, field: WikiLibraryField): Promise<void>;
listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>;
createRow(accountId: string, row: WikiLibraryRow): Promise<void>;
listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>;
````

## File: modules/source/domain/services/complete-upload-file.ts
````typescript
import type { File } from "../entities/File";
interface CompleteUploadFileInput {
  readonly file: File;
  readonly completedAtISO: string;
}
export function completeUploadFile(input: CompleteUploadFileInput): File
````

## File: modules/source/domain/services/resolve-file-organization-id.ts
````typescript
export function resolveFileOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string
````

## File: modules/source/index.ts
````typescript

````

## File: modules/source/infrastructure/firebase/FirebaseFileRepository.ts
````typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { File } from "../../domain/entities/File";
import type { FileVersion } from "../../domain/entities/FileVersion";
import type { FileRepository, ListWorkspaceFilesScope } from "../../domain/repositories/FileRepository";
⋮----
interface FirestoreFileDocument {
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly accountId?: string;
  readonly name?: string;
  readonly mimeType?: string;
  readonly sizeBytes?: number;
  readonly classification?: File["classification"];
  readonly tags?: readonly string[];
  readonly currentVersionId?: string;
  readonly retentionPolicyId?: string;
  readonly status?: File["status"];
  readonly source?: string;
  readonly detail?: string;
  readonly href?: string;
  readonly createdAtISO?: string;
  readonly updatedAtISO?: string;
  readonly deletedAtISO?: string;
}
interface FirestoreFileVersionDocument {
  readonly fileId?: string;
  readonly versionNumber?: number;
  readonly status?: FileVersion["status"];
  readonly storagePath?: string;
  readonly checksum?: string;
  readonly createdAtISO?: string;
}
function isFileStatus(value: unknown): value is File["status"]
function isFileClassification(value: unknown): value is File["classification"]
function toStringArray(value: unknown): readonly string[]
function toFileEntity(fileId: string, data: FirestoreFileDocument): File
function isFileVersionStatus(value: unknown): value is FileVersion["status"]
function toFileVersionEntity(versionId: string, data: FirestoreFileVersionDocument): FileVersion
export class FirebaseFileRepository implements FileRepository {
⋮----
private get collectionRef()
async findById(fileId: string): Promise<File | null>
async findVersion(fileId: string, versionId: string): Promise<FileVersion | null>
async listByWorkspace(scope: ListWorkspaceFilesScope): Promise<readonly File[]>
async save(file: File, versions: readonly FileVersion[] = []): Promise<void>
````

## File: modules/source/infrastructure/firebase/FirebaseRagDocumentRepository.ts
````typescript
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type {
  RagDocumentRecord,
  RagDocumentRepository,
} from "../../domain/repositories/RagDocumentRepository";
function buildKnowledgeDocumentRef(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly documentId: string;
})
function buildKnowledgeDocumentsCollection(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
})
function toStringArray(value: unknown): readonly string[]
function toRagDocumentRecord(
  documentId: string,
  data: Record<string, unknown>,
  fallbackScope: { organizationId: string; workspaceId: string },
): RagDocumentRecord
export class FirebaseRagDocumentRepository implements RagDocumentRepository {
⋮----
async findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
}): Promise<RagDocumentRecord | null>
async findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
}): Promise<readonly RagDocumentRecord[]>
async saveUploaded(record: RagDocumentRecord): Promise<void>
⋮----
// Duplicate the document id in the payload so collection-group consumers can project
// a stable field without depending on Firestore snapshot metadata.
````

## File: modules/source/infrastructure/index.ts
````typescript

````

## File: modules/source/infrastructure/repositories/in-memory-wiki-library.repository.ts
````typescript
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../../domain/entities/wiki-library.types";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";
function sortByDateDesc<T extends
export class InMemoryWikiLibraryRepository implements WikiLibraryRepository {
⋮----
async listByAccountId(accountId: string): Promise<WikiLibrary[]>
async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>
async create(library: WikiLibrary): Promise<void>
async createField(accountId: string, field: WikiLibraryField): Promise<void>
async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>
async createRow(accountId: string, row: WikiLibraryRow): Promise<void>
async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>
private getOrCreateLibraries(accountId: string): Map<string, WikiLibrary>
private getOrCreate<T>(bucket: Map<string, Map<string, T>>, key: string): Map<string, T>
private fieldsKey(accountId: string, libraryId: string): string
private rowsKey(accountId: string, libraryId: string): string
````

## File: modules/source/interfaces/_actions/file.actions.ts
````typescript
import type {
  UploadCompleteFileInputDto,
  UploadCompleteFileOutputDto,
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../application/dto/file.dto";
import type {
  RegisterUploadedRagDocumentInputDto,
  RegisterUploadedRagDocumentResult,
} from "../../application/dto/rag-document.dto";
import { RegisterUploadedRagDocumentUseCase } from "../../application/use-cases/register-uploaded-rag-document.use-case";
import { UploadCompleteFileUseCase } from "../../application/use-cases/upload-complete-file.use-case";
import { UploadInitFileUseCase } from "../../application/use-cases/upload-init-file.use-case";
import { FirebaseFileRepository } from "../../infrastructure/firebase/FirebaseFileRepository";
import { FirebaseRagDocumentRepository } from "../../infrastructure/firebase/FirebaseRagDocumentRepository";
import { KnowledgeIngestionApi } from "@/modules/ai/api";
import type { FileCommandResult } from "../contracts/file-command-result";
⋮----
function createCommandId(idempotencyKey?: string)
export async function uploadInitFile(
  input: UploadInitFileInputDto,
): Promise<FileCommandResult<UploadInitFileOutputDto>>
export async function uploadCompleteFile(
  input: UploadCompleteFileInputDto,
): Promise<FileCommandResult<UploadCompleteFileOutputDto>>
⋮----
// Best-effort handoff: upload completion can proceed even if ingestion registration fails.
⋮----
export async function registerUploadedRagDocument(
  input: RegisterUploadedRagDocumentInputDto,
): Promise<RegisterUploadedRagDocumentResult>
````

## File: modules/source/interfaces/components/LibrariesView.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  addWikiLibraryField,
  createWikiLibrary,
  createWikiLibraryRow,
  getWikiLibrarySnapshot,
  listWikiLibraries,
  type WikiLibrary,
  type WikiLibraryFieldType,
  type WikiLibraryRow,
} from "../../api";
interface WikiLibrariesViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}
⋮----
function isRecord(value: unknown): value is Record<string, unknown>
function parseFieldType(value: string): WikiLibraryFieldType
⋮----
onChange=
````

## File: modules/source/interfaces/components/LibraryTableView.tsx
````typescript
import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@lib-tanstack";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@lib-dragdrop";
import {
  getWikiLibrarySnapshot,
  listWikiLibraries,
  type WikiLibraryRow,
} from "../../api";
interface LibraryTableViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}
type RowData = WikiLibraryRow & { _values: Record<string, unknown> };
⋮----
/**
 * WikiLibraryTableView
 *
 * TanStack Table rendering library rows with:
 * - Column-level text filter (global filter input)
 * - Drag-to-reorder rows via pragmatic-drag-and-drop
 */
⋮----
// Load library list
⋮----
// Load rows when selection changes
⋮----
// DnD row reorder
⋮----
onDrop(
````

## File: modules/source/interfaces/components/WorkspaceFilesTab.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { getWorkspaceFiles } from "../queries/file.queries";
import { resolveFileOrganizationId } from "../../domain/services/resolve-file-organization-id";
import { uploadCompleteFile, uploadInitFile } from "../_actions/file.actions";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { getFirebaseStorage } from "@integration-firebase";
interface WorkspaceFilesTabProps {
  readonly workspace: WorkspaceEntity;
}
⋮----
async function loadFiles()
⋮----
async function handleUploadFile(file: File)
````

## File: modules/source/interfaces/contracts/file-command-result.ts
````typescript
import type { FileCommandErrorCode } from "../../application/dto/file.dto";
export type FileCommandResult<TData> =
  | {
      ok: true;
      data: TData;
      commandId: string;
    }
  | {
      ok: false;
      error: {
        code: FileCommandErrorCode;
        message: string;
      };
      commandId: string;
    };
````

## File: modules/source/interfaces/index.ts
````typescript

````

## File: modules/source/interfaces/queries/file.queries.ts
````typescript
import type { WorkspaceEntity } from "@/modules/workspace/api";
import { resolveFileOrganizationId } from "../../domain/services/resolve-file-organization-id";
import type { WorkspaceFileListItemDto } from "../../application/dto/file.dto";
import { ListWorkspaceFilesUseCase } from "../../application/use-cases/list-workspace-files.use-case";
import { FirebaseFileRepository } from "../../infrastructure/firebase/FirebaseFileRepository";
import { FirebaseRagDocumentRepository } from "../../infrastructure/firebase/FirebaseRagDocumentRepository";
import type { RagDocumentRecord } from "../../domain/repositories/RagDocumentRepository";
export async function getWorkspaceFiles(workspace: WorkspaceEntity): Promise<WorkspaceFileListItemDto[]>
export async function getWorkspaceRagDocuments(
  workspace: WorkspaceEntity,
): Promise<readonly RagDocumentRecord[]>
````

## File: modules/workspace-audit/api/index.ts
````typescript
/**
 * Module: workspace-audit
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Audit domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */
// ─── Core entity types ────────────────────────────────────────────────────────
⋮----
// ─── Query functions ──────────────────────────────────────────────────────────
````

## File: modules/workspace-audit/application/.gitkeep
````

````

## File: modules/workspace-audit/application/use-cases/audit.use-cases.ts
````typescript
import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";
export class ListWorkspaceAuditLogsUseCase {
⋮----
constructor(private readonly auditRepo: AuditRepository)
execute(workspaceId: string): Promise<AuditLogEntity[]>
⋮----
export class ListOrganizationAuditLogsUseCase {
⋮----
execute(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]>
````

## File: modules/workspace-audit/domain/.gitkeep
````

````

## File: modules/workspace-audit/domain/entities/AuditLog.ts
````typescript
export type AuditLogSource = "workspace" | "finance" | "notification" | "system";
export interface AuditLogEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: string;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly occurredAtISO: string;
}
````

## File: modules/workspace-audit/domain/repositories/AuditRepository.ts
````typescript
import type { AuditLogEntity } from "../entities/AuditLog";
export interface AuditRepository {
  findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>;
  findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]>;
}
⋮----
findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>;
findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]>;
````

## File: modules/workspace-audit/domain/schema.ts
````typescript
/**
 * Audit 模組領域 Schema — 不可變事件流（Immutable Event Stream）。
 * 遵循奧卡姆剃刀：稽核日誌只需記錄「誰、何時、做了什麼」。
 */
import { z } from "@lib-zod";
import { BaseEntitySchema } from "../../shared/domain/types";
// ── 操作類型 ────────────────────────────────────────────────────────────────
/**
 * 稽核操作類型：
 * - create（建立）：新增資源
 * - update（更新）：修改資源內容
 * - delete（刪除）：移除資源
 * - login（登入）：使用者登入事件
 * - export（匯出）：資料匯出操作
 */
⋮----
export type AuditAction = (typeof AUDIT_ACTIONS)[number];
// ── 嚴重程度 ────────────────────────────────────────────────────────────────
/**
 * 事件嚴重程度：
 * - low（低）：一般日常操作
 * - medium（中）：需留意的操作
 * - high（高）：敏感操作，需主管審閱
 * - critical（嚴重）：高風險操作，需即時關注
 */
⋮----
export type AuditSeverity = (typeof AUDIT_SEVERITIES)[number];
// ── 欄位變更紀錄 ──────────────────────────────────────────────────────────
⋮----
/** 被修改的欄位名稱 */
⋮----
/** 修改前的值 */
⋮----
/** 修改後的值 */
⋮----
export type ChangeRecord = z.infer<typeof ChangeRecordSchema>;
// ── 主要 Schema ────────────────────────────────────────────────────────────
/**
 * 稽核日誌 Schema — 不可變的操作事件紀錄。
 * 繼承 BaseEntitySchema 取得租戶隔離與操作者資訊。
 */
⋮----
/** 操作類型 */
⋮----
/** 被操作資源的類型，例如 'contract'、'daily_post'、'user_settings' */
⋮----
/** 被操作資源的唯一識別碼 */
⋮----
/** 事件嚴重程度 */
⋮----
/** 欄位變更明細（選填，僅 update 操作有意義） */
⋮----
export type AuditLog = z.infer<typeof AuditLogSchema>;
````

## File: modules/workspace-audit/index.ts
````typescript
// ── 新增：精簡領域 Schema 與稽核時間軸元件（interfaces 層） ─────────────────
````

## File: modules/workspace-audit/infrastructure/.gitkeep
````

````

## File: modules/workspace-audit/infrastructure/firebase/FirebaseAuditRepository.ts
````typescript
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AuditLogEntity, AuditLogSource } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";
⋮----
function toAuditLogEntity(id: string, data: Record<string, unknown>): AuditLogEntity
export class FirebaseAuditRepository implements AuditRepository {
⋮----
private get db()
async findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>
async findByWorkspaceIds(
    workspaceIds: string[],
    maxCount = 200,
): Promise<AuditLogEntity[]>
````

## File: modules/workspace-audit/interfaces/.gitkeep
````

````

## File: modules/workspace-audit/interfaces/components/AuditStream.tsx
````typescript
/**
 * AuditStream — 高密度稽核事件時間軸。
 * 接受現有 AuditLogEntity 陣列，在 interfaces 層進行視圖映射後渲染。
 */
import { format } from "date-fns";
import { zhTW } from "date-fns/locale/zh-TW";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { ScrollArea } from "@ui-shadcn/ui/scroll-area";
import type { AuditLogEntity, AuditLogSource } from "../../domain/entities/AuditLog";
import type { AuditSeverity } from "../../domain/schema";
// ── AuditLogEntity → 視圖物件（interfaces 層視圖映射） ───────────────────
interface AuditStreamItem {
  id: string;
  actorName: string;
  action: string;
  resourceType: string;
  detail: string;
  severity: AuditSeverity;
  workspaceId: string;
  occurredAtISO: string;
}
⋮----
function toStreamItem(entity: AuditLogEntity): AuditStreamItem
// ── 嚴重程度視覺樣式 ──────────────────────────────────────────────────────
⋮----
// ── 單筆事件列 ─────────────────────────────────────────────────────────────
interface AuditRowProps {
  item: AuditStreamItem;
}
⋮----
{/* 時間軸節點 */}
⋮----
{/* 操作摘要 */}
⋮----
{/* 嚴重程度 + 工作區來源 */}
⋮----
// ── 主要元件 ────────────────────────────────────────────────────────────────
⋮----
/** 稽核日誌清單（AuditLogEntity 陣列，由頁面傳入） */
⋮----
/** ScrollArea 高度，預設 500px */
⋮----
{/* 時間軸容器 */}
````

## File: modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx
````typescript
import { useEffect, useState } from "react";
import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Badge } from "@ui-shadcn/ui/badge";
import { getWorkspaceAuditLogs } from "../queries/audit.queries";
function formatAuditDate(value: string)
interface WorkspaceAuditTabProps {
  readonly workspaceId: string;
}
⋮----
async function loadLogs()
````

## File: modules/workspace-audit/interfaces/queries/audit.queries.ts
````typescript
import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import {
  ListOrganizationAuditLogsUseCase,
  ListWorkspaceAuditLogsUseCase,
} from "../../application/use-cases/audit.use-cases";
import { FirebaseAuditRepository } from "../../infrastructure/firebase/FirebaseAuditRepository";
⋮----
export async function getWorkspaceAuditLogs(
  workspaceId: string,
): Promise<AuditLogEntity[]>
export async function getOrganizationAuditLogs(
  workspaceIds: string[],
  maxCount = 200,
): Promise<AuditLogEntity[]>
````

## File: modules/workspace-audit/ports/.gitkeep
````

````

## File: modules/workspace-feed/api/index.ts
````typescript
// ── UI components (cross-module public) ──────────────────────────────────────
````

## File: modules/workspace-feed/api/workspace-feed.facade.ts
````typescript
import type { WorkspaceFeedPost } from "../domain/entities/workspace-feed-post.entity";
import type {
  WorkspaceFeedInteractionRepository,
  WorkspaceFeedPostRepository,
} from "../domain/repositories/workspace-feed.repositories";
import {
  BookmarkWorkspaceFeedPostUseCase,
  CreateWorkspaceFeedPostUseCase,
  GetWorkspaceFeedPostUseCase,
  LikeWorkspaceFeedPostUseCase,
  ListAccountWorkspaceFeedUseCase,
  ListWorkspaceFeedUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
} from "../application/use-cases/workspace-feed.use-cases";
import {
  FirebaseWorkspaceFeedInteractionRepository,
  FirebaseWorkspaceFeedPostRepository,
} from "../infrastructure";
export interface CreateWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  content: string;
}
export interface ReplyWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  parentPostId: string;
  authorAccountId: string;
  content: string;
}
export interface RepostWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  sourcePostId: string;
  actorAccountId: string;
  comment?: string;
}
export interface WorkspaceFeedInteractionParams {
  accountId: string;
  postId: string;
  actorAccountId: string;
}
export class WorkspaceFeedFacade {
⋮----
constructor(
    postRepo: WorkspaceFeedPostRepository = new FirebaseWorkspaceFeedPostRepository(),
    interactionRepo: WorkspaceFeedInteractionRepository = new FirebaseWorkspaceFeedInteractionRepository(),
)
async createPost(params: CreateWorkspaceFeedPostParams): Promise<string | null>
async reply(params: ReplyWorkspaceFeedPostParams): Promise<string | null>
async repost(params: RepostWorkspaceFeedPostParams): Promise<string | null>
async like(params: WorkspaceFeedInteractionParams): Promise<boolean>
async view(params: WorkspaceFeedInteractionParams): Promise<boolean>
async bookmark(params: WorkspaceFeedInteractionParams): Promise<boolean>
async share(params: WorkspaceFeedInteractionParams): Promise<boolean>
async getPost(accountId: string, postId: string): Promise<WorkspaceFeedPost | null>
async getWorkspaceFeed(
    accountId: string,
    workspaceId: string,
    maxRows = 50,
): Promise<WorkspaceFeedPost[]>
async getAccountFeed(accountId: string, maxRows = 50): Promise<WorkspaceFeedPost[]>
````

## File: modules/workspace-feed/application/dto/workspace-feed.dto.ts
````typescript
import { z } from "@lib-zod";
⋮----
export type CreateWorkspaceFeedPostDto = z.infer<typeof CreateWorkspaceFeedPostSchema>;
⋮----
export type ReplyWorkspaceFeedPostDto = z.infer<typeof ReplyWorkspaceFeedPostSchema>;
⋮----
export type RepostWorkspaceFeedPostDto = z.infer<typeof RepostWorkspaceFeedPostSchema>;
⋮----
export type FeedInteractionDto = z.infer<typeof FeedInteractionSchema>;
⋮----
export type ListWorkspaceFeedDto = z.infer<typeof ListWorkspaceFeedSchema>;
⋮----
export type ListAccountFeedDto = z.infer<typeof ListAccountFeedSchema>;
````

## File: modules/workspace-feed/application/use-cases/workspace-feed.use-cases.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
import type {
  WorkspaceFeedInteractionRepository,
  WorkspaceFeedPostRepository,
} from "../../domain/repositories/workspace-feed.repositories";
import {
  CreateWorkspaceFeedPostSchema,
  type CreateWorkspaceFeedPostDto,
  FeedInteractionSchema,
  ListAccountFeedSchema,
  type ListAccountFeedDto,
  ListWorkspaceFeedSchema,
  type ListWorkspaceFeedDto,
  ReplyWorkspaceFeedPostSchema,
  type ReplyWorkspaceFeedPostDto,
  RepostWorkspaceFeedPostSchema,
  type RepostWorkspaceFeedPostDto,
} from "../dto/workspace-feed.dto";
export class CreateWorkspaceFeedPostUseCase {
⋮----
constructor(private readonly repo: WorkspaceFeedPostRepository)
async execute(input: CreateWorkspaceFeedPostDto): Promise<CommandResult>
⋮----
export class ReplyWorkspaceFeedPostUseCase {
⋮----
async execute(input: ReplyWorkspaceFeedPostDto): Promise<CommandResult>
⋮----
export class RepostWorkspaceFeedPostUseCase {
⋮----
async execute(input: RepostWorkspaceFeedPostDto): Promise<CommandResult>
⋮----
export class LikeWorkspaceFeedPostUseCase {
⋮----
constructor(
async execute(input:
⋮----
export class BookmarkWorkspaceFeedPostUseCase {
export class ViewWorkspaceFeedPostUseCase {
export class ShareWorkspaceFeedPostUseCase {
export class GetWorkspaceFeedPostUseCase {
⋮----
async execute(accountId: string, postId: string): Promise<WorkspaceFeedPost | null>
⋮----
export class ListWorkspaceFeedUseCase {
⋮----
async execute(input: ListWorkspaceFeedDto): Promise<WorkspaceFeedPost[]>
⋮----
export class ListAccountWorkspaceFeedUseCase {
⋮----
async execute(input: ListAccountFeedDto): Promise<WorkspaceFeedPost[]>
````

## File: modules/workspace-feed/domain/entities/workspace-feed-post.entity.ts
````typescript
export type WorkspaceFeedPostType = (typeof WORKSPACE_FEED_POST_TYPES)[number];
export interface WorkspaceFeedPost {
  id: string;
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  type: WorkspaceFeedPostType;
  content: string;
  replyToPostId: string | null;
  repostOfPostId: string | null;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  viewCount: number;
  bookmarkCount: number;
  shareCount: number;
  createdAtISO: string;
  updatedAtISO: string;
}
export interface CreateWorkspaceFeedPostInput {
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  content: string;
}
export interface CreateWorkspaceFeedReplyInput {
  accountId: string;
  workspaceId: string;
  parentPostId: string;
  authorAccountId: string;
  content: string;
}
export interface CreateWorkspaceFeedRepostInput {
  accountId: string;
  workspaceId: string;
  sourcePostId: string;
  actorAccountId: string;
  comment?: string;
}
export interface WorkspaceFeedCounterPatch {
  likeDelta?: number;
  replyDelta?: number;
  repostDelta?: number;
  viewDelta?: number;
  bookmarkDelta?: number;
  shareDelta?: number;
}
````

## File: modules/workspace-feed/domain/events/workspace-feed.events.ts
````typescript
export type WorkspaceFeedEventType = (typeof WORKSPACE_FEED_EVENT_TYPES)[number];
interface WorkspaceFeedBaseEvent {
  type: WorkspaceFeedEventType;
  accountId: string;
  workspaceId: string;
  postId: string;
  actorAccountId: string;
  occurredAtISO: string;
}
export interface WorkspaceFeedPostCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostCreated";
}
export interface WorkspaceFeedReplyCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedReplyCreated";
  parentPostId: string;
}
export interface WorkspaceFeedRepostCreatedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedRepostCreated";
  sourcePostId: string;
}
export interface WorkspaceFeedPostLikedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostLiked";
}
export interface WorkspaceFeedPostViewedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostViewed";
}
export interface WorkspaceFeedPostBookmarkedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostBookmarked";
}
export interface WorkspaceFeedPostSharedEvent extends WorkspaceFeedBaseEvent {
  type: "WorkspaceFeedPostShared";
}
export type WorkspaceFeedDomainEvent =
  | WorkspaceFeedPostCreatedEvent
  | WorkspaceFeedReplyCreatedEvent
  | WorkspaceFeedRepostCreatedEvent
  | WorkspaceFeedPostLikedEvent
  | WorkspaceFeedPostViewedEvent
  | WorkspaceFeedPostBookmarkedEvent
  | WorkspaceFeedPostSharedEvent;
````

## File: modules/workspace-feed/domain/index.ts
````typescript

````

## File: modules/workspace-feed/domain/repositories/workspace-feed.repositories.ts
````typescript
import type {
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
  WorkspaceFeedPost,
} from "../entities/workspace-feed-post.entity";
export interface WorkspaceFeedPostRepository {
  createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost>;
  createReply(input: CreateWorkspaceFeedReplyInput): Promise<WorkspaceFeedPost>;
  createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null>;
  patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void>;
  findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null>;
  listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<WorkspaceFeedPost[]>;
  listByAccountId(accountId: string, limit: number): Promise<WorkspaceFeedPost[]>;
}
⋮----
createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost>;
createReply(input: CreateWorkspaceFeedReplyInput): Promise<WorkspaceFeedPost>;
createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null>;
patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void>;
findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null>;
listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<WorkspaceFeedPost[]>;
listByAccountId(accountId: string, limit: number): Promise<WorkspaceFeedPost[]>;
⋮----
export interface WorkspaceFeedInteractionRepository {
  like(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
  bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
  view(accountId: string, postId: string, actorAccountId: string): Promise<void>;
  share(accountId: string, postId: string, actorAccountId: string): Promise<void>;
}
⋮----
like(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean>;
view(accountId: string, postId: string, actorAccountId: string): Promise<void>;
share(accountId: string, postId: string, actorAccountId: string): Promise<void>;
````

## File: modules/workspace-feed/index.ts
````typescript
/**
 * Module: workspace-feed
 * Layer: module/barrel (public API)
 *
 * Domain isolation rule:
 * - Cross-module callers must use `workspaceFeedFacade`.
 * - Internal layers remain private to this module.
 */
⋮----
// Read model exposed for API consumers.
````

## File: modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts
````typescript
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { WorkspaceFeedInteractionRepository } from "../../domain/repositories/workspace-feed.repositories";
type FirestoreDb = ReturnType<typeof getFirestore>;
function postDoc(db: FirestoreDb, accountId: string, postId: string)
function likesDoc(db: FirestoreDb, accountId: string, postId: string, actorAccountId: string)
function bookmarksDoc(db: FirestoreDb, accountId: string, postId: string, actorAccountId: string)
function viewsCol(db: FirestoreDb, accountId: string, postId: string)
function sharesCol(db: FirestoreDb, accountId: string, postId: string)
export class FirebaseWorkspaceFeedInteractionRepository implements WorkspaceFeedInteractionRepository {
⋮----
private get db()
async like(accountId: string, postId: string, actorAccountId: string): Promise<boolean>
async bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean>
async view(accountId: string, postId: string, actorAccountId: string): Promise<void>
async share(accountId: string, postId: string, actorAccountId: string): Promise<void>
````

## File: modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts
````typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type {
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
  WorkspaceFeedPost,
} from "../../domain/entities/workspace-feed-post.entity";
import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";
type FirestoreDb = ReturnType<typeof getFirestore>;
function postsCol(db: FirestoreDb, accountId: string)
function postDoc(db: FirestoreDb, accountId: string, postId: string)
function repostMapDoc(db: FirestoreDb, accountId: string, actorAccountId: string, sourcePostId: string)
function asString(value: unknown, fallback = ""): string
function asNumber(value: unknown): number
function toWorkspaceFeedPost(id: string, data: Record<string, unknown>): WorkspaceFeedPost
function createBasePostData(
  accountId: string,
  workspaceId: string,
  authorAccountId: string,
  content: string,
  type: "post" | "reply" | "repost",
): Record<string, unknown>
export class FirebaseWorkspaceFeedPostRepository implements WorkspaceFeedPostRepository {
⋮----
private get db()
async createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost>
async createReply(input: CreateWorkspaceFeedReplyInput): Promise<WorkspaceFeedPost>
async createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null>
async patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void>
async findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null>
async listByWorkspaceId(accountId: string, workspaceId: string, maxRows: number): Promise<WorkspaceFeedPost[]>
async listByAccountId(accountId: string, maxRows: number): Promise<WorkspaceFeedPost[]>
````

## File: modules/workspace-feed/infrastructure/index.ts
````typescript

````

## File: modules/workspace-feed/interfaces/_actions/workspace-feed.actions.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";
import type {
  CreateWorkspaceFeedPostDto,
  FeedInteractionDto,
  ReplyWorkspaceFeedPostDto,
  RepostWorkspaceFeedPostDto,
} from "../../application/dto/workspace-feed.dto";
import {
  BookmarkWorkspaceFeedPostUseCase,
  CreateWorkspaceFeedPostUseCase,
  LikeWorkspaceFeedPostUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
} from "../../application/use-cases/workspace-feed.use-cases";
import {
  FirebaseWorkspaceFeedInteractionRepository,
  FirebaseWorkspaceFeedPostRepository,
} from "../../infrastructure";
function makePostRepo()
function makeInteractionRepo()
export async function createWorkspaceFeedPost(input: CreateWorkspaceFeedPostDto): Promise<CommandResult>
export async function replyWorkspaceFeedPost(input: ReplyWorkspaceFeedPostDto): Promise<CommandResult>
export async function repostWorkspaceFeedPost(input: RepostWorkspaceFeedPostDto): Promise<CommandResult>
export async function likeWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult>
export async function viewWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult>
export async function bookmarkWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult>
export async function shareWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult>
````

## File: modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx
````typescript
import { useCallback, useEffect, useState } from "react";
import { Eye, Heart, MessageCircle, Repeat2, Share2, Star } from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { workspaceFeedFacade } from "../../api/workspace-feed.facade";
import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
interface WorkspaceFeedAccountViewProps {
  readonly accountId: string;
}
⋮----
async function handleAction(post: WorkspaceFeedPost, action: "like" | "view" | "bookmark" | "share" | "repost")
async function handleReply(post: WorkspaceFeedPost)
⋮----
onClick=
````

## File: modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Heart, MessageCircle, Repeat2, Send, Share2, Star } from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@ui-shadcn/ui/avatar";
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { workspaceFeedFacade } from "../../api/workspace-feed.facade";
import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
interface WorkspaceFeedWorkspaceViewProps {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly workspaceName: string;
}
export function WorkspaceFeedWorkspaceView({
  accountId,
  workspaceId,
  workspaceName,
}: WorkspaceFeedWorkspaceViewProps)
⋮----
async function handlePublish()
async function handleAction(postId: string, action: "like" | "view" | "bookmark" | "share" | "repost")
async function handleReply(postId: string)
⋮----
onChange=
⋮----
onClick=
````

## File: modules/workspace-feed/interfaces/index.ts
````typescript

````

## File: modules/workspace-feed/interfaces/queries/workspace-feed.queries.ts
````typescript
import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
import {
  GetWorkspaceFeedPostUseCase,
  ListAccountWorkspaceFeedUseCase,
  ListWorkspaceFeedUseCase,
} from "../../application/use-cases/workspace-feed.use-cases";
import { FirebaseWorkspaceFeedPostRepository } from "../../infrastructure";
export async function getWorkspaceFeedPost(
  accountId: string,
  postId: string,
): Promise<WorkspaceFeedPost | null>
export async function getWorkspaceFeed(
  accountId: string,
  workspaceId: string,
  limit = 50,
): Promise<WorkspaceFeedPost[]>
export async function getAccountWorkspaceFeed(accountId: string, limit = 50): Promise<WorkspaceFeedPost[]>
````

## File: modules/workspace-flow/api/contracts.ts
````typescript
/**
 * @module workspace-flow/api
 * @file contracts.ts
 * @description Public contracts exposed through the workspace-flow module boundary.
 *
 * All types, DTOs, and projection helpers that external consumers need are
 * re-exported from this single file.  XState internals (canTransition*, nextStatus,
 * isTerminal*) are intentionally NOT exposed here — status machines are internal.
 *
 * @author workspace-flow
 * @created 2026-03-24
 */
// ── Entity types ──────────────────────────────────────────────────────────────
⋮----
// ── Value objects (enum / list only — no transition helpers) ──────────────────
⋮----
// ── Source reference (content → workspace-flow provenance) ────────────────────
⋮----
// ── Summary projections ───────────────────────────────────────────────────────
⋮----
// ── CRUD / command DTOs ───────────────────────────────────────────────────────
⋮----
// ── Query / pagination DTOs ───────────────────────────────────────────────────
⋮----
// ── Command / operation result ────────────────────────────────────────────────
````

## File: modules/workspace-flow/api/index.ts
````typescript
/**
 * @module workspace-flow/api
 * @file index.ts
 * @description Public cross-module boundary for workspace-flow.
 *
 * External consumers MUST import only from this path:
 *   @/modules/workspace-flow/api
 *
 * Never import from domain/, application/, infrastructure/, or interfaces/ directly.
 * @author workspace-flow
 * @created 2026-03-24
 */
// ── Facade (write + summary-read surface) ────────────────────────────────────
⋮----
// ── Public contracts ──────────────────────────────────────────────────────────
⋮----
// Entities
⋮----
// Value objects
⋮----
// Summary projections
⋮----
// CRUD / command DTOs
⋮----
// Query / pagination DTOs
⋮----
// Command result
⋮----
// Value object lists (enum arrays)
⋮----
// Summary projection helpers
⋮----
// ── Read queries (server-side) ────────────────────────────────────────────────
⋮----
// ── UI components ─────────────────────────────────────────────────────────────
⋮----
// ── Event listeners (content → workspace-flow integration) ───────────────────
````

## File: modules/workspace-flow/api/listeners.ts
````typescript
/**
 * @module workspace-flow/api
 * @file listeners.ts
 * @description Public event listener interface for workspace-flow.
 *
 * External modules (primarily the `content` module's event bus) subscribe to
 * workspace-flow through this surface.  The concrete implementation is the
 * `ContentToWorkflowMaterializer` process manager.
 *
 * ## Usage
 * ```ts
 * import { createContentToWorkflowListener } from "@/modules/workspace-flow/api";
 *
 * const listener = createContentToWorkflowListener(workspaceId);
 * eventBus.subscribe("knowledge.page_approved", (event) => listener.handle(event));
 * ```
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-content-to-workflow-boundary.md
 */
import { ContentToWorkflowMaterializer } from "../application/process-managers/content-to-workflow-materializer";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import type { KnowledgePageApprovedEvent } from "@/modules/knowledge/api/events";
// ── Public listener factory ───────────────────────────────────────────────────
/**
 * Creates a pre-wired `ContentToWorkflowMaterializer` backed by Firebase repos.
 * Call `handle(event, workspaceId)` from your event bus subscriber.
 */
export function createContentToWorkflowListener(): ContentToWorkflowMaterializer
// ── Listener type contracts ───────────────────────────────────────────────────
/** Shape of any handler that can process a `content.page_approved` event. */
export interface KnowledgePageApprovedHandler {
  handle(event: KnowledgePageApprovedEvent, workspaceId: string): Promise<boolean>;
}
⋮----
handle(event: KnowledgePageApprovedEvent, workspaceId: string): Promise<boolean>;
````

## File: modules/workspace-flow/api/workspace-flow.facade.ts
````typescript
/**
 * @module workspace-flow/api
 * @file workspace-flow.facade.ts
 * @description Public facade for executing workspace-flow operations from external consumers.
 *
 * All CRUD and workflow write operations are exposed exclusively through this class.
 * List operations return {@link PagedResult} for uniform pagination.
 * Scalar-get summary operations return the appropriate {@link *Summary} projection.
 *
 * @author workspace-flow
 * @created 2026-03-24
 */
import type { TaskRepository } from "../domain/repositories/TaskRepository";
import type { IssueRepository } from "../domain/repositories/IssueRepository";
import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";
import { CreateTaskUseCase } from "../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../application/use-cases/assign-task.use-case";
import { SubmitTaskToQaUseCase } from "../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../application/use-cases/pass-task-qa.use-case";
import { ApproveTaskAcceptanceUseCase } from "../application/use-cases/approve-task-acceptance.use-case";
import { ArchiveTaskUseCase } from "../application/use-cases/archive-task.use-case";
import { OpenIssueUseCase } from "../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../application/use-cases/close-issue.use-case";
import { CreateInvoiceUseCase } from "../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../application/use-cases/add-invoice-item.use-case";
import { UpdateInvoiceItemUseCase } from "../application/use-cases/update-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../application/use-cases/close-invoice.use-case";
import type { CreateTaskDto } from "../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../application/dto/update-task.dto";
import type { OpenIssueDto } from "../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../application/dto/resolve-issue.dto";
import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";
import type { TaskQueryDto } from "../application/dto/task-query.dto";
import type { IssueQueryDto } from "../application/dto/issue-query.dto";
import type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";
import type {
  TaskSummary,
  IssueSummary,
  InvoiceSummary,
} from "../interfaces/contracts/workspace-flow.contract";
import {
  toTaskSummary,
  toIssueSummary,
  toInvoiceSummary,
} from "../interfaces/contracts/workspace-flow.contract";
import type { CommandResult } from "@shared-types";
// ── Pagination helper ─────────────────────────────────────────────────────────
function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T>
/**
 * WorkspaceFlowFacade
 *
 * Single entry point for all workspace-flow write and read-summary operations.
 * External consumers must construct this with concrete repository implementations.
 *
 * @example
 * ```ts
 * const facade = new WorkspaceFlowFacade(
 *   new FirebaseTaskRepository(),
 *   new FirebaseIssueRepository(),
 *   new FirebaseInvoiceRepository(),
 * );
 * await facade.createTask({ workspaceId, title: "My task" });
 * ```
 */
export class WorkspaceFlowFacade {
⋮----
constructor(
// ── Task write operations ────────────────────────────────────────────────────
async createTask(dto: CreateTaskDto): Promise<CommandResult>
async updateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult>
async assignTask(taskId: string, assigneeId: string): Promise<CommandResult>
async submitTaskToQa(taskId: string): Promise<CommandResult>
async passTaskQa(taskId: string): Promise<CommandResult>
async approveTaskAcceptance(taskId: string): Promise<CommandResult>
async archiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult>
// ── Task read operations ─────────────────────────────────────────────────────
async listTasks(query: TaskQueryDto, pagination?: PaginationDto): Promise<PagedResult<TaskSummary>>
async getTaskSummary(taskId: string): Promise<TaskSummary | null>
// ── Issue write operations ───────────────────────────────────────────────────
async openIssue(dto: OpenIssueDto): Promise<CommandResult>
async startIssue(issueId: string): Promise<CommandResult>
async fixIssue(issueId: string): Promise<CommandResult>
async submitIssueRetest(issueId: string): Promise<CommandResult>
async passIssueRetest(issueId: string): Promise<CommandResult>
async failIssueRetest(issueId: string): Promise<CommandResult>
async resolveIssue(dto: ResolveIssueDto): Promise<CommandResult>
async closeIssue(issueId: string): Promise<CommandResult>
// ── Issue read operations ────────────────────────────────────────────────────
async listIssues(query: IssueQueryDto, pagination?: PaginationDto): Promise<PagedResult<IssueSummary>>
async getIssueSummary(issueId: string): Promise<IssueSummary | null>
// ── Invoice write operations ─────────────────────────────────────────────────
async createInvoice(workspaceId: string): Promise<CommandResult>
async addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult>
async updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult>
async removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult>
async submitInvoice(invoiceId: string): Promise<CommandResult>
async reviewInvoice(invoiceId: string): Promise<CommandResult>
async approveInvoice(invoiceId: string): Promise<CommandResult>
async rejectInvoice(invoiceId: string): Promise<CommandResult>
async payInvoice(invoiceId: string): Promise<CommandResult>
async closeInvoice(invoiceId: string): Promise<CommandResult>
// ── Invoice read operations ──────────────────────────────────────────────────
async listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>>
async getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null>
````

## File: modules/workspace-flow/application/dto/add-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file add-invoice-item.dto.ts
 * @description Command DTO for adding an item to an invoice.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */
export interface AddInvoiceItemDto {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
````

## File: modules/workspace-flow/application/dto/create-task.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file create-task.dto.ts
 * @description Command DTO for creating a new task.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */
export interface CreateTaskDto {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace-flow/application/dto/invoice-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file invoice-query.dto.ts
 * @description Query parameters DTO for listing invoices.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add pagination support when invoice lists grow large
 */
export interface InvoiceQueryDto {
  /** Filter invoices by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
}
⋮----
/** Filter invoices by workspace. Required for scoped queries. */
⋮----
/** Optional status filter. */
````

## File: modules/workspace-flow/application/dto/issue-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file issue-query.dto.ts
 * @description Query parameters DTO for listing issues.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add pagination support when issue lists grow large
 */
export interface IssueQueryDto {
  /** Filter issues by task. */
  readonly taskId: string;
  /** Optional status filter. */
  readonly status?: string;
}
⋮----
/** Filter issues by task. */
⋮----
/** Optional status filter. */
````

## File: modules/workspace-flow/application/dto/materialize-from-content.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file materialize-from-content.dto.ts
 * @description Command DTO for materializing Tasks and Invoices from a
 * `content.page_approved` event payload.
 *
 * This DTO is used by both:
 *  - MaterializeTasksFromContentUseCase
 *  - ContentToWorkflowMaterializer (Process Manager)
 */
import type { SourceReference } from "../../domain/value-objects/SourceReference";
export interface ExtractedTaskItem {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}
export interface ExtractedInvoiceItem {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}
export interface MaterializeFromContentDto {
  readonly workspaceId: string;
  /** ID of the KnowledgePage that was approved (same as sourceReference.id). */
  readonly contentPageId: string;
  /** Pre-built SourceReference value object to attach to every created entity. */
  readonly sourceReference: SourceReference;
  readonly extractedTasks: ReadonlyArray<ExtractedTaskItem>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoiceItem>;
}
⋮----
/** ID of the KnowledgePage that was approved (same as sourceReference.id). */
⋮----
/** Pre-built SourceReference value object to attach to every created entity. */
````

## File: modules/workspace-flow/application/dto/open-issue.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file open-issue.dto.ts
 * @description Command DTO for opening a new issue against a task.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add Zod schema when validation layer is wired in
 */
import type { IssueStage } from "../../domain/value-objects/IssueStage";
export interface OpenIssueDto {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
````

## File: modules/workspace-flow/application/dto/pagination.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file pagination.dto.ts
 * @description Shared pagination request / response DTOs for workspace-flow list queries.
 * @author workspace-flow
 * @created 2026-03-24
 */
export interface PaginationDto {
  /** 1-based page number. Defaults to 1. */
  readonly page?: number;
  /** Items per page. Defaults to 20. */
  readonly pageSize?: number;
}
⋮----
/** 1-based page number. Defaults to 1. */
⋮----
/** Items per page. Defaults to 20. */
⋮----
export interface PagedResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}
````

## File: modules/workspace-flow/application/dto/remove-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file remove-invoice-item.dto.ts
 * @description Command DTO for removing an item from an invoice.
 * @author workspace-flow
 * @created 2026-03-24
 */
export interface RemoveInvoiceItemDto {
  readonly invoiceId: string;
  readonly invoiceItemId: string;
}
````

## File: modules/workspace-flow/application/dto/resolve-issue.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file resolve-issue.dto.ts
 * @description Command DTO for resolving an issue (retest passed → resolved).
 * @author workspace-flow
 * @created 2026-03-24
 */
export interface ResolveIssueDto {
  readonly issueId: string;
  readonly resolutionNote?: string;
}
````

## File: modules/workspace-flow/application/dto/task-query.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file task-query.dto.ts
 * @description Query parameters DTO for listing tasks.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add pagination support when task lists grow large
 */
export interface TaskQueryDto {
  /** Filter tasks by workspace. Required for scoped queries. */
  readonly workspaceId: string;
  /** Optional status filter. */
  readonly status?: string;
  /** Optional assignee filter. */
  readonly assigneeId?: string;
}
⋮----
/** Filter tasks by workspace. Required for scoped queries. */
⋮----
/** Optional status filter. */
⋮----
/** Optional assignee filter. */
````

## File: modules/workspace-flow/application/dto/update-invoice-item.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file update-invoice-item.dto.ts
 * @description Command DTO for updating the amount of an existing invoice item.
 * @author workspace-flow
 * @created 2026-03-24
 */
export interface UpdateInvoiceItemDto {
  /** Updated billing amount (must be > 0). */
  readonly amount: number;
}
⋮----
/** Updated billing amount (must be > 0). */
````

## File: modules/workspace-flow/application/dto/update-task.dto.ts
````typescript
/**
 * @module workspace-flow/application/dto
 * @file update-task.dto.ts
 * @description Command DTO for updating mutable fields on an existing task.
 * @author workspace-flow
 * @created 2026-03-24
 */
export interface UpdateTaskDto {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace-flow/application/ports/InvoiceService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file InvoiceService.ts
 * @description Application port interface for Invoice operations.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */
import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";
import type { InvoiceQueryDto } from "../dto/invoice-query.dto";
export interface InvoiceService {
  createInvoice(workspaceId: string): Promise<Invoice>;
  addItem(dto: AddInvoiceItemDto): Promise<InvoiceItem>;
  removeItem(invoiceItemId: string): Promise<void>;
  transitionStatus(invoiceId: string, to: InvoiceStatus): Promise<Invoice>;
  listInvoices(query: InvoiceQueryDto): Promise<Invoice[]>;
  getInvoice(invoiceId: string): Promise<Invoice | null>;
}
⋮----
createInvoice(workspaceId: string): Promise<Invoice>;
addItem(dto: AddInvoiceItemDto): Promise<InvoiceItem>;
removeItem(invoiceItemId: string): Promise<void>;
transitionStatus(invoiceId: string, to: InvoiceStatus): Promise<Invoice>;
listInvoices(query: InvoiceQueryDto): Promise<Invoice[]>;
getInvoice(invoiceId: string): Promise<Invoice | null>;
````

## File: modules/workspace-flow/application/ports/IssueService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file IssueService.ts
 * @description Application port interface for Issue operations.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */
import type { Issue } from "../../domain/entities/Issue";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
import type { OpenIssueDto } from "../dto/open-issue.dto";
import type { IssueQueryDto } from "../dto/issue-query.dto";
export interface IssueService {
  openIssue(dto: OpenIssueDto): Promise<Issue>;
  transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
  listIssues(query: IssueQueryDto): Promise<Issue[]>;
  getIssue(issueId: string): Promise<Issue | null>;
}
⋮----
openIssue(dto: OpenIssueDto): Promise<Issue>;
transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
listIssues(query: IssueQueryDto): Promise<Issue[]>;
getIssue(issueId: string): Promise<Issue | null>;
````

## File: modules/workspace-flow/application/ports/TaskService.ts
````typescript
/**
 * @module workspace-flow/application/ports
 * @file TaskService.ts
 * @description Application port interface for Task operations.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */
import type { Task } from "../../domain/entities/Task";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import type { CreateTaskDto } from "../dto/create-task.dto";
import type { TaskQueryDto } from "../dto/task-query.dto";
export interface TaskService {
  createTask(dto: CreateTaskDto): Promise<Task>;
  assignTask(taskId: string, assigneeId: string): Promise<Task>;
  transitionStatus(taskId: string, to: TaskStatus): Promise<Task>;
  listTasks(query: TaskQueryDto): Promise<Task[]>;
  getTask(taskId: string): Promise<Task | null>;
}
⋮----
createTask(dto: CreateTaskDto): Promise<Task>;
assignTask(taskId: string, assigneeId: string): Promise<Task>;
transitionStatus(taskId: string, to: TaskStatus): Promise<Task>;
listTasks(query: TaskQueryDto): Promise<Task[]>;
getTask(taskId: string): Promise<Task | null>;
````

## File: modules/workspace-flow/application/process-managers/content-to-workflow-materializer.ts
````typescript
/**
 * @module workspace-flow/application/process-managers
 * @file content-to-workflow-materializer.ts
 * @description Process Manager (Saga) that listens for `content.page_approved`
 * events and orchestrates the creation of Tasks and Invoices in workspace-flow.
 *
 * ## Responsibility
 * This class is the single entry point for the cross-module event-driven
 * integration between the `content` and `workspace-flow` bounded contexts.
 *
 * ## Idempotency
 * The process manager tracks processed `causationId` values to prevent
 * duplicate materialization if the same event is delivered more than once.
 * The seen-set is in-memory by default; production implementations should
 * persist to Firestore at:
 *   `workspaces/{workspaceId}/materializedEvents/{causationId}`
 * using a Firestore transaction to provide atomic idempotency guarantees.
 *
 * ## Placement
 * - Wired in: Cloud Function trigger (Firestore `onDocumentUpdated`) or
 *   `SimpleEventBus` subscriber registered at application startup.
 * - Alternative: `modules/shared/application/sagas/` for shared saga registry.
 *
 * @see ADR-001: docs/architecture/adr/ADR-001-content-to-workflow-boundary.md
 */
import type { KnowledgePageApprovedEvent } from "@/modules/knowledge/api/events";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { MaterializeTasksFromContentUseCase } from "../use-cases/materialize-tasks-from-content.use-case";
import type { SourceReference } from "../../domain/value-objects/SourceReference";
export class ContentToWorkflowMaterializer {
⋮----
/**
   * In-memory idempotency guard.
   * Replace with a persistent store in production.
   */
⋮----
constructor(
/**
   * Handle a `content.page_approved` event.
   *
   * @param event - The full event payload from the content module's public API.
   * @param workspaceId - Target workspace where Tasks/Invoices will be created.
   *   Typically resolved from the event's `workspaceId` field if present.
   * @returns true if materialization succeeded, false if skipped (idempotency) or failed.
   */
async handle(event: KnowledgePageApprovedEvent, workspaceId: string): Promise<boolean>
⋮----
// ── Idempotency guard ──────────────────────────────────────────────────
⋮----
// Mark as processed only after successful materialization
````

## File: modules/workspace-flow/application/use-cases/add-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file add-invoice-item.use-case.ts
 * @description Use case: Add an item to a draft invoice.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceItemAddedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";
export class AddInvoiceItemUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(dto: AddInvoiceItemDto): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/approve-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file approve-invoice.use-case.ts
 * @description Use case: Approve an invoice in finance review (finance_review → approved).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceApprovedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
export class ApproveInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/approve-task-acceptance.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file approve-task-acceptance.use-case.ts
 * @description Use case: Approve a task at acceptance stage (acceptance → accepted). Requires no open issues.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit TaskAcceptanceApprovedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";
export class ApproveTaskAcceptanceUseCase {
⋮----
constructor(
async execute(taskId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/archive-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file archive-task.use-case.ts
 * @description Use case: Archive a task (accepted → archived). Requires invoice closed or none.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit TaskArchivedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { invoiceAllowsArchive } from "../../domain/services/task-guards";
export class ArchiveTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
/**
   * @param taskId       - ID of the task to archive
   * @param invoiceStatus - Status of the linked invoice, or undefined if none
   */
async execute(taskId: string, invoiceStatus?: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/assign-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file assign-task.use-case.ts
 * @description Use case: Assign a task to a user and transition status to in_progress.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add permission check for assignee
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
export class AssignTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
async execute(taskId: string, assigneeId: string): Promise<CommandResult>
⋮----
// Persist the assignee before transitioning status
````

## File: modules/workspace-flow/application/use-cases/close-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file close-invoice.use-case.ts
 * @description Use case: Close a paid invoice (paid → closed).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceClosedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
export class CloseInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/close-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file close-issue.use-case.ts
 * @description Use case: Close a resolved issue (resolved → closed).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit IssueClosedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
export class CloseIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(issueId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/create-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file create-invoice.use-case.ts
 * @description Use case: Create a new invoice for a workspace.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceCreatedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
export class CreateInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(workspaceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/create-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file create-task.use-case.ts
 * @description Use case: Create a new task in the workspace-flow context.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add input validation with Zod schema
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { CreateTaskDto } from "../dto/create-task.dto";
export class CreateTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
async execute(dto: CreateTaskDto): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/fail-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file fail-issue-retest.use-case.ts
 * @description Use case: Fail an issue's retest (retest → fixing).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit IssueRetestFailedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
export class FailIssueRetestUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(issueId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/fix-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file fix-issue.use-case.ts
 * @description Use case: Mark an issue as being fixed (investigating → fixing).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit IssueFixedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
export class FixIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(issueId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/materialize-tasks-from-content.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file materialize-tasks-from-content.use-case.ts
 * @description Use case: Batch-create Tasks (and optionally Invoices) from a
 * `content.page_approved` event payload.
 *
 * Idempotency: callers must ensure the same `sourceReference.causationId` is
 * not processed twice.  This use case does NOT check for duplicates itself;
 * that responsibility belongs to the ContentToWorkflowMaterializer process
 * manager which wraps this use case.
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import type { MaterializeFromContentDto } from "../dto/materialize-from-content.dto";
export class MaterializeTasksFromContentUseCase {
⋮----
constructor(
async execute(dto: MaterializeFromContentDto): Promise<CommandResult>
⋮----
// Add the extracted item to the invoice.
// taskId is empty here because the invoice was generated from AI-extracted data
// before any Tasks are created; the association is completed manually by the
// user during the Task acceptance flow (ApproveTaskAcceptanceUseCase) or via
// a subsequent LinkInvoiceItemToTaskUseCase once both entities exist.
````

## File: modules/workspace-flow/application/use-cases/open-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file open-issue.use-case.ts
 * @description Use case: Open a new issue against a task.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit IssueOpenedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import type { OpenIssueDto } from "../dto/open-issue.dto";
export class OpenIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(dto: OpenIssueDto): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/pass-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pass-issue-retest.use-case.ts
 * @description Use case: Pass an issue's retest (retest → resolved).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit IssueRetestPassedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
export class PassIssueRetestUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(issueId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/pass-task-qa.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pass-task-qa.use-case.ts
 * @description Use case: Pass a task's QA review (qa → acceptance). Requires no open issues.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit TaskQaPassedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";
export class PassTaskQaUseCase {
⋮----
constructor(
async execute(taskId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/pay-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file pay-invoice.use-case.ts
 * @description Use case: Mark an approved invoice as paid (approved → paid).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoicePaidEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
export class PayInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/reject-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file reject-invoice.use-case.ts
 * @description Use case: Reject an invoice back to submitted (finance_review → submitted).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceRejectedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
export class RejectInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/remove-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file remove-invoice-item.use-case.ts
 * @description Use case: Remove an item from a draft invoice.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceItemRemovedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
export class RemoveInvoiceItemUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceId: string, invoiceItemId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/resolve-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file resolve-issue.use-case.ts
 * @description Use case: Resolve an issue (retest-pending → resolved).
 * @author workspace-flow
 * @created 2026-03-24
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
import type { ResolveIssueDto } from "../dto/resolve-issue.dto";
export class ResolveIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(dto: ResolveIssueDto): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/review-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file review-invoice.use-case.ts
 * @description Use case: Move an invoice into finance review (submitted → finance_review).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceReviewedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
export class ReviewInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/start-issue.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file start-issue.use-case.ts
 * @description Use case: Start investigating an issue (open → investigating).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit IssueStartedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
export class StartIssueUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(issueId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/submit-invoice.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-invoice.use-case.ts
 * @description Use case: Submit an invoice for review (draft → submitted). Requires at least one item.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit InvoiceSubmittedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { evaluateInvoiceTransition } from "../../domain/services/invoice-transition-policy";
import { invoiceHasItems } from "../../domain/services/invoice-guards";
export class SubmitInvoiceUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/submit-issue-retest.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-issue-retest.use-case.ts
 * @description Use case: Submit an issue for retest (fixing → retest).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit IssueRetestSubmittedEvent to event bus
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateIssueTransition } from "../../domain/services/issue-transition-policy";
export class SubmitIssueRetestUseCase {
⋮----
constructor(private readonly issueRepository: IssueRepository)
async execute(issueId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/submit-task-to-qa.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file submit-task-to-qa.use-case.ts
 * @description Use case: Submit a task for QA review (in_progress → qa).
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add pre-submission checks (e.g. assignee present)
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
export class SubmitTaskToQaUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
async execute(taskId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/update-invoice-item.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file update-invoice-item.use-case.ts
 * @description Use case: Update the amount of an existing invoice item on a draft invoice.
 * @author workspace-flow
 * @created 2026-03-24
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { invoiceIsEditable } from "../../domain/services/invoice-guards";
import type { UpdateInvoiceItemDto } from "../dto/update-invoice-item.dto";
export class UpdateInvoiceItemUseCase {
⋮----
constructor(private readonly invoiceRepository: InvoiceRepository)
async execute(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult>
````

## File: modules/workspace-flow/application/use-cases/update-task.use-case.ts
````typescript
/**
 * @module workspace-flow/application/use-cases
 * @file update-task.use-case.ts
 * @description Use case: Update mutable fields on an existing task.
 * @author workspace-flow
 * @created 2026-03-24
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { UpdateTaskDto } from "../dto/update-task.dto";
export class UpdateTaskUseCase {
⋮----
constructor(private readonly taskRepository: TaskRepository)
async execute(taskId: string, dto: UpdateTaskDto): Promise<CommandResult>
````

## File: modules/workspace-flow/domain/entities/Invoice.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Invoice.ts
 * @description Invoice aggregate entity representing a billing record for accepted tasks.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
import type { SourceReference } from "../value-objects/SourceReference";
// ── Aggregate ─────────────────────────────────────────────────────────────────
export interface Invoice {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: InvoiceStatus;
  readonly totalAmount: number;
  readonly submittedAtISO?: string;
  readonly approvedAtISO?: string;
  readonly paidAtISO?: string;
  readonly closedAtISO?: string;
  /**
   * Present when this Invoice was materialized from a KnowledgePage via the
   * `content.page_approved` event.  Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/**
   * Present when this Invoice was materialized from a KnowledgePage via the
   * `content.page_approved` event.  Provides full provenance traceability.
   */
⋮----
// ── Inputs ────────────────────────────────────────────────────────────────────
export interface CreateInvoiceInput {
  readonly workspaceId: string;
  readonly sourceReference?: SourceReference;
}
````

## File: modules/workspace-flow/domain/entities/InvoiceItem.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file InvoiceItem.ts
 * @description InvoiceItem entity linking a task to an invoice with an amount.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add domain validation methods as billing rules expand
 */
// ── Entity ────────────────────────────────────────────────────────────────────
export interface InvoiceItem {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
// ── Inputs ────────────────────────────────────────────────────────────────────
export interface AddInvoiceItemInput {
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: number;
}
````

## File: modules/workspace-flow/domain/entities/Issue.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Issue.ts
 * @description Issue aggregate entity representing a defect or anomaly raised during workflow.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */
import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
// ── Aggregate ─────────────────────────────────────────────────────────────────
export interface Issue {
  readonly id: string;
  readonly taskId: string;
  /** Which stage of the task workflow this issue was raised in. */
  readonly stage: IssueStage;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly createdBy: string;
  readonly assignedTo?: string;
  readonly resolvedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/** Which stage of the task workflow this issue was raised in. */
⋮----
// ── Inputs ────────────────────────────────────────────────────────────────────
export interface OpenIssueInput {
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly title: string;
  readonly description?: string;
  readonly createdBy: string;
  readonly assignedTo?: string;
}
export interface UpdateIssueInput {
  readonly title?: string;
  readonly description?: string;
  readonly assignedTo?: string;
}
````

## File: modules/workspace-flow/domain/entities/Task.ts
````typescript
/**
 * @module workspace-flow/domain/entities
 * @file Task.ts
 * @description Task aggregate entity representing a work unit and its lifecycle.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */
import type { TaskStatus } from "../value-objects/TaskStatus";
import type { SourceReference } from "../value-objects/SourceReference";
// ── Aggregate ─────────────────────────────────────────────────────────────────
export interface Task {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly acceptedAtISO?: string;
  readonly archivedAtISO?: string;
  /**
   * Present when this Task was materialized from a KnowledgePage via the
   * `content.page_approved` event.  Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/**
   * Present when this Task was materialized from a KnowledgePage via the
   * `content.page_approved` event.  Provides full provenance traceability.
   */
⋮----
// ── Inputs ────────────────────────────────────────────────────────────────────
export interface CreateTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly sourceReference?: SourceReference;
}
export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
````

## File: modules/workspace-flow/domain/events/InvoiceEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file InvoiceEvent.ts
 * @description Discriminated-union event types emitted by the Invoice aggregate.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
// ── Individual event shapes ───────────────────────────────────────────────────
export interface InvoiceCreatedEvent {
  readonly type: "workspace-flow.invoice.created";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
export interface InvoiceItemAddedEvent {
  readonly type: "workspace-flow.invoice.item_added";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly taskId: string;
  readonly amount: number;
  readonly occurredAtISO: string;
}
export interface InvoiceItemRemovedEvent {
  readonly type: "workspace-flow.invoice.item_removed";
  readonly invoiceId: string;
  readonly invoiceItemId: string;
  readonly occurredAtISO: string;
}
export interface InvoiceSubmittedEvent {
  readonly type: "workspace-flow.invoice.submitted";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly submittedAtISO: string;
  readonly occurredAtISO: string;
}
export interface InvoiceReviewedEvent {
  readonly type: "workspace-flow.invoice.reviewed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
export interface InvoiceApprovedEvent {
  readonly type: "workspace-flow.invoice.approved";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly approvedAtISO: string;
  readonly occurredAtISO: string;
}
export interface InvoiceRejectedEvent {
  readonly type: "workspace-flow.invoice.rejected";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
export interface InvoicePaidEvent {
  readonly type: "workspace-flow.invoice.paid";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly paidAtISO: string;
  readonly occurredAtISO: string;
}
export interface InvoiceClosedEvent {
  readonly type: "workspace-flow.invoice.closed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly closedAtISO: string;
  readonly occurredAtISO: string;
}
export interface InvoiceStatusChangedEvent {
  readonly type: "workspace-flow.invoice.status_changed";
  readonly invoiceId: string;
  readonly workspaceId: string;
  readonly from: InvoiceStatus;
  readonly to: InvoiceStatus;
  readonly occurredAtISO: string;
}
// ── Discriminated union ───────────────────────────────────────────────────────
export type InvoiceEvent =
  | InvoiceCreatedEvent
  | InvoiceItemAddedEvent
  | InvoiceItemRemovedEvent
  | InvoiceSubmittedEvent
  | InvoiceReviewedEvent
  | InvoiceApprovedEvent
  | InvoiceRejectedEvent
  | InvoicePaidEvent
  | InvoiceClosedEvent
  | InvoiceStatusChangedEvent;
````

## File: modules/workspace-flow/domain/events/IssueEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file IssueEvent.ts
 * @description Discriminated-union event types emitted by the Issue aggregate.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */
import type { IssueStatus } from "../value-objects/IssueStatus";
import type { IssueStage } from "../value-objects/IssueStage";
// ── Individual event shapes ───────────────────────────────────────────────────
export interface IssueOpenedEvent {
  readonly type: "workspace-flow.issue.opened";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly createdBy: string;
  readonly occurredAtISO: string;
}
export interface IssueStartedEvent {
  readonly type: "workspace-flow.issue.started";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
export interface IssueFixedEvent {
  readonly type: "workspace-flow.issue.fixed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
export interface IssueRetestSubmittedEvent {
  readonly type: "workspace-flow.issue.retest_submitted";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
export interface IssueRetestPassedEvent {
  readonly type: "workspace-flow.issue.retest_passed";
  readonly issueId: string;
  readonly taskId: string;
  readonly stage: IssueStage;
  readonly occurredAtISO: string;
}
export interface IssueRetestFailedEvent {
  readonly type: "workspace-flow.issue.retest_failed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
export interface IssueClosedEvent {
  readonly type: "workspace-flow.issue.closed";
  readonly issueId: string;
  readonly taskId: string;
  readonly occurredAtISO: string;
}
export interface IssueStatusChangedEvent {
  readonly type: "workspace-flow.issue.status_changed";
  readonly issueId: string;
  readonly taskId: string;
  readonly from: IssueStatus;
  readonly to: IssueStatus;
  readonly occurredAtISO: string;
}
// ── Discriminated union ───────────────────────────────────────────────────────
export type IssueEvent =
  | IssueOpenedEvent
  | IssueStartedEvent
  | IssueFixedEvent
  | IssueRetestSubmittedEvent
  | IssueRetestPassedEvent
  | IssueRetestFailedEvent
  | IssueClosedEvent
  | IssueStatusChangedEvent;
````

## File: modules/workspace-flow/domain/events/TaskEvent.ts
````typescript
/**
 * @module workspace-flow/domain/events
 * @file TaskEvent.ts
 * @description Discriminated-union event types emitted by the Task aggregate.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */
import type { TaskStatus } from "../value-objects/TaskStatus";
// ── Individual event shapes ───────────────────────────────────────────────────
export interface TaskCreatedEvent {
  readonly type: "workspace-flow.task.created";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly occurredAtISO: string;
}
export interface TaskAssignedEvent {
  readonly type: "workspace-flow.task.assigned";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly assigneeId: string;
  readonly occurredAtISO: string;
}
export interface TaskSubmittedToQaEvent {
  readonly type: "workspace-flow.task.submitted_to_qa";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
export interface TaskQaPassedEvent {
  readonly type: "workspace-flow.task.qa_passed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}
export interface TaskAcceptanceApprovedEvent {
  readonly type: "workspace-flow.task.acceptance_approved";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly acceptedAtISO: string;
  readonly occurredAtISO: string;
}
export interface TaskArchivedEvent {
  readonly type: "workspace-flow.task.archived";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly archivedAtISO: string;
  readonly occurredAtISO: string;
}
export interface TaskStatusChangedEvent {
  readonly type: "workspace-flow.task.status_changed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;
  readonly occurredAtISO: string;
}
// ── Discriminated union ───────────────────────────────────────────────────────
export type TaskEvent =
  | TaskCreatedEvent
  | TaskAssignedEvent
  | TaskSubmittedToQaEvent
  | TaskQaPassedEvent
  | TaskAcceptanceApprovedEvent
  | TaskArchivedEvent
  | TaskStatusChangedEvent;
````

## File: modules/workspace-flow/domain/repositories/InvoiceRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file InvoiceRepository.ts
 * @description Repository port interface for Invoice persistence.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseInvoiceRepository
 */
import type { Invoice, CreateInvoiceInput } from "../entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../entities/InvoiceItem";
import type { InvoiceStatus } from "../value-objects/InvoiceStatus";
export interface InvoiceRepository {
  /** Persist a new invoice and return the created aggregate. */
  create(input: CreateInvoiceInput): Promise<Invoice>;
  /** Hard-delete an invoice by id. */
  delete(invoiceId: string): Promise<void>;
  /** Retrieve an invoice by its id. Returns null if not found. */
  findById(invoiceId: string): Promise<Invoice | null>;
  /** List all invoices for a given workspace. */
  findByWorkspaceId(workspaceId: string): Promise<Invoice[]>;
  /** Persist a lifecycle status transition and stamp relevant timestamp. */
  transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<Invoice | null>;
  /** Add an item to an invoice and recalculate totalAmount. */
  addItem(input: AddInvoiceItemInput): Promise<InvoiceItem>;
  /** Retrieve a single invoice item by its id. Returns null if not found. */
  findItemById(invoiceItemId: string): Promise<InvoiceItem | null>;
  /** Update the amount of an existing item and recalculate totalAmount. Returns null if not found. */
  updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null>;
  /** Remove an item from an invoice and recalculate totalAmount. */
  removeItem(invoiceItemId: string): Promise<void>;
  /** List all items for an invoice. */
  listItems(invoiceId: string): Promise<InvoiceItem[]>;
}
⋮----
/** Persist a new invoice and return the created aggregate. */
create(input: CreateInvoiceInput): Promise<Invoice>;
/** Hard-delete an invoice by id. */
delete(invoiceId: string): Promise<void>;
/** Retrieve an invoice by its id. Returns null if not found. */
findById(invoiceId: string): Promise<Invoice | null>;
/** List all invoices for a given workspace. */
findByWorkspaceId(workspaceId: string): Promise<Invoice[]>;
/** Persist a lifecycle status transition and stamp relevant timestamp. */
transitionStatus(invoiceId: string, to: InvoiceStatus, nowISO: string): Promise<Invoice | null>;
/** Add an item to an invoice and recalculate totalAmount. */
addItem(input: AddInvoiceItemInput): Promise<InvoiceItem>;
/** Retrieve a single invoice item by its id. Returns null if not found. */
findItemById(invoiceItemId: string): Promise<InvoiceItem | null>;
/** Update the amount of an existing item and recalculate totalAmount. Returns null if not found. */
updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null>;
/** Remove an item from an invoice and recalculate totalAmount. */
removeItem(invoiceItemId: string): Promise<void>;
/** List all items for an invoice. */
listItems(invoiceId: string): Promise<InvoiceItem[]>;
````

## File: modules/workspace-flow/domain/repositories/IssueRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file IssueRepository.ts
 * @description Repository port interface for Issue persistence.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseIssueRepository
 */
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";
export interface IssueRepository {
  /** Persist a new issue and return the created aggregate. */
  create(input: OpenIssueInput): Promise<Issue>;
  /** Update mutable fields on an existing issue. Returns null if not found. */
  update(issueId: string, input: UpdateIssueInput): Promise<Issue | null>;
  /** Hard-delete an issue by id. */
  delete(issueId: string): Promise<void>;
  /** Retrieve an issue by its id. Returns null if not found. */
  findById(issueId: string): Promise<Issue | null>;
  /** List all issues for a given task. */
  findByTaskId(taskId: string): Promise<Issue[]>;
  /** Count open issues for a given task (used in guard conditions). */
  countOpenByTaskId(taskId: string): Promise<number>;
  /** Persist a lifecycle status transition and stamp resolvedAtISO if to==="resolved". */
  transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null>;
}
⋮----
/** Persist a new issue and return the created aggregate. */
create(input: OpenIssueInput): Promise<Issue>;
/** Update mutable fields on an existing issue. Returns null if not found. */
update(issueId: string, input: UpdateIssueInput): Promise<Issue | null>;
/** Hard-delete an issue by id. */
delete(issueId: string): Promise<void>;
/** Retrieve an issue by its id. Returns null if not found. */
findById(issueId: string): Promise<Issue | null>;
/** List all issues for a given task. */
findByTaskId(taskId: string): Promise<Issue[]>;
/** Count open issues for a given task (used in guard conditions). */
countOpenByTaskId(taskId: string): Promise<number>;
/** Persist a lifecycle status transition and stamp resolvedAtISO if to==="resolved". */
transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null>;
````

## File: modules/workspace-flow/domain/repositories/TaskRepository.ts
````typescript
/**
 * @module workspace-flow/domain/repositories
 * @file TaskRepository.ts
 * @description Repository port interface for Task persistence.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseTaskRepository
 */
import type { Task, CreateTaskInput, UpdateTaskInput } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";
export interface TaskRepository {
  /** Persist a new task and return the created aggregate. */
  create(input: CreateTaskInput): Promise<Task>;
  /** Update mutable fields on an existing task. Returns null if not found. */
  update(taskId: string, input: UpdateTaskInput): Promise<Task | null>;
  /** Hard-delete a task by id. */
  delete(taskId: string): Promise<void>;
  /** Retrieve a task by its id. Returns null if not found. */
  findById(taskId: string): Promise<Task | null>;
  /** List all tasks belonging to a workspace, ordered by updatedAtISO desc. */
  findByWorkspaceId(workspaceId: string): Promise<Task[]>;
  /** Persist a lifecycle status transition and stamp acceptedAtISO / archivedAtISO as appropriate. */
  transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null>;
}
⋮----
/** Persist a new task and return the created aggregate. */
create(input: CreateTaskInput): Promise<Task>;
/** Update mutable fields on an existing task. Returns null if not found. */
update(taskId: string, input: UpdateTaskInput): Promise<Task | null>;
/** Hard-delete a task by id. */
delete(taskId: string): Promise<void>;
/** Retrieve a task by its id. Returns null if not found. */
findById(taskId: string): Promise<Task | null>;
/** List all tasks belonging to a workspace, ordered by updatedAtISO desc. */
findByWorkspaceId(workspaceId: string): Promise<Task[]>;
/** Persist a lifecycle status transition and stamp acceptedAtISO / archivedAtISO as appropriate. */
transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null>;
````

## File: modules/workspace-flow/domain/services/invoice-guards.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file invoice-guards.ts
 * @description Pure domain guards for invoice lifecycle invariants.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add guards for additional billing invariants as rules evolve
 */
// ── Guard: item count > 0 before submit ───────────────────────────────────────
/**
 * Asserts that an invoice has at least one item before allowing submission.
 *
 * @param itemCount - Number of items currently on the invoice
 * @returns true if the invoice may be submitted; false if it has no items
 */
export function invoiceHasItems(itemCount: number): boolean
// ── Guard: invoice is in draft before item mutation ───────────────────────────
/**
 * Asserts that an invoice is in draft status before allowing item add/remove.
 *
 * @param status - Current invoice status
 * @returns true if items may be mutated; false otherwise
 */
export function invoiceIsEditable(status: string): boolean
````

## File: modules/workspace-flow/domain/services/invoice-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file invoice-transition-policy.ts
 * @description Pure domain service encapsulating allowed Invoice status transitions.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Expand with additional guard conditions as billing rules evolve
 */
import { canTransitionInvoiceStatus, type InvoiceStatus } from "../value-objects/InvoiceStatus";
export type InvoiceTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };
/**
 * Evaluates whether an invoice lifecycle transition is permitted.
 *
 * @param from - Current invoice status
 * @param to   - Requested next status
 * @returns InvoiceTransitionResult indicating whether the transition is allowed
 */
export function evaluateInvoiceTransition(
  from: InvoiceStatus,
  to: InvoiceStatus,
): InvoiceTransitionResult
````

## File: modules/workspace-flow/domain/services/issue-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file issue-transition-policy.ts
 * @description Pure domain service encapsulating allowed Issue status transitions.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Expand with additional guard conditions as business rules evolve
 */
import { canTransitionIssueStatus, type IssueStatus } from "../value-objects/IssueStatus";
export type IssueTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };
/**
 * Evaluates whether an issue lifecycle transition is permitted.
 *
 * @param from - Current issue status
 * @param to   - Requested next status
 * @returns IssueTransitionResult indicating whether the transition is allowed
 */
export function evaluateIssueTransition(
  from: IssueStatus,
  to: IssueStatus,
): IssueTransitionResult
````

## File: modules/workspace-flow/domain/services/task-guards.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file task-guards.ts
 * @description Pure domain guards for task lifecycle invariants.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add guards for additional business invariants as rules evolve
 */
// ── Guard: no open issues ─────────────────────────────────────────────────────
/**
 * Asserts that a task has no open issues before allowing QA-pass or acceptance-approve.
 *
 * @param openIssueCount - The number of open issues currently linked to the task
 * @returns true if the task may proceed; false if blocked by open issues
 */
export function hasNoOpenIssues(openIssueCount: number): boolean
// ── Guard: invoice closed or none ─────────────────────────────────────────────
/**
 * Asserts that any linked invoice is closed (or none exists) before allowing archive.
 *
 * @param invoiceStatus - The status of the linked invoice, or undefined if none
 * @returns true if the task may be archived; false if blocked by an active invoice
 */
export function invoiceAllowsArchive(
  invoiceStatus: string | undefined,
): boolean
````

## File: modules/workspace-flow/domain/services/task-transition-policy.ts
````typescript
/**
 * @module workspace-flow/domain/services
 * @file task-transition-policy.ts
 * @description Pure domain service encapsulating allowed Task status transitions.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Expand with multi-branch transitions if workflow rules evolve
 */
import { canTransitionTaskStatus, type TaskStatus } from "../value-objects/TaskStatus";
export type TaskTransitionResult =
  | { allowed: true }
  | { allowed: false; reason: string };
/**
 * Evaluates whether a task lifecycle transition is permitted.
 *
 * @param from - Current task status
 * @param to   - Requested next status
 * @returns TaskTransitionResult indicating whether the transition is allowed
 */
export function evaluateTaskTransition(
  from: TaskStatus,
  to: TaskStatus,
): TaskTransitionResult
````

## File: modules/workspace-flow/domain/value-objects/InvoiceId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceId.ts
 * @description Branded string value object for Invoice identifiers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */
⋮----
/** Branded string that prevents mixing Invoice IDs with other string IDs. */
export type InvoiceId = string & { readonly [__invoiceIdBrand]: void };
/** Creates an InvoiceId from a plain string (e.g. a Firestore document ID). */
export function invoiceId(raw: string): InvoiceId
````

## File: modules/workspace-flow/domain/value-objects/InvoiceItemId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceItemId.ts
 * @description Branded string value object for InvoiceItem identifiers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */
⋮----
/** Branded string that prevents mixing InvoiceItem IDs with other string IDs. */
export type InvoiceItemId = string & { readonly [__invoiceItemIdBrand]: void };
/** Creates an InvoiceItemId from a plain string (e.g. a Firestore document ID). */
export function invoiceItemId(raw: string): InvoiceItemId
````

## File: modules/workspace-flow/domain/value-objects/InvoiceStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file InvoiceStatus.ts
 * @description Invoice lifecycle status union, transition table, and helpers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add additional transition guards as billing rules evolve
 */
// ── Status ─────────────────────────────────────────────────────────────────────
export type InvoiceStatus =
  | "draft"
  | "submitted"
  | "finance_review"
  | "approved"
  | "paid"
  | "closed";
⋮----
// ── Transition table ──────────────────────────────────────────────────────────
/**
 * Multi-successor transition map for invoice lifecycle.
 *
 * draft → submitted (SUBMIT / item_count > 0)
 * submitted → finance_review (REVIEW)
 * finance_review → approved (APPROVE)
 * finance_review → submitted (REJECT — back to submitted for resubmission)
 * approved → paid (PAY)
 * paid → closed (CLOSE)
 */
⋮----
/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean
/** Returns true when the invoice has reached a terminal state and cannot progress. */
export function isTerminalInvoiceStatus(status: InvoiceStatus): boolean
````

## File: modules/workspace-flow/domain/value-objects/IssueId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueId.ts
 * @description Branded string value object for Issue identifiers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */
⋮----
/** Branded string that prevents mixing Issue IDs with other string IDs. */
export type IssueId = string & { readonly [__issueIdBrand]: void };
/** Creates an IssueId from a plain string (e.g. a Firestore document ID). */
export function issueId(raw: string): IssueId
````

## File: modules/workspace-flow/domain/value-objects/IssueStage.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStage.ts
 * @description Cross-domain stage reference indicating at which task-flow stage an issue was raised.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Extend stage list if workflow introduces additional stages
 */
// ── IssueStage ─────────────────────────────────────────────────────────────────
/**
 * Indicates which stage of the task workflow this issue was raised in.
 * Used to route issue resolution back to the originating workflow step.
 */
export type IssueStage = "task" | "qa" | "acceptance";
````

## File: modules/workspace-flow/domain/value-objects/IssueStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file IssueStatus.ts
 * @description Issue lifecycle status union, multi-successor transition table, and helpers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */
// ── Status ─────────────────────────────────────────────────────────────────────
export type IssueStatus =
  | "open"
  | "investigating"
  | "fixing"
  | "retest"
  | "resolved"
  | "closed";
⋮----
// ── Transition table ──────────────────────────────────────────────────────────
/**
 * Multi-successor transition map for issue lifecycle.
 *
 * open → investigating (START)
 * investigating → fixing (FIX)
 * fixing → retest (SUBMIT_RETEST)
 * retest → resolved (PASS_RETEST)
 * retest → fixing (FAIL_RETEST — back-edge within the Issue fix cycle)
 * resolved → closed (CLOSE)
 */
⋮----
/** Returns true if moving from `from` to `to` is a valid transition. */
export function canTransitionIssueStatus(from: IssueStatus, to: IssueStatus): boolean
/** Returns true when the issue has reached a terminal state and cannot progress. */
export function isTerminalIssueStatus(status: IssueStatus): boolean
````

## File: modules/workspace-flow/domain/value-objects/SourceReference.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file SourceReference.ts
 * @description Value object representing the origin of a materialized entity (Task or Invoice).
 *
 * A SourceReference is attached to Task and Invoice entities that were created
 * by the contentToWorkflowMaterializer Process Manager in response to a
 * `content.page_approved` event.  It provides full audit traceability:
 *
 *   Task → sourceReference → KnowledgePage → IngestionJob → source PDF
 */
export type SourceReferenceType = "KnowledgePage";
export interface SourceReference {
  /** The type of the source aggregate. */
  readonly type: SourceReferenceType;
  /** The ID of the source aggregate (e.g. KnowledgePage.id). */
  readonly id: string;
  /**
   * causationId from the `content.page_approved` event that triggered
   * materialization.  Stored for idempotency checks and audit trails.
   */
  readonly causationId: string;
  /**
   * correlationId tracing the entire business flow:
   *   ingestion → human review → approval → materialization.
   */
  readonly correlationId: string;
}
⋮----
/** The type of the source aggregate. */
⋮----
/** The ID of the source aggregate (e.g. KnowledgePage.id). */
⋮----
/**
   * causationId from the `content.page_approved` event that triggered
   * materialization.  Stored for idempotency checks and audit trails.
   */
⋮----
/**
   * correlationId tracing the entire business flow:
   *   ingestion → human review → approval → materialization.
   */
````

## File: modules/workspace-flow/domain/value-objects/TaskId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskId.ts
 * @description Branded string value object for Task identifiers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */
⋮----
/** Branded string that prevents mixing Task IDs with other string IDs. */
export type TaskId = string & { readonly [__taskIdBrand]: void };
/** Creates a TaskId from a plain string (e.g. a Firestore document ID). */
export function taskId(raw: string): TaskId
````

## File: modules/workspace-flow/domain/value-objects/TaskStatus.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file TaskStatus.ts
 * @description Task lifecycle status union, transition table, and pure helper functions.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add additional transition guards as business rules evolve
 */
// ── Status ─────────────────────────────────────────────────────────────────────
export type TaskStatus =
  | "draft"
  | "in_progress"
  | "qa"
  | "acceptance"
  | "accepted"
  | "archived";
/** Ordered tuple used by Zod schemas (z.enum needs a const tuple). */
⋮----
// ── Transition table ──────────────────────────────────────────────────────────
/**
 * Maps each status to its single valid successor (null = terminal).
 *
 * The flow is intentionally forward-only.
 * draft → in_progress (ASSIGN)
 * in_progress → qa (SUBMIT_QA)
 * qa → acceptance (PASS_QA)
 * acceptance → accepted (APPROVE_ACCEPTANCE)
 * accepted → archived (ARCHIVE)
 */
⋮----
/** Returns true if moving from `from` to `to` is a valid forward transition. */
export function canTransitionTaskStatus(from: TaskStatus, to: TaskStatus): boolean
/** Returns the next status in the main flow, or null if already terminal. */
export function nextTaskStatus(current: TaskStatus): TaskStatus | null
/** Returns true when the task has reached a terminal state and cannot progress. */
export function isTerminalTaskStatus(status: TaskStatus): boolean
````

## File: modules/workspace-flow/domain/value-objects/UserId.ts
````typescript
/**
 * @module workspace-flow/domain/value-objects
 * @file UserId.ts
 * @description Branded string value object for User identifiers.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Consider using a stronger opaque type if ID generation logic is added
 */
⋮----
/** Branded string that prevents mixing User IDs with other string IDs. */
export type UserId = string & { readonly [__userIdBrand]: void };
/** Creates a UserId from a plain string (e.g. a Firebase Auth UID). */
export function userId(raw: string): UserId
````

## File: modules/workspace-flow/index.ts
````typescript
/**
 * @module workspace-flow
 * @file index.ts
 * @description Local module barrel for workspace-flow.
 *
 * This file is for same-module convenience only.
 * Cross-module consumers MUST import from @/modules/workspace-flow/api instead.
 *
 * @author workspace-flow
 * @created 2026-03-24
 */
// ── Domain: entities ──────────────────────────────────────────────────────────
⋮----
// ── Domain: value objects (enum lists only — no XState helpers) ───────────────
⋮----
// ── Domain: repository interfaces ─────────────────────────────────────────────
⋮----
// ── Domain: events ────────────────────────────────────────────────────────────
⋮----
// ── Application: DTOs ─────────────────────────────────────────────────────────
⋮----
// ── API: Facade ───────────────────────────────────────────────────────────────
⋮----
// ── Infrastructure: repositories ──────────────────────────────────────────────
⋮----
// ── Interfaces: Server Actions ────────────────────────────────────────────────
⋮----
// ── Interfaces: Queries ───────────────────────────────────────────────────────
````

## File: modules/workspace-flow/infrastructure/firebase/invoice-item.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice-item.converter.ts
 * @description Firestore document-to-entity converter for InvoiceItem.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
/**
 * Converts a raw Firestore document data map into a typed InvoiceItem entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoiceItem(id: string, data: Record<string, unknown>): InvoiceItem
````

## File: modules/workspace-flow/infrastructure/firebase/invoice.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file invoice.converter.ts
 * @description Firestore document-to-entity converter for Invoice.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */
import type { Invoice } from "../../domain/entities/Invoice";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toSourceReference } from "./sourceReference.converter";
⋮----
/**
 * Converts a raw Firestore document data map into a typed Invoice entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toInvoice(id: string, data: Record<string, unknown>): Invoice
````

## File: modules/workspace-flow/infrastructure/firebase/issue.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file issue.converter.ts
 * @description Firestore document-to-entity converter for Issue.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */
import type { Issue } from "../../domain/entities/Issue";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { ISSUE_STAGES, type IssueStage } from "../../domain/value-objects/IssueStage";
⋮----
/**
 * Converts a raw Firestore document data map into a typed Issue entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toIssue(id: string, data: Record<string, unknown>): Issue
````

## File: modules/workspace-flow/infrastructure/firebase/sourceReference.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file sourceReference.converter.ts
 * @description Firestore document-to-value-object converter for SourceReference.
 * Shared by task.converter.ts and invoice.converter.ts.
 */
import type { SourceReference } from "../../domain/value-objects/SourceReference";
/**
 * Convert a raw Firestore field value to a typed SourceReference value object.
 * Returns `undefined` if the value is absent or does not conform to the expected shape.
 */
export function toSourceReference(raw: unknown): SourceReference | undefined
````

## File: modules/workspace-flow/infrastructure/firebase/task.converter.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file task.converter.ts
 * @description Firestore document-to-entity converter for Task.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */
import type { Task } from "../../domain/entities/Task";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toSourceReference } from "./sourceReference.converter";
⋮----
/**
 * Converts a raw Firestore document data map into a typed Task entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toTask(id: string, data: Record<string, unknown>): Task
````

## File: modules/workspace-flow/infrastructure/firebase/workspace-flow.collections.ts
````typescript
/**
 * @module workspace-flow/infrastructure/firebase
 * @file workspace-flow.collections.ts
 * @description Firestore collection path constants for the workspace-flow module.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Update collection names to match production Firestore schema
 */
/** Top-level Firestore collection for workspace-flow tasks. */
⋮----
/** Top-level Firestore collection for workspace-flow issues. */
⋮----
/** Top-level Firestore collection for workspace-flow invoices. */
⋮----
/** Top-level Firestore collection for workspace-flow invoice items. */
````

## File: modules/workspace-flow/infrastructure/repositories/FirebaseInvoiceItemRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceItemRepository.ts
 * @description Firebase Firestore repository for InvoiceItem CRUD operations.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add query pagination support
 */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import { WF_INVOICE_ITEMS_COLLECTION } from "../firebase/workspace-flow.collections";
export class FirebaseInvoiceItemRepository {
⋮----
private get db()
private get collectionRef()
async findById(itemId: string): Promise<InvoiceItem | null>
async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]>
async delete(itemId: string): Promise<void>
````

## File: modules/workspace-flow/infrastructure/repositories/FirebaseInvoiceRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseInvoiceRepository.ts
 * @description Firebase Firestore implementation of InvoiceRepository for workspace-flow.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add query pagination support and composite indexes
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Invoice, CreateInvoiceInput } from "../../domain/entities/Invoice";
import type { InvoiceItem, AddInvoiceItemInput } from "../../domain/entities/InvoiceItem";
import type { InvoiceRepository } from "../../domain/repositories/InvoiceRepository";
import { INVOICE_STATUSES, type InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import { toInvoice } from "../firebase/invoice.converter";
import { toInvoiceItem } from "../firebase/invoice-item.converter";
import {
  WF_INVOICES_COLLECTION,
  WF_INVOICE_ITEMS_COLLECTION,
} from "../firebase/workspace-flow.collections";
⋮----
export class FirebaseInvoiceRepository implements InvoiceRepository {
⋮----
private get db()
private get invoiceCollectionRef()
private get itemCollectionRef()
async create(input: CreateInvoiceInput): Promise<Invoice>
async delete(invoiceId: string): Promise<void>
async findById(invoiceId: string): Promise<Invoice | null>
async findByWorkspaceId(workspaceId: string): Promise<Invoice[]>
async transitionStatus(
    invoiceId: string,
    to: InvoiceStatus,
    nowISO: string,
): Promise<Invoice | null>
async addItem(input: AddInvoiceItemInput): Promise<InvoiceItem>
⋮----
// Update invoice totalAmount
⋮----
async findItemById(invoiceItemId: string): Promise<InvoiceItem | null>
async updateItem(invoiceItemId: string, amount: number): Promise<InvoiceItem | null>
async removeItem(invoiceItemId: string): Promise<void>
async listItems(invoiceId: string): Promise<InvoiceItem[]>
````

## File: modules/workspace-flow/infrastructure/repositories/FirebaseIssueRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseIssueRepository.ts
 * @description Firebase Firestore implementation of IssueRepository for workspace-flow.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add query pagination support and composite indexes
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { toIssue } from "../firebase/issue.converter";
import { WF_ISSUES_COLLECTION } from "../firebase/workspace-flow.collections";
⋮----
export class FirebaseIssueRepository implements IssueRepository {
⋮----
private get db()
private get collectionRef()
async create(input: OpenIssueInput): Promise<Issue>
async update(issueId: string, input: UpdateIssueInput): Promise<Issue | null>
async delete(issueId: string): Promise<void>
async findById(issueId: string): Promise<Issue | null>
async findByTaskId(taskId: string): Promise<Issue[]>
async countOpenByTaskId(taskId: string): Promise<number>
async transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null>
````

## File: modules/workspace-flow/infrastructure/repositories/FirebaseTaskRepository.ts
````typescript
/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseTaskRepository.ts
 * @description Firebase Firestore implementation of TaskRepository for workspace-flow.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add query pagination support and composite indexes
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toTask } from "../firebase/task.converter";
import { WF_TASKS_COLLECTION } from "../firebase/workspace-flow.collections";
⋮----
export class FirebaseTaskRepository implements TaskRepository {
⋮----
private get db()
private get collectionRef()
async create(input: CreateTaskInput): Promise<Task>
async update(taskId: string, input: UpdateTaskInput): Promise<Task | null>
async delete(taskId: string): Promise<void>
async findById(taskId: string): Promise<Task | null>
async findByWorkspaceId(workspaceId: string): Promise<Task[]>
async transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null>
````

## File: modules/workspace-flow/interfaces/_actions/workspace-flow.actions.ts
````typescript
/**
 * @module workspace-flow/interfaces/_actions
 * @file workspace-flow.actions.ts
 * @description Server Actions for workspace-flow write operations.
 * @author workspace-flow
 * @created 2026-03-24
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";
import type { OpenIssueDto } from "../../application/dto/open-issue.dto";
import type { ResolveIssueDto } from "../../application/dto/resolve-issue.dto";
import type { AddInvoiceItemDto } from "../../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../../application/dto/remove-invoice-item.dto";
import { CreateTaskUseCase } from "../../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../../application/use-cases/assign-task.use-case";
import { SubmitTaskToQaUseCase } from "../../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../../application/use-cases/pass-task-qa.use-case";
import { ApproveTaskAcceptanceUseCase } from "../../application/use-cases/approve-task-acceptance.use-case";
import { ArchiveTaskUseCase } from "../../application/use-cases/archive-task.use-case";
import { OpenIssueUseCase } from "../../application/use-cases/open-issue.use-case";
import { StartIssueUseCase } from "../../application/use-cases/start-issue.use-case";
import { FixIssueUseCase } from "../../application/use-cases/fix-issue.use-case";
import { SubmitIssueRetestUseCase } from "../../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../../application/use-cases/fail-issue-retest.use-case";
import { ResolveIssueUseCase } from "../../application/use-cases/resolve-issue.use-case";
import { CloseIssueUseCase } from "../../application/use-cases/close-issue.use-case";
import { CreateInvoiceUseCase } from "../../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../../application/use-cases/add-invoice-item.use-case";
import { UpdateInvoiceItemUseCase } from "../../application/use-cases/update-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../../application/use-cases/close-invoice.use-case";
import { FirebaseTaskRepository } from "../../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseIssueRepository } from "../../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseInvoiceRepository } from "../../infrastructure/repositories/FirebaseInvoiceRepository";
// ── Repository factories ──────────────────────────────────────────────────────
function makeTaskRepo()
function makeIssueRepo()
function makeInvoiceRepo()
// ── Task actions ──────────────────────────────────────────────────────────────
export async function wfCreateTask(dto: CreateTaskDto): Promise<CommandResult>
export async function wfUpdateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult>
export async function wfAssignTask(taskId: string, assigneeId: string): Promise<CommandResult>
export async function wfSubmitTaskToQa(taskId: string): Promise<CommandResult>
export async function wfPassTaskQa(taskId: string): Promise<CommandResult>
export async function wfApproveTaskAcceptance(taskId: string): Promise<CommandResult>
export async function wfArchiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult>
// ── Issue actions ─────────────────────────────────────────────────────────────
export async function wfOpenIssue(dto: OpenIssueDto): Promise<CommandResult>
export async function wfStartIssue(issueId: string): Promise<CommandResult>
export async function wfFixIssue(issueId: string): Promise<CommandResult>
export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult>
export async function wfPassIssueRetest(issueId: string): Promise<CommandResult>
export async function wfFailIssueRetest(issueId: string): Promise<CommandResult>
export async function wfResolveIssue(dto: ResolveIssueDto): Promise<CommandResult>
export async function wfCloseIssue(issueId: string): Promise<CommandResult>
// ── Invoice actions ───────────────────────────────────────────────────────────
export async function wfCreateInvoice(workspaceId: string): Promise<CommandResult>
export async function wfAddInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult>
export async function wfUpdateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult>
export async function wfRemoveInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult>
export async function wfSubmitInvoice(invoiceId: string): Promise<CommandResult>
export async function wfReviewInvoice(invoiceId: string): Promise<CommandResult>
export async function wfApproveInvoice(invoiceId: string): Promise<CommandResult>
export async function wfRejectInvoice(invoiceId: string): Promise<CommandResult>
export async function wfPayInvoice(invoiceId: string): Promise<CommandResult>
export async function wfCloseInvoice(invoiceId: string): Promise<CommandResult>
````

## File: modules/workspace-flow/interfaces/components/WorkspaceFlowTab.tsx
````typescript
/**
 * @module workspace-flow/interfaces/components
 * @file WorkspaceFlowTab.tsx
 * @description Workspace-level tab displaying Tasks, Issues, and Invoices managed by workspace-flow.
 *
 * MVP interactive surface:
 * - Create Task dialog
 * - Task lifecycle transition buttons (assign → QA → acceptance → archive)
 * - Per-task expandable Issue sub-list with transition buttons
 * - Open Issue dialog
 * - Create Invoice button + Invoice lifecycle transitions
 *
 * @author workspace-flow
 * @created 2026-03-27
 */
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import type { CommandResult } from "@shared-types";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Separator } from "@ui-shadcn/ui/separator";
import { Textarea } from "@ui-shadcn/ui/textarea";
import type { Invoice } from "../../domain/entities/Invoice";
import type { Issue } from "../../domain/entities/Issue";
import type { Task } from "../../domain/entities/Task";
import type { IssueStage } from "../../domain/value-objects/IssueStage";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import {
  wfApproveInvoice,
  wfApproveTaskAcceptance,
  wfArchiveTask,
  wfAssignTask,
  wfCloseInvoice,
  wfCloseIssue,
  wfCreateInvoice,
  wfCreateTask,
  wfFailIssueRetest,
  wfFixIssue,
  wfOpenIssue,
  wfPassIssueRetest,
  wfPassTaskQa,
  wfPayInvoice,
  wfRejectInvoice,
  wfReviewInvoice,
  wfStartIssue,
  wfSubmitInvoice,
  wfSubmitIssueRetest,
  wfSubmitTaskToQa,
} from "../_actions/workspace-flow.actions";
import {
  getWorkspaceFlowInvoices,
  getWorkspaceFlowIssues,
  getWorkspaceFlowTasks,
} from "../queries/workspace-flow.queries";
// ── Status display maps ────────────────────────────────────────────────────────
⋮----
// ── Helpers ────────────────────────────────────────────────────────────────────
function formatShortDate(iso: string | undefined): string
function formatCurrency(amount: number): string
// ── Types ──────────────────────────────────────────────────────────────────────
type FlowSection = "tasks" | "invoices";
interface WorkspaceFlowTabProps {
  readonly workspaceId: string;
  readonly currentUserId?: string;
}
// ── Create Task Dialog ─────────────────────────────────────────────────────────
interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  workspaceId: string;
}
⋮----
function handleClose()
async function handleSubmit(e: React.FormEvent)
⋮----
onChange=
⋮----
// ── Assign Task Dialog ─────────────────────────────────────────────────────────
⋮----
// ── Open Issue Dialog ──────────────────────────────────────────────────────────
⋮----
// ── Issue Row ──────────────────────────────────────────────────────────────────
⋮----
async function runAction(action: () => Promise<CommandResult>)
⋮----
return <Button size="sm" variant="outline" disabled=
⋮----
<Button size="sm" variant="outline" disabled=
<Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfFailIssueRetest(issue.id))}>失敗</Button>
          </div>
        );
⋮----
// ── Task Row ───────────────────────────────────────────────────────────────────
⋮----
// non-fatal
⋮----
switch (task.status)
⋮----
{/* ── Task header ─────────────────────── */}
⋮----
{/* ── Action row ──────────────────────── */}
⋮----
{/* ── Issues sub-list ─────────────────── */}
⋮----
{/* ── Dialogs ─────────────────────────── */}
⋮----
onClose=
⋮----
onCreated=
await loadIssues();
⋮----
// ── Invoice Row ────────────────────────────────────────────────────────────────
⋮----
<Button size="sm" variant="outline" disabled={busy} onClick={() => runAction(() => wfRejectInvoice(invoice.id))}>退回</Button>
          </div>
        );
⋮----

⋮----
// ── Main Component ─────────────────────────────────────────────────────────────
⋮----
async function handleCreateInvoice()
⋮----
{/* ── Section switcher ─────────────────────────────────────────── */}
⋮----
{/* ── Loading state ─────────────────────────────────────────────── */}
⋮----
{/* ── Error state ───────────────────────────────────────────────── */}
⋮----
{/* ── Tasks section ─────────────────────────────────────────────── */}
⋮----
{/* ── Invoices section ──────────────────────────────────────────── */}
⋮----
{/* ── Create Task Dialog ─────────────────────────────────────────── */}
````

## File: modules/workspace-flow/interfaces/contracts/workspace-flow.contract.ts
````typescript
/**
 * @module workspace-flow/interfaces/contracts
 * @file workspace-flow.contract.ts
 * @description Module-local interface contracts for workspace-flow UI adapters.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Expand with view-model contracts as UI adapters are added
 */
import type { Task } from "../../domain/entities/Task";
import type { Issue } from "../../domain/entities/Issue";
import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
// ── Summary read models (lean projections for UI) ─────────────────────────────
export interface TaskSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly status: Task["status"];
  readonly assigneeId?: string;
}
export interface IssueSummary {
  readonly id: string;
  readonly taskId: string;
  readonly title: string;
  readonly status: Issue["status"];
  readonly stage: Issue["stage"];
}
export interface InvoiceSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: Invoice["status"];
  readonly totalAmount: number;
}
export interface InvoiceItemSummary {
  readonly id: string;
  readonly invoiceId: string;
  readonly taskId: string;
  readonly amount: InvoiceItem["amount"];
}
// ── Projection helpers ────────────────────────────────────────────────────────
export function toTaskSummary(task: Task): TaskSummary
export function toIssueSummary(issue: Issue): IssueSummary
export function toInvoiceSummary(invoice: Invoice): InvoiceSummary
export function toInvoiceItemSummary(item: InvoiceItem): InvoiceItemSummary
````

## File: modules/workspace-flow/interfaces/queries/workspace-flow.queries.ts
````typescript
/**
 * @module workspace-flow/interfaces/queries
 * @file workspace-flow.queries.ts
 * @description Server-side read queries for workspace-flow entities.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add pagination support and caching layer
 */
import type { Task } from "../../domain/entities/Task";
import type { Issue } from "../../domain/entities/Issue";
import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import { FirebaseTaskRepository } from "../../infrastructure/repositories/FirebaseTaskRepository";
import { FirebaseIssueRepository } from "../../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseInvoiceRepository } from "../../infrastructure/repositories/FirebaseInvoiceRepository";
function makeTaskRepo()
function makeIssueRepo()
function makeInvoiceRepo()
/**
 * List all tasks for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowTasks(workspaceId: string): Promise<Task[]>
/**
 * Get a single task by id.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowTask(taskId: string): Promise<Task | null>
/**
 * List all issues for a task.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowIssues(taskId: string): Promise<Issue[]>
/**
 * List all invoices for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowInvoices(workspaceId: string): Promise<Invoice[]>
/**
 * Get items for an invoice.
 *
 * @param invoiceId - The invoice identifier
 */
export async function getWorkspaceFlowInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>
````

## File: modules/workspace-flow/Workspace-Flow-Architecture.mermaid
````
flowchart LR
  classDef external fill:#ede9fe,stroke:#7c3aed,color:#2e1065,stroke-width:2px;
  classDef api fill:#dcfce7,stroke:#16a34a,color:#052e16,stroke-width:2px;
  classDef app fill:#eff6ff,stroke:#2563eb,color:#0f172a,stroke-width:2px;
  classDef domain fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
  classDef infra fill:#f3e8ff,stroke:#9333ea,color:#3b0764,stroke-width:2px;
  classDef data fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:1.5px;
  classDef rule fill:#fef2f2,stroke:#dc2626,color:#7f1d1d,stroke-dasharray: 6 4;

  external_ui[External UI / app routes / other modules]:::external --> public_api

  subgraph WORKSPACE_FLOW [workspace-flow Module]
    direction LR
    public_api[api<br/>facade + public contracts]:::api --> app_layer[application<br/>DTOs + ports + use cases]:::app
    app_layer --> domain_layer[domain<br/>entities + events + guards + transitions]:::domain
    infra_layer[infrastructure<br/>collections + converters + repositories]:::infra --> domain_layer
    app_layer --> infra_layer
  end

  firestore[(Firestore)]:::data
  infra_layer --> firestore

  forbidden[Forbidden<br/>UI must not import domain/application/infrastructure directly]:::rule
  external_ui -. enforce boundary .-> forbidden
````

## File: modules/workspace-flow/Workspace-Flow-ERD.mermaid
````
erDiagram
  TASK ||--o{ ISSUE : has
  TASK ||--o{ INVOICE_ITEM : bills
  INVOICE ||--o{ INVOICE_ITEM : contains

  TASK {
    string id
    string title
    string description
    string status
    string assignee
    date created_at
    date accepted_at
    date archived_at
  }

  ISSUE {
    string id
    string task_id
    string stage
    string title
    string description
    string status
    string created_by
    string assigned_to
    date created_at
    date resolved_at
  }

  INVOICE {
    string id
    string status
    number total_amount
    date created_at
    date submitted_at
    date approved_at
    date paid_at
    date closed_at
  }

  INVOICE_ITEM {
    string id
    string invoice_id
    string task_id
    number amount
  }
````

## File: modules/workspace-flow/Workspace-Flow-Events.mermaid
````
flowchart LR
  classDef command fill:#ecfeff,stroke:#0891b2,color:#083344,stroke-width:1.5px;
  classDef event fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:1.5px;
  classDef readmodel fill:#dcfce7,stroke:#16a34a,color:#052e16,stroke-width:1.5px;
  classDef note fill:#f8fafc,stroke:#64748b,color:#334155,stroke-dasharray: 6 4;

  subgraph TASK_EVENTS [Task Event Flow]
    direction LR
    task_commands[ASSIGN / SUBMIT_QA / PASS_QA / APPROVE_ACCEPTANCE / ARCHIVE]:::command --> task_events[Task lifecycle events]:::event --> task_read[Task summaries / workflow read model]:::readmodel
  end

  subgraph ISSUE_EVENTS [Issue Event Flow]
    direction LR
    issue_commands[START / FIX / SUBMIT_RETEST / PASS_RETEST / FAIL_RETEST / CLOSE]:::command --> issue_events[Issue lifecycle events]:::event --> issue_read[Issue queue / issue detail read model]:::readmodel
  end

  subgraph INVOICE_EVENTS [Invoice Event Flow]
    direction LR
    invoice_commands[SUBMIT / REVIEW / APPROVE / REJECT / PAY / CLOSE]:::command --> invoice_events[Invoice lifecycle events]:::event --> invoice_read[Invoice list / billing read model]:::readmodel
  end

  task_events -. opens or resumes .-> issue_commands
  task_events -. accepted tasks feed .-> invoice_commands
  note[This is a target event-flow view.<br/>It documents how workflow actions propagate into read models.]:::note
````

## File: modules/workspace-flow/Workspace-Flow-Lifecycle.mermaid
````
flowchart LR
  classDef phase fill:#eff6ff,stroke:#2563eb,color:#0f172a,stroke-width:2px;
  classDef side fill:#fff1f2,stroke:#e11d48,color:#0f172a,stroke-width:1.5px;
  classDef billing fill:#ecfdf5,stroke:#059669,color:#0f172a,stroke-width:1.5px;
  classDef note fill:#f8fafc,stroke:#64748b,color:#334155,stroke-dasharray: 6 4;

  task_created[Task Created]:::phase --> development[Development]:::phase --> qa[QA]:::phase --> acceptance[Acceptance]:::phase --> accepted[Accepted]:::phase --> archived[Archived]:::phase

  issue_loop[Issue lifecycle side loop<br/>open -> investigating -> fixing -> retest -> resolved -> closed]:::side
  qa -. defect found .-> issue_loop
  acceptance -. defect found .-> issue_loop
  issue_loop -. return to original stage .-> qa
  issue_loop -. return to original stage .-> acceptance

  billing_entry[Invoice Item Added]:::billing --> billing_flow[Invoice Draft -> Submitted -> Finance Review -> Approved -> Paid -> Closed]:::billing
  accepted --> billing_entry

  note[Lifecycle view combines the three state machines into one delivery narrative.]:::note
````

## File: modules/workspace-flow/Workspace-Flow-Permissions.mermaid
````
flowchart TB
  classDef actor fill:#eff6ff,stroke:#2563eb,color:#0f172a,stroke-width:2px;
  classDef action fill:#ecfeff,stroke:#0891b2,color:#083344,stroke-width:1.5px;
  classDef state fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:1.5px;
  classDef note fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-dasharray: 6 4;

  subgraph ACTORS [Suggested Workflow Actors]
    direction LR
    member[Task Assignee / Operator]:::actor
    qa[QA Reviewer]:::actor
    acceptance[Acceptance Reviewer]:::actor
    finance[Finance Reviewer]:::actor
  end

  subgraph TASK_PERMS [Task Permissions]
    direction LR
    draft[draft]:::state --> assign[ASSIGN]:::action --> in_progress[in_progress]:::state
    in_progress --> submit_qa[SUBMIT_QA]:::action --> qa_state[qa]:::state
    qa_state --> pass_qa[PASS_QA]:::action --> acceptance_state[acceptance]:::state
    acceptance_state --> approve_acc[APPROVE_ACCEPTANCE]:::action --> accepted[accepted]:::state
    accepted --> archive[ARCHIVE]:::action --> archived[archived]:::state
  end

  subgraph ISSUE_PERMS [Issue Permissions]
    direction LR
    open[open]:::state --> start[START]:::action --> investigating[investigating]:::state
    investigating --> fix[FIX]:::action --> fixing[fixing]:::state
    fixing --> submit_retest[SUBMIT_RETEST]:::action --> retest[retest]:::state
    retest --> pass_retest[PASS_RETEST]:::action --> resolved[resolved]:::state
    retest --> fail_retest[FAIL_RETEST]:::action --> fixing
    resolved --> close[CLOSE]:::action --> closed[closed]:::state
  end

  subgraph INVOICE_PERMS [Invoice Permissions]
    direction LR
    invoice_draft[invoice_draft]:::state --> submit_invoice[SUBMIT]:::action --> submitted[submitted]:::state
    submitted --> review[REVIEW]:::action --> finance_review[finance_review]:::state
    finance_review --> approve[APPROVE]:::action --> approved[approved]:::state
    finance_review --> reject[REJECT]:::action --> submitted
    approved --> pay[PAY]:::action --> paid[paid]:::state
    paid --> close_invoice[CLOSE]:::action --> invoice_closed[closed]:::state
  end

  member -. owns .-> assign
  member -. owns .-> submit_qa
  member -. owns .-> start
  member -. owns .-> fix
  member -. owns .-> submit_retest
  qa -. reviews .-> pass_qa
  qa -. reviews .-> pass_retest
  qa -. reports issues .-> start
  acceptance -. approves .-> approve_acc
  finance -. handles .-> submit_invoice
  finance -. handles .-> review
  finance -. handles .-> approve
  finance -. handles .-> reject
  finance -. handles .-> pay
  finance -. handles .-> close_invoice

  note[Permissions are target workflow guidance.<br/>Actual authorization enforcement must still live outside the diagram.]:::note
````

## File: modules/workspace-flow/Workspace-Flow-Sequence.mermaid
````
sequenceDiagram
  autonumber
  actor User
  participant UI as External UI
  participant API as workspace-flow/api
  participant App as Application Use Case
  participant Domain as Domain Rules
  participant Repo as Repository
  participant DB as Firestore

  User->>UI: Submit task to QA
  UI->>API: facade.submitTaskToQA(taskId)
  API->>App: SubmitTaskToQaUseCase.execute(taskId)
  App->>Repo: load task + open issues count
  Repo->>DB: read task / issues
  DB-->>Repo: task + issue count
  Repo-->>App: current state data
  App->>Domain: validate SUBMIT_QA transition
  Domain-->>App: transition allowed
  App->>Repo: persist task status = qa
  Repo->>DB: update tasks/{taskId}
  DB-->>Repo: updated
  Repo-->>App: task snapshot
  App-->>API: task summary
  API-->>UI: updated task summary

  User->>UI: Report issue during QA
  UI->>API: facade.openIssue(taskId, stage=qa)
  API->>App: OpenIssueUseCase.execute(...)
  App->>Repo: create issue
  Repo->>DB: write issues/{issueId}
  DB-->>Repo: created
  Repo-->>App: issue snapshot
  App-->>API: issue summary
  API-->>UI: issue opened

  User->>UI: Submit invoice
  UI->>API: facade.submitInvoice(invoiceId)
  API->>App: SubmitInvoiceUseCase.execute(invoiceId)
  App->>Repo: load invoice + item count
  Repo->>DB: read invoices + invoice_items
  DB-->>Repo: invoice + item count
  Repo-->>App: current state data
  App->>Domain: validate SUBMIT transition
  Domain-->>App: transition allowed
  App->>Repo: persist invoice status = submitted
  Repo->>DB: update invoices/{invoiceId}
  DB-->>Repo: updated
  Repo-->>App: invoice snapshot
  App-->>API: invoice summary
  API-->>UI: updated invoice summary
````

## File: modules/workspace-flow/Workspace-Flow-States.mermaid
````
stateDiagram-v2
  direction LR

  state "Task Flow" as TaskFlow {
    [*] --> draft
    draft --> in_progress: ASSIGN
    in_progress --> qa: SUBMIT_QA
    qa --> acceptance: PASS_QA / no open issues
    acceptance --> accepted: APPROVE_ACCEPTANCE / no open issues
    accepted --> archived: ARCHIVE / invoice closed or none
    archived --> [*]
  }

  state "Issue Flow" as IssueFlow {
    [*] --> open
    open --> investigating: START
    investigating --> fixing: FIX
    fixing --> retest: SUBMIT_RETEST
    retest --> resolved: PASS_RETEST
    retest --> fixing: FAIL_RETEST
    resolved --> closed: CLOSE
    closed --> [*]
  }

  state "Invoice Flow" as InvoiceFlow {
    [*] --> invoice_draft
    invoice_draft --> submitted: SUBMIT / item_count > 0
    submitted --> finance_review: REVIEW
    finance_review --> approved: APPROVE
    finance_review --> submitted: REJECT
    approved --> paid: PAY
    paid --> closed: CLOSE
    closed --> [*]
  }
````

## File: modules/workspace-flow/Workspace-Flow-Tree.mermaid
````
flowchart TB
	%% ==========================================================
	%% Workspace Flow Module Tree
	%% Goal: all external consumers enter through api/
	%% ==========================================================

	classDef root fill:#0f172a,stroke:#0f172a,color:#f8fafc,stroke-width:2px;
	classDef api fill:#dcfce7,stroke:#16a34a,color:#052e16,stroke-width:2px;
	classDef layer fill:#e2e8f0,stroke:#475569,color:#0f172a,stroke-width:1.5px;
	classDef file fill:#f8fafc,stroke:#94a3b8,color:#0f172a;
	classDef doc fill:#fff7ed,stroke:#ea580c,color:#7c2d12;
	classDef forbid fill:#fef2f2,stroke:#dc2626,color:#7f1d1d,stroke-dasharray: 6 4;
	classDef external fill:#ede9fe,stroke:#7c3aed,color:#2e1065;

	external_app[app routes / other modules / tests]:::external --> public_api

	subgraph WORKSPACE_FLOW [modules/workspace-flow]
		direction TB
		module_root[workspace-flow/]:::root

		subgraph PUBLIC [Public Boundary]
			direction TB
			public_api[api/]:::api
			public_api_index[index.ts<br/>only allowed cross-module entry]:::api
			public_facade[workspace-flow.facade.ts<br/>public facade for external consumers]:::file
			public_contracts[contracts.ts<br/>public summaries and public DTOs]:::file
			public_api --> public_api_index
			public_api --> public_facade
			public_api --> public_contracts
		end

		subgraph INTERNAL [Internal Layers]
			direction TB

			readme[README.md<br/>module rules and lifecycle summary]:::doc
			flow_doc[Workspace-Flow.mermaid<br/>state machine overview]:::doc
			tree_doc[Workspace-Flow-Tree.mermaid<br/>module tree and boundary rules]:::doc

			domain_layer[domain/]:::layer
			application_layer[application/]:::layer
			infrastructure_layer[infrastructure/]:::layer
			interfaces_layer[interfaces/]:::layer
			local_index[index.ts<br/>same-module convenience only]:::file

			subgraph DOMAIN [domain/]
				direction TB
				domain_entities[entities/]:::layer
				domain_events[events/]:::layer
				domain_value_objects[value-objects/]:::layer
				domain_services[services/]:::layer

				file_models[entities/Task.ts<br/>Issue.ts<br/>Invoice.ts<br/>InvoiceItem.ts]:::file
				file_core[value-objects/TaskId.ts<br/>TaskStatus.ts<br/>IssueStage.ts]:::file
				file_events[events/TaskEvent.ts<br/>IssueEvent.ts<br/>InvoiceEvent.ts]:::file
				file_transitions[services/task-transition-policy.ts<br/>issue-transition-policy.ts<br/>invoice-transition-policy.ts<br/>task-guards.ts<br/>invoice-guards.ts]:::file

				domain_entities --> file_models
				domain_value_objects --> file_core
				domain_events --> file_events
				domain_services --> file_transitions
			end

			subgraph APPLICATION [application/]
				direction TB
				application_dto[dto/]:::layer
				application_ports[ports/]:::layer
				application_use_cases[use-cases/]:::layer

				file_services[ports/TaskService.ts<br/>IssueService.ts<br/>InvoiceService.ts]:::file
				file_queries[dto/task-query.dto.ts<br/>issue-query.dto.ts<br/>invoice-query.dto.ts]:::file
				file_commands[dto/create-task.dto.ts<br/>open-issue.dto.ts<br/>add-invoice-item.dto.ts]:::file
				file_use_cases[use-cases/submit-task-to-qa.use-case.ts<br/>approve-task-acceptance.use-case.ts<br/>submit-invoice.use-case.ts]:::file

				application_ports --> file_services
				application_dto --> file_queries
				application_dto --> file_commands
				application_use_cases --> file_use_cases
			end

			subgraph INFRA [infrastructure/]
				direction TB
				infra_firebase[firebase/]:::layer
				infra_persistence[persistence/]:::layer
				infra_repositories[repositories/]:::layer
				file_firestore[firebase/workspace-flow.collections.ts<br/>COLLECTIONS + document mappings]:::file
				file_converters[firebase/task.converter.ts<br/>issue.converter.ts<br/>invoice.converter.ts]:::file
				file_repositories[repositories/FirebaseTaskRepository.ts<br/>FirebaseIssueRepository.ts<br/>FirebaseInvoiceRepository.ts]:::file
				infra_firebase --> file_firestore
				infra_firebase --> file_converters
				infra_repositories --> file_repositories
			end

			subgraph INTERFACES [interfaces/]
				direction TB
				interfaces_actions[_actions/]:::layer
				interfaces_contracts[contracts/]:::layer
				interfaces_queries[queries/]:::layer
				file_interface_contracts[contracts/workspace-flow.contract.ts]:::file
				file_interface_actions[_actions/workspace-flow.actions.ts]:::file
				file_interface_queries[queries/workspace-flow.queries.ts]:::file
				interface_note[optional module-local actions or query contracts<br/>product UI remains outside this module]:::doc
				interfaces_layer --> interfaces_actions
				interfaces_layer --> interfaces_contracts
				interfaces_layer --> interfaces_queries
				interfaces_actions --> file_interface_actions
				interfaces_contracts --> file_interface_contracts
				interfaces_queries --> file_interface_queries
				interfaces_layer --> interface_note
			end
		end

		module_root --> public_api
		module_root --> domain_layer
		module_root --> application_layer
		module_root --> infrastructure_layer
		module_root --> interfaces_layer
		module_root --> readme
		module_root --> flow_doc
		module_root --> tree_doc
		module_root --> local_index

		domain_layer --> DOMAIN
		application_layer --> APPLICATION
		infrastructure_layer --> INFRA
	end

	public_api_index --> application_layer
	application_layer --> domain_layer
	infrastructure_layer --> domain_layer
	interfaces_layer --> application_layer

	forbidden_domain[forbidden<br/>@/modules/workspace-flow/domain/*]:::forbid
	forbidden_application[forbidden<br/>@/modules/workspace-flow/application/*]:::forbid
	forbidden_infra[forbidden<br/>@/modules/workspace-flow/infrastructure/*]:::forbid
	forbidden_interfaces[forbidden<br/>@/modules/workspace-flow/interfaces/*]:::forbid
	forbidden_types[forbidden<br/>do not recreate legacy types/*]:::forbid

	external_app -. do not import .-> forbidden_domain
	external_app -. do not import .-> forbidden_application
	external_app -. do not import .-> forbidden_infra
	external_app -. do not import .-> forbidden_interfaces
	external_app -. do not import .-> forbidden_types

	note_boundary[Cross-module rule<br/>external consumers must import only via<br/>@/modules/workspace-flow/api]:::doc
	note_mapping[Legacy types/* files were migration-only<br/>the target structure is now the canonical design]:::doc

	note_boundary --> public_api_index
	note_mapping --> module_root
````

## File: modules/workspace-flow/Workspace-Flow-UI.mermaid
````
flowchart LR
	%% ==========================================================
	%% Workspace Flow UI Simulation
	%% UI is composed outside workspace-flow and consumes api only
	%% ==========================================================

	classDef page fill:#eff6ff,stroke:#2563eb,color:#0f172a,stroke-width:2px;
	classDef panel fill:#f8fafc,stroke:#64748b,color:#0f172a,stroke-width:1.5px;
	classDef action fill:#ecfeff,stroke:#0891b2,color:#083344,stroke-width:1.5px;
	classDef api fill:#dcfce7,stroke:#16a34a,color:#052e16,stroke-width:2px;
	classDef domain fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:1.5px;
	classDef rule fill:#fef2f2,stroke:#dc2626,color:#7f1d1d,stroke-dasharray: 6 4;

	subgraph EXTERNAL_UI [External UI Composition]
		direction TB

		subgraph WORKSPACE_PAGE [Workspace Flow Page]
			direction LR

			subgraph TASK_AREA [Task Workspace]
				direction TB
				task_page[Task Board Page]:::page
				task_list[Task List / Columns]:::panel
				task_detail[Task Detail Drawer]:::panel
				task_actions[Assign / Submit QA / Pass QA / Archive]:::action
				task_page --> task_list
				task_page --> task_detail
				task_detail --> task_actions
			end

			subgraph ISSUE_AREA [Issue Workspace]
				direction TB
				issue_page[Issue Tracker Page]:::page
				issue_list[Issue Queue]:::panel
				issue_detail[Issue Detail Drawer]:::panel
				issue_actions[Start / Fix / Submit Retest / Close]:::action
				issue_page --> issue_list
				issue_page --> issue_detail
				issue_detail --> issue_actions
			end

			subgraph INVOICE_AREA [Invoice Workspace]
				direction TB
				invoice_page[Invoice Review Page]:::page
				invoice_list[Invoice Draft / Review List]:::panel
				invoice_detail[Invoice Detail Drawer]:::panel
				invoice_actions[Add Item / Submit / Review / Approve / Pay]:::action
				invoice_page --> invoice_list
				invoice_page --> invoice_detail
				invoice_detail --> invoice_actions
			end
		end
	end

	subgraph PUBLIC_API [workspace-flow Public API]
		direction TB
		api_index[api/index.ts]:::api
		api_facade[api/workspace-flow.facade.ts]:::api
		api_contracts[api/contracts.ts]:::api
		api_index --> api_facade
		api_index --> api_contracts
	end

	subgraph INTERNAL_MODULE [workspace-flow Internal Logic]
		direction TB
		domain_logic[domain<br/>entities + events + guards + transitions]:::domain
		application_logic[application<br/>DTOs + ports + use cases]:::domain
		infrastructure_logic[infrastructure<br/>Firestore collections + converters + repositories]:::domain
		application_logic --> domain_logic
		infrastructure_logic --> domain_logic
	end

	task_list -->|read summaries| api_contracts
	task_detail -->|load task details| api_contracts
	task_actions -->|execute workflow commands| api_facade

	issue_list -->|read summaries| api_contracts
	issue_detail -->|load issue details| api_contracts
	issue_actions -->|execute workflow commands| api_facade

	invoice_list -->|read summaries| api_contracts
	invoice_detail -->|load invoice details| api_contracts
	invoice_actions -->|execute workflow commands| api_facade

	api_facade --> application_logic
	api_contracts --> application_logic

	forbidden_domain[Do not bind UI directly to<br/>domain/*]:::rule
	forbidden_application[Do not bind UI directly to<br/>application/*]:::rule
	forbidden_infrastructure[Do not bind UI directly to<br/>infrastructure/*]:::rule

	task_page -. forbidden direct dependency .-> forbidden_domain
	issue_page -. forbidden direct dependency .-> forbidden_application
	invoice_page -. forbidden direct dependency .-> forbidden_infrastructure
````

## File: modules/workspace-flow/Workspace-Flow.mermaid
````
flowchart TB
  %% ==========================================================
  %% Workspace Flow
  %% Canonical state-machine documentation for workspace-flow
  %% This diagram documents the target logic module
  %% Legacy types/* files were migration input only and have been removed
  %% ==========================================================

  classDef task fill:#e8f3ff,stroke:#2563eb,stroke-width:2px,color:#0f172a;
  classDef issue fill:#fff1f2,stroke:#e11d48,stroke-width:2px,color:#0f172a;
  classDef invoice fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#0f172a;
  classDef data fill:#fff7ed,stroke:#ea580c,stroke-width:1.5px,color:#0f172a;
  classDef rule fill:#f8fafc,stroke:#64748b,stroke-dasharray: 5 5,color:#334155;

  subgraph TASK_FLOW [Task State Machine]
    direction LR
    task_start((Start)):::rule --> task_draft[draft]:::task
    task_draft -->|ASSIGN<br/>assignee: UserId| task_in_progress[in_progress]:::task
    task_in_progress -->|SUBMIT_QA| task_qa[qa]:::task
    task_qa -->|PASS_QA<br/>guard: no open issues| task_acceptance[acceptance]:::task
    task_acceptance -->|APPROVE_ACCEPTANCE<br/>guard: no open issues| task_accepted[accepted]:::task
    task_accepted -->|ARCHIVE<br/>guard: invoice closed or none| task_archived[archived]:::task
  end

  subgraph ISSUE_FLOW [Issue State Machine]
    direction LR
    issue_start((Start)):::rule --> issue_open[open]:::issue
    issue_open -->|START| issue_investigating[investigating]:::issue
    issue_investigating -->|FIX| issue_fixing[fixing]:::issue
    issue_fixing -->|SUBMIT_RETEST| issue_retest[retest]:::issue
    issue_retest -->|PASS_RETEST| issue_resolved[resolved]:::issue
    issue_retest -->|FAIL_RETEST| issue_fixing
    issue_resolved -->|CLOSE| issue_closed[closed]:::issue
  end

  subgraph INVOICE_FLOW [Invoice State Machine]
    direction LR
    invoice_start((Start)):::rule --> invoice_draft[invoice_draft]:::invoice
    invoice_draft -->|SUBMIT<br/>guard: item_count > 0| invoice_submitted[submitted]:::invoice
    invoice_submitted -->|REVIEW| invoice_finance_review[finance_review]:::invoice
    invoice_finance_review -->|APPROVE| invoice_approved[approved]:::invoice
    invoice_finance_review -->|REJECT<br/>reason: string| invoice_submitted
    invoice_approved -->|PAY<br/>paid_at: Date| invoice_paid[paid]:::invoice
    invoice_paid -->|CLOSE| invoice_closed[closed]:::invoice
  end

  subgraph CROSS_FLOW [Cross-Flow Relations]
    direction TB
    open_issue_rule[任何節點發現問題<br/>開 Issue，不回退 Task]:::rule
    resume_rule[Issue resolved 後<br/>依 Issue.stage 回到原節點繼續]:::rule
    invoice_item[InvoiceItem<br/>invoice_id + task_id + amount<br/>只允許 accepted Task 加入]:::data
    api_rule[外界只能透過 api 使用 workspace-flow<br/>UI 在模組外部自行組裝]:::rule
  end

  subgraph STORAGE [Firestore Collections]
    direction TB
    tasks_doc[tasks<br/>TaskDoc = Omit<Task, id>]:::data
    issues_doc[issues<br/>IssueDoc = Omit<Issue, id>]:::data
    invoices_doc[invoices<br/>InvoiceDoc = Omit<Invoice, id>]:::data
    invoice_items_doc[invoice_items<br/>InvoiceItemDoc = Omit<InvoiceItem, id>]:::data
  end

  task_qa -. open issue<br/>stage: qa .-> issue_open
  task_acceptance -. open issue<br/>stage: acceptance .-> issue_open
  invoice_finance_review -. open issue<br/>stage: finance .-> issue_open

  issue_resolved -. if stage = qa .-> task_qa
  issue_resolved -. if stage = acceptance .-> task_acceptance
  issue_resolved -. if stage = finance .-> invoice_finance_review

  task_accepted -. eligible for billing .-> invoice_item
  invoice_item -. belongs to .-> invoice_draft

  task_archived -. persisted as .-> tasks_doc
  issue_closed -. persisted as .-> issues_doc
  invoice_closed -. persisted as .-> invoices_doc
  invoice_item -. persisted as .-> invoice_items_doc

  open_issue_rule -. applies to .-> task_qa
  open_issue_rule -. applies to .-> task_acceptance
  open_issue_rule -. applies to .-> invoice_finance_review
  resume_rule -. explains .-> issue_resolved
  api_rule -. governs .-> task_draft
  api_rule -. governs .-> invoice_draft
````

## File: modules/workspace-scheduling/api/index.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer for the WorkDemand API contract.
 *
 * Other modules and UI layers import schemas and types from here.
 * Direct imports into domain/, application/, or infrastructure/ are forbidden.
 */
````

## File: modules/workspace-scheduling/api/schema.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: api/schema
 * Purpose: Zod validation schemas for WorkDemand commands.
 *
 * This is the boundary guard — all input from UI must be validated here
 * before reaching the application layer.
 */
import { z } from "@lib-zod";
// ── CreateDemand ──────────────────────────────────────────────────────────────
⋮----
export type CreateDemandInput = z.infer<typeof CreateDemandSchema>;
// ── AssignMember ──────────────────────────────────────────────────────────────
⋮----
export type AssignMemberInput = z.infer<typeof AssignMemberSchema>;
````

## File: modules/workspace-scheduling/application/work-demand.use-cases.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: application/use-cases
 * Purpose: Application services — orchestrate domain logic.
 *
 * Each use case is a pure function of its inputs and the repository port.
 * No framework dependencies; no direct DB calls.
 */
import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";
import type { WorkDemand } from "../domain/types";
import type { IDemandRepository } from "../domain/repository";
import type { CreateDemandInput, AssignMemberInput } from "../api/schema";
// ── SubmitDemand ──────────────────────────────────────────────────────────────
export class SubmitWorkDemandUseCase {
⋮----
constructor(private readonly repo: IDemandRepository)
async execute(input: CreateDemandInput): Promise<CommandResult>
⋮----
// ── AssignMember ──────────────────────────────────────────────────────────────
export class AssignWorkDemandUseCase {
⋮----
async execute(input: AssignMemberInput): Promise<CommandResult>
⋮----
// ── ListWorkspaceDemands ──────────────────────────────────────────────────────
export class ListWorkspaceDemandsUseCase {
⋮----
async execute(workspaceId: string): Promise<WorkDemand[]>
⋮----
// ── ListAccountDemands ────────────────────────────────────────────────────────
export class ListAccountDemandsUseCase {
⋮----
async execute(accountId: string): Promise<WorkDemand[]>
````

## File: modules/workspace-scheduling/domain/repository.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: domain/repository
 * Purpose: IDemandRepository port — implemented by infrastructure adapters.
 *
 * Domain must NOT depend on Firebase SDK, HTTP clients, or any framework.
 */
import type { WorkDemand } from "./types";
export interface IDemandRepository {
  /** List all demands for a specific workspace (tenant view). */
  listByWorkspace(workspaceId: string): Promise<WorkDemand[]>;
  /** List all demands across all workspaces for an account (manager view). */
  listByAccount(accountId: string): Promise<WorkDemand[]>;
  /** Persist a new demand. */
  save(demand: WorkDemand): Promise<void>;
  /** Update an existing demand. */
  update(demand: WorkDemand): Promise<void>;
  /** Find a single demand by ID. */
  findById(id: string): Promise<WorkDemand | null>;
}
⋮----
/** List all demands for a specific workspace (tenant view). */
listByWorkspace(workspaceId: string): Promise<WorkDemand[]>;
/** List all demands across all workspaces for an account (manager view). */
listByAccount(accountId: string): Promise<WorkDemand[]>;
/** Persist a new demand. */
save(demand: WorkDemand): Promise<void>;
/** Update an existing demand. */
update(demand: WorkDemand): Promise<void>;
/** Find a single demand by ID. */
findById(id: string): Promise<WorkDemand | null>;
````

## File: modules/workspace-scheduling/domain/types.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: domain
 * Purpose: Core WorkDemand entity and value types.
 *
 * Occam's Razor: minimal essential entities only.
 * No external dependencies — pure TypeScript.
 */
// ── Status ────────────────────────────────────────────────────────────────────
export type DemandStatus = "draft" | "open" | "in_progress" | "completed";
⋮----
// ── Priority ──────────────────────────────────────────────────────────────────
export type DemandPriority = "low" | "medium" | "high";
⋮----
// ── Aggregate root: WorkDemand ────────────────────────────────────────────────
/**
 * WorkDemand aggregate root.
 * Represents a scheduled work request from a Workspace to the Account.
 *
 * Inspired by Postiz "Launch" concept — a demand is a unit of work
 * scheduled for a target date, with status progression.
 */
export interface WorkDemand {
  readonly id: string;
  /** Tenant scoping: which workspace raised this demand. */
  readonly workspaceId: string;
  /** Account (organisation) this demand belongs to. */
  readonly accountId: string;
  /** User ID of whoever created this demand. */
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly status: DemandStatus;
  readonly priority: DemandPriority;
  /**
   * Target date for the demand (ISO date string, e.g. "2026-04-15").
   * Rendered on the calendar widget.
   */
  readonly scheduledAt: string;
  /** Account-level member assigned to handle this demand. */
  readonly assignedUserId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/** Tenant scoping: which workspace raised this demand. */
⋮----
/** Account (organisation) this demand belongs to. */
⋮----
/** User ID of whoever created this demand. */
⋮----
/**
   * Target date for the demand (ISO date string, e.g. "2026-04-15").
   * Rendered on the calendar widget.
   */
⋮----
/** Account-level member assigned to handle this demand. */
⋮----
// ── Commands ──────────────────────────────────────────────────────────────────
export interface CreateWorkDemandCommand {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
}
export interface AssignWorkDemandCommand {
  readonly demandId: string;
  readonly assignedUserId: string;
  readonly assignedBy: string;
}
// ── Domain Events ─────────────────────────────────────────────────────────────
export type WorkDemandCreatedEvent = {
  readonly type: "WORK_DEMAND_CREATED";
  readonly payload: { readonly demandId: string; readonly workspaceId: string };
};
export type WorkDemandAssignedEvent = {
  readonly type: "WORK_DEMAND_ASSIGNED";
  readonly payload: {
    readonly demandId: string;
    readonly assignedUserId: string;
    readonly assignedBy: string;
  };
};
export type WorkDemandDomainEvent =
  | WorkDemandCreatedEvent
  | WorkDemandAssignedEvent;
````

## File: modules/workspace-scheduling/index.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: module/barrel (public API)
 *
 * External modules MUST import from here ONLY.
 * Never import from domain/, application/, infrastructure/, or interfaces/
 * sub-paths directly.
 *
 * Boundary rule: keep exports minimal (Occam's Razor).
 */
// ── Domain: entity types (read-only exports) ──────────────────────────────────
⋮----
// ── API: schema types ─────────────────────────────────────────────────────────
⋮----
// ── Interfaces: UI components ─────────────────────────────────────────────────
⋮----
// ── Interfaces: server actions ────────────────────────────────────────────────
⋮----
// ── Interfaces: queries ───────────────────────────────────────────────────────
````

## File: modules/workspace-scheduling/infrastructure/firebase/FirebaseDemandRepository.ts
````typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { WorkDemand } from "../../domain/types";
import type { IDemandRepository } from "../../domain/repository";
⋮----
function toWorkDemand(id: string, data: Record<string, unknown>): WorkDemand
export class FirebaseDemandRepository implements IDemandRepository {
⋮----
private get collectionRef()
async listByWorkspace(workspaceId: string): Promise<WorkDemand[]>
async listByAccount(accountId: string): Promise<WorkDemand[]>
async save(demand: WorkDemand): Promise<void>
async update(demand: WorkDemand): Promise<void>
async findById(id: string): Promise<WorkDemand | null>
````

## File: modules/workspace-scheduling/infrastructure/mock-demand-repository.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: infrastructure/mock
 * Purpose: In-memory mock implementation of IDemandRepository.
 *
 * This mock demonstrates the architectural boundary without requiring
 * a live Firebase connection. Swap with FirebaseDemandRepository
 * when persisting to Firestore.
 */
import type { WorkDemand } from "../domain/types";
import type { IDemandRepository } from "../domain/repository";
⋮----
export class MockDemandRepository implements IDemandRepository {
⋮----
async listByWorkspace(workspaceId: string): Promise<WorkDemand[]>
async listByAccount(accountId: string): Promise<WorkDemand[]>
async save(demand: WorkDemand): Promise<void>
async update(demand: WorkDemand): Promise<void>
async findById(id: string): Promise<WorkDemand | null>
````

## File: modules/workspace-scheduling/interfaces/_actions/work-demand.actions.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: interfaces/_actions
 * Purpose: Server Actions — the authorised write surface for the UI.
 *
 * UI MUST call these actions for all mutations.
 * They validate input, invoke use cases, and return CommandResult.
 */
import type { CommandResult } from "@shared-types";
import { commandFailureFrom } from "@shared-types";
import { CreateDemandSchema, AssignMemberSchema } from "../../api/schema";
import type { CreateDemandInput, AssignMemberInput } from "../../api/schema";
import {
  SubmitWorkDemandUseCase,
  AssignWorkDemandUseCase,
} from "../../application/work-demand.use-cases";
import { FirebaseDemandRepository } from "../../infrastructure/firebase/FirebaseDemandRepository";
function makeRepo()
export async function submitWorkDemand(raw: CreateDemandInput): Promise<CommandResult>
export async function assignWorkDemand(raw: AssignMemberInput): Promise<CommandResult>
````

## File: modules/workspace-scheduling/interfaces/AccountSchedulingView.tsx
````typescript
/**
 * Module: workspace-scheduling
 * Layer: interfaces
 * Purpose: Account (manager) view — overview of all workspace demands.
 *
 * Occam's Razor: grouped card view by workspace.
 * Manager can assign a member to any demand from this panel.
 */
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Users } from "lucide-react";
import type { WorkDemand } from "../domain/types";
import { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../domain/types";
import { assignWorkDemand } from "./_actions/work-demand.actions";
import { getAccountDemands } from "./queries/work-demand.queries";
// ── Sub-types ─────────────────────────────────────────────────────────────────
export interface AccountMember {
  id: string;
  name: string;
}
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
// ── Props ─────────────────────────────────────────────────────────────────────
interface AccountSchedulingViewProps {
  readonly accountId: string;
  /** Current actor (manager) ID used as assignedBy. */
  readonly currentUserId: string;
  /** List of account-level members available for assignment. */
  readonly availableMembers?: AccountMember[];
}
⋮----
/** Current actor (manager) ID used as assignedBy. */
⋮----
/** List of account-level members available for assignment. */
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
async function handleAssign(demandId: string, userId: string)
// Group demands by workspaceId for columnar layout
⋮----
{/* ── Header ─────────────────────────────────────────────────────── */}
⋮----
{/* ── Per-workspace columns ──────────────────────────────────────── */}
⋮----
{/* Row 1: title + priority dot */}
⋮----
{/* Row 2: status + date */}
⋮----
{/* Row 3: assign member */}
⋮----
{/* ── Refresh button ─────────────────────────────────────────────── */}
````

## File: modules/workspace-scheduling/interfaces/components/CalendarWidget.tsx
````typescript
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
 */
import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "@lib-date-fns";
import { Button } from "@ui-shadcn/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WorkDemand } from "../../domain/types";
import { DEMAND_STATUS_LABELS } from "../../domain/types";
// ── Types ─────────────────────────────────────────────────────────────────────
interface CalendarWidgetProps {
  demands: WorkDemand[];
  /** Called when the user clicks an empty day cell to schedule a new demand. */
  onDayClick?: (date: Date) => void;
}
⋮----
/** Called when the user clicks an empty day cell to schedule a new demand. */
⋮----
// ── Helpers ───────────────────────────────────────────────────────────────────
⋮----
{/* Day number */}
⋮----
{/* Demand dots / chips */}
⋮----
// ── CalendarWidget ────────────────────────────────────────────────────────────
⋮----
// All days in the current month
⋮----
// Leading empty cells to align the first day to the correct weekday column
⋮----
// Build demand-by-date lookup for O(1) access
⋮----
const key = d.scheduledAt.slice(0, 10); // "YYYY-MM-DD"
⋮----
function getDayDemands(day: Date): WorkDemand[]
// Build legend for the status colours
⋮----
{/* ── Header ─────────────────────────────────────────────────────── */}
⋮----
{/* ── Status legend ──────────────────────────────────────────────── */}
⋮----
{/* ── Calendar grid ──────────────────────────────────────────────── */}
⋮----
{/* Weekday headers */}
⋮----
key=
⋮----
dayDemands=
````

## File: modules/workspace-scheduling/interfaces/components/CreateDemandForm.tsx
````typescript
/**
 * Module: workspace-scheduling
 * Layer: interfaces/components
 * Purpose: Quick-capture form for creating a new WorkDemand.
 *
 * Inspired by Postiz's "Schedule Post" dialog — focused, minimal,
 * opens when the user clicks a calendar day or "New Demand" button.
 */
import { useState } from "react";
import { format } from "@lib-date-fns";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { DEMAND_PRIORITY_LABELS } from "../../domain/types";
import type { DemandPriority } from "../../domain/types";
// ── Types ─────────────────────────────────────────────────────────────────────
export interface CreateDemandFormValues {
  title: string;
  description: string;
  priority: DemandPriority;
  scheduledAt: string; // "YYYY-MM-DD"
}
⋮----
scheduledAt: string; // "YYYY-MM-DD"
⋮----
interface CreateDemandFormProps {
  open: boolean;
  /** Pre-fill the scheduled date (e.g. from a calendar day click). */
  initialDate?: Date;
  onClose: () => void;
  onSubmit: (values: CreateDemandFormValues) => Promise<void>;
}
⋮----
/** Pre-fill the scheduled date (e.g. from a calendar day click). */
⋮----
// ── Form ──────────────────────────────────────────────────────────────────────
⋮----
// Re-sync date when the prop changes (e.g. user clicks a different day)
const handleOpen = (isOpen: boolean) =>
function handleClose()
async function handleSubmit(e: React.FormEvent)
⋮----
{/* Title */}
⋮----
onChange=
⋮----
{/* Description */}
⋮----
{/* Priority + Date row */}
⋮----
{/* Error message */}
````

## File: modules/workspace-scheduling/interfaces/queries/work-demand.queries.ts
````typescript
/**
 * Module: workspace-scheduling
 * Layer: interfaces/queries
 * Purpose: Read-side query helpers for WorkDemand.
 *
 * These are plain async functions callable from Server Components,
 * server actions, or wrapped in client hooks.
 */
import type { WorkDemand } from "../../domain/types";
import {
  ListWorkspaceDemandsUseCase,
  ListAccountDemandsUseCase,
} from "../../application/work-demand.use-cases";
import { FirebaseDemandRepository } from "../../infrastructure/firebase/FirebaseDemandRepository";
function makeRepo()
export async function getWorkspaceDemands(workspaceId: string): Promise<WorkDemand[]>
export async function getAccountDemands(accountId: string): Promise<WorkDemand[]>
````

## File: modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx
````typescript
/**
 * Module: workspace-scheduling
 * Layer: interfaces
 * Purpose: Workspace (tenant) view — submit demands, view own schedule.
 *
 * Occam's Razor: calendar + quick-capture form only.
 * No complex state machines — useState + server actions.
 */
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Plus } from "lucide-react";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import type { WorkDemand } from "../domain/types";
import { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../domain/types";
import { submitWorkDemand } from "./_actions/work-demand.actions";
import { getWorkspaceDemands } from "./queries/work-demand.queries";
import { CalendarWidget } from "./components/CalendarWidget";
import { CreateDemandForm } from "./components/CreateDemandForm";
import type { CreateDemandFormValues } from "./components/CreateDemandForm";
// ── Status badge variant ──────────────────────────────────────────────────────
⋮----
// ── Props ─────────────────────────────────────────────────────────────────────
interface WorkspaceSchedulingTabProps {
  readonly workspace: WorkspaceEntity;
  /** Account ID for scoping demands. */
  readonly accountId: string;
  /** ID of the current user (requesterId). */
  readonly currentUserId: string;
}
⋮----
/** Account ID for scoping demands. */
⋮----
/** ID of the current user (requesterId). */
⋮----
// ── Component ─────────────────────────────────────────────────────────────────
⋮----
function handleDayClick(date: Date)
function handleNewDemand()
async function handleSubmit(values: CreateDemandFormValues)
⋮----
{/* ── Header ─────────────────────────────────────────────────────── */}
⋮----
{/* ── Calendar ───────────────────────────────────────────────────── */}
⋮----
{/* ── Demand list ────────────────────────────────────────────────── */}
⋮----
{/* ── Create form dialog ─────────────────────────────────────────── */}
````

## File: modules/workspace/application/use-cases/workspace-member.use-cases.ts
````typescript
import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMember";
import type { WorkspaceQueryRepository } from "../../domain/repositories/WorkspaceQueryRepository";
export class FetchWorkspaceMembersUseCase {
⋮----
constructor(private readonly workspaceQueryRepo: WorkspaceQueryRepository)
execute(workspaceId: string): Promise<WorkspaceMemberView[]>
````

## File: modules/workspace/application/use-cases/workspace.use-cases.ts
````typescript
/**
 * Workspace Use Cases — pure business workflows.
 * No React, no Firebase, no UI framework.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/entities/Workspace";
// ─── Create Workspace ─────────────────────────────────────────────────────────
export class CreateWorkspaceUseCase {
⋮----
constructor(private readonly workspaceRepo: WorkspaceRepository)
async execute(command: CreateWorkspaceCommand): Promise<CommandResult>
⋮----
// ─── Create Workspace with Capabilities ──────────────────────────────────────
export class CreateWorkspaceWithCapabilitiesUseCase {
⋮----
async execute(
    command: CreateWorkspaceCommand,
    capabilities: Capability[] = [],
): Promise<CommandResult>
⋮----
// ─── Update Settings ──────────────────────────────────────────────────────────
export class UpdateWorkspaceSettingsUseCase {
⋮----
async execute(command: UpdateWorkspaceSettingsCommand): Promise<CommandResult>
⋮----
// ─── Delete Workspace ─────────────────────────────────────────────────────────
export class DeleteWorkspaceUseCase {
⋮----
async execute(workspaceId: string): Promise<CommandResult>
⋮----
// ─── Mount Capabilities ───────────────────────────────────────────────────────
export class MountCapabilitiesUseCase {
⋮----
async execute(workspaceId: string, capabilities: Capability[]): Promise<CommandResult>
⋮----
// ─── Grant Team Access ────────────────────────────────────────────────────────
export class GrantTeamAccessUseCase {
⋮----
async execute(workspaceId: string, teamId: string): Promise<CommandResult>
⋮----
// ─── Grant Individual Access ──────────────────────────────────────────────────
export class GrantIndividualAccessUseCase {
⋮----
async execute(workspaceId: string, grant: WorkspaceGrant): Promise<CommandResult>
⋮----
// ─── Create Location ──────────────────────────────────────────────────────────
export class CreateWorkspaceLocationUseCase {
⋮----
async execute(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult>
````

## File: modules/workspace/domain/entities/WikiContentTree.ts
````typescript
/**
 * Module: workspace
 * Layer: domain/entities
 * Purpose: Wiki content-tree navigation types — the sidebar/overview tree
 *          built from workspace membership. Lives in workspace because the tree
 *          is anchored to account→workspace hierarchy.
 */
export type WikiAccountType = "personal" | "organization";
export interface WikiWorkspaceRef {
  id: string;
  name: string;
}
export interface WikiContentItemNode {
  key: "spaces" | "pages" | "libraries" | "documents" | "vector-index" | "rag" | "ai-tools";
  label: string;
  href: string;
  enabled: boolean;
}
export interface WikiWorkspaceContentNode {
  workspaceId: string;
  workspaceName: string;
  href: string;
  contentBaseItems: WikiContentItemNode[];
}
export interface WikiAccountContentNode {
  accountId: string;
  accountName: string;
  accountType: WikiAccountType;
  isActive: boolean;
  membersHref?: string;
  teamsHref?: string;
  workspaces: WikiWorkspaceContentNode[];
}
export interface WikiAccountSeed {
  accountId: string;
  accountName: string;
  accountType: WikiAccountType;
  isActive: boolean;
}
````

## File: modules/workspace/domain/entities/Workspace.ts
````typescript
/**
 * Workspace Domain Entities — pure TypeScript, zero framework dependencies.
 */
import type { Timestamp } from "@shared-types";
export type WorkspaceLifecycleState = "preparatory" | "active" | "stopped";
export interface WorkspacePersonnel {
  managerId?: string;
  supervisorId?: string;
  safetyOfficerId?: string;
}
export interface CapabilitySpec {
  id: string;
  name: string;
  type: "ui" | "api" | "data" | "governance" | "monitoring";
  status: "stable" | "beta";
  description: string;
}
export interface Capability extends CapabilitySpec {
  config?: object;
}
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  details?: string;
}
export interface WorkspaceLocation {
  locationId: string;
  label: string;
  description?: string;
  capacity?: number;
}
export type WorkspaceVisibility = "visible" | "hidden";
export interface WorkspaceGrant {
  userId?: string;
  teamId?: string;
  role: string;
  protocol?: string;
}
export interface WorkspaceEntity {
  id: string;
  name: string;
  photoURL?: string;
  lifecycleState: WorkspaceLifecycleState;
  visibility: WorkspaceVisibility;
  accountId: string;
  accountType: "user" | "organization";
  capabilities: Capability[];
  grants: WorkspaceGrant[];
  teamIds: string[];
  address?: Address;
  locations?: WorkspaceLocation[];
  personnel?: WorkspacePersonnel;
  createdAt: Timestamp;
}
// ─── Commands ─────────────────────────────────────────────────────────────────
export interface CreateWorkspaceCommand {
  readonly name: string;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
}
export interface UpdateWorkspaceSettingsCommand {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name?: string;
  readonly visibility?: WorkspaceVisibility;
  readonly lifecycleState?: WorkspaceLifecycleState;
  readonly address?: Address;
  readonly personnel?: WorkspacePersonnel;
}
````

## File: modules/workspace/domain/entities/WorkspaceMember.ts
````typescript
/**
 * Workspace member read models — pure TypeScript projections for workspace access views.
 */
export type WorkspaceMemberPresence = "active" | "away" | "offline" | "unknown";
export type WorkspaceMemberAccessSource = "owner" | "direct" | "team" | "personnel";
export interface WorkspaceMemberAccessChannel {
  readonly source: WorkspaceMemberAccessSource;
  readonly label: string;
  readonly role?: string;
  readonly protocol?: string;
  readonly teamId?: string;
}
export interface WorkspaceMemberView {
  readonly id: string;
  readonly displayName: string;
  readonly email?: string;
  readonly organizationRole?: string;
  readonly presence: WorkspaceMemberPresence;
  readonly isExternal: boolean;
  readonly accessChannels: WorkspaceMemberAccessChannel[];
}
````

## File: modules/workspace/domain/repositories/WikiWorkspaceRepository.ts
````typescript
/**
 * Module: workspace
 * Layer: domain/repositories
 * Purpose: Repository port for fetching workspace refs used by the
 *          Wiki content-tree use-case.
 */
import type { WikiWorkspaceRef } from "../entities/WikiContentTree";
export interface WikiWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]>;
}
⋮----
listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]>;
````

## File: modules/workspace/domain/repositories/WorkspaceQueryRepository.ts
````typescript
/**
 * WorkspaceQueryRepository — Port for workspace read projections.
 */
import type { WorkspaceMemberView } from "../entities/WorkspaceMember";
import type { WorkspaceEntity } from "../entities/Workspace";
export type Unsubscribe = () => void;
export interface WorkspaceQueryRepository {
  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): Unsubscribe;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
}
⋮----
subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): Unsubscribe;
getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
````

## File: modules/workspace/domain/repositories/WorkspaceRepository.ts
````typescript
/**
 * WorkspaceRepository — Port for workspace persistence.
 */
import type {
  WorkspaceEntity,
  Capability,
  WorkspaceGrant,
  UpdateWorkspaceSettingsCommand,
  WorkspaceLocation,
} from "../entities/Workspace";
export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
  findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null>;
  findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]>;
  save(workspace: WorkspaceEntity): Promise<string>;
  updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void>;
  delete(id: string): Promise<void>;
  // Capabilities
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>;
  unmountCapability(workspaceId: string, capabilityId: string): Promise<void>;
  // Access Grants
  grantTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  revokeTeamAccess(workspaceId: string, teamId: string): Promise<void>;
  grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void>;
  revokeIndividualAccess(workspaceId: string, userId: string): Promise<void>;
  // Locations
  createLocation(workspaceId: string, location: Omit<WorkspaceLocation, "locationId">): Promise<string>;
  updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void>;
  deleteLocation(workspaceId: string, locationId: string): Promise<void>;
}
⋮----
findById(id: string): Promise<WorkspaceEntity | null>;
findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null>;
findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]>;
save(workspace: WorkspaceEntity): Promise<string>;
updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void>;
delete(id: string): Promise<void>;
// Capabilities
mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>;
unmountCapability(workspaceId: string, capabilityId: string): Promise<void>;
// Access Grants
grantTeamAccess(workspaceId: string, teamId: string): Promise<void>;
revokeTeamAccess(workspaceId: string, teamId: string): Promise<void>;
grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void>;
revokeIndividualAccess(workspaceId: string, userId: string): Promise<void>;
// Locations
createLocation(workspaceId: string, location: Omit<WorkspaceLocation, "locationId">): Promise<string>;
updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void>;
deleteLocation(workspaceId: string, locationId: string): Promise<void>;
````

## File: modules/workspace/index.ts
````typescript
/**
 * workspace module public API
 */
````

## File: modules/workspace/infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts
````typescript
import { FirebaseWorkspaceRepository } from "./FirebaseWorkspaceRepository";
import type { WikiWorkspaceRepository } from "../../domain/repositories/WikiWorkspaceRepository";
import type { WikiWorkspaceRef } from "../../domain/entities/WikiContentTree";
⋮----
export class FirebaseWikiWorkspaceRepository implements WikiWorkspaceRepository {
⋮----
async listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]>
````

## File: modules/workspace/infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts
````typescript
import type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../../domain/entities/WorkspaceMember";
import type { WorkspaceQueryRepository } from "../../domain/repositories/WorkspaceQueryRepository";
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import {
  organizationApi,
  type OrganizationMemberDTO,
  type OrganizationTeamDTO,
} from "@/modules/organization/api";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { FirebaseWorkspaceRepository, toWorkspaceEntity } from "./FirebaseWorkspaceRepository";
⋮----
function toPresence(value: OrganizationMemberDTO["presence"] | undefined): WorkspaceMemberPresence
function createFallbackMember(id: string): WorkspaceMemberView
export class FirebaseWorkspaceQueryRepository implements WorkspaceQueryRepository {
⋮----
private get db()
⋮----
subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
)
async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>
⋮----
const mergeMember = (
      memberId: string,
      channel: WorkspaceMemberAccessChannel,
      orgMember?: OrganizationMemberDTO,
) =>
⋮----
const mergeTeam = (team: OrganizationTeamDTO, role?: string, protocol?: string) =>
````

## File: modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository.ts
````typescript
/**
 * FirebaseWorkspaceRepository — Infrastructure adapter for workspace persistence.
 * Translates Firestore documents ↔ Domain WorkspaceEntity.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  documentId,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import type {
  WorkspaceEntity,
  Capability,
  WorkspaceGrant,
  UpdateWorkspaceSettingsCommand,
  WorkspaceLocation,
} from "../../domain/entities/Workspace";
// ─── Mapper ───────────────────────────────────────────────────────────────────
⋮----
export function toWorkspaceEntity(id: string, data: Record<string, unknown>): WorkspaceEntity
// ─── Repository ───────────────────────────────────────────────────────────────
export class FirebaseWorkspaceRepository implements WorkspaceRepository {
⋮----
private get db()
async findById(id: string): Promise<WorkspaceEntity | null>
async findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null>
async findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]>
async save(workspace: WorkspaceEntity): Promise<string>
async updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void>
async delete(id: string): Promise<void>
async mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>
async unmountCapability(workspaceId: string, capabilityId: string): Promise<void>
async grantTeamAccess(workspaceId: string, teamId: string): Promise<void>
async revokeTeamAccess(workspaceId: string, teamId: string): Promise<void>
async grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void>
async revokeIndividualAccess(workspaceId: string, userId: string): Promise<void>
async createLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
): Promise<string>
async updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void>
async deleteLocation(workspaceId: string, locationId: string): Promise<void>
````

## File: modules/workspace/interfaces/_actions/workspace.actions.ts
````typescript
/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithCapabilitiesUseCase,
  UpdateWorkspaceSettingsUseCase,
  DeleteWorkspaceUseCase,
  MountCapabilitiesUseCase,
  GrantTeamAccessUseCase,
  GrantIndividualAccessUseCase,
  CreateWorkspaceLocationUseCase,
} from "../../application/use-cases/workspace.use-cases";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../../domain/entities/Workspace";
⋮----
export async function createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult>
export async function createWorkspaceWithCapabilities(
  command: CreateWorkspaceCommand,
  capabilities: Capability[],
): Promise<CommandResult>
export async function updateWorkspaceSettings(
  command: UpdateWorkspaceSettingsCommand,
): Promise<CommandResult>
export async function deleteWorkspace(workspaceId: string): Promise<CommandResult>
export async function mountCapabilities(
  workspaceId: string,
  capabilities: Capability[],
): Promise<CommandResult>
export async function authorizeWorkspaceTeam(
  workspaceId: string,
  teamId: string,
): Promise<CommandResult>
export async function grantIndividualWorkspaceAccess(
  workspaceId: string,
  grant: WorkspaceGrant,
): Promise<CommandResult>
export async function createWorkspaceLocation(
  workspaceId: string,
  location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult>
````

## File: modules/workspace/interfaces/components/WorkspaceDailyTab.tsx
````typescript
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace-feed/api";
interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}
export function WorkspaceDailyTab(
````

## File: modules/workspace/interfaces/components/WorkspaceMembersTab.tsx
````typescript
import { useEffect, useMemo, useState } from "react";
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMember";
import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { getWorkspaceMembers } from "../queries/workspace-member.queries";
function getMemberInitials(name: string)
function getAccessChannelKey(memberId: string, channel: WorkspaceMemberView["accessChannels"][number], index: number)
⋮----
interface WorkspaceMembersTabProps {
  readonly workspace: WorkspaceEntity;
}
⋮----
async function loadMembers()
⋮----
key=
````

## File: modules/workspace/interfaces/components/WorkspaceWikiTab.tsx
````typescript
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { WorkspaceWikiView } from "./WorkspaceWikiView";
interface WorkspaceWikiTabProps {
  readonly workspace: WorkspaceEntity;
}
/**
 * Workspace tab entrypoint delegates rendering to workspace owned view.
 */
export function WorkspaceWikiTab(
````

## File: modules/workspace/interfaces/hooks/useWorkspaceHub.ts
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { createWorkspace } from "../_actions/workspace.actions";
import { getWorkspacesForAccount } from "../queries/workspace.queries";
export type WorkspaceHubLoadState = "idle" | "loading" | "loaded" | "error";
interface UseWorkspaceHubOptions {
  readonly accountId: string | null | undefined;
  readonly accountType: "user" | "organization";
}
function sortWorkspaces(items: WorkspaceEntity[])
export function useWorkspaceHub(
⋮----
async function loadWorkspaces()
````

## File: modules/workspace/interfaces/queries/workspace-member.queries.ts
````typescript
import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMember";
import { FetchWorkspaceMembersUseCase } from "../../application/use-cases/workspace-member.use-cases";
import { FirebaseWorkspaceQueryRepository } from "../../infrastructure/firebase/FirebaseWorkspaceQueryRepository";
⋮----
export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>
````

## File: modules/workspace/interfaces/queries/workspace.queries.ts
````typescript
/**
 * Workspace Read Queries — thin wrappers exposing read operations for React components/hooks.
 */
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";
import { FirebaseWorkspaceQueryRepository } from "../../infrastructure/firebase/FirebaseWorkspaceQueryRepository";
⋮----
export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]>
export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
)
export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null>
export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null>
````

## File: modules/workspace/ports/.gitkeep
````

````

## File: next.config.ts
````typescript
import type { NextConfig } from "next";
````

## File: packages/api-contracts/index.ts
````typescript
// ─── REST API Route Registry ──────────────────────────────────────────────────
⋮----
// ─── GraphQL Schema ───────────────────────────────────────────────────────────
````

## File: packages/integration-firebase/admin.ts
````typescript
/**
 * @module libs/firebase/admin
 */
````

## File: packages/integration-firebase/analytics.ts
````typescript
/**
 * @module libs/firebase/analytics
 * Firebase Analytics wrapper (browser-only).
 * All exports are safe to import in SSR; actual SDK calls are no-ops on the server.
 */
import {
  getAnalytics,
  isSupported,
  logEvent,
  setCurrentScreen,
  setUserId,
  setUserProperties,
  setAnalyticsCollectionEnabled,
  type Analytics,
  type EventParams,
} from "firebase/analytics";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Analytics instance.
 * Returns null in SSR or when Analytics is not supported.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null>
````

## File: packages/integration-firebase/appcheck.ts
````typescript
/**
 * @module libs/firebase/appcheck
 * Firebase App Check wrapper.
 * Must be initialised before any other Firebase service is used.
 * Uses ReCaptchaEnterpriseProvider in production and debug provider in dev/test.
 */
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  getToken,
  onTokenChanged,
  setTokenAutoRefreshEnabled,
  type AppCheck,
  type AppCheckToken,
} from "firebase/app-check";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Lazily initialise App Check (browser-only).
 * Call once at app bootstrap (e.g. inside the root Provider).
 */
export function initFirebaseAppCheck(): AppCheck | null
⋮----
// Enable debug token in non-production environments.
// Set NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN=true in .env.local to
// get an auto-generated token printed to the browser console.
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
````

## File: packages/integration-firebase/auth.ts
````typescript
/**
 * @module libs/firebase/auth
 */
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseAuth()
````

## File: packages/integration-firebase/client.ts
````typescript
/**
 * @module libs/firebase/client
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
````

## File: packages/integration-firebase/database.ts
````typescript
/**
 * @module libs/firebase/database
 * Firebase Realtime Database wrapper.
 */
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  startAt,
  startAfter,
  endAt,
  endBefore,
  equalTo,
  limitToFirst,
  limitToLast,
  serverTimestamp,
  increment,
  runTransaction,
  connectDatabaseEmulator,
  type Database,
  type DatabaseReference,
  type DataSnapshot,
} from "firebase/database";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseDatabase(): Database
````

## File: packages/integration-firebase/firestore.ts
````typescript
/**
 * @module libs/firebase/firestore
 */
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFirestore()
````

## File: packages/integration-firebase/functions.ts
````typescript
/**
 * @module libs/firebase/functions-client
 * Firebase callable client wrapper.
 */
import {
  getFunctions,
  httpsCallable,
  httpsCallableFromURL,
  connectFunctionsEmulator,
  type Functions,
  type HttpsCallable,
  type HttpsCallableOptions,
} from "firebase/functions";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseFunctions(regionOrCustomDomain?: string): Functions
⋮----
// 只有在明確設定 emulator host 時才連接，否則直接用雲端
````

## File: packages/integration-firebase/index.ts
````typescript
/**
 * @module libs/firebase
 * Client-side Firebase SDK barrel.
 * Server-side (Admin) wrappers live in functions/src/firebase.
 */
````

## File: packages/integration-firebase/messaging.ts
````typescript
/**
 * @module libs/firebase/messaging
 * Firebase Cloud Messaging (FCM) wrapper (browser / service-worker only).
 */
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Messaging instance.
 * Returns null in SSR or unsupported environments.
 */
export async function getFirebaseMessaging(): Promise<Messaging | null>
````

## File: packages/integration-firebase/performance.ts
````typescript
/**
 * @module libs/firebase/performance
 * Firebase Performance Monitoring wrapper (browser-only).
 */
import {
  getPerformance,
  trace,
  type FirebasePerformance,
  type PerformanceTrace,
} from "firebase/performance";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Performance instance (browser-only).
 */
export function getFirebasePerformance(): FirebasePerformance | null
````

## File: packages/integration-firebase/remote-config.ts
````typescript
/**
 * @module libs/firebase/remote-config
 * Firebase Remote Config wrapper.
 */
import {
  getRemoteConfig,
  fetchAndActivate,
  fetchConfig,
  activate,
  ensureInitialized,
  getValue,
  getString,
  getNumber,
  getBoolean,
  getAll,
  type RemoteConfig,
  type Value,
} from "firebase/remote-config";
import { firebaseClientApp } from "./client";
⋮----
/**
 * Returns the singleton Remote Config instance (browser-only).
 * Sets a sensible default `minimumFetchIntervalMillis` of 30 s in dev.
 */
export function getFirebaseRemoteConfig(): RemoteConfig | null
````

## File: packages/integration-firebase/storage.ts
````typescript
/**
 * @module libs/firebase/storage
 * Firebase Cloud Storage wrapper.
 */
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  list,
  getMetadata,
  updateMetadata,
  getBlob,
  getStream,
  type FirebaseStorage,
  type StorageReference,
  type UploadTask,
  type FullMetadata,
  type SettableMetadata,
  type ListResult,
} from "firebase/storage";
import { firebaseClientApp } from "./client";
⋮----
export function getFirebaseStorage(bucketUrl?: string): FirebaseStorage
````

## File: packages/integration-http/index.ts
````typescript
import axios from "axios";
⋮----
// TODO: attach auth token
⋮----
// TODO: global error handling
````

## File: packages/lib-date-fns/index.ts
````typescript
/**
 * @module libs/date-fns
 * Thin wrapper for date-fns v4.
 *
 * Provides a single import path for the most commonly used date utility
 * functions in the project.  All exports are pure functions (no side effects),
 * safe to import from Server Components, Client Components, and utilities.
 *
 * Usage:
 *   import { format, parseISO, formatDistanceToNow } from "@/libs/date-fns";
 *   const label = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
 */
// ── Formatting ─────────────────────────────────────────────────────────────
⋮----
// ── Parsing ────────────────────────────────────────────────────────────────
⋮----
// ── Arithmetic – add ───────────────────────────────────────────────────────
⋮----
// ── Arithmetic – subtract ──────────────────────────────────────────────────
⋮----
// ── Comparison ─────────────────────────────────────────────────────────────
⋮----
// ── Difference ─────────────────────────────────────────────────────────────
⋮----
// ── Start / End of interval ────────────────────────────────────────────────
⋮----
// ── Getters ────────────────────────────────────────────────────────────────
⋮----
// ── Utilities ──────────────────────────────────────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
````

## File: packages/lib-dragdrop/index.ts
````typescript
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
 */
// ── Combine ────────────────────────────────────────────────────────────────
⋮----
// ── Element adapter ────────────────────────────────────────────────────────
⋮----
// ── Element preview helpers ────────────────────────────────────────────────
⋮----
// ── Utilities ──────────────────────────────────────────────────────────────
⋮----
// ── Hitbox — flat closest-edge (cards, columns) ───────────────────────────
⋮----
// ── Hitbox — list / tree item (reorderable lists and trees) ───────────────
⋮----
// ── Drop indicator React component ────────────────────────────────────────
// Note: imports CSS at runtime; only use inside Client Components.
````

## File: packages/lib-react-markdown/index.ts
````typescript
/**
 * @module libs/react-markdown
 * Thin wrapper for react-markdown.
 *
 * Provides a single import path for Markdown rendering in React with both
 * sync and async renderers, plus URL sanitization helper.
 *
 * Usage:
 *   import { ReactMarkdown, remarkPlugins } from "@/libs/react-markdown";
 *   import { remarkGfm } from "@/libs/remark-gfm";
 *
 *   <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
 */
````

## File: packages/lib-remark-gfm/index.ts
````typescript
/**
 * @module libs/remark-gfm
 * Thin wrapper for remark-gfm.
 *
 * Adds GitHub Flavored Markdown support for react-markdown / unified:
 * tables, autolinks, task lists, and strikethrough.
 */
````

## File: packages/lib-superjson/index.ts
````typescript
/**
 * @module libs/superjson
 * Thin wrapper for superjson serialization.
 *
 * superjson extends JSON to support more types: Date, Map, Set, BigInt,
 * Infinity, -0, undefined, NaN, and custom serialization hooks.
 *
 * Usage:
 *   import { stringify, parse } from "@/libs/superjson";
 *   const json = stringify(data);
 *   const result = parse<MyType>(json);
 */
````

## File: packages/lib-tanstack/index.ts
````typescript
/**
 * @module libs/tanstack
 * Thin wrapper for TanStack React contracts.
 */
// React Query
⋮----
// React Form
⋮----
// React Table
⋮----
// React Virtual
````

## File: packages/lib-uuid/index.ts
````typescript
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
 */
// ── Generators ─────────────────────────────────────────────────────────────
⋮----
// ── Validation & parsing ───────────────────────────────────────────────────
⋮----
// ── Constants ──────────────────────────────────────────────────────────────
⋮----
// ── Rare generators (included for completeness) ────────────────────────────
// v1 — timestamp MAC-address; v6 — reordered timestamp; v3/v5 — name-based
````

## File: packages/lib-vis/data.ts
````typescript
/**
 * @module libs/vis/data
 * Thin wrapper for vis-data.
 *
 * vis-data provides DataSet and DataView for managing and synchronizing
 * large collections of structured data with change notifications.
 *
 * Usage:
 *   import { DataSet } from "@/libs/vis/data";
 *   const dataSet = new DataSet([{ id: 1, label: "Node 1" }]);
 */
````

## File: packages/lib-vis/graph3d.ts
````typescript
/**
 * @module libs/vis/graph3d
 * Thin wrapper for vis-graph3d.
 *
 * vis-graph3d provides interactive 3D graph visualization with surfaces,
 * lines, dots, and blocks with extensive styling options.
 *
 * Usage:
 *   import { Graph3d } from "@/libs/vis/graph3d";
 *   const graph3d = new Graph3d(container, data, options);
 */
⋮----
type Graph3dClass = typeof import("vis-graph3d").Graph3d;
export type Graph3dOptions = InstanceType<Graph3dClass> extends { setOptions(opts: infer T): void } ? T : never;
````

## File: packages/lib-vis/index.ts
````typescript
/**
 * @module libs/vis
 * Unified Vis.js visualization library barrel.
 *
 * Provides thin wrappers for all vis.js core libraries:
 *   - vis-data      — DataSet/DataView for structured data management
 *   - vis-network   — Interactive network graphs with physics
 *   - vis-timeline  — Interactive timelines and 2D graphs
 *   - vis-graph3d   — Interactive 3D graph visualization
 *
 * All exports are client-side. Do not import from Server Components
 * without proper use-client boundary.
 *
 * Usage:
 *   import { DataSet, Network, Timeline, Graph3d } from "@/libs/vis";
 */
````

## File: packages/lib-vis/network.ts
````typescript
/**
 * @module libs/vis/network
 * Thin wrapper for vis-network.
 *
 * vis-network provides interactive visualization of network graphs with nodes,
 * edges, physics simulation, and extensive customization options.
 *
 * Usage:
 *   import { Network } from "@/libs/vis/network";
 *   const network = new Network(container, data, options);
 */
⋮----
type NetworkClass = typeof import("vis-network").Network;
export type NetworkOptions = InstanceType<NetworkClass> extends { setOptions(opts: infer T): void } ? T : never;
````

## File: packages/lib-vis/timeline.ts
````typescript
/**
 * @module libs/vis/timeline
 * Thin wrapper for vis-timeline.
 *
 * vis-timeline provides interactive, fully customizable timelines and 2D graphs
 * with items, ranges, and comprehensive event handling.
 *
 * Usage:
 *   import { Timeline } from "@/libs/vis/timeline";
 *   const timeline = new Timeline(container, items, options);
 */
⋮----
type TimelineClass = typeof import("vis-timeline").Timeline;
type Graph2dClass = typeof import("vis-timeline").Graph2d;
export type TimelineOptions = InstanceType<TimelineClass> extends { setOptions(opts: infer T): void } ? T : never;
export type Graph2dOptions = InstanceType<Graph2dClass> extends { setOptions(opts: infer T): void } ? T : never;
````

## File: packages/lib-xstate/index.ts
````typescript
/**
 * @module libs/xstate
 * Thin wrapper for XState v5 + @xstate/react.
 *
 * Provides a single import path for state machine creation, actor execution,
 * and React integration hooks.  All exports are isomorphic (server + client)
 * except for React hooks which require a Client Component boundary.
 *
 * Machine definition:
 *   import { setup, fromPromise } from "@/libs/xstate";
 *   const machine = setup({ actors: { fetch: fromPromise(…) } }).createMachine(…);
 *
 * React integration:
 *   import { useMachine, useActorRef, useSelector } from "@/libs/xstate";
 */
// ── Core factories ─────────────────────────────────────────────────────────
⋮----
// ── Actions ────────────────────────────────────────────────────────────────
⋮----
// ── Guards ─────────────────────────────────────────────────────────────────
⋮----
// ── Actor logic creators ───────────────────────────────────────────────────
⋮----
// ── Utilities ──────────────────────────────────────────────────────────────
⋮----
// ── Runtime helpers / compatibility aliases ───────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
⋮----
// ── React hooks (Client Component only) ───────────────────────────────────
````

## File: packages/lib-zod/index.ts
````typescript
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
 */
// ── Primary namespace (covers ~95 % of usage) ──────────────────────────────
⋮----
// ── Coercion namespace ─────────────────────────────────────────────────────
⋮----
// ── Error helpers ──────────────────────────────────────────────────────────
⋮----
// ── Base class (for `instanceof` checks and custom refinements) ────────────
⋮----
// ── JSON Schema interop ────────────────────────────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
````

## File: packages/lib-zustand/index.ts
````typescript
/**
 * @module libs/zustand
 * Thin wrapper for Zustand v5 state management.
 *
 * Provides a single import path for creating React stores, vanilla stores,
 * and middleware (persist, devtools, immer).  The React hook (`create`) must
 * only be used inside Client Components; the vanilla `createStore` is safe on
 * the server.
 *
 * Usage — React store (requires "use client"):
 *   import { create } from "@/libs/zustand";
 *
 *   const useCounter = create<{ count: number; inc: () => void }>((set) => ({
 *     count: 0,
 *     inc: () => set((s) => ({ count: s.count + 1 })),
 *   }));
 *
 * Usage — with persist middleware:
 *   import { create, persist, createJSONStorage } from "@/libs/zustand";
 *
 *   const useStore = create(persist((set) => ({ … }), {
 *     name: "my-store",
 *     storage: createJSONStorage(() => sessionStorage),
 *   }));
 *
 * Usage — vanilla store (server-safe):
 *   import { createStore, useStore } from "@/libs/zustand";
 *   const store = createStore<State>()((set) => ({ … }));
 */
// ── Core ───────────────────────────────────────────────────────────────────
⋮----
// ── Middleware ─────────────────────────────────────────────────────────────
⋮----
// ── Types ──────────────────────────────────────────────────────────────────
````

## File: packages/shared-constants/index.ts
````typescript

````

## File: packages/shared-hooks/index.ts
````typescript
import { create } from "zustand";
interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}
````

## File: packages/shared-types/index.ts
````typescript
// ─── Primitive types ──────────────────────────────────────────────────────────
export type ID = string;
export interface PaginationParams {
  page: number;
  limit: number;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
// ─── Domain Error ─────────────────────────────────────────────────────────────
/**
 * Structured domain error returned in CommandFailure.
 * Consumers MUST NOT use raw Error objects for command results.
 */
export interface DomainError {
  readonly code: string;
  readonly message: string;
  readonly context?: Record<string, unknown>;
}
// ─── Command Result Contract [R4] ─────────────────────────────────────────────
export interface CommandSuccess {
  readonly success: true;
  readonly aggregateId: string;
  readonly version: number;
}
export interface CommandFailure {
  readonly success: false;
  readonly error: DomainError;
}
/** Union returned by every Command Handler / use-case / _actions.ts export. */
export type CommandResult = CommandSuccess | CommandFailure;
export function commandSuccess(aggregateId: string, version: number): CommandSuccess
export function commandFailure(error: DomainError): CommandFailure
export function commandFailureFrom(
  code: string,
  message: string,
  context?: Record<string, unknown>,
): CommandFailure
// ─── Firestore Timestamp shim ─────────────────────────────────────────────────
/** Opaque Firestore Timestamp — Domain only carries seconds/nanoseconds, no SDK types. */
export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
}
⋮----
toDate(): Date;
````

## File: packages/shared-utils/index.ts
````typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[])
export function formatDate(date: Date): string
export function generateId(): string
````

## File: packages/shared-validators/index.ts
````typescript
import { z } from "zod";
⋮----
// Note: .default() fills missing fields during .parse(). Use .optional() instead
// if you need strict validation without automatic default injection.
⋮----
export type TaskSchemaType = z.infer<typeof taskSchema>;
// ─── Identity schemas ─────────────────────────────────────────────────────────
⋮----
export type SignInInput = z.infer<typeof signInSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
// ─── Workspace schemas ────────────────────────────────────────────────────────
⋮----
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
````

## File: packages/ui-shadcn/hooks/use-mobile.ts
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: packages/ui-shadcn/hooks/use-toast.ts
````typescript
// Inspired by react-hot-toast library
⋮----
type ToastActionElement = React.ReactElement
type ToastProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
⋮----
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}
⋮----
function genId()
type ActionType = typeof actionTypes
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }
interface State {
  toasts: ToasterToast[]
}
⋮----
const addToRemoveQueue = (toastId: string) =>
export const reducer = (state: State, action: Action): State =>
⋮----
// ! Side effects ! - This could be extracted into a dismissToast() action,
// but I'll keep it here for simplicity
⋮----
function dispatch(action: Action)
type Toast = Omit<ToasterToast, "id">
function toast(
⋮----
const update = (props: ToasterToast)
const dismiss = () => dispatch(
⋮----
function useToast()
````

## File: packages/ui-shadcn/index.ts
````typescript
/**
 * @package ui-shadcn
 * shadcn/ui component library — public barrel export.
 *
 * All UI primitives are re-exported from this package.
 * Internal components use relative imports; external consumers use @ui-shadcn.
 */
// ─── Utility ──────────────────────────────────────────────────────────────────
⋮----
// ─── Hooks ────────────────────────────────────────────────────────────────────
````

## File: packages/ui-shadcn/ui/accordion.tsx
````typescript
import { Accordion as AccordionPrimitive } from "radix-ui"
import { cn } from "../utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>)
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>)
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>)
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>)
````

## File: packages/ui-shadcn/ui/alert-dialog.tsx
````typescript
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
import { cn } from "../utils"
import { Button } from "./button"
⋮----
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>)
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>)
⋮----
className=
````

## File: packages/ui-shadcn/ui/alert.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/aspect-ratio.tsx
````typescript
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"
````

## File: packages/ui-shadcn/ui/avatar.tsx
````typescript
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/badge.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "../utils"
⋮----
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
VariantProps<typeof badgeVariants> &
⋮----
className=
````

## File: packages/ui-shadcn/ui/breadcrumb.tsx
````typescript
import { Slot } from "radix-ui"
import { cn } from "../utils"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
function Breadcrumb(
⋮----
className=
````

## File: packages/ui-shadcn/ui/button.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/calendar.tsx
````typescript
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { cn } from "../utils"
import { Button, buttonVariants } from "./button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/card.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/carousel.tsx
````typescript
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { cn } from "../utils"
import { Button } from "./button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps
⋮----
function useCarousel()
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps)
⋮----
className=
````

## File: packages/ui-shadcn/ui/chart.tsx
````typescript
import { cn } from "../utils"
// Format: { THEME_NAME: CSS_SELECTOR }
⋮----
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}
type ChartContextProps = {
  config: ChartConfig
}
⋮----
function useChart()
⋮----
className=
⋮----
<div className=
⋮----
return <div className=
````

## File: packages/ui-shadcn/ui/checkbox.tsx
````typescript
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cn } from "../utils"
import { CheckIcon } from "lucide-react"
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>)
````

## File: packages/ui-shadcn/ui/collapsible.tsx
````typescript
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
````

## File: packages/ui-shadcn/ui/command.tsx
````typescript
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "../utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "./input-group"
import { SearchIcon, CheckIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/context-menu.tsx
````typescript
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"
import { cn } from "../utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"
⋮----
function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>)
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>)
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>)
⋮----
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>)
⋮----
return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn("z-50 max-h-(--radix-context-menu-content-available-height) min-w-36 origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
})
⋮----
className=
⋮----
return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}
function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>)
````

## File: packages/ui-shadcn/ui/dialog.tsx
````typescript
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "../utils"
import { Button } from "./button"
import { XIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/drawer.tsx
````typescript
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/dropdown-menu.tsx
````typescript
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { cn } from "../utils"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
⋮----
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>)
⋮----
return (
⋮----
className=
````

## File: packages/ui-shadcn/ui/hover-card.tsx
````typescript
import { HoverCard as HoverCardPrimitive } from "radix-ui"
import { cn } from "../utils"
⋮----
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>)
````

## File: packages/ui-shadcn/ui/input-group.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
⋮----
className=
⋮----
if ((e.target as HTMLElement).closest("button"))
````

## File: packages/ui-shadcn/ui/input-otp.tsx
````typescript
import { OTPInput, OTPInputContext } from "input-otp"
import { cn } from "../utils"
import { MinusIcon } from "lucide-react"
⋮----
containerClassName=
className=
````

## File: packages/ui-shadcn/ui/input.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/kbd.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/label.tsx
````typescript
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from "../utils"
````

## File: packages/ui-shadcn/ui/menubar.tsx
````typescript
import { Menubar as MenubarPrimitive } from "radix-ui"
import { cn } from "../utils"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
⋮----
return (
⋮----
className=
````

## File: packages/ui-shadcn/ui/navigation-menu.tsx
````typescript
import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { cn } from "../utils"
import { ChevronDownIcon } from "lucide-react"
⋮----
className=
⋮----
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>)
````

## File: packages/ui-shadcn/ui/pagination.tsx
````typescript
import { cn } from "../utils"
import { Button } from "./button"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
⋮----
className=
⋮----
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps)
function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> &
function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> &
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">)
````

## File: packages/ui-shadcn/ui/popover.tsx
````typescript
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/progress.tsx
````typescript
import { Progress as ProgressPrimitive } from "radix-ui"
import { cn } from "../utils"
````

## File: packages/ui-shadcn/ui/radio-group.tsx
````typescript
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "../utils"
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>)
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>)
````

## File: packages/ui-shadcn/ui/scroll-area.tsx
````typescript
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"
import { cn } from "../utils"
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>)
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>)
````

## File: packages/ui-shadcn/ui/select.tsx
````typescript
import { Select as SelectPrimitive } from "radix-ui"
import { cn } from "../utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"
⋮----
function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>)
⋮----
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
})
className=
⋮----
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>)
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>)
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>)
````

## File: packages/ui-shadcn/ui/separator.tsx
````typescript
import { Separator as SeparatorPrimitive } from "radix-ui"
import { cn } from "../utils"
````

## File: packages/ui-shadcn/ui/sheet.tsx
````typescript
import { Dialog as SheetPrimitive } from "radix-ui"
import { cn } from "../utils"
import { Button } from "./button"
import { XIcon } from "lucide-react"
⋮----
className=
````

## File: packages/ui-shadcn/ui/sidebar.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { useIsMobile } from "../hooks/use-mobile"
import { cn } from "../utils"
import { Button } from "./button"
import { Input } from "./input"
import { Separator } from "./separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet"
import { Skeleton } from "./skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip"
import { PanelLeftIcon } from "lucide-react"
⋮----
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
⋮----
function useSidebar()
⋮----
// This is the internal state of the sidebar.
// We use openProp and setOpenProp for control from outside the component.
⋮----
// This sets the cookie to keep the sidebar state.
⋮----
// Helper to toggle the sidebar.
⋮----
// Adds a keyboard shortcut to toggle the sidebar.
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
⋮----
// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
⋮----
className=
⋮----
{/* This is what handles the sidebar gap on desktop */}
⋮----
// Adjust the padding for floating and inset variants.
⋮----
// Random width between 50 to 90%.
````

## File: packages/ui-shadcn/ui/skeleton.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/slider.tsx
````typescript
import { Slider as SliderPrimitive } from "radix-ui"
import { cn } from "../utils"
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>)
className=
````

## File: packages/ui-shadcn/ui/sonner.tsx
````typescript
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
````

## File: packages/ui-shadcn/ui/spinner.tsx
````typescript
import { cn } from "../utils"
import { Loader2Icon } from "lucide-react"
⋮----
<Loader2Icon role="status" aria-label="Loading" className=
````

## File: packages/ui-shadcn/ui/switch.tsx
````typescript
import { Switch as SwitchPrimitive } from "radix-ui"
import { cn } from "../utils"
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
})
⋮----
className=
````

## File: packages/ui-shadcn/ui/table.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/tabs.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "../utils"
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>)
⋮----
className=
````

## File: packages/ui-shadcn/ui/textarea.tsx
````typescript
import { cn } from "../utils"
⋮----
className=
````

## File: packages/ui-shadcn/ui/toggle-group.tsx
````typescript
import { type VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { cn } from "../utils"
import { toggleVariants } from "./toggle"
⋮----
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
})
⋮----
className=
````

## File: packages/ui-shadcn/ui/toggle.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"
import { cn } from "../utils"
````

## File: packages/ui-shadcn/ui/tooltip.tsx
````typescript
import { Tooltip as TooltipPrimitive } from "radix-ui"
import { cn } from "../utils"
⋮----
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>)
````

## File: packages/ui-shadcn/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[])
````

## File: packages/ui-vis/index.ts
````typescript
/**
 * @package ui-vis
 * React components for vis.js visualization.
 */
````

## File: packages/ui-vis/network.tsx
````typescript
/**
 * @module ui/vis/network
 * React wrapper for vis-network.
 *
 * Provides a drop-in React component for interactive network visualization.
 * Simplifies ref management and event handling for Next.js environments.
 */
import { useRef, useEffect, FC } from "react";
import Graph from "react-graph-vis";
import type { Network, Options } from "vis-network";
export interface VisNetworkProps {
  /**
   * Nodes data array
   */
  nodes?: Array<{ id: string | number; label?: string; [key: string]: unknown }>;
  /**
   * Edges data array
   */
  edges?: Array<{ from: string | number; to: string | number; [key: string]: unknown }>;
  /**
   * vis-network options
   */
  options?: Options;
  /**
   * Fired when a node is clicked
   */
  onSelectNode?: (nodeId: string | number) => void;
  /**
   * Fired when a node is double-clicked
   */
  onDoubleClickNode?: (nodeId: string | number) => void;
  /**
   * Fired when physics simulation finishes
   */
  onPhysicsStabilized?: () => void;
  /**
   * Container CSS class
   */
  className?: string;
  /**
   * Container CSS styles
   */
  style?: React.CSSProperties;
}
⋮----
/**
   * Nodes data array
   */
⋮----
/**
   * Edges data array
   */
⋮----
/**
   * vis-network options
   */
⋮----
/**
   * Fired when a node is clicked
   */
⋮----
/**
   * Fired when a node is double-clicked
   */
⋮----
/**
   * Fired when physics simulation finishes
   */
⋮----
/**
   * Container CSS class
   */
⋮----
/**
   * Container CSS styles
   */
⋮----
/**
 * VisNetwork component - interactive network graph with React integration.
 *
 * @example
 * ```tsx
 * <VisNetwork
 *   nodes={[{ id: 1, label: "Node 1" }]}
 *   edges={[{ from: 1, to: 2 }]}
 *   options={{ physics: { enabled: true } }}
 *   onSelectNode={(id) => console.log("Selected:", id)}
 * />
 * ```
 */
⋮----
const handleSelectNode = (event:
const handleDoubleClickNode = (event:
const handlePhysicsStabilized = () =>
````

## File: packages/ui-vis/react-graph-vis.d.ts
````typescript
import type { ComponentType } from "react";
import type { Data, Network, Options } from "vis-network";
interface GraphEvents {
    [eventName: string]: (...args: unknown[]) => void;
  }
export interface GraphProps {
    graph: Pick<Data, "nodes" | "edges">;
    options?: Options;
    events?: GraphEvents;
    getNetwork?: (network: Network) => void;
    getEdges?: (edges: unknown) => void;
    getNodes?: (nodes: unknown) => void;
    style?: React.CSSProperties;
    className?: string;
  }
````

## File: packages/ui-vis/timeline.tsx
````typescript
/**
 * @module ui/vis/timeline
 * React wrapper for vis-timeline.
 *
 * Provides a drop-in React component for interactive timeline visualization.
 */
import { useRef, useEffect, FC } from "react";
import { Timeline, DataSet } from "@lib-vis";
export interface VisTimelineProps {
  /**
   * Timeline items (events)
   */
  items?: Array<{
    id: string | number;
    content: string;
    start: string | Date;
    end?: string | Date;
    [key: string]: unknown;
  }>;
  /**
   * Timeline groups (categories)
   */
  groups?: Array<{
    id: string | number;
    content: string;
    [key: string]: unknown;
  }>;
  /**
   * Timeline options
   */
  options?: Record<string, unknown>;
  /**
   * Fired when selection changes
   */
  onSelect?: (selection: (string | number)[]) => void;
  /**
   * Container CSS class
   */
  className?: string;
  /**
   * Container CSS styles
   */
  style?: React.CSSProperties;
}
⋮----
/**
   * Timeline items (events)
   */
⋮----
/**
   * Timeline groups (categories)
   */
⋮----
/**
   * Timeline options
   */
⋮----
/**
   * Fired when selection changes
   */
⋮----
/**
   * Container CSS class
   */
⋮----
/**
   * Container CSS styles
   */
⋮----
/**
 * VisTimeline component - interactive timeline with React integration.
 *
 * @example
 * ```tsx
 * <VisTimeline
 *   items={[{ id: 1, content: "Event 1", start: new Date() }]}
 *   options={{ height: "100%" }}
 *   onSelect={(ids) => console.log("Selected:", ids)}
 * />
 * ```
 */
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
const handleSelect = (event:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
````

## File: PERMISSIONS.md
````markdown
# Permissions

This repository currently documents RBAC and permission-related behavior in the shared system reference instead of a standalone permissions handbook.

## Canonical references

- [`docs/reference/specification/system-overview.md`](docs/reference/specification/system-overview.md) — system-level RBAC overview
- [`docs/guides/how-to/ui-ux/information-architecture.md`](docs/guides/how-to/ui-ux/information-architecture.md) — current permissions-related route surfaces

Update this file if the project later restores a dedicated permissions reference.
````

## File: postcss.config.mjs
````javascript

````

## File: py_fn/.gitignore
````
# Python bytecode
__pycache__/

# Python virtual environment
venv/
*.local
````

## File: py_fn/.serena/.gitkeep
````

````

## File: py_fn/docs/.gitkeep
````

````

## File: py_fn/main.py
````python
"""
py_fn — Firebase Functions (Python) 入口檔
==========================================
所有 Firebase Function 都在這裡用裝飾器宣告；
實際邏輯委派給 app/handlers/ 下的各模組。
部署：
    firebase deploy --only functions
本機模擬：
    firebase emulators:start --only functions,storage,firestore
"""
⋮----
SRC_ROOT = Path(__file__).resolve().parent / "src"
⋮----
# ── Firebase Admin SDK 初始化（app/bootstrap 之中）──────────────────────
import app.bootstrap  # noqa: F401  — 副作用：呼叫 firebase_admin.initialize_app()
⋮----
# ── 全域選項 ─────────────────────────────────────────────────────────────────
⋮----
# ── Cloud Storage 觸發器 ──────────────────────────────────────────────────────
# 監聽 UPLOAD_BUCKET 內的新物件 → Document AI 解析 → 寫入 Firestore
⋮----
"""GCS 物件建立後自動觸發 Document AI 解析流程。"""
⋮----
# ── HTTPS Callable ────────────────────────────────────────────────────────────
# 供前端或後端服務主動呼叫，按需解析單一 GCS 物件
⋮----
@https_fn.on_call()
def parse_document(req: https_fn.CallableRequest) -> dict
⋮----
"""手動觸發 Document AI 解析，回傳解析摘要。"""
⋮----
@https_fn.on_call()
def rag_query(req: https_fn.CallableRequest) -> dict
⋮----
"""RAG 檢索 + 生成查詢。"""
⋮----
@https_fn.on_call()
def rag_reindex_document(req: https_fn.CallableRequest) -> dict
⋮----
"""手動重新整理文件（normalization + ingestion）。"""
````

## File: py_fn/README.md
````markdown
# py_fn 架構規範（路徑級依賴版）

這份規範重點是「看完整路徑判斷依賴」，不是看資料夾名稱。
例如 services 這個名字在 application 和 domain 都存在，但它們是不同層，規則不同。

## 1. 全域依賴方向

```text
interface -> application -> domain
infrastructure -> application -> domain
app -> interface / application / infrastructure / core
core -> all layers
domain -> only core
```

## 2. 目錄基準（含子資料夾）

```text
py_fn/src
├─ app
│  ├─ config
│  ├─ bootstrap
│  ├─ container
│  └─ settings
├─ application
│  ├─ use_cases
│  ├─ dto
│  ├─ services
│  ├─ ports
│  │  ├─ input
│  │  └─ output
│  └─ mappers
├─ domain
│  ├─ entities
│  ├─ value_objects
│  ├─ repositories
│  ├─ services
│  ├─ events
│  └─ exceptions
├─ infrastructure
│  ├─ cache
│  ├─ audit
│  ├─ persistence
│  │  ├─ firestore
│  │  ├─ storage
│  │  └─ vector
│  ├─ external
│  │  ├─ openai
│  │  ├─ genkit
│  │  └─ http
│  ├─ repositories
│  ├─ config
│  └─ logging
├─ interface
│  ├─ controllers
│  ├─ middleware
│  ├─ handlers
│  ├─ schemas
│  └─ routes
└─ core
   ├─ utils
   ├─ types
   ├─ constants
   ├─ exceptions
   └─ security
```

## 3. 各層職責摘要

### app
- 啟動、組裝、注入。
- 這一層可以依賴所有層，但不承載核心業務規則。

### application
- 放 use case、application service、ports、DTO、mappers。
- 負責流程編排，不直接依賴 infrastructure 實作。

### domain
- 放 entities、value objects、repositories 介面、domain services、events、exceptions。
- 是最核心的層，必須保持純淨。

### infrastructure
- 放 Firestore、Storage、Vector、外部 API、repository implementation。
- 只負責技術實作，不主導業務流程。

### interface
- 放 controllers、handlers、routes、schemas、middleware。
- 接外部請求、驗證輸入、呼叫 use case。

### core
- 放所有層可共用的 utils、types、constants、exceptions、security。
- core 本身不依賴任何外層。

## 4.1 值物件與 DTO 規劃

### 應放在 domain/value_objects
- 純資料語意、無基礎設施細節、可被多個 use case 重用。
- 例如：`RagQueryInput`、`RagCitation`、`RagQueryResult`。

### 應放在 application/dto
- 某個 use case 的輸入/輸出模型。
- 例如：`RagIngestionResult` 這種 use case 輸出摘要。

### 不應放進 domain/value_objects
- 外部服務供應商回傳模型。
- 例如：`ParsedDocument` 屬於 Document AI adapter 的回傳型別，保留在 infrastructure/external。

### 目前 py_fn 的落點範例
- `domain/value_objects/rag.py`: `RagQueryInput`, `RagCitation`, `RagQueryResult`
- `domain/repositories/rag.py`: `RagQueryGateway`, `RagIngestionGateway`, `DocumentPipelineGateway`
- `application/dto/rag.py`: `RagIngestionResult`
- `infrastructure/external/documentai/client.py`: `ParsedDocument`

## 4.2 同名資料夾的判讀規則

- services 只看名稱會誤判，必須看完整路徑
       - domain/services 是核心業務規則
       - application/services 是應用層編排
       - infrastructure/services 若存在，只能是技術 adapter；若可拆回更明確目錄，優先拆回 cache / audit / external / persistence
- repositories 也一樣
       - domain/repositories 是介面（contracts）
       - infrastructure/repositories 是實作（implementations）
- config 也一樣
       - app/config 是啟動與組裝配置
       - infrastructure/config 是技術配置
       - core/constants 才是跨層可共用常量

## 5. 路徑級依賴矩陣（最重要）

| From 路徑 | Allowed To Import |
| --- | --- |
| interface/routes | interface/controllers, interface/handlers, core |
| interface/controllers | application/use_cases, application/dto, domain, core |
| interface/handlers | application/use_cases, application/ports/input, core |
| interface/middleware | core |
| interface/schemas | core, 同層 schema 模組 |
| application/use_cases | domain, application/ports/output, application/dto, core |
| application/services | domain, application/ports/output, core |
| application/mappers | application/dto, domain, core |
| application/ports/input | domain, core |
| application/ports/output | domain, core |
| domain/entities | domain/value_objects, core |
| domain/value_objects | core |
| domain/services | domain/entities, domain/value_objects, domain/repositories, core |
| domain/repositories | domain/entities, domain/value_objects, core |
| domain/events | domain/entities, core |
| domain/exceptions | core |
| infrastructure/repositories | domain/repositories, domain/entities, infrastructure/persistence, core |
| infrastructure/cache | infrastructure/external, core |
| infrastructure/audit | infrastructure/external, core |
| infrastructure/persistence | domain/entities, domain/value_objects, core |
| infrastructure/external | application/ports/output, domain, core |
| infrastructure/config | core |
| infrastructure/logging | core |
| app/bootstrap | app/config, app/container, infrastructure, application, interface, core |
| app/container | infrastructure, application, domain, core |
| app/settings | core |
| core/* | 不可依賴任何外層 |

## 6. 明確禁止規則

- domain 不可 import application/interface/infrastructure/app
- application 不可 import infrastructure 實作
- interface 不可直接 import infrastructure（除非經 app 組裝注入後由 application port 提供）
- infrastructure 不可主導業務流程（流程應在 application/use_cases）

## 7. 標準依賴流

```text
route -> controller/handler -> use case -> domain -> repository interface
                                                     ^
                                                     |
                           repository implementation (infrastructure)
```

## 8. import 範例

### interface controller

```python
from application.use_cases.create_user import CreateUserUseCase
from interface.schemas.user_schema import CreateUserRequest
```

### application use case

```python
from domain.repositories.user_repository import UserRepository
from domain.entities.user import User
```

### infrastructure repository implementation

```python
from domain.repositories.user_repository import UserRepository
from infrastructure.persistence.firestore.client import FirestoreClient
```

### app container

```python
from infrastructure.repositories.firestore_user_repository import FirestoreUserRepository
from application.use_cases.create_user import CreateUserUseCase
```

## 9. PR 檢查清單

- 是否用完整路徑判讀層級，而不是只看資料夾名稱
- domain 是否只依賴 core
- use case 是否只依賴抽象（ports/repository interface）
- infrastructure 是否只做技術實作
- app 是否是唯一組裝與注入入口

## 10. 附錄 A：快速記憶版

如果只想快速判斷，先記這張：

```text
Controller/Handler -> UseCase -> Domain -> Repository Interface
                                                                         ^
                                                                         |
                                                   Repository Implementation
                                                                         |
                                                                Database / API
```

對應路徑：

```text
interface/controllers or interface/handlers
application/use_cases
domain/entities or domain/services
domain/repositories
infrastructure/repositories
infrastructure/persistence or infrastructure/external
```

## 11. 附錄 B：高階流程圖

```text
HTTP Request
       -> interface (controller / handler)
       -> application (use case)
       -> domain (entity / service / repository interface)
       -> infrastructure (Firestore / Vector / API implementation)
```

## 12. 附錄 C：典型誤判案例

### services 同名但不同層
- `application/services/*` 可以編排流程，但不應放純領域規則。
- `domain/services/*` 才是純領域規則。

### repositories 同名但不同性質
- `domain/repositories/*` 是介面。
- `infrastructure/repositories/*` 是實作。

### config 同名但職責不同
- `app/config/*` 面向啟動與組裝。
- `infrastructure/config/*` 面向技術設定。
- 可跨層重用的常量優先放 `core/constants/*`。

## 13. 一句話總結

看完整路徑判斷層級，不看資料夾名稱猜責任。
````

## File: py_fn/requirements.txt
````
# Firebase Functions runtime
firebase-functions>=0.4.2,<1.0.0

# Firebase Admin SDK - Firestore / Auth / Storage admin APIs
firebase-admin>=6.5.0,<7.0.0

# Google Cloud Document AI - synchronous & async document processing
google-cloud-documentai<3.0.0

# Google Cloud Firestore - explicit dependency for type hints & features
google-cloud-firestore<3.0.0

# GCS helper used by the storage service layer
google-cloud-storage<3.0.0

# OpenAI SDK for embeddings and LLM calls
openai>=1.40.0,<2.0.0

# Upstash Python SDKs (Vector/Redis used in RAG; QStash used for async audit event)
upstash-vector>=0.8.0,<1.0.0
upstash-redis>=1.0.0,<2.0.0
upstash-search>=0.1.1,<1.0.0
qstash>=3.0.0,<4.0.0
````

## File: py_fn/src/app/__init__.py
````python
"""
App package — delegates Firebase Admin SDK initialization to app.bootstrap.
"""
from app.bootstrap import *  # noqa: F401,F403
````

## File: py_fn/src/app/bootstrap/__init__.py
````python
"""
Firebase Admin SDK 初始化 — 整個 py_fn 只 initialize_app() 一次，
其他模組直接 import firebase_admin 即可取得已初始化的 app。
"""
⋮----
# Cloud Run / Cloud Functions 執行環境使用 ADC（Application Default Credentials）
# 本機測試時請先執行： gcloud auth application-default login
````

## File: py_fn/src/app/config/.gitkeep
````

````

## File: py_fn/src/app/container/.gitkeep
````

````

## File: py_fn/src/app/container/runtime_dependencies.py
````python
class InfraRagQueryGateway
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str
def get_query_cache(self, cache_key: str) -> dict[str, Any] | None
def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None
def to_query_vector(self, query: str) -> list[float]
def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]
def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]
def generate_answer(self, *, query: str, context_block: str) -> str
⋮----
class InfraRagIngestionGateway
⋮----
def embed_texts(self, texts: list[str], model: str) -> list[list[float]]
def upsert_vectors(self, items: list[dict[str, Any]], namespace: str = "") -> Any
def upsert_search_documents(self, documents: list[dict[str, Any]]) -> int
def redis_set_json(self, key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None
class InfraDocumentPipelineGateway
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf") -> Any
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
def parsed_json_path(self, upload_object_path: str) -> str
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
def register_runtime_dependencies() -> None
````

## File: py_fn/src/app/settings/.gitkeep
````

````

## File: py_fn/src/application/__init__.py
````python
"""Application layer package."""
````

## File: py_fn/src/application/dto/__init__.py
````python
"""Application DTOs."""
⋮----
__all__ = ["RagIngestionResult"]
````

## File: py_fn/src/application/dto/.gitkeep
````

````

## File: py_fn/src/application/dto/rag.py
````python
@dataclass
class RagIngestionResult
⋮----
chunk_count: int
vector_count: int
embedding_model: str
embedding_dimensions: int
raw_chars: int
normalized_chars: int
normalization_version: str
language_hint: str
````

## File: py_fn/src/application/mappers/.gitkeep
````

````

## File: py_fn/src/application/ports/input/.gitkeep
````

````

## File: py_fn/src/application/ports/output/.gitkeep
````

````

## File: py_fn/src/application/ports/output/gateways.py
````python
"""Backward-compatible application-layer re-export of domain repository contracts."""
⋮----
__all__ = [
````

## File: py_fn/src/application/services/.gitkeep
````

````

## File: py_fn/src/application/services/document_pipeline.py
````python
def get_document_pipeline() -> DocumentPipelineGateway
````

## File: py_fn/src/application/use_cases/__init__.py
````python
"""Application use cases."""
⋮----
__all__ = [
````

## File: py_fn/src/application/use_cases/rag_ingestion.py
````python
"""
RAG pipeline — ingestion use case (clean → chunk → embed → upsert).
"""
⋮----
logger = logging.getLogger(__name__)
def detect_language_hint(text: str) -> str
⋮----
"""粗略語系判斷：cjk / latin / mixed。"""
cjk_count = len(re.findall(r"[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]", text))
latin_count = len(re.findall(r"[A-Za-z]", text))
⋮----
def clean_text(raw_text: str) -> str
⋮----
"""Step 1: Normalization v2，保留段落與可引用性。"""
text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
text = re.sub(r"[\u200b\u200c\u200d\ufeff]", "", text)
text = text.replace("\u3000", " ")
text = re.sub(r"[\t ]+", " ", text)
text = re.sub(r"\n[\t ]+", "\n", text)
text = re.sub(r"\n{3,}", "\n\n", text)
⋮----
def chunk_text(text: str, chunk_size: int, overlap: int) -> list[dict[str, Any]]
⋮----
"""Step 2 + Step 3: 分塊並建立 chunk metadata。"""
⋮----
chunk_size = 1200
⋮----
overlap = 0
⋮----
overlap = max(0, chunk_size // 4)
chunks: list[dict[str, Any]] = []
start = 0
text_len = len(text)
⋮----
end = min(start + chunk_size, text_len)
content = text[start:end].strip()
⋮----
start = end - overlap
⋮----
"""Step 1~5: clean -> chunk -> metadata -> embed -> upsert vector。"""
gateway = gateway or get_rag_ingestion_gateway()
⋮----
raw_chars = len(text or "")
normalized = clean_text(text or "")
normalized_chars = len(normalized)
normalization_version = "v2"
language_hint = detect_language_hint(normalized)
base_chunks = chunk_text(
⋮----
texts = [item["text"] for item in base_chunks]
vectors = gateway.embed_texts(texts, model=OPENAI_EMBEDDING_MODEL)
now_iso = datetime.now(UTC).isoformat()
payload: list[dict[str, Any]] = []
⋮----
chunk_id = f"{doc_id}:{i:04d}"
⋮----
# Best effort: keep Upstash Search in sync with vector chunks.
⋮----
search_docs = [
⋮----
# 文件索引摘要寫入 Redis，方便後續檢視與治理。
````

## File: py_fn/src/application/use_cases/rag_query.py
````python
logger = logging.getLogger(__name__)
def _normalize_metadata(value: Any) -> dict[str, Any]
⋮----
raw = value.strip()
⋮----
parsed = json.loads(raw)
⋮----
def _match_account(metadata: dict[str, Any], account_scope: str) -> bool
⋮----
candidates = (
⋮----
def _match_workspace(metadata: dict[str, Any], workspace_scope: str) -> bool
def _match_ready_status(metadata: dict[str, Any], require_ready: bool) -> bool
def _parse_datetime(value: Any) -> datetime | None
⋮----
raw = str(value or "").strip()
⋮----
normalized = raw.replace("Z", "+00:00")
parsed = datetime.fromisoformat(normalized)
⋮----
def _match_freshness(metadata: dict[str, Any], max_age_days: int) -> bool
⋮----
timestamp = next((dt for dt in (_parse_datetime(value) for value in candidates) if dt is not None), None)
⋮----
cutoff = datetime.now(UTC) - timedelta(days=max_age_days)
⋮----
def _match_taxonomy(metadata: dict[str, Any], taxonomy_filters: tuple[str, ...]) -> bool
⋮----
normalized_filters = {item.lower() for item in taxonomy_filters if item}
⋮----
candidates = {
tags = metadata.get("tags")
⋮----
def _extract_text_candidate(value: Any) -> str
⋮----
snippet = str(candidate or "").strip()
⋮----
def _extract_snippet(hit: dict[str, Any], metadata: dict[str, Any]) -> str
⋮----
snippet = _extract_text_candidate(candidate)
⋮----
def _resolve_filename(metadata: dict[str, Any], fallback: str | None = None) -> str | None
⋮----
name = str(value or "").strip()
⋮----
"""Application use case for RAG query orchestration."""
gateway = gateway or get_rag_query_gateway()
request = RagQueryInput.from_raw(
⋮----
cache_key = gateway.build_query_cache_key(
⋮----
cached = gateway.get_query_cache(cache_key)
⋮----
retrieval_top_k = request.retrieval_top_k()
vector = gateway.to_query_vector(request.query)
vector_hits_raw = gateway.query_vector(vector, top_k=retrieval_top_k)
search_hits_raw = gateway.query_search(request.query, top_k=retrieval_top_k)
contexts: list[str] = []
citations: list[RagCitation] = []
seen_snippets: set[str] = set()
raw_vector_hits = len(vector_hits_raw)
raw_search_hits = len(search_hits_raw)
dropped_by_workspace = 0
dropped_by_status = 0
dropped_by_freshness = 0
dropped_by_taxonomy = 0
⋮----
metadata = _normalize_metadata(hit.get("metadata"))
⋮----
snippet = _extract_snippet(hit, metadata)
⋮----
vector_hit_count = len([c for c in citations if c.provider == "vector"])
search_hit_count = len([c for c in citations if c.provider == "search"])
context_block = "\n\n---\n\n".join(contexts[:request.top_k])
⋮----
answer = gateway.generate_answer(query=request.query, context_block=context_block)
result = RagQueryResult(
````

## File: py_fn/src/core/__init__.py
````python
"""Core layer package."""
````

## File: py_fn/src/core/config.py
````python
"""
專案層級常數 — 從環境變數讀取，讓同一份程式碼在 dev / staging / prod 皆可用。
"""
⋮----
# ── GCP 基礎設定 ────────────────────────────────────────────────────────────
GCP_PROJECT: str = "65970295651"
GCP_REGION: str = os.environ.get("FUNCTION_REGION", "asia-southeast1")
# -- Cloud Storage ----------------------------------------
# Firebase Storage bucket (from firebase.json storage.bucket)
UPLOAD_BUCKET: str = os.environ.get(
# ── Document AI ──────────────────────────────────────────────────────────────
# 格式： projects/{project}/locations/{location}/processors/{processor_id}
DOCAI_PROCESSOR_NAME: str = (
DOCAI_LOCATION: str = "asia-southeast1"
DOCAI_API_ENDPOINT: str = "asia-southeast1-documentai.googleapis.com"
# ── OpenAI (Embeddings / LLM) ───────────────────────────────────────────────
OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "").strip()
OPENAI_EMBEDDING_MODEL: str = os.environ.get(
OPENAI_EMBEDDING_DIMENSIONS: int = int(os.environ.get("OPENAI_EMBEDDING_DIMENSIONS", "1024"))
OPENAI_LLM_MODEL: str = os.environ.get("OPENAI_LLM_MODEL", "gpt-4o-mini")
OPENAI_TIMEOUT_SECONDS: float = float(os.environ.get("OPENAI_TIMEOUT_SECONDS", "30"))
OPENAI_MAX_RETRIES: int = int(os.environ.get("OPENAI_MAX_RETRIES", "2"))
# ── Upstash (Vector / Redis / Search / QStash) ─────────────────────────────
UPSTASH_REDIS_REST_URL: str = os.environ.get("UPSTASH_REDIS_REST_URL", "").strip()
UPSTASH_REDIS_REST_TOKEN: str = os.environ.get("UPSTASH_REDIS_REST_TOKEN", "").strip()
UPSTASH_VECTOR_REST_URL: str = os.environ.get("UPSTASH_VECTOR_REST_URL", "").strip()
UPSTASH_VECTOR_REST_TOKEN: str = os.environ.get("UPSTASH_VECTOR_REST_TOKEN", "").strip()
UPSTASH_SEARCH_REST_URL: str = os.environ.get("UPSTASH_SEARCH_REST_URL", "").strip()
UPSTASH_SEARCH_REST_TOKEN: str = os.environ.get("UPSTASH_SEARCH_REST_TOKEN", "").strip()
UPSTASH_SEARCH_INDEX: str = os.environ.get("UPSTASH_SEARCH_INDEX", "").strip()
UPSTASH_SEARCH_TIMEOUT_SECONDS: float = float(os.environ.get("UPSTASH_SEARCH_TIMEOUT_SECONDS", "8"))
QSTASH_URL: str = os.environ.get("QSTASH_URL", "https://qstash-us-east-1.upstash.io").strip()
QSTASH_TOKEN: str = os.environ.get("QSTASH_TOKEN", "").strip()
QSTASH_CURRENT_SIGNING_KEY: str = os.environ.get("QSTASH_CURRENT_SIGNING_KEY", "").strip()
QSTASH_NEXT_SIGNING_KEY: str = os.environ.get("QSTASH_NEXT_SIGNING_KEY", "").strip()
QSTASH_RAG_AUDIT_URL: str = os.environ.get("QSTASH_RAG_AUDIT_URL", "").strip()
# ── RAG Pipeline ─────────────────────────────────────────────────────────────
RAG_VECTOR_NAMESPACE: str = os.environ.get("RAG_VECTOR_NAMESPACE", "rag-docs").strip()
RAG_CHUNK_SIZE_CHARS: int = int(os.environ.get("RAG_CHUNK_SIZE_CHARS", "1200"))
RAG_CHUNK_OVERLAP_CHARS: int = int(os.environ.get("RAG_CHUNK_OVERLAP_CHARS", "150"))
RAG_QUERY_TOP_K: int = int(os.environ.get("RAG_QUERY_TOP_K", "5"))
RAG_QUERY_CACHE_TTL_SECONDS: int = int(os.environ.get("RAG_QUERY_CACHE_TTL_SECONDS", "300"))
RAG_QUERY_RATE_LIMIT_MAX: int = int(os.environ.get("RAG_QUERY_RATE_LIMIT_MAX", "30"))
RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS: int = int(os.environ.get("RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS", "60"))
RAG_QUERY_DEFAULT_MAX_AGE_DAYS: int = int(os.environ.get("RAG_QUERY_DEFAULT_MAX_AGE_DAYS", "365"))
RAG_QUERY_REQUIRE_READY_STATUS: bool = os.environ.get("RAG_QUERY_REQUIRE_READY_STATUS", "true").strip().lower() in (
RAG_DOC_CACHE_TTL_SECONDS: int = int(os.environ.get("RAG_DOC_CACHE_TTL_SECONDS", "2592000"))
RAG_REDIS_PREFIX: str = os.environ.get("RAG_REDIS_PREFIX", "rag").strip()
````

## File: py_fn/src/core/constants/.gitkeep
````

````

## File: py_fn/src/core/exceptions/.gitkeep
````

````

## File: py_fn/src/core/security/.gitkeep
````

````

## File: py_fn/src/core/types/.gitkeep
````

````

## File: py_fn/src/core/utils/.gitkeep
````

````

## File: py_fn/src/domain/__init__.py
````python
"""Domain layer package."""
````

## File: py_fn/src/domain/aggregate/__init__.py
````python
"""Domain aggregate roots."""
````

## File: py_fn/src/domain/aggregate/.gitkeep
````

````

## File: py_fn/src/domain/entities/__init__.py
````python
"""Domain entities."""
````

## File: py_fn/src/domain/entities/.gitkeep
````

````

## File: py_fn/src/domain/events/__init__.py
````python
"""Domain events."""
````

## File: py_fn/src/domain/events/.gitkeep
````

````

## File: py_fn/src/domain/exceptions/__init__.py
````python
"""Domain exceptions."""
````

## File: py_fn/src/domain/exceptions/.gitkeep
````

````

## File: py_fn/src/domain/repositories/__init__.py
````python
"""Domain repository contracts."""
⋮----
__all__ = [
````

## File: py_fn/src/domain/repositories/.gitkeep
````

````

## File: py_fn/src/domain/repositories/rag.py
````python
class RagQueryGateway(Protocol)
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str: ...
def get_query_cache(self, cache_key: str) -> dict[str, Any] | None: ...
def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None: ...
def to_query_vector(self, query: str) -> list[float]: ...
def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]: ...
def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]: ...
def generate_answer(self, *, query: str, context_block: str) -> str: ...
⋮----
class RagIngestionGateway(Protocol)
⋮----
def embed_texts(self, texts: list[str], model: str) -> list[list[float]]: ...
def upsert_vectors(self, items: list[dict[str, Any]], namespace: str = "") -> Any: ...
def upsert_search_documents(self, documents: list[dict[str, Any]]) -> int: ...
def redis_set_json(self, key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None: ...
class DocumentPipelineGateway(Protocol)
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf") -> Any: ...
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None: ...
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None: ...
def parsed_json_path(self, upload_object_path: str) -> str: ...
def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str: ...
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes: ...
_rag_query_gateway: RagQueryGateway | None = None
_rag_ingestion_gateway: RagIngestionGateway | None = None
_document_pipeline_gateway: DocumentPipelineGateway | None = None
def register_rag_query_gateway(gateway: RagQueryGateway) -> None
⋮----
_rag_query_gateway = gateway
def get_rag_query_gateway() -> RagQueryGateway
def register_rag_ingestion_gateway(gateway: RagIngestionGateway) -> None
⋮----
_rag_ingestion_gateway = gateway
def get_rag_ingestion_gateway() -> RagIngestionGateway
def register_document_pipeline_gateway(gateway: DocumentPipelineGateway) -> None
⋮----
_document_pipeline_gateway = gateway
def get_document_pipeline_gateway() -> DocumentPipelineGateway
````

## File: py_fn/src/domain/services/__init__.py
````python
"""Domain services."""
````

## File: py_fn/src/domain/services/.gitkeep
````

````

## File: py_fn/src/domain/value_objects/__init__.py
````python
"""Domain value objects."""
⋮----
__all__ = [
````

## File: py_fn/src/domain/value_objects/.gitkeep
````

````

## File: py_fn/src/domain/value_objects/rag.py
````python
@dataclass(frozen=True)
class RagQueryInput
⋮----
query: str
account_scope: str
workspace_scope: str
top_k: int
taxonomy_filters: tuple[str, ...]
max_age_days: int
require_ready: bool
⋮----
normalized_query = (query or "").strip()
normalized_scope = (account_scope or "").strip()
normalized_workspace_scope = (workspace_scope or "").strip()
⋮----
effective_top_k = default_top_k
⋮----
effective_top_k = int(top_k)
⋮----
effective_top_k = min(effective_top_k, max_top_k)
normalized_filters = tuple(
⋮----
effective_max_age_days = default_max_age_days
⋮----
effective_max_age_days = int(max_age_days)
⋮----
@property
    def has_query(self) -> bool
def retrieval_top_k(self, multiplier: int = 4, cap: int = 40) -> int
⋮----
@dataclass(frozen=True)
class RagCitation
⋮----
provider: str
doc_id: str | None = None
chunk_id: str | None = None
score: float | int | None = None
filename: str | None = None
json_gcs_uri: str | None = None
search_id: str | None = None
account_id: str | None = None
workspace_id: str | None = None
taxonomy: str | None = None
processing_status: str | None = None
indexed_at: str | None = None
def to_dict(self) -> dict[str, Any]
⋮----
@dataclass(frozen=True)
class RagQueryResult
⋮----
answer: str
citations: tuple[RagCitation, ...]
cache: str
vector_hits: int
search_hits: int
⋮----
debug: dict[str, Any] | None = None
⋮----
payload: dict[str, Any] = {
````

## File: py_fn/src/infrastructure/__init__.py
````python
"""Infrastructure layer package."""
````

## File: py_fn/src/infrastructure/audit/qstash.py
````python
logger = logging.getLogger(__name__)
def publish_query_audit(*, query: str, top_k: int, citation_count: int, vector_hits: int, search_hits: int) -> None
````

## File: py_fn/src/infrastructure/cache/rag_query_cache.py
````python
def build_query_cache_key(*, account_scope: str, query: str, top_k: int) -> str
⋮----
key_base = (
digest = hashlib.sha256(key_base.encode("utf-8")).hexdigest()
⋮----
def get_query_cache(cache_key: str) -> dict[str, Any] | None
def save_query_cache(cache_key: str, payload: dict[str, Any]) -> None
````

## File: py_fn/src/infrastructure/config/.gitkeep
````

````

## File: py_fn/src/infrastructure/external/__init__.py
````python
"""External service adapters."""
````

## File: py_fn/src/infrastructure/external/documentai/__init__.py
````python
"""Google Document AI integration."""
````

## File: py_fn/src/infrastructure/external/documentai/client.py
````python
"""
Document AI 服務層 — 封裝 google-cloud-documentai 的 process_document 呼叫。
用法：
    from infrastructure.external.documentai.client import process_document_bytes
    result = process_document_bytes(content=pdf_bytes, mime_type="application/pdf")
    print(result.text)
"""
⋮----
logger = logging.getLogger(__name__)
# 模組層級 client — 使用 asia-southeast1 regional endpoint
_client: documentai.DocumentProcessorServiceClient | None = None
def _get_client() -> documentai.DocumentProcessorServiceClient
⋮----
client_options = {"api_endpoint": DOCAI_API_ENDPOINT}
_client = documentai.DocumentProcessorServiceClient(
⋮----
@dataclass
class ParsedDocument
⋮----
"""Document AI 解析結果的精簡表示。"""
text: str
"""文件的全文純文字。"""
page_count: int
"""頁數。"""
mime_type: str
"""原始文件的 MIME 類型。"""
⋮----
"""
    送出 bytes 內容給 Document AI 同步解析。
    Args:
        content:        原始文件的二進位內容（PDF / TIFF / PNG …）。
        mime_type:      文件的 MIME 類型，預設 application/pdf。
        processor_name: Document AI processor 的完整資源名稱；
                        預設讀取 config.DOCAI_PROCESSOR_NAME。
    Returns:
        ParsedDocument: 包含 text / page_count / mime_type。
    Raises:
        google.api_core.exceptions.GoogleAPICallError: API 呼叫失敗時。
    """
client = _get_client()
raw_document = documentai.RawDocument(content=content, mime_type=mime_type)
request = documentai.ProcessRequest(
⋮----
response = client.process_document(request=request)
document = response.document
⋮----
"""
    從 GCS URI 提供的檔案，使用 Document AI 同步解析。
    Document AI 直接從 GCS 讀取，不需要下載到記憶體。
    Args:
        gcs_uri:        GCS 檔案路徑，格式為 gs://bucket-name/path/to/file。
        mime_type:      文件的 MIME 類型，預設 application/pdf。
        processor_name: Document AI processor 的完整資源名稱；
                        預設讀取 config.DOCAI_PROCESSOR_NAME。
    Returns:
        ParsedDocument: 包含 text / page_count / mime_type。
    Raises:
        google.api_core.exceptions.GoogleAPICallError: API 呼叫失敗時。
    """
⋮----
gcs_document = documentai.GcsDocument(gcs_uri=gcs_uri, mime_type=mime_type)
````

## File: py_fn/src/infrastructure/external/openai/__init__.py
````python
"""OpenAI integration — client, embeddings, and LLM wrappers."""
⋮----
__all__ = [
````

## File: py_fn/src/infrastructure/external/openai/client.py
````python
"""
OpenAI client service — 提供 embeddings / LLM 共用 client。
"""
⋮----
_client: OpenAI | None = None
def get_openai_client() -> OpenAI
⋮----
"""
    取得單例 OpenAI client。
    Raises:
        RuntimeError: OPENAI_API_KEY 未設定時。
    """
⋮----
_client = OpenAI(
````

## File: py_fn/src/infrastructure/external/openai/embeddings.py
````python
"""
Embeddings service — 封裝 OpenAI embedding 呼叫。
"""
⋮----
def _build_embedding_kwargs(model_name: str) -> dict
⋮----
kwargs = {"model": model_name}
⋮----
def embed_text(text: str, model: str | None = None) -> list[float]
⋮----
"""
    產生單段文字 embedding。
    Args:
        text: 需嵌入的文字。
        model: 覆蓋預設模型，未傳則使用 OPENAI_EMBEDDING_MODEL。
    Returns:
        list[float]: embedding 向量。
    """
client = get_openai_client()
model_name = model or OPENAI_EMBEDDING_MODEL
resp = client.embeddings.create(
⋮----
def embed_texts(texts: list[str], model: str | None = None) -> list[list[float]]
⋮----
"""
    批次產生多段文字 embeddings。
    Args:
        texts: 文字列表。
        model: 覆蓋預設模型，未傳則使用 OPENAI_EMBEDDING_MODEL。
    Returns:
        list[list[float]]: 與輸入順序一致的向量列表。
    """
````

## File: py_fn/src/infrastructure/external/openai/llm.py
````python
"""
LLM service — 封裝 OpenAI chat completion 呼叫。
"""
⋮----
"""
    呼叫 LLM 取得單次文字回覆。
    Args:
        messages: OpenAI chat messages。
        model: 覆蓋預設模型，未傳則使用 OPENAI_LLM_MODEL。
        temperature: 取樣溫度。
    Returns:
        str: 模型輸出文字。
    """
client = get_openai_client()
resp = client.chat.completions.create(
content = resp.choices[0].message.content
````

## File: py_fn/src/infrastructure/external/openai/rag_query.py
````python
def to_query_vector(query: str, *, model: str) -> list[float]
def generate_answer(*, query: str, context_block: str) -> str
````

## File: py_fn/src/infrastructure/external/upstash/__init__.py
````python
"""Upstash integration (Vector / Redis / Search / QStash)."""
````

## File: py_fn/src/infrastructure/external/upstash/clients.py
````python
"""
Upstash clients — 使用官方 Python SDK 建立 Vector / Redis / QStash 客戶端。
"""
⋮----
_VECTOR_INDEX: Any | None = None
_REDIS_CLIENT: Any | None = None
_QSTASH_CLIENT: Any | None = None
_SEARCH_INDEX: Any | None = None
logger = logging.getLogger(__name__)
class UpstashConfigError(RuntimeError)
⋮----
"""Upstash 配置缺失。"""
class UpstashSdkError(RuntimeError)
⋮----
"""Upstash SDK 載入失敗。"""
def _require(value: str, name: str) -> str
def _import_module(module_name: str, install_hint: str)
def get_vector_index() -> Any
⋮----
"""取得 Upstash Vector 官方 SDK Index 實例（單例）。"""
⋮----
mod = _import_module("upstash_vector", "pip install upstash-vector")
index_cls = getattr(mod, "Index", None)
⋮----
_VECTOR_INDEX = index_cls(
⋮----
def get_redis_client() -> Any
⋮----
"""取得 Upstash Redis 官方 SDK client（單例）。"""
⋮----
mod = _import_module("upstash_redis", "pip install upstash-redis")
redis_cls = getattr(mod, "Redis", None)
⋮----
_REDIS_CLIENT = redis_cls(
⋮----
def get_qstash_client() -> Any
⋮----
"""取得 QStash 官方 SDK client（單例）。"""
⋮----
mod = _import_module("qstash", "pip install qstash")
client_cls = getattr(mod, "QStash", None)
⋮----
# 新舊 SDK 參數名稱兼容
kwargs: dict[str, Any] = {
⋮----
_QSTASH_CLIENT = client_cls(**kwargs)
⋮----
# 退回最小初始化方式
_QSTASH_CLIENT = client_cls(token=_require(QSTASH_TOKEN, "QSTASH_TOKEN"))
⋮----
def get_search_index() -> Any
⋮----
"""取得 Upstash Search 官方 SDK index（單例）。"""
⋮----
mod = _import_module("upstash_search", "pip install upstash-search")
search_cls = getattr(mod, "Search", None)
⋮----
index_name = UPSTASH_SEARCH_INDEX or "default"
client = search_cls(
_SEARCH_INDEX = client.index(index_name)
⋮----
def _normalize_vector_item(item: Any) -> dict[str, Any]
def upsert_vectors(items: list[dict[str, Any]], namespace: str = "") -> Any
⋮----
"""
    批次 upsert 向量資料到 Upstash Vector。
    items 每筆至少包含：
      - id: str
      - vector: list[float]
      - metadata: dict[str, Any]
    """
index = get_vector_index()
sdk_payload = [
tuples_payload = [
⋮----
"""查詢 Upstash Vector，統一輸出為 list[dict]。"""
⋮----
result = index.query(
⋮----
result = index.query(vector=vector, top_k=top_k, namespace=namespace)
⋮----
candidates = result.get("result") or result.get("matches") or result.get("data") or []
⋮----
def redis_get_json(key: str) -> dict[str, Any] | None
⋮----
"""從 Upstash Redis 讀取 JSON 字串並反序列化。"""
client = get_redis_client()
raw = client.get(key)
⋮----
raw_text = raw.decode("utf-8", errors="ignore")
⋮----
raw_text = str(raw)
⋮----
parsed = json.loads(raw_text)
⋮----
def redis_set_json(key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None
⋮----
"""將 dict 寫入 Upstash Redis；可選擇 TTL。"""
⋮----
payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
⋮----
"""固定窗限流：回傳 (allowed, remaining)。"""
⋮----
current = int(client.incr(key) or 0)
⋮----
allowed = current <= max_requests
remaining = max(0, max_requests - current)
⋮----
def upsert_search_documents(documents: list[dict[str, Any]]) -> int
⋮----
"""批次寫入 Upstash Search index（best effort，不拋出上層）。"""
⋮----
normalized: list[dict[str, Any]] = []
⋮----
doc_id = str(item.get("id") or "").strip()
⋮----
content = item.get("content") if isinstance(item.get("content"), dict) else {}
metadata = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
⋮----
index = get_search_index()
⋮----
def query_search_documents(query: str, top_k: int) -> list[dict[str, Any]]
⋮----
"""
    以 Upstash Search REST 進行補充檢索（best effort）。
    回傳格式統一為 list[dict]，單筆含 text / score / source 等欄位。
    """
⋮----
# Prefer official SDK first; fallback to REST probing for compatibility.
⋮----
result = index.search(query=query, limit=top_k)
⋮----
items = result
⋮----
items = (
⋮----
items = getattr(result, "results", None) or getattr(result, "data", None) or []
⋮----
item = dict(item)
⋮----
text = str(
⋮----
endpoint_base = UPSTASH_SEARCH_REST_URL.rstrip("/")
body_candidates = [
path_candidates = ["/query", "/search"]
⋮----
url = f"{endpoint_base}{path}"
⋮----
raw = None
⋮----
req = urlrequest.Request(
⋮----
raw = resp.read().decode("utf-8", errors="ignore")
⋮----
payload = json.loads(raw)
⋮----
candidates = []
⋮----
candidates = (
⋮----
candidates = payload
⋮----
def publish_qstash_json(url: str, body: dict[str, Any], delay: str | None = None) -> bool
⋮----
"""透過 QStash 投遞 JSON 訊息（best effort）。"""
target_url = url.strip()
⋮----
client = get_qstash_client()
⋮----
publish_json = getattr(client, "publish_json", None)
⋮----
publish = getattr(client, "publish", None)
````

## File: py_fn/src/infrastructure/external/upstash/rag_query.py
````python
def query_vector(vector: list[float], top_k: int) -> list[dict]
def query_search(query: str, top_k: int) -> list[dict]
````

## File: py_fn/src/infrastructure/logging/.gitkeep
````

````

## File: py_fn/src/infrastructure/persistence/__init__.py
````python
"""Persistence adapters."""
````

## File: py_fn/src/infrastructure/persistence/firestore/__init__.py
````python
"""Firestore persistence."""
````

## File: py_fn/src/infrastructure/persistence/firestore/document_repository.py
````python
"""
Firestore 服務層 — 使用 firebase-admin 管理完整的 document lifecycle。
Firestore 只存輕量索引（供 account-scoped 列表），
解析全文以 JSON 格式存回 GCS 的對應路徑（files/ 前綴）。
Document Schema:
    {
        "id": "doc-abc123",
        "status": "processing" | "completed" | "error",
        "source": {
            "gcs_uri": "gs://bucket/uploads/file.pdf",
            "filename": "file.pdf",
            "size_bytes": 102400,
            "uploaded_at": "2026-03-22T...",
            "mime_type": "application/pdf"
        },
        "parsed": {
            "json_gcs_uri": "gs://bucket/files/file.json",   // 全文 JSON 位置
            "page_count": 5,
            "parsed_at": "2026-03-22T...",
            "extraction_ms": 1234
        },
        "error": {  // 只在 status=error 時出現
            "message": "...",
            "timestamp": "2026-03-22T..."
        }
    }
用法：
    init_document(doc_id, gcs_uri, filename, size_bytes, mime_type)
    update_parsed(doc_id, json_gcs_uri, page_count, extraction_ms)
    record_error(doc_id, message)
"""
⋮----
logger = logging.getLogger(__name__)
def _document_ref(doc_id: str, account_id: str)
⋮----
"""Resolve strict account-scoped document reference."""
⋮----
db = fb_firestore.client()
⋮----
"""
    初始化 Firestore document，標記為 processing 狀態。
    在檔案上傳到 GCS 時呼叫，建立初始的 source metadata。
    Args:
        doc_id:      文件識別碼。
        gcs_uri:     GCS 位置，例如 gs://bucket/path/file.pdf
        filename:    原始檔名。
        size_bytes:  文件大小（位元組）。
        mime_type:   MIME 類型。
    """
ref = _document_ref(doc_id, account_id)
payload = {
⋮----
"""
    更新 document 的解析結果索引，標記為 completed 狀態。
    全文內容已寫入 GCS JSON 檔（json_gcs_uri），
    Firestore 只保留輕量索引供前端列表使用。
    Args:
        doc_id:         文件識別碼。
        json_gcs_uri:   GCS JSON 檔案位置，例如 gs://bucket/files/file.json
        page_count:     頁數。
        extraction_ms:  解析耗時（毫秒），非必填。
    """
⋮----
def record_error(doc_id: str, message: str, account_id: str) -> None
⋮----
"""
    記錄解析錯誤，標記為 error 狀態。
    在 Document AI 呼叫失敗時呼叫。
    Args:
        doc_id:  文件識別碼。
        message: 錯誤訊息。
    """
⋮----
"""標記 RAG ingestion 完成（ready）。"""
⋮----
def record_rag_error(doc_id: str, message: str, account_id: str) -> None
⋮----
"""記錄 RAG ingestion 失敗，不覆蓋 parse 狀態。"""
````

## File: py_fn/src/infrastructure/persistence/storage/__init__.py
````python
"""Cloud Storage persistence."""
````

## File: py_fn/src/infrastructure/persistence/storage/client.py
````python
"""
Cloud Storage 服務層 — 使用 firebase-admin 的 storage 模組下載／上傳物件。
用法：
    from infrastructure.persistence.storage.client import download_bytes, upload_json
    data = download_bytes(bucket_name="my-bucket", object_path="uploads/doc.pdf")
    uri  = upload_json(bucket_name="my-bucket", object_path="files/doc.json", data={...})
"""
⋮----
logger = logging.getLogger(__name__)
# 上傳檔案路徑前綴 → 解析結果前綴
_UPLOAD_PREFIX = "uploads/"
_FILES_PREFIX = "files/"
def parsed_json_path(upload_object_path: str) -> str
⋮----
"""
    將 GCS 上傳路徑轉換為對應的解析結果 JSON 路徑。
    規則：
      - 去掉 uploads/ 前綴，換成 files/ 前綴
      - 副檔名替換為 .json
    範例：
        uploads/org/ws/file.pdf  ->  files/org/ws/file.json
        uploads/doc.png          ->  files/doc.json
    """
relative = upload_object_path.removeprefix(_UPLOAD_PREFIX)
⋮----
def upload_json(bucket_name: str, object_path: str, data: dict) -> str
⋮----
"""
    將 dict 序列化為 JSON 後上傳至 Cloud Storage。
    Args:
        bucket_name: GCS bucket 名稱（不含 gs:// 前綴）。
        object_path: bucket 內的目標路徑，例如 files/org/ws/file.json
        data:        要序列化的資料，必須可 JSON 序列化。
    Returns:
        str: gs:// 完整 URI，例如 gs://bucket/files/org/ws/file.json
    """
bucket = fb_storage.bucket(bucket_name)
blob = bucket.blob(object_path)
# 緊湊序列化可降低 CPU 與儲存傳輸成本。
json_bytes = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
⋮----
uri = f"gs://{bucket_name}/{object_path}"
⋮----
def download_bytes(bucket_name: str, object_path: str) -> bytes
⋮----
"""
    從 Cloud Storage 下載物件並回傳 bytes。
    Args:
        bucket_name: GCS bucket 名稱（不含 gs:// 前綴）。
        object_path: bucket 內的物件路徑。
    Returns:
        bytes: 物件的完整二進位內容。
    Raises:
        google.cloud.exceptions.NotFound: 物件不存在時。
    """
⋮----
data = blob.download_as_bytes()
````

## File: py_fn/src/infrastructure/repositories/.gitkeep
````

````

## File: py_fn/src/interface/__init__.py
````python
"""Interface layer package."""
````

## File: py_fn/src/interface/controllers/.gitkeep
````

````

## File: py_fn/src/interface/handlers/__init__.py
````python
"""Interface layer entrypoint adapters for Firebase handlers."""
⋮----
__all__ = [
````

## File: py_fn/src/interface/handlers/https.py
````python
"""
HTTPS Callable 觸發器 — 供前端主動觸發 Document AI 解析。
接受 GCS 檔案路徑，直接呼叫 Document AI（無記憶體複製），
解析全文寫回 GCS JSON，Firestore 僅存索引。
請求格式：
    {
        "account_id": "acc-123",
        "gcs_uri": "gs://my-bucket/uploads/my-doc.pdf",
        "size_bytes": 102400  # 選填
    }
Document AI 會直接從 GCS 讀取檔案，無須下載到 Python 函數記憶體。
結果會保存為：
    - GCS: files/.../*.json（完整解析）
    - Firestore: accounts/{account_id}/documents/{doc_id}（索引）
回應格式（立即返回）：
    {
        "doc_id": "my-doc",
        "status": "processing"  // 實際解析在後台進行（通醫 2-5 秒）
    }
前端應監聽 Firestore 文件狀態變化以追蹤進度。
"""
⋮----
logger = logging.getLogger(__name__)
def _extract_auth_uid(req: https_fn.CallableRequest) -> str
⋮----
auth = getattr(req, "auth", None)
⋮----
uid = str(getattr(auth, "uid", "")).strip()
⋮----
token = getattr(auth, "token", None)
⋮----
def _assert_account_access(uid: str, account_id: str) -> None
⋮----
db = fb_firestore.client()
snap = db.collection("accounts").document(account_id).get()
⋮----
data = snap.to_dict() or {}
owner_id = str(data.get("ownerId", "")).strip()
member_ids = data.get("memberIds") if isinstance(data.get("memberIds"), list) else []
member_set = {str(item or "").strip() for item in member_ids}
⋮----
def _assert_workspace_belongs_account(account_id: str, workspace_id: str) -> None
⋮----
snap = db.collection("workspaces").document(workspace_id).get()
⋮----
bound_account_id = str(data.get("accountId", "")).strip()
⋮----
def _parse_taxonomy_filters(raw_value: Any) -> list[str]
def _to_bool(raw_value: Any, default_value: bool) -> bool
⋮----
raw = str(raw_value or "").strip().lower()
⋮----
def _parse_gs_uri(gs_uri: str) -> tuple[str, str]
⋮----
path_part = gs_uri.split("gs://", 1)[1]
⋮----
def handle_parse_document(req: https_fn.CallableRequest) -> dict
⋮----
"""
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。
    輸入 GCS URI，Document AI 直接從 Cloud Storage 讀取並解析。
    Firestore 會記錄完整的 lifecycle（processing → completed/error）。
    Args:
        req.data: {
            "account_id": "acc-123",                # 必填
            "gcs_uri": "gs://bucket/path/file.pdf",  # 必填
            "mime_type": "application/pdf",           # 選填；如果省略則由副檔名推測
            "size_bytes": 102400                       # 選填
        }
    Returns:
        dict: {
            "doc_id": "file",
            "status": "processing"
        }
    Raises:
        https_fn.HttpsError: 缺少必填欄位時。
    """
runtime = get_document_pipeline()
data: dict = req.data or {}
account_id = str(data.get("account_id", "")).strip()
workspace_id = str(data.get("workspace_id", "")).strip()
⋮----
gcs_uri: str = data.get("gcs_uri", "").strip()
⋮----
# 解析 GCS URI 得到儲存檔名，用於 doc_id。
path_part = gcs_uri.split("gs://", 1)[1]  # "bucket/path/to/file.pdf"
storage_filename = os.path.basename(path_part)     # "file.pdf"
doc_id, ext = os.path.splitext(storage_filename)   # "file", ".pdf"
filename = (
# 推測 MIME 類型
mime_type = data.get("mime_type", "").strip()
⋮----
_mime_map = {
mime_type = _mime_map.get(ext.lower())
⋮----
size_bytes = data.get("size_bytes", 0)
⋮----
# ── 初始化 Firestore document ───────────────────────────────────────────
⋮----
# 解析 gs://bucket/path，取得 bucket 與 object_path
⋮----
# ── 同步解析（保持函數活躍直到完成） ─────────────────────────────────────
start_time = time.time()
⋮----
parsed = runtime.process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
extraction_ms = int((time.time() - start_time) * 1000)
# 解析結果全文寫回 GCS JSON（與 uploads 目錄結構對應）
json_object_path = runtime.parsed_json_path(object_path)
json_gcs_uri = runtime.upload_json(
⋮----
# Step 5/6: RAG ingestion（embed + vector + ready）
⋮----
rag = ingest_document_for_rag(
⋮----
# 立即回覆（無論成功或失敗，Firestore 狀態已更新）
⋮----
"status": "processing",  # 前端應監聽 Firestore 的實際狀態
⋮----
def handle_rag_query(req: https_fn.CallableRequest) -> dict
⋮----
"""HTTPS Callable：RAG 查詢（Step 7）。"""
uid = _extract_auth_uid(req)
⋮----
query = str(data.get("query", "")).strip()
⋮----
top_k = data.get("top_k")
⋮----
top_k_int = int(top_k) if top_k is not None else None
⋮----
top_k_int = None
⋮----
max_age_days = int(data.get("max_age_days")) if data.get("max_age_days") is not None else None
⋮----
max_age_days = None
taxonomy_filters = _parse_taxonomy_filters(data.get("taxonomy_filters"))
require_ready = _to_bool(data.get("require_ready"), RAG_QUERY_REQUIRE_READY_STATUS)
⋮----
result = execute_rag_query(
response = {
⋮----
def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict
⋮----
"""HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion。"""
⋮----
doc_id = str(data.get("doc_id", "")).strip()
json_gcs_uri = str(data.get("json_gcs_uri", "")).strip()
source_gcs_uri = str(data.get("source_gcs_uri", "")).strip()
⋮----
page_count = int(data.get("page_count", 0) or 0)
⋮----
page_count = 0
⋮----
json_bytes = runtime.download_bytes(bucket_name=bucket_name, object_path=object_path)
parsed_payload = json.loads(json_bytes.decode("utf-8")) if json_bytes else {}
text = str(parsed_payload.get("text", "")).strip()
⋮----
source_gcs_uri = str(parsed_payload.get("source_gcs_uri", "")).strip()
⋮----
workspace_id = str(parsed_payload.get("workspace_id", "")).strip()
⋮----
workspace_id = str((parsed_payload.get("metadata") or {}).get("space_id", "")).strip()
⋮----
page_count = int(parsed_payload.get("page_count", 0) or 0)
````

## File: py_fn/src/interface/handlers/storage.py
````python
"""
Storage 觸發器 — 監聽 GCS 物件建立事件，自動送 Document AI 解析。
流程：
    GCS object.finalized（uploads/ 前綴）
        → 建立初始 Firestore document（status=processing）
        → Document AI 直接從 GCS URI 讀取
        → 將解析全文以 JSON 格式寫回 GCS（files/ 前綴，同目錄結構）
        → 更新 Firestore 輕量索引（status=completed，含 json_gcs_uri）
        → 如失敗，記錄 error
Firestore 只存索引（供 /dev-tools 顯示已上傳檔案），
完整解析結果透過 json_gcs_uri 讀取 GCS JSON 檔。
"""
⋮----
logger = logging.getLogger(__name__)
# 只處理這個資料夾下的上傳檔案（空字串 = 處理整個 bucket）
WATCH_PREFIX: str = os.environ.get("WATCH_PREFIX", "uploads/")
# 支援的 MIME 類型對照表（副檔名 → MIME）
_MIME_MAP: dict[str, str] = {
def _mime_from_path(object_path: str) -> str | None
⋮----
"""Best-effort account scope binding for storage-triggered uploads.
    Priority:
    1) custom metadata field `account_id`
    2) path convention: uploads/{accountId}/...
    3) fallback: None (reject write)
    """
⋮----
from_meta = str(event_metadata.get("account_id", "")).strip()
⋮----
prefix = f"{WATCH_PREFIX}"
⋮----
remainder = object_path[len(prefix):]
# uploads/{accountId}/file.pdf
⋮----
candidate = remainder.split("/", 1)[0].strip()
⋮----
def _extract_workspace_id(event_metadata: dict | None) -> str | None
⋮----
workspace_id = str(event_metadata.get("workspace_id", "")).strip()
⋮----
def _extract_display_filename(object_path: str, event_metadata: dict | None) -> str
⋮----
candidates: tuple[Any, ...] = ()
⋮----
candidates = (
⋮----
filename = str(candidate or "").strip()
⋮----
"""
    Cloud Storage on_object_finalized 觸發器。
    - 只處理 WATCH_PREFIX 下、且為支援 MIME 類型的檔案。
    - 初始化 → Document AI 解析 → 更新 Firestore
    - 異常時記錄至 Firestore。
    """
runtime = get_document_pipeline()
data = event.data
⋮----
bucket_name: str = data.bucket
object_path: str = data.name or ""
size_bytes: int = int(data.size or 0)
# ── 路徑過濾 ────────────────────────────────────────────────────────────
⋮----
mime_type = _mime_from_path(object_path)
⋮----
account_id = _extract_account_id(object_path, data.metadata)
⋮----
workspace_id = _extract_workspace_id(data.metadata)
⋮----
# doc_id 由實際儲存物件名稱推導；顯示檔名則優先使用上傳時的 custom metadata。
storage_filename = os.path.basename(object_path)
display_filename = _extract_display_filename(object_path, data.metadata)
⋮----
gcs_uri = f"gs://{bucket_name}/{object_path}"
⋮----
# ── Step 1: 初始化 Firestore document ──────────────────────────────────
⋮----
# ── Step 2: Document AI 解析 ──────────────────────────────────────────
start_time = time.time()
⋮----
parsed = runtime.process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
extraction_ms = int((time.time() - start_time) * 1000)
# ── Step 3: 將解析全文寫回 GCS（files/ 前綴，同目錄結構）──────────
json_object_path = runtime.parsed_json_path(object_path)
json_data = {
json_gcs_uri = runtime.upload_json(
# ── Step 4: 更新 Firestore 索引（只存 metadata，不存全文）─────────
⋮----
# ── Step 5/6: RAG ingestion（embed + vector + ready）───────────────
⋮----
rag = ingest_document_for_rag(
````

## File: py_fn/src/interface/middleware/.gitkeep
````

````

## File: py_fn/src/interface/routes/.gitkeep
````

````

## File: py_fn/src/interface/schemas/.gitkeep
````

````

## File: py_fn/tests/conftest.py
````python
SRC_DIR = Path(__file__).resolve().parents[1] / "src"
````

## File: py_fn/tests/test_domain_repository_gateways.py
````python
class _FakeRagQueryGateway
⋮----
def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str
def get_query_cache(self, cache_key: str) -> dict | None
def save_query_cache(self, cache_key: str, payload: dict) -> None
def to_query_vector(self, query: str) -> list[float]
def query_vector(self, vector: list[float], top_k: int) -> list[dict]
def query_search(self, query: str, top_k: int) -> list[dict]
def generate_answer(self, *, query: str, context_block: str) -> str
⋮----
class _FakeRagIngestionGateway
⋮----
def embed_texts(self, texts: list[str], model: str) -> list[list[float]]
def upsert_vectors(self, items: list[dict], namespace: str = "") -> None
def upsert_search_documents(self, documents: list[dict]) -> int
def redis_set_json(self, key: str, value: dict, ttl_seconds: int = 0) -> None
class _FakeDocumentPipelineGateway
⋮----
def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf") -> dict
⋮----
def record_error(self, doc_id: str, message: str, account_id: str) -> None
def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None
def parsed_json_path(self, upload_object_path: str) -> str
def upload_json(self, *, bucket_name: str, object_path: str, data: dict) -> str
def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes
def test_register_gateways_WithAllGatewayTypes_RetrievesExactInstances() -> None
⋮----
rag_query_gateway = _FakeRagQueryGateway()
rag_ingestion_gateway = _FakeRagIngestionGateway()
document_pipeline_gateway = _FakeDocumentPipelineGateway()
⋮----
def test_applicationGatewayShim_AfterDomainRegistration_ReturnsIdenticalInstances() -> None
````

## File: README.md
````markdown
# Claude Agentic Framework

A drop-in template for Claude Code projects. Adds coordinated multi-agent swarms, specialized commands, 67 reusable skills, and safety hooks — all configured through a single install command.

## Install

Run this inside your project directory:

```bash
cd your-project
curl -sSL https://raw.githubusercontent.com/dralgorhythm/claude-agentic-framework/main/scripts/init-framework.sh | bash -s .
```

The script will:
- Copy `.claude/` (commands, skills, rules, hooks, agents, templates)
- Copy `.mcp.json` (MCP server configuration)
- Copy `CLAUDE.md` and `AGENTS.md` (project instructions)
- Create an `artifacts/` directory for planning documents
- Set up `.gitignore` entries
- Install hook dependencies
- Initialize [Beads](https://github.com/steveyegge/beads) issue tracking (required for swarm coordination)

### Beads Setup

Beads is the issue tracker that coordinates swarm workers — it's how agents claim tasks, track progress, and avoid conflicts. Install it before running the init script:

```bash
curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

The init script will then run `bd init` in your project automatically.

The script prompts before overwriting any existing files. Re-run it to pull in framework updates.

## After Install

1. **Edit `CLAUDE.md`** — Add your build/test commands and project context
2. **Edit `.claude/rules/tech-strategy.md`** — Configure your tech stack (this is required — the framework enforces whatever you put here)
3. Start Claude Code and try: `/architect hello`

## What You Get

### Commands

Single-agent expert modes, invoked via slash commands:

| Command | Role |
|---------|------|
| `/architect` | System design, ADRs |
| `/builder` | Implementation, debugging, testing |
| `/qa-engineer` | Test strategy, E2E, accessibility |
| `/security-auditor` | Threat modeling, security audits |
| `/ui-ux-designer` | Interface design, visual assets |
| `/code-check` | SOLID, DRY, consistency audit |

### Swarm Orchestrators

Multi-agent commands that fan work out across parallel workers:

| Command | What It Does |
|---------|-------------|
| `/swarm-plan` | Launches 3-6 explorer agents to research patterns, dependencies, and constraints — produces a decomposed plan |
| `/swarm-execute` | Picks up planned work, fans out across builder agents (up to 8 parallel), each running quality gates |
| `/swarm-review` | Launches 5 parallel reviewers (security, performance, architecture, tests, quality) — run 2-3 times |
| `/swarm-research` | Deep multi-source investigation with verification tiers |

### The Full Cycle

```
/architect <feature>  →  /swarm-plan  →  /swarm-execute  →  /swarm-review (2-3x)  →  PR
```

One agent thinks. Many agents build. Many agents review.

### Workers

Six specialized agent types tuned for cost and capability:

| Worker | Model | Use |
|--------|-------|-----|
| `worker-explorer` | Haiku | Fast codebase search, dependency mapping |
| `worker-builder` | Sonnet | Implementation, testing, refactoring |
| `worker-reviewer` | Opus | Code review, security analysis |
| `worker-researcher` | Sonnet | Quick web research, API docs |
| `worker-research` | Opus | Deep multi-source investigation |
| `worker-architect` | Opus | Complex design decisions, ADRs |

### Skills

67 skills across 7 categories — auto-suggested based on keywords in your prompt:

**Architecture** · **Engineering** · **Product** · **Security** · **Operations** · **Design** · **Languages & Frameworks**

Covers everything from `designing-systems` and `debugging` to `react-patterns`, `terraform`, and `application-security`. See [docs/skills.md](docs/skills.md) for the full list.

### Safety Hooks

Pre-configured hooks that run automatically:

- **Secret detection** — blocks commits containing API keys, tokens, private keys
- **Protected files** — prevents accidental modification of `.env`, `.mcp.json`, `.beads/`
- **Push blocking** — stops direct pushes to `main`/`master`
- **Dangerous command guard** — warns on `rm -rf`, force push, `terraform destroy`
- **File locking** — prevents concurrent edits in multi-agent swarms

### MCP Servers

Four servers pre-configured in `.mcp.json`:

| Server | Purpose |
|--------|---------|
| Sequential Thinking | Structured multi-step reasoning |
| Chrome DevTools | Browser testing, performance profiling |
| Context7 | Up-to-date library documentation |
| Filesystem | File operations beyond workspace |

## Customization

Everything is designed to be extended:

- Add commands → `.claude/commands/your-command.md`
- Add skills → `.claude/skills/category/your-skill/SKILL.md`
- Add rules → `.claude/rules/your-rule.md`
- Add hooks → `.claude/hooks/your-hook.sh`
- Add workers → `.claude/agents/worker-yourtype.md`

Templates for each are in `.claude/templates/`.

See [docs/customization.md](docs/customization.md) for details.

## Docs

- [Getting started](docs/getting-started.md)
- [Multi-agent swarms](docs/swarm.md)
- [Commands](docs/personas.md)
- [Skills reference](docs/skills.md)
- [MCP servers](docs/mcp-servers.md)
- [Hooks](docs/hooks.md)
- [Handoffs](docs/handoffs.md)
- [Beads setup & usage](docs/beads.md)
- [Customization](docs/customization.md)
````

## File: scripts/init-framework.sh
````bash
#!/bin/bash
# Claude Agentic Framework - Initialization Script
# Usage: ./init-framework.sh [/path/to/your/project]
set -e
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
# Repository URL for cloning when run via curl
REPO_URL="https://github.com/dralgorhythm/claude-agentic-framework.git"
# Determine framework source directory
# When run via curl | bash, BASH_SOURCE[0] is not a valid file path
if [ -f "${BASH_SOURCE[0]}" ]; then
    # Running from local file
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    FRAMEWORK_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
    TEMP_CLONE=""
else
    # Running via curl | bash - need to clone the repo
    echo "Downloading framework from repository..."
    TEMP_CLONE="$(mktemp -d)"
    git clone --depth 1 --quiet "$REPO_URL" "$TEMP_CLONE"
    FRAMEWORK_DIR="$TEMP_CLONE"
fi
# Cleanup function for temp directory
cleanup() {
    if [ -n "$TEMP_CLONE" ] && [ -d "$TEMP_CLONE" ]; then
        rm -rf "$TEMP_CLONE"
    fi
}
trap cleanup EXIT
# Target directory (default: current directory)
TARGET_DIR="${1:-.}"
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd || echo "$TARGET_DIR")"
# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}
print_error() {
    echo -e "${RED}✗${NC} $1"
}
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}
# Function to prompt user for confirmation
confirm() {
    local prompt="$1"
    local response
    read -r -p "$prompt [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}
# Function to show diff between two files
show_file_diff() {
    local existing="$1"
    local new="$2"
    local name="$3"
    if command -v diff &>/dev/null; then
        echo ""
        echo -e "${BLUE}--- Diff for ${name} ---${NC}"
        # Use color diff if available, otherwise plain diff
        if diff --color=auto /dev/null /dev/null 2>/dev/null; then
            diff --color=auto -u "$existing" "$new" 2>/dev/null || true
        else
            diff -u "$existing" "$new" 2>/dev/null || true
        fi
        echo -e "${BLUE}--- End diff ---${NC}"
        echo ""
    fi
}
# Function to show diff summary for directories
show_dir_diff() {
    local existing="$1"
    local new="$2"
    local name="$3"
    if command -v diff &>/dev/null; then
        echo ""
        echo -e "${BLUE}--- Changes in ${name}/ ---${NC}"
        # Show new files
        local new_files
        new_files=$(diff -rq "$existing" "$new" 2>/dev/null | grep "Only in $new" | sed "s|Only in $new[^:]*: |  + |" || true)
        if [ -n "$new_files" ]; then
            echo -e "${GREEN}New files:${NC}"
            echo "$new_files"
        fi
        # Show removed files
        local removed_files
        removed_files=$(diff -rq "$existing" "$new" 2>/dev/null | grep "Only in $existing" | sed "s|Only in $existing[^:]*: |  - |" || true)
        if [ -n "$removed_files" ]; then
            echo -e "${RED}Files only in existing:${NC}"
            echo "$removed_files"
        fi
        # Show modified files
        local modified_files
        modified_files=$(diff -rq "$existing" "$new" 2>/dev/null | grep "^Files .* differ$" | sed -E 's/Files (.*) and .* differ/  ~ \1/' || true)
        if [ -n "$modified_files" ]; then
            echo -e "${YELLOW}Modified files:${NC}"
            echo "$modified_files"
        fi
        # Count changes
        local total_changes
        total_changes=$(diff -rq "$existing" "$new" 2>/dev/null | wc -l | tr -d ' ')
        echo ""
        echo "Total: $total_changes file(s) differ"
        echo -e "${BLUE}--- End summary ---${NC}"
        echo ""
    fi
}
# Function to copy file with diff prompt
copy_file_with_diff() {
    local src="$1"
    local dst="$2"
    local name="$3"
    local optional="${4:-false}"
    if [ ! -f "$src" ]; then
        if [ "$optional" = "true" ]; then
            return 0
        fi
        print_error "Source file not found: $src"
        return 1
    fi
    if [ -f "$dst" ]; then
        # Check if files are identical
        if diff -q "$dst" "$src" &>/dev/null; then
            print_info "$name is already up to date"
            return 0
        fi
        print_warning "$name already exists with differences"
        show_file_diff "$dst" "$src" "$name"
        if confirm "  Overwrite $name?"; then
            cp "$src" "$dst"
            print_success "$name updated"
        else
            print_info "Skipped $name"
        fi
    else
        print_info "Copying $name..."
        cp "$src" "$dst"
        print_success "$name installed"
    fi
}
# Function to copy directory with diff prompt
copy_dir_with_diff() {
    local src="$1"
    local dst="$2"
    local name="$3"
    local optional="${4:-false}"
    if [ ! -d "$src" ]; then
        if [ "$optional" = "true" ]; then
            return 0
        fi
        print_error "Source directory not found: $src"
        return 1
    fi
    if [ -d "$dst" ]; then
        # Check if directories are identical
        if diff -rq "$dst" "$src" &>/dev/null; then
            print_info "$name/ is already up to date"
            return 0
        fi
        print_warning "$name/ already exists with differences"
        show_dir_diff "$dst" "$src" "$name"
        if confirm "  Overwrite $name/?"; then
            rm -rf "$dst"
            cp -r "$src" "$dst"
            print_success "$name/ updated"
        else
            print_info "Skipped $name/"
        fi
    else
        print_info "Copying $name/..."
        cp -r "$src" "$dst"
        print_success "$name/ installed"
    fi
}
# Validate target directory
if [ ! -d "$TARGET_DIR" ]; then
    print_error "Target directory does not exist: $TARGET_DIR"
    exit 1
fi
# Detect project name (prefer GitHub repo name, fallback to directory name)
detect_project_name() {
    local dir="$1"
    # Try to get GitHub repo name from git remote
    if [ -d "$dir/.git" ] || git -C "$dir" rev-parse --git-dir &>/dev/null; then
        local remote_url
        remote_url=$(git -C "$dir" remote get-url origin 2>/dev/null || echo "")
        if [ -n "$remote_url" ]; then
            # Extract repo name from various URL formats:
            # https://github.com/user/repo.git -> repo
            # git@github.com:user/repo.git -> repo
            # https://github.com/user/repo -> repo
            local repo_name
            repo_name=$(echo "$remote_url" | sed -E 's#.*/([^/]+)(\.git)?$#\1#' | sed 's/\.git$//')
            if [ -n "$repo_name" ]; then
                echo "$repo_name"
                return
            fi
        fi
    fi
    # Fallback to directory name
    basename "$dir"
}
PROJECT_NAME="$(detect_project_name "$TARGET_DIR")"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Claude Agentic Framework - Initialization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "Framework source: $FRAMEWORK_DIR"
print_info "Target directory: $TARGET_DIR"
print_info "Project name: $PROJECT_NAME"
echo ""
# Copy core directories with diff support
copy_dir_with_diff "$FRAMEWORK_DIR/.claude" "$TARGET_DIR/.claude" ".claude"
# Create artifacts directory if it doesn't exist
if [ ! -d "$TARGET_DIR/artifacts" ]; then
    print_info "Creating artifacts directory..."
    mkdir -p "$TARGET_DIR/artifacts"
    print_success "artifacts directory created"
else
    print_info "artifacts directory already exists"
fi
# Copy config files with diff support
copy_file_with_diff "$FRAMEWORK_DIR/.gitattributes" "$TARGET_DIR/.gitattributes" ".gitattributes"
copy_file_with_diff "$FRAMEWORK_DIR/.mcp.json" "$TARGET_DIR/.mcp.json" ".mcp.json"
# Initialize Beads issue tracking (required for swarm coordination)
if [ ! -d "$TARGET_DIR/.beads" ]; then
    if command -v bd &>/dev/null; then
        print_info "Initializing Beads issue tracking..."
        if (cd "$TARGET_DIR" && bd init 2>/dev/null); then
            print_success "Beads initialized"
        else
            print_warning "Beads initialization failed. Run 'bd init' manually for swarm coordination."
        fi
    else
        print_warning "Beads CLI not found — required for swarm coordination"
        print_info "  Install: curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash"
        print_info "  Then: cd $TARGET_DIR && bd init"
    fi
else
    print_info ".beads/ already initialized"
fi
# Copy CLAUDE.md and AGENTS.md with diff support
copy_file_with_diff "$FRAMEWORK_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md" "CLAUDE.md"
copy_file_with_diff "$FRAMEWORK_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md" "AGENTS.md"
# Copy README.md with diff support (optional for existing projects)
if [ ! -f "$TARGET_DIR/README.md" ]; then
    print_warning "README.md does not exist"
    if confirm "  Create README.md from framework template?"; then
        cp "$FRAMEWORK_DIR/README.md" "$TARGET_DIR/README.md"
        print_success "README.md created"
    else
        print_info "Skipped README.md"
    fi
else
    # Only show diff for README if user wants to see framework updates
    if ! diff -q "$TARGET_DIR/README.md" "$FRAMEWORK_DIR/README.md" &>/dev/null; then
        print_info "README.md exists (differs from framework template)"
        if confirm "  View diff and optionally update?"; then
            show_file_diff "$TARGET_DIR/README.md" "$FRAMEWORK_DIR/README.md" "README.md"
            if confirm "  Overwrite README.md with framework template?"; then
                cp "$FRAMEWORK_DIR/README.md" "$TARGET_DIR/README.md"
                print_success "README.md updated"
            else
                print_info "Kept existing README.md"
            fi
        else
            print_info "Skipped README.md"
        fi
    else
        print_info "README.md is already up to date"
    fi
fi
# Create or update .gitignore (append mode for existing files)
GITIGNORE_ENTRIES=(
    "# Dependencies"
    "node_modules/"
    ".pnpm-store/"
    "__pycache__/"
    "*.pyc"
    ".venv/"
    "venv/"
    "# Build outputs"
    "dist/"
    "build/"
    "*.o"
    "*.so"
    "*.exe"
    "# IDE"
    ".vscode/"
    ".idea/"
    "*.swp"
    "*.swo"
    "*~"
    "# OS"
    ".DS_Store"
    "Thumbs.db"
    "# Environment"
    ".env"
    ".env.local"
    "*.local"
    "# Logs"
    "*.log"
    "npm-debug.log*"
    "# Claude Framework"
    "scratchpad/"
)
if [ ! -f "$TARGET_DIR/.gitignore" ]; then
    print_warning ".gitignore does not exist"
    if confirm "  Create basic .gitignore?"; then
        printf '%s\n' "${GITIGNORE_ENTRIES[@]}" > "$TARGET_DIR/.gitignore"
        print_success ".gitignore created"
    else
        print_info "Skipped .gitignore"
    fi
else
    # Find missing entries (excluding comments)
    MISSING_ENTRIES=()
    for entry in "${GITIGNORE_ENTRIES[@]}"; do
        # Skip comment lines for matching
        if [[ "$entry" == \#* ]]; then
            continue
        fi
        # Check if entry exists in current .gitignore (exact line match)
        if ! grep -Fxq "$entry" "$TARGET_DIR/.gitignore" 2>/dev/null; then
            MISSING_ENTRIES+=("$entry")
        fi
    done
    if [ ${#MISSING_ENTRIES[@]} -eq 0 ]; then
        print_info ".gitignore already contains all framework entries"
    else
        print_warning ".gitignore is missing ${#MISSING_ENTRIES[@]} framework entries"
        echo ""
        echo -e "${BLUE}--- Entries to append ---${NC}"
        for entry in "${MISSING_ENTRIES[@]}"; do
            echo -e "${GREEN}  + $entry${NC}"
        done
        echo -e "${BLUE}--- End entries ---${NC}"
        echo ""
        if confirm "  Append missing entries to .gitignore?"; then
            # Add a blank line separator if file doesn't end with newline
            if [ -s "$TARGET_DIR/.gitignore" ] && [ "$(tail -c1 "$TARGET_DIR/.gitignore" | wc -l)" -eq 0 ]; then
                echo "" >> "$TARGET_DIR/.gitignore"
            fi
            # Add framework section header
            echo "" >> "$TARGET_DIR/.gitignore"
            echo "# Claude Agentic Framework" >> "$TARGET_DIR/.gitignore"
            for entry in "${MISSING_ENTRIES[@]}"; do
                echo "$entry" >> "$TARGET_DIR/.gitignore"
            done
            print_success ".gitignore updated (${#MISSING_ENTRIES[@]} entries appended)"
        else
            print_info "Kept existing .gitignore"
        fi
    fi
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Framework initialization complete!"
echo ""
# Create hook runtime directories
mkdir -p "$TARGET_DIR/.claude/hooks/.state" "$TARGET_DIR/.claude/hooks/.locks"
print_success "Hook runtime directories created (.state, .locks)"
# Make hook scripts executable
if [ -d "$TARGET_DIR/.claude/hooks" ]; then
    chmod +x "$TARGET_DIR/.claude/hooks"/*.sh 2>/dev/null || true
    print_success "Hook scripts made executable"
fi
# Install hook dependencies if needed
if [ -f "$TARGET_DIR/.claude/hooks/package.json" ]; then
    print_info "Installing hook dependencies..."
    echo ""
    INSTALL_OK=false
    if command -v pnpm &> /dev/null; then
        (cd "$TARGET_DIR/.claude/hooks" && pnpm install --silent) && INSTALL_OK=true
    elif command -v npm &> /dev/null; then
        (cd "$TARGET_DIR/.claude/hooks" && npm install --silent) && INSTALL_OK=true
    else
        print_warning "Neither pnpm nor npm found - skipping dependency installation"
        print_info "Install Node.js and run: cd .claude/hooks && npm install"
    fi
    if [ "$INSTALL_OK" = "true" ]; then
        print_success "Hook dependencies installed"
    fi
    echo ""
fi
# Print next steps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Next Steps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Customize CLAUDE.md with your project-specific context"
echo ""
echo "2. Review tech strategy in .claude/rules/tech-strategy.md"
echo "   Update to match your organization's standards"
echo ""
echo "3. Start using commands via slash commands:"
echo "   /architect       - System design and ADRs"
echo "   /builder         - Code implementation"
echo "   /qa-engineer     - Test strategy and quality"
echo "   /security-auditor - Security reviews"
echo "   /ui-ux-designer  - Interface design"
echo ""
echo "   Swarm orchestration commands:"
echo "   /swarm-plan      - Plan with parallel exploration"
echo "   /swarm-execute   - Execute with parallel workers"
echo "   /swarm-review    - Adversarial multi-perspective review"
echo "   /swarm-research  - Deep investigation"
echo "   /code-check      - SOLID, DRY, consistency audit"
echo ""
echo "4. If Beads was not initialized above, install it for swarm coordination:"
echo "   curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash"
echo "   cd $TARGET_DIR && bd init"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
````

## File: SPEC-WORKFLOW.md
````markdown
# Spec-Driven Development Workflow

This repository does not currently keep a standalone long-form spec workflow guide.

## Use these references instead

- [`docs/swarm.md`](docs/swarm.md) — planning, execution, and review flow
- [`docs/handoffs.md`](docs/handoffs.md) — handoff chain between planning, implementation, and review
- [`docs/reference/specification/system-overview.md`](docs/reference/specification/system-overview.md) — baseline product and system specification context

If the team revives a dedicated spec workflow document, update this file to point to that canonical source.
````

## File: storage.rules
````
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
````

## File: tailwind.config.ts
````typescript
import type {Config} from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@shared-types": ["./packages/shared-types/index.ts"],
      "@shared-utils": ["./packages/shared-utils/index.ts"],
      "@shared-validators": ["./packages/shared-validators/index.ts"],
      "@shared-constants": ["./packages/shared-constants/index.ts"],
      "@shared-hooks": ["./packages/shared-hooks/index.ts"],
      "@integration-firebase": ["./packages/integration-firebase/index.ts"],
      "@integration-firebase/*": ["./packages/integration-firebase/*"],
      "@integration-http": ["./packages/integration-http/index.ts"],
      "@api-contracts": ["./packages/api-contracts/index.ts"],
      "@ui-shadcn": ["./packages/ui-shadcn/index.ts"],
      "@ui-shadcn/*": ["./packages/ui-shadcn/*"],
      "@ui-vis": ["./packages/ui-vis/index.ts"],
      "@lib-date-fns": ["./packages/lib-date-fns/index.ts"],
      "@lib-zod": ["./packages/lib-zod/index.ts"],
      "@lib-uuid": ["./packages/lib-uuid/index.ts"],
      "@lib-zustand": ["./packages/lib-zustand/index.ts"],
      "@lib-xstate": ["./packages/lib-xstate/index.ts"],
      "@lib-tanstack": ["./packages/lib-tanstack/index.ts"],
      "@lib-superjson": ["./packages/lib-superjson/index.ts"],
      "@lib-dragdrop": ["./packages/lib-dragdrop/index.ts"],
      "@lib-react-markdown": ["./packages/lib-react-markdown/index.ts"],
      "@lib-remark-gfm": ["./packages/lib-remark-gfm/index.ts"],
      "@lib-vis": ["./packages/lib-vis/index.ts"],
      "@lib-vis/*": ["./packages/lib-vis/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules",
    "functions"
  ]
}
````

## File: .gitignore
````
# =============================================================================
# Claude Code Local Files
# =============================================================================
CLAUDE.local.md
.claude/settings.local.json

# =============================================================================
# Claude Hooks Runtime
# =============================================================================
.claude/hooks/node_modules/
.claude/hooks/dist/
.claude/hooks/.file-tracker.log
.claude/hooks/.locks/
.claude/hooks/.state/

# =============================================================================
# Scratchpad (ephemeral working notes, gitignored by design)
# =============================================================================
scratchpad/

# =============================================================================
# Swarm Runtime
# =============================================================================
.swarm/

# =============================================================================
# Beads Runtime (project-specific, not part of framework template)
# =============================================================================
.beads/

# =============================================================================
# OS Files
# =============================================================================
.DS_Store
Thumbs.db

# =============================================================================
# Editor Directories
# =============================================================================
.idea/
.vscode/
*.swp
*.swo

# =============================================================================
# Node.js
# =============================================================================
node_modules/
.next/

# =============================================================================
# Python
# =============================================================================
__pycache__/
*.pyc
.venv/
venv/

# =============================================================================
# Logs
# =============================================================================
*.log

# =============================================================================
# Runtime Lock Files
# =============================================================================
*.pid
*.sock

# Beads / Dolt files (added by bd init)
.dolt/
*.db
.beads-credential-key
.playwright-mcp
````

## File: app/(shell)/_components/app-breadcrumbs.tsx
````typescript
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
⋮----
function segmentLabel(segment: string)
⋮----
// Only render when there's more than one segment (i.e., not just root page).
````

## File: app/(shell)/_components/header-controls.tsx
````typescript
/**
 * Module: header-controls.tsx
 * Purpose: compose shell header utility controls.
 * Responsibilities: language switch, theme toggle, and notification entry.
 * Constraints: presentation-only, no domain orchestration.
 */
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { NotificationBell } from "@/modules/notification/api";
import { Button } from "@ui-shadcn/ui/button";
import { TranslationSwitcher } from "./translation-switcher";
⋮----
export function HeaderControls()
⋮----
function toggleTheme()
````

## File: app/(shell)/dev-tools/page.tsx
````typescript
/**
 * Module: dev-tools page — /dev-tools
 * Purpose: 測試 py_fn Firebase Functions (Document AI parse_document callable)。
 * Workflow: 選取 → 上傳到 GCS → 呼叫 parse_document → 監聽 Firestore 狀態
 * Constraints: 僅限本地開發 / staging 驗證；勿在 production 導覽列顯示。
 */
import { useRef, useState, useEffect } from "react";
import {
  FlaskConical,
  FileUp,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Trash2,
  Code2,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { Button } from "@ui-shadcn/ui/button";
// ── 型別 ─────────────────────────────────────────────────────────────────────
interface ParseResult {
  doc_id: string;
  status: "processing" | "completed" | "error";
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
}
interface DocRecord {
  id: string;
  status: "processing" | "completed" | "error" | string;
  filename: string;
  gcs_uri: string;
  uploaded_at: Date | null;
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
  rag_status?: string;
  rag_chunk_count?: number;
  rag_vector_count?: number;
  rag_raw_chars?: number;
  rag_normalized_chars?: number;
  rag_normalization_version?: string;
  rag_language_hint?: string;
  rag_error?: string;
}
type Status = "idle" | "uploading" | "waiting" | "done" | "error";
// ── 常數 ─────────────────────────────────────────────────────────────────────
⋮----
function formatDateTime(value: Date | null): string
function deriveJsonUri(gcsUri: string): string
function asRecord(value: unknown): Record<string, unknown>
function asString(value: unknown, fallback = ""): string
function asNumber(value: unknown): number | undefined
function asDate(value: unknown): Date | null
function mapSnapshotDoc(doc:
function StatusBadge(
⋮----
function RagBadge(
// ── Page component ─────────────────────────────────────────────────────────
⋮----
// Firestore 監聽器 unsubscribe 函數
⋮----
function closeJsonPreview()
function appendLog(msg: string)
function handleFileChange(e: React.ChangeEvent<HTMLInputElement>)
function buildUuidUploadPath(accountId: string, file: File):
// 監聽 Firestore 文件狀態變化
function watchDocument(docId: string)
⋮----
// 取消監聽
⋮----
// 取消監聽
⋮----
async function handleUploadAndParse()
⋮----
// ── Step 1: Upload to GCS ────────────────────────────────────────
⋮----
// ── Step 2: Watch Firestore for status updates ──────────────────
⋮----
function reset()
⋮----
// 取消 Firestore 監聽
⋮----
// 監聽所有已上傳文件列表
⋮----
// 最新上傳在最上面
⋮----
// Cleanup on unmount
⋮----
async function handleViewOriginal(doc: DocRecord)
async function handleViewJson(doc: DocRecord)
async function handleDeleteDoc(doc: DocRecord)
⋮----
// 刪除 GCS 原始檔案
⋮----
// 刪除 GCS JSON
⋮----
// 刪除 Firestore 記錄
⋮----
// 若正在預覽此文件，清除預覽
⋮----
async function handleManualProcess(doc: DocRecord)
⋮----
function formatNormalizationRatio(doc: DocRecord): string
⋮----
{/* ── Header ─────────────────────────────────────────────────── */}
⋮----
{/* ── File picker ────────────────────────────────────────────── */}
⋮----
{/* ── Actions ────────────────────────────────────────────────── */}
⋮----
{/* ── Result ─────────────────────────────────────────────────── */}
⋮----
{/* ── 已上傳檔案列表 ──────────────────────────────────────────── */}
⋮----
{/* 查看原始檔案 */}
⋮----
{/* 查看 JSON */}
⋮----
{/* 刪除 */}
⋮----
{/* ── JSON 預覽面板 ──────────────────────────────────── */}
⋮----
{/* ── 已解析檔案列表（status=completed）──────────────────────── */}
⋮----
onClick=
⋮----
{/* ── Console log ────────────────────────────────────────────── */}
````

## File: app/(shell)/knowledge-base/page.tsx
````typescript
import { redirect } from "next/navigation";
export default function KnowledgeBasePage()
````

## File: app/(shell)/knowledge-database/databases/[databaseId]/page.tsx
````typescript
import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Archive, PlusCircle } from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getDatabase,
  addDatabaseField,
  archiveDatabase,
  DatabaseTableView,
} from "@/modules/knowledge-database/api";
import type { Database, FieldType } from "@/modules/knowledge-database/api";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui-shadcn/ui/select";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
function AddFieldDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: {
  open: boolean;
onOpenChange: (v: boolean)
⋮----
function reset()
function handleOpenChange(v: boolean)
function handleSubmit(e: React.FormEvent)
⋮----
<Select value=
⋮----
function handleAddField(name: string, type: FieldType, required: boolean)
function handleArchive()
⋮----
<Button variant="ghost" size="sm" onClick=
⋮----
{/* Header */}
⋮----
{/* Table View */}
````

## File: app/(shell)/knowledge-database/databases/page.tsx
````typescript
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Table2 } from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { getDatabases, DatabaseDialog } from "@/modules/knowledge-database/api";
import type { Database } from "@/modules/knowledge-database/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
function handleSuccess(databaseId?: string)
````

## File: app/(shell)/knowledge-database/page.tsx
````typescript
import { redirect } from "next/navigation";
export default function KnowledgeDatabasePage()
````

## File: app/(shell)/knowledge/block-editor/page.tsx
````typescript
import { BlockEditorView } from "@/modules/knowledge/api";
export default function KnowledgeBlockEditorPage()
````

## File: app/(shell)/knowledge/page.tsx
````typescript
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Brain, Building2, Database, FileText, FolderKanban, MessageSquare } from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { buildWikiContentTree } from "@/modules/workspace/api";
import type { WikiAccountContentNode, WikiAccountSeed } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
async function load()
````

## File: app/(shell)/knowledge/pages/page.tsx
````typescript
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { getKnowledgePageTree, PageTreeView } from "@/modules/knowledge/api";
import type { KnowledgePageTreeNode } from "@/modules/knowledge/api";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
onCreated=
````

## File: app/(shell)/notebook/page.tsx
````typescript
import { redirect } from "next/navigation";
export default function NotebookPage()
````

## File: app/(shell)/organization/content/page.tsx
````typescript
import { redirect } from "next/navigation";
/**
 * Module: organization/content page
 * Purpose: redirect to the consolidated content hub at /knowledge.
 */
export default function OrganizationKnowledgePage()
````

## File: app/(shell)/organization/page.tsx
````typescript
/**
 * Organization Overview Page — /organization
 * Lists organizations visible to the current user and allows switching
 * to an organization account context.
 * Section pages live under /organization/[section].
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import type { AccountEntity } from "@/modules/account/api";
import { Button } from "@ui-shadcn/ui/button";
function isOrganizationAccount(
  activeAccount: ReturnType<typeof useApp>["state"]["activeAccount"],
): activeAccount is AccountEntity &
⋮----
function handleSwitch(account: AccountEntity)
function handleSwitchToPersonal()
⋮----
{/* Personal account */}
⋮----
{/* Organizations */}
⋮----
onClick=
````

## File: app/(shell)/source/documents/page.tsx
````typescript
import { useSearchParams } from "next/navigation";
import { useApp } from "@/app/providers/app-provider";
import { SourceDocumentsView } from "@/modules/source/api";
export default function SourceDocumentsPage()
````

## File: app/(shell)/source/libraries/page.tsx
````typescript
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { LibrariesView, LibraryTableView } from "@/modules/source/api";
````

## File: app/(shell)/source/page.tsx
````typescript
import { redirect } from "next/navigation";
export default function SourcePage()
````

## File: app/providers/auth-provider.tsx
````typescript
/**
 * auth-provider.tsx
 * Hosts the Firebase auth state lifecycle and exposes useAuth().
 * Syncs onAuthStateChanged → AuthContext → consumed by AppProvider and shell guard.
 *
 * [S6] Token refresh is handled separately by useTokenRefreshListener (Party 3).
 */
import { useReducer, useContext, useEffect, type ReactNode } from "react";
import {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from "@integration-firebase";
import {
  AuthContext,
  type AuthAction,
  type AuthState,
  type AuthUser,
} from "./auth-context";
import {
  clearDevDemoSession,
  isLocalDevDemoAllowed,
  readDevDemoSession,
} from "./dev-demo-auth";
// ─── Constants ────────────────────────────────────────────────────────────────
⋮----
// ─── Mapper ───────────────────────────────────────────────────────────────────
function toAuthUser(user: User): AuthUser
function resolveSignedOutStatePayload():
// ─── Reducer ──────────────────────────────────────────────────────────────────
const authReducer = (state: AuthState, action: AuthAction): AuthState =>
⋮----
// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider(
⋮----
const logout = async () =>
⋮----
// Always dispatch unauthenticated: onAuthStateChanged will not fire when
// there is no real Firebase session (e.g. dev-demo guest mode), so we
// cannot rely solely on the listener to clear the auth state.
⋮----
// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth()
````

## File: eslint.config.mjs
````javascript
const sameModuleTarget = (type) => (
⋮----
const createRestrictedImportsRule = (patterns)
⋮----
// ─── Consistent type-only imports ──────────────────────────────────────
// Enforces `import type` for type-only imports, improving tree-shaking and
// making module-boundary intent explicit (matches project MDDD conventions).
⋮----
// ─── React best-practices ───────────────────────────────────────────────
// eslint-config-next already pulls in react / react-hooks rules via its
// own config; these overrides make project-specific settings explicit and
// add missing checks not covered by the base config.
⋮----
"react/react-in-jsx-scope": "off",   // Not needed with Next.js 13+ JSX transform
"react/prop-types": "off",            // TypeScript types replace PropTypes
"react/self-closing-comp": "warn",    // Prefer <Foo /> over <Foo></Foo>
⋮----
// ─── Accessibility (jsx-a11y) ───────────────────────────────────────────
// eslint-plugin-jsx-a11y is installed by Next.js but never explicitly
// activated here.  Enabling recommended rules as warn catches common a11y
// mistakes without breaking the zero-error baseline.
⋮----
// Rule config can be a string ("error"), a number (2), or an array (["error", opts]).
// Downgrade all errors to warnings to preserve the zero-error baseline.
⋮----
// ─── Package boundary enforcement ───────────────────────────────────────
// Forbid legacy import paths that were migrated to packages/*.
⋮----
// ─── Strict module entrypoint enforcement ───────────────────────────────
⋮----
// ─── Module import boundary enforcement (kept after global restricted imports so it is not overridden) ───
⋮----
// ─── Wiki / Wiki-Beta isolation boundaries ───────────────────────────────
⋮----
// Override default ignores of eslint-config-next.
⋮----
// Default ignores of eslint-config-next:
````

## File: modules/account/aggregates.md
````markdown
# Aggregates — account

## 聚合根：Account

### 職責
代表使用者在 Xuanwu 平台的業務身份記錄。管理 profile 資訊與帳戶狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 帳戶主鍵（對應 Firebase uid） |
| `displayName` | `string` | 顯示名稱 |
| `email` | `string` | Email |
| `avatarUrl` | `string \| null` | 頭像 URL |
| `createdAt` | `Timestamp` | 建立時間 |

### 不變數

- 每個 Account 對應唯一一個 Firebase uid
- Account 建立後 id 不可變更

---

## 聚合根：AccountPolicy

### 職責
代表附加到帳戶的存取控制政策，定義哪些資源可存取、哪些動作被允許，並映射到 Firebase custom claims。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Policy 主鍵 |
| `accountId` | `string` | 關聯的 Account ID |
| `rules` | `PolicyRule[]` | 存取控制規則列表 |
| `effect` | `"allow" \| "deny"` | 規則效果 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AccountRepository` | `save()`, `findById()`, `delete()` |
| `AccountQueryRepository` | `findById()`, `findByEmail()` |
| `AccountPolicyRepository` | `save()`, `findByAccountId()` |
````

## File: modules/account/application-services.md
````markdown
# account — Application Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件記錄 `account` 的 application layer 服務與 use cases。內容與 `modules/account/application/` 實作保持一致。

## Application Layer 職責

管理帳戶資料、偏好設定與帳戶政策，並在 server 端透過 identity/api 取得已驗證身份。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/account-policy.use-cases.ts`
- `application/use-cases/account.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/account/README.md`
- 模組 AGENT：`../../../modules/account/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/account/application-services.md`
````

## File: modules/account/domain-events.md
````markdown
# Domain Events — account

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `account.created` | 新帳戶建立時 | `accountId`, `email`, `occurredAt` |
| `account.policy_updated` | AccountPolicy 更新時，觸發 custom claims 刷新 | `accountId`, `policyId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 事件 | 行動 |
|---------|------|------|
| `identity` | `TokenRefreshSignal` | 觸發 custom claims 重新計算與 Firebase token 更新 |

## 事件格式

```typescript
interface AccountCreatedEvent {
  readonly type: "account.created";
  readonly accountId: string;
  readonly email: string;
  readonly occurredAt: string;  // ISO 8601
}

interface AccountPolicyUpdatedEvent {
  readonly type: "account.policy_updated";
  readonly accountId: string;
  readonly policyId: string;
  readonly occurredAt: string;
}
```
````

## File: modules/account/domain-services.md
````markdown
# account — Domain Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/account/domain-services.md`
- `../../../docs/ddd/account/aggregates.md`
````

## File: modules/account/README.md
````markdown
# account — 帳戶上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/account/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`account` 承接 `identity` 的已驗證身份，管理個人檔案、偏好設定與帳戶政策，讓平台具備使用者層級的個人化與權限落點。它位於平台基礎層，負責把「登入身份」轉成「可持久化的帳戶語意」。

## 主要職責

| 能力 | 說明 |
|---|---|
| 帳戶設定檔 | 維護顯示名稱、頭像、偏好與其他個人資料 |
| 帳戶政策 | 管理 AccountPolicy、custom claims 與存取控制輔助資訊 |
| 個人化入口 | 為組織、工作區與通知提供使用者側設定基礎 |

## 與其他 Bounded Context 協作

- `identity` 提供身份與 token 上下文。
- `organization`、`workspace` 與 `notification` 以帳戶資料作為使用者語意來源。

## 核心聚合 / 核心概念

- **`Account`**
- **`AccountPolicy`**
- **`AccountProfile`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/account/repositories.md
````markdown
# account — Repositories

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AccountPolicyRepository.ts`
- `domain/repositories/AccountQueryRepository.ts`
- `domain/repositories/AccountRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseAccountPolicyRepository.ts`
- `infrastructure/firebase/FirebaseAccountQueryRepository.ts`
- `infrastructure/firebase/FirebaseAccountRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/account/repositories.md`
- `../../../docs/ddd/account/aggregates.md`
````

## File: modules/account/ubiquitous-language.md
````markdown
# Ubiquitous Language — account

> **範圍：** 僅限 `modules/account/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 帳戶 | Account | 使用者在平台的業務記錄，含 profile 資訊與狀態 | `modules/account/domain/entities/Account.ts` |
| 帳戶政策 | AccountPolicy | 附加到帳戶的存取控制政策，決定 Firebase custom claims 內容 | `modules/account/domain/entities/AccountPolicy.ts` |
| 帳戶 ID | accountId | Account 的業務主鍵（對應 Firebase uid，但在業務層使用 accountId 術語） | `Account.id` |
| 自訂宣告 | customClaims | Firebase ID token 中的自訂 claims，由 AccountPolicy 決定 | `Account.customClaims` |
| 帳戶查詢庫 | AccountQueryRepository | CQRS 讀取側 Repository port | `domain/repositories/AccountQueryRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Account` | `User`, `Profile` |
| `AccountPolicy` | `Permission`, `Role`, `AccessRule` |
| `accountId` | `userId`（帳戶層應使用 accountId） |
````

## File: modules/ai/AGENT.md
````markdown
# AGENT.md — ai BC

## 模組定位

`ai` 是 RAG 攝入管線的 Job 協調支援域。管理 IngestionJob 生命週期，協調 py_fn/ Python worker。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `IngestionJob` | Job、Task（在此 BC 內）、ParseJob |
| `IngestionDocument` | Document、File（在此 BC 內）|
| `IngestionChunk` | Chunk、VectorChunk |
| `IngestionStatus` | Status, JobStatus |

## 棄用檔案守衛

以下檔案都是 `@deprecated` stubs，已移至其他模組，**絕對不要** import：
- `modules/ai/domain/entities/graph-node.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/entities/link.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/repositories/GraphRepository.ts` → 移至 `modules/wiki/`

## 邊界規則

### ✅ 允許
```typescript
import { aiApi } from "@/modules/ai/api";
import type { IngestionJobDTO } from "@/modules/ai/api";
```

### ❌ 禁止
```typescript
import { IngestionJob } from "@/modules/ai/domain/entities/IngestionJob";
import { graph-node } from "@/modules/ai/domain/entities/graph-node"; // deprecated stub
```

## Runtime 邊界規則

- `ai` 模組只在 Next.js 端做 Job 協調
- Embedding 生成在 `py_fn/` 執行，不要在 `ai` module 加入 heavy ML 邏輯

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/ai/aggregates.md
````markdown
# Aggregates — ai

## 聚合根：IngestionJob

### 職責
管理 RAG 攝入管線的單一工作記錄。追蹤從上傳到 indexed 的完整狀態機。

### 生命週期狀態機
```
uploaded ──► parsing ──► embedding ──► indexed
                │                         │
                └──────► failed ◄─────────┘
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Job 主鍵 |
| `documentId` | `string` | 關聯 SourceDocument ID |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string` | 所屬工作區 |
| `status` | `IngestionStatus` | 當前狀態 |
| `startedAt` | `string \| null` | ISO 8601 開始時間 |
| `completedAt` | `string \| null` | ISO 8601 完成時間 |
| `errorMessage` | `string \| null` | 失敗原因 |

### 不變數

- `indexed` 狀態後不可再轉換回其他狀態
- `failed` 狀態的 errorMessage 不可為空

---

## 實體：IngestionDocument

### 職責
交付給攝入管線的文件元資料，提供 `py_fn/` worker 所需的來源資訊。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `sourceFileId` | `string` | 關聯 SourceDocument ID |
| `mimeType` | `string` | 檔案 MIME type |
| `storageUrl` | `string` | Firebase Storage URL |

---

## 值物件：IngestionChunk

### 職責
文件切分後的向量化 chunk，由 `py_fn/` 生成後寫入 Firestore。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Chunk 主鍵 |
| `documentId` | `string` | 所屬文件 ID |
| `chunkIndex` | `number` | Chunk 在文件中的序號 |
| `content` | `string` | Chunk 文字內容 |
| `embedding` | `number[]` | 向量嵌入（由 py_fn/ 寫入） |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `IngestionJobRepository` | `save()`, `findByDocumentId()`, `listByWorkspace()`, `updateStatus()` |
````

## File: modules/ai/api/index.ts
````typescript
/**
 * modules/ai — public API barrel.
 *
 * Public surface for the AI ingestion pipeline only.
 */
````

## File: modules/ai/application-services.md
````markdown
# ai — Application Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `ai` 的 application layer 服務與 use cases。內容與 `modules/ai/application/` 實作保持一致。

## Application Layer 職責

協調 RAG ingestion job 的生命週期，將重型 parse/chunk/embed 工作交給 py_fn/ 執行。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/advance-ingestion-stage.use-case.ts`
- `application/use-cases/register-ingestion-document.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/ai/README.md`
- 模組 AGENT：`../../../modules/ai/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/ai/application-services.md`
````

## File: modules/ai/context-map.md
````markdown
# Context Map — ai

## 上游（依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 建立 IngestionJob
- `ai` 依賴 `source/api` 取得 SourceDocument 元資料（storageUrl、mimeType）

---

## 下游（被依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 的 RAG 查詢依賴 `ai` 生成的 IngestionChunk

### ai → py_fn（Runtime Boundary）

**這不是 BC 間的 DDD 整合，而是 runtime 邊界分割：**

```
Next.js ai module ──[Firestore Job Record]──► py_fn/ worker
                   ──[Firebase Storage URL]──► py_fn/ worker
py_fn/ worker ──[Chunk + Embedding 寫回 Firestore]──► Next.js reads
```

- Next.js 端：Job 建立、狀態查詢、API
- `py_fn/`：parse / chunk / embed 實際執行

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| source → ai | source | ai | Published Language (Events) |
| ai → search | ai | search | Published Language (Events) |
| ai → py_fn | Next.js | py_fn | Runtime Boundary（非 DDD 邊界） |
````

## File: modules/ai/domain-events.md
````markdown
# Domain Events — ai

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `ai.ingestion_job_created` | 新 IngestionJob 建立 | `jobId`, `documentId`, `workspaceId`, `occurredAt` |
| `ai.ingestion_completed` | Job 狀態達到 `indexed` | `jobId`, `documentId`, `chunkCount`, `occurredAt` |
| `ai.ingestion_failed` | Job 狀態轉為 `failed` | `jobId`, `documentId`, `errorMessage`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `source` | `source.upload_completed` | 建立 IngestionJob，啟動攝入管線 |

## 消費 ai 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `ai.ingestion_completed` | 更新向量索引，RagDocument 標記為可查詢 |
| `source` | `ai.ingestion_completed` | 更新 SourceDocument 狀態為 ready |
| `workspace-audit` | `ai.ingestion_completed / failed` | 記錄攝入稽核軌跡 |
````

## File: modules/ai/domain-services.md
````markdown
# ai — Domain Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/ai/domain-services.md`
- `../../../docs/ddd/ai/aggregates.md`
````

## File: modules/ai/README.md
````markdown
# ai — AI 攝入上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/ai/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`ai` 是 NotebookLM-like 推理能力的攝入協調層，負責把 `source` 交付的來源文件轉成可供 `search` 與 `notebook` 消費的結構化索引材料。它不直接承載使用者問答體驗，而是保證後續推理層有可靠、可追溯的資料基礎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Ingestion Job 管理 | 追蹤 uploaded → parsing → embedding → indexed / failed 狀態生命週期 |
| Worker Handoff | 協調 Next.js 與 `py_fn/` 之間的重型 ingestion 工作交接 |
| Chunk / Index 前處理 | 接收文件切塊與索引前資料，為檢索層準備輸入 |

## 與其他 Bounded Context 協作

- `source` 是上游，提供來源文件與交接事件。
- `search` 消費 `ai` 產生的索引就緒資料；`notebook` 間接建立在這個攝入基礎上。

## 核心聚合 / 核心概念

- **`IngestionJob`**
- **`IngestionDocument`**
- **`IngestionChunk`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/ai/repositories.md
````markdown
# ai — Repositories

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`
- `domain/repositories/IngestionJobRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`
- `infrastructure/InMemoryIngestionJobRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/ai/repositories.md`
- `../../../docs/ddd/ai/aggregates.md`
````

## File: modules/ai/ubiquitous-language.md
````markdown
# Ubiquitous Language — ai

> **範圍：** 僅限 `modules/ai/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 攝入工作 | IngestionJob | RAG 攝入管線的單一工作記錄，追蹤 parse/chunk/embed 的執行狀態 |
| 攝入文件 | IngestionDocument | 交付給攝入管線的文件元資料記錄 |
| 攝入 Chunk | IngestionChunk | 文件切分後的向量化單元（由 py_fn/ 生成） |
| 攝入狀態 | IngestionStatus | Job 的生命週期狀態：`uploaded \| parsing \| embedding \| indexed \| failed` |
| 文件 ID | documentId | 關聯的 source 模組 SourceDocument ID |
| 工作區 ID | workspaceId | Job 所屬的工作區 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `IngestionJob` | `Job`, `ParseJob`, `EmbedTask` |
| `IngestionDocument` | `Document`, `File`（在 ai BC 內） |
| `IngestionChunk` | `Chunk`, `VectorEntry` |
| `IngestionStatus` | `JobStatus`, `State` |
````

## File: modules/identity/aggregates.md
````markdown
# Aggregates — identity

## 聚合根：Identity

### 職責
代表一個已通過 Firebase Authentication 驗證的使用者。提供讀取身份資訊的能力。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | Firebase UID（主鍵） |
| `email` | `string \| null` | 使用者 Email |
| `displayName` | `string \| null` | 顯示名稱 |
| `photoURL` | `string \| null` | 頭像 URL |

### 不變數

- `uid` 永遠不為空（由 Firebase 保證）
- `Identity` 物件是唯讀的（由 Firebase Auth SDK 產生）

---

## 值物件：TokenRefreshSignal

### 職責
代表「token 需要刷新」的事件訊號，觸發 `account` 域更新 custom claims。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | 需要刷新 token 的使用者 UID |
| `occurredAt` | `string` | ISO 8601 時間戳 |

---

## Repository Interfaces

| 介面 | 主要方法 | 說明 |
|------|---------|------|
| `IdentityRepository` | `signIn()`, `signOut()`, `getCurrentIdentity()` | Firebase Auth 操作 |
| `TokenRefreshRepository` | `listenToTokenRefresh()` | 監聽 token 刷新事件 |
````

## File: modules/identity/application-services.md
````markdown
# identity — Application Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件記錄 `identity` 的 application layer 服務與 use cases。內容與 `modules/identity/application/` 實作保持一致。

## Application Layer 職責

封裝 Firebase Authentication，提供登入、登出與 token refresh 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/identity-error-message.ts`
- `application/use-cases/identity.use-cases.ts`
- `application/use-cases/token-refresh.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/identity/README.md`
- 模組 AGENT：`../../../modules/identity/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/identity/application-services.md`
````

## File: modules/identity/context-map.md
````markdown
# Context Map — identity

## 此 BC 的整合模式

### 上游（依賴）

`identity` 是最基礎的 Generic Subdomain，不依賴任何其他業務 BC。

**外部依賴：** Firebase Authentication SDK（第三方服務，Anti-Corruption Layer 在 infrastructure 層）

---

### 下游（被依賴）

#### `account` ← identity（Customer/Supplier）

- **模式：** Customer/Supplier
- **方向：** `identity` 是 Supplier（上游），`account` 是 Customer（下游）
- **整合方式：** `account` application use-cases 在 server 端 import `identity/api` 取得身份上下文
- **關鍵規則：** `identity/api` 不得含任何 `"use client"` 匯出

```
identity/api ──import──► account/application/use-cases/*.ts（server-side）
```

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| Firebase Auth → identity | Firebase | identity | Anti-Corruption Layer |
````

## File: modules/identity/domain-events.md
````markdown
# Domain Events — identity

## 發出事件

`identity` 域目前不發出 DomainEvent（Firebase Auth 事件由 SDK 直接處理，不經過領域事件匯流排）。

未來如需追蹤登入稽核，可考慮加入：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `identity.signed_in` | 使用者成功登入 | 供 `workspace-audit` 消費 |
| `identity.signed_out` | 使用者登出 | 供稽核紀錄消費 |

## 訂閱事件

`identity` 不訂閱其他 BC 的事件。

## TokenRefreshSignal（非正式事件）

`TokenRefreshSignal` 是透過 `TokenRefreshRepository.listenToTokenRefresh()` 的 Observable 訊號，不是正式的 DomainEvent，但語意上扮演事件角色：

```typescript
// account use-case 消費此訊號
identityApi.listenToTokenRefresh()
  .subscribe(() => accountApi.refreshCustomClaims(uid));
```
````

## File: modules/identity/domain-services.md
````markdown
# identity — Domain Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/identity/domain-services.md`
- `../../../docs/ddd/identity/aggregates.md`
````

## File: modules/identity/README.md
````markdown
# identity — 身份驗證上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/identity/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`identity` 是整個平台的身份入口，封裝 Firebase Authentication 與 session 起點。它對產品價值並不差異化，但所有工作區、知識與 AI 互動都建立在正確的身份語意之上。

## 主要職責

| 能力 | 說明 |
|---|---|
| 登入 / 登出 | 處理 signIn、signOut 與身份狀態切換 |
| Token 生命週期 | 管理 token refresh 與相關身份訊號 |
| 身份上下文供應 | 向 `account`、`organization`、`workspace` 提供穩定的身份讀取入口 |

## 與其他 Bounded Context 協作

- `account` 直接消費 `identity/api` 提供的身份上下文。
- `organization` 與 `workspace` 依賴身份語意建立成員與存取規則。

## 核心聚合 / 核心概念

- **`Identity`**
- **`AuthenticatedUser`**
- **`TokenRefreshSignal`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/identity/repositories.md
````markdown
# identity — Repositories

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/IdentityRepository.ts`
- `domain/repositories/TokenRefreshRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseIdentityRepository.ts`
- `infrastructure/firebase/FirebaseTokenRefreshRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/identity/repositories.md`
- `../../../docs/ddd/identity/aggregates.md`
````

## File: modules/identity/ubiquitous-language.md
````markdown
# Ubiquitous Language — identity

> **範圍：** 僅限 `modules/identity/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 身份 | Identity | Firebase Auth 驗證後的使用者記錄，以 `uid` 為唯一識別碼 | `modules/identity/domain/entities/` |
| 唯一身份碼 | uid | Firebase Authentication 產生的使用者全域唯一 ID | `Identity.uid` |
| Token 刷新訊號 | TokenRefreshSignal | 代表 Firebase ID token 需要更新的訊號物件 | `domain/entities/` |
| 登入 | signIn | 透過 Email 或 OAuth 建立 Firebase Auth session | `IdentityRepository.signIn()` |
| 登出 | signOut | 終止 Firebase Auth session | `IdentityRepository.signOut()` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Identity` | `User`, `AuthUser`, `CurrentUser` |
| `uid` | `userId`, `id`, `accountId`（在此 BC 內） |
| `TokenRefreshSignal` | `RefreshToken`, `TokenEvent` |
````

## File: modules/knowledge-base/application/dto/knowledge-base.dto.ts
````typescript
/**
 * Module: knowledge-base
 * Layer: application/dto
 * Zod schemas for Article and Category CQRS inputs.
 */
import { z } from "@lib-zod";
⋮----
// ─── Article DTOs ──────────────────────────────────────────────────────────────
⋮----
// ─── Category DTOs ─────────────────────────────────────────────────────────────
````

## File: modules/knowledge-base/domain/entities/article.entity.ts
````typescript
export type ArticleStatus = "draft" | "published" | "archived";
export type VerificationState = "verified" | "needs_review" | "unverified";
export interface Article {
  id: string;
  accountId: string;
  workspaceId: string;
  categoryId: string | null;
  title: string;
  content: string;
  tags: string[];
  status: ArticleStatus;
  version: number;
  verificationState: VerificationState;
  ownerId: string | null;
  verifiedByUserId: string | null;
  verifiedAtISO: string | null;
  verificationExpiresAtISO: string | null;
  linkedArticleIds: string[];
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
````

## File: modules/knowledge-base/domain/entities/category.entity.ts
````typescript
export interface Category {
  id: string;
  accountId: string;
  workspaceId: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
  depth: number;
  articleIds: string[];
  description: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
````

## File: modules/knowledge-base/domain/index.ts
````typescript
/**
 * knowledge-base domain layer exports
 */
````

## File: modules/knowledge-base/domain/repositories/ArticleRepository.ts
````typescript
import type { Article, ArticleStatus } from "../entities/article.entity";
export interface IArticleRepository {
  getById(articleId: string): Promise<Article>;
  list(params: {
    workspaceId: string;
    accountId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
    cursor?: string;
  }): Promise<Article[]>;
  search(params: { workspaceId: string; query: string; limit?: number }): Promise<Article[]>;
  save(article: Article): Promise<void>;
  getByIds(articleIds: string[]): Promise<Article[]>;
  findByLinkedArticleId(articleId: string): Promise<Article[]>;
  delete(articleId: string): Promise<void>;
}
⋮----
getById(articleId: string): Promise<Article>;
list(params: {
    workspaceId: string;
    accountId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
    cursor?: string;
  }): Promise<Article[]>;
search(params:
save(article: Article): Promise<void>;
getByIds(articleIds: string[]): Promise<Article[]>;
findByLinkedArticleId(articleId: string): Promise<Article[]>;
delete(articleId: string): Promise<void>;
````

## File: modules/knowledge-base/domain/repositories/CategoryRepository.ts
````typescript
import type { Category } from "../entities/category.entity";
export interface ICategoryRepository {
  getById(categoryId: string): Promise<Category>;
  listByWorkspace(workspaceId: string, accountId: string): Promise<Category[]>;
  listChildren(parentCategoryId: string): Promise<Category[]>;
  save(category: Category): Promise<void>;
  delete(categoryId: string): Promise<void>;
  updateArticleIds(categoryId: string, articleIds: string[]): Promise<void>;
}
⋮----
getById(categoryId: string): Promise<Category>;
listByWorkspace(workspaceId: string, accountId: string): Promise<Category[]>;
listChildren(parentCategoryId: string): Promise<Category[]>;
save(category: Category): Promise<void>;
delete(categoryId: string): Promise<void>;
updateArticleIds(categoryId: string, articleIds: string[]): Promise<void>;
````

## File: modules/knowledge-base/domain/services/BacklinkExtractorService.ts
````typescript
export class BacklinkExtractorService {
⋮----
extractWikilinkTitles(content: string): string[]
````

## File: modules/knowledge-base/infrastructure/firebase/FirebaseCategoryRepository.ts
````typescript
/**
 * Module: knowledge-base
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbCategories/{categoryId}
 */
import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Category } from "../../domain/entities/category.entity";
import type { ICategoryRepository } from "../../domain/repositories/CategoryRepository";
function categoriesCol(db: ReturnType<typeof getFirestore>, accountId: string)
function categoryDoc(db: ReturnType<typeof getFirestore>, accountId: string, categoryId: string)
function toCategory(id: string, data: Record<string, unknown>): Category
export class FirebaseCategoryRepository implements ICategoryRepository {
⋮----
withAccountId(accountId: string): this
private db()
async getById(categoryId: string): Promise<Category>
async listByWorkspace(workspaceId: string, accountId: string): Promise<Category[]>
async listChildren(parentCategoryId: string): Promise<Category[]>
async save(category: Category): Promise<void>
async delete(categoryId: string): Promise<void>
async updateArticleIds(categoryId: string, articleIds: string[]): Promise<void>
````

## File: modules/knowledge-collaboration/application/dto/knowledge-collaboration.dto.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: application/dto
 */
import { z } from "@lib-zod";
⋮----
// ── Comment ───────────────────────────────────────────────────────────────────
⋮----
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
⋮----
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;
⋮----
export type ResolveCommentDto = z.infer<typeof ResolveCommentSchema>;
⋮----
export type DeleteCommentDto = z.infer<typeof DeleteCommentSchema>;
// ── Version ───────────────────────────────────────────────────────────────────
⋮----
export type CreateVersionDto = z.infer<typeof CreateVersionSchema>;
⋮----
export type DeleteVersionDto = z.infer<typeof DeleteVersionSchema>;
// ── Permission ────────────────────────────────────────────────────────────────
⋮----
export type GrantPermissionDto = z.infer<typeof GrantPermissionSchema>;
⋮----
export type RevokePermissionDto = z.infer<typeof RevokePermissionSchema>;
````

## File: modules/knowledge-collaboration/application/use-cases/comment.use-cases.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: application/use-cases
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { Comment } from "../../domain/entities/comment.entity";
import type { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import {
  CreateCommentSchema, type CreateCommentDto,
  UpdateCommentSchema, type UpdateCommentDto,
  ResolveCommentSchema, type ResolveCommentDto,
  DeleteCommentSchema, type DeleteCommentDto,
} from "../dto/knowledge-collaboration.dto";
export class CreateCommentUseCase {
⋮----
constructor(private readonly repo: ICommentRepository)
async execute(input: CreateCommentDto): Promise<CommandResult>
⋮----
export class UpdateCommentUseCase {
⋮----
async execute(input: UpdateCommentDto): Promise<CommandResult>
⋮----
export class ResolveCommentUseCase {
⋮----
async execute(input: ResolveCommentDto): Promise<CommandResult>
⋮----
export class DeleteCommentUseCase {
⋮----
async execute(input: DeleteCommentDto): Promise<CommandResult>
⋮----
export class ListCommentsUseCase {
⋮----
async execute(accountId: string, contentId: string): Promise<Comment[]>
````

## File: modules/knowledge-collaboration/application/use-cases/permission.use-cases.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: application/use-cases
 * Permission use cases: GrantPermission, RevokePermission, ListPermissionsBySubject
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { Permission } from "../../domain/entities/permission.entity";
import type { IPermissionRepository } from "../../domain/repositories/IPermissionRepository";
import {
  GrantPermissionSchema, type GrantPermissionDto,
  RevokePermissionSchema, type RevokePermissionDto,
} from "../dto/knowledge-collaboration.dto";
export class GrantPermissionUseCase {
⋮----
constructor(private readonly repo: IPermissionRepository)
async execute(input: GrantPermissionDto): Promise<CommandResult>
⋮----
export class RevokePermissionUseCase {
⋮----
async execute(input: RevokePermissionDto): Promise<CommandResult>
⋮----
export class ListPermissionsBySubjectUseCase {
⋮----
async execute(accountId: string, subjectId: string): Promise<Permission[]>
````

## File: modules/knowledge-collaboration/application/use-cases/version.use-cases.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: application/use-cases
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { Version } from "../../domain/entities/version.entity";
import type { IVersionRepository } from "../../domain/repositories/IVersionRepository";
import {
  CreateVersionSchema, type CreateVersionDto,
  DeleteVersionSchema, type DeleteVersionDto,
} from "../dto/knowledge-collaboration.dto";
export class CreateVersionUseCase {
⋮----
constructor(private readonly repo: IVersionRepository)
async execute(input: CreateVersionDto): Promise<CommandResult>
⋮----
export class DeleteVersionUseCase {
⋮----
async execute(input: DeleteVersionDto): Promise<CommandResult>
⋮----
export class ListVersionsUseCase {
⋮----
async execute(accountId: string, contentId: string): Promise<Version[]>
````

## File: modules/knowledge-collaboration/domain/entities/comment.entity.ts
````typescript
export interface Comment {
  id: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  authorId: string;
  body: string;
  parentCommentId: string | null;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  createdAtISO: string;
  updatedAtISO: string;
}
````

## File: modules/knowledge-collaboration/domain/entities/permission.entity.ts
````typescript
export type PermissionLevel = "view" | "comment" | "edit" | "full";
export interface Permission {
  id: string;
  subjectId: string;
  subjectType: "page" | "article" | "database";
  workspaceId: string;
  accountId: string;
  principalId: string;
  principalType: "user" | "team";
  level: PermissionLevel;
  grantedByUserId: string;
  grantedAtISO: string;
  expiresAtISO: string | null;
}
````

## File: modules/knowledge-collaboration/domain/entities/version.entity.ts
````typescript
export interface Version {
  id: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  snapshotBlocks: unknown[];
  label: string | null;
  description: string | null;
  createdByUserId: string;
  createdAtISO: string;
}
````

## File: modules/knowledge-collaboration/domain/repositories/ICommentRepository.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: domain/repositories
 */
import type { Comment } from "../entities/comment.entity";
export interface CreateCommentInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly authorId: string;
  readonly body: string;
  readonly parentCommentId?: string | null;
}
export interface UpdateCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly body: string;
}
export interface ResolveCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly resolvedByUserId: string;
}
export interface ICommentRepository {
  create(input: CreateCommentInput): Promise<Comment>;
  update(input: UpdateCommentInput): Promise<Comment | null>;
  resolve(input: ResolveCommentInput): Promise<Comment | null>;
  delete(accountId: string, commentId: string): Promise<void>;
  findById(accountId: string, commentId: string): Promise<Comment | null>;
  listByContent(accountId: string, contentId: string): Promise<Comment[]>;
}
⋮----
create(input: CreateCommentInput): Promise<Comment>;
update(input: UpdateCommentInput): Promise<Comment | null>;
resolve(input: ResolveCommentInput): Promise<Comment | null>;
delete(accountId: string, commentId: string): Promise<void>;
findById(accountId: string, commentId: string): Promise<Comment | null>;
listByContent(accountId: string, contentId: string): Promise<Comment[]>;
````

## File: modules/knowledge-collaboration/domain/repositories/IPermissionRepository.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: domain/repositories
 */
import type { Permission, PermissionLevel } from "../entities/permission.entity";
export interface GrantPermissionInput {
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: "user" | "team";
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly expiresAtISO?: string | null;
}
export interface IPermissionRepository {
  grant(input: GrantPermissionInput): Promise<Permission>;
  revoke(accountId: string, permissionId: string): Promise<void>;
  findById(accountId: string, permissionId: string): Promise<Permission | null>;
  listBySubject(accountId: string, subjectId: string): Promise<Permission[]>;
  listByPrincipal(accountId: string, principalId: string): Promise<Permission[]>;
}
⋮----
grant(input: GrantPermissionInput): Promise<Permission>;
revoke(accountId: string, permissionId: string): Promise<void>;
findById(accountId: string, permissionId: string): Promise<Permission | null>;
listBySubject(accountId: string, subjectId: string): Promise<Permission[]>;
listByPrincipal(accountId: string, principalId: string): Promise<Permission[]>;
````

## File: modules/knowledge-collaboration/domain/repositories/IVersionRepository.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: domain/repositories
 */
import type { Version } from "../entities/version.entity";
export interface CreateVersionInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly snapshotBlocks: unknown[];
  readonly label?: string | null;
  readonly description?: string | null;
  readonly createdByUserId: string;
}
export interface IVersionRepository {
  create(input: CreateVersionInput): Promise<Version>;
  findById(accountId: string, versionId: string): Promise<Version | null>;
  listByContent(accountId: string, contentId: string): Promise<Version[]>;
  delete(accountId: string, versionId: string): Promise<void>;
}
⋮----
create(input: CreateVersionInput): Promise<Version>;
findById(accountId: string, versionId: string): Promise<Version | null>;
listByContent(accountId: string, contentId: string): Promise<Version[]>;
delete(accountId: string, versionId: string): Promise<void>;
````

## File: modules/knowledge-collaboration/infrastructure/firebase/FirebaseCommentRepository.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationComments/{commentId}
 */
import {
  collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { Comment } from "../../domain/entities/comment.entity";
import type {
  ICommentRepository,
  CreateCommentInput,
  UpdateCommentInput,
  ResolveCommentInput,
} from "../../domain/repositories/ICommentRepository";
function commentsCol(db: ReturnType<typeof getFirestore>, accountId: string)
function commentDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string)
function toComment(id: string, data: Record<string, unknown>): Comment
export class FirebaseCommentRepository implements ICommentRepository {
⋮----
private db()
async create(input: CreateCommentInput): Promise<Comment>
async update(input: UpdateCommentInput): Promise<Comment | null>
async resolve(input: ResolveCommentInput): Promise<Comment | null>
async delete(accountId: string, commentId: string): Promise<void>
async findById(accountId: string, commentId: string): Promise<Comment | null>
async listByContent(accountId: string, contentId: string): Promise<Comment[]>
````

## File: modules/knowledge-collaboration/infrastructure/firebase/FirebasePermissionRepository.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationPermissions/{id}
 */
import {
  collection, doc, getDoc, getDocs, getFirestore,
  query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { Permission, PermissionLevel } from "../../domain/entities/permission.entity";
import type {
  IPermissionRepository,
  GrantPermissionInput,
} from "../../domain/repositories/IPermissionRepository";
function permissionsCol(db: ReturnType<typeof getFirestore>, accountId: string)
function permissionDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string)
function toPermission(id: string, data: Record<string, unknown>): Permission
export class FirebasePermissionRepository implements IPermissionRepository {
⋮----
private db()
async grant(input: GrantPermissionInput): Promise<Permission>
async revoke(accountId: string, permissionId: string): Promise<void>
async findById(accountId: string, permissionId: string): Promise<Permission | null>
async listBySubject(accountId: string, subjectId: string): Promise<Permission[]>
async listByPrincipal(accountId: string, principalId: string): Promise<Permission[]>
````

## File: modules/knowledge-collaboration/infrastructure/firebase/FirebaseVersionRepository.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationVersions/{versionId}
 */
import {
  collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { Version } from "../../domain/entities/version.entity";
import type { IVersionRepository, CreateVersionInput } from "../../domain/repositories/IVersionRepository";
function versionsCol(db: ReturnType<typeof getFirestore>, accountId: string)
function versionDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string)
function toVersion(id: string, data: Record<string, unknown>): Version
export class FirebaseVersionRepository implements IVersionRepository {
⋮----
private db()
async create(input: CreateVersionInput): Promise<Version>
async findById(accountId: string, versionId: string): Promise<Version | null>
async listByContent(accountId: string, contentId: string): Promise<Version[]>
async delete(accountId: string, versionId: string): Promise<void>
````

## File: modules/knowledge-database/application/dto/knowledge-database.dto.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: application/dto
 */
import { z } from "@lib-zod";
⋮----
// ── Database ──────────────────────────────────────────────────────────────────
⋮----
export type CreateDatabaseDto = z.infer<typeof CreateDatabaseSchema>;
⋮----
export type UpdateDatabaseDto = z.infer<typeof UpdateDatabaseSchema>;
⋮----
export type AddFieldDto = z.infer<typeof AddFieldSchema>;
⋮----
export type ArchiveDatabaseDto = z.infer<typeof ArchiveDatabaseSchema>;
// ── Record ────────────────────────────────────────────────────────────────────
⋮----
export type CreateRecordDto = z.infer<typeof CreateRecordSchema>;
⋮----
export type UpdateRecordDto = z.infer<typeof UpdateRecordSchema>;
⋮----
export type DeleteRecordDto = z.infer<typeof DeleteRecordSchema>;
// ── View ──────────────────────────────────────────────────────────────────────
⋮----
export type CreateViewDto = z.infer<typeof CreateViewSchema>;
⋮----
export type UpdateViewDto = z.infer<typeof UpdateViewSchema>;
⋮----
export type DeleteViewDto = z.infer<typeof DeleteViewSchema>;
````

## File: modules/knowledge-database/application/use-cases/database.use-cases.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: application/use-cases
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import type { Database } from "../../domain/entities/database.entity";
import type { IDatabaseRepository } from "../../domain/repositories/IDatabaseRepository";
import {
  CreateDatabaseSchema, type CreateDatabaseDto,
  UpdateDatabaseSchema, type UpdateDatabaseDto,
  AddFieldSchema, type AddFieldDto,
  ArchiveDatabaseSchema, type ArchiveDatabaseDto,
} from "../dto/knowledge-database.dto";
export class CreateDatabaseUseCase {
⋮----
constructor(private readonly repo: IDatabaseRepository)
async execute(input: CreateDatabaseDto): Promise<CommandResult>
⋮----
export class UpdateDatabaseUseCase {
⋮----
async execute(input: UpdateDatabaseDto): Promise<CommandResult>
⋮----
export class AddFieldUseCase {
⋮----
async execute(input: AddFieldDto): Promise<CommandResult>
⋮----
export class ArchiveDatabaseUseCase {
⋮----
async execute(input: ArchiveDatabaseDto): Promise<CommandResult>
⋮----
export class GetDatabaseUseCase {
⋮----
async execute(accountId: string, databaseId: string): Promise<Database | null>
⋮----
export class ListDatabasesUseCase {
⋮----
async execute(accountId: string, workspaceId: string): Promise<Database[]>
````

## File: modules/knowledge-database/application/use-cases/record.use-cases.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: application/use-cases
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { DatabaseRecord } from "../../domain/entities/record.entity";
import type { IDatabaseRecordRepository } from "../../domain/repositories/IDatabaseRecordRepository";
import {
  CreateRecordSchema, type CreateRecordDto,
  UpdateRecordSchema, type UpdateRecordDto,
  DeleteRecordSchema, type DeleteRecordDto,
} from "../dto/knowledge-database.dto";
export class CreateRecordUseCase {
⋮----
constructor(private readonly repo: IDatabaseRecordRepository)
async execute(input: CreateRecordDto): Promise<CommandResult>
⋮----
export class UpdateRecordUseCase {
⋮----
async execute(input: UpdateRecordDto): Promise<CommandResult>
⋮----
export class DeleteRecordUseCase {
⋮----
async execute(input: DeleteRecordDto): Promise<CommandResult>
⋮----
export class ListRecordsUseCase {
⋮----
async execute(accountId: string, databaseId: string): Promise<DatabaseRecord[]>
````

## File: modules/knowledge-database/domain/entities/database.entity.ts
````typescript
export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "relation"
  | "formula"
  | "rollup";
export interface Field {
  id: string;
  name: string;
  type: FieldType;
  config: Record<string, unknown>;
  required: boolean;
  order: number;
}
export interface Database {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  description: string | null;
  fields: Field[];
  viewIds: string[];
  icon: string | null;
  coverImageUrl: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
````

## File: modules/knowledge-database/domain/entities/record.entity.ts
````typescript
export interface DatabaseRecord {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  properties: Map<string, unknown>;
  order: number;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
````

## File: modules/knowledge-database/domain/entities/view.entity.ts
````typescript
export type ViewType = "table" | "board" | "list" | "calendar" | "timeline" | "gallery";
export interface FilterRule {
  fieldId: string;
  operator: "eq" | "neq" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "gt" | "lt";
  value: unknown;
}
export interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
}
export interface View {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  type: ViewType;
  filters: FilterRule[];
  sorts: SortRule[];
  groupBy: { fieldId: string; direction: "asc" | "desc" } | null;
  visibleFieldIds: string[];
  hiddenFieldIds: string[];
  boardGroupFieldId: string | null;
  calendarDateFieldId: string | null;
  timelineStartFieldId: string | null;
  timelineEndFieldId: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
````

## File: modules/knowledge-database/domain/repositories/IDatabaseRecordRepository.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: domain/repositories
 */
import type { DatabaseRecord } from "../entities/record.entity";
export interface CreateRecordInput {
  readonly databaseId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly properties?: Record<string, unknown>;
  readonly createdByUserId: string;
}
export interface UpdateRecordInput {
  readonly id: string;
  readonly accountId: string;
  readonly properties: Record<string, unknown>;
}
export interface IDatabaseRecordRepository {
  create(input: CreateRecordInput): Promise<DatabaseRecord>;
  update(input: UpdateRecordInput): Promise<DatabaseRecord | null>;
  delete(accountId: string, recordId: string): Promise<void>;
  findById(accountId: string, recordId: string): Promise<DatabaseRecord | null>;
  listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecord[]>;
}
⋮----
create(input: CreateRecordInput): Promise<DatabaseRecord>;
update(input: UpdateRecordInput): Promise<DatabaseRecord | null>;
delete(accountId: string, recordId: string): Promise<void>;
findById(accountId: string, recordId: string): Promise<DatabaseRecord | null>;
listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecord[]>;
````

## File: modules/knowledge-database/domain/repositories/IDatabaseRepository.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: domain/repositories
 */
import type { Database, Field } from "../entities/database.entity";
export interface CreateDatabaseInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly description?: string | null;
  readonly createdByUserId: string;
}
export interface UpdateDatabaseInput {
  readonly id: string;
  readonly accountId: string;
  readonly name?: string;
  readonly description?: string | null;
  readonly icon?: string | null;
  readonly coverImageUrl?: string | null;
}
export interface AddFieldInput {
  readonly databaseId: string;
  readonly accountId: string;
  readonly field: Omit<Field, "id" | "order">;
}
export interface IDatabaseRepository {
  create(input: CreateDatabaseInput): Promise<Database>;
  update(input: UpdateDatabaseInput): Promise<Database | null>;
  addField(input: AddFieldInput): Promise<Database | null>;
  archive(accountId: string, databaseId: string): Promise<void>;
  findById(accountId: string, databaseId: string): Promise<Database | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<Database[]>;
}
⋮----
create(input: CreateDatabaseInput): Promise<Database>;
update(input: UpdateDatabaseInput): Promise<Database | null>;
addField(input: AddFieldInput): Promise<Database | null>;
archive(accountId: string, databaseId: string): Promise<void>;
findById(accountId: string, databaseId: string): Promise<Database | null>;
listByWorkspace(accountId: string, workspaceId: string): Promise<Database[]>;
````

## File: modules/knowledge-database/domain/repositories/IViewRepository.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: domain/repositories
 */
import type { View, ViewType } from "../entities/view.entity";
export interface CreateViewInput {
  readonly databaseId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly type: ViewType;
  readonly createdByUserId: string;
}
export interface UpdateViewInput {
  readonly id: string;
  readonly accountId: string;
  readonly name?: string;
  readonly filters?: View["filters"];
  readonly sorts?: View["sorts"];
  readonly groupBy?: View["groupBy"];
  readonly visibleFieldIds?: string[];
  readonly hiddenFieldIds?: string[];
}
export interface IViewRepository {
  create(input: CreateViewInput): Promise<View>;
  update(input: UpdateViewInput): Promise<View | null>;
  delete(accountId: string, viewId: string): Promise<void>;
  findById(accountId: string, viewId: string): Promise<View | null>;
  listByDatabase(accountId: string, databaseId: string): Promise<View[]>;
}
⋮----
create(input: CreateViewInput): Promise<View>;
update(input: UpdateViewInput): Promise<View | null>;
delete(accountId: string, viewId: string): Promise<void>;
findById(accountId: string, viewId: string): Promise<View | null>;
listByDatabase(accountId: string, databaseId: string): Promise<View[]>;
````

## File: modules/knowledge-database/infrastructure/firebase/FirebaseViewRepository.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/databaseViews/{viewId}
 */
import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { View, FilterRule, SortRule } from "../../domain/entities/view.entity";
import type {
  IViewRepository,
  CreateViewInput,
  UpdateViewInput,
} from "../../domain/repositories/IViewRepository";
function viewsCol(db: ReturnType<typeof getFirestore>, accountId: string)
function viewDoc(db: ReturnType<typeof getFirestore>, accountId: string, viewId: string)
function toView(id: string, data: Record<string, unknown>): View
export class FirebaseViewRepository implements IViewRepository {
⋮----
private db()
async create(input: CreateViewInput): Promise<View>
async update(input: UpdateViewInput): Promise<View | null>
async delete(accountId: string, viewId: string): Promise<void>
async findById(accountId: string, viewId: string): Promise<View | null>
async listByDatabase(accountId: string, databaseId: string): Promise<View[]>
````

## File: modules/knowledge-database/interfaces/components/DatabaseDialog.tsx
````typescript
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { createDatabase } from "../_actions/knowledge-database.actions";
interface DatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  onSuccess?: (databaseId?: string) => void;
}
export function DatabaseDialog({
  open,
  onOpenChange,
  accountId,
  workspaceId,
  currentUserId,
  onSuccess,
}: DatabaseDialogProps)
⋮----
function reset()
function handleOpenChange(next: boolean)
function handleSubmit(e: React.FormEvent)
⋮----
onChange=
````

## File: modules/knowledge-database/interfaces/components/DatabaseTableView.tsx
````typescript
import { useCallback, useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { getRecords } from "../queries/knowledge-database.queries";
import { createRecord, updateRecord, deleteRecord } from "../_actions/knowledge-database.actions";
import type { Database, Field } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";
// Re-exported via api/index.ts — but internal usage is fine via relative path
interface DatabaseTableViewProps {
  database: Database;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}
⋮----
/** Resolve a Map<string,unknown> or Record<string,unknown> to a plain JS value for display */
function getProperty(record: DatabaseRecord, fieldId: string): unknown
function setProperty(record: DatabaseRecord, fieldId: string, value: unknown): Record<string, unknown>
⋮----
/** Tracks inline edits keyed by recordId → { fieldId → value } */
⋮----
function handleCellChange(recordId: string, fieldId: string, value: unknown)
function handleCellBlur(record: DatabaseRecord, fieldId: string)
function handleAddRecord()
function handleDeleteRecord(recordId: string)
````

## File: modules/knowledge-database/interfaces/queries/knowledge-database.queries.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: interfaces/queries
 * Direct-instantiation query functions (read-side, no server action overhead).
 */
import { FirebaseDatabaseRepository } from "../../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseRecordRepository } from "../../infrastructure/firebase/FirebaseRecordRepository";
import { FirebaseViewRepository } from "../../infrastructure/firebase/FirebaseViewRepository";
import type { Database } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";
import type { View } from "../../domain/entities/view.entity";
export async function getDatabases(accountId: string, workspaceId: string): Promise<Database[]>
export async function getDatabase(accountId: string, databaseId: string): Promise<Database | null>
export async function getRecords(accountId: string, databaseId: string): Promise<DatabaseRecord[]>
export async function getViews(accountId: string, databaseId: string): Promise<View[]>
````

## File: modules/knowledge/application/use-cases/knowledge-collection.use-cases.ts
````typescript
/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: KnowledgeCollection use cases — create, rename, add/remove page, add column, archive, list.
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { KnowledgeCollection } from "../../domain/entities/knowledge-collection.entity";
import type { KnowledgeCollectionRepository } from "../../domain/repositories/knowledge.repositories";
import {
  CreateKnowledgeCollectionSchema,
  type CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionSchema,
  type RenameKnowledgeCollectionDto,
  AddPageToCollectionSchema,
  type AddPageToCollectionDto,
  RemovePageFromCollectionSchema,
  type RemovePageFromCollectionDto,
  AddCollectionColumnSchema,
  type AddCollectionColumnDto,
  ArchiveKnowledgeCollectionSchema,
  type ArchiveKnowledgeCollectionDto,
} from "../dto/knowledge.dto";
export class CreateKnowledgeCollectionUseCase {
⋮----
constructor(private readonly repo: KnowledgeCollectionRepository)
async execute(input: CreateKnowledgeCollectionDto): Promise<CommandResult>
⋮----
export class RenameKnowledgeCollectionUseCase {
⋮----
async execute(input: RenameKnowledgeCollectionDto): Promise<CommandResult>
⋮----
export class AddPageToCollectionUseCase {
⋮----
async execute(input: AddPageToCollectionDto): Promise<CommandResult>
⋮----
export class RemovePageFromCollectionUseCase {
⋮----
async execute(input: RemovePageFromCollectionDto): Promise<CommandResult>
⋮----
export class AddCollectionColumnUseCase {
⋮----
async execute(input: AddCollectionColumnDto): Promise<CommandResult>
⋮----
export class ArchiveKnowledgeCollectionUseCase {
⋮----
async execute(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult>
⋮----
export class GetKnowledgeCollectionUseCase {
⋮----
async execute(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>
⋮----
export class ListKnowledgeCollectionsByAccountUseCase {
⋮----
async execute(accountId: string): Promise<KnowledgeCollection[]>
⋮----
export class ListKnowledgeCollectionsByWorkspaceUseCase {
⋮----
async execute(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>
````

## File: modules/knowledge/application/use-cases/knowledge-page.use-cases.ts
````typescript
/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Page use cases — create, rename, move, reorder blocks, archive, list.
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { KnowledgePage, KnowledgePageTreeNode } from "../../domain/entities/content-page.entity";
import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";
import {
  PublishDomainEventUseCase,
  type IEventStoreRepository,
  type IEventBusRepository,
} from "@/modules/shared/api";
import { v7 as generateId } from "@lib-uuid";
import {
  CreateKnowledgePageSchema,
  type CreateKnowledgePageDto,
  RenameKnowledgePageSchema,
  type RenameKnowledgePageDto,
  MoveKnowledgePageSchema,
  type MoveKnowledgePageDto,
  ArchiveKnowledgePageSchema,
  type ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksSchema,
  type ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageSchema,
  type ApproveKnowledgePageDto,
  VerifyKnowledgePageSchema,
  type VerifyKnowledgePageDto,
  RequestPageReviewSchema,
  type RequestPageReviewDto,
  AssignPageOwnerSchema,
  type AssignPageOwnerDto,
} from "../dto/knowledge.dto";
export function buildKnowledgePageTree(pages: KnowledgePage[]): KnowledgePageTreeNode[]
⋮----
const sortByOrder = (nodes: KnowledgePageTreeNode[]): void =>
⋮----
export class CreateKnowledgePageUseCase {
⋮----
constructor(private readonly repo: KnowledgePageRepository)
async execute(input: CreateKnowledgePageDto): Promise<CommandResult>
⋮----
export class RenameKnowledgePageUseCase {
⋮----
async execute(input: RenameKnowledgePageDto): Promise<CommandResult>
⋮----
export class MoveKnowledgePageUseCase {
⋮----
async execute(input: MoveKnowledgePageDto): Promise<CommandResult>
⋮----
export class ArchiveKnowledgePageUseCase {
⋮----
async execute(input: ArchiveKnowledgePageDto): Promise<CommandResult>
⋮----
export class ReorderKnowledgePageBlocksUseCase {
⋮----
async execute(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult>
⋮----
export class GetKnowledgePageUseCase {
⋮----
async execute(accountId: string, pageId: string): Promise<KnowledgePage | null>
⋮----
export class ListKnowledgePagesUseCase {
⋮----
async execute(accountId: string): Promise<KnowledgePage[]>
⋮----
export class GetKnowledgePageTreeUseCase {
⋮----
async execute(accountId: string): Promise<KnowledgePageTreeNode[]>
⋮----
export class ApproveKnowledgePageUseCase {
⋮----
constructor(
async execute(input: ApproveKnowledgePageDto): Promise<CommandResult>
⋮----
// causationId is set by the Server Action layer; generateId() is a safe fallback.
⋮----
export class VerifyKnowledgePageUseCase {
⋮----
async execute(input: VerifyKnowledgePageDto): Promise<CommandResult>
⋮----
export class RequestPageReviewUseCase {
⋮----
async execute(input: RequestPageReviewDto): Promise<CommandResult>
⋮----
export class AssignPageOwnerUseCase {
⋮----
async execute(input: AssignPageOwnerDto): Promise<CommandResult>
````

## File: modules/knowledge/domain/entities/content-page.entity.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Page aggregate root — the central document unit in the Content domain.
 */
export type KnowledgePageStatus = "active" | "archived";
export type KnowledgePageApprovalState = "pending" | "approved";
/** Notion Wiki page verification state */
export type PageVerificationState = "verified" | "needs_review";
⋮----
export interface KnowledgePage {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: KnowledgePageStatus;
  /** Approval state for AI-parsed draft pages. Populated when the page originates from an ingestion pipeline. */
  readonly approvalState?: KnowledgePageApprovalState;
  /** ISO timestamp when this page was approved by an actor (approvalState = "approved"). */
  readonly approvedAtISO?: string;
  /** Actor who approved the page. */
  readonly approvedByUserId?: string;
  // ── Wiki / Knowledge Base fields (Notion-equivalent) ────────────────────────
  /**
   * Verification state for Wiki (Knowledge Base) pages.
   * undefined = page is not in wiki verification mode.
   * "verified" = marked as up-to-date by a verifier.
   * "needs_review" = flagged for review (may be stale).
   */
  readonly verificationState?: PageVerificationState;
  /** User responsible for keeping this page accurate. */
  readonly ownerId?: string;
  /** User who last set verificationState to "verified". */
  readonly verifiedByUserId?: string;
  /** ISO timestamp when the page was last verified. */
  readonly verifiedAtISO?: string;
  /** ISO timestamp after which the page auto-transitions to "needs_review". */
  readonly verificationExpiresAtISO?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/** Approval state for AI-parsed draft pages. Populated when the page originates from an ingestion pipeline. */
⋮----
/** ISO timestamp when this page was approved by an actor (approvalState = "approved"). */
⋮----
/** Actor who approved the page. */
⋮----
// ── Wiki / Knowledge Base fields (Notion-equivalent) ────────────────────────
/**
   * Verification state for Wiki (Knowledge Base) pages.
   * undefined = page is not in wiki verification mode.
   * "verified" = marked as up-to-date by a verifier.
   * "needs_review" = flagged for review (may be stale).
   */
⋮----
/** User responsible for keeping this page accurate. */
⋮----
/** User who last set verificationState to "verified". */
⋮----
/** ISO timestamp when the page was last verified. */
⋮----
/** ISO timestamp after which the page auto-transitions to "needs_review". */
⋮----
export interface KnowledgePageTreeNode extends KnowledgePage {
  readonly children: readonly KnowledgePageTreeNode[];
}
export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly parentPageId?: string | null;
  readonly createdByUserId: string;
}
export interface RenameKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly title: string;
}
export interface MoveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly targetParentPageId: string | null;
}
export interface ReorderKnowledgePageBlocksInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly blockIds: readonly string[];
}
export interface ArchiveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
}
export interface ApproveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly approvedByUserId: string;
  readonly approvedAtISO: string;
}
export interface VerifyKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly verifiedByUserId: string;
  readonly verificationExpiresAtISO?: string;
}
export interface RequestPageReviewInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly requestedByUserId: string;
}
export interface AssignPageOwnerInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly ownerId: string;
}
````

## File: modules/knowledge/domain/events/knowledge.events.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/event
 * Purpose: Discriminated-union event types emitted by the Content domain.
 */
export interface KnowledgePageCreatedEvent {
  readonly type: "knowledge.page_created";
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly createdByUserId: string;
  readonly occurredAtISO: string;
}
export interface KnowledgePageRenamedEvent {
  readonly type: "knowledge.page_renamed";
  readonly pageId: string;
  readonly accountId: string;
  readonly previousTitle: string;
  readonly newTitle: string;
  readonly occurredAtISO: string;
}
export interface KnowledgePageMovedEvent {
  readonly type: "knowledge.page_moved";
  readonly pageId: string;
  readonly accountId: string;
  readonly previousParentPageId: string | null;
  readonly newParentPageId: string | null;
  readonly occurredAtISO: string;
}
export interface KnowledgePageArchivedEvent {
  readonly type: "knowledge.page_archived";
  readonly pageId: string;
  readonly accountId: string;
  readonly occurredAtISO: string;
}
// ── Extracted-task shape (used inside KnowledgePageApprovedEvent) ───────────────
export interface ExtractedTask {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}
export interface ExtractedInvoice {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}
export interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  /** KnowledgePage aggregate ID (also the Firestore document id). */
  readonly aggregateId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly extractedTasks: ReadonlyArray<ExtractedTask>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoice>;
  /** Actor who triggered the approval. */
  readonly actorId: string;
  /** ID of the command (ApproveKnowledgePageUseCase execution) that caused this event. */
  readonly causationId: string;
  /** Business-process correlation ID tracing the whole ingestion → approval → materialization flow. */
  readonly correlationId: string;
  readonly occurredAtISO: string;
}
⋮----
/** KnowledgePage aggregate ID (also the Firestore document id). */
⋮----
/** Actor who triggered the approval. */
⋮----
/** ID of the command (ApproveKnowledgePageUseCase execution) that caused this event. */
⋮----
/** Business-process correlation ID tracing the whole ingestion → approval → materialization flow. */
⋮----
export interface KnowledgeBlockAddedEvent {
  readonly type: "knowledge.block_added";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
  readonly occurredAtISO: string;
}
export interface KnowledgeBlockUpdatedEvent {
  readonly type: "knowledge.block_updated";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
  readonly occurredAtISO: string;
}
export interface KnowledgeBlockDeletedEvent {
  readonly type: "knowledge.block_deleted";
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly occurredAtISO: string;
}
export interface KnowledgeVersionPublishedEvent {
  readonly type: "knowledge.version_published";
  readonly versionId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly label: string;
  readonly createdByUserId: string;
  readonly occurredAtISO: string;
}
// ── Wiki / Knowledge Base events ──────────────────────────────────────────────
/** Emitted when a wiki page is marked "verified" (up-to-date). */
export interface KnowledgePageVerifiedEvent {
  readonly type: "knowledge.page_verified";
  readonly pageId: string;
  readonly accountId: string;
  readonly verifiedByUserId: string;
  /** Optional expiry — after this ISO timestamp the page auto-transitions to "needs_review". */
  readonly verificationExpiresAtISO?: string;
  readonly occurredAtISO: string;
}
⋮----
/** Optional expiry — after this ISO timestamp the page auto-transitions to "needs_review". */
⋮----
/** Emitted when a wiki page is flagged for review (verification expired or manually requested). */
export interface KnowledgePageReviewRequestedEvent {
  readonly type: "knowledge.page_review_requested";
  readonly pageId: string;
  readonly accountId: string;
  readonly requestedByUserId: string;
  readonly occurredAtISO: string;
}
/** Emitted when a wiki page owner is assigned or changed. */
export interface KnowledgePageOwnerAssignedEvent {
  readonly type: "knowledge.page_owner_assigned";
  readonly pageId: string;
  readonly accountId: string;
  readonly ownerId: string;
  readonly assignedByUserId: string;
  readonly occurredAtISO: string;
}
export type KnowledgeDomainEvent =
  | KnowledgePageCreatedEvent
  | KnowledgePageRenamedEvent
  | KnowledgePageMovedEvent
  | KnowledgePageArchivedEvent
  | KnowledgePageApprovedEvent
  | KnowledgeBlockAddedEvent
  | KnowledgeBlockUpdatedEvent
  | KnowledgeBlockDeletedEvent
  | KnowledgeVersionPublishedEvent
  | KnowledgePageVerifiedEvent
  | KnowledgePageReviewRequestedEvent
  | KnowledgePageOwnerAssignedEvent;
````

## File: modules/knowledge/index.ts
````typescript
/**
 * Module: knowledge
 * Layer: module/barrel (public API)
 *
 * This is the ONLY file that external modules should import from.
 * All internal implementation details (domain, application, infrastructure)
 * are NOT importable from outside — use the exports listed here.
 *
 * Boundary rule: other modules import via `@/modules/knowledge`, never from
 * `@/modules/knowledge/domain/...` or deeper paths.
 *
 * Access pattern:
 *   - Cross-domain programmatic usage → `knowledgeFacade` (or `KnowledgeFacade`)
 *   - UI mutations                    → Server Actions below
 *   - UI reads                        → Query functions below
 */
// ── API: Facade (cross-domain entry point) ────────────────────────────────────
⋮----
// ── Domain: entity types ──────────────────────────────────────────────────────
⋮----
// ── Interfaces: Server Actions ────────────────────────────────────────────────
⋮----
// ── Interfaces: Queries ───────────────────────────────────────────────────────
⋮----
// ── Domain: Collection + Wiki types ──────────────────────────────────────────
⋮----
// ── Interfaces: Components ────────────────────────────────────────────────────
````

## File: modules/knowledge/infrastructure/firebase/FirebaseContentPageRepository.ts
````typescript
/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgePageRepository.
 *
 * Firestore collection: accounts/{accountId}/contentPages/{pageId}
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type {
  KnowledgePage,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ApproveKnowledgePageInput,
  VerifyKnowledgePageInput,
  RequestPageReviewInput,
  AssignPageOwnerInput,
} from "../../domain/entities/content-page.entity";
import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";
function pagesCol(db: ReturnType<typeof getFirestore>, accountId: string)
function pageDoc(db: ReturnType<typeof getFirestore>, accountId: string, pageId: string)
function toKnowledgePage(id: string, data: Record<string, unknown>): KnowledgePage
function slugify(title: string): string
export class FirebaseKnowledgePageRepository implements KnowledgePageRepository {
⋮----
private get db()
async create(input: CreateKnowledgePageInput): Promise<KnowledgePage>
async rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null>
async move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null>
async reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null>
async archive(accountId: string, pageId: string): Promise<KnowledgePage | null>
async approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null>
async findById(accountId: string, pageId: string): Promise<KnowledgePage | null>
async listByAccountId(accountId: string): Promise<KnowledgePage[]>
async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>
async verify(input: VerifyKnowledgePageInput): Promise<KnowledgePage | null>
async requestReview(input: RequestPageReviewInput): Promise<KnowledgePage | null>
async assignOwner(input: AssignPageOwnerInput): Promise<KnowledgePage | null>
````

## File: modules/knowledge/infrastructure/index.ts
````typescript
/**
 * Module: knowledge
 * Layer: infrastructure/barrel
 */
````

## File: modules/knowledge/infrastructure/InMemoryKnowledgeRepository.ts
````typescript
/**
 * Module: knowledge
 * Layer: infrastructure/in-memory
 * Purpose: In-memory adapter for KnowledgePageRepository and KnowledgeBlockRepository.
 *          Uses plain Map<string, …> — no external database required.
 *          Designed for local demos and unit tests (Occam's Razor).
 */
import { v7 as generateId } from "@lib-uuid";
import type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
} from "../domain/entities/content-block.entity";
import type {
  KnowledgePage,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ApproveKnowledgePageInput,
  VerifyKnowledgePageInput,
  RequestPageReviewInput,
  AssignPageOwnerInput,
} from "../domain/entities/content-page.entity";
import type {
  KnowledgeBlockRepository,
  KnowledgePageRepository,
} from "../domain/repositories/knowledge.repositories";
// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateSlug(title: string): string
// ─── Page repository ──────────────────────────────────────────────────────────
export class InMemoryKnowledgePageRepository implements KnowledgePageRepository {
⋮----
async create(input: CreateKnowledgePageInput): Promise<KnowledgePage>
async rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null>
async move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null>
async reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null>
async archive(_accountId: string, pageId: string): Promise<KnowledgePage | null>
async approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null>
async verify(input: VerifyKnowledgePageInput): Promise<KnowledgePage | null>
async requestReview(input: RequestPageReviewInput): Promise<KnowledgePage | null>
async assignOwner(input: AssignPageOwnerInput): Promise<KnowledgePage | null>
async findById(_accountId: string, pageId: string): Promise<KnowledgePage | null>
async listByAccountId(accountId: string): Promise<KnowledgePage[]>
async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>
/** Append a blockId to a page's blockIds list (called by block operations). */
async appendBlockId(pageId: string, blockId: string): Promise<void>
⋮----
// ─── Block repository ─────────────────────────────────────────────────────────
export class InMemoryKnowledgeBlockRepository implements KnowledgeBlockRepository {
⋮----
async add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock>
async update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null>
async delete(_accountId: string, blockId: string): Promise<void>
async findById(_accountId: string, blockId: string): Promise<KnowledgeBlock | null>
async listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]>
````

## File: modules/knowledge/interfaces/components/BlockEditorView.tsx
````typescript
import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical, ChevronDown } from "lucide-react";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@lib-dragdrop";
import { useBlockEditorStore } from "../store/block-editor.store";
import type { BlockType } from "../../domain/value-objects/block-content";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";
/**
 * BlockEditorView
 *
 * Block-based editor with typed content (BlockContent value object).
 * Supports: text, heading-1/2/3, quote, divider, code, bullet-list, numbered-list.
 *
 * - Enter: add new block after current and focus it
 * - Backspace (empty block): delete current and focus previous
 * - Type selector: dropdown button left of drag handle
 * - Drag handle: reorder blocks via pragmatic-drag-and-drop
 */
⋮----
// focusNextRef encodes the intent:
//   "__after:{id}" → focus the block immediately after the one with the given id
//   "<id>"         → focus the block with the given id directly
⋮----
// Seed first block on mount (avoids SSR UUID mismatch)
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
⋮----
// Focus resolution after every render
⋮----
// Set up DnD monitor once
⋮----
onDrop(
⋮----
onTextChange=
⋮----
onKeyDown=
onInput=
⋮----
case "code": return "// 程式碼";
⋮----
// Close on outside click
⋮----
function handleClick(e: MouseEvent)
````

## File: modules/knowledge/interfaces/components/PageDialog.tsx
````typescript
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { createKnowledgePage } from "../_actions/knowledge.actions";
interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId?: string;
  currentUserId: string;
  parentPageId?: string | null;
  onSuccess?: (pageId?: string) => void;
}
export function PageDialog({
  open,
  onOpenChange,
  accountId,
  workspaceId,
  currentUserId,
  parentPageId,
  onSuccess,
}: PageDialogProps)
⋮----
function reset()
function handleOpenChange(next: boolean)
function handleSubmit(e: React.FormEvent)
⋮----
onChange=
````

## File: modules/knowledge/interfaces/components/PageTreeView.tsx
````typescript
import { ChevronDown, ChevronRight, FilePlus, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@ui-shadcn/ui/button";
import type { KnowledgePageTreeNode } from "../../domain/entities/content-page.entity";
import { PageDialog } from "./PageDialog";
interface PageTreeViewProps {
  nodes: KnowledgePageTreeNode[];
  accountId: string;
  workspaceId?: string;
  currentUserId: string;
  onPageClick?: (pageId: string) => void;
  onCreated?: () => void;
}
⋮----
onSuccess=
````

## File: modules/knowledge/interfaces/queries/knowledge.queries.ts
````typescript
/**
 * Module: knowledge
 * Layer: interfaces/queries
 * Purpose: Server-side query helpers for reading Content domain data.
 */
import type { KnowledgePage, KnowledgePageTreeNode } from "../../domain/entities/content-page.entity";
import type { KnowledgeBlock } from "../../domain/entities/content-block.entity";
import type { KnowledgeCollection } from "../../domain/entities/knowledge-collection.entity";
import {
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  GetKnowledgePageTreeUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import { ListKnowledgeBlocksUseCase } from "../../application/use-cases/knowledge-block.use-cases";
import {
  GetKnowledgeCollectionUseCase,
  ListKnowledgeCollectionsByAccountUseCase,
} from "../../application/use-cases/knowledge-collection.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../infrastructure/firebase/FirebaseContentCollectionRepository";
import type { KnowledgeVersion } from "../../domain/entities/content-version.entity";
export async function getKnowledgePage(
  accountId: string,
  pageId: string,
): Promise<KnowledgePage | null>
export async function getKnowledgePages(accountId: string): Promise<KnowledgePage[]>
export async function getKnowledgePageTree(accountId: string): Promise<KnowledgePageTreeNode[]>
export async function getKnowledgeBlocks(
  accountId: string,
  pageId: string,
): Promise<KnowledgeBlock[]>
export async function getKnowledgeVersions(
  _accountId: string,
  _pageId: string,
): Promise<KnowledgeVersion[]>
// ── Collection queries ────────────────────────────────────────────────────────
export async function getKnowledgeCollection(
  accountId: string,
  collectionId: string,
): Promise<KnowledgeCollection | null>
export async function getKnowledgeCollections(
  accountId: string,
): Promise<KnowledgeCollection[]>
````

## File: modules/knowledge/interfaces/store/block-editor.store.ts
````typescript
import { create } from "@lib-zustand";
import { v7 as uuid } from "@lib-uuid";
import type { BlockContent, BlockType } from "../../domain/value-objects/block-content";
import { emptyTextBlockContent } from "../../domain/value-objects/block-content";
export interface Block {
  readonly id: string;
  readonly content: BlockContent;
}
interface BlockEditorState {
  readonly blocks: Block[];
  readonly addBlock: (afterId?: string) => void;
  readonly updateBlock: (id: string, text: string) => void;
  readonly changeBlockType: (id: string, type: BlockType) => void;
  readonly deleteBlock: (id: string) => void;
  readonly moveBlock: (fromIdx: number, toIdx: number) => void;
  readonly init: () => void;
}
⋮----
// Start empty — component calls init() on mount to avoid SSR UUID mismatch.
⋮----
init()
addBlock(afterId)
updateBlock(id, text)
changeBlockType(id, type)
deleteBlock(id)
moveBlock(fromIdx, toIdx)
````

## File: modules/notebook/aggregates.md
````markdown
# Aggregates — notebook

## 聚合根：Thread

### 職責
代表一個 AI 對話串。持有有序的 Message 列表，管理對話歷史。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | Thread 主鍵 |
| `messages` | `Message[]` | 有序訊息列表 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- messages 列表維持追加順序，不可重新排序
- Thread 不可刪除 Message（只能追加）

---

## 值物件：Message

### 職責
Thread 中的單則訊息，不可變（immutable）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | 訊息主鍵 |
| `role` | `MessageRole` | `"user" \| "assistant" \| "system"` |
| `content` | `string` | 訊息內容文字 |
| `createdAt` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `NotebookRepository` | 封裝 Genkit AI 呼叫：`generateResponse(input)` |

### GenerateNotebookResponseInput

```typescript
interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;    // 預設 Gemini 2.0 flash
  readonly system?: string;   // System prompt
}
```

### GenerateNotebookResponseResult

```typescript
type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };

interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
```
````

## File: modules/notebook/application-services.md
````markdown
# notebook — Application Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `notebook` 的 application layer 服務與 use cases。內容與 `modules/notebook/application/` 實作保持一致。

## Application Layer 職責

管理 AI 對話 Thread/Message，並封裝模型生成回應。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/index.ts`
- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/generate-agent-response.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/notebook/README.md`
- 模組 AGENT：`../../../modules/notebook/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notebook/application-services.md`
````

## File: modules/notebook/application/use-cases/generate-agent-response.use-case.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";
export class GenerateNotebookResponseUseCase {
⋮----
constructor(private readonly agentRepository: NotebookRepository)
async execute(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>
````

## File: modules/notebook/domain-events.md
````markdown
# Domain Events — notebook

## 發出事件

`notebook` 域目前不發出 DomainEvent。AI 對話是使用者互動的即時回應，不需要下游事件消費。

未來可考慮：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `notebook.thread_created` | 新 Thread 建立 | 供 workspace-audit 記錄 |
| `notebook.response_generated` | AI 回應完成 | 供 token 使用量追蹤 |

## 訂閱事件

`notebook` 不訂閱其他 BC 的事件。

## 整合說明

`notebook` 透過**同步查詢**（非事件）消費其他 BC 的能力：

- **`search`**：呼叫 `search/api.answerRagQuery()` 取得語意相關 chunks（用於 RAG-augmented 對話）
- **`wiki`**：可查詢 wiki 圖譜以取得知識上下文（未來）
````

## File: modules/notebook/domain-services.md
````markdown
# notebook — Domain Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notebook/domain-services.md`
- `../../../docs/ddd/notebook/aggregates.md`
````

## File: modules/notebook/domain/entities/thread.ts
````typescript
/**
 * modules/notebook — domain entity: Thread
 */
import type { ID } from "@shared-types";
import type { Message } from "./message";
export interface Thread {
  readonly id: ID;
  readonly messages: Message[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
````

## File: modules/notebook/domain/index.ts
````typescript

````

## File: modules/notebook/domain/repositories/IThreadRepository.ts
````typescript
/**
 * modules/notebook — domain repository interface: IThreadRepository
 */
import type { Thread } from "../entities/thread";
export interface IThreadRepository {
  save(accountId: string, thread: Thread): Promise<void>;
  getById(accountId: string, threadId: string): Promise<Thread | null>;
}
⋮----
save(accountId: string, thread: Thread): Promise<void>;
getById(accountId: string, threadId: string): Promise<Thread | null>;
````

## File: modules/notebook/domain/repositories/NotebookRepository.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../entities/AgentGeneration";
export interface NotebookRepository {
  generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>;
}
⋮----
generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>;
````

## File: modules/notebook/infrastructure/firebase/FirebaseThreadRepository.ts
````typescript
/**
 * Module: notebook
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/threads/{threadId}
 *
 * Persists Thread (messages array) to Firestore so conversations survive page reload.
 */
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Thread } from "../../domain/entities/thread";
import type { Message } from "../../domain/entities/message";
import type { IThreadRepository } from "../../domain/repositories/IThreadRepository";
function threadDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  threadId: string,
)
function toMessage(m: Record<string, unknown>): Message
function toThread(id: string, data: Record<string, unknown>): Thread
export class FirebaseThreadRepository implements IThreadRepository {
⋮----
private db()
async save(accountId: string, thread: Thread): Promise<void>
async getById(accountId: string, threadId: string): Promise<Thread | null>
````

## File: modules/notebook/infrastructure/genkit/GenkitNotebookRepository.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { NotebookRepository } from "../../domain/repositories/NotebookRepository";
import { agentClient, getConfiguredGenkitModel } from "./client";
export class GenkitNotebookRepository implements NotebookRepository {
⋮----
async generateResponse(input: GenerateNotebookResponseInput): Promise<GenerateNotebookResponseResult>
````

## File: modules/notebook/infrastructure/genkit/index.ts
````typescript
/**
 * @module modules/notebook/infrastructure/genkit
 */
````

## File: modules/notebook/ubiquitous-language.md
````markdown
# Ubiquitous Language — notebook

> **範圍：** 僅限 `modules/notebook/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 對話串 | Thread | 一組有序的對話訊息集合，是 AI 對話的持久化單元 |
| 訊息 | Message | Thread 中的單則訊息（含 role 和 content） |
| 訊息角色 | MessageRole | 訊息發出者的角色：`"user" \| "assistant" \| "system"` |
| 筆記本回應 | NotebookResponse | AI 模型對一次 prompt 的回應結果（含 text、model） |
| 生成輸入 | GenerateNotebookResponseInput | 呼叫 AI 生成的輸入（prompt、model?、system?） |
| 筆記本庫 | NotebookRepository | 封裝 Genkit AI 呼叫的 Repository port |

## 棄用術語（已移至 search）

| 棄用術語 | 新位置 |
|----------|--------|
| `RagQuery` / `RagCitation` | `modules/search/domain/entities/RagQuery.ts` |
| `RagGenerationRepository` | `modules/search/domain/repositories/RagGenerationRepository.ts` |
| `RagRetrievalRepository` | `modules/search/domain/repositories/RagRetrievalRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Thread` | `Conversation`, `Chat`, `Session` |
| `Message` | `ChatMessage`, `Turn` |
| `NotebookResponse` | `AIResponse`, `LLMOutput` |
````

## File: modules/notification/AGENT.md
````markdown
# AGENT.md — notification BC

## 模組定位

`notification` 是通知分發的通用子域，負責系統通知的建立、發送與讀取。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `NotificationEntity` | Notification（作為 class 名），Alert, Message（作為通知） |
| `recipientId` | userId, receiverId |
| `NotificationType` | Type, AlertLevel |
| `DispatchNotificationInput` | CreateNotification, SendNotification |

## 邊界規則

### ✅ 允許
```typescript
import { notificationApi } from "@/modules/notification/api";
import type { NotificationDTO } from "@/modules/notification/api";
```

### ❌ 禁止
```typescript
import { NotificationEntity } from "@/modules/notification/domain/entities/Notification";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/notification/aggregates.md
````markdown
# Aggregates — notification

## 聚合根：NotificationEntity

### 職責
代表一則系統通知記錄。管理通知的發送與讀取狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 通知主鍵 |
| `recipientId` | `string` | 接收者帳戶 ID |
| `title` | `string` | 通知標題 |
| `message` | `string` | 通知內容 |
| `type` | `NotificationType` | `info \| alert \| success \| warning` |
| `read` | `boolean` | 是否已讀 |
| `timestamp` | `number` | Unix timestamp（毫秒） |
| `sourceEventType` | `string?` | 觸發此通知的事件類型 |
| `metadata` | `Record<string, unknown>?` | 附加元資料 |

### 不變數

- `recipientId` 不可為空
- `title` 不可為空

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `NotificationRepository` | `save()`, `findByRecipient()`, `markAsRead()` |
````

## File: modules/notification/api/index.ts
````typescript
/**
 * Module: notification
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Notification domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */
// ─── Facade ───────────────────────────────────────────────────────────────────
⋮----
// ─── Core entity types ────────────────────────────────────────────────────────
⋮----
// ─── UI components ────────────────────────────────────────────────────────────
````

## File: modules/notification/api/notification.facade.ts
````typescript
/**
 * Module: notification
 * Layer: api/facade
 * Purpose: Public programmatic entry-point for cross-module notification dispatch.
 *
 * Other modules MUST use `notificationFacade` — never reach into domain/,
 * application/, or infrastructure/ directly.
 */
import { type CommandResult } from "@shared-types";
import {
  DispatchNotificationUseCase,
  MarkAllNotificationsReadUseCase,
  MarkNotificationReadUseCase,
} from "../application/use-cases/notification.use-cases";
import type { DispatchNotificationInput, NotificationEntity } from "../domain/entities/Notification";
import { FirebaseNotificationRepository } from "../infrastructure/firebase/FirebaseNotificationRepository";
import type { NotificationRepository } from "../domain/repositories/NotificationRepository";
export class NotificationFacade {
⋮----
constructor(repo: NotificationRepository = new FirebaseNotificationRepository())
/** Dispatch a new notification to a recipient. */
async dispatch(input: DispatchNotificationInput): Promise<CommandResult>
/** Mark a single notification as read. */
async markAsRead(notificationId: string, recipientId: string): Promise<CommandResult>
/** Mark all notifications for a recipient as read. */
async markAllAsRead(recipientId: string): Promise<CommandResult>
/** Retrieve recent notifications for a recipient. */
async getForRecipient(recipientId: string, limit = 50): Promise<NotificationEntity[]>
/** Return unread notification count for a recipient. */
async getUnreadCount(recipientId: string): Promise<number>
````

## File: modules/notification/application-services.md
````markdown
# notification — Application Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件記錄 `notification` 的 application layer 服務與 use cases。內容與 `modules/notification/application/` 實作保持一致。

## Application Layer 職責

負責系統通知分發與通知讀取狀態管理。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/notification.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/notification/README.md`
- 模組 AGENT：`../../../modules/notification/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notification/application-services.md`
````

## File: modules/notification/context-map.md
````markdown
# Context Map — notification

## 上游（依賴）

### 所有業務 BC → notification（Published Language）

`notification` 訂閱各 BC 的業務事件，轉換為使用者通知。不直接依賴任何 BC 的 api。

---

## 下游（被依賴）

`notification` 不被其他 BC 依賴（通知是終端輸出，無下游）。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → notification | workspace | notification | Published Language (Events) |
| workspace-flow → notification | workspace-flow | notification | Published Language (Events) |
| 其他 BC → notification | 各 BC | notification | Published Language (Events) |
````

## File: modules/notification/domain-events.md
````markdown
# Domain Events — notification

## 發出事件

`notification` 域不發出 DomainEvent（通知本身是事件的結果，而非事件的來源）。

## 訂閱事件

`notification` 是各 BC 事件的**消費端**，訂閱業務事件並轉換為使用者通知：

| 來源 BC | 訂閱事件 | 通知內容 |
|---------|---------|---------|
| `workspace` | `workspace.member_joined` | 新成員加入通知 |
| `workspace-flow` | `workspace-flow.task_status_changed` | 任務狀態變更通知 |
| `workspace-audit` | 稽核紀錄變化 | 重要稽核事件通知（未來） |

## 說明

通知系統的角色是「事件翻譯器」：
1. 其他 BC 發出領域事件
2. notification 訂閱並翻譯為使用者可讀的通知
3. 通知推送給對應的 recipientId

這是典型的 **Published Language** 模式，notification 作為 Conformist 消費者。
````

## File: modules/notification/domain-services.md
````markdown
# notification — Domain Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notification/domain-services.md`
- `../../../docs/ddd/notification/aggregates.md`
````

## File: modules/notification/index.ts
````typescript
/**
 * notification module public API
 *
 * Cross-module callers must use `notificationFacade` or the exported types.
 * Internal layers (domain/, application/, infrastructure/) remain private.
 */
````

## File: modules/notification/interfaces/components/NotificationBell.tsx
````typescript
/**
 * Module: notification
 * Layer: interfaces/components
 * Purpose: Reusable notification bell with dropdown for shell header.
 *
 * Consumes use-cases via the module facade (no direct infrastructure imports).
 * Server-action mutations are wired through the local _actions module.
 */
import { Bell } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "../_actions/notification.actions";
import { getNotificationsForRecipient } from "../queries/notification.queries";
import type { NotificationEntity } from "../../domain/entities/Notification";
import { Button } from "@ui-shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
⋮----
function formatNotificationTime(timestamp: number)
interface NotificationBellProps {
  readonly recipientId: string;
}
⋮----
async function handleOpenChange(nextOpen: boolean)
async function handleMarkOneRead(notificationId: string)
async function handleMarkAllRead()
⋮----
````

## File: modules/notification/interfaces/index.ts
````typescript

````

## File: modules/notification/repositories.md
````markdown
# notification — Repositories

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotificationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseNotificationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notification/repositories.md`
- `../../../docs/ddd/notification/aggregates.md`
````

## File: modules/notification/ubiquitous-language.md
````markdown
# Ubiquitous Language — notification

> **範圍：** 僅限 `modules/notification/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 通知 | NotificationEntity | 一則系統通知記錄（含標題、內容、類型、讀取狀態） |
| 接收者 ID | recipientId | 接收此通知的帳戶 ID |
| 通知類型 | NotificationType | `"info" \| "alert" \| "success" \| "warning"` |
| 分發通知輸入 | DispatchNotificationInput | 建立並發送通知的輸入物件 |
| 來源事件類型 | sourceEventType | 觸發此通知的業務事件類型（可選，用於追蹤） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `NotificationEntity` | `Notification`（避免與 JS Notification API 衝突） |
| `recipientId` | `userId`, `receiverId` |
````

## File: modules/organization/AGENT.md
````markdown
# AGENT.md — organization BC

## 模組定位

`organization` 是 Xuanwu 的多租戶管理有界上下文，管理 Organization 聚合根、成員、隊伍與邀請流程。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Organization` | Company、Tenant、Team（作為頂層組織）、Client |
| `MemberReference` | Member、User（在組織上下文中）|
| `Team` | Group、Squad（作為組織子群組） |
| `PartnerInvite` | Invitation、InviteLink |
| `OrganizationRole` | Role、Permission（作為組織角色） |
| `Presence` | Status、OnlineStatus |

## 邊界規則

### ✅ 允許
```typescript
import { organizationApi } from "@/modules/organization/api";
import type { OrganizationDTO, MemberReferenceDTO } from "@/modules/organization/api";
```

### ❌ 禁止
```typescript
import { Organization } from "@/modules/organization/domain/entities/Organization";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/organization/aggregates.md
````markdown
# Aggregates — organization

## 聚合根：Organization

### 職責
代表一個企業或團隊租戶。管理所有成員、隊伍與合作夥伴邀請的生命週期。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 組織主鍵 |
| `name` | `string` | 組織名稱 |
| `members` | `MemberReference[]` | 成員列表（含 role） |
| `teams` | `Team[]` | 子隊伍列表 |
| `partnerInvites` | `PartnerInvite[]` | 未完成的邀請列表 |

### 不變數

- 同一 accountId 在同一 Organization 中只能有一個 MemberReference
- `Owner` 角色至少需要一位（不可移除最後一個 Owner）
- 過期的 PartnerInvite（`expired`）不能再被接受

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `MemberReference` | 成員快照（id, name, email, role, presence） |
| `Team` | 子群組（id, name, type, memberIds） |
| `PartnerInvite` | 邀請記錄（email, role, inviteState, invitedAt） |
| `OrganizationRole` | `"Owner" \| "Admin" \| "Member" \| "Guest"` |
| `Presence` | `"active" \| "away" \| "offline"` |
| `InviteState` | `"pending" \| "accepted" \| "expired"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `OrganizationRepository` | `save()`, `findById()`, `findByMemberId()` |
````

## File: modules/organization/application-services.md
````markdown
# organization — Application Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件記錄 `organization` 的 application layer 服務與 use cases。內容與 `modules/organization/application/` 實作保持一致。

## Application Layer 職責

管理多租戶組織、成員、隊伍與邀請流程。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/organization-policy.use-cases.ts`
- `application/use-cases/organization.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/organization/README.md`
- 模組 AGENT：`../../../modules/organization/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/organization/application-services.md`
````

## File: modules/organization/context-map.md
````markdown
# Context Map — organization

## 上游（依賴）

### account → organization（Customer/Supplier）

- `organization.members[]` 中的 `MemberReference.id` 參照 `account` 的 accountId
- 查詢成員 profile 時呼叫 `account/api`

---

## 下游（被依賴）

### organization → workspace（Customer/Supplier）

- `Workspace.accountId + accountType="organization"` 關聯至 Organization
- 工作區列表依 organizationId 篩選

### organization → workspace-audit（Published Language）

- 成員加入/移除事件供 `workspace-audit` 消費（未來事件 sink 完成後）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → organization | account | organization | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| organization → workspace-audit | organization | workspace-audit | Published Language (Events) |
````

## File: modules/organization/domain-events.md
````markdown
# Domain Events — organization

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `organization.created` | 新組織建立時 | `organizationId`, `name`, `ownerId`, `occurredAt` |
| `organization.member_invited` | 成員被邀請加入 | `organizationId`, `inviteId`, `email`, `role`, `occurredAt` |
| `organization.member_joined` | 邀請被接受，成員加入 | `organizationId`, `accountId`, `role`, `occurredAt` |
| `organization.member_removed` | 成員被移除 | `organizationId`, `accountId`, `occurredAt` |
| `organization.team_created` | 新 Team 建立 | `organizationId`, `teamId`, `occurredAt` |

## 訂閱事件

`organization` 不訂閱其他 BC 的事件（被動，等待 account 操作觸發）。

## 事件格式範例

```typescript
interface OrganizationMemberJoinedEvent {
  readonly type: "organization.member_joined";
  readonly organizationId: string;
  readonly accountId: string;
  readonly role: OrganizationRole;
  readonly occurredAt: string;  // ISO 8601
}
```
````

## File: modules/organization/domain-services.md
````markdown
# organization — Domain Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/organization/domain-services.md`
- `../../../docs/ddd/organization/aggregates.md`
````

## File: modules/organization/README.md
````markdown
# organization — 組織上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/organization/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`organization` 是平台多租戶治理層，負責定義團隊、成員與組織級關係。它把個人帳戶提升到群體協作層，為工作區與知識協作提供治理邊界。

## 主要職責

| 能力 | 說明 |
|---|---|
| 組織管理 | 建立與維護 Organization 聚合 |
| 成員與團隊治理 | 管理 MemberReference、Team 與組織內角色 |
| 邀請與夥伴協作 | 處理 PartnerInvite 與跨組織協作入口 |

## 與其他 Bounded Context 協作

- `account` 提供個人帳戶語意；`workspace` 以組織為主要歸屬邊界。
- `workspace-audit` 與 `notification` 會消費組織事件或範圍資訊。

## 核心聚合 / 核心概念

- **`Organization`**
- **`MemberReference`**
- **`Team`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/organization/repositories.md
````markdown
# organization — Repositories

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/OrganizationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseOrganizationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/organization/repositories.md`
- `../../../docs/ddd/organization/aggregates.md`
````

## File: modules/organization/ubiquitous-language.md
````markdown
# Ubiquitous Language — organization

> **範圍：** 僅限 `modules/organization/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 組織 | Organization | 頂層多租戶單元，代表一個企業或團隊 |
| 成員參照 | MemberReference | 組織成員的輕量參照（含 accountId、role、presence） |
| 隊伍 | Team | 組織內的子群組（internal / external 類型） |
| 合作夥伴邀請 | PartnerInvite | 邀請外部合作夥伴加入隊伍的邀請記錄 |
| 組織角色 | OrganizationRole | 成員在組織中的角色：`Owner \| Admin \| Member \| Guest` |
| 在線狀態 | Presence | 成員的當前狀態：`active \| away \| offline` |
| 邀請狀態 | InviteState | 邀請的當前狀態：`pending \| accepted \| expired` |
| 政策效果 | PolicyEffect | 組織政策的效果：`allow \| deny` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Organization` | `Company`, `Tenant`, `Client` |
| `MemberReference` | `Member`, `OrgUser` |
| `OrganizationRole` | `Role`, `Permission` |
````

## File: modules/search/AGENT.md
````markdown
# AGENT.md — search BC

## 模組定位

`search` 是 RAG 語意檢索的支援域，提供向量搜尋、RAG answer 生成與查詢反饋收集。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `RagQuery` | Query、SearchQuery、VectorQuery |
| `RagQueryFeedback` | Feedback、Rating |
| `RagRetrievedChunk` | Chunk、SearchResult |
| `RagCitation` | Citation、Source、Reference |
| `VectorStore` | VectorDB、EmbeddingStore |
| `RagRetrievalRepository` | RetrievalRepo、SearchRepo |
| `RagGenerationRepository` | GenerationRepo、AIRepo |

## 最重要邊界規則：Server vs Client Import

```typescript
// ✅ server code（Server Action、API route）
import { searchApi } from "@/modules/search/api";

// ✅ client code（React Component）
import { RagView } from "@/modules/search"; // root barrel

// ❌ 禁止：在 /api barrel 匯出 "use client" UI 元件
// RagView, RagQueryView 只能從 root barrel 匯出
```

## 邊界規則

### ❌ 禁止
```typescript
// api/index.ts 不得 re-export "use client" 元件
export { RagView } from "./interfaces/components/RagView"; // 禁止在 api/
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/search/aggregates.md
````markdown
# Aggregates — search

## 聚合根：RagQueryFeedback

### 職責
收集並持久化使用者對 RAG 查詢答案品質的反饋。支援持續改善 RAG 品質。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `feedbackId` | `string` | 反饋主鍵 |
| `queryId` | `string` | 關聯的查詢 ID |
| `helpful` | `boolean` | 是否有用 |
| `comment` | `string \| null` | 文字評論（可選） |
| `submittedAt` | `string` | ISO 8601 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `RagRetrievedChunk` | 檢索到的 chunk（chunkId, docId, chunkIndex, text, score, taxonomy） |
| `RagCitation` | 引用資訊（chunkId, docId, text, score） |
| `VectorDocument` | 向量索引文件（id, content, metadata, embedding） |
| `WikiCitation` | Wiki RAG 引用（pageId, pageTitle, text, score） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `IVectorStore` | 向量資料庫抽象（`index()`, `search()`, `deleteByDocId()`） |
| `RagRetrievalRepository` | Chunk 向量搜尋操作 |
| `RagGenerationRepository` | AI 答案生成（組合 chunks + Genkit 呼叫） |
| `RagQueryFeedbackRepository` | 反饋持久化 |
| `WikiContentRepository` | Wiki 整合 RAG 查詢（`queryWikiRag()`, `reindexWikiDocument()`） |
````

## File: modules/search/api/index.ts
````typescript
/**
 * modules/search — public API barrel.
 *
 * Layer 3: RAG Query — Dense + Sparse + Rerank + Citation.
 * Other modules MUST import from here only.
 */
⋮----
// ── RAG Feedback Loop ─────────────────────────────────────────────────────────
⋮----
// ── Wiki RAG types (owned by search domain) ────────────────────────────────
⋮----
// ── Wiki RAG use-cases ─────────────────────────────────────────────────────
import { FirebaseWikiContentRepository } from "../infrastructure/firebase/FirebaseWikiContentRepository";
import {
  runWikiRagQuery as _runWikiRagQuery,
  reindexWikiDocument as _reindexWikiDocument,
  listWikiParsedDocuments as _listWikiParsedDocuments,
} from "../application/use-cases/wiki-rag.use-case";
import type {
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../domain/entities/WikiRagTypes";
⋮----
export function runWikiRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: { taxonomyFilters?: string[]; maxAgeDays?: number; requireReady?: boolean } = {},
): Promise<WikiRagQueryResult>
export function reindexWikiDocument(input: WikiReindexInput): Promise<void>
export function listWikiParsedDocuments(accountId: string, limitCount = 20): Promise<WikiParsedDocument[]>
````

## File: modules/search/application-services.md
````markdown
# search — Application Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `search` 的 application layer 服務與 use cases。內容與 `modules/search/application/` 實作保持一致。

## Application Layer 職責

提供向量檢索、RAG answer 生成與查詢反饋收集。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/submit-rag-feedback.use-case.ts`
- `application/use-cases/wiki-rag.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/search/README.md`
- 模組 AGENT：`../../../modules/search/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/search/application-services.md`
````

## File: modules/search/application/use-cases/wiki-rag.use-case.ts
````typescript
/**
 * Module: search
 * Layer: application/use-cases
 * Purpose: Wiki-style RAG use-cases — run query, reindex document, list documents.
 *          Thin delegation to the FirebaseWikiContentRepository for the
 *          search module's public wiki-facing query surface.
 */
import type { WikiContentRepository } from "../../domain/repositories/WikiContentRepository";
import type {
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../../domain/entities/WikiRagTypes";
export async function runWikiRagQuery(
  query: string,
  accountId: string,
  workspaceId: string,
  topK = 4,
  options: {
    taxonomyFilters?: string[];
    maxAgeDays?: number;
    requireReady?: boolean;
  } = {},
  repository: WikiContentRepository,
): Promise<WikiRagQueryResult>
export async function reindexWikiDocument(
  input: WikiReindexInput,
  repository: WikiContentRepository,
): Promise<void>
export async function listWikiParsedDocuments(
  accountId: string,
  limitCount = 20,
  repository: WikiContentRepository,
): Promise<WikiParsedDocument[]>
````

## File: modules/search/context-map.md
````markdown
# Context Map — search

## 上游（依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 依賴 `ai` 生成的 IngestionChunk（embedding 向量）

### wiki → search（Customer/Supplier）

- `wiki.node_activated` 觸發 `search` 更新節點向量表示

---

## 下游（被依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api.answerRagQuery()` 取得 RAG chunks 與答案
- 這是同步查詢，不是事件

### search → Wiki UI（Interfaces）

- `RagView`, `RagQueryView` 從 `modules/search` root barrel 匯出（非 /api）
- Wiki 頁面直接呼叫 `search/api` Server Actions

---

## Import 路由

```
server code (Server Action, API route) → import from @/modules/search/api
client code (React Component)          → import from @/modules/search (root barrel)
```

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| ai → search | ai | search | Published Language (Events) |
| wiki → search | wiki | search | Published Language (Events) |
| search → notebook | search | notebook | Customer/Supplier（同步） |
| search → Wiki UI | search | app/ | Conformist |
````

## File: modules/search/domain-events.md
````markdown
# Domain Events — search

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `search.feedback_submitted` | 使用者提交 RagQueryFeedback | `feedbackId`, `queryId`, `helpful`, `occurredAt` |
| `search.index_updated` | 向量索引更新完成（文件重新索引） | `documentId`, `chunkCount`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `ai` | `ai.ingestion_completed` | 新 chunks 的 embedding 已就緒，觸發向量索引更新 |
| `wiki` | `wiki.node_activated` | 同步更新節點內容到向量索引 |

## 消費 search 事件的其他 BC

`search` 主要提供**同步查詢服務**（非事件），被 `notebook` 和 wiki RAG UI 直接呼叫：

```typescript
// notebook 呼叫 search 的同步查詢
const result = await searchApi.answerRagQuery({
  organizationId,
  userQuery,
  topK: 5,
});
```
````

## File: modules/search/domain-services.md
````markdown
# search — Domain Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/search/domain-services.md`
- `../../../docs/ddd/search/aggregates.md`
````

## File: modules/search/domain/entities/WikiRagTypes.ts
````typescript
/**
 * Module: search
 * Layer: domain/entities
 * Purpose: Wiki-style RAG document and query result types — the
 *          lightweight RAG interface types used by the wiki UI components.
 *          Lives in search because RAG query/answer is a search-domain concern.
 */
export interface WikiCitation {
  provider?: "vector" | "search";
  chunk_id?: string;
  doc_id?: string;
  filename?: string;
  json_gcs_uri?: string;
  search_id?: string;
  score?: number;
  text?: string;
  account_id?: string;
  workspace_id?: string;
  taxonomy?: string;
  processing_status?: string;
  indexed_at?: string;
}
export interface WikiRagQueryResult {
  answer: string;
  citations: WikiCitation[];
  cache: "hit" | "miss";
  vectorHits: number;
  searchHits: number;
  accountScope: string;
  workspaceScope?: string;
  taxonomyFilters?: string[];
  maxAgeDays?: number;
  requireReady?: boolean;
}
export interface WikiParsedDocument {
  id: string;
  filename: string;
  workspaceId: string;
  sourceGcsUri: string;
  jsonGcsUri: string;
  pageCount: number;
  status: string;
  ragStatus: string;
  uploadedAt: Date | null;
}
export interface WikiReindexInput {
  accountId: string;
  docId: string;
  jsonGcsUri: string;
  sourceGcsUri: string;
  filename: string;
  pageCount: number;
}
````

## File: modules/search/interfaces/components/RagView.tsx
````typescript
import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  FileUp,
  Loader2,
  Pencil,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { DEV_DEMO_ACCOUNT_EMAIL } from "@/app/providers/dev-demo-auth";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { runWikiRagQuery, type WikiCitation } from "../../api";
import type { SourceLiveDocument as WikiLiveDocument } from "@/modules/source/api";
import { useDocumentsSnapshot } from "@/modules/source/api";
interface WikiRagViewProps {
  readonly onBack: () => void;
  readonly mode?: "all" | "query" | "reindex" | "documents";
  readonly workspaceId?: string;
  readonly showBackButton?: boolean;
}
⋮----
function formatDate(value: Date | null): string
function isRecord(value: unknown): value is Record<string, unknown>
function objectOrEmpty(value: unknown): Record<string, unknown>
function getErrorMessage(error: unknown): string
function StatusBadge(
⋮----
function RagBadge(
⋮----
async function handleAsk()
function buildUploadPath(accountId: string, file: File):
function handleFileChange(file: File | null)
async function handleUpload()
async function handleDelete(doc: WikiLiveDocument)
⋮----
// ignore storage-not-found
⋮----
// ignore storage-not-found
⋮----
async function handleRename(doc: WikiLiveDocument)
async function handleViewOriginal(doc: WikiLiveDocument)
⋮----
<Button onClick=
⋮----
onDragOver=
⋮----
onDrop=
````

## File: modules/search/README.md
````markdown
# search — 語意檢索上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/search/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`search` 是 NotebookLM-like 推理層的檢索核心，負責從向量索引與知識內容中擷取最相關的引用材料，為摘要、問答與洞察建立可追溯的語意上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 向量檢索 | 執行語意相似度搜尋與結果排序 |
| RAG Answer 組合 | 組合 retrieved chunks、引用與答案內容 |
| 反饋收集 | 記錄 RagQueryFeedback 以改進檢索品質 |

## 與其他 Bounded Context 協作

- `ai` 提供索引就緒資料；`notebook` 是主要消費者。
- `knowledge` 與 `wiki` 提供被檢索的知識主體與結構資訊。

## 核心聚合 / 核心概念

- **`RagQuery`**
- **`RagQueryFeedback`**
- **`VectorStore`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/search/repositories.md
````markdown
# search — Repositories

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagQueryFeedbackRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`
- `domain/repositories/WikiContentRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseRagQueryFeedbackRepository.ts`
- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/FirebaseWikiContentRepository.ts`
- `infrastructure/genkit/GenkitRagGenerationRepository.ts`
- `infrastructure/genkit/client.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/search/repositories.md`
- `../../../docs/ddd/search/aggregates.md`
````

## File: modules/search/ubiquitous-language.md
````markdown
# Ubiquitous Language — search

> **範圍：** 僅限 `modules/search/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| RAG 查詢 | RagQuery | 一次 Retrieval-Augmented Generation 查詢請求 |
| RAG 已檢索 Chunk | RagRetrievedChunk | 向量搜尋返回的單一相關文件片段（含相似度分數） |
| RAG 引用 | RagCitation | AI 答案引用的 chunk 來源資訊 |
| RAG 答案輸出 | AnswerRagQueryOutput | 包含生成答案文字與引用列表的輸出 |
| 查詢反饋 | RagQueryFeedback | 使用者對 RAG 答案品質的評分記錄 |
| 向量存儲 | VectorStore | 向量資料庫的 Hexagonal Port（IVectorStore 介面） |
| Wiki 引用 | WikiCitation | Wiki 整合 RAG 的引用格式（含 pageId、pageTitle） |
| 向量文件 | VectorDocument | 要索引至向量資料庫的文件記錄 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `RagQuery` | `SearchQuery`, `Query` |
| `RagRetrievedChunk` | `SearchResult`, `Chunk` |
| `RagCitation` | `Citation`, `Source` |
| `VectorStore` | `VectorDB`, `EmbeddingDB` |
````

## File: modules/shared/AGENT.md
````markdown
# AGENT.md — shared BC

## 模組定位

`shared` 是 Shared Kernel，提供所有 BC 共同依賴的最小基礎型別集。修改任何 shared/ 型別前，需確認所有消費方的影響。

## 最重要規則：DomainEvent 欄位名稱

```typescript
// ✅ 正確：occurredAt（ISO string）
interface MyEvent {
  readonly type: "module.action";
  readonly occurredAt: string;  // ISO 8601
}

// ❌ 錯誤：不存在 occurredAtISO 欄位
interface WrongEvent {
  readonly occurredAtISO: string;  // 不正確
}
```

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `DomainEvent` | BaseEvent, Event |
| `occurredAt` | occurredAtISO, timestamp（作為 DomainEvent 欄位） |
| `EventRecord` | AuditRecord（在此 BC 內） |

## 邊界規則

- `shared/` 內不放業務邏輯
- 只放多個 BC 都需要的最小型別
- 任何新增需要全域共識

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/shared/application-services.md
````markdown
# shared — Application Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件記錄 `shared` 的 application layer 服務與 use cases。內容與 `modules/shared/application/` 實作保持一致。

## Application Layer 職責

提供所有 bounded contexts 共用的最小型別與事件合約，是 Shared Kernel。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/publish-domain-event.ts`

## 設計對齊

- 模組 README：`../../../modules/shared/README.md`
- 模組 AGENT：`../../../modules/shared/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/shared/application-services.md`
````

## File: modules/shared/context-map.md
````markdown
# Context Map — shared

## Shared Kernel 的特殊地位

`shared` 不是普通的 Customer/Supplier 關係。它是 **Shared Kernel** 模式：

> 「兩個 Team 共同擁有一個小型共享模型，任何一方的修改都需要另一方的協調。」
> — Vaughn Vernon, IDDD

## 關係

所有 16 個 BC 都依賴 `shared/`，但這不是普通的依賴關係——它是**共同擁有的合約**：

```
modules/shared/
  ↑ import by all 16 BCs
```

## 規則

1. `shared/` 的任何變更（特別是 `DomainEvent` 介面）都必須同步更新所有消費方
2. 不允許任何 BC 反向依賴（shared/ 不 import 任何 BC）
3. `shared/` 只包含所有 BC 都認可的最小公共型別

## IDDD 整合模式

| 關係 | 模式 |
|------|------|
| shared ← 所有 BC | Shared Kernel |
````

## File: modules/shared/domain-events.md
````markdown
# Domain Events — shared

## 說明

`shared` 是 Shared Kernel，本身不發出或訂閱業務領域事件。

它提供的是**所有 BC 發出事件所需的基礎介面**：

```typescript
// 所有模組的領域事件都遵循此結構
interface DomainEvent {
  readonly type: string;        // "module.entity.action" 格式
  readonly occurredAt: string;  // ISO 8601
}
```

## 事件命名規範（全域）

| 規則 | 範例 |
|------|------|
| 格式 | `<module>.<entity>.<action>` 或 `<module>.<action>` |
| 大小寫 | 全小寫，底線分隔 |
| 時態 | **過去式**（代表已發生的事實） |

```typescript
// ✅ 正確命名
"knowledge.page_created"
"workspace.member_joined"
"workspace-flow.task_status_changed"

// ❌ 錯誤命名
"CreatePage"         // 現在式、大寫
"PageCreatedEvent"   // 有 Event 後綴
```
````

## File: modules/shared/domain-services.md
````markdown
# shared — Domain Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/shared/domain-services.md`
- `../../../docs/ddd/shared/aggregates.md`
````

## File: modules/shared/README.md
````markdown
# shared — 共享核心上下文

> **Domain Type:** Shared Kernel  
> **模組路徑:** `modules/shared/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`shared` 不是獨立業務能力，而是多個 bounded context 共同依賴的 Shared Kernel。它提供穩定共享的事件、值物件與工具型別，目標是減少重複而不形成隱性大泥球。

## 主要職責

| 能力 | 說明 |
|---|---|
| 共享型別 | 提供跨模組穩定共用的事件與值物件基礎型別 |
| 事件基礎語意 | 維持 `DomainEvent`、`EventRecord` 等跨域契約一致 |
| 工具與通用值物件 | 提供 slug、識別碼與其他低變動共享能力 |

## 與其他 Bounded Context 協作

- 所有上下文都可能依賴 `shared`，但只能消費穩定共享核心，不能把業務邏輯堆入此模組。
- `shared` 的變更需視為跨域契約變更處理。

## 核心聚合 / 核心概念

- **`DomainEvent`**
- **`EventRecord`**
- **`SlugUtils`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/shared/repositories.md
````markdown
# shared — Repositories

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/InMemoryEventStoreRepository.ts`
- `infrastructure/NoopEventBusRepository.ts`
- `infrastructure/SimpleEventBus.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/shared/repositories.md`
- `../../../docs/ddd/shared/aggregates.md`
````

## File: modules/shared/ubiquitous-language.md
````markdown
# Ubiquitous Language — shared

> **範圍：** 跨所有 BC 的共享基礎術語（Shared Kernel）

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 領域事件 | DomainEvent | 所有領域事件的基礎介面，含 `type` 和 `occurredAt` | `modules/shared/domain/events.ts` |
| 事件記錄 | EventRecord | 稽核/追蹤用的事件記錄（`eventId`, `occurredAt`, `actorId`） | `modules/shared/domain/event-record.ts` |
| 發生時間 | occurredAt | 事件發生時間，**ISO 8601 字串**格式（非 Date 物件） | `DomainEvent.occurredAt` |
| Slug | Slug | URL-safe 的識別符字串 | `modules/shared/domain/slug-utils.ts` |

## 關鍵規則

`occurredAt` 必須是 **ISO 8601 字串**（`string`），不是 `Date`、`Timestamp` 或數字。所有繼承 `DomainEvent` 的事件介面都必須遵守此規範。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `occurredAt` | `occurredAtISO`, `timestamp`, `createdAt`（作為事件時間戳） |
| `DomainEvent` | `BaseEvent`, `Event` |
````

## File: modules/source/AGENT.md
````markdown
# AGENT.md — source BC

## 模組定位

`source` 是文件來源的支援域，負責上傳生命週期、版本快照與 RAG 文件登記。是 RAG ingestion pipeline 的業務入口。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `SourceDocument` | File、Document、Asset、Attachment |
| `WikiLibrary` | Library、Folder、Collection |
| `FileVersion` | Version、Snapshot、Revision |
| `RagDocument` | RagFile、IngestionDoc |
| `RetentionPolicy` | Policy、ExpiryRule |
| `AuditRecord` | Log、Event、History |
| `ActorContext` | User、CurrentUser |
| `IngestionHandoff` | Trigger、Signal |

## 邊界規則

### ✅ 允許
```typescript
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, WikiLibraryDTO } from "@/modules/source/api";
```

### ❌ 禁止
```typescript
import { File } from "@/modules/source/domain/entities/File";
```

## Firestore Timestamp 規則

```typescript
// ✅ 安全的調用方式
const date = (value.toDate as () => unknown)() as Date;

// ❌ 禁止解構賦值
const { toDate } = value; toDate(); // 'this' binding 失效
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/source/aggregates.md
````markdown
# Aggregates — source

## 聚合根：SourceDocument（File.ts）

### 職責
管理文件的上傳生命週期，從上傳初始化到完成確認，以及版本快照與保留政策。

### 生命週期狀態機
```
pending_upload ──[upload_complete]──► uploaded ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `name` | `string` | 檔案名稱 |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string \| null` | 所屬工作區 |
| `status` | `FileStatus` | `pending_upload \| uploaded \| archived` |
| `versions` | `FileVersion[]` | 版本列表 |
| `retentionPolicy` | `RetentionPolicy \| null` | 保留政策 |
| `permissionSnapshot` | `PermissionSnapshot` | 上傳時授權快照 |

---

## 聚合根：WikiLibrary

### 職責
RAG 文件的邏輯集合容器，對應使用者在 UI 看到的「知識庫」概念。

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `FileVersion` | 版本快照（versionId, fileUrl, createdAt） |
| `RetentionPolicy` | 保留規則（retainDays, deleteAfterExpiry） |
| `PermissionSnapshot` | 上傳時的授權快照（不可變） |
| `AuditRecord` | 操作稽核記錄（append-only） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `ActorContextPort` | 解析操作者身分與授權 |
| `OrganizationPolicyPort` | 查詢組織層級政策 |
| `WorkspaceGrantPort` | 驗證工作區授權 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `FileRepository` | `save()`, `findById()`, `listByWorkspace()` |
| `RagDocumentRepository` | `save()`, `findByDocumentId()` |
| `WikiLibraryRepository` | `save()`, `findByWorkspaceId()` |
````

## File: modules/source/application-services.md
````markdown
# source — Application Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `source` 的 application layer 服務與 use cases。內容與 `modules/source/application/` 實作保持一致。

## Application Layer 職責

管理文件上傳生命週期、版本快照與 RAG 文件登記。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/file.dto.ts`
- `application/dto/rag-document.dto.ts`
- `application/index.ts`
- `application/use-cases/list-workspace-files.use-case.ts`
- `application/use-cases/register-uploaded-rag-document.use-case.ts`
- `application/use-cases/upload-complete-file.use-case.ts`
- `application/use-cases/upload-init-file.use-case.ts`
- `application/use-cases/wiki-libraries.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/source/README.md`
- 模組 AGENT：`../../../modules/source/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/source/application-services.md`
````

## File: modules/source/application/use-cases/wiki-libraries.use-case.ts
````typescript
/**
 * Module: source
 * Layer: application/use-cases
 * Purpose: Wiki-style library use-cases — create, add fields, add rows, list.
 *          Direct-function API for the source module's wiki-facing library
 *          management surface.
 */
import {
  InMemoryEventStoreRepository,
  NoopEventBusRepository,
  PublishDomainEventUseCase,
  deriveSlugCandidate,
  isValidSlug,
} from "@/modules/shared/api";
import type {
  AddWikiLibraryFieldInput,
  CreateWikiLibraryInput,
  CreateWikiLibraryRowInput,
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../../domain/entities/wiki-library.types";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";
⋮----
function generateId(): string
function normalizeName(name: string): string
function normalizeFieldKey(key: string): string
function ensureUniqueLibrarySlug(baseSlug: string, libraries: WikiLibrary[]): string
export async function listWikiLibraries(
  accountId: string,
  workspaceId: string | undefined,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary[]>
export async function createWikiLibrary(
  input: CreateWikiLibraryInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrary>
export async function addWikiLibraryField(
  input: AddWikiLibraryFieldInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryField>
export async function createWikiLibraryRow(
  input: CreateWikiLibraryRowInput,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibraryRow>
export interface WikiLibrarySnapshot {
  library: WikiLibrary;
  fields: WikiLibraryField[];
  rows: WikiLibraryRow[];
}
export async function getWikiLibrarySnapshot(
  accountId: string,
  libraryId: string,
  libraryRepository: WikiLibraryRepository,
): Promise<WikiLibrarySnapshot>
````

## File: modules/source/context-map.md
````markdown
# Context Map — source

## 上游（依賴）

### identity → source（Customer/Supplier）
- `ActorContextPort` 透過 `identity/api` 驗證上傳者身分

### workspace → source（Customer/Supplier）
- 文件隸屬 `workspaceId`，需透過 `WorkspaceGrantPort` 驗證授權

### organization → source（Customer/Supplier）
- `OrganizationPolicyPort` 解算組織層級保留政策

---

## 下游（被依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 域建立 IngestionJob
- **Runtime 邊界**：Next.js 端執行 upload-init/complete；`py_fn/` 執行 Embedding

### source → knowledge（Published Language）

- 文件關聯知識頁面時通知 `knowledge` 域

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → source | identity | source | Customer/Supplier（Port） |
| workspace → source | workspace | source | Customer/Supplier（Port） |
| organization → source | organization | source | Customer/Supplier（Port） |
| source → ai | source | ai | Published Language (Events) |
| source → knowledge | source | knowledge | Published Language (Events) |
````

## File: modules/source/domain-events.md
````markdown
# Domain Events — source

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `source.upload_initiated` | upload-init 完成、簽名 URL 已產生 | `documentId`, `workspaceId`, `actorId`, `occurredAt` |
| `source.upload_completed` | upload-complete 確認完成 | `documentId`, `workspaceId`, `occurredAt` |
| `source.rag_document_registered` | RagDocument 成功登記進入攝入管線 | `documentId`, `ragDocumentId`, `occurredAt` |
| `source.file_archived` | 文件被封存 | `documentId`, `actorId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace` | `workspace.created` | 初始化工作區的 WikiLibrary |
| `identity` | `TokenRefreshSignal` | 更新 ActorContext 授權快照 |

## 消費 source 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `ai` | `source.upload_completed` | 建立 IngestionJob，啟動 RAG 攝入管線 |
| `knowledge` | `source.upload_completed` | 文件關聯知識頁面通知（可選） |
````

## File: modules/source/domain-services.md
````markdown
# source — Domain Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/complete-upload-file.ts`
- `domain/services/resolve-file-organization-id.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/source/domain-services.md`
- `../../../docs/ddd/source/aggregates.md`
````

## File: modules/source/domain/entities/wiki-library.types.ts
````typescript
/**
 * Module: source
 * Layer: domain/entities
 * Purpose: Wiki-style library entity — lightweight structured-data model
 *          used by the wiki interfaces.
 *          Lives in source because libraries are a source/database-resource concern.
 */
export type WikiLibraryStatus = "active" | "archived";
export type WikiLibraryFieldType = "title" | "text" | "number" | "select" | "relation";
export interface WikiLibrary {
  id: string;
  accountId: string;
  workspaceId?: string;
  name: string;
  slug: string;
  status: WikiLibraryStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface WikiLibraryField {
  id: string;
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required: boolean;
  options?: string[];
  createdAt: Date;
}
export interface WikiLibraryRow {
  id: string;
  libraryId: string;
  values: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateWikiLibraryInput {
  accountId: string;
  workspaceId?: string;
  name: string;
}
export interface AddWikiLibraryFieldInput {
  accountId: string;
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required?: boolean;
  options?: string[];
}
export interface CreateWikiLibraryRowInput {
  accountId: string;
  libraryId: string;
  values: Record<string, unknown>;
}
````

## File: modules/source/infrastructure/firebase/FirebaseWikiLibraryRepository.ts
````typescript
/**
 * Module: source
 * Layer: infrastructure/firebase
 * Purpose: Firestore-backed implementation of WikiLibraryRepository.
 *
 * Paths:
 *   accounts/{accountId}/wikiLibraries/{libraryId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/fields/{fieldId}
 *   accounts/{accountId}/wikiLibraries/{libraryId}/rows/{rowId}
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
} from "../../domain/entities/wiki-library.types";
import type { WikiLibraryRepository } from "../../domain/repositories/WikiLibraryRepository";
// ── Firestore document shapes (ISO dates to avoid Timestamp serialisation issues) ──
interface FsLibrary {
  accountId: string;
  workspaceId?: string;
  name: string;
  slug: string;
  status: WikiLibraryStatus;
  createdAtISO: string;
  updatedAtISO: string;
}
interface FsField {
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required: boolean;
  options?: string[];
  createdAtISO: string;
}
interface FsRow {
  libraryId: string;
  values: Record<string, unknown>;
  createdAtISO: string;
  updatedAtISO: string;
}
// ── Path helpers ──────────────────────────────────────────────────────────────
function librariesCol(db: ReturnType<typeof getFirestore>, accountId: string)
function libraryDoc(db: ReturnType<typeof getFirestore>, accountId: string, libraryId: string)
function fieldsCol(db: ReturnType<typeof getFirestore>, accountId: string, libraryId: string)
function fieldDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  libraryId: string,
  fieldId: string,
)
function rowsCol(db: ReturnType<typeof getFirestore>, accountId: string, libraryId: string)
function rowDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  libraryId: string,
  rowId: string,
)
// ── Mappers ───────────────────────────────────────────────────────────────────
function toLibrary(id: string, data: FsLibrary): WikiLibrary
function toField(id: string, data: FsField): WikiLibraryField
function toRow(id: string, data: FsRow): WikiLibraryRow
// ── Repository implementation ─────────────────────────────────────────────────
export class FirebaseWikiLibraryRepository implements WikiLibraryRepository {
⋮----
private db()
async listByAccountId(accountId: string): Promise<WikiLibrary[]>
async findById(accountId: string, libraryId: string): Promise<WikiLibrary | null>
async create(library: WikiLibrary): Promise<void>
async createField(accountId: string, field: WikiLibraryField): Promise<void>
async listFields(accountId: string, libraryId: string): Promise<WikiLibraryField[]>
async createRow(accountId: string, row: WikiLibraryRow): Promise<void>
async listRows(accountId: string, libraryId: string): Promise<WikiLibraryRow[]>
````

## File: modules/source/interfaces/components/SourceDocumentsView.tsx
````typescript
import { useRef, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileUp,
  Loader2,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/app/providers/app-provider";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import type { SourceLiveDocument } from "../hooks/useDocumentsSnapshot";
import { useDocumentsSnapshot } from "../hooks/useDocumentsSnapshot";
⋮----
function StatusBadge(
⋮----
function RagBadge(
function formatDate(value: Date | null): string
interface SourceDocumentsViewProps {
  readonly workspaceId?: string;
}
/** Upload dropzone + real-time document list backed by Firebase onSnapshot. */
⋮----
function handleFileChange(file: File | null)
async function handleUpload()
async function handleDelete(doc: SourceLiveDocument)
⋮----
try { await storageApi.deleteObject(storageApi.ref(storage, uri)); } catch { /* ignore */ }
⋮----
async function handleRename(doc: SourceLiveDocument)
async function handleViewOriginal(doc: SourceLiveDocument)
⋮----
{/* Upload dropzone */}
⋮----
onDragOver=
⋮----
onDrop=
⋮----
onChange=
⋮----
onClick=
⋮----
{/* Document list */}
````

## File: modules/source/interfaces/hooks/useDocumentsSnapshot.ts
````typescript
import { useCallback, useEffect, useRef, useState } from "react";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
// ─── Standalone document types (owned by source module) ──────────────────────
export interface SourceDocument {
  readonly id: string;
  readonly filename: string;
  readonly workspaceId: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly status: string;
  readonly ragStatus: string;
  readonly uploadedAt: Date | null;
}
export interface SourceLiveDocument extends SourceDocument {
  readonly errorMessage: string;
  readonly ragError: string;
  readonly isClientPending?: boolean;
}
export type AssetDocument = SourceDocument;
export type AssetLiveDocument = SourceLiveDocument;
// ─── Internal helpers ─────────────────────────────────────────────────────────
function isRecord(value: unknown): value is Record<string, unknown>
function objectOrEmpty(value: unknown): Record<string, unknown>
function toDateOrNull(value: unknown): Date | null
⋮----
// fall through
⋮----
// fall through
⋮----
function resolveFilename(data: Record<string, unknown>): string
export function mapToSourceLiveDocument(id: string, data: Record<string, unknown>): SourceLiveDocument
⋮----
const n = (v: unknown)
⋮----
// ─── Hook ─────────────────────────────────────────────────────────────────────
export interface UseDocumentsSnapshotResult {
  readonly docs: SourceLiveDocument[];
  readonly loading: boolean;
  readonly pendingDocs: SourceLiveDocument[];
  readonly addPending: (doc: SourceLiveDocument) => void;
  readonly removePending: (id: string) => void;
}
/** Subscribes to Firestore `accounts/{accountId}/documents` in real time via onSnapshot. */
export function useDocumentsSnapshot(
  accountId: string,
  workspaceId?: string,
): UseDocumentsSnapshotResult
````

## File: modules/source/repositories.md
````markdown
# source — Repositories

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/FileRepository.ts`
- `domain/repositories/RagDocumentRepository.ts`
- `domain/repositories/WikiLibraryRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseFileRepository.ts`
- `infrastructure/firebase/FirebaseRagDocumentRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/in-memory-wiki-library.repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/source/repositories.md`
- `../../../docs/ddd/source/aggregates.md`
````

## File: modules/source/ubiquitous-language.md
````markdown
# Ubiquitous Language — source

> **範圍：** 僅限 `modules/source/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 來源文件 | SourceDocument | 上傳的原始文件聚合根（對應 File.ts） |
| 知識庫 | WikiLibrary | RAG 文件的邏輯集合容器 |
| 檔案版本 | FileVersion | SourceDocument 的版本快照 |
| RAG 文件 | RagDocument | 已登記進入 RAG 管線的文件記錄 |
| 授權快照 | PermissionSnapshot | 上傳時的授權狀態快照（不可變） |
| 保留政策 | RetentionPolicy | 文件的保留期限與刪除規則 |
| 稽核記錄 | AuditRecord | 文件操作的不可變稽核軌跡 |
| 攝入交付 | IngestionHandoff | 上傳完成後交付 py_fn worker 的觸發信號 |
| 演員上下文 | ActorContext | 操作者身分與授權上下文（透過 ActorContextPort） |
| 工作區授權 | WorkspaceGrant | 工作區層級的授權快照（透過 WorkspaceGrantPort） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `SourceDocument` | `File`, `Document`, `Asset` |
| `WikiLibrary` | `Library`, `Folder`, `Collection` |
| `RetentionPolicy` | `Policy`, `LifecycleRule` |
````

## File: modules/system.ts
````typescript
/**
 * modules/system.ts — Composition Root
 *
 * Architecture Phase 3: Interface Wiring
 *
 * Initialises and wires the singleton instances that power the
 * Content → EventBus demo loop.
 *
 * Responsibilities:
 *   1. Create the shared SimpleEventBus.
 *   2. Create KnowledgeApi (injected with the event bus).
 *
 * All state lives here — never in page files or global variables.
 *
 * MDDD boundary rule:
 *   Imports only from the api/ barrel of each module and from
 *   shared/infrastructure.  Never reaches into domain/, application/,
 *   or infrastructure/ layers of other modules.
 */
import { SimpleEventBus } from "./shared/infrastructure/SimpleEventBus";
import { KnowledgeApi } from "./knowledge/api/knowledge-api";
// ── Shared account used by the in-memory demo ──────────────────────────────
⋮----
// ── Singleton instances ────────────────────────────────────────────────────
````

## File: modules/workspace-audit/AGENT.md
````markdown
# AGENT.md — workspace-audit BC

## 模組定位

`workspace-audit` 是稽核紀錄支援域，維護 Append-Only 的 AuditLog，查詢工作區與組織稽核軌跡。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `AuditLog` | Log、Record、History、ActivityLog |
| `auditEventType` | EventType、ActionType |
| `actorId` | UserId、PerformerId |
| `workspaceId` / `organizationId` | Scope（作為稽核範圍） |

## 最重要規則：Append-Only

```typescript
// ✅ 只允許追加新記錄
await auditRepository.append(newAuditLog);

// ❌ 禁止修改或刪除
await auditRepository.update(id, changes);  // 違反 Append-Only
await auditRepository.delete(id);           // 違反 Append-Only
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditLogDTO } from "@/modules/workspace-audit/api";
```

### ❌ 禁止
```typescript
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-audit/aggregates.md
````markdown
# Aggregates — workspace-audit

## 聚合根：AuditLog（Append-Only）

### 職責
記錄工作區或組織範圍內重要操作的不可變稽核軌跡。一旦寫入，永不修改或刪除。

### Append-Only 約束

> **核心不變數：** AuditLog 只能被建立，不能被更新或刪除。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 記錄主鍵（UUID） |
| `workspaceId` | `string \| null` | 所屬工作區（可選，組織級記錄可能無 workspaceId） |
| `organizationId` | `string` | 所屬組織 |
| `actorId` | `string` | 操作者帳戶 ID |
| `auditEventType` | `string` | 操作類型（如 `workspace.member_joined`） |
| `targetId` | `string \| null` | 操作對象 ID（可選） |
| `targetType` | `string \| null` | 操作對象類型（可選） |
| `metadata` | `Record<string, unknown>` | 附加資訊 |
| `auditedAt` | `string` | ISO 8601 操作時間 |

### 不變數

- `id` 建立後不可變
- `auditedAt` 使用記錄建立時的系統時間，不可後期修改
- 所有欄位建立後均不可修改（immutable record）

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AuditLogRepository` | `append()`, `listByWorkspace()`, `listByOrganization()` |

**注意：** `AuditLogRepository` 不提供 `update()` 或 `delete()` 方法，強制執行 Append-Only。
````

## File: modules/workspace-audit/application-services.md
````markdown
# workspace-audit — Application Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-audit` 的 application layer 服務與 use cases。內容與 `modules/workspace-audit/application/` 實作保持一致。

## Application Layer 職責

以 append-only 模式記錄工作區與組織範圍內的重要稽核軌跡。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/.gitkeep`
- `application/use-cases/audit.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-audit/README.md`
- 模組 AGENT：`../../../modules/workspace-audit/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-audit/application-services.md`
````

## File: modules/workspace-audit/context-map.md
````markdown
# Context Map — workspace-audit

## 上游（依賴）

`workspace-audit` 訂閱所有業務 BC 的事件，但**不依賴**任何 BC 的 api。它是純事件消費者。

```
所有業務 BC ──[Domain Events]──► workspace-audit（Terminal Sink）
```

### 主要事件來源

| 來源 BC | 整合模式 |
|---------|---------|
| `workspace` | Published Language（被動消費） |
| `organization` | Published Language（被動消費） |
| `workspace-flow` | Published Language（被動消費） |
| `workspace-scheduling` | Published Language（被動消費） |
| `source` | Published Language（被動消費） |
| `ai` | Published Language（被動消費） |

---

## 下游（被依賴）

### workspace-audit → WorkspaceDetailScreen（Interfaces）

- `workspace-audit/api` 提供稽核查詢 API 給 `workspace` 的 WorkspaceDetailScreen tab

---

## Terminal Sink 原則

`workspace-audit` 是事件消費的**終點**，不向其他 BC 發出事件。業務流程不應等待或依賴稽核記錄的完成。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| 所有 BC → workspace-audit | 各 BC | workspace-audit | Published Language (Terminal Sink) |
| workspace-audit → workspace UI | workspace-audit | app/ | Customer/Supplier（查詢） |
````

## File: modules/workspace-audit/domain-events.md
````markdown
# Domain Events — workspace-audit

## 發出事件

`workspace-audit` 不發出 DomainEvent。它是事件的**最終消費者（Terminal Sink）**，不產生進一步的業務事件。

## 訂閱事件（消費端）

`workspace-audit` 訂閱所有需要留下稽核軌跡的業務事件：

| 來源 BC | 訂閱事件 | AuditLog.auditEventType |
|---------|---------|------------------------|
| `workspace` | `workspace.created` | `workspace.created` |
| `workspace` | `workspace.member_joined` | `workspace.member_joined` |
| `workspace` | `workspace.archived` | `workspace.archived` |
| `organization` | `organization.member_joined` | `organization.member_joined` |
| `organization` | `organization.member_removed` | `organization.member_removed` |
| `workspace-flow` | `workspace-flow.task_status_changed` | `task.status_changed` |
| `workspace-flow` | `workspace-flow.invoice_paid` | `invoice.paid` |
| `workspace-scheduling` | `workspace-scheduling.demand_status_changed` | `demand.status_changed` |
| `source` | `source.upload_completed` | `document.uploaded` |
| `ai` | `ai.ingestion_completed / failed` | `ingestion.completed / failed` |

## 說明

稽核模組是事件消費的「終點站」。業務 BC 不應依賴稽核模組的狀態，稽核只做記錄，不影響業務流程。
````

## File: modules/workspace-audit/domain-services.md
````markdown
# workspace-audit — Domain Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-audit/domain-services.md`
- `../../../docs/ddd/workspace-audit/aggregates.md`
````

## File: modules/workspace-audit/README.md
````markdown
# workspace-audit — 工作區稽核上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-audit/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-audit` 是工作區治理的追溯層，透過 append-only 稽核紀錄保存重要操作的事後可查性。它不是直接創造知識價值的核心域，但對信任、治理與合規至關重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 稽核寫入 | 接收重要行為或事件並追加紀錄 |
| 稽核查詢 | 依工作區或組織範圍提供可查詢的 audit trail |
| 治理可見性 | 支援事後追查、責任歸屬與決策證據 |

## 與其他 Bounded Context 協作

- `workspace` 與 `organization` 提供查詢與可見性範圍。
- `workspace-flow`、`workspace-feed` 與其他上下文可作為稽核事件來源。

## 核心聚合 / 核心概念

- **`AuditLog`**
- **`AuditActor`**
- **`AuditScope`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-audit/repositories.md
````markdown
# workspace-audit — Repositories

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AuditRepository.ts`

## Infrastructure Implementations

- `infrastructure/.gitkeep`
- `infrastructure/firebase/FirebaseAuditRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-audit/repositories.md`
- `../../../docs/ddd/workspace-audit/aggregates.md`
````

## File: modules/workspace-audit/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-audit

> **範圍：** 僅限 `modules/workspace-audit/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 稽核記錄 | AuditLog | 一條不可變的操作紀錄（Append-Only，永不修改） |
| 稽核事件類型 | auditEventType | 記錄的操作類型字串（如 `workspace.member_joined`） |
| 操作者 ID | actorId | 執行此操作的帳戶 ID |
| 稽核範圍 | auditScope | 此記錄的範圍（workspace 或 organization） |
| 稽核時間 | auditedAt | 操作發生時間，ISO 8601 |
| 元資料 | metadata | 操作的附加資訊（JSON，可選） |

## Append-Only 原則

`AuditLog` 一旦寫入即不可更改。任何試圖修改或刪除 AuditLog 的操作都違反此域的核心不變數。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `AuditLog` | `Log`, `Record`, `History` |
| `actorId` | `userId`, `performerId` |
| `auditedAt` | `timestamp`, `createdAt`（在稽核上下文中） |
````

## File: modules/workspace-feed/AGENT.md
````markdown
# AGENT.md — workspace-feed BC

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkspaceFeedPost` | Post、Tweet、Message |
| `WorkspaceFeedPostType` | Type、PostType |
| `authorAccountId` | authorId、userId |

## 邊界規則

```typescript
// ✅
import { workspaceFeedApi } from "@/modules/workspace-feed/api";
// ❌
import { WorkspaceFeedPost } from "@/modules/workspace-feed/domain/entities/WorkspaceFeedPost";
```
````

## File: modules/workspace-feed/aggregates.md
````markdown
# Aggregates — workspace-feed

## 聚合根：WorkspaceFeedPost

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 貼文主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `authorAccountId` | `string` | 作者帳戶 ID |
| `type` | `WorkspaceFeedPostType` | `post \| reply \| repost` |
| `content` | `string` | 貼文內容 |
| `replyToPostId` | `string \| null` | 回覆目標 |
| `repostOfPostId` | `string \| null` | 轉貼目標 |
| `likeCount` | `number` | 按讚數 |
| `viewCount` | `number` | 瀏覽數 |

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceFeedRepository` | `save()`, `findById()`, `listByWorkspace()` |
````

## File: modules/workspace-feed/application-services.md
````markdown
# workspace-feed — Application Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-feed` 的 application layer 服務與 use cases。內容與 `modules/workspace-feed/application/` 實作保持一致。

## Application Layer 職責

管理工作區的社交動態貼文與互動事件。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/workspace-feed.dto.ts`
- `application/use-cases/workspace-feed.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-feed/README.md`
- 模組 AGENT：`../../../modules/workspace-feed/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-feed/application-services.md`
````

## File: modules/workspace-feed/context-map.md
````markdown
# Context Map — workspace-feed

## 上游（依賴）

### workspace → workspace-feed（Conformist）

- `WorkspaceFeedPost.workspaceId` 隸屬工作區

## 下游（被依賴）

### workspace-feed → notification（Published Language）

- `WorkspaceFeedPostCreated` 可觸發通知

### workspace-feed → workspace-audit（Published Language）

- 貼文操作記錄稽核軌跡

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
| workspace-feed → notification | workspace-feed | notification | Published Language |
| workspace-feed → workspace-audit | workspace-feed | workspace-audit | Published Language |
````

## File: modules/workspace-feed/domain-events.md
````markdown
# Domain Events — workspace-feed

## 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `WorkspaceFeedPostCreated` | 新貼文發布 |
| `WorkspaceFeedReplyCreated` | 回覆發布 |
| `WorkspaceFeedRepostCreated` | 轉貼發布 |
| `WorkspaceFeedPostLiked` | 按讚 |
| `WorkspaceFeedPostViewed` | 瀏覽 |
| `WorkspaceFeedPostBookmarked` | 收藏 |
| `WorkspaceFeedPostShared` | 分享 |

所有事件繼承 `WorkspaceFeedBaseEvent`（`accountId`, `workspaceId`, `postId`, `actorAccountId`, `occurredAtISO`）。

## 訂閱事件

`workspace-feed` 不訂閱其他 BC 的事件。
````

## File: modules/workspace-feed/domain-services.md
````markdown
# workspace-feed — Domain Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-feed/domain-services.md`
- `../../../docs/ddd/workspace-feed/aggregates.md`
````

## File: modules/workspace-feed/README.md
````markdown
# workspace-feed — 工作區動態上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-feed/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-feed` 是工作區的動態流與互動層，把知識、任務與協作事件轉成團隊可感知的貼文、回覆與互動紀錄。它提升知識平台的協作流動性與可見性。

## 主要職責

| 能力 | 說明 |
|---|---|
| 動態貼文 | 管理 post / reply / repost 等工作區動態內容 |
| 互動紀錄 | 記錄 like / view / bookmark / share 等互動 |
| 事件可見化 | 把協作行為轉成工作區成員可追蹤的活動流 |

## 與其他 Bounded Context 協作

- `workspace` 提供動態的歸屬邊界。
- `workspace-flow`、`knowledge`、`notification` 可與動態流形成聯動。

## 核心聚合 / 核心概念

- **`WorkspaceFeedPost`**
- **`FeedReaction`**
- **`FeedThread`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-feed/repositories.md
````markdown
# workspace-feed — Repositories

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/workspace-feed.repositories.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts`
- `infrastructure/index.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-feed/repositories.md`
- `../../../docs/ddd/workspace-feed/aggregates.md`
````

## File: modules/workspace-feed/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-feed

| 術語 | 英文 | 定義 |
|------|------|------|
| 動態貼文 | WorkspaceFeedPost | 工作區社交動態貼文（post / reply / repost） |
| 貼文類型 | WorkspaceFeedPostType | `"post" \| "reply" \| "repost"` |
| 作者帳戶 ID | authorAccountId | 發文者帳戶 ID |
| 回覆目標 | replyToPostId | 此貼文回覆的原貼文 ID |
| 轉貼目標 | repostOfPostId | 此貼文轉貼的原貼文 ID |
````

## File: modules/workspace-flow/AGENT.md
````markdown
# AGENT.md — workspace-flow BC

## 模組定位

`workspace-flow` 是工作流程狀態機支援域，管理 Task/Issue/Invoice 三條業務線，並透過 ContentToWorkflowMaterializer 訂閱 knowledge 事件。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Task` | TodoItem、WorkItem |
| `TaskStatus` | Status（單獨使用）、State |
| `Issue` | Bug、Ticket、Problem |
| `IssueStatus` | Status（單獨使用） |
| `Invoice` | Bill、Receipt、Payment |
| `InvoiceStatus` | Status（單獨使用） |
| `MaterializedTask` | ConvertedTask、AutoTask |
| `sourceReference` | Origin、Source（作為物化來源） |
| `ContentToWorkflowMaterializer` | ContentProcessor、PageConverter |

## 狀態機（必須嚴格遵守）

```
TaskStatus:    draft → in_progress → qa → acceptance → accepted → archived
IssueStatus:   open → investigating → fixing → retest → resolved → closed
InvoiceStatus: draft → submitted → finance_review → approved → paid → closed
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceFlowApi } from "@/modules/workspace-flow/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
```

### ❌ 禁止
```typescript
import { Task } from "@/modules/workspace-flow/domain/entities/Task";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-flow/aggregates.md
````markdown
# Aggregates — workspace-flow

## 聚合根：Task

### 職責
可追蹤的工作單元，管理完整的任務生命週期狀態機。

### 生命週期狀態機
```
draft ──► in_progress ──► qa ──► acceptance ──► accepted ──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Task 主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `title` | `string` | 任務標題 |
| `status` | `TaskStatus` | 當前狀態 |
| `assigneeId` | `string \| null` | 負責人帳戶 ID |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `sourceReference` | `SourceReference \| null` | 物化來源（pageId, causationId） |
| `currentUserId` | `string` | 當前操作者 ID |

---

## 聚合根：Issue

### 生命週期狀態機
```
open ──► investigating ──► fixing ──► retest ──► resolved ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId`, `title` | 基本屬性 |
| `status` | `IssueStatus` |
| `severity` | `IssueStatus` 嚴重程度 |
| `reporterId` | 報告者帳戶 ID |
| `assigneeId` | 負責人帳戶 ID（可選） |

---

## 聚合根：Invoice

### 生命週期狀態機
```
draft ──► submitted ──► finance_review ──► approved ──► paid ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId` | 基本屬性 |
| `status` | `InvoiceStatus` |
| `amount` | `number` |
| `currency` | `string`（預設 "TWD"） |
| `sourceReference` | 物化來源（可選） |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `TaskStatus` | `"draft" \| "in_progress" \| "qa" \| "acceptance" \| "accepted" \| "archived"` |
| `IssueStatus` | `"open" \| "investigating" \| "fixing" \| "retest" \| "resolved" \| "closed"` |
| `InvoiceStatus` | `"draft" \| "submitted" \| "finance_review" \| "approved" \| "paid" \| "closed"` |
| `SourceReference` | `{ pageId: string, causationId: string }` |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `TaskRepository` | Task CRUD + 狀態查詢 |
| `IssueRepository` | Issue CRUD + 狀態查詢 |
| `InvoiceRepository` | Invoice CRUD + 狀態查詢 |

---

## Domain Services

| 服務 | 說明 |
|------|------|
| `ContentToWorkflowMaterializer` | Process Manager：訂閱 `knowledge.page_approved`，建立 MaterializedTask 和 Invoice |
````

## File: modules/workspace-flow/application-services.md
````markdown
# workspace-flow — Application Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-flow` 的 application layer 服務與 use cases。內容與 `modules/workspace-flow/application/` 實作保持一致。

## Application Layer 職責

管理 Task / Issue / Invoice 三條工作流程狀態機與流程物化。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/add-invoice-item.dto.ts`
- `application/dto/create-task.dto.ts`
- `application/dto/invoice-query.dto.ts`
- `application/dto/issue-query.dto.ts`
- `application/dto/materialize-from-content.dto.ts`
- `application/dto/open-issue.dto.ts`
- `application/dto/pagination.dto.ts`
- `application/dto/remove-invoice-item.dto.ts`
- `application/dto/resolve-issue.dto.ts`
- `application/dto/task-query.dto.ts`
- `application/dto/update-invoice-item.dto.ts`
- `application/dto/update-task.dto.ts`
- `application/ports/InvoiceService.ts`
- `application/ports/IssueService.ts`
- `application/ports/TaskService.ts`
- `application/process-managers/content-to-workflow-materializer.ts`
- `application/use-cases/add-invoice-item.use-case.ts`
- `application/use-cases/approve-invoice.use-case.ts`
- `application/use-cases/approve-task-acceptance.use-case.ts`
- `application/use-cases/archive-task.use-case.ts`
- `application/use-cases/assign-task.use-case.ts`
- `application/use-cases/close-invoice.use-case.ts`
- `application/use-cases/close-issue.use-case.ts`
- `application/use-cases/create-invoice.use-case.ts`
- `application/use-cases/create-task.use-case.ts`
- `application/use-cases/fail-issue-retest.use-case.ts`
- `application/use-cases/fix-issue.use-case.ts`
- `application/use-cases/materialize-tasks-from-content.use-case.ts`
- `application/use-cases/open-issue.use-case.ts`
- `application/use-cases/pass-issue-retest.use-case.ts`
- `application/use-cases/pass-task-qa.use-case.ts`
- `application/use-cases/pay-invoice.use-case.ts`
- `application/use-cases/reject-invoice.use-case.ts`
- `application/use-cases/remove-invoice-item.use-case.ts`
- `application/use-cases/resolve-issue.use-case.ts`
- `application/use-cases/review-invoice.use-case.ts`
- `application/use-cases/start-issue.use-case.ts`
- `application/use-cases/submit-invoice.use-case.ts`
- `application/use-cases/submit-issue-retest.use-case.ts`
- `application/use-cases/submit-task-to-qa.use-case.ts`
- `application/use-cases/update-invoice-item.use-case.ts`
- `application/use-cases/update-task.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-flow/README.md`
- 模組 AGENT：`../../../modules/workspace-flow/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-flow/application-services.md`
````

## File: modules/workspace-flow/context-map.md
````markdown
# Context Map — workspace-flow

## 上游（依賴）

### knowledge → workspace-flow（Published Language）

**這是 workspace-flow 最重要的上游整合。**

- `workspace-flow` 的 `ContentToWorkflowMaterializer` 訂閱 `knowledge.page_approved`
- 從 `extractedTasks[]` 建立 MaterializedTask
- 從 `extractedInvoices[]` 建立 Invoice
- 每個物化實體中記錄 `sourceReference`（pageId + causationId）

```
knowledge.page_approved ──► ContentToWorkflowMaterializer
                            ├─► Task.create（extractedTask）
                            └─► Invoice.create（extractedInvoice）
```

### workspace → workspace-flow（Conformist）

- Task/Issue/Invoice 都隸屬 `workspaceId`
- `WorkspaceFlowTab` 接收 `workspaceId` + `currentUserId` 作為 props

---

## 下游（被依賴）

### workspace-flow → notification（Published Language）

- 狀態變更事件觸發通知（如 task_assigned）

### workspace-flow → workspace-audit（Published Language）

- 狀態轉換事件供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| workspace → workspace-flow | workspace | workspace-flow | Conformist |
| workspace-flow → notification | workspace-flow | notification | Published Language |
| workspace-flow → workspace-audit | workspace-flow | workspace-audit | Published Language |
````

## File: modules/workspace-flow/domain-events.md
````markdown
# Domain Events — workspace-flow

## 發出事件

### Task 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.task_created` | Task 建立 | `taskId`, `workspaceId`, `title`, `createdByUserId`, `occurredAt` |
| `workspace-flow.task_status_changed` | Task 狀態變更 | `taskId`, `workspaceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.task_assigned` | Task 指派負責人 | `taskId`, `workspaceId`, `assigneeId`, `occurredAt` |
| `workspace-flow.task_materialized` | Task 由 ContentToWorkflowMaterializer 物化 | `taskId`, `workspaceId`, `sourceReference`, `occurredAt` |

### Issue 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.issue_opened` | Issue 開啟 | `issueId`, `workspaceId`, `title`, `reporterId`, `occurredAt` |
| `workspace-flow.issue_status_changed` | Issue 狀態變更 | `issueId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.issue_resolved` | Issue 解決 | `issueId`, `workspaceId`, `occurredAt` |

### Invoice 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.invoice_created` | Invoice 建立 | `invoiceId`, `workspaceId`, `amount`, `currency`, `occurredAt` |
| `workspace-flow.invoice_status_changed` | Invoice 狀態變更 | `invoiceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.invoice_paid` | Invoice 標記已付款 | `invoiceId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_approved` | ContentToWorkflowMaterializer 建立 MaterializedTask 與 Invoice |

## 消費 workspace-flow 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-flow.task_assigned` | 通知被指派者 |
| `workspace-audit` | 所有狀態變更事件 | 記錄稽核軌跡 |
````

## File: modules/workspace-flow/domain-services.md
````markdown
# workspace-flow — Domain Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/invoice-guards.ts`
- `domain/services/invoice-transition-policy.ts`
- `domain/services/issue-transition-policy.ts`
- `domain/services/task-guards.ts`
- `domain/services/task-transition-policy.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-flow/domain-services.md`
- `../../../docs/ddd/workspace-flow/aggregates.md`
````

## File: modules/workspace-flow/README.md
````markdown
# workspace-flow — 工作流程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-flow/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-flow` 把知識內容轉成可執行的業務流程，負責 Task、Issue、Invoice 三條工作線的狀態機與政策。它是知識平台從「記錄知識」走向「驅動執行」的主要協作引擎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Task / Issue / Invoice 狀態機 | 管理主要工作流程聚合與轉換規則 |
| 物化流程 | 消費 `knowledge.page_approved` 等事件建立可執行項目 |
| 業務守衛 | 封裝狀態轉換、角色限制與流程政策 |

## 與其他 Bounded Context 協作

- `knowledge` 是最重要上游，提供審批後的內容事件。
- `workspace` 提供流程歸屬；`workspace-audit` 與 `workspace-feed` 消費流程結果或事件。

## 核心聚合 / 核心概念

- **`Task`**
- **`Issue`**
- **`Invoice`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-flow/repositories.md
````markdown
# workspace-flow — Repositories

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/InvoiceRepository.ts`
- `domain/repositories/IssueRepository.ts`
- `domain/repositories/TaskRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/invoice-item.converter.ts`
- `infrastructure/firebase/invoice.converter.ts`
- `infrastructure/firebase/issue.converter.ts`
- `infrastructure/firebase/sourceReference.converter.ts`
- `infrastructure/firebase/task.converter.ts`
- `infrastructure/firebase/workspace-flow.collections.ts`
- `infrastructure/repositories/FirebaseInvoiceItemRepository.ts`
- `infrastructure/repositories/FirebaseInvoiceRepository.ts`
- `infrastructure/repositories/FirebaseIssueRepository.ts`
- `infrastructure/repositories/FirebaseTaskRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-flow/repositories.md`
- `../../../docs/ddd/workspace-flow/aggregates.md`
````

## File: modules/workspace-flow/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-flow

> **範圍：** 僅限 `modules/workspace-flow/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 任務 | Task | 可追蹤的工作單元，有狀態機與負責人 |
| 任務狀態 | TaskStatus | `draft \| in_progress \| qa \| acceptance \| accepted \| archived` |
| 問題 | Issue | 問題追蹤記錄（Bug / 需求問題） |
| 問題狀態 | IssueStatus | `open \| investigating \| fixing \| retest \| resolved \| closed` |
| 發票 | Invoice | 財務發票記錄 |
| 發票狀態 | InvoiceStatus | `draft \| submitted \| finance_review \| approved \| paid \| closed` |
| 物化任務 | MaterializedTask | 從 `knowledge.page_approved` 事件自動建立的任務 |
| 來源參照 | sourceReference | 物化任務/發票的來源頁面引用（pageId, causationId） |
| 工作流程物化器 | ContentToWorkflowMaterializer | 監聽 knowledge 事件並建立 Task/Invoice 的 Process Manager |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Task` | `TodoItem`, `WorkItem`, `Job` |
| `Issue` | `Bug`, `Ticket`, `Problem` |
| `Invoice` | `Bill`, `Receipt` |
| `MaterializedTask` | `ConvertedTask`, `AutoTask` |
````

## File: modules/workspace-flow/Workspace-Flow-File-Template.md
````markdown
## 1️⃣ 通用檔案頭模板

```ts
/**
 * @module <模組路徑>
 * @file <檔案名稱>
 * @description <檔案用途簡述>
 * @author <作者>
 * @created <YYYY-MM-DD>
 * @todo <未完成事項或提醒>
 */
```

* `<模組路徑>`: 如 `workspace-flow/domain/entities`
 * `<檔案名稱>`: 如 `modules/workspace-flow/domain/entities/Task.ts`
* `<檔案用途簡述>`: 簡單一句話說明這個檔案做什麼
* `@todo` 可以先留空

---

## 2️⃣ Class / Interface 範例模板

```ts
/**
 * Task Entity
 * @class Task
 * @description 代表一個任務及其狀態與行為
 */
export class Task {
    /**
     * 建立 Task 實例
     * @param {string} title - 任務標題
     * @param {TaskStatus} status - 任務狀態
     */
    constructor(public title: string, public status: TaskStatus) {}
    
    /**
     * 標記任務為完成
     */
    complete() {
        // TODO: 實作
    }
}
```

---

## 3️⃣ Function / Use Case 範例模板

```ts
/**
 * 建立新的 Task
 * @param {CreateTaskDto} dto - 新任務資料
 * @returns {Promise<Task>} 新建立的任務
 */
export async function createTask(dto: CreateTaskDto): Promise<Task> {
    // TODO: 實作
}
```

> 建議先把 **函數頭也加上 JSDoc**，即便目前沒有實作。好處：
>
> 1. 方便生成 API 文件。
> 2. 讓團隊知道參數與回傳型別。
> 3. 開發中 IDE 可以即時提示。

---

## 4️⃣ Mermaid 檔案模板

```mermaid
%% ======================================================
%% File: Workspace-Flow-Tree.mermaid
%% Module: workspace-flow
%% Description: 工作區任務流程結構樹
%% Created: 2026-03-25
%% ======================================================
flowchart TD
    %% TODO: 建立節點
```

---
````

## File: modules/workspace-scheduling/AGENT.md
````markdown
# AGENT.md — workspace-scheduling BC

## 模組定位

`workspace-scheduling` 是工作需求排程支援域，管理 WorkDemand 生命週期與日曆視圖。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkDemand` | Demand、Request、Ticket、Requirement |
| `DemandStatus` | Status（單獨使用）、State |
| `DemandPriority` | Priority（單獨使用）、Urgency |
| `CalendarWidget` | Calendar、Scheduler |

## 狀態機（必須遵守）

```
DemandStatus: draft → open → in_progress → completed
DemandPriority: low | medium | high
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceSchedulingApi } from "@/modules/workspace-scheduling/api";
import type { WorkDemandDTO } from "@/modules/workspace-scheduling/api";
```

### ❌ 禁止
```typescript
import { WorkDemand } from "@/modules/workspace-scheduling/domain/types";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-scheduling/aggregates.md
````markdown
# Aggregates — workspace-scheduling

## 聚合根：WorkDemand

### 職責
代表一個工作需求記錄。管理需求的排程生命週期（draft → completed）。

### 生命週期狀態機
```
draft ──► open ──► in_progress ──► completed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 需求主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `accountId` | `string` | 所屬帳戶 |
| `title` | `string` | 需求標題 |
| `description` | `string \| null` | 描述（可選） |
| `status` | `DemandStatus` | `draft \| open \| in_progress \| completed` |
| `priority` | `DemandPriority` | `low \| medium \| high` |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- `title` 不可為空
- `completed` 狀態不可逆回 `draft`

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `DemandStatus` | `"draft" \| "open" \| "in_progress" \| "completed"` |
| `DemandPriority` | `"low" \| "medium" \| "high"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `DemandRepository` | `save()`, `findById()`, `listByWorkspace()`, `updateStatus()` |
````

## File: modules/workspace-scheduling/application-services.md
````markdown
# workspace-scheduling — Application Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-scheduling` 的 application layer 服務與 use cases。內容與 `modules/workspace-scheduling/application/` 實作保持一致。

## Application Layer 職責

管理 WorkDemand 的排程生命週期、優先級與日曆視圖。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/work-demand.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-scheduling/README.md`
- 模組 AGENT：`../../../modules/workspace-scheduling/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-scheduling/application-services.md`
````

## File: modules/workspace-scheduling/context-map.md
````markdown
# Context Map — workspace-scheduling

## 上游（依賴）

### workspace → workspace-scheduling（Conformist）

- WorkDemand 隸屬 `workspaceId`
- `WorkspaceSchedulingTab` 接收 `workspaceId` 作為 props

### account → workspace-scheduling（Customer/Supplier）

- `AccountSchedulingView` 按 `accountId` 聚合跨工作區排程視圖

---

## 下游（被依賴）

### workspace-scheduling → notification（Published Language）

- 需求建立/狀態變更事件觸發通知

### workspace-scheduling → workspace-audit（Published Language）

- 排程操作供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| account → workspace-scheduling | account | workspace-scheduling | Customer/Supplier |
| workspace-scheduling → notification | workspace-scheduling | notification | Published Language |
| workspace-scheduling → workspace-audit | workspace-scheduling | workspace-audit | Published Language |
````

## File: modules/workspace-scheduling/domain-events.md
````markdown
# Domain Events — workspace-scheduling

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-scheduling.demand_created` | WorkDemand 建立 | `demandId`, `workspaceId`, `title`, `priority`, `occurredAt` |
| `workspace-scheduling.demand_status_changed` | 狀態轉換 | `demandId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-scheduling.demand_completed` | WorkDemand 完成 | `demandId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace-flow` | `workspace-flow.task_created` | 同步相關 WorkDemand 的排程狀態（可選） |

## 消費 workspace-scheduling 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-scheduling.demand_created` | 通知相關成員 |
| `workspace-audit` | 所有狀態變更事件 | 記錄排程稽核軌跡 |
````

## File: modules/workspace-scheduling/domain-services.md
````markdown
# workspace-scheduling — Domain Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-scheduling/domain-services.md`
- `../../../docs/ddd/workspace-scheduling/aggregates.md`
````

## File: modules/workspace-scheduling/README.md
````markdown
# workspace-scheduling — 工作區排程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-scheduling/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-scheduling` 讓知識與流程成果進一步進入時間與容量管理，將工作需求落入日曆、截止與排程視角。它支援團隊把抽象工作轉成可安排的協作負載。

## 主要職責

| 能力 | 說明 |
|---|---|
| 需求排程 | 建立與管理 WorkDemand 的狀態生命週期 |
| 時間視圖 | 提供日曆、截止與安排視角 |
| 容量協調 | 讓工作需求能與流程與工作區情境一起被安排 |

## 與其他 Bounded Context 協作

- `workspace-flow` 可作為排程需求來源。
- `workspace` 提供排程歸屬與成員範圍。

## 核心聚合 / 核心概念

- **`WorkDemand`**
- **`ScheduleWindow`**
- **`CapacityAllocation`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-scheduling/repositories.md
````markdown
# workspace-scheduling — Repositories

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseDemandRepository.ts`
- `infrastructure/mock-demand-repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-scheduling/repositories.md`
- `../../../docs/ddd/workspace-scheduling/aggregates.md`
````

## File: modules/workspace-scheduling/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-scheduling

> **範圍：** 僅限 `modules/workspace-scheduling/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作需求 | WorkDemand | 一個已排程或待排程的工作請求，含標題、截止日期與優先級 |
| 需求狀態 | DemandStatus | WorkDemand 的生命週期狀態：`draft \| open \| in_progress \| completed` |
| 需求優先級 | DemandPriority | 工作緊急程度：`low \| medium \| high` |
| 日曆控件 | CalendarWidget | 顯示工作需求排程的日曆 UI 元件 |
| 帳戶排程視圖 | AccountSchedulingView | 跨工作區的帳戶級別排程總覽頁面 |

## 狀態標籤（顯示文字）

| 狀態 | 中文標籤 |
|------|---------|
| `draft` | 草稿 |
| `open` | 待處理 |
| `in_progress` | 進行中 |
| `completed` | 已完成 |
| `low` | 低 |
| `medium` | 中 |
| `high` | 高 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `WorkDemand` | `Demand`, `Request`, `Ticket` |
| `DemandStatus` | `Status`, `WorkStatus` |
````

## File: modules/workspace/aggregates.md
````markdown
# Aggregates — workspace

## 聚合根：Workspace

### 職責
代表一個協作容器。管理工作區的生命週期（active → archived）與成員關係。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 工作區主鍵 |
| `name` | `string` | 工作區名稱 |
| `accountId` | `string` | 擁有者帳戶或組織 ID |
| `status` | `WorkspaceStatus` | `active \| archived` |
| `members` | `WorkspaceMember[]` | 成員列表 |

### 不變數

- archived 狀態的工作區不可新增成員
- workspaceId 建立後不可變更

---

## 聚合根：WikiContentTree

### 職責
維護工作區內 Wiki 頁面的樹狀層級結構，提供父子頁面關係的查詢能力。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `workspaceId` | `string` | 所屬工作區 |
| `nodes` | `WikiTreeNode[]` | 樹狀節點列表 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `WorkspaceMember` | 成員在工作區中的角色與狀態 |
| `WorkspaceStatus` | `"active" \| "archived"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceRepository` | `save()`, `findById()`, `findByAccountId()` |
| `WorkspaceQueryRepository` | `listByAccountId()`, `findById()` |
| `WikiWorkspaceRepository` | `getContentTree()`, `updateTree()` |
````

## File: modules/workspace/api/index.ts
````typescript
/**
 * workspace 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 workspace 模組內部實作。
 */
// ─── 核心實體型別 ──────────────────────────────────────────────────────────────
⋮----
// ─── 查詢函數 (供 UI 層訂閱/讀取使用) ────────────────────────────────────────
⋮----
// ─── Wiki content-tree types (owned by workspace domain) ───────────────────
⋮----
// ─── Wiki content-tree use-case ────────────────────────────────────────────
import { FirebaseWikiWorkspaceRepository } from "../infrastructure/firebase/FirebaseWikiWorkspaceRepository";
import { buildWikiContentTree as _buildWikiContentTree } from "../application/use-cases/wiki-content-tree.use-case";
import type { WikiAccountContentNode, WikiAccountSeed } from "../domain/entities/WikiContentTree";
⋮----
export function buildWikiContentTree(seeds: WikiAccountSeed[]): Promise<WikiAccountContentNode[]>
// ─── Server actions (client-callable via Next.js action proxy) ──────────────
⋮----
// ─── UI components (cross-module public) ─────────────────────────────────────
⋮----
// ─── Workspace tab metadata helpers (UI-only helpers) ───────────────────────
````

## File: modules/workspace/application-services.md
````markdown
# workspace — Application Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件記錄 `workspace` 的 application layer 服務與 use cases。內容與 `modules/workspace/application/` 實作保持一致。

## Application Layer 職責

管理工作區容器、成員與內容樹，並組合多個 workspace-* 子域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/wiki-content-tree.use-case.ts`
- `application/use-cases/workspace-member.use-cases.ts`
- `application/use-cases/workspace.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace/README.md`
- 模組 AGENT：`../../../modules/workspace/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace/application-services.md`
````

## File: modules/workspace/application/use-cases/wiki-content-tree.use-case.ts
````typescript
/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Build the Wiki sidebar content-tree from account/workspace seeds.
 *          Lives in workspace because it aggregates workspace-scoped content nodes.
 */
import type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
} from "../../domain/entities/WikiContentTree";
import type { WikiWorkspaceRepository } from "../../domain/repositories/WikiWorkspaceRepository";
function buildContentBaseItems(workspaceId: string): WikiContentItemNode[]
function buildWorkspaceNode(workspaceId: string, workspaceName: string): WikiWorkspaceContentNode
export async function buildWikiContentTree(
  seeds: WikiAccountSeed[],
  workspaceRepository: WikiWorkspaceRepository,
): Promise<WikiAccountContentNode[]>
````

## File: modules/workspace/context-map.md
````markdown
# Context Map — workspace

## 上游（依賴）

### account / organization → workspace（Customer/Supplier）

- `workspace.accountId` 關聯 account 或 organization
- workspace 查詢時驗證 accountId 歸屬

---

## 下游（被依賴）

`workspace` 是多個 workspace-* 子模組的**組合宿主**：

### workspace → workspace-flow（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceFlowTab`（Tasks tab）
- 傳入 `workspaceId`, `currentUserId`

### workspace → workspace-scheduling（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceSchedulingTab`

### workspace → workspace-audit（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceAuditTab`

### workspace → workspace-feed（Conformist）
- `WorkspaceDetailScreen` 組合 feed 動態牆 tab

### workspace → knowledge（Customer/Supplier）
- 知識頁面（WikiPage）隸屬於 workspaceId
- Wiki 內容樹（WikiContentTree）按工作區組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → workspace | account | workspace | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| workspace → workspace-flow | workspace | workspace-flow | Conformist（workspaceId） |
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| workspace → workspace-audit | workspace | workspace-audit | Conformist |
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
````

## File: modules/workspace/domain-events.md
````markdown
# Domain Events — workspace

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace.created` | 新工作區建立時 | `workspaceId`, `accountId`, `name`, `occurredAt` |
| `workspace.archived` | 工作區歸檔時 | `workspaceId`, `accountId`, `occurredAt` |
| `workspace.member_joined` | 成員加入工作區 | `workspaceId`, `accountId`, `role`, `occurredAt` |
| `workspace.member_removed` | 成員被移除 | `workspaceId`, `accountId`, `occurredAt` |

## 訂閱事件

`workspace` 不直接訂閱其他 BC 的事件，由 app/ 路由層協調各 tab 組合。

## 事件格式範例

```typescript
interface WorkspaceCreatedEvent {
  readonly type: "workspace.created";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly occurredAt: string;  // ISO 8601
}
```
````

## File: modules/workspace/domain-services.md
````markdown
# workspace — Domain Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件整理 `workspace` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace/domain-services.md`
- `../../../docs/ddd/workspace/aggregates.md`
````

## File: modules/workspace/interfaces/workspace-tabs.ts
````typescript
export type WorkspaceTabDevStatus = "🚧" | "🏗️" | "✅";
export type WorkspaceTabGroup = "primary" | "spaces" | "databases" | "library" | "modules";
⋮----
export type WorkspaceTabValue = (typeof WORKSPACE_TAB_VALUES)[number];
interface WorkspaceTabMeta {
  readonly label: string;
  readonly prefId: string;
  readonly group: WorkspaceTabGroup;
  readonly status: WorkspaceTabDevStatus;
}
⋮----
export function isWorkspaceTabValue(value: string): value is WorkspaceTabValue
export function getWorkspaceTabMeta(tab: WorkspaceTabValue)
export function getWorkspaceTabStatus(tab: WorkspaceTabValue): WorkspaceTabDevStatus
export function getWorkspaceTabLabel(tab: WorkspaceTabValue): string
export function getWorkspaceTabPrefId(tab: WorkspaceTabValue): string
export function getWorkspaceTabsByGroup(group: WorkspaceTabGroup): readonly WorkspaceTabValue[]
````

## File: modules/workspace/repositories.md
````markdown
# workspace — Repositories

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件整理 `workspace` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/WikiWorkspaceRepository.ts`
- `domain/repositories/WorkspaceQueryRepository.ts`
- `domain/repositories/WorkspaceRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace/repositories.md`
- `../../../docs/ddd/workspace/aggregates.md`
````

## File: modules/workspace/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace

> **範圍：** 僅限 `modules/workspace/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區 | Workspace | 協作容器，所有知識、任務、討論歸屬於此 |
| 工作區成員 | WorkspaceMember | 帳戶在工作區中的參與記錄（含角色） |
| Wiki 內容樹 | WikiContentTree | 工作區內 Wiki 頁面的樹狀層級結構 |
| 工作區 ID | workspaceId | Workspace 的業務主鍵 |
| 帳戶 ID | accountId | 擁有此工作區的帳戶或組織 ID |
| 工作區狀態 | WorkspaceStatus | `active \| archived` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Workspace` | `Project`, `Space` |
| `WorkspaceMember` | `Member`, `Participant` |
| `WikiContentTree` | `PageTree`, `Tree`, `Hierarchy` |
````

## File: repomix.config.json
````json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "input": {
    "maxFileSize": 52428800
  },
  "output": {
    "filePath": "repomix-output.json",
    "style": "json",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "compress": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "truncateBase64": false,
    "copyToClipboard": false,
    "includeFullDirectoryStructure": false,
    "tokenCountTree": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false,
      "includeLogs": false,
      "includeLogsCount": 50
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDotIgnore": true,
    "useDefaultPatterns": true,
    "customPatterns": [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      ".turbo/**",
      ".vercel/**",
      ".firebase/**",
      ".output/**",
      ".parcel-cache/**",

      ".cursor/**",
      ".vscode/**",
      ".serena/**",
      ".claude/**",
      ".opencode/**",
      ".idea/**",
      ".history/**",

      ".cache/**",
      ".temp/**",
      ".tmp/**",
      "tmp/**",
      "temp/**",

      "*.log",
      "logs/**",
      "firebase-debug.log",

      ".env*",
      "*.pem",
      "*.key",
      "*.crt",

      ".DS_Store",
      "Thumbs.db",

      "*.lock",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "skills-lock.json",

      "*.tsbuildinfo",
      ".eslintcache",
      ".stylelintcache",

      ".git/**",
      ".github/workflows/**",
      ".github/skills/**",
      "docs/architecture/**",
      "diagrams/**",

      "public/**",
      ".tmp-eslint*.json",
      "*.png",
      "*.jpg",
      "*.jpeg",
      "*.gif",
      "*.webp",
      "*.mp4",
      "*.zip",
      "*.tar",
      "*.gz",

      "*.sqlite",
      "*.db"
    ]
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
````

## File: repomix.markdown.config.json
````json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "input": {
    "maxFileSize": 52428800
  },
  "output": {
    "filePath": "repomix-output.json",
    "style": "json",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": true,
    "compress": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "truncateBase64": false,
    "copyToClipboard": false,
    "includeFullDirectoryStructure": false,
    "tokenCountTree": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false,
      "includeLogs": false,
      "includeLogsCount": 50
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDotIgnore": true,
    "useDefaultPatterns": true,
    "customPatterns": [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      ".turbo/**",
      ".vercel/**",
      ".firebase/**",
      ".output/**",
      ".parcel-cache/**",

      ".cursor/**",
      ".vscode/**",
      ".serena/**",
      ".claude/**",
      ".opencode/**",
      ".idea/**",
      ".history/**",

      ".cache/**",
      ".temp/**",
      ".tmp/**",
      "tmp/**",
      "temp/**",

      "*.log",
      "logs/**",
      "firebase-debug.log",

      ".env*",
      "*.pem",
      "*.key",
      "*.crt",

      ".DS_Store",
      "Thumbs.db",

      "*.lock",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "skills-lock.json",

      "*.tsbuildinfo",
      ".eslintcache",
      ".stylelintcache",

      ".git/**",
      ".github/workflows/**",
      ".github/skills/**",
      "docs/architecture/**",
      "diagrams/**",

      "public/**",
      ".tmp-eslint*.json",
      "*.png",
      "*.jpg",
      "*.jpeg",
      "*.gif",
      "*.webp",
      "*.mp4",
      "*.zip",
      "*.tar",
      "*.gz",

      "*.sqlite",
      "*.db"
    ]
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
````

## File: repomix.skill.config.json
````json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "input": {
    "maxFileSize": 52428800
  },
  "output": {
    "filePath": "repomix-output.json",
    "style": "json",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": true,
    "compress": true,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "truncateBase64": false,
    "copyToClipboard": false,
    "includeFullDirectoryStructure": false,
    "tokenCountTree": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false,
      "includeLogs": false,
      "includeLogsCount": 50
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDotIgnore": true,
    "useDefaultPatterns": true,
    "customPatterns": [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      ".turbo/**",
      ".vercel/**",
      ".firebase/**",
      ".output/**",
      ".parcel-cache/**",

      ".cursor/**",
      ".vscode/**",
      ".serena/**",
      ".claude/**",
      ".opencode/**",
      ".idea/**",
      ".history/**",

      ".cache/**",
      ".temp/**",
      ".tmp/**",
      "tmp/**",
      "temp/**",

      "*.log",
      "logs/**",
      "firebase-debug.log",

      ".env*",
      "*.pem",
      "*.key",
      "*.crt",

      ".DS_Store",
      "Thumbs.db",

      "*.lock",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "skills-lock.json",

      "*.tsbuildinfo",
      ".eslintcache",
      ".stylelintcache",

      ".git/**",
      ".github/workflows/**",
      ".github/skills/**",
      "docs/architecture/**",
      "diagrams/**",

      "public/**",
      ".tmp-eslint*.json",
      "*.png",
      "*.jpg",
      "*.jpeg",
      "*.gif",
      "*.webp",
      "*.mp4",
      "*.zip",
      "*.tar",
      "*.gz",

      "*.sqlite",
      "*.db",

      "docs/**",
      ".github/agents/**",
      ".github/instructions/**",
      ".github/prompts/**",
      ".github/terminology-glossary.md",
      ".github/README.md",
      ".github/copilot-instructions.md"
    ]
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
````

## File: scripts/demo-flow.ts
````typescript
/**
 * scripts/demo-flow.ts
 *
 * Architecture Phase 2 — The Proof (Occam's Razor Edition)
 *
 * Demonstrates the Content → EventBus loop using only in-memory adapters.
 * Note: modules/wiki has been removed; graph steps are no longer included.
 *
 * Run with:
 *   npx tsx scripts/demo-flow.ts
 */
import { SimpleEventBus } from "../modules/shared/infrastructure/SimpleEventBus";
import { KnowledgeApi as ContentKnowledgeApi } from "../modules/knowledge/api/knowledge-api";
async function main()
````

## File: app/(shell)/_components/global-search-dialog.tsx
````typescript
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Layout } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@ui-shadcn/ui/command";
⋮----
interface GlobalSearchDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}
⋮----
function handleSelect(href: string)
⋮----
/** Hook to manage Cmd/Ctrl+K keyboard shortcut. */
⋮----
function onKeyDown(event: KeyboardEvent)
````

## File: app/(shell)/ai-chat/_actions.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
  Thread,
} from "@/modules/notebook/api";
import {
  GenerateNotebookResponseUseCase,
  GenkitNotebookRepository,
} from "@/modules/notebook/api/server";
import { saveThread, loadThread } from "@/modules/notebook/api";
export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult>
````

## File: app/(shell)/knowledge-base/articles/page.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, ChevronDown, ChevronRight, CircleDot, FileClock, FolderOpen, Layers, Plus } from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { getArticles, getCategories, ArticleDialog } from "@/modules/knowledge-base/api";
import type { Article, ArticleStatus, VerificationState, Category } from "@/modules/knowledge-base/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
⋮----
// ── Category tree helpers ────────────────────────────────────────────────────
interface CategoryNode extends Category {
  children: CategoryNode[];
}
function buildCategoryTree(categories: Category[]): CategoryNode[]
// ── Category tree panel ──────────────────────────────────────────────────────
interface CategoryTreePanelProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}
function CategoryTreePanel(
⋮----
// ── Main page ────────────────────────────────────────────────────────────────
⋮----
function handleSuccess(articleId?: string)
````

## File: firestore.indexes.json
````json
{
  "indexes": [
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "recipientId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "recipientId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "read",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "recipientId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "read",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceTasks",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceQualityChecks",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceIssues",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "documents",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "organizationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "taxonomy",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "documents",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "organizationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "taxonomy",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "chunks",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "organizationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "taxonomy",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "embedding",
          "vectorConfig": {
            "dimension": 4,
            "flat": {}
          }
        }
      ]
    },
    {
      "collectionGroup": "chunks",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "organizationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "taxonomy",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "embedding",
          "vectorConfig": {
            "dimension": 4,
            "flat": {}
          }
        }
      ]
    },
    {
      "collectionGroup": "dailyEntries",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "publishedAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "dailyEntries",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "organizationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "publishedAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "dailyPosts",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "accountId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "dailyPosts",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceFeedPosts",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceFlowTasks",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceFlowInvoices",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceFlowIssues",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "taskId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "workspaceFlowIssues",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "taskId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "wikiLibraries",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtISO",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "knowledgeDatabases",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "archived",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtISO",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "knowledgeDatabases",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "archived",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtISO",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "databaseRecords",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "databaseId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "order",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "kbArticles",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAtISO",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "kbCategories",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "workspaceId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "depth",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "name",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "contentPages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "order",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
````

## File: modules/account/AGENT.md
````markdown
# AGENT.md — account BC

## 模組定位

`account` 是 Xuanwu 平台的**帳戶管理**有界上下文，負責用戶 profile 與存取控制政策。在伺服器端消費 `identity/api`。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Account` | User、Profile、Member（在此 BC 內） |
| `AccountPolicy` | Permission、AccessRule、Role（作為存取控制） |
| `customClaims` | Claims、FirebaseClaims |
| `accountId` | userId、uid（在此 BC 之外的引用應使用 accountId） |

## 邊界規則

### ✅ 允許
```typescript
import { accountApi } from "@/modules/account/api";
import type { AccountDTO, AccountPolicyDTO } from "@/modules/account/api";
```

### ❌ 禁止
```typescript
import { Account } from "@/modules/account/domain/entities/Account";
// account use-cases 在 server 端 — 不要在 use-cases 中 import React/client hooks
```

## 關鍵依賴規則

- `modules/account/application/use-cases/account.use-cases.ts` 與 `modules/account/application/use-cases/account-policy.use-cases.ts` 在 server 端執行，可 import `identity/api`
- 不要在 application 層 import 任何含 `"use client"` 的模組

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/account/context-map.md
````markdown
# Context Map — account

## 上游（依賴）

### identity → account（Customer/Supplier）

- `account` 依賴 `identity/api` 取得 uid 與 TokenRefreshSignal
- `modules/account/application/use-cases/account.use-cases.ts` 在 server 端 import `identity/api`

```
identity/api ──► account/application (server-side use-cases)
```

---

## 下游（被依賴）

### account → organization（Customer/Supplier）

- `organization` 的 `MemberReference` 使用 `accountId` 參照 Account
- Organization 成員列表以 `accountId` 為主鍵

### account → workspace（Customer/Supplier）

- `Workspace.accountId` 關聯帳戶或組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| account → organization | account | organization | Customer/Supplier |
| account → workspace | account | workspace | Customer/Supplier |
````

## File: modules/identity/AGENT.md
````markdown
# AGENT.md — identity BC

## 模組定位

`identity` 是 Firebase Authentication 的 domain 薄層封裝。無業務邏輯，只有驗證基礎設施抽象。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Identity` | User、CurrentUser、AuthUser |
| `TokenRefreshSignal` | TokenEvent、RefreshToken |
| `signIn` | login、authenticate |
| `signOut` | logout |
| `uid` | userId、id（在此 BC 內） |

## 邊界規則

### ✅ 允許
```typescript
import { identityApi } from "@/modules/identity/api";
import type { IdentityDTO } from "@/modules/identity/api";
```

### ❌ 禁止
```typescript
import { useTokenRefreshListener } from "@/modules/identity/interfaces/hooks/useTokenRefreshListener";
// ❌ api/ 不能含 "use client" 匯出 — account use-cases 在 server 端 import api/
```

## 關鍵守衛

- `modules/identity/api/index.ts` 不得 re-export 任何含 `"use client"` 的檔案
- hooks（`useTokenRefreshListener`）只能從 interfaces 層使用，不可進入 api barrel

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/knowledge-base/AGENT.md
````markdown
# AGENT.md — knowledge-base BC

## 模組定位

`knowledge-base` 是 **Core Domain**，負責組織級知識管理，對應 Notion 的 **Wiki / Knowledge Base** 功能。管理公司或團隊的知識文章（Article）與分類（Category）。

**這個 BC 負責：**
- Article（知識文章）的建立、編輯、審批、歸檔
- Category（分類目錄）的層級管理
- 知識文章的 Backlink、標籤（Tag）、版本管理
- SOP 流程文件、共享知識參考手冊
- 頁面驗證狀態（verified / needs_review）與頁面負責人（Owner）

**不歸屬這個 BC：**
- 個人筆記（Page + Block） → `knowledge`
- 留言與協作 → `knowledge-collaboration`
- 表格 / 資料庫 View → `knowledge-database`

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Article` | Page、Document（在此 BC 中） |
| `Category` | Folder、Tag（作為分類時） |
| `ArticleStatus` | Status |
| `VerificationState` | State |
| `ArticleOwner` | Owner |

## 邊界規則

### ✅ 允許
```typescript
import { createArticle } from "@/modules/knowledge-base/api";
```

### ❌ 禁止
```typescript
import anything from "@/modules/knowledge-base/domain/..."; // 走 api/ 邊界
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/knowledge-base/aggregates.md
````markdown
# Aggregates — knowledge-base

> 聚合根設計遵循 IDDD 規範：清晰邊界、一致性、最小耦合。

---

## Article（文章）— 聚合根

Article 是組織知識文章的主要聚合根，代表一篇完整的公開或內部知識文章、SOP 或 Wiki 頁面。

```typescript
type ArticleStatus = "draft" | "published" | "archived";
type VerificationState = "verified" | "needs_review" | "unverified";

interface Article {
  // Identity
  id: string;                           // Unique Article ID
  accountId: string;                    // Tenant (organization)
  workspaceId: string;                  // Workspace container
  categoryId: string | null;            // Parent Category (optional)

  // Content
  title: string;
  content: string;                      // Rich text / Markdown body
  tags: string[];                       // Classification labels

  // Lifecycle
  status: ArticleStatus;               // draft → published → archived
  version: number;                      // Optimistic locking version

  // Verification
  verificationState: VerificationState; // verified | needs_review | unverified
  ownerId: string | null;               // Article owner (responsible user)
  verifiedByUserId: string | null;
  verifiedAtISO: string | null;
  verificationExpiresAtISO: string | null;

  // Backlinks
  linkedArticleIds: string[];           // Outgoing [[wikilink]] references

  // Audit
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Article 業務規則

- Article 發布後（published），`content` 與 `title` 變更必須觸發 `knowledge-base.article_updated` 事件。
- `verificationState` 轉為 `verified` 需提供 `verifiedByUserId` 與 `verifiedAtISO`。
- 刪除改為 `archived`，不實際移除資料。
- `linkedArticleIds` 由 `BacklinkExtractorService` 從 `content` 自動解析。

---

## Category（分類目錄）— 聚合根

Category 是文章的層級分類容器，支援巢狀結構（最多 5 層）。

```typescript
interface Category {
  // Identity
  id: string;
  accountId: string;
  workspaceId: string;

  // Hierarchy
  name: string;
  slug: string;                         // URL-safe identifier
  parentCategoryId: string | null;      // null = root category
  depth: number;                        // 0 = root

  // Content
  articleIds: string[];                 // Articles directly under this category
  description: string | null;

  // Audit
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Category 業務規則

- `depth` 不可超過 5。
- 刪除 Category 前，所有子 Category 與 Article 必須先搬遷或刪除。
- `slug` 在同一 Workspace 下唯一。
````

## File: modules/knowledge-base/application-services.md
````markdown
# Application Services — knowledge-base

> Use Case 一個檔案一個操作，呼叫 Domain Services / Repository 介面，回傳 `CommandResult`。

---

## Article Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateArticleUseCase` | title, content, categoryId, tags, workspaceId | `CommandResult<ArticleId>` | 建立草稿文章 |
| `UpdateArticleUseCase` | articleId, title?, content?, tags? | `CommandResult` | 更新文章內容，version bump |
| `PublishArticleUseCase` | articleId | `CommandResult` | 將草稿轉為已發布 |
| `ArchiveArticleUseCase` | articleId | `CommandResult` | 封存文章（軟刪除） |
| `VerifyArticleUseCase` | articleId, verifiedByUserId, expiresAtISO? | `CommandResult` | 設定文章為已驗證 |
| `RequestArticleReviewUseCase` | articleId, requestedByUserId | `CommandResult` | 標記文章需要複核 |
| `AssignArticleOwnerUseCase` | articleId, ownerId | `CommandResult` | 指派文章負責人 |
| `TransferArticleCategoryUseCase` | articleId, targetCategoryId | `CommandResult` | 移動文章到另一分類 |
| `ExtractArticleBacklinksUseCase` | articleId | `CommandResult` | 從 content 解析並更新 linkedArticleIds |

## Category Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateCategoryUseCase` | name, parentCategoryId?, workspaceId | `CommandResult<CategoryId>` | 建立分類目錄 |
| `RenameCategoryUseCase` | categoryId, name | `CommandResult` | 重新命名分類 |
| `MoveCategoryUseCase` | categoryId, targetParentId | `CommandResult` | 移動分類到新父節點（深度驗證） |
| `DeleteCategoryUseCase` | categoryId | `CommandResult` | 刪除空白分類 |

---

## 範例 — CreateArticleUseCase

```typescript
// modules/knowledge-base/application/use-cases/create-article.use-case.ts
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
import type { CommandResult } from "@shared-types";
import { generateId } from "@shared-utils";

export class CreateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: CreateArticleInput): Promise<CommandResult<{ articleId: string }>> {
    const articleId = generateId();
    const now = new Date().toISOString();

    await this.repo.save({
      id: articleId,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      categoryId: input.categoryId ?? null,
      title: input.title,
      content: input.content ?? "",
      tags: input.tags ?? [],
      status: "draft",
      version: 1,
      verificationState: "unverified",
      ownerId: null,
      verifiedByUserId: null,
      verifiedAtISO: null,
      verificationExpiresAtISO: null,
      linkedArticleIds: [],
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });

    return { success: true, data: { articleId } };
  }
}
```
````

## File: modules/knowledge-base/context-map.md
````markdown
# Context Map — knowledge-base

> 描述此 Bounded Context 與其他 BC 的關係類型與整合模式，遵循 IDDD 戰略設計。

---

## 上游依賴（knowledge-base 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | Article 與 Category 必須屬於 Workspace |
| `organization` | **Conformist** | 多租戶邊界由 accountId 維護 |
| `identity` | **Conformist** | 驗證 ownerId / verifiedByUserId 是否存在 |
| `knowledge-collaboration` | **Customer / Supplier** | 從 collaboration 接收 Permission 資訊（查看/編輯權限） |

---

## 下游影響（downstream BCs 依賴 knowledge-base）

| BC | 關係類型 | 說明 |
|---|---|---|
| `knowledge` | **Customer / Supplier** | Knowledge Page 可提升（promote）為 knowledge-base Article |
| `knowledge-collaboration` | **Customer / Supplier** | Collaboration 使用 articleId 關聯 Comment / Version |
| `knowledge-database` | **Anti-Corruption Layer** | Database Record 可 link 到 Article（不反向依賴） |
| `notification` | **Published Language** | `knowledge-base.article_verified` 事件觸發通知 |
| `workspace-feed` | **Published Language** | `knowledge-base.article_published` 事件推送工作區動態 |

---

## 整合事件流

```
knowledge.page_approved
  → (human or automation) promotes to knowledge-base article
  → knowledge-base.article_created

knowledge-base.article_verified
  → notification (verified owner notified)
  → workspace-feed (article verified appears in feed)

knowledge-base.article_review_requested
  → notification (article owner notified to review)
```

---

## 邊界規則

- `knowledge-base` **不得**直接 import `knowledge` 的 domain 層。
- `knowledge-base` 只能透過 `modules/knowledge/api` 取得 page 資訊。
- `knowledge-collaboration` 透過 `modules/knowledge-base/api` 取得 articleId，不讀取 Article 內部細節。
````

## File: modules/knowledge-base/domain-events.md
````markdown
# Domain Events — knowledge-base

> 所有事件採用 discriminated-union pattern：`type: "knowledge-base.<event>"` 頂層欄位，`occurredAtISO: string`，無 `payload` wrapper。

---

## Article 事件

### knowledge-base.article_created

```typescript
interface ArticleCreatedEvent {
  type: "knowledge-base.article_created";
  articleId: string;
  workspaceId: string;
  accountId: string;
  title: string;
  categoryId: string | null;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_updated

```typescript
interface ArticleUpdatedEvent {
  type: "knowledge-base.article_updated";
  articleId: string;
  workspaceId: string;
  accountId: string;
  changedFields: string[];              // e.g. ["title", "content", "tags"]
  updatedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_published

```typescript
interface ArticlePublishedEvent {
  type: "knowledge-base.article_published";
  articleId: string;
  workspaceId: string;
  accountId: string;
  publishedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_archived

```typescript
interface ArticleArchivedEvent {
  type: "knowledge-base.article_archived";
  articleId: string;
  workspaceId: string;
  accountId: string;
  archivedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_verified

```typescript
interface ArticleVerifiedEvent {
  type: "knowledge-base.article_verified";
  articleId: string;
  workspaceId: string;
  accountId: string;
  verifiedByUserId: string;
  verificationExpiresAtISO: string | null;
  occurredAtISO: string;
}
```

### knowledge-base.article_review_requested

```typescript
interface ArticleReviewRequestedEvent {
  type: "knowledge-base.article_review_requested";
  articleId: string;
  workspaceId: string;
  accountId: string;
  requestedByUserId: string;
  ownerId: string | null;
  occurredAtISO: string;
}
```

### knowledge-base.article_owner_assigned

```typescript
interface ArticleOwnerAssignedEvent {
  type: "knowledge-base.article_owner_assigned";
  articleId: string;
  workspaceId: string;
  accountId: string;
  ownerId: string;
  assignedByUserId: string;
  occurredAtISO: string;
}
```

---

## Category 事件

### knowledge-base.category_created

```typescript
interface CategoryCreatedEvent {
  type: "knowledge-base.category_created";
  categoryId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  parentCategoryId: string | null;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.category_moved

```typescript
interface CategoryMovedEvent {
  type: "knowledge-base.category_moved";
  categoryId: string;
  workspaceId: string;
  accountId: string;
  fromParentCategoryId: string | null;
  toParentCategoryId: string | null;
  movedByUserId: string;
  occurredAtISO: string;
}
```
````

## File: modules/knowledge-base/domain-services.md
````markdown
# Domain Services — knowledge-base

> Domain Service 是無狀態的純商業邏輯，不依賴外部 SDK，不操作 Repository。

---

## BacklinkExtractorService

從 Article `content`（Markdown / rich-text）中解析所有 `[[Article Title]]` 格式的 wikilink，並轉換為 `linkedArticleIds`。

```typescript
// modules/knowledge-base/domain/services/BacklinkExtractorService.ts

export class BacklinkExtractorService {
  /**
   * 從 content 字串中提取所有 [[title]] wikilinks。
   * 返回去重後的標題陣列，由 Repository 負責解析為 ID。
   */
  extractWikilinkTitles(content: string): string[] {
    const regex = /\[\[([^\]]+)\]\]/g;
    const titles = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      titles.add(match[1].trim());
    }
    return Array.from(titles);
  }
}
```

---

## ArticleSlugService

將 Article title 轉換為 URL-safe slug，確保在同一 Workspace 下的唯一性規則。

```typescript
// modules/knowledge-base/domain/services/ArticleSlugService.ts

export class ArticleSlugService {
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100);
  }
}
```

---

## CategoryDepthValidator

驗證 Category 層級不超過最大深度（5 層），防止過深的巢狀結構。

```typescript
// modules/knowledge-base/domain/services/CategoryDepthValidator.ts

export class CategoryDepthValidator {
  private static readonly MAX_DEPTH = 5;

  validateMove(currentDepth: number, targetParentDepth: number): void {
    if (targetParentDepth + 1 > CategoryDepthValidator.MAX_DEPTH) {
      throw new Error(
        `Category depth cannot exceed ${CategoryDepthValidator.MAX_DEPTH}`
      );
    }
  }
}
```
````

## File: modules/knowledge-base/infrastructure/firebase/FirebaseArticleRepository.ts
````typescript
/**
 * Module: knowledge-base
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/kbArticles/{articleId}
 */
import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { Article, ArticleStatus } from "../../domain/entities/article.entity";
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
function articlesCol(db: ReturnType<typeof getFirestore>, accountId: string)
function articleDoc(db: ReturnType<typeof getFirestore>, accountId: string, articleId: string)
function toArticle(id: string, data: Record<string, unknown>): Article
export class FirebaseArticleRepository implements IArticleRepository {
⋮----
private db()
async getById(articleId: string): Promise<Article>
⋮----
// Note: articleId must be scoped with accountId in compound queries;
// for direct lookup we search across all accounts via collectionGroup if needed.
// At this layer we expect callers to use listByWorkspace for discovery.
⋮----
// We cannot getById without accountId — this is a limitation of the Firestore path.
// The article id from use-cases already has accountId in context.
// We'll need to resolve via a workspace-scoped query. For now, search by docId broadly.
// This is why save() stores accountId in the doc itself.
⋮----
async getArticleById(accountId: string, articleId: string): Promise<Article | null>
async list(params: {
    workspaceId: string;
    accountId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
}): Promise<Article[]>
async search(params:
⋮----
// Full-text search is not supported by Firestore; delegate to search module.
⋮----
async save(article: Article): Promise<void>
async getByIds(articleIds: string[]): Promise<Article[]>
⋮----
// Must be called with accountId; not feasible without extra context.
⋮----
async findByLinkedArticleId(articleId: string): Promise<Article[]>
⋮----
// Cross-account lookup not supported without accountId scope.
⋮----
async listByLinkedArticleId(accountId: string, articleId: string): Promise<Article[]>
async delete(articleId: string): Promise<void>
⋮----
// articleId alone is insufficient — callers should use deleteArticle(accountId, articleId).
⋮----
async deleteArticle(accountId: string, articleId: string): Promise<void>
````

## File: modules/knowledge-base/interfaces/queries/knowledge-base.queries.ts
````typescript
/**
 * Module: knowledge-base
 * Layer: interfaces/queries
 * Direct-instantiation query functions (read-side).
 */
import { FirebaseArticleRepository } from "../../infrastructure/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../infrastructure/firebase/FirebaseCategoryRepository";
import type { Article, ArticleStatus } from "../../domain/entities/article.entity";
import type { Category } from "../../domain/entities/category.entity";
export async function getArticles(params: {
  accountId: string;
  workspaceId: string;
  categoryId?: string;
  status?: ArticleStatus;
}): Promise<Article[]>
export async function getArticle(accountId: string, articleId: string): Promise<Article | null>
export async function getCategories(accountId: string, workspaceId: string): Promise<Category[]>
export async function getBacklinks(accountId: string, articleId: string): Promise<Article[]>
````

## File: modules/knowledge-base/README.md
````markdown
# knowledge-base — 組織知識庫 / Wiki / SOP 管理

> **Domain Type:** **Core Domain**（核心域）
> **模組路徑:** `modules/knowledge-base/`
> **開發狀態:** 📅 Planned — 設計階段

## 在 Knowledge Platform 中的角色

`knowledge-base` 是 Xuanwu 的 Notion Wiki / Knowledge Base 對應模組，負責組織或團隊級別的知識文章管理，支援層級分類、標籤、Backlink、SOP 流程文件與頁面驗證機制。

## 主要職責

| 能力 | 說明 |
|---|---|
| Article 文章管理 | 建立、編輯、版本化、歸檔組織知識文章 |
| Category 分類管理 | 層級化分類目錄，管理文章組織結構 |
| 頁面驗證 | verified / needs_review 狀態，支援知識準確性管理 |
| 頁面負責人 | 指定 ArticleOwner，負責維護文章內容 |
| Backlink / Tag | 文章間相互引用與標籤分類 |

## 核心聚合

- **`Article`**（知識文章）
- **`Category`**（分類目錄）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面與實作 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
````

## File: modules/knowledge-base/repositories.md
````markdown
# Repositories — knowledge-base

> Repository 介面定義於 `domain/repositories/`，實作置於 `infrastructure/firebase/`。

---

## IArticleRepository

```typescript
// modules/knowledge-base/domain/repositories/ArticleRepository.ts

export interface IArticleRepository {
  /** 取得單篇文章（不存在時 throw domain error） */
  getById(articleId: string): Promise<Article>;

  /** 列出 Workspace 下的文章（可依 categoryId / status 過濾） */
  list(params: {
    workspaceId: string;
    accountId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
    cursor?: string;
  }): Promise<Article[]>;

  /** 全文搜尋（基本實作，詳細 RAG 搜尋由 search BC 處理） */
  search(params: {
    workspaceId: string;
    query: string;
    limit?: number;
  }): Promise<Article[]>;

  /** 儲存（建立或更新） */
  save(article: Article): Promise<void>;

  /** 批次取得（backlink 查詢用） */
  getByIds(articleIds: string[]): Promise<Article[]>;

  /** 查找引用特定 articleId 的所有文章（反向 backlink） */
  findByLinkedArticleId(articleId: string): Promise<Article[]>;

  /** 刪除（Firestore 物理刪除，通常用於測試） */
  delete(articleId: string): Promise<void>;
}
```

---

## ICategoryRepository

```typescript
// modules/knowledge-base/domain/repositories/CategoryRepository.ts

export interface ICategoryRepository {
  /** 取得單一分類 */
  getById(categoryId: string): Promise<Category>;

  /** 列出 Workspace 下的所有分類（樹狀） */
  listByWorkspace(workspaceId: string, accountId: string): Promise<Category[]>;

  /** 取得特定父節點的子分類 */
  listChildren(parentCategoryId: string): Promise<Category[]>;

  /** 儲存 */
  save(category: Category): Promise<void>;

  /** 刪除（前提：無子分類且無文章） */
  delete(categoryId: string): Promise<void>;

  /** 批次更新 articleIds（文章搬移時） */
  updateArticleIds(categoryId: string, articleIds: string[]): Promise<void>;
}
```

---

## Firestore Collection 設計

| Collection | Document ID | 說明 |
|---|---|---|
| `knowledge_base_articles` | `{articleId}` | Article documents |
| `knowledge_base_categories` | `{categoryId}` | Category documents |

### Index 需求（預計）

| Collection | Fields | Purpose |
|---|---|---|
| `knowledge_base_articles` | `workspaceId`, `status`, `categoryId` | Category article list |
| `knowledge_base_articles` | `workspaceId`, `status`, `verificationState` | Verification dashboard |
| `knowledge_base_articles` | `workspaceId`, `ownerId` | My articles |
````

## File: modules/knowledge-base/ubiquitous-language.md
````markdown
# Ubiquitous Language — knowledge-base

> 此 BC 的通用語言定義，確保 domain / application / UI 使用一致術語。

---

## 核心術語

| 術語 | 定義 | 禁止使用的錯誤術語 |
|---|---|---|
| **Article**（文章） | 組織級公開知識文章、SOP 或 Wiki 頁面，具備版本與驗證機制 | Document, KnowledgePage, WikiPage |
| **Category**（分類） | 文章的層級分類容器（樹狀結構，最多 5 層） | Folder, Namespace, Group |
| **ArticleStatus**（文章狀態） | `draft` / `published` / `archived` 三態 | Active, Live, Deleted |
| **VerificationState**（驗證狀態） | `verified` / `needs_review` / `unverified` — 知識準確性狀態 | Approved, Checked, Valid |
| **ArticleOwner**（文章負責人） | 負責維護特定文章內容準確性的使用者 | Author, Creator, Editor |
| **Backlink**（反向連結） | 引用此 Article 的其他 Article — `[[Article Title]]` wikilink 語法 | Reference, Link, Mention |
| **Tag**（標籤） | 文章的關鍵詞分類標籤，用於過濾與搜尋 | Label, Keyword, Topic |
| **Wikilink**（Wiki 連結） | `[[Article Title]]` 格式的內部文章引用語法 | Link, Anchor, Mention |
| **Promote**（提升） | 將 `knowledge` BC 的 Page 轉換為此 BC 的 Article — 跨 BC 協議 | Convert, Transform, Import |

---

## 邊界詞彙對照表

| 術語 | 此 BC 的含義 | 其他 BC 中的對應 |
|---|---|---|
| `Article` | 組織知識文章 | `knowledge` 的 `Page`（個人筆記） |
| `Category` | 文章分類目錄 | `workspace` 的 Collection / Folder |
| `VerificationState` | knowledge-base 文章的驗證狀態 | `knowledge-collaboration` 的 `Version`（歷史版本） |
| `content` | Article 的主體文字（Markdown/rich-text） | `knowledge` Block 的 content field |

---

## 事件語言

| 事件名稱 | 語意 |
|---|---|
| `knowledge-base.article_created` | 使用者建立了一篇新文章（狀態為 draft） |
| `knowledge-base.article_published` | 文章從 draft 轉為公開 published |
| `knowledge-base.article_archived` | 文章被封存，不再對外顯示 |
| `knowledge-base.article_verified` | 知識管理員驗證了文章內容的準確性 |
| `knowledge-base.article_review_requested` | 文章被標記為需要重新複核（verificationState = needs_review） |
| `knowledge-base.category_created` | 新分類目錄被建立 |
| `knowledge-base.category_moved` | 分類被移動到新的父分類下 |
````

## File: modules/knowledge-collaboration/AGENT.md
````markdown
# knowledge-collaboration BC Agent

## 模組職責

此 BC 負責知識協作能力：Comment（留言）、Permission（存取權限）、Version（版本快照）。

- **不擁有** 知識內容（Page / Article）。
- 透過 `contentId` 引用內容，而非持有內容聚合。
- 跨 BC 協作必須透過 `modules/knowledge/api` 與 `modules/knowledge-base/api`。

## 核心聚合

| 聚合 | 職責 |
|---|---|
| `Comment` | 針對 contentId 的線程式留言 |
| `Permission` | contentId + principalId 的存取層級 |
| `Version` | contentId 的 Block 快照版本 |

## 邊界規則

- 此 BC **不得**直接 import `knowledge` 或 `knowledge-base` 內部層。
- `contentId` 可以是 pageId 或 articleId，由上層呼叫者決定語境。
- Permission 級別：`view` < `comment` < `edit` < `full`。

## 開發狀態

📅 Planned — 設計階段。代碼實作待後續 PR。
````

## File: modules/knowledge-collaboration/aggregates.md
````markdown
# Aggregates — knowledge-collaboration

---

## Comment（留言）— 聚合根

```typescript
interface Comment {
  id: string;
  contentId: string;                    // pageId or articleId (cross-BC reference)
  contentType: "page" | "article";      // which BC owns the content
  workspaceId: string;
  accountId: string;

  authorId: string;
  body: string;                         // Plain text or Markdown
  parentCommentId: string | null;       // null = root comment (thread start)

  resolvedAt: string | null;            // ISO — null = unresolved
  resolvedByUserId: string | null;

  createdAtISO: string;
  updatedAtISO: string;
}
```

### Comment 業務規則

- `parentCommentId` 只允許一層深度（回覆只在 root comment 下）。
- 刪除留言只清空 `body`（設為 `[deleted]`），不實際移除 ID。
- `resolvedAt` 設定後不可撤銷（由新留言繼續討論）。

---

## Permission（存取權限）— 聚合根

```typescript
type PermissionLevel = "view" | "comment" | "edit" | "full";
type PermissionSubjectType = "page" | "article" | "database";

interface Permission {
  id: string;
  subjectId: string;                    // contentId (pageId / articleId / databaseId)
  subjectType: PermissionSubjectType;
  workspaceId: string;
  accountId: string;

  principalId: string;                  // userId or teamId
  principalType: "user" | "team";
  level: PermissionLevel;               // view < comment < edit < full

  grantedByUserId: string;
  grantedAtISO: string;
  expiresAtISO: string | null;          // null = permanent
}
```

### Permission 業務規則

- 一個 (subjectId, principalId) 對只能有一個 Permission 記錄（upsert）。
- `full` 級別的使用者可以授予他人最多 `edit` 級別（不可超過自身）。
- 繼承：Workspace 級別的 Permission 可視為所有內容的隱式 Permission。

---

## Version（版本快照）— 聚合根

```typescript
interface Version {
  id: string;
  contentId: string;                    // pageId or articleId
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;

  snapshotBlocks: unknown[];            // JSON snapshot of all blocks at this point
  label: string | null;                 // Optional human-readable label ("v1.0", "Before redesign")
  description: string | null;

  createdByUserId: string;
  createdAtISO: string;
}
```

### Version 業務規則

- Version 建立後為 immutable（不可修改快照）。
- 最多保留 100 個版本，超出時 FIFO 刪除最舊版本。
- `label` 使版本成為「具名版本」（named version），系統不自動刪除。
````

## File: modules/knowledge-collaboration/application-services.md
````markdown
# Application Services — knowledge-collaboration

---

## Comment Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateCommentUseCase` | contentId, contentType, authorId, body, parentCommentId? | `CommandResult<CommentId>` | 建立留言或回覆 |
| `UpdateCommentUseCase` | commentId, body | `CommandResult` | 編輯留言內容 |
| `DeleteCommentUseCase` | commentId, deletedByUserId | `CommandResult` | 軟刪除（清空 body） |
| `ResolveCommentUseCase` | commentId, resolvedByUserId | `CommandResult` | 標記留言為已解決 |
| `ListCommentsUseCase` | contentId, contentType | `CommandResult<Comment[]>` | 取得內容的所有留言 |

## Permission Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `GrantPermissionUseCase` | subjectId, subjectType, principalId, principalType, level | `CommandResult` | 授予或更新存取權限 |
| `RevokePermissionUseCase` | subjectId, principalId | `CommandResult` | 移除存取權限 |
| `CheckPermissionUseCase` | subjectId, userId | `CommandResult<PermissionLevel>` | 查詢使用者對某內容的最高權限 |
| `ListPermissionsUseCase` | subjectId, subjectType | `CommandResult<Permission[]>` | 列出某內容的所有授權 |

## Version Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateVersionUseCase` | contentId, contentType, snapshotBlocks, label? | `CommandResult<VersionId>` | 建立版本快照 |
| `RestoreVersionUseCase` | versionId, restoredByUserId | `CommandResult` | 還原到特定版本（觸發 version_restored 事件） |
| `ListVersionsUseCase` | contentId, contentType | `CommandResult<Version[]>` | 列出版本歷史 |
| `LabelVersionUseCase` | versionId, label | `CommandResult` | 為版本設定具名標籤 |
````

## File: modules/knowledge-collaboration/context-map.md
````markdown
# Context Map — knowledge-collaboration

---

## 上游依賴（knowledge-collaboration 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | contentId 必須屬於某 Workspace |
| `identity` | **Conformist** | 驗證 authorId / principalId 是否存在 |
| `knowledge` | **Customer / Supplier** | 使用 pageId 作為 contentId 引用來源 |
| `knowledge-base` | **Customer / Supplier** | 使用 articleId 作為 contentId 引用來源 |
| `knowledge-database` | **Customer / Supplier** | 使用 databaseId 作為 subjectId（Permission） |

---

## 下游影響（downstream BCs 依賴 knowledge-collaboration）

| BC | 關係類型 | 說明 |
|---|---|---|
| `notification` | **Published Language** | `comment_created`、`page_locked` 等事件觸發通知 |
| `workspace-feed` | **Published Language** | `version_published` 推送工作區動態 |
| `workspace-audit` | **Published Language** | `permission_changed` 寫入稽核紀錄 |

---

## 整合事件流

```
knowledge.page_updated
  → (application layer) CreateVersionUseCase
  → knowledge-collaboration.version_created

knowledge-collaboration.permission_changed
  → workspace-audit (append-only log)
  → notification (if permission revoked, user notified)

knowledge-collaboration.comment_created
  → notification (content owner notified)
  → workspace-feed (activity feed)
```

---

## 邊界規則

- 此 BC 使用 `contentId` 作為 opaque reference，不 import 其他 BC 的 domain 層。
- Version 快照中的 `snapshotBlocks` 是 `unknown[]`（不依賴 `knowledge` Block 型別）。
- Permission 授予不超過授予者自身的 Permission 級別。
````

## File: modules/knowledge-collaboration/domain-events.md
````markdown
# Domain Events — knowledge-collaboration

> 事件採用 discriminated-union pattern，頂層欄位，無 payload wrapper。

---

## Comment 事件

### knowledge-collaboration.comment_created

```typescript
interface CommentCreatedEvent {
  type: "knowledge-collaboration.comment_created";
  commentId: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  authorId: string;
  parentCommentId: string | null;
  occurredAtISO: string;
}
```

### knowledge-collaboration.comment_resolved

```typescript
interface CommentResolvedEvent {
  type: "knowledge-collaboration.comment_resolved";
  commentId: string;
  contentId: string;
  workspaceId: string;
  resolvedByUserId: string;
  occurredAtISO: string;
}
```

---

## Permission 事件

### knowledge-collaboration.permission_granted

```typescript
interface PermissionGrantedEvent {
  type: "knowledge-collaboration.permission_granted";
  permissionId: string;
  subjectId: string;
  subjectType: string;
  workspaceId: string;
  accountId: string;
  principalId: string;
  principalType: "user" | "team";
  level: "view" | "comment" | "edit" | "full";
  grantedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-collaboration.permission_revoked

```typescript
interface PermissionRevokedEvent {
  type: "knowledge-collaboration.permission_revoked";
  subjectId: string;
  workspaceId: string;
  principalId: string;
  revokedByUserId: string;
  occurredAtISO: string;
}
```

---

## Version 事件

### knowledge-collaboration.version_created

```typescript
interface VersionCreatedEvent {
  type: "knowledge-collaboration.version_created";
  versionId: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  label: string | null;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-collaboration.version_restored

```typescript
interface VersionRestoredEvent {
  type: "knowledge-collaboration.version_restored";
  versionId: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  restoredByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-collaboration.page_locked

```typescript
interface PageLockedEvent {
  type: "knowledge-collaboration.page_locked";
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  lockedByUserId: string;
  lockExpiresAtISO: string;
  occurredAtISO: string;
}
```
````

## File: modules/knowledge-collaboration/domain-services.md
````markdown
# Domain Services — knowledge-collaboration

---

## PermissionLevelComparator

比較 Permission 級別的大小，用於驗證授予者不可超過自身權限。

```typescript
// modules/knowledge-collaboration/domain/services/PermissionLevelComparator.ts

export type PermissionLevel = "view" | "comment" | "edit" | "full";

const LEVEL_RANK: Record<PermissionLevel, number> = {
  view: 1,
  comment: 2,
  edit: 3,
  full: 4,
};

export class PermissionLevelComparator {
  isHigherOrEqual(a: PermissionLevel, b: PermissionLevel): boolean {
    return LEVEL_RANK[a] >= LEVEL_RANK[b];
  }

  validateGrant(granterLevel: PermissionLevel, targetLevel: PermissionLevel): void {
    if (!this.isHigherOrEqual(granterLevel, targetLevel)) {
      throw new Error(
        `Cannot grant ${targetLevel} permission: granter only has ${granterLevel}`
      );
    }
  }

  highest(levels: PermissionLevel[]): PermissionLevel {
    return levels.reduce((best, cur) =>
      LEVEL_RANK[cur] > LEVEL_RANK[best] ? cur : best
    );
  }
}
```

---

## VersionRetentionPolicy

管理版本保留策略，自動清理超出限制的舊版本（具名版本除外）。

```typescript
// modules/knowledge-collaboration/domain/services/VersionRetentionPolicy.ts

export class VersionRetentionPolicy {
  private static readonly MAX_VERSIONS = 100;

  /**
   * 返回應被刪除的版本 ID（不含具名版本）。
   * @param versions 依 createdAtISO 升序排列的版本列表
   */
  getVersionsToDelete(
    versions: Array<{ id: string; label: string | null }>
  ): string[] {
    const unnamed = versions.filter((v) => v.label === null);
    const excess = unnamed.length - VersionRetentionPolicy.MAX_VERSIONS;
    if (excess <= 0) return [];
    return unnamed.slice(0, excess).map((v) => v.id);
  }
}
```
````

## File: modules/knowledge-collaboration/interfaces/_actions/knowledge-collaboration.actions.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: interfaces/_actions
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { CreateCommentUseCase, UpdateCommentUseCase, ResolveCommentUseCase, DeleteCommentUseCase } from "../../application/use-cases/comment.use-cases";
import { CreateVersionUseCase, DeleteVersionUseCase } from "../../application/use-cases/version.use-cases";
import { GrantPermissionUseCase, RevokePermissionUseCase } from "../../application/use-cases/permission.use-cases";
import { FirebaseCommentRepository } from "../../infrastructure/firebase/FirebaseCommentRepository";
import { FirebaseVersionRepository } from "../../infrastructure/firebase/FirebaseVersionRepository";
import { FirebasePermissionRepository } from "../../infrastructure/firebase/FirebasePermissionRepository";
import type { CreateCommentDto, UpdateCommentDto, ResolveCommentDto, DeleteCommentDto, CreateVersionDto, DeleteVersionDto, GrantPermissionDto, RevokePermissionDto } from "../../application/dto/knowledge-collaboration.dto";
function makeCommentRepo()
function makeVersionRepo()
function makePermissionRepo()
export async function createComment(input: CreateCommentDto): Promise<CommandResult>
export async function updateComment(input: UpdateCommentDto): Promise<CommandResult>
export async function resolveComment(input: ResolveCommentDto): Promise<CommandResult>
export async function deleteComment(input: DeleteCommentDto): Promise<CommandResult>
export async function createVersion(input: CreateVersionDto): Promise<CommandResult>
export async function deleteVersion(input: DeleteVersionDto): Promise<CommandResult>
export async function grantPermission(input: GrantPermissionDto): Promise<CommandResult>
export async function revokePermission(input: RevokePermissionDto): Promise<CommandResult>
````

## File: modules/knowledge-collaboration/interfaces/components/CommentPanel.tsx
````typescript
import { useEffect, useRef, useState, useTransition } from "react";
import { MessageSquare, Send, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@ui-shadcn/ui/button";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  getComments,
} from "../queries/knowledge-collaboration.queries";
import {
  createComment,
  resolveComment,
  deleteComment,
} from "../_actions/knowledge-collaboration.actions";
import type { Comment } from "../../domain/entities/comment.entity";
interface CommentPanelProps {
  accountId: string;
  workspaceId: string;
  contentId: string;
  contentType: "page" | "article";
  currentUserId: string;
}
⋮----
function handlePost()
function handleResolve(commentId: string)
function handleDelete(commentId: string)
⋮----
{/* Comment input */}
⋮----
{/* Comment list */}
⋮----
onResolve=
⋮----
onDelete=
````

## File: modules/knowledge-collaboration/interfaces/queries/knowledge-collaboration.queries.ts
````typescript
/**
 * Module: knowledge-collaboration
 * Layer: interfaces/queries
 */
import type { Comment } from "../../domain/entities/comment.entity";
import type { Version } from "../../domain/entities/version.entity";
import type { Permission } from "../../domain/entities/permission.entity";
import { ListCommentsUseCase } from "../../application/use-cases/comment.use-cases";
import { ListVersionsUseCase } from "../../application/use-cases/version.use-cases";
import { ListPermissionsBySubjectUseCase } from "../../application/use-cases/permission.use-cases";
import { FirebaseCommentRepository } from "../../infrastructure/firebase/FirebaseCommentRepository";
import { FirebaseVersionRepository } from "../../infrastructure/firebase/FirebaseVersionRepository";
import { FirebasePermissionRepository } from "../../infrastructure/firebase/FirebasePermissionRepository";
export async function getComments(accountId: string, contentId: string): Promise<Comment[]>
export async function getVersions(accountId: string, contentId: string): Promise<Version[]>
export async function getPermissions(accountId: string, subjectId: string): Promise<Permission[]>
````

## File: modules/knowledge-collaboration/README.md
````markdown
# knowledge-collaboration — 知識協作、版本、權限管理

> **Domain Type:** **Supporting Subdomain + Generic Subdomain**（支撐域 + 泛用域）
> **模組路徑:** `modules/knowledge-collaboration/`
> **開發狀態:** 📅 Planned — 設計階段

## 在 Knowledge Platform 中的角色

`knowledge-collaboration` 負責知識協作的基礎設施：留言討論、存取權限管理、頁面版本快照。它不擁有知識內容本身，而是為 `knowledge`、`knowledge-base` 等內容 BC 提供協作能力。

## 主要職責

| 能力 | 說明 |
|---|---|
| Comment 留言 | 針對 Page / Article 的線程式留言討論 |
| Permission 權限 | 細粒度的內容存取控制（View/Comment/Edit/Full） |
| Version 版本快照 | Page / Article 的版本歷史（Block 快照） |
| 頁面鎖定 | 防止並發編輯的樂觀鎖機制 |

## 核心聚合

- **`Comment`**（留言）
- **`Permission`**（存取權限）
- **`Version`**（版本快照）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
````

## File: modules/knowledge-collaboration/repositories.md
````markdown
# Repositories — knowledge-collaboration

---

## ICommentRepository

```typescript
export interface ICommentRepository {
  getById(commentId: string): Promise<Comment>;
  listByContent(contentId: string, contentType: "page" | "article"): Promise<Comment[]>;
  save(comment: Comment): Promise<void>;
  softDelete(commentId: string): Promise<void>;
}
```

---

## IPermissionRepository

```typescript
export interface IPermissionRepository {
  get(subjectId: string, principalId: string): Promise<Permission | null>;
  listBySubject(subjectId: string, subjectType: string): Promise<Permission[]>;
  listByPrincipal(principalId: string, workspaceId: string): Promise<Permission[]>;
  save(permission: Permission): Promise<void>;
  revoke(subjectId: string, principalId: string): Promise<void>;
}
```

---

## IVersionRepository

```typescript
export interface IVersionRepository {
  getById(versionId: string): Promise<Version>;
  listByContent(
    contentId: string,
    contentType: "page" | "article",
    limit?: number
  ): Promise<Version[]>;
  save(version: Version): Promise<void>;
  deleteById(versionId: string): Promise<void>;
}
```

---

## Firestore Collection 設計

| Collection | Document ID | 說明 |
|---|---|---|
| `knowledge_comments` | `{commentId}` | Comment documents |
| `knowledge_permissions` | `{subjectId}_{principalId}` | Permission documents |
| `knowledge_versions` | `{versionId}` | Version snapshot documents |

### Index 需求（預計）

| Collection | Fields | Purpose |
|---|---|---|
| `knowledge_comments` | `contentId`, `contentType`, `createdAtISO` | Thread listing |
| `knowledge_permissions` | `subjectId`, `subjectType` | Permission dashboard |
| `knowledge_versions` | `contentId`, `contentType`, `createdAtISO` | Version history |
````

## File: modules/knowledge-collaboration/ubiquitous-language.md
````markdown
# Ubiquitous Language — knowledge-collaboration

---

## 核心術語

| 術語 | 定義 | 禁止混用 |
|---|---|---|
| **Comment**（留言） | 針對特定內容（Page/Article）的線程式留言或回覆 | Note, Message, Reply（Reply 是 Comment 的子集，不另外命名） |
| **Thread**（討論串） | 一個 root Comment 與其所有 Reply 組成的討論串 | Conversation, Discussion |
| **Permission**（權限） | 特定使用者或團隊對特定內容的存取授權記錄 | Role, Access, Right |
| **PermissionLevel**（權限級別） | `view` / `comment` / `edit` / `full` — 由低到高 | ReadOnly, Write, Admin |
| **Version**（版本快照） | 內容在某一時間點的完整 Block 快照 | Snapshot, Revision, Backup |
| **NamedVersion**（具名版本） | 附帶人工可讀標籤的版本，不被自動保留策略刪除 | Milestone, Tag |
| **contentId**（內容 ID） | 跨 BC 引用的 opaque ID，可為 pageId 或 articleId | ResourceId |
| **PageLock**（頁面鎖定） | 防止並發編輯的暫時性鎖定，有過期時間 | Lock, Mutex |

---

## 邊界詞彙對照

| 術語 | 此 BC 的含義 | 其他 BC 中的對應 |
|---|---|---|
| `Version` | Block 快照版本（點在時間線上的記錄） | `knowledge-base` 的 `version` number（樂觀鎖） |
| `Permission` | 存取授權記錄（誰可以對內容做什麼） | `workspace` 的 Membership（工作區成員身份） |
| `contentId` | 任意知識內容的 opaque ID（page/article/db） | `knowledge` 的 `pageId`、`knowledge-base` 的 `articleId` |

---

## 事件語言

| 事件 | 語意 |
|---|---|
| `knowledge-collaboration.comment_created` | 使用者在某內容上留下留言 |
| `knowledge-collaboration.comment_resolved` | 留言討論串被標記為已解決 |
| `knowledge-collaboration.permission_granted` | 使用者被授予某內容的存取權限 |
| `knowledge-collaboration.permission_revoked` | 使用者的存取權限被移除 |
| `knowledge-collaboration.version_created` | 系統或使用者建立了內容的版本快照 |
| `knowledge-collaboration.version_restored` | 內容被還原到特定版本 |
| `knowledge-collaboration.page_locked` | 內容被鎖定，防止並發編輯 |
````

## File: modules/knowledge-database/AGENT.md
````markdown
# knowledge-database BC Agent

## 模組職責

此 BC 提供結構化資料庫能力：Database（欄位 Schema + 視圖容器）、Record（資料行）、View（視圖配置）。

對應概念：Notion Database、Airtable、Coda 的 Table 能力。

## 核心聚合

| 聚合 | 職責 |
|---|---|
| `Database` | 持有欄位 Schema 與視圖清單；整個 Database 的 invariant 邊界 |
| `Record` | 單行資料，持有各欄位的值（properties Map） |
| `View` | 視圖配置：type / filters / sorts / groupBy / visibleFields |

## 欄位類型（Field Types）

`text`, `number`, `select`, `multi_select`, `date`, `checkbox`, `url`, `email`, `relation`, `formula`, `rollup`

## 視圖類型（View Types）

`table`, `board`, `list`, `calendar`, `timeline`, `gallery`

## 邊界規則

- 此 BC **不得**直接 import `knowledge` / `knowledge-base` 的 domain 層。
- `Record` 的 `relation` 欄位儲存對方 Record 的 opaque ID（跨 Database）。
- View 的 filter/sort 操作在 application 層組裝查詢，不在 domain 層。

## 開發狀態

📅 Planned — 設計階段。代碼實作待後續 PR。
````

## File: modules/knowledge-database/aggregates.md
````markdown
# Aggregates — knowledge-database

---

## Database（資料庫）— 聚合根

Database 持有欄位 Schema 定義與視圖清單，是整個 Database 一致性的邊界。

```typescript
type FieldType =
  | "text" | "number" | "select" | "multi_select"
  | "date" | "checkbox" | "url" | "email"
  | "relation" | "formula" | "rollup";

interface Field {
  id: string;
  name: string;
  type: FieldType;
  config: Record<string, unknown>;      // per-type config (e.g. select options)
  required: boolean;
  order: number;
}

interface Database {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  description: string | null;
  fields: Field[];                       // Schema definition
  viewIds: string[];                     // Ordered list of View IDs
  icon: string | null;
  coverImageUrl: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Database 業務規則

- `fields` 至少一個欄位（預設 "Title" text 欄位）。
- 刪除 Field 前，所有 Record 的對應 `properties` 值需清除。
- `viewIds` 順序決定 UI 中的視圖顯示順序。

---

## Record（資料行）— 聚合根

```typescript
interface Record {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;

  properties: Map<string, unknown>;     // fieldId → value (typed by Field.type)
  order: number;                        // display sort order

  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Record 業務規則

- `properties` 的 key 必須是 Database.fields 中存在的 fieldId。
- `relation` 類型的 field value 是 `string[]`（關聯的 Record IDs）。
- Record 刪除（軟刪除）需保留 30 天供 Undo 操作。

---

## View（視圖）— 聚合根

```typescript
type ViewType = "table" | "board" | "list" | "calendar" | "timeline" | "gallery";

interface FilterRule {
  fieldId: string;
  operator: "eq" | "neq" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "gt" | "lt";
  value: unknown;
}

interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
}

interface GroupByConfig {
  fieldId: string;
  direction: "asc" | "desc";
}

interface View {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;

  name: string;
  type: ViewType;

  filters: FilterRule[];
  sorts: SortRule[];
  groupBy: GroupByConfig | null;

  visibleFieldIds: string[];            // Which fields to show (all = empty array)
  hiddenFieldIds: string[];             // Explicitly hidden fields

  boardGroupFieldId: string | null;     // For board view: which select field to group by
  calendarDateFieldId: string | null;   // For calendar view: which date field is the X-axis
  timelineStartFieldId: string | null;  // For timeline: start date field
  timelineEndFieldId: string | null;    // For timeline: end date field

  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```
````

## File: modules/knowledge-database/application-services.md
````markdown
# Application Services — knowledge-database

---

## Database Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateDatabaseUseCase` | name, workspaceId, accountId, fields? | `CommandResult<DatabaseId>` | 建立新 Database（含預設 Title 欄位） |
| `RenameDatabaseUseCase` | databaseId, name | `CommandResult` | 重新命名 |
| `AddFieldUseCase` | databaseId, fieldConfig | `CommandResult<FieldId>` | 新增欄位到 Schema |
| `UpdateFieldUseCase` | databaseId, fieldId, fieldConfig | `CommandResult` | 更新欄位設定 |
| `DeleteFieldUseCase` | databaseId, fieldId | `CommandResult` | 刪除欄位（同步清除 Record 值） |
| `ReorderFieldsUseCase` | databaseId, fieldIds | `CommandResult` | 重新排列欄位順序 |

## View Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateViewUseCase` | databaseId, name, type | `CommandResult<ViewId>` | 新增視圖 |
| `UpdateViewFiltersUseCase` | viewId, filters | `CommandResult` | 更新過濾條件 |
| `UpdateViewSortsUseCase` | viewId, sorts | `CommandResult` | 更新排序規則 |
| `UpdateViewGroupByUseCase` | viewId, groupBy | `CommandResult` | 更新分組設定 |
| `HideFieldsInViewUseCase` | viewId, fieldIds | `CommandResult` | 隱藏特定欄位 |
| `DeleteViewUseCase` | viewId | `CommandResult` | 刪除視圖（至少保留 1 個視圖） |

## Record Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `AddRecordUseCase` | databaseId, properties | `CommandResult<RecordId>` | 新增資料行 |
| `UpdateRecordUseCase` | recordId, properties | `CommandResult` | 更新欄位值（partial update） |
| `DeleteRecordUseCase` | recordId | `CommandResult` | 軟刪除資料行 |
| `LinkRecordsUseCase` | recordId, fieldId, targetRecordId | `CommandResult` | 建立 Relation 連結 |
| `UnlinkRecordsUseCase` | recordId, fieldId, targetRecordId | `CommandResult` | 移除 Relation 連結 |
| `QueryRecordsUseCase` | databaseId, viewId | `CommandResult<Record[]>` | 依視圖 filter/sort/groupBy 查詢 |
````

## File: modules/knowledge-database/context-map.md
````markdown
# Context Map — knowledge-database

---

## 上游依賴（knowledge-database 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | Database 必須屬於 Workspace |
| `organization` | **Conformist** | 多租戶邊界由 accountId 維護 |
| `identity` | **Conformist** | 驗證操作者身份 |
| `knowledge-collaboration` | **Customer / Supplier** | Permission 控制 Database/Record 存取權限 |

---

## 下游影響（downstream BCs 依賴 knowledge-database）

| BC | 關係類型 | 說明 |
|---|---|---|
| `knowledge-base` | **Open Host Service** | Article 可透過 Relation 欄位 link 到 Database Record |
| `knowledge` | **Open Host Service** | Page 中可嵌入 Database（inline database） |
| `workspace-feed` | **Published Language** | `record_added` 等事件推送工作區動態 |
| `workspace-flow` | **Anti-Corruption Layer** | Task 可 link 到 Database Record（ACL 保護） |
| `notification` | **Published Language** | Record 更新可觸發通知 |

---

## 整合事件流

```
knowledge-database.database_created
  → workspace (register database in workspace content tree)

knowledge-database.record_linked
  → (if linked to article) knowledge-base (update backlink index)
  → workspace-feed (activity)

knowledge-collaboration.permission_granted (subjectType="database")
  → knowledge-database (check permission on record access)
```

---

## 邊界規則

- `Relation` 欄位的 targetRecordId 是 opaque reference — 不 import 目標的 domain 型別。
- Database Schema 變更（刪除 Field）必須同步更新所有 Record（由 application 層協調）。
- View 不擁有資料，只持有展示配置。
````

## File: modules/knowledge-database/domain-events.md
````markdown
# Domain Events — knowledge-database

---

## Database 事件

### knowledge-database.database_created

```typescript
interface DatabaseCreatedEvent {
  type: "knowledge-database.database_created";
  databaseId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.database_renamed

```typescript
interface DatabaseRenamedEvent {
  type: "knowledge-database.database_renamed";
  databaseId: string;
  workspaceId: string;
  name: string;
  renamedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.field_added

```typescript
interface FieldAddedEvent {
  type: "knowledge-database.field_added";
  databaseId: string;
  fieldId: string;
  fieldName: string;
  fieldType: string;
  addedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.field_deleted

```typescript
interface FieldDeletedEvent {
  type: "knowledge-database.field_deleted";
  databaseId: string;
  fieldId: string;
  deletedByUserId: string;
  occurredAtISO: string;
}
```

---

## Record 事件

### knowledge-database.record_added

```typescript
interface RecordAddedEvent {
  type: "knowledge-database.record_added";
  recordId: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  addedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.record_updated

```typescript
interface RecordUpdatedEvent {
  type: "knowledge-database.record_updated";
  recordId: string;
  databaseId: string;
  workspaceId: string;
  updatedFields: string[];              // fieldIds that changed
  updatedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.record_deleted

```typescript
interface RecordDeletedEvent {
  type: "knowledge-database.record_deleted";
  recordId: string;
  databaseId: string;
  workspaceId: string;
  deletedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.record_linked

```typescript
interface RecordLinkedEvent {
  type: "knowledge-database.record_linked";
  recordId: string;
  fieldId: string;
  targetRecordId: string;
  databaseId: string;
  workspaceId: string;
  linkedByUserId: string;
  occurredAtISO: string;
}
```

---

## View 事件

### knowledge-database.view_created

```typescript
interface ViewCreatedEvent {
  type: "knowledge-database.view_created";
  viewId: string;
  databaseId: string;
  workspaceId: string;
  viewName: string;
  viewType: string;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-database.view_updated

```typescript
interface ViewUpdatedEvent {
  type: "knowledge-database.view_updated";
  viewId: string;
  databaseId: string;
  workspaceId: string;
  changedSettings: string[];            // e.g. ["filters", "sorts", "groupBy"]
  updatedByUserId: string;
  occurredAtISO: string;
}
```
````

## File: modules/knowledge-database/domain-services.md
````markdown
# Domain Services — knowledge-database

---

## FieldValueValidator

驗證 Record 的 properties 值是否符合 Field 的類型規範。

```typescript
// modules/knowledge-database/domain/services/FieldValueValidator.ts

export class FieldValueValidator {
  validate(field: Field, value: unknown): void {
    switch (field.type) {
      case "number":
        if (value !== null && typeof value !== "number") {
          throw new Error(`Field "${field.name}" expects a number`);
        }
        break;
      case "checkbox":
        if (typeof value !== "boolean") {
          throw new Error(`Field "${field.name}" expects a boolean`);
        }
        break;
      case "date":
        if (value !== null && typeof value !== "string") {
          throw new Error(`Field "${field.name}" expects an ISO date string`);
        }
        break;
      case "select":
        const options: string[] = (field.config.options as string[]) ?? [];
        if (value !== null && !options.includes(value as string)) {
          throw new Error(`"${value}" is not a valid option for field "${field.name}"`);
        }
        break;
      default:
        // text, url, email, multi_select, relation, formula, rollup — validated at boundary
        break;
    }
  }
}
```

---

## ViewQueryBuilder

將 View 的 filter / sort / groupBy 配置轉換為查詢參數，供 Repository 執行。

```typescript
// modules/knowledge-database/domain/services/ViewQueryBuilder.ts

export class ViewQueryBuilder {
  buildQuery(view: View, records: DatabaseRecord[]): DatabaseRecord[] {
    let result = [...records];

    // Apply filters
    for (const filter of view.filters) {
      result = result.filter((record) =>
        this.applyFilter(record, filter)
      );
    }

    // Apply sorts
    for (const sort of [...view.sorts].reverse()) {
      result.sort((a, b) => {
        const aVal = a.properties.get(sort.fieldId);
        const bVal = b.properties.get(sort.fieldId);
        const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }

  private applyFilter(record: DatabaseRecord, filter: FilterRule): boolean {
    const value = record.properties.get(filter.fieldId);
    switch (filter.operator) {
      case "eq": return value === filter.value;
      case "neq": return value !== filter.value;
      case "is_empty": return value === null || value === undefined || value === "";
      case "is_not_empty": return value !== null && value !== undefined && value !== "";
      default: return true;
    }
  }
}
```
````

## File: modules/knowledge-database/infrastructure/firebase/FirebaseDatabaseRepository.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/knowledgeDatabases/{databaseId}
 */
import {
  arrayUnion, collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { Database, Field, FieldType } from "../../domain/entities/database.entity";
import type {
  IDatabaseRepository,
  CreateDatabaseInput,
  UpdateDatabaseInput,
  AddFieldInput,
} from "../../domain/repositories/IDatabaseRepository";
function dbsCol(db: ReturnType<typeof getFirestore>, accountId: string)
function dbDoc(db: ReturnType<typeof getFirestore>, accountId: string, databaseId: string)
function toField(f: Record<string, unknown>): Field
function toDatabase(id: string, data: Record<string, unknown>): Database
export class FirebaseDatabaseRepository implements IDatabaseRepository {
⋮----
private db()
async create(input: CreateDatabaseInput): Promise<Database>
async update(input: UpdateDatabaseInput): Promise<Database | null>
async addField(input: AddFieldInput): Promise<Database | null>
async archive(accountId: string, databaseId: string): Promise<void>
async findById(accountId: string, databaseId: string): Promise<Database | null>
async listByWorkspace(accountId: string, workspaceId: string): Promise<Database[]>
````

## File: modules/knowledge-database/README.md
````markdown
# knowledge-database — 結構化資料庫與視圖管理

> **Domain Type:** **Supporting Subdomain**（支撐域）
> **模組路徑:** `modules/knowledge-database/`
> **開發狀態:** 📅 Planned — 設計階段

## 在 Knowledge Platform 中的角色

`knowledge-database` 對應 Notion Database 概念，提供結構化資料儲存與多視圖展示能力。使用者可定義欄位 Schema，以 Table / Board / Calendar / Timeline / Gallery / List 等視圖檢視資料。

## 主要職責

| 能力 | 說明 |
|---|---|
| Database Schema 管理 | 定義欄位類型（text/number/select/date/relation 等） |
| Record 資料管理 | 建立、更新、刪除結構化資料行 |
| View 視圖配置 | 每個 Database 可有多個視圖，各有自己的 filter/sort/groupBy |
| Relation 欄位 | Record 間的跨 Database 關聯（Relation 欄位類型） |

## 核心聚合

- **`Database`**（資料庫容器 + 欄位 Schema）
- **`Record`**（資料行）
- **`View`**（視圖配置）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
````

## File: modules/knowledge-database/repositories.md
````markdown
# Repositories — knowledge-database

---

## IDatabaseRepository

```typescript
export interface IDatabaseRepository {
  getById(databaseId: string): Promise<Database>;
  listByWorkspace(workspaceId: string, accountId: string): Promise<Database[]>;
  save(database: Database): Promise<void>;
  delete(databaseId: string): Promise<void>;
}
```

---

## IRecordRepository

```typescript
export interface IRecordRepository {
  getById(recordId: string): Promise<DatabaseRecord>;
  listByDatabase(params: {
    databaseId: string;
    filters?: FilterRule[];
    sorts?: SortRule[];
    limit?: number;
    cursor?: string;
  }): Promise<DatabaseRecord[]>;
  save(record: DatabaseRecord): Promise<void>;
  softDelete(recordId: string): Promise<void>;
  getByIds(recordIds: string[]): Promise<DatabaseRecord[]>;
}
```

---

## IViewRepository

```typescript
export interface IViewRepository {
  getById(viewId: string): Promise<View>;
  listByDatabase(databaseId: string): Promise<View[]>;
  save(view: View): Promise<void>;
  delete(viewId: string): Promise<void>;
}
```

---

## Firestore Collection 設計

| Collection | Document ID | 說明 |
|---|---|---|
| `knowledge_databases` | `{databaseId}` | Database documents（含 fields schema） |
| `knowledge_db_records` | `{recordId}` | Record documents |
| `knowledge_db_views` | `{viewId}` | View configuration documents |

### Index 需求（預計）

| Collection | Fields | Purpose |
|---|---|---|
| `knowledge_databases` | `workspaceId`, `createdAtISO` | Workspace database list |
| `knowledge_db_records` | `databaseId`, `order` | Default record ordering |
| `knowledge_db_views` | `databaseId` | Views per database |
````

## File: modules/knowledge-database/ubiquitous-language.md
````markdown
# Ubiquitous Language — knowledge-database

---

## 核心術語

| 術語 | 定義 | 禁止混用 |
|---|---|---|
| **Database**（資料庫） | 結構化資料容器，持有 Field Schema 與 View 清單 | Collection, Table, Spreadsheet |
| **Field**（欄位） | Database Schema 中的單一欄位定義（含類型與設定） | Column, Attribute, Property |
| **FieldType**（欄位類型） | `text`/`number`/`select`/`date`/`checkbox`/`url`/`email`/`relation`/`formula`/`rollup` | DataType |
| **Record**（資料行） | Database 中的單一資料條目，持有各欄位的值（properties） | Row, Entry, Item |
| **Property**（屬性值） | Record 中某 Field 的具體值（Map fieldId → value） | Cell, Value, Data |
| **View**（視圖） | Database 的展示配置：type + filters + sorts + groupBy | Tab, Screen, Layout |
| **ViewType**（視圖類型） | `table`/`board`/`list`/`calendar`/`timeline`/`gallery` | Format, Mode |
| **Filter**（過濾條件） | 視圖中的資料篩選規則（fieldId + operator + value） | Query, Where |
| **Sort**（排序規則） | 視圖中的排序設定（fieldId + direction） | Order, OrderBy |
| **GroupBy**（分組依據） | 視圖中的分組設定（通常用於 board 視圖的 select 欄位） | Cluster, Group |
| **Relation**（關聯） | Field 類型之一，連結另一個 Database 的 Record | ForeignKey, Link |
| **BoardGroupField**（看板分組欄位） | Board 視圖中作為列（Column）依據的 select 欄位 | KanbanField |

---

## 邊界詞彙對照

| 術語 | 此 BC 的含義 | 其他 BC 中的對應 |
|---|---|---|
| `Database` | 結構化資料容器 | 舊版 `KnowledgeCollection`（spaceType="database"）|
| `Record` | 資料行 | --- |
| `View` | 視圖配置 | --- |
| `properties` | Record 的欄位值 Map | `knowledge` Block 的 `content` 欄位 |

---

## 事件語言

| 事件 | 語意 |
|---|---|
| `knowledge-database.database_created` | 使用者建立新的 Database |
| `knowledge-database.field_added` | Database Schema 新增欄位 |
| `knowledge-database.record_added` | 新增一行資料 |
| `knowledge-database.record_updated` | 資料行的欄位值更新 |
| `knowledge-database.record_linked` | 資料行透過 Relation 欄位連結到另一 Record |
| `knowledge-database.view_created` | 新增一個 Database 視圖 |
| `knowledge-database.view_updated` | 視圖的 filter/sort/groupBy 設定變更 |
````

## File: modules/knowledge/application/dto/knowledge.dto.ts
````typescript
/**
 * Module: knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for Content use cases.
 */
import { z } from "@lib-zod";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";
import { KNOWLEDGE_PAGE_STATUSES, PAGE_VERIFICATION_STATES } from "../../domain/entities/content-page.entity";
⋮----
export type BlockContentDto = z.infer<typeof BlockContentSchema>;
⋮----
export type CreateKnowledgePageDto = z.infer<typeof CreateKnowledgePageSchema>;
⋮----
export type RenameKnowledgePageDto = z.infer<typeof RenameKnowledgePageSchema>;
⋮----
export type MoveKnowledgePageDto = z.infer<typeof MoveKnowledgePageSchema>;
⋮----
export type ArchiveKnowledgePageDto = z.infer<typeof ArchiveKnowledgePageSchema>;
⋮----
export type ReorderKnowledgePageBlocksDto = z.infer<typeof ReorderKnowledgePageBlocksSchema>;
⋮----
export type AddKnowledgeBlockDto = z.infer<typeof AddKnowledgeBlockSchema>;
⋮----
export type UpdateKnowledgeBlockDto = z.infer<typeof UpdateKnowledgeBlockSchema>;
⋮----
export type DeleteKnowledgeBlockDto = z.infer<typeof DeleteKnowledgeBlockSchema>;
⋮----
export type CreateKnowledgeVersionDto = z.infer<typeof CreateKnowledgeVersionSchema>;
⋮----
// ── Approve content page ──────────────────────────────────────────────────────
⋮----
/**
   * causationId identifies the command (use-case invocation) that caused the
   * resulting event.  Generated by the Server Action layer if not provided by
   * the caller, so that command-event causality is correctly traceable.
   */
⋮----
/** Optional: external tasks extracted by AI from this page. */
⋮----
/** Optional: external invoices extracted by AI from this page. */
⋮----
/**
   * Correlation ID tracing the entire ingestion → approval → materialization flow.
   * Generated by the caller if not provided (e.g. first action in the flow).
   */
⋮----
/** Optional: workspaceId to include in the published event. */
⋮----
export type ApproveKnowledgePageDto = z.infer<typeof ApproveKnowledgePageSchema>;
// ── Collection DTOs ───────────────────────────────────────────────────────────
⋮----
export type CollectionColumnTypeDto = z.infer<typeof CollectionColumnTypeSchema>;
⋮----
export type CollectionColumnInputDto = z.infer<typeof CollectionColumnInputSchema>;
⋮----
export type CreateKnowledgeCollectionDto = z.infer<typeof CreateKnowledgeCollectionSchema>;
⋮----
export type RenameKnowledgeCollectionDto = z.infer<typeof RenameKnowledgeCollectionSchema>;
⋮----
export type AddPageToCollectionDto = z.infer<typeof AddPageToCollectionSchema>;
⋮----
export type RemovePageFromCollectionDto = z.infer<typeof RemovePageFromCollectionSchema>;
⋮----
export type AddCollectionColumnDto = z.infer<typeof AddCollectionColumnSchema>;
⋮----
export type ArchiveKnowledgeCollectionDto = z.infer<typeof ArchiveKnowledgeCollectionSchema>;
// ── Wiki / Knowledge Base DTOs ────────────────────────────────────────────────
⋮----
/** ISO 8601 — if set, page auto-transitions to "needs_review" after this date. */
⋮----
export type VerifyKnowledgePageDto = z.infer<typeof VerifyKnowledgePageSchema>;
⋮----
export type RequestPageReviewDto = z.infer<typeof RequestPageReviewSchema>;
⋮----
export type AssignPageOwnerDto = z.infer<typeof AssignPageOwnerSchema>;
⋮----
export type CreateWikiSpaceDto = z.infer<typeof CreateWikiSpaceSchema>;
````

## File: modules/knowledge/context-map.md
````markdown
# Context Map — knowledge

> `knowledge` BC 僅負責個人筆記的 Page 與 Block 管理。組織知識、版本協作、結構化資料庫由三個姊妹 BC 負責。

---

## 上游依賴（knowledge 依賴）

| BC | 關係類型 | 說明 |
|---|---|---|
| `workspace` | **Conformist** | Page 必須屬於 Workspace |
| `organization` | **Conformist** | 多租戶邊界由 accountId 維護 |
| `identity` | **Conformist** | 驗證 createdByUserId 是否存在 |

---

## 下游影響（downstream BCs 依賴 knowledge）

| BC | 關係類型 | 說明 |
|---|---|---|
| `knowledge-base` | **Customer / Supplier** | Page 可透過 Promote 流程成為 Article（跨 BC 操作） |
| `knowledge-collaboration` | **Customer / Supplier** | 使用 pageId 作為 contentId，提供 Comment / Version / Permission |
| `workspace-feed` | **Published Language** | `knowledge.page_published` 推送工作區動態 |
| `workspace-audit` | **Published Language** | `knowledge.page_approved` 寫入稽核紀錄 |
| `notification` | **Published Language** | Page 審核相關事件觸發通知 |

---

## 姊妹 BC 邊界說明（Knowledge Family）

| BC | 職責邊界 |
|---|---|
| `knowledge` | **個人筆記** - Page + Block（草稿、私人頁面） |
| `knowledge-base` | **組織知識庫** - Article + Category（公開 Wiki / SOP） |
| `knowledge-collaboration` | **協作基礎設施** - Comment / Permission / Version |
| `knowledge-database` | **結構化資料** - Database / Record / View |

---

## 整合事件流

```
knowledge.page_created
  → (auto) knowledge-collaboration.version_created (initial snapshot)

knowledge.page_approved
  → workspace-audit (append-only log)
  → notification (author notified)

knowledge.page_published (optional)
  → workspace-feed (activity)

user action: Promote Page → Article
  → knowledge-base.article_created (new article with page content)
  (knowledge 本身不發出跨 BC 事件，由 application 層協調)
```

---

## 邊界規則

- `knowledge` **不得** import `knowledge-base`、`knowledge-collaboration`、`knowledge-database` 的 domain 層。
- `knowledge-collaboration` 透過 `modules/knowledge/api` 取得 pageId，不讀取 Page 內部。
- `approvalState` 屬於 Page 生命週期，保留在此 BC（非 collaboration 的 Permission 概念）。
````

## File: modules/knowledge/domain-services.md
````markdown
# Domain Services — knowledge

> `knowledge` BC 目前無需獨立的 Domain Service。業務規則已內聚於 Page / Block 聚合根本身。

---

## 現況

此 BC（個人筆記 Page + Block）的業務規則較單純，目前無需提取獨立的 Domain Service。

邏輯由以下層次處理：

| 層次 | 負責內容 |
|---|---|
| Page entity | `approvalState` 狀態機轉換、Block 順序管理 |
| Use Cases | 跨 Use Case 協調（CreatePage + initial Block） |
| Repository | 樂觀鎖（version 欄位） |

---

## 潛在未來 Domain Services（待需求出現再提取）

| 候選 Service | 觸發條件 |
|---|---|
| `PageApprovalService` | 若 approval 流程複雜化（多步驟審批、代理審批） |
| `BlockOrderService` | 若 Block 排序規則複雜化（fractional indexing） |
| `PageDuplicatorService` | 若 Page 複製需要深度 Block 複製邏輯 |

---

## 跨 BC Domain Services（不在此 BC）

| Service | 所屬 BC |
|---|---|
| `BacklinkExtractorService` | `knowledge-base` |
| `PermissionLevelComparator` | `knowledge-collaboration` |
| `FieldValueValidator` | `knowledge-database` |
| `ViewQueryBuilder` | `knowledge-database` |
````

## File: modules/knowledge/domain/entities/knowledge-collection.entity.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: KnowledgeCollection — a named grouping / database-view of KnowledgePages.
 *
 * A Collection is the "Notion Database" equivalent: it holds a set of page IDs
 * and an ordered schema of columns that define how those pages are displayed
 * as a structured table or board.
 *
 * Lifecycle:
 *   active → archived
 */
// ── Column (schema field) ─────────────────────────────────────────────────────
export type CollectionColumnType =
  | "text"
  | "number"
  | "select"
  | "multi-select"
  | "date"
  | "checkbox"
  | "url"
  | "relation";
export interface CollectionColumn {
  readonly id: string;
  readonly name: string;
  readonly type: CollectionColumnType;
  /** Options for select / multi-select columns */
  readonly options?: readonly string[];
}
⋮----
/** Options for select / multi-select columns */
⋮----
// ── Aggregate Root ────────────────────────────────────────────────────────────
export type CollectionStatus = "active" | "archived";
/**
 * "database" = Notion-style Database (table / board / gallery with column schema).
 * "wiki"     = Knowledge Base space — pages carry verification + ownership metadata.
 */
export type CollectionSpaceType = "database" | "wiki";
export interface KnowledgeCollection {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  /** Ordered list of column schema definitions */
  readonly columns: readonly CollectionColumn[];
  /** IDs of KnowledgePages that belong to this collection */
  readonly pageIds: readonly string[];
  readonly status: CollectionStatus;
  /**
   * "database" = structured table/board with column schema (Notion Database).
   * "wiki"     = Knowledge Base space — enables page verification & ownership.
   */
  readonly spaceType: CollectionSpaceType;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
/** Ordered list of column schema definitions */
⋮----
/** IDs of KnowledgePages that belong to this collection */
⋮----
/**
   * "database" = structured table/board with column schema (Notion Database).
   * "wiki"     = Knowledge Base space — enables page verification & ownership.
   */
⋮----
// ── Input types ───────────────────────────────────────────────────────────────
export interface CreateKnowledgeCollectionInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns?: readonly Omit<CollectionColumn, "id">[];
  readonly createdByUserId: string;
  /** Defaults to "database" if omitted. */
  readonly spaceType?: CollectionSpaceType;
}
⋮----
/** Defaults to "database" if omitted. */
⋮----
export interface RenameKnowledgeCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly name: string;
}
export interface AddPageToCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly pageId: string;
}
export interface RemovePageFromCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly pageId: string;
}
export interface AddCollectionColumnInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly column: Omit<CollectionColumn, "id">;
}
export interface ArchiveKnowledgeCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
}
````

## File: modules/knowledge/domain/index.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/barrel
 */
⋮----
// ── KnowledgeCollection ───────────────────────────────────────────────────────
````

## File: modules/knowledge/domain/repositories/knowledge.repositories.ts
````typescript
/**
 * Module: knowledge
 * Layer: domain/repositories
 * Purpose: Repository port interfaces for Content domain persistence.
 */
import type {
  KnowledgePage,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ApproveKnowledgePageInput,
  VerifyKnowledgePageInput,
  RequestPageReviewInput,
  AssignPageOwnerInput,
} from "../entities/content-page.entity";
import type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
} from "../entities/content-block.entity";
import type {
  KnowledgeVersion,
  CreateKnowledgeVersionInput,
} from "../entities/content-version.entity";
import type {
  KnowledgeCollection,
  CreateKnowledgeCollectionInput,
  RenameKnowledgeCollectionInput,
  AddPageToCollectionInput,
  RemovePageFromCollectionInput,
  AddCollectionColumnInput,
  ArchiveKnowledgeCollectionInput,
} from "../entities/knowledge-collection.entity";
export interface KnowledgePageRepository {
  create(input: CreateKnowledgePageInput): Promise<KnowledgePage>;
  rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null>;
  move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null>;
  reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null>;
  archive(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  /** Mark a page as approved (approvalState = "approved"), stamping approvedAtISO. */
  approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null>;
  /** Mark a wiki page as verified (verificationState = "verified"). */
  verify(input: VerifyKnowledgePageInput): Promise<KnowledgePage | null>;
  /** Flag a wiki page for review (verificationState = "needs_review"). */
  requestReview(input: RequestPageReviewInput): Promise<KnowledgePage | null>;
  /** Assign or change the owner of a wiki page. */
  assignOwner(input: AssignPageOwnerInput): Promise<KnowledgePage | null>;
  findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
  listByAccountId(accountId: string): Promise<KnowledgePage[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
}
⋮----
create(input: CreateKnowledgePageInput): Promise<KnowledgePage>;
rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null>;
move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null>;
reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null>;
archive(accountId: string, pageId: string): Promise<KnowledgePage | null>;
/** Mark a page as approved (approvalState = "approved"), stamping approvedAtISO. */
approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null>;
/** Mark a wiki page as verified (verificationState = "verified"). */
verify(input: VerifyKnowledgePageInput): Promise<KnowledgePage | null>;
/** Flag a wiki page for review (verificationState = "needs_review"). */
requestReview(input: RequestPageReviewInput): Promise<KnowledgePage | null>;
/** Assign or change the owner of a wiki page. */
assignOwner(input: AssignPageOwnerInput): Promise<KnowledgePage | null>;
findById(accountId: string, pageId: string): Promise<KnowledgePage | null>;
listByAccountId(accountId: string): Promise<KnowledgePage[]>;
listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]>;
⋮----
export interface KnowledgeBlockRepository {
  add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock>;
  update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null>;
  delete(accountId: string, blockId: string): Promise<void>;
  findById(accountId: string, blockId: string): Promise<KnowledgeBlock | null>;
  listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]>;
}
⋮----
add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock>;
update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null>;
delete(accountId: string, blockId: string): Promise<void>;
findById(accountId: string, blockId: string): Promise<KnowledgeBlock | null>;
listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]>;
⋮----
export interface KnowledgeVersionRepository {
  create(input: CreateKnowledgeVersionInput): Promise<KnowledgeVersion>;
  findById(accountId: string, versionId: string): Promise<KnowledgeVersion | null>;
  listByPageId(accountId: string, pageId: string): Promise<KnowledgeVersion[]>;
}
⋮----
create(input: CreateKnowledgeVersionInput): Promise<KnowledgeVersion>;
findById(accountId: string, versionId: string): Promise<KnowledgeVersion | null>;
listByPageId(accountId: string, pageId: string): Promise<KnowledgeVersion[]>;
⋮----
export interface KnowledgeCollectionRepository {
  create(input: CreateKnowledgeCollectionInput): Promise<KnowledgeCollection>;
  rename(input: RenameKnowledgeCollectionInput): Promise<KnowledgeCollection | null>;
  addPage(input: AddPageToCollectionInput): Promise<KnowledgeCollection | null>;
  removePage(input: RemovePageFromCollectionInput): Promise<KnowledgeCollection | null>;
  addColumn(input: AddCollectionColumnInput): Promise<KnowledgeCollection | null>;
  archive(input: ArchiveKnowledgeCollectionInput): Promise<KnowledgeCollection | null>;
  findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>;
  listByAccountId(accountId: string): Promise<KnowledgeCollection[]>;
  listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>;
}
⋮----
create(input: CreateKnowledgeCollectionInput): Promise<KnowledgeCollection>;
rename(input: RenameKnowledgeCollectionInput): Promise<KnowledgeCollection | null>;
addPage(input: AddPageToCollectionInput): Promise<KnowledgeCollection | null>;
removePage(input: RemovePageFromCollectionInput): Promise<KnowledgeCollection | null>;
addColumn(input: AddCollectionColumnInput): Promise<KnowledgeCollection | null>;
archive(input: ArchiveKnowledgeCollectionInput): Promise<KnowledgeCollection | null>;
findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>;
listByAccountId(accountId: string): Promise<KnowledgeCollection[]>;
listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>;
````

## File: modules/knowledge/infrastructure/firebase/FirebaseContentCollectionRepository.ts
````typescript
/**
 * Module: knowledge
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of KnowledgeCollectionRepository.
 *
 * Firestore collection: accounts/{accountId}/knowledgeCollections/{collectionId}
 */
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type {
  KnowledgeCollection,
  CollectionColumn,
  CollectionStatus,
  CreateKnowledgeCollectionInput,
  RenameKnowledgeCollectionInput,
  AddPageToCollectionInput,
  RemovePageFromCollectionInput,
  AddCollectionColumnInput,
  ArchiveKnowledgeCollectionInput,
} from "../../domain/entities/knowledge-collection.entity";
import type { KnowledgeCollectionRepository } from "../../domain/repositories/knowledge.repositories";
function collectionsCol(db: ReturnType<typeof getFirestore>, accountId: string)
function collectionDoc(
  db: ReturnType<typeof getFirestore>,
  accountId: string,
  collectionId: string,
)
function toKnowledgeCollection(id: string, data: Record<string, unknown>): KnowledgeCollection
export class FirebaseKnowledgeCollectionRepository implements KnowledgeCollectionRepository {
⋮----
private get db()
async create(input: CreateKnowledgeCollectionInput): Promise<KnowledgeCollection>
async rename(input: RenameKnowledgeCollectionInput): Promise<KnowledgeCollection | null>
async addPage(input: AddPageToCollectionInput): Promise<KnowledgeCollection | null>
async removePage(input: RemovePageFromCollectionInput): Promise<KnowledgeCollection | null>
async addColumn(input: AddCollectionColumnInput): Promise<KnowledgeCollection | null>
async archive(input: ArchiveKnowledgeCollectionInput): Promise<KnowledgeCollection | null>
async findById(accountId: string, collectionId: string): Promise<KnowledgeCollection | null>
async listByAccountId(accountId: string): Promise<KnowledgeCollection[]>
async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgeCollection[]>
````

## File: modules/knowledge/interfaces/_actions/knowledge.actions.ts
````typescript
/**
 * Module: knowledge
 * Layer: interfaces/_actions
 * Purpose: Next.js Server Actions for Content domain mutations.
 */
import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
  ApproveKnowledgePageUseCase,
  VerifyKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
} from "../../application/use-cases/knowledge-page.use-cases";
import {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
} from "../../application/use-cases/knowledge-block.use-cases";
import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../application/use-cases/knowledge-collection.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseContentPageRepository";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../infrastructure/firebase/FirebaseContentCollectionRepository";
import { InMemoryEventStoreRepository, NoopEventBusRepository } from "@/modules/shared/api";
import { v7 as generateId } from "@lib-uuid";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  AddKnowledgeBlockDto,
  UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockDto,
  CreateKnowledgeVersionDto,
  ApproveKnowledgePageDto,
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
} from "../../application/dto/knowledge.dto";
function makePageRepo()
function makeBlockRepo()
function makeCollectionRepo()
export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult>
export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult>
export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult>
export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult>
export async function reorderKnowledgePageBlocks(
  input: ReorderKnowledgePageBlocksDto,
): Promise<CommandResult>
export async function addKnowledgeBlock(input: AddKnowledgeBlockDto): Promise<CommandResult>
export async function updateKnowledgeBlock(input: UpdateKnowledgeBlockDto): Promise<CommandResult>
export async function deleteKnowledgeBlock(input: DeleteKnowledgeBlockDto): Promise<CommandResult>
export async function publishKnowledgeVersion(
  _input: CreateKnowledgeVersionDto,
): Promise<CommandResult>
export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult>
⋮----
// causationId is generated at the action layer (command origin) to ensure
// proper command-event causality tracing as described in ADR-001.
⋮----
// ── Collection actions ────────────────────────────────────────────────────────
export async function createKnowledgeCollection(
  input: CreateKnowledgeCollectionDto,
): Promise<CommandResult>
export async function renameKnowledgeCollection(
  input: RenameKnowledgeCollectionDto,
): Promise<CommandResult>
export async function addPageToCollection(
  input: AddPageToCollectionDto,
): Promise<CommandResult>
export async function removePageFromCollection(
  input: RemovePageFromCollectionDto,
): Promise<CommandResult>
export async function addCollectionColumn(
  input: AddCollectionColumnDto,
): Promise<CommandResult>
export async function archiveKnowledgeCollection(
  input: ArchiveKnowledgeCollectionDto,
): Promise<CommandResult>
// ── Wiki / Knowledge Base verification actions ────────────────────────────────
export async function verifyKnowledgePage(input: VerifyKnowledgePageDto): Promise<CommandResult>
export async function requestKnowledgePageReview(
  input: RequestPageReviewDto,
): Promise<CommandResult>
export async function assignKnowledgePageOwner(
  input: AssignPageOwnerDto,
): Promise<CommandResult>
````

## File: modules/notebook/AGENT.md
````markdown
# AGENT.md — notebook BC

## 模組定位

`notebook` 是 AI 對話的支援域，管理 Thread/Message 生命週期並封裝 Genkit 呼叫。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Thread` | Conversation、Chat、Session |
| `Message` | ChatMessage、Msg |
| `MessageRole` | Role（單獨使用）、Speaker |
| `NotebookResponse` | AIResponse、GeneratedText |
| `NotebookRepository` | AIRepository、ChatRepository |

## 最重要規則：Server Action 隔離

```typescript
// ✅ 正確：在 app/(shell)/ai-chat/_actions.ts 中建立本地 action
"use server";
import { notebookApi } from "@/modules/notebook/api";
export async function generateResponse(input) {
  return notebookApi.generateResponse(input);
}

// ❌ 禁止：在 Client Component 直接 import notebook/api
// Genkit/gRPC 是 server-only，會導致打包失敗
import { notebookApi } from "@/modules/notebook/api"; // 在 "use client" 檔案中
```

## 邊界規則

### ✅ 允許
```typescript
// Server-side context only
import { notebookApi } from "@/modules/notebook/api";
import type { ThreadDTO, MessageDTO } from "@/modules/notebook/api";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/notebook/api/server.ts
````typescript
/**
 * modules/notebook — server-only API barrel.
 *
 * Exports concrete notebook implementations that depend on server-only
 * packages or infrastructure wiring.
 */
````

## File: modules/notebook/context-map.md
````markdown
# Context Map — notebook

## 上游（依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api` 取得語意相關 chunks（RAG retrieval）
- 用於 RAG-augmented 對話生成

### wiki → notebook（Customer/Supplier）

- `notebook` 可查詢 `wiki/api` 取得知識圖譜上下文（未來支援圖譜推理）

---

## 下游（被依賴）

### notebook → app/(shell)/ai-chat（Interfaces）

- AI Chat 頁面透過本地 `app/(shell)/ai-chat/_actions.ts` 呼叫 `notebook/api`
- **注意**：`notebook/api` barrel 不得在 Client Component 中直接 import（Genkit server-only）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| search → notebook | search | notebook | Customer/Supplier（同步查詢） |
| wiki → notebook | wiki | notebook | Customer/Supplier（同步查詢） |
| notebook → AI Chat UI | notebook | app/ | Anti-Corruption Layer（`app/(shell)/ai-chat/_actions.ts`） |
````

## File: modules/notebook/interfaces/_actions/notebook.actions.ts
````typescript
import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { Thread } from "../../domain/entities/thread";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "@/modules/search/api";
import { AnswerRagQueryUseCase } from "@/modules/search/api/server";
import { GenerateNotebookResponseUseCase } from "../../application/use-cases/generate-agent-response.use-case";
import { FirebaseRagRetrievalRepository } from "@/modules/search/api/server";
import { GenkitNotebookRepository } from "../../infrastructure/genkit/GenkitNotebookRepository";
import { GenkitRagGenerationRepository } from "@/modules/search/api/server";
import { FirebaseThreadRepository } from "../../infrastructure/firebase/FirebaseThreadRepository";
function makeThreadRepo()
export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult>
export async function answerRagQuery(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult>
export async function saveThread(accountId: string, thread: Thread): Promise<void>
export async function loadThread(accountId: string, threadId: string): Promise<Thread | null>
````

## File: modules/notebook/README.md
````markdown
# notebook — Notebook 對話上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/notebook/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notebook` 是 Xuanwu 的 NotebookLM-like 互動層，將檢索結果、知識內容與圖譜脈絡轉成對話、摘要、洞察與可引用回答。它是最接近使用者 AI 推理體驗的上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 對話 Thread 管理 | 維護對話串與訊息歷史 |
| 摘要 / 問答互動 | 把檢索結果轉成可閱讀、可追問的回答 |
| 引用式輸出 | 保留 citation / source trace，支撐可信回答 |

## 與其他 Bounded Context 協作

- `search` 是主要上游，提供語意檢索與引用資料。
- `knowledge` 與 `wiki` 提供被推理的內容與結構脈絡；`ai` 提供底層攝入能力。

## 核心聚合 / 核心概念

- **`Thread`**
- **`Message`**
- **`Summary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/notification/README.md
````markdown
# notification — 通知上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/notification/`  
> **開發狀態:** ✅ Done

## 在 Knowledge Platform / Second Brain 中的角色

`notification` 提供跨平台的通知分發能力，將知識、工作流程與工作區互動轉成使用者可感知的訊息。它是典型平台配套能力，但對協作效率與回應速度很重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 通知分發 | 發送 info / alert / success / warning 等系統訊息 |
| 事件轉訊息 | 把其他上下文的事件轉成使用者可消費的通知 |
| 通知偏好支撐 | 配合 `account` 與 `workspace` 的偏好設定輸出通知行為 |

## 與其他 Bounded Context 協作

- `workspace-feed`、`workspace-flow`、`workspace` 等上下文會觸發通知需求。
- `account` 提供使用者偏好與收件對象語意。

## 核心聚合 / 核心概念

- **`NotificationEntity`**
- **`NotificationPayload`**
- **`NotificationPreference`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/shared/aggregates.md
````markdown
# Aggregates — shared

## 注意

`shared` 是 Shared Kernel，不包含業務聚合根。它只提供基礎型別定義。

---

## 基礎介面：DomainEvent

```typescript
// modules/shared/domain/events.ts
interface DomainEvent {
  readonly type: string;       // discriminant: "module.action"
  readonly occurredAt: string; // ISO 8601 — 不是 Date，不是 occurredAtISO
}
```

**所有模組的領域事件介面都繼承此基礎介面。**

---

## 基礎介面：EventRecord

```typescript
// modules/shared/domain/event-record.ts
interface EventRecord {
  readonly eventId: string;    // UUID v4
  readonly occurredAt: string; // ISO 8601
  readonly actorId?: string;   // 操作者 ID（可選）
  readonly correlationId?: string;
  readonly causationId?: string;
}
```

---

## 工具型別

| 型別 / 工具 | 說明 |
|------------|------|
| `ID` | string alias，用於所有業務 ID |
| `Timestamp` | Firebase Timestamp 型別別名 |
| `domain/slug-utils.ts` | URL-safe slug 生成（`toSlug()`, `isValidSlug()`） |
````

## File: modules/source/README.md
````markdown
# source — 文件來源上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/source/`  
> **開發狀態:** 🚧 Developing

## 在 Knowledge Platform / Second Brain 中的角色

`source` 是 Knowledge Platform 的文件入口，承接 Notion-like 內容系統之外的外部文件、附件與來源治理。它負責讓知識進入平台，並安全地交給 `ai` 攝入管線處理。

## 主要職責

| 能力 | 說明 |
|---|---|
| 來源文件生命週期 | 管理上傳初始化、上傳完成、版本快照與保留政策 |
| 來源集合管理 | 維護文件集合、library 與 workspace 範圍的來源視圖 |
| 攝入交接 | 把已完成上傳的來源資料交付 `ai` 進入攝入流程 |

## 與其他 Bounded Context 協作

- `workspace` 提供來源文件的歸屬邊界；`knowledge` 可能引用或轉寫來源內容。
- `ai` 接收來源文件並建立 ingestion job；`wiki` 與 `search` 最終消費來源衍生的結構與索引。

## 核心聚合 / 核心概念

- **`SourceDocument`**
- **`SourceCollection`**
- **`WikiLibrary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace/AGENT.md
````markdown
# AGENT.md — workspace BC

## 模組定位

`workspace` 是協作容器有界上下文，負責工作區生命週期、成員管理與 Wiki 內容樹。在 WorkspaceDetailScreen 中組合多個 workspace-* 子模組的 UI tab。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Workspace` | Project、Space、Room |
| `WorkspaceMember` | Member、Participant |
| `WikiContentTree` | PageTree、ContentHierarchy |
| `workspaceId` | projectId、spaceId |
| `accountId` | ownerId（在 Workspace 上下文中） |

## 邊界規則

### ✅ 允許
```typescript
import { workspaceApi } from "@/modules/workspace/api";
import type { WorkspaceDTO } from "@/modules/workspace/api";
```

### ❌ 禁止
```typescript
// workspace/infrastructure 禁止 import workspace/api（循環依賴）
import { workspaceApi } from "@/modules/workspace/api"; // 在 infrastructure 層
```

## 循環依賴守衛

`FirebaseWikiWorkspaceRepository` 使用相對路徑 import `FirebaseWorkspaceRepository`，絕對不能改為 `@/modules/workspace/api`。

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace/interfaces/components/WorkspaceHubScreen.tsx
````typescript
import Link from "next/link";
import { type FormEvent, useState } from "react";
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { useWorkspaceHub } from "../hooks/useWorkspaceHub";
⋮----
interface WorkspaceHubScreenProps {
  readonly accountId: string | null | undefined;
  readonly accountName: string | null | undefined;
  readonly accountType: "user" | "organization";
  readonly accountsHydrated: boolean;
  readonly isBootstrapSeeded: boolean;
}
⋮----
function resetCreateWorkspaceDialog()
async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>)
⋮----
onClick=
⋮----
setIsCreateWorkspaceOpen(open);
⋮----
resetCreateWorkspaceDialog();
setIsCreateWorkspaceOpen(false);
````

## File: modules/workspace/README.md
````markdown
# workspace — 工作區上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/workspace/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`workspace` 是整個平台的協作容器，所有知識、來源、任務、稽核與動態都歸屬於某個工作區。它不是產品差異化來源，但決定知識平台如何被團隊實際操作與組合。

## 主要職責

| 能力 | 說明 |
|---|---|
| Workspace 容器管理 | 建立、更新、歸檔工作區 |
| 成員與角色 | 管理工作區成員、角色與協作可見性 |
| 內容結構入口 | 維護內容樹與子模組在工作區中的組合方式 |

## 與其他 Bounded Context 協作

- `organization` 是主要上游，提供多租戶歸屬。
- `knowledge`、`wiki`、`source` 與所有 `workspace-*` 模組都依賴工作區作為協作邊界。

## 核心聚合 / 核心概念

- **`Workspace`**
- **`WorkspaceMember`**
- **`WikiContentTree`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: package.json
````json
{
  "name": "xuanwu-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "deploy:firestore:indexes": "npx firebase deploy --only firestore:indexes",
    "deploy:firestore:rules": "npx firebase deploy --only firestore:rules",
    "deploy:storage:rules": "npx firebase deploy --only storage",
    "deploy:rules": "npx firebase deploy --only firestore:rules,storage",
    "deploy:apphosting": "npx firebase deploy --only apphosting",
    "deploy:functions": "npx firebase deploy --only functions:py_fn",
    "deploy:functions:py-fn": "npx firebase deploy --only functions:py-fn",
    "deploy:functions:all": "npx firebase deploy --only functions",
    "deploy:firebase": "npx firebase deploy",
    "repomix:skill": "npx repomix --config repomix.skill.config.json --skill-generate xuanwu-app-skill --skill-output .github/skills/xuanwu-app-skill --force",
    "repomix:markdown": "npx repomix --config repomix.markdown.config.json --skill-generate xuanwu-app-markdown-skill --skill-output .github/skills/xuanwu-app-markdown-skill --include \"**/*.md\" --force",
    "repomix:remote": "npx repomix --skill-generate x-skill --skill-output .github/skills/x-skill --remote xx/xx --include \"apps/web/**\" --force",
    "repomix:local": "npx repomix --skill-generate x-skill --skill-output .github/skills/x-skill D:\\122sp7\\apps --force",
    "repomix:remote:vscode-docs": "npx repomix --remote microsoft/vscode-docs --include \"docs/**\" --skill-generate vscode-docs-skill --skill-output .github/skills/vscode-docs-skill --force"
  },
  "engines": {
    "node": "24"
  },
  "dependencies": {
    "@atlaskit/pragmatic-drag-and-drop": "^1.7.9",
    "@atlaskit/pragmatic-drag-and-drop-hitbox": "^1.1.0",
    "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator": "^3.2.12",
    "@genkit-ai/google-genai": "^1.30.1",
    "@tanstack/react-form": "^1.28.5",
    "@tanstack/react-query": "^5.90.21",
    "@tanstack/react-table": "^8.21.3",
    "@tanstack/react-virtual": "^3.13.23",
    "@trpc/client": "^11.13.4",
    "@trpc/next": "^11.13.4",
    "@trpc/react-query": "^11.13.4",
    "@trpc/server": "^11.13.4",
    "@xstate/react": "^6.1.0",
    "axios": "^1.13.6",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^12.9.0",
    "genkit": "^1.30.1",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.577.0",
    "next": "16.1.7",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "19.2.3",
    "react-day-picker": "^9.14.0",
    "react-dom": "19.2.3",
    "react-graph-vis": "^1.0.7",
    "react-markdown": "^10.1.0",
    "recharts": "^2.15.4",
    "remark-gfm": "^4.0.1",
    "sonner": "^2.0.7",
    "superjson": "^2.2.6",
    "uuid": "^13.0.0",
    "vaul": "^1.1.2",
    "vis-data": "^8.0.3",
    "vis-graph3d": "^7.0.2",
    "vis-network": "^10.0.2",
    "vis-timeline": "^8.5.0",
    "xstate": "^5.28.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@next/eslint-plugin-next": "^16.2.2",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20.19.37",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@typescript-eslint/eslint-plugin": "^8.57.1",
    "@typescript-eslint/parser": "^8.57.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "eslint": "^9.39.4",
    "eslint-config-next": "^16.1.7",
    "eslint-plugin-boundaries": "^6.0.1",
    "eslint-plugin-jsdoc": "^62.8.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "repomix": "^1.12.0",
    "shadcn": "^4.1.0",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5",
    "typescript-eslint": "^8.58.0"
  }
}
````

## File: app/(shell)/knowledge-base/articles/[articleId]/page.tsx
````typescript
import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  BadgeCheck,
  Edit,
  FileClock,
  MessageSquare,
  History,
  Globe,
  Link2,
} from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getArticle,
  getCategories,
  getBacklinks,
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
  ArticleDialog,
} from "@/modules/knowledge-base/api";
import type { Article, Category } from "@/modules/knowledge-base/api";
import { CommentPanel, VersionHistoryPanel } from "@/modules/knowledge-collaboration/api";
import { ReactMarkdown } from "@lib-react-markdown";
import { remarkGfm } from "@lib-remark-gfm";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";
⋮----
function handlePublish()
function handleArchive()
function handleVerify()
function handleRequestReview()
⋮----
<Button variant="ghost" size="sm" onClick=
⋮----
{/* Back + actions bar */}
⋮----
{/* Header */}
⋮----
{/* Body tabs */}
````

## File: app/(shell)/layout.tsx
````typescript
/**
 * Module: shell layout
 * Purpose: compose authenticated shell frame with sidebar, header, and content area.
 * Responsibilities: account switching, route guards, and shell-level UI composition.
 * Constraints: keep business logic in modules and providers, not layout rendering.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Search } from "lucide-react";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import type { AccountEntity } from "@/modules/account/api";
import { AccountSwitcher } from "./_components/account-switcher";
import { AppBreadcrumbs } from "./_components/app-breadcrumbs";
import { AppRail } from "./_components/app-rail";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { GlobalSearchDialog, useGlobalSearch } from "./_components/global-search-dialog";
import { HeaderControls } from "./_components/header-controls";
import { HeaderUserAvatar } from "./_components/header-user-avatar";
import { ShellGuard } from "./_components/shell-guard";
⋮----
/** Used only by the mobile header nav strip (md:hidden). Desktop nav is in AppRail. */
⋮----
function isOrganizationAccount(
  activeAccount: ReturnType<typeof useApp>["state"]["activeAccount"],
): activeAccount is AccountEntity &
function resolveShellRouteForAccount(
  pathname: string,
  nextAccount: AccountEntity | ReturnType<typeof useAuth>["state"]["user"],
)
⋮----
function toggleSidebar()
⋮----
function isActiveRoute(href: string)
function handleSelectOrganization(account: AccountEntity)
function handleSelectPersonal()
function handleOrganizationCreated(account: AccountEntity)
function handleSelectWorkspace(workspaceId: string | null)
⋮----
async function handleLogout()
⋮----
{/* Global search */}
⋮----
void handleLogout();
````

## File: app/(shell)/notebook/rag-query/page.tsx
````typescript
import { useSearchParams } from "next/navigation";
import { useApp } from "@/app/providers/app-provider";
import { RagQueryView } from "@/modules/search";
export default function NotebookRagQueryPage()
````

## File: modules/knowledge-base/index.ts
````typescript
/**
 * knowledge-base module — public barrel export
 *
 * Cross-module access: only import from this file.
 * Internal layers (domain/, application/, infrastructure/) are NOT exported here.
 *
 * @module knowledge-base
 */
````

## File: modules/knowledge-base/interfaces/_actions/knowledge-base.actions.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { FirebaseArticleRepository } from "../../infrastructure/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../infrastructure/firebase/FirebaseCategoryRepository";
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  PublishArticleUseCase,
  ArchiveArticleUseCase,
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
  DeleteArticleUseCase,
} from "../../application/use-cases/article.use-cases";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../application/use-cases/category.use-cases";
import type { z } from "@lib-zod";
import type {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
} from "../../application/dto/knowledge-base.dto";
function makeArticleRepo()
function makeCategoryRepo(accountId: string)
export async function createArticle(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult>
export async function updateArticle(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult>
export async function publishArticle(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult>
export async function archiveArticle(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult>
export async function verifyArticle(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult>
export async function requestArticleReview(input: z.infer<typeof RequestArticleReviewSchema>): Promise<CommandResult>
export async function deleteArticle(accountId: string, articleId: string): Promise<CommandResult>
export async function createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult>
export async function renameCategory(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult>
export async function moveCategory(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult>
export async function deleteCategory(accountId: string, categoryId: string): Promise<CommandResult>
````

## File: modules/knowledge-base/interfaces/components/ArticleDialog.tsx
````typescript
import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-shadcn/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { createArticle, updateArticle } from "../_actions/knowledge-base.actions";
import type { Article } from "../../domain/entities/article.entity";
import type { Category } from "../../domain/entities/category.entity";
interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
  categories: Category[];
  /** Article to edit — omit for create mode */
  article?: Article;
  onSuccess?: (articleId?: string) => void;
}
⋮----
/** Article to edit — omit for create mode */
⋮----
// Reset when article changes
⋮----
function handleSubmit()
````

## File: modules/knowledge-collaboration/api/index.ts
````typescript
/**
 * knowledge-collaboration public API boundary
 *
 * Other modules MUST import knowledge-collaboration resources from this file only.
 */
// ── Domain types ───────────────────────────────────────────────────────────────
⋮----
export type CommentId = string;
export type PermissionId = string;
export type VersionId = string;
// ── DTOs ───────────────────────────────────────────────────────────────────────
⋮----
// ── Server Actions (mutations) ─────────────────────────────────────────────────
⋮----
// ── Queries (reads) ────────────────────────────────────────────────────────────
⋮----
// ── UI Components ─────────────────────────────────────────────────────────────
````

## File: modules/knowledge-database/api/index.ts
````typescript
/**
 * knowledge-database public API boundary
 */
⋮----
export type DatabaseId = string;
export type RecordId = string;
export type ViewId = string;
export type FieldId = string;
// Server Actions
⋮----
// Queries
⋮----
// UI Components
````

## File: modules/knowledge-database/application/use-cases/view.use-cases.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: application/use-cases
 * Use cases for View (database view) lifecycle.
 */
import { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IViewRepository } from "../../domain/repositories/IViewRepository";
import {
  CreateViewSchema,
  UpdateViewSchema,
  DeleteViewSchema,
} from "../dto/knowledge-database.dto";
export class CreateViewUseCase {
⋮----
constructor(private readonly viewRepo: IViewRepository)
async execute(input: z.infer<typeof CreateViewSchema>): Promise<CommandResult>
⋮----
export class UpdateViewUseCase {
⋮----
async execute(input: z.infer<typeof UpdateViewSchema>): Promise<CommandResult>
⋮----
export class DeleteViewUseCase {
⋮----
async execute(input: z.infer<typeof DeleteViewSchema>): Promise<CommandResult>
⋮----
export class ListViewsUseCase {
⋮----
async execute(accountId: string, databaseId: string)
````

## File: modules/knowledge-database/infrastructure/firebase/FirebaseRecordRepository.ts
````typescript
/**
 * Module: knowledge-database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/databaseRecords/{recordId}
 */
import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { DatabaseRecord } from "../../domain/entities/record.entity";
import type {
  IDatabaseRecordRepository,
  CreateRecordInput,
  UpdateRecordInput,
} from "../../domain/repositories/IDatabaseRecordRepository";
function recordsCol(db: ReturnType<typeof getFirestore>, accountId: string)
function recordDoc(db: ReturnType<typeof getFirestore>, accountId: string, recordId: string)
function toRecord(id: string, data: Record<string, unknown>): DatabaseRecord
export class FirebaseRecordRepository implements IDatabaseRecordRepository {
⋮----
private db()
async create(input: CreateRecordInput): Promise<DatabaseRecord>
async update(input: UpdateRecordInput): Promise<DatabaseRecord | null>
async delete(accountId: string, recordId: string): Promise<void>
async findById(accountId: string, recordId: string): Promise<DatabaseRecord | null>
async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecord[]>
````

## File: modules/knowledge-database/interfaces/_actions/knowledge-database.actions.ts
````typescript
import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseDatabaseRepository } from "../../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseRecordRepository } from "../../infrastructure/firebase/FirebaseRecordRepository";
import { FirebaseViewRepository } from "../../infrastructure/firebase/FirebaseViewRepository";
import { CreateDatabaseUseCase, UpdateDatabaseUseCase, AddFieldUseCase, ArchiveDatabaseUseCase } from "../../application/use-cases/database.use-cases";
import { CreateRecordUseCase, UpdateRecordUseCase, DeleteRecordUseCase } from "../../application/use-cases/record.use-cases";
import { CreateViewUseCase, UpdateViewUseCase, DeleteViewUseCase } from "../../application/use-cases/view.use-cases";
import type {
  CreateDatabaseInput,
  UpdateDatabaseInput,
  AddFieldInput,
} from "../../domain/repositories/IDatabaseRepository";
import type {
  CreateRecordInput,
  UpdateRecordInput,
} from "../../domain/repositories/IDatabaseRecordRepository";
import type {
  CreateViewInput,
  UpdateViewInput,
} from "../../domain/repositories/IViewRepository";
function makeDatabaseRepo()
function makeRecordRepo()
function makeViewRepo()
export async function createDatabase(input: CreateDatabaseInput): Promise<CommandResult>
export async function updateDatabase(input: UpdateDatabaseInput): Promise<CommandResult>
export async function addDatabaseField(input: AddFieldInput): Promise<CommandResult>
export async function archiveDatabase(accountId: string, databaseId: string): Promise<CommandResult>
export async function createRecord(input: CreateRecordInput): Promise<CommandResult>
export async function updateRecord(input: UpdateRecordInput): Promise<CommandResult>
export async function deleteRecord(accountId: string, recordId: string): Promise<CommandResult>
export async function createView(input: CreateViewInput): Promise<CommandResult>
export async function updateView(input: UpdateViewInput): Promise<CommandResult>
export async function deleteView(accountId: string, viewId: string): Promise<CommandResult>
````

## File: modules/knowledge/AGENT.md
````markdown
# AGENT.md — knowledge BC

## 模組定位

`knowledge` 是 **Core Domain**，負責個人筆記與頁面管理。對應 Notion 的 **Page + Block** 核心體驗。

**這個 BC 負責：**
- Page（頁面內容與層級結構）
- Block（頁面內最小內容單位：文字、標題、清單、程式碼、圖片、待辦事項等）
- Block 巢狀結構、排序、草稿與暫存

**不歸屬這個 BC：**
- 組織級知識庫文章 → `knowledge-base`
- 留言、版本歷史、權限控制 → `knowledge-collaboration`
- 資料庫 / Table / Board / View → `knowledge-database`

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Page` | Document、Note |
| `Block` | Node、Element、Item |
| `BlockType` | ContentType、Type |

> `Article` 為 `knowledge-base` BC 術語。`Database` / `Record` / `View` 為 `knowledge-database` BC 術語。

## 邊界規則

### ✅ 允許
```typescript
import { createPage } from "@/modules/knowledge/api";
```

### ❌ 禁止
```typescript
import { KnowledgeCollection } from "@/modules/knowledge/domain/..."; // 搬去 knowledge-database
import { ContentVersion } from "@/modules/knowledge/domain/...";     // 搬去 knowledge-collaboration
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/knowledge/application-services.md
````markdown
# knowledge — Application Services

## Application Layer 職責

管理頁面（Page）與內容區塊（Block）的 CRUD 與排序操作。

## 實際檔案

- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-block.use-cases.ts`

## Use Cases 清單

| Use Case 類別 | 操作 |
|---|---|
| `CreatePageUseCase` | 建立頁面 |
| `RenamePageUseCase` | 重新命名頁面 |
| `MovePageUseCase` | 移動頁面層級 |
| `ArchivePageUseCase` | 歸檔頁面 |
| `ReorderPageBlocksUseCase` | 重排頁面 Block |
| `GetPageUseCase` | 取得單頁 |
| `ListPagesUseCase` | 取得帳戶所有頁面 |
| `GetPageTreeUseCase` | 取得頁面樹狀結構 |
| `AddBlockUseCase` | 新增 Block |
| `UpdateBlockUseCase` | 更新 Block 內容 |
| `DeleteBlockUseCase` | 刪除 Block |
| `ListBlocksUseCase` | 取得頁面所有 Block |
````

## File: modules/knowledge/domain-events.md
````markdown
# Domain Events — knowledge

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立時 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAtISO` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAtISO` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAtISO` |
| `knowledge.page_archived` | 頁面歸檔 | `pageId`, `accountId`, `occurredAtISO` |
| `knowledge.block_added` | Block 新增 | `blockId`, `pageId`, `accountId`, `blockType`, `occurredAtISO` |
| `knowledge.block_updated` | Block 內容更新 | `blockId`, `pageId`, `accountId`, `occurredAtISO` |
| `knowledge.block_deleted` | Block 刪除 | `blockId`, `pageId`, `accountId`, `occurredAtISO` |

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `knowledge-base` | `knowledge.page_created` | 可選：同步為 Article |
| `knowledge-collaboration` | `knowledge.page_created` | 初始化版本歷史 |
</content>
````

## File: modules/knowledge/README.md
````markdown
# knowledge — 個人筆記與頁面管理

> **Domain Type:** **Core Domain**（核心域）
> **模組路徑:** `modules/knowledge/`
> **開發狀態:** 🚧 Developing — 積極開發中

## 在 Knowledge Platform 中的角色

`knowledge` 是 Xuanwu 的 Notion-like 個人筆記核心，負責頁面（Page）與頁面內容區塊（Block）的建立、編輯和結構管理。是整個平台使用者最直接接觸的內容編輯體驗。

## 主要職責

| 能力 | 說明 |
|---|---|
| Page 生命週期 | 建立、編輯、移動、歸檔個人或團隊筆記頁面 |
| Block 管理 | 新增、更新、刪除、重排內容區塊 |
| 層級結構 | 父子頁面樹狀管理 |
| 草稿與暫存 | 支援頁面狀態流轉（active / archived） |

## 核心聚合

- **`Page`**（KnowledgePage）
- **`Block`**（ContentBlock）

## 不在此 BC 範圍

| 功能 | 歸屬 BC |
|------|---------|
| 組織級知識文章（Article）、分類（Category） | `knowledge-base` |
| 留言（Comment）、版本歷史（Version）、權限（Permission） | `knowledge-collaboration` |
| 資料庫（Database）、記錄（Record）、視圖（View） | `knowledge-database` |

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面與實作 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
````

## File: modules/knowledge/ubiquitous-language.md
````markdown
# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 頁面 | Page | 個人或團隊筆記頁面，含 title、parentPageId、blockIds | `domain/entities/content-page.entity.ts` |
| 區塊 | Block | 頁面內的原子內容單位（type、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| todo \| ...` | `domain/value-objects/block-content.ts` |
| 頁面狀態 | PageStatus | `active \| archived` | `domain/entities/content-page.entity.ts` |
| 頁面樹 | PageTree | 以 parentPageId 組成的頁面層級結構 | — |

## 禁止替換術語

| 正確（此 BC） | 禁止 | 備註 |
|------|------|------|
| `Page` | Document、Note | — |
| `Block` | Node、Element、Item | — |

## 跨 BC 術語邊界

| 術語 | 正確 BC |
|------|---------|
| `Article` | `knowledge-base` |
| `Category` | `knowledge-base` |
| `Comment` | `knowledge-collaboration` |
| `Version` | `knowledge-collaboration` |
| `Permission` | `knowledge-collaboration` |
| `Database` | `knowledge-database` |
| `Record` | `knowledge-database` |
| `View` | `knowledge-database` |
````

## File: modules/notebook/api/index.ts
````typescript
/**
 * modules/notebook — public API barrel.
 */
````

## File: modules/workspace/interfaces/components/WorkspaceWikiView.tsx
````typescript
import Link from "next/link";
import { BookOpenIcon, FileTextIcon, Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { KnowledgePageTreeNode } from "@/modules/knowledge/api";
import { getKnowledgePageTree } from "@/modules/knowledge/api";
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
interface WorkspaceWikiViewProps {
  readonly workspace: WorkspaceEntity;
}
/** Base left-padding (rem) for depth-0 tree items. */
⋮----
/** Additional left-padding (rem) per nesting level. */
⋮----
function flattenTree(nodes: KnowledgePageTreeNode[], depth = 0): Array<
⋮----
async function loadPages()
````

## File: app/(shell)/_components/dashboard-sidebar.tsx
````typescript
/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list.  Top-level section navigation is in AppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Bot, Brain, Building2, ChevronDown, ChevronRight, Database, FileText, PanelLeftClose, Plus, SlidersHorizontal, UserRound, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/api";
import {
  getWorkspaceTabLabel,
  getWorkspaceTabPrefId,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
  type WorkspaceTabGroup,
  type WorkspaceTabValue,
  type WorkspaceEntity,
} from "@/modules/workspace/api";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import {
  CustomizeNavigationDialog,
  readNavPreferences,
  type NavPreferences,
} from "./customize-navigation-dialog";
interface DashboardSidebarProps {
  readonly pathname: string;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}
⋮----
function createWorkspaceLinkItems(group: WorkspaceTabGroup):
⋮----
interface SidebarLocaleBundle {
  workspace?: {
    groups?: Record<string, string>;
    tabLabels?: Record<string, string>;
  };
}
function getStorageKey(accountId: string)
function readRecentWorkspaceIds(accountId: string): string[]
function persistRecentWorkspaceIds(accountId: string, workspaceIds: string[])
function trackWorkspaceFromPath(pathname: string, accountId: string)
function getWorkspaceIdFromPath(pathname: string): string | null
// ── Section helpers ──────────────────────────────────────────────────────────
type NavSection = "workspace" | "knowledge" | "knowledge-base" | "knowledge-database" | "source" | "notebook" | "ai-chat" | "account" | "organization" | "other";
function resolveNavSection(pathname: string): NavSection
// ── Section icon labels for the title bar ────────────────────────────────────
⋮----
function isActiveOrganizationAccount(
  activeAccount: ActiveAccount | null,
): activeAccount is AccountEntity &
⋮----
function toggleCollapsed()
⋮----
// Whether to show recent workspaces section (controlled by personal prefs)
⋮----
// Max workspaces to show (apply user preference)
⋮----
function isActiveRoute(href: string)
// Track recently visited workspaces in localStorage
⋮----
function buildWorkspaceTabHref(workspaceId: string, tab: WorkspaceTabValue)
function tWorkspaceTab(tab: WorkspaceTabValue, fallback: string)
function tWorkspaceTabWithDevStatus(tab: WorkspaceTabValue, fallback: string)
function tWorkspaceGroup(groupKey: string, fallback: string)
function getWorkspacePrefId(tabValue: string)
function isWorkspaceItemEnabled(prefId: string)
function getWorkspaceItemOrder(prefId: string)
function sortWorkspaceItemsByPreferenceOrder<T extends
⋮----
async function loadSidebarLocale()
⋮----
// Keep fallback labels when localization files are unavailable.
⋮----
async function handleQuickCreatePage()
⋮----
{/* ── Sidebar title bar ──────────────────────────────────── */}
⋮----
{/* Section label */}
⋮----
{/* Customize + collapse buttons grouped on the right */}
⋮----
setCustomizeOpen(true);
⋮----
{/* ── Scrollable nav body ── section-specific ───────────── */}
⋮----
setIsWorkspaceModulesExpanded((prev)
⋮----
setIsWorkspaceSpacesExpanded((prev)
⋮----
setIsWorkspaceDatabasesExpanded((prev)
⋮----
// ── Workspace hub: show recent workspaces ──────────────
⋮----
onSelectWorkspace(ws.id);
⋮----
setIsExpanded((prev)
⋮----
onClick=
````

## File: modules/knowledge-base/api/index.ts
````typescript
/**
 * knowledge-base public API boundary
 *
 * Other modules MUST import knowledge-base resources from this file only.
 * Never import from domain/, application/, or infrastructure/ directly.
 */
// ─── Read contracts ────────────────────────────────────────────────────────────
⋮----
// ─── Identifiers used by other BCs ────────────────────────────────────────────
export type ArticleId = string;
export type CategoryId = string;
// ─── Server Actions (write-side) ──────────────────────────────────────────────
⋮----
// ─── Queries (read-side) ──────────────────────────────────────────────────────
⋮----
// ─── UI Components ────────────────────────────────────────────────────────────
````

## File: modules/knowledge-base/application/use-cases/category.use-cases.ts
````typescript
/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Category lifecycle use cases.
 */
import { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { ICategoryRepository } from "../../domain/repositories/CategoryRepository";
import type { Category } from "../../domain/entities/category.entity";
import {
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
  DeleteCategorySchema,
} from "../dto/knowledge-base.dto";
import { v7 as generateId } from "@lib-uuid";
export class CreateCategoryUseCase {
⋮----
constructor(private readonly repo: ICategoryRepository)
async execute(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult>
⋮----
export class RenameCategoryUseCase {
⋮----
async execute(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult>
⋮----
export class MoveCategoryUseCase {
⋮----
async execute(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult>
⋮----
export class DeleteCategoryUseCase {
⋮----
async execute(input: z.infer<typeof DeleteCategorySchema>): Promise<CommandResult>
⋮----
export class ListCategoriesUseCase {
⋮----
async execute(workspaceId: string, accountId: string)
````

## File: modules/knowledge-collaboration/index.ts
````typescript
/**
 * knowledge-collaboration module — public barrel export
 *
 * Cross-module access → use api/ exports only.
 * Internal imports use relative paths.
 */
````

## File: modules/knowledge-collaboration/interfaces/components/VersionHistoryPanel.tsx
````typescript
import { useEffect, useState, useTransition } from "react";
import { History, Trash2 } from "lucide-react";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";
import { getVersions } from "../queries/knowledge-collaboration.queries";
import { deleteVersion } from "../_actions/knowledge-collaboration.actions";
import type { Version } from "../../domain/entities/version.entity";
interface VersionHistoryPanelProps {
  accountId: string;
  contentId: string;
  currentUserId: string;
}
⋮----
function handleDelete(versionId: string)
````

## File: modules/knowledge-database/index.ts
````typescript
/**
 * knowledge-database module — public barrel export
 */
````

## File: modules/knowledge/repositories.md
````markdown
# knowledge — Repositories

## Domain Repository Ports

- `domain/repositories/knowledge.repositories.ts`
  - `PageRepository`（原 KnowledgePageRepository）
  - `BlockRepository`（原 KnowledgeBlockRepository）

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseContentPageRepository.ts`
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`

## PageRepository 方法對照

| 方法 | 說明 |
|------|------|
| `create()` | 建立頁面 |
| `rename()` | 重命名 |
| `move()` | 移動層級 |
| `archive()` | 歸檔 |
| `reorderBlocks()` | 重排 Block |
| `findById()` | 取得單頁 |
| `listByAccountId()` | 列出帳戶所有頁面 |
| `listByWorkspaceId()` | 列出工作區所有頁面 |

## BlockRepository 方法對照

| 方法 | 說明 |
|------|------|
| `add()` | 新增 Block |
| `update()` | 更新 Block 內容 |
| `delete()` | 刪除 Block |
| `reorder()` | 重排 Block 順序 |
| `findById()` | 取得單一 Block |
| `listByPageId()` | 列出頁面所有 Block |

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports
````

## File: modules/notebook/repositories.md
````markdown
# notebook — Repositories

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotebookRepository.ts`

> `RagGenerationRepository` 與 `RagRetrievalRepository` 已移至 `modules/search`，
> `domain/repositories/RagGenerationRepository.ts` 與 `domain/repositories/RagRetrievalRepository.ts`
> 為 `@deprecated` re-export stub，不屬於 notebook domain ports。

## Infrastructure Implementations

- `infrastructure/genkit/GenkitNotebookRepository.ts`
- `infrastructure/genkit/client.ts`
- `infrastructure/genkit/index.ts`
- `infrastructure/index.ts`

> `infrastructure/firebase/FirebaseRagRetrievalRepository.ts` 屬於 `search` BC，
> 雖然目前物理上仍在 notebook infrastructure 目錄下，應視為過渡性存放。

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notebook/repositories.md`
- `../../../docs/ddd/notebook/aggregates.md`
````

## File: modules/source/api/index.ts
````typescript
/**
 * Module: source
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the source domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */
// --- Core entity types -------------------------------------------------------
⋮----
// --- Wiki library entity types (owned by source domain) -------------------
⋮----
// --- Wiki library use-cases ------------------------------------------------
import { FirebaseWikiLibraryRepository } from "../infrastructure/firebase/FirebaseWikiLibraryRepository";
import {
  addWikiLibraryField as _addWikiLibraryField,
  createWikiLibrary as _createWikiLibrary,
  createWikiLibraryRow as _createWikiLibraryRow,
  getWikiLibrarySnapshot as _getWikiLibrarySnapshot,
  listWikiLibraries as _listWikiLibraries,
} from "../application/use-cases/wiki-libraries.use-case";
import type {
  AddWikiLibraryFieldInput,
  CreateWikiLibraryInput,
  CreateWikiLibraryRowInput,
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../domain/entities/wiki-library.types";
import type { WikiLibrarySnapshot } from "../application/use-cases/wiki-libraries.use-case";
⋮----
export function addWikiLibraryField(input: AddWikiLibraryFieldInput): Promise<WikiLibraryField>
export function createWikiLibrary(input: CreateWikiLibraryInput): Promise<WikiLibrary>
export function createWikiLibraryRow(input: CreateWikiLibraryRowInput): Promise<WikiLibraryRow>
export function getWikiLibrarySnapshot(accountId: string, libraryId: string): Promise<WikiLibrarySnapshot>
export function listWikiLibraries(accountId: string, workspaceId?: string): Promise<WikiLibrary[]>
// --- Document snapshot types --------------------------------------------------
⋮----
// --- Query functions ---------------------------------------------------------
⋮----
// --- UI components (cross-module public) -------------------------------------
````

## File: app/(shell)/_components/app-rail.tsx
````typescript
/**
 * Module: app-rail.tsx
 * Purpose: render the narrow leftmost icon rail (app rail) of the authenticated shell.
 * Responsibilities: app logo, account context switcher, top-level section icon nav with
 *   tooltips, and quick sign-out via user avatar dropdown at the bottom.
 * Constraints: UI-only; follows the two-column sidebar pattern from Plane's AppRailRoot.
 *   `h-full` ensures it fills the parent `h-screen` container.
 */
import Link from "next/link";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  NotebookText,
  Plus,
  SlidersHorizontal,
  Table2,
  UserRound,
  Users,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/app/providers/auth-context";
import type { ActiveAccount } from "@/app/providers/app-context";
import type { AccountEntity } from "@/modules/account/api";
import { createOrganization } from "@/modules/organization/api";
import {
  createWorkspace,
  type WorkspaceEntity,
} from "@/modules/workspace/api";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import { Input } from "@ui-shadcn/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";
interface AppRailProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly isOrganizationAccount: boolean;
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly activeWorkspaceId: string | null;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
  readonly onOrganizationCreated?: (account: AccountEntity) => void;
  readonly onSignOut: () => void;
}
interface RailItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** When false the item is hidden; defaults to true */
  show?: boolean;
  isActive?: (pathname: string) => boolean;
}
⋮----
/** When false the item is hidden; defaults to true */
⋮----
function isExactOrChildPath(targetPath: string, pathname: string)
function getInitial(name: string | undefined | null): string
⋮----
function resetDialog()
function resetWorkspaceDialog()
async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>)
async function handleCreateOrg(event: FormEvent<HTMLFormElement>)
function isActive(href: string)
⋮----
// ── Hub ──────────────────────────────────────────────────────────
⋮----
// ── Content ──────────────────────────────────────────────────────
⋮----
// ── People (org-only) ─────────────────────────────────────────
⋮----
// ── Operations (org-only) ─────────────────────────────────────
⋮----
// ── Admin (org-only) ──────────────────────────────────────────
⋮----
// ── Developer ────────────────────────────────────────────────
⋮----
{/* ── Workspace / account logo tile ─────────────────────────── */}
⋮----
onSelectOrganization(account);
⋮----
{/* ── Section nav icons ─────────────────────────────────────── */}
⋮----
onSelectWorkspace(workspace.id);
⋮----
{/* ── Spacer ────────────────────────────────────────────────── */}
⋮----
{/* ── Create organization dialog ─────────────────────────────── */}
⋮----
resetDialog();
setIsCreateOrgOpen(false);
⋮----
{/* ── Create workspace dialog ────────────────────────────────── */}
⋮----
resetWorkspaceDialog();
setIsCreateWorkspaceOpen(false);
````

## File: modules/knowledge/aggregates.md
````markdown
# Aggregates — knowledge

## 聚合根：Page（KnowledgePage）

### 職責
個人筆記頁面的聚合根。管理頁面標題、父子層級（parentPageId）、Block 引用列表（blockIds）。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 頁面主鍵 |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL-safe 識別符 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 關聯的 Block ID 列表（有序） |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區（可選） |
| `status` | `PageStatus` | `active \| archived` |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### 不變數

- `slug` 在同一 accountId 下必須唯一
- archived 頁面不可新增 Block

---

## 實體：Block（ContentBlock）

### 職責
頁面內的原子內容單位，依序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Block 主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `accountId` | `string` | 所屬帳戶 |
| `content` | `BlockContent` | 型別化內容（含 `type: BlockType`） |
| `order` | `number` | 排列順序 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

### BlockType

`text | heading-1 | heading-2 | heading-3 | image | code | bullet-list | numbered-list | divider | quote | todo`

代碼位置：`domain/value-objects/block-content.ts`

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `PageRepository` | `create()`, `rename()`, `move()`, `archive()`, `reorderBlocks()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `BlockRepository` | `add()`, `update()`, `delete()`, `reorder()`, `findById()`, `listByPageId()` |
````

## File: modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx
````typescript
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { WorkspaceEntity, WorkspaceGrant } from "@/modules/workspace/api";
import { formatDate } from "@shared-utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Separator } from "@ui-shadcn/ui/separator";
import { WorkspaceAuditTab } from "@/modules/workspace-audit/api";
import { WorkspaceFilesTab } from "@/modules/source/api";
import { WorkspaceSchedulingTab } from "@/modules/workspace-scheduling/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace-feed/api";
import { updateWorkspaceSettings } from "../_actions/workspace.actions";
import { WorkspaceDailyTab } from "./WorkspaceDailyTab";
import { WorkspaceMembersTab } from "./WorkspaceMembersTab";
import { WorkspaceWikiView } from "./WorkspaceWikiView";
import { getWorkspaceByIdForAccount } from "../queries/workspace.queries";
import {
  getWorkspaceTabLabel,
  getWorkspaceTabStatus,
  getWorkspaceTabsByGroup,
  isWorkspaceTabValue,
  type WorkspaceTabGroup,
  type WorkspaceTabValue,
} from "../workspace-tabs";
⋮----
function getWorkspaceInitials(name: string)
function formatTimestamp(timestamp: WorkspaceEntity["createdAt"] | undefined)
function describeGrant(grant: WorkspaceGrant)
interface WorkspaceSettingsDraft {
  readonly name: string;
  readonly visibility: WorkspaceEntity["visibility"];
  readonly lifecycleState: WorkspaceEntity["lifecycleState"];
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
  readonly details: string;
  readonly managerId: string;
  readonly supervisorId: string;
  readonly safetyOfficerId: string;
}
function createSettingsDraft(workspace: WorkspaceEntity): WorkspaceSettingsDraft
function trimOrUndefined(value: string)
interface WorkspaceDetailScreenProps {
  readonly workspaceId: string;
  readonly accountId: string | null | undefined;
  readonly accountsHydrated: boolean;
  /** Optional tab to activate on first render (e.g. from ?tab= URL param). */
  readonly initialTab?: string;
}
⋮----
/** Optional tab to activate on first render (e.g. from ?tab= URL param). */
⋮----
function renderWorkspacePlaceholderTab(tab: WorkspaceTabValue)
⋮----
async function loadWorkspace()
⋮----
<AvatarFallback>
⋮----
setSettingsDraft(createSettingsDraft(workspace));
setSaveError(null);
setIsEditWorkspaceOpen(true);
⋮----
{/* Mobile tab navigation – hidden on md+ where sidebar handles navigation */}
⋮----
<Badge variant="outline">
⋮----
setIsEditWorkspaceOpen(open);
````

## File: modules/knowledge-base/application/use-cases/article.use-cases.ts
````typescript
/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Article lifecycle use cases.
 */
import { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
import type { Article } from "../../domain/entities/article.entity";
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
  DeleteArticleSchema,
} from "../dto/knowledge-base.dto";
import { v7 as generateId } from "@lib-uuid";
export class CreateArticleUseCase {
⋮----
constructor(private readonly repo: IArticleRepository)
async execute(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult>
⋮----
export class UpdateArticleUseCase {
⋮----
async execute(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult>
⋮----
export class PublishArticleUseCase {
⋮----
async execute(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult>
⋮----
export class ArchiveArticleUseCase {
⋮----
async execute(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult>
⋮----
export class VerifyArticleUseCase {
⋮----
async execute(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult>
⋮----
export class RequestArticleReviewUseCase {
⋮----
async execute(input: z.infer<typeof RequestArticleReviewSchema>): Promise<CommandResult>
⋮----
export class DeleteArticleUseCase {
⋮----
async execute(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult>
⋮----
export class ListArticlesUseCase {
⋮----
async execute(params:
````

## File: modules/knowledge/api/index.ts
````typescript
/**
 * Module: knowledge
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer — the sole cross-domain entry point
 * for the knowledge domain.
 */
⋮----
// ── Server Actions (write-side) ───────────────────────────────────────────────
⋮----
// Collection actions
⋮----
// Wiki / Knowledge Base verification actions
⋮----
// ── Wiki / Knowledge Base DTO types ──────────────────────────────────────────
⋮----
// ── Collection types ──────────────────────────────────────────────────────────
⋮----
// ── Public event contracts ────────────────────────────────────────────────────
⋮----
// ── Queries (read-side) ──────────────────────────────────────────────
⋮----
// ── UI Components ─────────────────────────────────────────────────────────────
````

## File: next-env.d.ts
````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
⋮----
// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

## File: app/(shell)/ai-chat/page.tsx
````typescript
/**
 * Module: ai-chat page
 * Purpose: AI assistant chat hub — wired to generateNotebookResponse server action.
 * Thread persistence: Firestore via saveThread/loadThread (survives page reload).
 * Multi-turn context: previous messages injected as system prompt.
 */
import Link from "next/link";
import { Bot, BookOpen, Brain, FileText, FolderKanban, Lightbulb, Loader2, Plus, SendHorizonal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { v7 as uuid } from "@lib-uuid";
import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { sendChatMessage, saveThread, loadThread } from "./_actions";
import type { Thread } from "./_actions";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
const STORAGE_KEY = (accountId: string, workspaceId: string)
function buildContextPrompt(history: ChatMessage[]): string
function generateMsgId()
function threadFromMessages(id: string, msgs: ChatMessage[], createdAt: string): Thread
⋮----
// Load persisted thread on mount
⋮----
// eslint-disable-next-line react-hooks/exhaustive-deps
⋮----
async function handleSubmit(e: React.FormEvent)
⋮----
// Build multi-turn context from history (exclude the new user message)
⋮----
// Persist thread to Firestore
⋮----
// Defer scroll to allow React to flush the new message into the DOM first.
⋮----
function handleNewThread()
function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>)
⋮----
onSubmit=
⋮----
onChange=
````