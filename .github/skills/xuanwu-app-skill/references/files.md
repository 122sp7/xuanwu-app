# Files

## File: app/globals.css
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

/* ── Tiptap / ProseMirror editor styles ───────────────────────────────────── */
.tiptap-editor .ProseMirror {
  outline: none;
  min-height: 320px;
}
.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
  color: var(--muted-foreground);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
.tiptap-editor .ProseMirror h1 { @apply text-3xl font-bold mb-3 mt-5; }
.tiptap-editor .ProseMirror h2 { @apply text-2xl font-semibold mb-2 mt-4; }
.tiptap-editor .ProseMirror h3 { @apply text-xl font-medium mb-2 mt-3; }
.tiptap-editor .ProseMirror p  { @apply mb-2 leading-relaxed; }
.tiptap-editor .ProseMirror ul { @apply list-disc pl-5 mb-2 space-y-0.5; }
.tiptap-editor .ProseMirror ol { @apply list-decimal pl-5 mb-2 space-y-0.5; }
.tiptap-editor .ProseMirror li { @apply leading-relaxed; }
.tiptap-editor .ProseMirror blockquote {
  @apply border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-2;
}
.tiptap-editor .ProseMirror hr {
  @apply border-t border-border/60 my-4;
}
.tiptap-editor .ProseMirror code {
  @apply rounded bg-muted px-1 py-0.5 font-mono text-[0.85em];
}
.tiptap-editor .ProseMirror a {
  @apply text-primary underline cursor-pointer;
}
.tiptap-editor .ProseMirror strong { @apply font-bold; }
.tiptap-editor .ProseMirror em { @apply italic; }
.tiptap-editor .ProseMirror u  { @apply underline; }
.tiptap-editor .ProseMirror s  { @apply line-through; }
/* ── Callout block ──────────────────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .callout-block {
  @apply flex gap-3 rounded-lg border border-border/60 bg-muted/40 px-4 py-3 mb-3;
}
.tiptap-editor .ProseMirror .callout-emoji {
  @apply text-xl shrink-0 select-none leading-relaxed;
}
.tiptap-editor .ProseMirror .callout-content {
  @apply flex-1 min-w-0;
}
.tiptap-editor .ProseMirror .callout-content p { @apply mb-1; }

/* ── Toggle (collapsible) block ─────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .toggle-block {
  @apply rounded-lg border border-border/60 bg-background mb-3 overflow-hidden;
}
.tiptap-editor .ProseMirror .toggle-block > summary {
  @apply cursor-pointer select-none px-4 py-2 font-medium text-sm text-foreground hover:bg-muted/30 transition;
  list-style: none;
}
.tiptap-editor .ProseMirror .toggle-block > summary::-webkit-details-marker { display: none; }
.tiptap-editor .ProseMirror .toggle-block > :not(summary) {
  @apply px-4 py-2 text-sm;
}

/* ── Table of Contents block ─────────────────────────────────────────────────── */
.tiptap-editor .ProseMirror .toc-block {
  @apply rounded-lg border border-border/60 bg-muted/30 px-4 py-3 mb-3 text-sm text-muted-foreground;
}
.tiptap-editor .ProseMirror .toc-block::before {
  content: "📋 目錄（自動產生）";
  @apply block text-xs font-semibold text-muted-foreground mb-1;
}
```

## File: app/_providers/index.tsx
```typescript
"use client";

/**
 * Root providers composition — app/_providers
 *
 * Assembles the full provider tree for the application:
 *   AuthProvider (platform) → AppProvider (platform accounts) → WorkspaceContextProvider (workspace)
 *
 * Lives in app/ because it composes providers from multiple bounded contexts.
 */

import type { ReactNode } from "react";
import { Toaster } from "@ui-shadcn/ui/sonner";
import { AuthProvider } from "@/modules/platform/api";
import { WorkspaceContextProvider } from "@/modules/workspace/api";
import { AppProvider } from "../(shell)/_providers/AppProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <WorkspaceContextProvider>
          {children}
        </WorkspaceContextProvider>
      </AppProvider>
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}
```

## File: app/(public)/page.tsx
```typescript
"use client";

/**
 * app/(public)/page.tsx
 * Public landing page with top-right auth entry and inline auth panel.
 * Uses identity module use cases directly on the client so Firebase auth state
 * actually updates AuthProvider via onAuthStateChanged.
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

import {
  useAuth,
  createClientAuthUseCases,
  createClientAccountUseCases,
  createDevDemoUser,
  isDevDemoCredential,
  isLocalDevDemoAllowed,
  writeDevDemoSession,
} from "@/modules/platform/api";

type Tab = "login" | "register";

export default function PublicPage() {
  const { state, dispatch } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);

  const {
    signInUseCase,
    signInAnonymouslyUseCase,
    registerUseCase,
    sendPasswordResetEmailUseCase,
    createUserAccountUseCase,
  } =
    useMemo(() => ({
      ...createClientAuthUseCases(),
      ...createClientAccountUseCases(),
    }), []);

  useEffect(() => {
    if (state.status === "authenticated") {
      const nextHref = state.user?.id ? `/${encodeURIComponent(state.user.id)}` : "/";
      router.replace(nextHref);
    }
  }, [state.status, state.user?.id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLocalDevDemoAllowed() && tab === "login" && isDevDemoCredential(email, password)) {
        const demoUser = createDevDemoUser();
        writeDevDemoSession(demoUser);
        window.location.assign(`/${encodeURIComponent(demoUser.id)}`);
        return;
      }

      const result =
        tab === "login"
          ? await signInUseCase.execute({ email, password })
          : await registerUseCase.execute({ email, password, name });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      if (tab === "register") {
        const accountResult = await createUserAccountUseCase.execute(
          result.aggregateId,
          name,
          email,
        );
        if (!accountResult.success) {
          setError(accountResult.error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuestAccess() {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInAnonymouslyUseCase.execute();
      if (!result.success) {
        // Dev-mode fallback: when Firebase anonymous auth is unavailable (e.g. network
        // blocked in sandboxes), create a local guest session so the shell can be tested.
        if (isLocalDevDemoAllowed()) {
          const guestUser = createDevDemoUser();
          writeDevDemoSession(guestUser);
          dispatch({ type: "SET_AUTH_STATE", payload: { user: guestUser, status: "authenticated" } });
        } else {
          setError(result.error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendPasswordResetEmailUseCase.execute(email);
      if (result.success) {
        setResetSent(true);
        setError(null);
      } else {
        setError(result.error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (state.status === "initializing") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-end px-6 py-5">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setResetSent(false);
            setIsAuthPanelOpen((prev) => !prev);
          }}
          className="rounded-lg border border-border/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          {isAuthPanelOpen ? "Close" : "Sign In"}
        </button>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-10 pt-4 md:grid-cols-[1fr_420px] md:items-start">
        <div className="rounded-2xl border border-border/40 bg-card/40 p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Xuanwu App</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            Unified Hexagonal Architecture with DDD workspace for identity, account, and organization modules.
            Use the top-right sign in button to access your dashboard.
          </p>
        </div>

        {isAuthPanelOpen && (
          <div className="w-full rounded-2xl border border-border/50 bg-card shadow-xl ring-1 ring-border/30">
            <div className="flex flex-col items-center pb-4 pt-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 ring-1 ring-primary/20">
                <ShieldCheck className="h-7 w-7 text-primary/90" />
              </div>
            </div>

            <div className="px-6">
              <div className="mb-6 grid h-10 grid-cols-2 rounded-lg border border-border/40 bg-muted/30 p-1">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTab(t);
                      setError(null);
                    }}
                    className={`rounded-md text-xs font-semibold capitalize tracking-tight transition-all ${
                      tab === t
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {tab === "register" && (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="register-name" className="text-xs font-semibold text-muted-foreground">Name</label>
                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your display name"
                      required
                      className="h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label htmlFor="auth-email" className="text-xs font-semibold text-muted-foreground">Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    autoComplete="email"
                    required
                    className="h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="auth-password" className="text-xs font-semibold text-muted-foreground">Password</label>
                    {tab === "login" && (
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="text-xs text-primary/70 hover:text-primary"
                      >
                        {resetSent ? "Email sent!" : "Forgot password?"}
                      </button>
                    )}
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                    required
                    className="h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-105 disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : tab === "login" ? (
                    "Enter Dimension"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 border-t border-border/40 bg-muted/10 px-6 pb-7 pt-5">
              <button
                type="button"
                onClick={handleGuestAccess}
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/55 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-primary disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue as Guest"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
```

## File: app/(shell)/_shell/index.ts
```typescript
/**
 * Shell composition barrel — app/(shell)/_shell
 *
 * Cross-module shell layout components that compose platform, workspace,
 * and notion modules. Lives in app/ (the composition layer) instead of
 * inside any single module to respect upstream/downstream boundaries.
 */

export { ShellLayout } from "./ShellRootLayout";
export { quickCreateKnowledgePage, type QuickCreatePageInput, type QuickCreatePageResult } from "./shell-quick-create";
export { isActiveOrganizationAccount } from "./ShellSidebarNavData";
```

## File: app/(shell)/_shell/shell-quick-create.ts
```typescript
/**
 * shell-quick-create — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports notion's createKnowledgePage.
 * Kept as a composition adapter at the app boundary.
 */

import { createKnowledgePage } from "@/modules/notion/api";

export interface QuickCreatePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
}

export interface QuickCreatePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}

export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
): Promise<QuickCreatePageResult> {
  if (!input.accountId) {
    return { success: false, error: { message: "目前沒有 active account，無法建立" } };
  }
  if (!input.workspaceId) {
    return { success: false, error: { message: "請先切換到工作區，再建立頁面" } };
  }
  return createKnowledgePage({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    title: "未命名頁面",
    parentPageId: null,
    createdByUserId: input.createdByUserId,
  });
}
```

## File: app/(shell)/_shell/ShellSidebarHeader.tsx
```typescript
"use client";

/**
 * ShellSidebarHeader — app/(shell)/_shell composition layer.
 * Moved from modules/platform alongside sibling shell files.
 * Pure UI component with no downstream imports.
 */

import { PanelLeftClose, SlidersHorizontal } from "lucide-react";

interface ShellSidebarHeaderProps {
  sectionLabel: string;
  sectionIcon: React.ReactNode;
  onOpenCustomize: () => void;
  onToggleCollapsed: () => void;
}

export function ShellSidebarHeader({
  sectionLabel,
  sectionIcon,
  onOpenCustomize,
  onToggleCollapsed,
}: ShellSidebarHeaderProps) {
  return (
    <div className="flex shrink-0 items-center border-b border-border/40 px-2 py-1.5">
      <span className="flex flex-1 items-center gap-1.5 px-1 text-[11px] font-semibold tracking-tight text-foreground/80">
        {sectionIcon}
        {sectionLabel}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          title="設定"
          aria-label="設定"
          onClick={onOpenCustomize}
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
        >
          <SlidersHorizontal className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="收起側欄"
          title="收起側欄"
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
        >
          <PanelLeftClose className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/dashboard/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceDashboardPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceDashboardPage({ params }: AccountWorkspaceDashboardPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge-base/articles/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeBaseArticlesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeBaseArticlesPage({ params }: AccountWorkspaceKnowledgeBaseArticlesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-base-articles`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge-base/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeBasePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeBasePage({ params }: AccountWorkspaceKnowledgeBasePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-base-articles`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge-database/databases/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeDatabasesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeDatabasesPage({ params }: AccountWorkspaceKnowledgeDatabasesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-databases`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge-database/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeDatabasePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeDatabasePage({ params }: AccountWorkspaceKnowledgeDatabasePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-databases`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge/block-editor/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgeBlockEditorPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgeBlockEditorPage({ params }: AccountWorkspaceKnowledgeBlockEditorPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-pages`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgePage({ params }: AccountWorkspaceKnowledgePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-pages`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge/pages/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceKnowledgePagesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceKnowledgePagesPage({ params }: AccountWorkspaceKnowledgePagesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=knowledge-pages`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/notebook/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceNotebookPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceNotebookPage({ params }: AccountWorkspaceNotebookPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}/notebook/rag-query`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/source/documents/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceSourceDocumentsPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceSourceDocumentsPage({ params }: AccountWorkspaceSourceDocumentsPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Files`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/source/libraries/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceSourceLibrariesPageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceSourceLibrariesPage({ params }: AccountWorkspaceSourceLibrariesPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=source-libraries`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/source/page.tsx
```typescript
import { redirect } from "next/navigation";

interface AccountWorkspaceSourcePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceSourcePage({ params }: AccountWorkspaceSourcePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=source-libraries`);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/workspace-feed/page.tsx
```typescript
"use client";

import { useParams } from "next/navigation";

import { WorkspaceFeedWorkspaceView } from "@/modules/workspace/api";

export default function AccountWorkspaceFeedPage() {
  const params = useParams<{ accountId: string; workspaceId: string }>();

  const accountId = typeof params.accountId === "string" ? params.accountId : "";
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  if (!accountId || !workspaceId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        請先選擇工作區
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">動態牆</h1>
      <WorkspaceFeedWorkspaceView
        accountId={accountId}
        workspaceId={workspaceId}
        workspaceName="工作區"
      />
    </div>
  );
}
```

## File: app/(shell)/(account)/[accountId]/dev-tools/dev-tools-badges.tsx
```typescript
"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export function StatusBadge({ status, errorMessage }: { status: string; errorMessage?: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> 完成
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
        <Loader2 className="size-3 animate-spin" /> 處理中
      </span>
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={errorMessage}
      >
        <XCircle className="size-3" /> 錯誤
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">{status || "—"}</span>;
}

export function RagBadge({ status, error }: { status?: string; error?: string }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> RAG Ready
      </span>
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={error}
      >
        <XCircle className="size-3" /> RAG Error
      </span>
    );
  }
  if (status) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
        <Loader2 className="size-3 animate-spin" /> {status}
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">—</span>;
}
```

## File: app/(shell)/(account)/[accountId]/dev-tools/dev-tools-helpers.ts
```typescript
// ── Types ─────────────────────────────────────────────────────────────────────

export interface ParseResult {
  doc_id: string;
  status: "processing" | "completed" | "error";
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
}

export interface DocRecord {
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

export type UploadStatus = "idle" | "uploading" | "waiting" | "done" | "error";

// ── Constants ─────────────────────────────────────────────────────────────────

export const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
export const WATCH_PATH = "uploads/";
export const ACCEPTED_MIME: Record<string, string> = {
  pdf: "application/pdf",
  tif: "image/tiff",
  tiff: "image/tiff",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};
export const ACCEPTED_EXTS = ".pdf, .tif / .tiff, .png, .jpg / .jpeg";

// ── Data-mapping helpers ──────────────────────────────────────────────────────

export function formatDateTime(value: Date | null): string {
  if (!value) return "—";
  return value.toLocaleString("zh-TW", { hour12: false });
}

function deriveJsonUri(gcsUri: string): string {
  if (!gcsUri.startsWith("gs://")) return "";
  const withoutPrefix = gcsUri.slice(5);
  const firstSlash = withoutPrefix.indexOf("/");
  if (firstSlash < 0) return "";

  const bucket = withoutPrefix.slice(0, firstSlash);
  const objectPath = withoutPrefix.slice(firstSlash + 1);
  if (!objectPath.startsWith("uploads/")) return "";

  const relativePath = objectPath.slice("uploads/".length);
  const dotIndex = relativePath.lastIndexOf(".");
  const stem = dotIndex > -1 ? relativePath.slice(0, dotIndex) : relativePath;
  return `gs://${bucket}/files/${stem}.json`;
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (value && typeof value === "object" && "toDate" in value) {
    if (typeof (value as { toDate?: unknown }).toDate === "function") {
      const converted = (value as { toDate: () => unknown }).toDate();
      return converted instanceof Date ? converted : null;
    }
  }
  return null;
}

export function mapSnapshotDoc(doc: { id: string; data: () => unknown }): DocRecord {
  const data = asRecord(doc.data());
  const source = asRecord(data.source);
  const parsed = asRecord(data.parsed);
  const rag = asRecord(data.rag);
  const err = asRecord(data.error);

  return {
    id: doc.id,
    status: asString(data.status, "unknown"),
    filename: asString(source.filename, doc.id),
    gcs_uri: asString(source.gcs_uri),
    uploaded_at: asDate(source.uploaded_at),
    page_count: asNumber(parsed.page_count),
    json_gcs_uri: asString(parsed.json_gcs_uri, deriveJsonUri(asString(source.gcs_uri))),
    error_message: asString(err.message) || undefined,
    rag_status: asString(rag.status) || undefined,
    rag_chunk_count: asNumber(rag.chunk_count),
    rag_vector_count: asNumber(rag.vector_count),
    rag_raw_chars: asNumber(rag.raw_chars),
    rag_normalized_chars: asNumber(rag.normalized_chars),
    rag_normalization_version: asString(rag.normalization_version) || undefined,
    rag_language_hint: asString(rag.language_hint) || undefined,
    rag_error: asString(rag.error) || undefined,
  };
}
```

## File: app/(shell)/(account)/[accountId]/dev-tools/dev-tools-parsed-docs-section.tsx
```typescript
"use client";

/**
 * DevToolsParsedDocsSection.tsx
 * Owns: the "已解析檔案" (completed-only) table section in the Dev Tools page.
 * Receives all doc data and handlers as props; contains no state.
 */

import { CheckCircle2, FlaskConical, Loader2 } from "lucide-react";

import { type DocRecord } from "./dev-tools-helpers";
import { RagBadge } from "./dev-tools-badges";
import { formatDateTime } from "./use-dev-tools-doc-list";

interface DevToolsParsedDocsSectionProps {
  parsedDocs: DocRecord[];
  reindexingId: string | null;
  onViewJson: (doc: DocRecord) => void;
  onManualProcess: (doc: DocRecord) => void;
  formatNormalizationRatio: (doc: DocRecord) => string;
}

export function DevToolsParsedDocsSection({
  parsedDocs,
  reindexingId,
  onViewJson,
  onManualProcess,
  formatNormalizationRatio,
}: DevToolsParsedDocsSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-emerald-600" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          已解析檔案（{parsedDocs.length}）
        </h2>
      </div>
      {parsedDocs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          尚無解析完成檔案
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-emerald-500/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-emerald-500/10 bg-emerald-500/5">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">頁數</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">RAG</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Chunks / Vectors</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Normalization</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">版本 / 語系</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">JSON</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">完成時間</th>
                </tr>
              </thead>
              <tbody>
                {parsedDocs.map((doc, i) => (
                  <tr
                    key={`parsed-${doc.id}`}
                    className={`border-b border-border/30 last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs max-w-[220px] truncate" title={doc.filename}>
                      {doc.filename}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium">{doc.page_count ?? "—"}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <RagBadge status={doc.rag_status} error={doc.rag_error} />
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {(doc.rag_chunk_count ?? 0).toLocaleString()} /{" "}
                      {(doc.rag_vector_count ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {formatNormalizationRatio(doc)}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {(doc.rag_normalization_version || "—").toUpperCase()} /{" "}
                      {(doc.rag_language_hint || "—").toUpperCase()}
                    </td>
                    <td className="px-4 py-2.5 text-xs max-w-[320px]">
                      {doc.json_gcs_uri ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { onViewJson(doc); }}
                            className="font-mono text-left truncate text-primary hover:underline"
                            title={doc.json_gcs_uri}
                          >
                            {doc.json_gcs_uri}
                          </button>
                          <button
                            onClick={() => { onManualProcess(doc); }}
                            disabled={reindexingId === doc.id}
                            title="手動整理（Normalization + RAG）"
                            className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 px-2 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                          >
                            {reindexingId === doc.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <FlaskConical className="size-3" />
                            )}
                            手動整理
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(doc.uploaded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
```

## File: app/(shell)/(account)/[accountId]/dev-tools/page.tsx
```typescript
"use client";

/**
 * Module: dev-tools page — /dev-tools
 * Purpose: 測試 py_fn Firebase Functions (Document AI parse_document callable)。
 * Workflow: 選取 → 上傳到 GCS → 呼叫 parse_document → 監聽 Firestore 狀態
 * Constraints: 僅限本地開發 / staging 驗證；勿在 production 導覽列顯示。
 *   Doc-list state and operations → useDevToolsDocList hook.
 *   Parsed-docs table → DevToolsParsedDocsSection component.
 */

import { useRef, useState, useEffect } from "react";
import {
  FlaskConical,
  FileUp,
  AlertCircle,
  FileText,
  Trash2,
  Code2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useApp } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { Button } from "@ui-shadcn/ui/button";
import {
  UPLOAD_BUCKET,
  WATCH_PATH,
  ACCEPTED_MIME,
  ACCEPTED_EXTS,
  asRecord,
  asString,
  asNumber,
  type ParseResult,
  type UploadStatus,
} from "./dev-tools-helpers";
import { StatusBadge, RagBadge } from "./dev-tools-badges";
import { useDevToolsDocList, formatDateTime } from "./use-dev-tools-doc-list";
import { DevToolsParsedDocsSection } from "./dev-tools-parsed-docs-section";

// ── Page component ─────────────────────────────────────────────────────────

export default function DevToolsPage() {
  const { state: appState } = useApp();
  const { state: wsState } = useWorkspaceContext();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const activeWorkspaceId = wsState.activeWorkspaceId ?? "";

  // ── Upload state ──────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ── Doc list + operations (extracted hook) ────────────────────────────────
  const {
    allDocs,
    selectedDocId,
    selectedDoc,
    jsonContent,
    jsonLoading,
    deletingId,
    reindexingId,
    handleViewOriginal,
    handleViewJson,
    handleDeleteDoc,
    handleManualProcess,
    closeJsonPreview,
    formatNormalizationRatio,
  } = useDevToolsDocList(activeAccountId);

  // Cleanup upload subscription on unmount
  useEffect(() => {
    return () => { if (unsubscribeRef.current) unsubscribeRef.current(); };
  }, []);

  function appendLog(msg: string) {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toISOString().split("T")[1]?.slice(0, 8)}] ${msg}`,
    ]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setResult(null);
    setErrorMsg(null);
    setStatus("idle");
    setLogs([]);
    if (file) appendLog(`已選取：${file.name}（${(file.size / 1024).toFixed(1)} KB）`);
  }

  function buildUuidUploadPath(accountId: string, file: File) {
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const docId = crypto.randomUUID();
    return { uploadPath: `${WATCH_PATH}${accountId}/${docId}${ext}`, docId };
  }

  function watchDocument(docId: string) {
    if (!activeAccountId) {
      appendLog("❌ 缺少 active account，無法監聽文件狀態");
      return;
    }
    try {
      const db = getFirebaseFirestore();
      const docRef = firestoreApi.doc(db, "accounts", activeAccountId, "documents", docId);
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = firestoreApi.onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) { appendLog("等待 Firestore 初始化…"); return; }
        const data = asRecord(snapshot.data());
        const docStatus = asString(data.status, "unknown");
        appendLog(`Firestore update: status=${docStatus}`);
        if (docStatus === "completed") {
          const parsed = asRecord(data.parsed);
          const r: ParseResult = {
            doc_id: docId,
            status: "completed",
            page_count: asNumber(parsed.page_count) ?? 0,
            json_gcs_uri: asString(parsed.json_gcs_uri),
          };
          setResult(r);
          setStatus("done");
          appendLog(`✅ 解析完成：${asNumber(parsed.page_count) ?? 0} 頁`);
          if (unsubscribeRef.current) { unsubscribeRef.current(); unsubscribeRef.current = null; }
        } else if (docStatus === "error") {
          const error = asRecord(data.error);
          const msg = asString(error.message, "未知錯誤");
          setErrorMsg(msg);
          setStatus("error");
          appendLog(`❌ 錯誤：${msg}`);
          if (unsubscribeRef.current) { unsubscribeRef.current(); unsubscribeRef.current = null; }
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 監聽失敗：${msg}`);
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  async function handleUploadAndParse() {
    if (!selectedFile) return;
    if (!activeAccountId) {
      setErrorMsg("缺少 active account，無法上傳與解析");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setResult(null);
    setErrorMsg(null);
    appendLog("📤 上傳檔案到 Cloud Storage…");
    try {
      // Step 1: Upload to GCS
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const { uploadPath, docId } = buildUuidUploadPath(activeAccountId, selectedFile);
      const fileRef = storageApi.ref(storage, uploadPath);
      const snap = await storageApi.uploadBytes(fileRef, selectedFile, {
        contentType: ACCEPTED_MIME[selectedFile.name.split(".").pop()?.toLowerCase() ?? ""] ?? "application/octet-stream",
        customMetadata: {
          account_id: activeAccountId,
          workspace_id: activeWorkspaceId,
          filename: selectedFile.name,
        },
      });
      appendLog(`✅ 上傳完成：${snap.ref.fullPath}`);
      // Step 2: Watch Firestore for status updates
      setStatus("waiting");
      appendLog("⏳ 等待 parse_document 處理…");
      watchDocument(docId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setStatus("error");
      appendLog(`❌ 上傳失敗：${msg}`);
    }
  }

  function reset() {
    if (unsubscribeRef.current) { unsubscribeRef.current(); unsubscribeRef.current = null; }
    setSelectedFile(null);
    setResult(null);
    setErrorMsg(null);
    setStatus("idle");
    setLogs([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const isLoading = status === "uploading" || status === "waiting";
  const parsedDocs = allDocs.filter((doc) => doc.status === "completed");
  const ragReadyCount = allDocs.filter((doc) => doc.rag_status === "ready").length;
  const ragErrorCount = allDocs.filter((doc) => doc.rag_status === "error").length;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
          <FlaskConical className="size-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dev Tools</h1>
          <p className="text-xs text-muted-foreground">
            py_fn · parse_document · Document AI · Firestore 實時監聽
          </p>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card px-3 py-2">
          <p className="text-[11px] text-muted-foreground">全部文件</p>
          <p className="text-lg font-semibold tracking-tight">{allDocs.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <p className="text-[11px] text-emerald-700">解析完成</p>
          <p className="text-lg font-semibold tracking-tight text-emerald-700">{parsedDocs.length}</p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-2">
          <p className="text-[11px] text-blue-700">RAG Ready</p>
          <p className="text-lg font-semibold tracking-tight text-blue-700">{ragReadyCount}</p>
        </div>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
          <p className="text-[11px] text-destructive">RAG Error</p>
          <p className="text-lg font-semibold tracking-tight text-destructive">{ragErrorCount}</p>
        </div>
      </section>

      {/* ── File picker ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          1. 選擇檔案
        </h2>
        <label
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition
            ${selectedFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}
        >
          <FileUp className="size-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "點擊或拖曳上傳"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">支援：{ACCEPTED_EXTS}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={Object.keys(ACCEPTED_MIME).join(",")}
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </section>

      {/* ── Actions ────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          2. 執行上傳 &amp; 解析
        </h2>
        <div className="flex gap-3">
          <Button onClick={handleUploadAndParse} disabled={!selectedFile || isLoading} className="gap-2">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <FlaskConical className="size-4" />}
            {status === "uploading" ? "上傳中…" : status === "waiting" ? "等待中…" : "開始"}
          </Button>
          <Button variant="outline" onClick={reset} disabled={isLoading}>
            重置
          </Button>
        </div>
      </section>

      {/* ── Result ─────────────────────────────────────────────────── */}
      {(status === "done" || status === "error") && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            3. 結果
          </h2>
          {status === "done" && result && (
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="text-sm font-medium">解析成功</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">doc_id</dt>
                <dd className="font-mono text-xs">{result.doc_id}</dd>
                <dt className="text-muted-foreground">page_count</dt>
                <dd className="font-bold">{result.page_count}</dd>
                <dt className="text-muted-foreground">JSON 位置</dt>
                <dd className="font-mono text-xs break-all">{result.json_gcs_uri || "—"}</dd>
              </dl>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <XCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </section>
      )}

      {status === "waiting" && (
        <section className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-blue-300/30 bg-blue-500/5 p-4 text-sm text-blue-600">
            <AlertCircle className="mt-0.5 size-4 shrink-0 animate-pulse" />
            <div>
              <p className="font-medium">處理中…</p>
              <p className="mt-1 text-xs opacity-75">Document AI 正在解析檔案，請稍候</p>
            </div>
          </div>
        </section>
      )}

      {/* ── All uploaded docs table ─────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            已上傳檔案（{allDocs.length}）
          </h2>
        </div>
        {allDocs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            尚無上傳記錄
          </p>
        ) : (
          <div className="space-y-0 overflow-hidden rounded-xl border border-border/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">狀態</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">RAG</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">頁數</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">上傳時間</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {allDocs.map((doc, i) => (
                    <tr
                      key={doc.id}
                      className={`border-b border-border/40 last:border-0 transition-colors ${
                        selectedDocId === doc.id
                          ? "bg-primary/8 ring-1 ring-inset ring-primary/20"
                          : i % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs max-w-[180px] truncate" title={doc.filename}>
                        {doc.filename}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={doc.status} errorMessage={doc.error_message} />
                      </td>
                      <td className="px-4 py-2.5">
                        <RagBadge status={doc.rag_status} error={doc.rag_error} />
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        {doc.page_count != null ? doc.page_count : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(doc.uploaded_at)}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { void handleViewOriginal(doc); }}
                            disabled={!doc.gcs_uri}
                            title="查看原始檔案"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ExternalLink className="size-3.5" />
                          </button>
                          <button
                            onClick={() => { void handleViewJson(doc); }}
                            disabled={doc.status !== "completed" || !doc.json_gcs_uri}
                            title="查看 JSON 解析結果"
                            className={`inline-flex size-7 items-center justify-center rounded-md transition hover:bg-muted disabled:opacity-30 ${
                              selectedDocId === doc.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Code2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => { void handleDeleteDoc(doc); }}
                            disabled={deletingId === doc.id}
                            title="刪除"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                          >
                            {deletingId === doc.id
                              ? <Loader2 className="size-3.5 animate-spin" />
                              : <Trash2 className="size-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* JSON preview panel */}
            {selectedDocId && (
              <div className="border-t border-border/60 bg-[#0d1117]">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <Code2 className="size-3.5" />
                    <span className="font-mono">
                      {selectedDoc?.filename ?? selectedDocId} — JSON
                    </span>
                  </div>
                  <button
                    onClick={closeJsonPreview}
                    className="text-white/30 hover:text-white/70 transition text-xs"
                  >
                    ✕ 關閉
                  </button>
                </div>
                {selectedDoc?.rag_status === "error" && (
                  <div className="border-b border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                    RAG 失敗：{selectedDoc.rag_error || "未知錯誤"}
                  </div>
                )}
                <div className="max-h-80 overflow-y-auto p-4">
                  {jsonLoading ? (
                    <div className="flex items-center gap-2 text-green-400/60 text-xs">
                      <Loader2 className="size-3.5 animate-spin" /> 載入中…
                    </div>
                  ) : (
                    <pre className="font-mono text-xs leading-relaxed text-green-400 whitespace-pre-wrap break-words">
                      {jsonContent}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Parsed docs table (extracted component) ─────────────────── */}
      <DevToolsParsedDocsSection
        parsedDocs={parsedDocs}
        reindexingId={reindexingId}
        onViewJson={(doc) => { void handleViewJson(doc); }}
        onManualProcess={(doc) => { void handleManualProcess(doc, appendLog); }}
        formatNormalizationRatio={formatNormalizationRatio}
      />

      {/* ── Console log ────────────────────────────────────────────── */}
      {logs.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Console
          </h2>
          <div className="max-h-48 overflow-y-auto rounded-xl bg-[#0d1117] p-4">
            {logs.map((line, i) => (
              <p key={i} className="font-mono text-xs leading-relaxed text-green-400">
                {line}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

## File: app/(shell)/(account)/[accountId]/dev-tools/use-dev-tools-doc-list.ts
```typescript
"use client";

/**
 * useDevToolsDocList.ts
 * Owns: Firestore subscription for the document list, JSON-preview state,
 *   and all per-document async operations (view, delete, reindex).
 */

import { useEffect, useRef, useState } from "react";

import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";

import {
  UPLOAD_BUCKET,
  mapSnapshotDoc,
  formatDateTime,
  type DocRecord,
} from "./dev-tools-helpers";

// ── Public state ───────────────────────────────────────────────────────────

export interface DocListState {
  allDocs: DocRecord[];
  selectedDocId: string | null;
  selectedDoc: DocRecord | undefined;
  jsonContent: string | null;
  jsonLoading: boolean;
  deletingId: string | null;
  reindexingId: string | null;
}

export interface DocListHandlers {
  handleViewOriginal: (doc: DocRecord) => Promise<void>;
  handleViewJson: (doc: DocRecord) => Promise<void>;
  handleDeleteDoc: (doc: DocRecord) => Promise<void>;
  handleManualProcess: (doc: DocRecord, appendLog: (msg: string) => void) => Promise<void>;
  closeJsonPreview: () => void;
  formatNormalizationRatio: (doc: DocRecord) => string;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useDevToolsDocList(activeAccountId: string): DocListState & DocListHandlers {
  const [allDocs, setAllDocs] = useState<DocRecord[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<string | null>(null);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  const unsubscribeListRef = useRef<(() => void) | null>(null);

  // Subscribe to all documents for this account
  useEffect(() => {
    if (!activeAccountId) {
      setAllDocs([]);
      return;
    }
    try {
      const db = getFirebaseFirestore();
      const colRef = firestoreApi.collection(db, "accounts", activeAccountId, "documents");
      unsubscribeListRef.current = firestoreApi.onSnapshot(colRef, (snapshot) => {
        const docs: DocRecord[] = snapshot.docs.map(mapSnapshotDoc);
        docs.sort((a, b) => (b.uploaded_at?.getTime() ?? 0) - (a.uploaded_at?.getTime() ?? 0));
        setAllDocs(docs);
      });
    } catch (_err) {}
    return () => { unsubscribeListRef.current?.(); };
  }, [activeAccountId]);

  function closeJsonPreview() {
    setSelectedDocId(null);
    setJsonContent(null);
  }

  async function handleViewOriginal(doc: DocRecord) {
    if (!doc.gcs_uri) return;
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const fileRef = storageApi.ref(storage, doc.gcs_uri);
      const url = await storageApi.getDownloadURL(fileRef);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      alert(`無法取得下載連結：${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async function handleViewJson(doc: DocRecord) {
    if (!doc.json_gcs_uri) return;
    if (selectedDocId === doc.id && jsonContent !== null) {
      closeJsonPreview();
      return;
    }
    setSelectedDocId(doc.id);
    setJsonContent(null);
    setJsonLoading(true);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const jsonRef = storageApi.ref(storage, doc.json_gcs_uri);
      const url = await storageApi.getDownloadURL(jsonRef);
      const res = await fetch(url);
      const text = await res.text();
      setJsonContent(text);
    } catch (err: unknown) {
      setJsonContent(`// 載入失敗：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setJsonLoading(false);
    }
  }

  async function handleDeleteDoc(doc: DocRecord) {
    if (
      !window.confirm(
        `確定刪除「${doc.filename}」？\n此操作將同時刪除 Firestore 記錄與 GCS 檔案，無法復原。`,
      )
    )
      return;
    setDeletingId(doc.id);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const db = getFirebaseFirestore();
      if (doc.gcs_uri) {
        try { await storageApi.deleteObject(storageApi.ref(storage, doc.gcs_uri)); } catch (_err) {}
      }
      if (doc.json_gcs_uri) {
        try { await storageApi.deleteObject(storageApi.ref(storage, doc.json_gcs_uri)); } catch (_err) {}
      }
      if (!activeAccountId) throw new Error("缺少 active account");
      await firestoreApi.deleteDoc(
        firestoreApi.doc(db, "accounts", activeAccountId, "documents", doc.id),
      );
      if (selectedDocId === doc.id) closeJsonPreview();
    } catch (err: unknown) {
      alert(`刪除失敗：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleManualProcess(
    doc: DocRecord,
    appendLog: (msg: string) => void,
  ) {
    if (!doc.json_gcs_uri) return;
    if (!activeAccountId) {
      alert("缺少 active account，無法手動整理");
      return;
    }
    setReindexingId(doc.id);
    appendLog(`🧹 手動整理開始：${doc.id}`);
    try {
      const functions = getFirebaseFunctions("asia-southeast1");
      const callable = functionsApi.httpsCallable(functions, "rag_reindex_document");
      await callable({
        account_id: activeAccountId,
        doc_id: doc.id,
        json_gcs_uri: doc.json_gcs_uri,
        source_gcs_uri: doc.gcs_uri,
        filename: doc.filename,
        page_count: doc.page_count ?? 0,
      });
      appendLog(`✅ 手動整理完成：${doc.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 手動整理失敗：${msg}`);
      alert(`手動整理失敗：${msg}`);
    } finally {
      setReindexingId(null);
    }
  }

  function formatNormalizationRatio(doc: DocRecord): string {
    const raw = doc.rag_raw_chars ?? 0;
    const normalized = doc.rag_normalized_chars ?? 0;
    if (raw <= 0 || normalized <= 0) return "—";
    const ratio = (normalized / raw) * 100;
    return `${normalized.toLocaleString()} / ${raw.toLocaleString()} (${ratio.toFixed(1)}%)`;
  }

  const selectedDoc = selectedDocId ? allDocs.find((d) => d.id === selectedDocId) : undefined;

  return {
    allDocs,
    selectedDocId,
    selectedDoc,
    jsonContent,
    jsonLoading,
    deletingId,
    reindexingId,
    handleViewOriginal,
    handleViewJson,
    handleDeleteDoc,
    handleManualProcess,
    closeJsonPreview,
    formatNormalizationRatio,
    // re-export for table columns
  };
}

// Re-export for convenience in table components
export { formatDateTime };
```

## File: app/(shell)/(account)/[accountId]/organization/_utils.ts
```typescript
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value instanceof Date ? value : new Date(value));
  } catch {
    return value instanceof Date ? value.toISOString() : String(value);
  }
}
```

## File: app/(shell)/(account)/[accountId]/organization/audit/_components/OrganizationAuditPage.tsx
```typescript
"use client";

import { useEffect, useMemo, useState } from "react";

import { AuditStream, getOrganizationAuditLogs } from "@/modules/workspace/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface OrganizationAuditPageProps {
  organizationId: string | null;
  workspaces: Record<string, WorkspaceEntity>;
  workspacesHydrated: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value instanceof Date ? value : new Date(value));
  } catch {
    return value instanceof Date ? value.toISOString() : String(value);
  }
}

const MAX_DISPLAYED_AUDIT_LOGS = 50;

// ── Component ─────────────────────────────────────────────────────────────────

export function OrganizationAuditPage({
  organizationId,
  workspaces,
  workspacesHydrated,
}: OrganizationAuditPageProps) {
  const [auditLogs, setAuditLogs] = useState<
    Awaited<ReturnType<typeof getOrganizationAuditLogs>>
  >([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  // workspaceNameById is derived from the workspaces prop — no extra fetch needed.
  const workspaceNameById = useMemo(
    () => new Map(Object.values(workspaces).map((w) => [w.id, w.name])),
    [workspaces],
  );

  useEffect(() => {
    if (!organizationId || !workspacesHydrated) return;
    let cancelled = false;
    const workspaceIds = Object.keys(workspaces);

    async function load() {
      setLoadState("loading");
      try {
        const logs = await getOrganizationAuditLogs(workspaceIds, MAX_DISPLAYED_AUDIT_LOGS);
        if (!cancelled) {
          setAuditLogs(logs);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setAuditLogs([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [organizationId, workspacesHydrated, workspaces]);

  if (!organizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">稽核</h1>
        <p className="mt-1 text-sm text-muted-foreground">組織下所有工作區的 audit log 彙整。</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Audit</CardTitle>
          <CardDescription>組織下所有工作區的 audit log 彙整。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入稽核資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取稽核資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && auditLogs.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的 audit logs。</p>
          )}
          {loadState === "loaded" &&
            auditLogs.slice(0, MAX_DISPLAYED_AUDIT_LOGS).map((log) => (
              <div key={log.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{log.action}</p>
                  <Badge variant="outline">{log.source}</Badge>
                  <Badge variant="secondary">
                    {workspaceNameById.get(log.workspaceId) ?? log.workspaceId}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{log.detail || "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(log.occurredAtISO)}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* ── 稽核時間軸（新版 AuditStream）─────────────────────────────── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>稽核時間軸</CardTitle>
          <CardDescription>
            以時間軸視覺化呈現稽核事件；嚴重程度由色點標示（藍 = 中、橘 = 高、紅 = 嚴重）。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditStream logs={auditLogs} height={500} />
        </CardContent>
      </Card>
    </div>
  );
}
```

## File: app/(shell)/(account)/[accountId]/organization/audit/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount } from "@/modules/platform/api";
import { useWorkspaceContext } from "@/modules/workspace/api";
import { OrganizationAuditPage } from "./_components/OrganizationAuditPage";

export default function OrganizationAuditPageRoute() {
  const { state: appState } = useApp();
  const { state: wsState } = useWorkspaceContext();
  const { activeAccount } = appState;
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  return (
    <OrganizationAuditPage
      organizationId={organizationId}
      workspaces={wsState.workspaces}
      workspacesHydrated={wsState.workspacesHydrated}
    />
  );
}
```

## File: app/(shell)/(account)/[accountId]/organization/daily/page.tsx
```typescript
"use client";

import { useApp } from "@/modules/platform/api";
import { WorkspaceFeedAccountView } from "@/modules/workspace/api";
import { isActiveOrganizationAccount } from "@/modules/platform/api";

export default function OrganizationDailyPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  if (!activeOrganizationId) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-border/60 bg-card/50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Account Workspace Feed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              聚合名下所有 workspace 的 feed，並提供 Reply / Repost / Like / View / Bookmark / Share 互動。
            </p>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            live
          </div>
        </div>
      </header>

      <WorkspaceFeedAccountView accountId={activeOrganizationId} />
    </section>
  );
}
```

## File: app/(shell)/(account)/[accountId]/organization/members/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount, MembersPage } from "@/modules/platform/api"

export default function OrganizationMembersPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <MembersPage organizationId={organizationId} />;
}
```

## File: app/(shell)/(account)/[accountId]/organization/permissions/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount, PermissionsPage } from "@/modules/platform/api"

export default function OrganizationPermissionsPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <PermissionsPage organizationId={organizationId} />;
}
```

## File: app/(shell)/(account)/[accountId]/organization/schedule/page.tsx
```typescript
"use client";

import { useApp } from "@/modules/platform/api";
import { AccountSchedulingView } from "@/modules/workspace/api";
import { isActiveOrganizationAccount } from "@/modules/platform/api";

export default function OrganizationSchedulePage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;

  const activeOrganizationId = isActiveOrganizationAccount(activeAccount)
    ? activeAccount.id
    : null;

  if (!activeOrganizationId) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-4 py-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Account Scheduling
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          工作需求總覽
        </h1>
      </header>

      <AccountSchedulingView
        accountId={activeOrganizationId}
        currentUserId={activeOrganizationId}
      />
    </section>
  );
}
```

## File: app/(shell)/(account)/[accountId]/organization/teams/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount, TeamsPage } from "@/modules/platform/api"

export default function OrganizationTeamsPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <TeamsPage organizationId={organizationId} />;
}
```

## File: app/(shell)/(account)/[accountId]/organization/workspaces/page.tsx
```typescript
"use client";

import { useApp } from "@/modules/platform/api";
import { OrganizationWorkspacesScreen } from "@/modules/workspace/api";
import { isActiveOrganizationAccount } from "@/modules/platform/api";

export default function OrganizationWorkspacesPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  return <OrganizationWorkspacesScreen accountId={activeOrganizationId} />;
}
```

## File: app/(shell)/(account)/[accountId]/settings/notifications/page.tsx
```typescript
"use client";

import { useAuth, NotificationsPage } from "@/modules/platform/api"

export default function NotificationCenterPage() {
  const { state: authState } = useAuth();
  const recipientId = authState.user?.id ?? "";
  return <NotificationsPage recipientId={recipientId} />;
}
```

## File: app/(shell)/(account)/[accountId]/settings/profile/page.tsx
```typescript
"use client";

import { SettingsProfileRouteScreen, useAuth } from "@/modules/platform/api";

export default function SettingsProfilePage() {
  const { state: authState } = useAuth();

  return (
    <SettingsProfileRouteScreen
      actorId={authState.user?.id ?? null}
      fallbackDisplayName={authState.user?.name ?? ""}
    />
  );
}
```

## File: app/(shell)/layout.tsx
```typescript
"use client";

/**
 * app/(shell)/layout.tsx — Next.js route layout shim.
 * Canonical implementation: app/(shell)/_shell/ShellRootLayout.tsx
 */

import { ShellLayout } from "./_shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ShellLayout>{children}</ShellLayout>;
}
```

## File: app/layout.tsx
```typescript
import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@shared-utils";
import { Providers } from "./_providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Xuanwu App",
  description: "Xuanwu App - Modular Domain-Driven Design template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## File: app/(shell)/_providers/AppProvider.tsx
```typescript
"use client";

/**
 * AppProvider — app/(shell)/ composition layer
 *
 * Manages the platform-owned account lifecycle (auth → accounts → activeAccount).
 * Lives in app/ because the cross-module composition root is the correct owner
 * of account-state wiring that reads from platform subdomain queries.
 *
 * Workspace state is managed by WorkspaceContextProvider from workspace module.
 */

import { useReducer, useEffect, type ReactNode } from "react";

import {
  AppContext,
  APP_INITIAL_STATE,
  type AppState,
  type AppAction,
} from "@/modules/platform/api";
import {
  resolveActiveAccount,
  subscribeToAccountsForUser,
} from "@/modules/platform/api";
import { useAuth } from "@/modules/platform/api";

const LAST_ACTIVE_ACCOUNT_STORAGE_KEY = "xuanwu_last_active_account";

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SEED_ACTIVE_ACCOUNT":
      return {
        ...state,
        accounts: {},
        accountsHydrated: false,
        bootstrapPhase: "seeded",
        activeAccount: action.payload.user,
      };
    case "SET_ACCOUNTS": {
      const { accounts, user, preferredActiveAccountId } = action.payload;
      return {
        ...state,
        accounts,
        accountsHydrated: true,
        bootstrapPhase: "hydrated",
        activeAccount: resolveActiveAccount({
          currentActiveAccount: state.activeAccount,
          accounts,
          personalAccount: user,
          preferredActiveAccountId,
          bootstrapPhase: state.bootstrapPhase,
        }),
      };
    }
    case "SET_ACTIVE_ACCOUNT":
      if (state.activeAccount?.id === action.payload?.id) return state;
      return {
        ...state,
        activeAccount: action.payload,
      };
    case "RESET_STATE":
      return APP_INITIAL_STATE;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  const { user, status } = authState;
  const [state, dispatch] = useReducer(appReducer, APP_INITIAL_STATE);

  useEffect(() => {
    if (status === "initializing") return;

    if (!user) {
      dispatch({ type: "RESET_STATE" });
      return;
    }

    dispatch({ type: "SEED_ACTIVE_ACCOUNT", payload: { user } });
    const preferredActiveAccountId =
      typeof window === "undefined"
        ? null
        : window.localStorage.getItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);

    const unsubscribe = subscribeToAccountsForUser(user.id, (accounts) => {
      dispatch({
        type: "SET_ACCOUNTS",
        payload: { accounts, user, preferredActiveAccountId },
      });
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeAccountId = state.activeAccount?.id;

    if (!user || !activeAccountId) {
      window.localStorage.removeItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY, activeAccountId);
  }, [state.activeAccount?.id, user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
```

## File: app/(shell)/_shell/ShellContextNavSection.tsx
```typescript
"use client";

/**
 * ShellContextNavSection — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace module.
 */

import Link from "next/link";
import { appendWorkspaceContextQuery } from "@/modules/workspace/api";
import { buildShellContextualHref } from "@/modules/platform/api";

interface ContextScopedNavItem {
  href: string;
  label: string;
}

interface ShellContextNavSectionProps {
  title: string;
  items: readonly ContextScopedNavItem[];
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  activeWorkspaceId: string | null;
}

export function ShellContextNavSection({
  title,
  items,
  isActiveRoute,
  activeAccountId,
  activeWorkspaceId,
}: ShellContextNavSectionProps) {
  return (
    <nav className="space-y-0.5" aria-label={`${title}導覽`}>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </p>
      {(activeAccountId || activeWorkspaceId) && (
        <p className="px-2 pb-1 text-[11px] text-muted-foreground">
          {activeAccountId ? `帳號: ${activeAccountId.slice(0, 8)}` : "帳號: -"}
          {" · "}
          {activeWorkspaceId ? `工作區: ${activeWorkspaceId.slice(0, 8)}` : "工作區: -"}
        </p>
      )}
      {items.map((item) => {
        const scopedHref = buildShellContextualHref(item.href, {
          accountId: activeAccountId,
          workspaceId: activeWorkspaceId,
        });
        const contextualHref = appendWorkspaceContextQuery(scopedHref, {
          accountId: activeAccountId,
          workspaceId: activeWorkspaceId,
        });
        const active = isActiveRoute(contextualHref);
        return (
          <Link
            key={item.href}
            href={contextualHref}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

## File: app/(shell)/(account)/[accountId]/layout.tsx
```typescript
import type { ReactNode } from "react";

interface AccountRouteLayoutProps {
	readonly children: ReactNode;
}

export default function AccountRouteLayout({ children }: AccountRouteLayoutProps) {
	return children;
}
```

## File: app/(shell)/(account)/[accountId]/organization/content/page.tsx
```typescript
import { redirect } from "next/navigation";

interface OrganizationKnowledgePageProps {
  params: {
    accountId: string;
  };
}

export default function OrganizationKnowledgePage({ params }: OrganizationKnowledgePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}?tab=Overview&panel=knowledge-pages`);
}
```

## File: app/(shell)/(account)/[accountId]/organization/page.tsx
```typescript
"use client";

/**
 * Organization Overview Page — /organization
 * Lists organizations visible to the current user and allows switching
 * to an organization account context.
 * Section pages live under /organization/[section].
 */

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useApp, useAuth } from "@/modules/platform/api"
import type { AccountEntity } from "@/modules/platform/api";
import { isActiveOrganizationAccount } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

export default function OrganizationPage() {
  const router = useRouter();
  const params = useParams<{ accountId: string }>();
  const { state: appState, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { user } = authState;
  const { accounts, activeAccount, accountsHydrated, bootstrapPhase } = appState;

  const orgList = Object.values(accounts);
  const activeOrganizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  const routeAccountId = typeof params.accountId === "string" ? params.accountId : "";

  function buildAccountHref(targetAccountId: string, suffix = "") {
    const base = `/${encodeURIComponent(targetAccountId)}`;
    return suffix ? `${base}${suffix}` : base;
  }

  const currentAccountId = routeAccountId || activeAccount?.id || user?.id || "";

  function handleSwitch(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
    router.replace(buildAccountHref(account.id));
  }

  function handleSwitchToPersonal() {
    if (!user) return;
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: user });
    router.replace(buildAccountHref(user.id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Context Switcher</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          先選擇個人或組織帳號情境，再回到 workspace-first 主流程。
        </p>
      </div>

      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold">Recommended flow</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1. Identity</span>：登入後確認你目前要操作的個人／組織帳號。
          </li>
          <li>
            <span className="font-medium text-foreground">2. Organization</span>：在這裡切換 active account。
          </li>
          <li>
            <span className="font-medium text-foreground">3. Workspace</span>：回到工作區，再進入 Knowledge、知識頁面、Notebook / AI。
          </li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={currentAccountId ? buildAccountHref(currentAccountId) : "/"}>回到 Workspace Hub</Link>
          </Button>
          {activeOrganizationId && (
            <Button asChild size="sm" variant="outline">
              <Link href={buildAccountHref(activeOrganizationId, "/organization/members")}>組織治理模組</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Quick-access dashboard — visible only when an org context is active */}
      {activeOrganizationId && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">組織功能</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { href: activeOrganizationId ? buildAccountHref(activeOrganizationId, "/organization/members") : "", title: "成員管理", desc: "邀請與管理組織成員" },
              { href: activeOrganizationId ? buildAccountHref(activeOrganizationId, "/organization/teams") : "", title: "團隊管理", desc: "建立與編輯團隊" },
              { href: activeOrganizationId ? buildAccountHref(activeOrganizationId, "/organization/permissions") : "", title: "權限政策", desc: "設定存取規則" },
              { href: activeOrganizationId ? buildAccountHref(activeOrganizationId, "/organization/workspaces") : "", title: "工作區", desc: "組織下的工作區清單" },
              { href: activeOrganizationId ? buildAccountHref(activeOrganizationId, "/organization/schedule") : "", title: "工作需求排程", desc: "排程與容量總覽" },
              { href: activeOrganizationId ? buildAccountHref(activeOrganizationId, "/organization/audit") : "", title: "稽核記錄", desc: "操作歷史追蹤" },
              { href: activeOrganizationId ? buildAccountHref(activeOrganizationId, "/organization/daily") : "", title: "動態牆", desc: "組織工作區動態" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/40">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm">{item.title}</CardTitle>
                    <CardDescription className="text-xs">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          {bootstrapPhase === "seeded"
            ? "正在同步你的組織清單，完成後就能切換到對應的組織上下文。"
            : "正在載入組織資料…"}
        </div>
      )}

      {/* Personal account */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Personal Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{user?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          {activeAccount?.id === user?.id ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Active
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSwitchToPersonal}
            >
              Switch
            </Button>
          )}
        </div>
      </section>

      {/* Organizations */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">
          Organizations
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({orgList.length})
          </span>
        </h2>

        {orgList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You are not a member of any organization yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {orgList.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{org.name}</p>
                  {org.description && (
                    <p className="text-xs text-muted-foreground">{org.description}</p>
                  )}
                </div>
                {activeAccount?.id === org.id ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Active
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSwitch(org)}
                  >
                    Switch
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeOrganizationId && (
        <p className="text-sm text-muted-foreground">
          已切換組織情境；下一步建議先回到 Workspace Hub，再從工作區進入知識與協作模組。
        </p>
      )}
    </div>
  );
}
```

## File: app/(shell)/(account)/[accountId]/organization/schedule/dispatcher/page.tsx
```typescript
import { redirect } from "next/navigation";

/**
 * Dispatcher page — redirects to the organization schedule view.
 * Route: /organization/schedule/dispatcher
 */
interface DispatcherPageProps {
  params: {
    accountId: string;
  };
}

export default function DispatcherPage({ params }: DispatcherPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/organization/schedule`);
}
```

## File: app/(shell)/(account)/[accountId]/page.tsx
```typescript
"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import type { ActiveAccount } from "@/modules/platform/api";
import {
  isActiveOrganizationAccount,
  useApp,
  useAuth,
} from "@/modules/platform/api";
import { WorkspaceHubScreen } from "@/modules/workspace/api";

function getAccountTypeFromRoute(accountId: string, authUserId: string | null): "user" | "organization" {
  if (!accountId) {
    return "user";
  }
  return authUserId && accountId === authUserId ? "user" : "organization";
}

function getFallbackAccountType(activeAccount: ActiveAccount | null): "user" | "organization" {
  return isActiveOrganizationAccount(activeAccount) ? "organization" : "user";
}

export default function AccountWorkspaceHubPage() {
  const router = useRouter();
  const params = useParams<{ accountId: string }>();
  const routeAccountId = typeof params.accountId === "string" ? params.accountId : "";
  const isLegacyWorkspaceAlias = routeAccountId === "workspace";
  const searchParams = useSearchParams();

  const {
    state: { activeAccount, accounts, accountsHydrated, bootstrapPhase },
  } = useApp();
  const { state: authState } = useAuth();

  const resolvedAccountId =
    (isLegacyWorkspaceAlias ? activeAccount?.id : routeAccountId) || activeAccount?.id || "";
  const authUserId = authState.user?.id ?? null;
  const authUserName = authState.user?.name ?? null;
  const organizationAccount = Object.values(accounts).find(
    (account) => account.id === resolvedAccountId,
  );

  const accountName =
    resolvedAccountId === authUserId
      ? authUserName
      : organizationAccount?.name ??
        (resolvedAccountId === activeAccount?.id ? activeAccount?.name : null);

  const accountType = resolvedAccountId
    ? getAccountTypeFromRoute(resolvedAccountId, authUserId)
    : getFallbackAccountType(activeAccount);

  const context = searchParams.get("context");

  useEffect(() => {
    if (!isLegacyWorkspaceAlias || !activeAccount?.id) {
      return;
    }

    const query = searchParams.toString();
    const targetPath = `/${encodeURIComponent(activeAccount.id)}`;
    router.replace(query.length > 0 ? `${targetPath}?${query}` : targetPath);
  }, [activeAccount?.id, isLegacyWorkspaceAlias, router, searchParams]);

  if (isLegacyWorkspaceAlias && activeAccount?.id) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">
        正在導向帳號工作區路由…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {context === "unavailable" && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          目前帳戶無法存取該工作區，已返回工作區清單。
        </div>
      )}

      <WorkspaceHubScreen
        accountId={resolvedAccountId || null}
        accountName={accountName}
        accountType={accountType}
        accountsHydrated={accountsHydrated}
        isBootstrapSeeded={bootstrapPhase === "seeded"}
        currentUserId={authUserId}
      />
    </div>
  );
}
```

## File: app/(shell)/(account)/[accountId]/settings/general/page.tsx
```typescript
/**
 * /settings/general — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";

interface SettingsGeneralPageProps {
  params: {
    accountId: string;
  };
}

export default function SettingsGeneralPage({ params }: SettingsGeneralPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}?tab=Overview&panel=settings`);
}
```

## File: app/(shell)/(account)/[accountId]/settings/page.tsx
```typescript
import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: {
    accountId: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}?tab=Overview&panel=settings`);
}
```

## File: app/(shell)/_shell/ShellDashboardSidebar.tsx
```typescript
"use client";

/**
 * ShellDashboardSidebar — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes workspace module components.
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  buildWorkspaceQuickAccessItems,
  CustomizeNavigationDialog,
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  readNavPreferences,
  buildWorkspaceContextHref,
  supportsWorkspaceSearchContext,
  type NavPreferences,
  useRecentWorkspaces,
  useSidebarLocale,
  WorkspaceQuickAccessRow,
} from "@/modules/workspace/api";

import {
  quickCreateKnowledgePage,
} from "./shell-quick-create";
import {
  type DashboardSidebarProps,
  ORGANIZATION_MANAGEMENT_ITEMS,
  ACCOUNT_NAV_ITEMS,
  SECTION_TITLES,
  resolveNavSection,
  isActiveRoute,
  isActiveOrganizationAccount,
} from "./ShellSidebarNavData";
import { ShellSidebarHeader } from "./ShellSidebarHeader";
import { DashboardSidebarBody } from "./ShellSidebarBody";

export function ShellDashboardSidebar({
  pathname,
  userId,
  activeAccount,
  workspaces,
  workspacesHydrated,
  activeWorkspaceId,
  collapsed,
  onToggleCollapsed,
  onSelectWorkspace,
}: DashboardSidebarProps) {
  const searchParams = useSearchParams();

  const { isExpanded, setIsExpanded, recentWorkspaceLinks } = useRecentWorkspaces(
    activeAccount?.id,
    pathname,
    workspaces,
  );
  const [creatingKind, setCreatingKind] = useState<"page" | "database" | null>(null);
  const [navPrefs, setNavPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const localeBundle = useSidebarLocale();

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  const visibleOrganizationManagementItems = useMemo(
    () => ORGANIZATION_MANAGEMENT_ITEMS.filter((item) => navPrefs.pinnedWorkspace.includes(item.id)),
    [navPrefs.pinnedWorkspace],
  );

  const visibleAccountItems = useMemo(
    () => ACCOUNT_NAV_ITEMS.filter((item) => navPrefs.pinnedWorkspace.includes(item.id)),
    [navPrefs.pinnedWorkspace],
  );

  const showRecentWorkspaces = navPrefs.pinnedPersonal.includes("recent-workspaces");

  const effectiveMaxWorkspaces = navPrefs.showLimitedWorkspaces
    ? navPrefs.maxWorkspaces
    : MAX_VISIBLE_RECENT_WORKSPACES;

  const currentSearchWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";

  useEffect(() => {
    const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
    if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(pathWorkspaceId);
      return;
    }

    if (!supportsWorkspaceSearchContext(pathname)) {
      return;
    }

    if (currentSearchWorkspaceId && currentSearchWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(currentSearchWorkspaceId);
    }
  }, [pathname, activeWorkspaceId, currentSearchWorkspaceId, onSelectWorkspace]);

  const hasOverflow = recentWorkspaceLinks.length > effectiveMaxWorkspaces;
  const visibleRecentWorkspaceLinks = isExpanded
    ? recentWorkspaceLinks
    : recentWorkspaceLinks.slice(0, effectiveMaxWorkspaces);

  const allWorkspaceLinks = useMemo(
    () =>
      workspaces
        .map((workspace) => ({
          id: workspace.id,
          name: workspace.name,
          href: buildWorkspaceContextHref(pathname, workspace.id),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces, pathname],
  );

  const section = resolveNavSection(pathname);
  const sectionMeta = SECTION_TITLES[section];
  const workspacePathId = getWorkspaceIdFromPath(pathname);
  const currentPanel = searchParams.get("panel");
  const currentWorkspaceTab = searchParams.get("tab");
  const hasSingleWorkspaceContext = section === "workspace" && Boolean(workspacePathId);
  const hasWorkspaceToolContext =
    Boolean(activeWorkspaceId || currentSearchWorkspaceId) &&
    (section === "knowledge" ||
      section === "knowledge-base" ||
      section === "source" ||
      section === "notebook");
  const workspaceQuickAccessId =
    workspacePathId || currentSearchWorkspaceId || (hasWorkspaceToolContext ? activeWorkspaceId ?? "" : "");
  const showWorkspaceQuickAccess = hasSingleWorkspaceContext || hasWorkspaceToolContext;
  const workspaceSettingsHref = workspaceQuickAccessId
    ? activeAccount?.id
      ? `/${encodeURIComponent(activeAccount.id)}/${encodeURIComponent(workspaceQuickAccessId)}?tab=Overview&panel=settings`
      : "/"
    : "";
  const workspaceQuickAccessItems = useMemo(
    () =>
      showWorkspaceQuickAccess && workspaceQuickAccessId
        ? buildWorkspaceQuickAccessItems(workspaceQuickAccessId, activeAccount?.id)
        : [],
    [showWorkspaceQuickAccess, workspaceQuickAccessId, activeAccount?.id],
  );

  async function handleQuickCreatePage() {
    const accountId = activeAccount?.id ?? "";
    if (!accountId || !activeWorkspaceId) {
      toast.error(!accountId ? "目前沒有 active account，無法建立" : "請先切換到工作區，再建立頁面");
      return;
    }
    setCreatingKind("page");
    try {
      const result = await quickCreateKnowledgePage({
        accountId,
        workspaceId: activeWorkspaceId,
        createdByUserId: userId ?? accountId,
      });
      if (result.success) {
        toast.success("已建立頁面");
      } else {
        toast.error(result.error?.message ?? "建立頁面失敗");
      }
    } catch (error) {
      console.error(error);
      toast.error("建立頁面失敗");
    } finally {
      setCreatingKind(null);
    }
  }

  return (
    <div className="contents">
      <aside
        aria-label="Secondary navigation"
        className={`hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex ${
          collapsed ? "w-0" : "w-56 border-r border-border/50 bg-card/20"
        }`}
      >
        <ShellSidebarHeader
          sectionLabel={sectionMeta.label}
          sectionIcon={sectionMeta.icon}
          onOpenCustomize={() => {
            setCustomizeOpen(true);
          }}
          onToggleCollapsed={onToggleCollapsed}
        />

        <WorkspaceQuickAccessRow
          items={workspaceQuickAccessItems}
          pathname={pathname}
          currentPanel={currentPanel}
          currentWorkspaceTab={currentWorkspaceTab}
          workspaceSettingsHref={workspaceSettingsHref}
          isActiveRoute={(href) => isActiveRoute(pathname, href)}
        />

        <DashboardSidebarBody
          section={section}
          isActiveRoute={(href) => isActiveRoute(pathname, href)}
          activeAccountId={activeAccount?.id ?? null}
          showAccountManagement={showAccountManagement}
          visibleAccountItems={visibleAccountItems}
          visibleOrganizationManagementItems={visibleOrganizationManagementItems}
          workspacePathId={workspacePathId}
          navPrefs={navPrefs}
          localeBundle={localeBundle}
          showRecentWorkspaces={showRecentWorkspaces}
          visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
          hasOverflow={hasOverflow}
          isExpanded={isExpanded}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={onSelectWorkspace}
          onToggleExpanded={() => {
            setIsExpanded((prev) => !prev);
          }}
          pathname={pathname}
          workspacesHydrated={workspacesHydrated}
          allWorkspaceLinks={allWorkspaceLinks}
          currentSearchWorkspaceId={currentSearchWorkspaceId}
          creatingKind={creatingKind}
          onQuickCreatePage={() => {
            void handleQuickCreatePage();
          }}
        />
      </aside>

      <CustomizeNavigationDialog
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        onPreferencesChange={setNavPrefs}
      />
    </div>
  );
}
```

## File: app/(shell)/_shell/ShellSidebarBody.tsx
```typescript
"use client";

/**
 * ShellSidebarBody — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports from workspace and notion modules.
 */

import Link from "next/link";

import { KnowledgeSidebarSection } from "@/modules/notion/api";
import {
  WorkspaceSectionContent,
  type NavPreferences,
  type SidebarLocaleBundle,
} from "@/modules/workspace/api";
import { SHELL_CONTEXT_SECTION_CONFIG, buildShellContextualHref } from "@/modules/platform/api";

import {
  type NavSection,
  sidebarItemClass,
  sidebarSectionTitleClass,
} from "./ShellSidebarNavData";
import { ShellContextNavSection } from "./ShellContextNavSection";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}

interface ShellSidebarBodyProps {
  section: NavSection;
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  showAccountManagement: boolean;
  visibleAccountItems: readonly NavItem[];
  visibleOrganizationManagementItems: readonly NavItem[];
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: WorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  onSelectWorkspace: (workspaceId: string | null) => void;
  onToggleExpanded: () => void;
  pathname: string;
  workspacesHydrated: boolean;
  allWorkspaceLinks: WorkspaceLink[];
  currentSearchWorkspaceId: string;
  creatingKind: "page" | "database" | null;
  onQuickCreatePage: () => void;
}

function ManagedNavGroup({
  title,
  ariaLabel,
  items,
  isActiveRoute,
  activeAccountId,
}: {
  title: string;
  ariaLabel: string;
  items: readonly NavItem[];
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
}) {
  return (
    <nav className="space-y-0.5" aria-label={ariaLabel}>
      <p className={sidebarSectionTitleClass}>{title}</p>
      {items.map((item) => {
        const contextualHref = buildShellContextualHref(item.href, {
          accountId: activeAccountId,
          workspaceId: null,
        });
        const active = isActiveRoute(contextualHref);
        return (
          <Link
            key={item.href}
            href={contextualHref}
            aria-current={active ? "page" : undefined}
            className={sidebarItemClass(active)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebarBody({
  section,
  isActiveRoute,
  activeAccountId,
  showAccountManagement,
  visibleAccountItems,
  visibleOrganizationManagementItems,
  workspacePathId,
  navPrefs,
  localeBundle,
  showRecentWorkspaces,
  visibleRecentWorkspaceLinks,
  hasOverflow,
  isExpanded,
  activeWorkspaceId,
  onSelectWorkspace,
  onToggleExpanded,
  pathname,
  workspacesHydrated,
  allWorkspaceLinks,
  currentSearchWorkspaceId,
  creatingKind,
  onQuickCreatePage,
}: ShellSidebarBodyProps) {
  const contextSection = SHELL_CONTEXT_SECTION_CONFIG[section];

  return (
    <div className="flex-1 overflow-y-auto px-2.5 py-2.5">
      {section === "account" && (
        <div className="space-y-2">
          {showAccountManagement && visibleAccountItems.length > 0 && (
            <ManagedNavGroup
              title="帳號"
              ariaLabel="帳號導覽"
              items={visibleAccountItems}
              isActiveRoute={isActiveRoute}
              activeAccountId={activeAccountId}
            />
          )}
          {!showAccountManagement && (
            <p className="px-2 py-4 text-[11px] text-muted-foreground">
              請切換到組織帳號以查看帳號選項。
            </p>
          )}
        </div>
      )}

      {section === "organization" && (
        <div className="space-y-2">
          {showAccountManagement && visibleOrganizationManagementItems.length > 0 && (
            <ManagedNavGroup
              title="組織管理"
              ariaLabel="組織管理導覽"
              items={visibleOrganizationManagementItems}
              isActiveRoute={isActiveRoute}
              activeAccountId={activeAccountId}
            />
          )}
          {!showAccountManagement && (
            <p className="px-2 py-4 text-[11px] text-muted-foreground">
              請切換到組織帳號以查看管理選項。
            </p>
          )}
        </div>
      )}

      {section === "workspace" && (
        <div className="space-y-2">
          <WorkspaceSectionContent
            workspacePathId={workspacePathId}
            navPrefs={navPrefs}
            localeBundle={localeBundle}
            showRecentWorkspaces={showRecentWorkspaces}
            visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
            hasOverflow={hasOverflow}
            isExpanded={isExpanded}
            activeWorkspaceId={activeWorkspaceId}
            isActiveRoute={isActiveRoute}
            onSelectWorkspace={onSelectWorkspace}
            onToggleExpanded={onToggleExpanded}
            getItemClassName={sidebarItemClass}
            sectionTitleClassName={sidebarSectionTitleClass}
          />
        </div>
      )}

      {section === "knowledge" && (
        <KnowledgeSidebarSection
          pathname={pathname}
          workspacesHydrated={workspacesHydrated}
          allWorkspaceLinks={allWorkspaceLinks}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
          creatingKind={creatingKind}
          onSelectWorkspace={onSelectWorkspace}
          onQuickCreatePage={onQuickCreatePage}
        />
      )}

      {contextSection && (
        <ShellContextNavSection
          title={contextSection.title}
          items={contextSection.items}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}
    </div>
  );
}
```

## File: app/(shell)/_shell/ShellSidebarNavData.tsx
```typescript
import {
  BookOpen,
  Bot,
  Brain,
  Building2,
  Database,
  FileText,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";

import {
  type ActiveAccount,
  isOrganizationActor,
  isActiveOrganizationAccount,
  SHELL_ACCOUNT_SECTION_MATCHERS,
  SHELL_ACCOUNT_NAV_ITEMS,
  SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
  SHELL_SECTION_LABELS,
  isExactOrChildPath,
  resolveShellNavSection,
  type ShellNavSection,
} from "@/modules/platform/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardSidebarProps {
  readonly pathname: string;
  readonly userId: string | null;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}

export type NavSection = ShellNavSection;

// ── Static nav constants ──────────────────────────────────────────────────────

export const ORGANIZATION_MANAGEMENT_ITEMS = SHELL_ORGANIZATION_MANAGEMENT_ITEMS;

export const ACCOUNT_NAV_ITEMS = SHELL_ACCOUNT_NAV_ITEMS;

export const ACCOUNT_SECTION_MATCHERS = SHELL_ACCOUNT_SECTION_MATCHERS;

export const SECTION_TITLES: Record<NavSection, { label: string; icon: React.ReactNode }> = {
  workspace: { label: SHELL_SECTION_LABELS.workspace, icon: <Building2 className="size-3" /> },
  knowledge: { label: SHELL_SECTION_LABELS.knowledge, icon: <BookOpen className="size-3" /> },
  "knowledge-base": { label: SHELL_SECTION_LABELS["knowledge-base"], icon: <BookOpen className="size-3" /> },
  "knowledge-database": {
    label: SHELL_SECTION_LABELS["knowledge-database"],
    icon: <Database className="size-3" />,
  },
  source: { label: SHELL_SECTION_LABELS.source, icon: <FileText className="size-3" /> },
  notebook: { label: SHELL_SECTION_LABELS.notebook, icon: <Brain className="size-3" /> },
  "ai-chat": { label: SHELL_SECTION_LABELS["ai-chat"], icon: <Bot className="size-3" /> },
  account: { label: SHELL_SECTION_LABELS.account, icon: <UserRound className="size-3" /> },
  organization: { label: SHELL_SECTION_LABELS.organization, icon: <Users className="size-3" /> },
  other: { label: SHELL_SECTION_LABELS.other, icon: null },
};

// ── CSS class helpers ─────────────────────────────────────────────────────────

export function sidebarItemClass(active: boolean) {
  return `group flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
    active
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
  }`;
}

export const sidebarSectionTitleClass =
  "mb-1.5 px-2 text-[11px] font-semibold tracking-tight text-muted-foreground/85";

export const sidebarGroupButtonClass =
  "flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border/60 hover:bg-muted/70 hover:text-foreground";

// ── Pure section helpers ──────────────────────────────────────────────────────

export function resolveNavSection(pathname: string): NavSection {
  return resolveShellNavSection(pathname);
}

export function isActiveRoute(pathname: string, href: string) {
  return isExactOrChildPath(href, pathname);
}

export { isActiveOrganizationAccount, isOrganizationActor };

// ── Simple section nav component ──────────────────────────────────────────────

export function SimpleNavLinks({
  items,
  title,
  isActiveRoute,
}: {
  items: readonly { href: string; label: string }[];
  title: string;
  isActiveRoute: (href: string) => boolean;
}) {
  return (
    <nav className="space-y-0.5" aria-label={`${title}導覽`}>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </p>
      {items.map((item) => {
        const active = isActiveRoute(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

## File: app/(shell)/_shell/WorkspaceRouteShim.tsx
```typescript
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import {
  buildWorkspaceOverviewPanelHref,
  type WorkspaceOverviewPanel,
  useWorkspaceContext,
} from "@/modules/workspace/api";

interface WorkspaceRouteShimProps {
  readonly panel?: WorkspaceOverviewPanel;
  readonly tab?: "Overview" | "Files";
  readonly loadingMessage: string;
}

export function WorkspaceRouteShim({
  panel,
  tab = "Overview",
  loadingMessage,
}: WorkspaceRouteShimProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state: { activeAccount },
  } = useApp();
  const {
    state: { activeWorkspaceId },
  } = useWorkspaceContext();

  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const targetWorkspaceId = requestedWorkspaceId || activeWorkspaceId || "";
  const activeAccountId = activeAccount?.id ?? "";

  const targetHref = targetWorkspaceId
    ? activeAccountId
      ? tab === "Files"
        ? `/${encodeURIComponent(activeAccountId)}/${encodeURIComponent(targetWorkspaceId)}?tab=Files`
        : `/${encodeURIComponent(activeAccountId)}/${encodeURIComponent(targetWorkspaceId)}?tab=Overview${
            panel ? `&panel=${encodeURIComponent(panel)}` : ""
          }`
      : tab === "Files"
        ? "/"
        : buildWorkspaceOverviewPanelHref(targetWorkspaceId, panel)
    : activeAccountId
      ? `/${encodeURIComponent(activeAccountId)}`
      : "/";

  useEffect(() => {
    router.replace(targetHref);
  }, [router, targetHref]);

  return <div className="px-4 py-6 text-sm text-muted-foreground">{loadingMessage}</div>;
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge/pages/[pageId]/page.tsx
```typescript
"use client";

import { KnowledgeDetailPanel } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceKnowledgePageDetailRoute() {
  const { accountId, activeWorkspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <KnowledgeDetailPanel
      accountId={accountId}
      activeWorkspaceId={activeWorkspaceId || null}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/layout.tsx
```typescript
import type { ReactNode } from "react";

interface AccountWorkspaceDetailLayoutProps {
	readonly children: ReactNode;
}

export default function AccountWorkspaceDetailLayout({
	children,
}: AccountWorkspaceDetailLayoutProps) {
	return children;
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/notebook/rag-query/page.tsx
```typescript
"use client";

import { useParams } from "next/navigation";

import { RagQueryPanel } from "@/modules/notebooklm/api";

export default function AccountWorkspaceNotebookRagQueryPage() {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Notebook</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG 查詢</h1>
        <p className="text-sm text-muted-foreground">使用工作區脈絡執行查詢，並檢視回答與引用來源。</p>
      </header>

      <RagQueryPanel workspaceId={workspaceId || undefined} />
    </div>
  );
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/page.tsx
```typescript
"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { WorkspaceDetailRouteScreen } from "@/modules/workspace/api";

export default function AccountWorkspaceDetailPage() {
	const router = useRouter();
	const params = useParams<{ accountId: string; workspaceId: string }>();
	const searchParams = useSearchParams();
	const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
	const routeAccountId = typeof params.accountId === "string" ? params.accountId : "";
	const isLegacyWorkspaceAlias = routeAccountId === "workspace";
	const initialTab = searchParams.get("tab") ?? undefined;
	const initialOverviewPanel = searchParams.get("panel") ?? undefined;

	const {
		state: { activeAccount, accountsHydrated },
	} = useApp();

	const resolvedAccountId =
		(isLegacyWorkspaceAlias ? activeAccount?.id : routeAccountId) || activeAccount?.id;

	useEffect(() => {
		if (!isLegacyWorkspaceAlias || !activeAccount?.id || !workspaceId) {
			return;
		}

		const query = searchParams.toString();
		const targetPath = `/${encodeURIComponent(activeAccount.id)}/${encodeURIComponent(workspaceId)}`;
		router.replace(query.length > 0 ? `${targetPath}?${query}` : targetPath);
	}, [activeAccount?.id, isLegacyWorkspaceAlias, router, searchParams, workspaceId]);

	if (isLegacyWorkspaceAlias && activeAccount?.id && workspaceId) {
		return (
			<div className="px-4 py-6 text-sm text-muted-foreground">
				正在導向帳號工作區路由…
			</div>
		);
	}

	return (
		<WorkspaceDetailRouteScreen
			workspaceId={workspaceId}
			accountId={resolvedAccountId}
			accountsHydrated={accountsHydrated}
			initialTab={initialTab}
			initialOverviewPanel={initialOverviewPanel}
		/>
	);
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/ai-chat/page.tsx
```typescript
"use client";

import { useParams } from "next/navigation";

import { useWorkspaceContext } from "@/modules/workspace/api";
import { ConversationPanel } from "@/modules/notebooklm/api";

export default function AccountWorkspaceConversationPanel() {
  const params = useParams<{ accountId: string; workspaceId: string }>();
  const { state: wsState } = useWorkspaceContext();

  const accountId = typeof params.accountId === "string" ? params.accountId : "";
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  return (
    <ConversationPanel
      accountId={accountId}
      workspaces={wsState.workspaces ?? {}}
      requestedWorkspaceId={workspaceId}
    />
  );
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge-base/articles/[articleId]/page.tsx
```typescript
"use client";

import { ArticleDetailPanel } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceArticleDetailPanelRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <ArticleDetailPanel
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge-database/databases/[databaseId]/forms/page.tsx
```typescript
"use client";

import { DatabaseFormsPanel } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceDatabaseFormsPanelRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <DatabaseFormsPanel
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/(account)/[accountId]/(workspace)/[workspaceId]/knowledge-database/databases/[databaseId]/page.tsx
```typescript
"use client";

import { DatabaseDetailPanel } from "@/modules/notion/api";
import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function AccountWorkspaceDatabaseDetailPanelRoute() {
  const { accountId, workspaceId, currentUserId } = useWorkspaceOrchestrationContext();

  return (
    <DatabaseDetailPanel
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/_shell/ShellAppRail.tsx
```typescript
"use client";

/**
 * ShellAppRail — app/(shell)/_shell composition layer.
 * Moved from modules/platform/interfaces/web/shell/sidebar/ShellAppRail.tsx
 * because it composes downstream modules (workspace).
 *
 * Platform is upstream and must not import downstream modules.
 * app/ is the designated composition layer.
 */

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  NotebookText,
  Plus,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser, ActiveAccount, AccountEntity } from "@/modules/platform/api";
import { CreateOrganizationDialog } from "@/modules/platform/api";
import {
  listShellRailCatalogItems,
  isExactOrChildPath,
  resolveShellNavSection,
  buildShellContextualHref,
  type ShellRailCatalogItem,
} from "@/modules/platform/api";
import { type WorkspaceEntity, CreateWorkspaceDialogRail } from "@/modules/workspace/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
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
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  show?: boolean;
  isActive?: (pathname: string) => boolean;
}

function getInitial(name: string | undefined | null): string {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

const RAIL_ICON_MAP: Record<string, React.ReactNode> = {
  workspace: <Building2 className="size-[18px]" />,
  "org-members": <UserRound className="size-[18px]" />,
  "org-teams": <Users className="size-[18px]" />,
  "org-daily": <NotebookText className="size-[18px]" />,
  "org-schedule": <CalendarDays className="size-[18px]" />,
  "org-audit": <ClipboardList className="size-[18px]" />,
  "org-permissions": <SlidersHorizontal className="size-[18px]" />,
  "dev-tools": <FlaskConical className="size-[18px]" />,
};

export function AppRail({
  pathname,
  user,
  activeAccount,
  organizationAccounts,
  workspaces,
  workspacesHydrated,
  isOrganizationAccount,
  onSelectPersonal,
  onSelectOrganization,
  activeWorkspaceId,
  onSelectWorkspace,
  onOrganizationCreated,
  onSignOut: _onSignOut,
}: AppRailProps) {
  const router = useRouter();
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const visibleRailItems: RailItem[] = useMemo(() => {
    const catalogItems = listShellRailCatalogItems(isOrganizationAccount);
    return catalogItems.map((item: ShellRailCatalogItem) => ({
      id: item.id,
      href: buildShellContextualHref(item.href, {
        accountId: activeAccount?.id,
        workspaceId: activeWorkspaceId,
      }),
      label: item.label,
      icon: RAIL_ICON_MAP[item.id] ?? null,
      isActive: item.id === "workspace"
        ? (currentPathname: string) => resolveShellNavSection(currentPathname) === "workspace"
        : item.activeRoutePrefix
          ? (currentPathname: string) => isExactOrChildPath(
            buildShellContextualHref(item.activeRoutePrefix!, {
              accountId: activeAccount?.id,
              workspaceId: activeWorkspaceId,
            }),
            currentPathname,
          )
          : undefined,
    }));
  }, [isOrganizationAccount, activeAccount?.id, activeWorkspaceId]);

  const workspaceHubHref = activeAccount?.id
    ? `/${encodeURIComponent(activeAccount.id)}`
    : "/";

  function buildWorkspaceDetailHref(workspaceId: string): string {
    if (activeAccount?.id) {
      return `/${encodeURIComponent(activeAccount.id)}/${encodeURIComponent(workspaceId)}`;
    }
    return "/";
  }

  const sortedWorkspaces = useMemo(
    () => [...workspaces].sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces],
  );

  const accountName = activeAccount?.name ?? user?.name ?? "—";

  return (
    <TooltipProvider delayDuration={400}>
      <aside
        aria-label="App navigation rail"
        className="hidden h-full w-12 shrink-0 flex-col items-center border-r border-border/50 bg-card/40 py-2 md:flex"
      >
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="切換帳號情境"
                  className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tracking-tight text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getInitial(accountName)}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[180px]">
              <p className="text-xs font-medium">{accountName}</p>
              <p className="text-[10px] text-muted-foreground">
                {isOrganizationAccount ? "組織帳號" : "個人帳號"}
              </p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="right" align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">切換帳號</DropdownMenuLabel>
            {user && (
              <DropdownMenuItem
                onClick={onSelectPersonal}
                className={activeAccount?.id === user.id ? "bg-primary/10 text-primary" : ""}
              >
                <span className="truncate">{user.name} (Personal)</span>
              </DropdownMenuItem>
            )}
            {organizationAccounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => { onSelectOrganization(account); }}
                className={activeAccount?.id === account.id ? "bg-primary/10 text-primary" : ""}
              >
                <span className="truncate">{account.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { setIsCreateOrgOpen(true); }}
              className="gap-2 text-primary"
            >
              <Plus className="size-3.5 shrink-0" />
              <span>建立組織</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="my-2 h-px w-7 bg-border/50" />

        <nav className="flex flex-col items-center gap-0.5" aria-label="主要導覽">
          {visibleRailItems.map((item) => {
            const active = item.isActive?.(pathname) ?? isActive(item.href);

            if (item.id === "workspace") {
              return (
                <DropdownMenu key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-current={active ? "page" : undefined}
                          aria-label="工作區中心：切換工作區"
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {item.icon}
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">工作區中心：切換工作區</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">工作區</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => { router.push(workspaceHubHref); }}
                      className={
                        resolveShellNavSection(pathname) === "workspace" && !activeWorkspaceId
                          ? "bg-primary/10 text-primary"
                          : ""
                      }
                    >
                      工作區中心
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!workspacesHydrated ? (
                      <DropdownMenuItem disabled>工作區載入中...</DropdownMenuItem>
                    ) : sortedWorkspaces.length === 0 ? (
                      <DropdownMenuItem disabled>目前帳號沒有工作區</DropdownMenuItem>
                    ) : (
                      sortedWorkspaces.map((workspace) => (
                        <DropdownMenuItem
                          key={workspace.id}
                          onClick={() => {
                            onSelectWorkspace(workspace.id);
                            router.push(buildWorkspaceDetailHref(workspace.id));
                          }}
                          className={activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : ""}
                        >
                          <span className="truncate">{workspace.name}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => { setIsCreateWorkspaceOpen(true); }}
                      className="gap-2 text-primary"
                    >
                      <Plus className="size-3.5 shrink-0" />
                      <span>建立工作區</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="flex-1" />
        <div className="h-1" />
      </aside>

      <CreateOrganizationDialog
        open={isCreateOrgOpen}
        onOpenChange={setIsCreateOrgOpen}
        user={user}
        onOrganizationCreated={onOrganizationCreated}
        onNavigate={(href) => { router.push(href); }}
      />

      <CreateWorkspaceDialogRail
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        accountId={activeAccount?.id ?? null}
        accountType={activeAccount ? (isOrganizationAccount ? "organization" : "user") : null}
        creatorUserId={user?.id}
        onNavigate={(href: string) => { router.push(href); }}
      />
    </TooltipProvider>
  );
}
```

## File: app/(shell)/_shell/ShellRootLayout.tsx
```typescript
"use client";

/**
 * ShellRootLayout — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it composes downstream modules.
 *
 * Uses useApp() from platform (accounts/auth) and useWorkspaceContext()
 * from workspace (workspaces/activeWorkspaceId).
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Search } from "lucide-react";

import {
  useApp,
  useAuth,
  ShellGuard,
  type AccountEntity,
  subscribeToProfile,
  type AccountProfile,
  isOrganizationActor,
  resolveOrganizationRouteFallback,
  AccountSwitcher,
  ShellAppBreadcrumbs,
  ShellGlobalSearchDialog,
  useShellGlobalSearch,
  ShellHeaderControls,
  ShellUserAvatar,
  resolveShellPageTitle,
  isExactOrChildPath,
  buildShellContextualHref,
  SHELL_MOBILE_NAV_ITEMS,
  SHELL_ORG_PRIMARY_NAV_ITEMS,
  SHELL_ORG_SECONDARY_NAV_ITEMS,
} from "@/modules/platform/api";
import { useWorkspaceContext, type WorkspaceEntity } from "@/modules/workspace/api";

import { AppRail } from "./ShellAppRail";
import { ShellDashboardSidebar } from "./ShellDashboardSidebar";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const { state: appState, dispatch: appDispatch } = useApp();
  const { state: wsState, dispatch: wsDispatch } = useWorkspaceContext();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [accountProfileState, setAccountProfileState] = useState<{ actorId: string; profile: AccountProfile | null } | null>(null);
  const { open: searchOpen, setOpen: setSearchOpen } = useShellGlobalSearch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("xuanwu:sidebar-collapsed") === "true";
  });
  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("xuanwu:sidebar-collapsed", String(next));
      }
      return next;
    });
  }

  const pageTitle = resolveShellPageTitle(pathname);
  const organizationAccounts = Object.values(appState.accounts ?? {});
  const accountWorkspaces: WorkspaceEntity[] = Object.values(wsState.workspaces ?? {});
  const showAccountManagement = isOrganizationActor(appState.activeAccount);

  function handleSelectOrganization(account: AccountEntity) {
    appDispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
    const nextRoute = resolveOrganizationRouteFallback(pathname, account);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleSelectPersonal() {
    if (!authState.user) return;
    appDispatch({ type: "SET_ACTIVE_ACCOUNT", payload: authState.user });
    const nextRoute = resolveOrganizationRouteFallback(pathname, authState.user);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleOrganizationCreated(account: AccountEntity) {
    appDispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
  }

  function handleSelectWorkspace(workspaceId: string | null) {
    wsDispatch({ type: "SET_ACTIVE_WORKSPACE", payload: workspaceId });
  }

  useEffect(() => {
    if (!appState.accountsHydrated || !appState.activeAccount) {
      return;
    }

    const nextRoute = resolveOrganizationRouteFallback(pathname, appState.activeAccount);
    if (nextRoute && nextRoute !== pathname) {
      router.replace(nextRoute);
    }
  }, [appState.accountsHydrated, appState.activeAccount, pathname, router]);

  useEffect(() => {
    const actorId = authState.user?.id;
    if (!actorId) {
      return;
    }

    const unsubscribe = subscribeToProfile(actorId, (profile) => setAccountProfileState({ actorId, profile }));

    return () => unsubscribe();
  }, [authState.user?.id]);

  const scopedProfile = accountProfileState && accountProfileState.actorId === authState.user?.id
    ? accountProfileState.profile
    : null;

  async function handleLogout() {
    setLogoutError(null);
    try {
      await logout();
    } catch {
      setLogoutError("登出失敗，請稍後再試。");
    }
  }

  return (
    <ShellGuard>
      <ShellGlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="flex h-screen overflow-hidden bg-background">
        <AppRail
          pathname={pathname}
          user={authState.user}
          activeAccount={appState.activeAccount}
          organizationAccounts={organizationAccounts}
          workspaces={accountWorkspaces}
          workspacesHydrated={wsState.workspacesHydrated}
          isOrganizationAccount={showAccountManagement}
          onSelectPersonal={handleSelectPersonal}
          onSelectOrganization={handleSelectOrganization}
          activeWorkspaceId={wsState.activeWorkspaceId}
          onSelectWorkspace={handleSelectWorkspace}
          onOrganizationCreated={handleOrganizationCreated}
          onSignOut={() => {
            void handleLogout();
          }}
        />
        <ShellDashboardSidebar
          userId={authState.user?.id ?? null}
          pathname={pathname}
          activeAccount={appState.activeAccount}
          workspaces={accountWorkspaces}
          workspacesHydrated={wsState.workspacesHydrated}
          activeWorkspaceId={wsState.activeWorkspaceId}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebar}
          onSelectWorkspace={handleSelectWorkspace}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6">
            <div className="flex h-12 items-center justify-between gap-4">
              <div className="min-w-0 flex items-center gap-3">
                {sidebarCollapsed && (
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="展開側欄"
                    title="展開側欄"
                    className="hidden size-7 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex"
                  >
                    <PanelLeftOpen className="size-4" />
                  </button>
                )}
                <p className="truncate text-sm font-semibold tracking-tight">{pageTitle}</p>
                <ShellAppBreadcrumbs />
                <button
                  type="button"
                  aria-label="全域搜尋"
                  className="hidden items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-border hover:bg-muted sm:flex"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="size-3 shrink-0" />
                  <span>搜尋…</span>
                  <kbd className="ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground/60">⌘K</kbd>
                </button>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <ShellHeaderControls />
                <ShellUserAvatar
                  name={scopedProfile?.displayName ?? authState.user?.name ?? "Dimension Member"}
                  email={scopedProfile?.email ?? authState.user?.email ?? "—"}
                  onSignOut={() => {
                    void handleLogout();
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 pb-3 md:hidden">
              <AccountSwitcher
                personalAccount={authState.user}
                organizationAccounts={organizationAccounts}
                activeAccountId={appState.activeAccount?.id ?? null}
                onSelectPersonal={handleSelectPersonal}
                onSelectOrganization={handleSelectOrganization}
                onOrganizationCreated={handleOrganizationCreated}
              />
            </div>

            {showAccountManagement && (
              <>
                <nav aria-label="Organization primary navigation" className="flex gap-2 overflow-auto pb-2 md:hidden">
                  {SHELL_ORG_PRIMARY_NAV_ITEMS.map((item) => {
                    const contextualHref = buildShellContextualHref(item.href, {
                      accountId: appState.activeAccount?.id,
                      workspaceId: wsState.activeWorkspaceId,
                    });
                    const isActive = isExactOrChildPath(contextualHref, pathname);
                    return (
                      <Link
                        key={item.href}
                        href={contextualHref}
                        aria-current={isActive ? "page" : undefined}
                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "border border-border/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <nav aria-label="Organization secondary navigation" className="flex gap-2 overflow-auto pb-2 md:hidden">
                  {SHELL_ORG_SECONDARY_NAV_ITEMS.map((item) => {
                    const contextualHref = buildShellContextualHref(item.href, {
                      accountId: appState.activeAccount?.id,
                      workspaceId: wsState.activeWorkspaceId,
                    });
                    const isActive = isExactOrChildPath(contextualHref, pathname);
                    return (
                      <Link
                        key={item.href}
                        href={contextualHref}
                        aria-current={isActive ? "page" : undefined}
                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "border border-border/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </>
            )}
            <nav aria-label="Main navigation" className="flex gap-2 overflow-auto pb-3 md:hidden">
              {SHELL_MOBILE_NAV_ITEMS.map((item) => {
                const contextualHref = buildShellContextualHref(item.href, {
                  accountId: appState.activeAccount?.id,
                  workspaceId: wsState.activeWorkspaceId,
                });
                const isActive = isExactOrChildPath(contextualHref, pathname);
                return (
                  <Link
                    key={item.href}
                    href={contextualHref}
                    aria-current={isActive ? "page" : undefined}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "border border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          {logoutError && (
            <div className="shrink-0 px-4 pt-3 text-xs text-destructive md:px-6">{logoutError}</div>
          )}

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ShellGuard>
  );
}
```