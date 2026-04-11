# Files

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
      router.replace("/dashboard");
    }
  }, [state.status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLocalDevDemoAllowed() && tab === "login" && isDevDemoCredential(email, password)) {
        writeDevDemoSession(createDevDemoUser());
        window.location.assign("/dashboard");
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

## File: app/(shell)/ai-chat/page.tsx
```typescript
"use client";

import { useSearchParams } from "next/navigation";

import { useApp, useAuth } from "@/modules/platform/api"
import { AiChatPage } from "@/modules/notebooklm/api";

export default function AiChatRoutePage() {
  const searchParams = useSearchParams();
  const { state: { workspaces } } = useApp();
  const { state: authState } = useAuth();
  const accountId = authState.user?.id ?? "";
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";

  return (
    <AiChatPage
      accountId={accountId}
      workspaces={workspaces ?? {}}
      requestedWorkspaceId={requestedWorkspaceId}
    />
  );
}
```

## File: app/(shell)/dashboard/page.tsx
```typescript
/**
 * /dashboard — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/workspace");
}
```

## File: app/(shell)/dev-tools/dev-tools-badges.tsx
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

## File: app/(shell)/dev-tools/dev-tools-helpers.ts
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

## File: app/(shell)/dev-tools/dev-tools-parsed-docs-section.tsx
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

## File: app/(shell)/dev-tools/page.tsx
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
  const activeAccountId = appState.activeAccount?.id ?? "";
  const activeWorkspaceId = appState.activeWorkspaceId ?? "";

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

## File: app/(shell)/dev-tools/use-dev-tools-doc-list.ts
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

## File: app/(shell)/knowledge-base/articles/[articleId]/page.tsx
```typescript
"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { ArticleDetailPage } from "@/modules/notion/api";

export default function ArticleDetailPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  return (
    <ArticleDetailPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/knowledge-base/articles/page.tsx
```typescript
"use client";

import { KnowledgeBaseArticlesRouteScreen } from "@/modules/notion/api";

export default function KnowledgeBaseArticlesPage() {
  return <KnowledgeBaseArticlesRouteScreen />;
}
```

## File: app/(shell)/knowledge-base/page.tsx
```typescript
import { redirect } from "next/navigation";

export default function KnowledgeBasePage() {
  redirect("/knowledge-base/articles");
}
```

## File: app/(shell)/knowledge-database/databases/[databaseId]/forms/page.tsx
```typescript
"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { DatabaseFormsPage } from "@/modules/notion/api";

export default function DatabaseFormsPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  return (
    <DatabaseFormsPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/knowledge-database/databases/[databaseId]/page.tsx
```typescript
"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { DatabaseDetailPage } from "@/modules/notion/api";

export default function DatabaseDetailPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  return (
    <DatabaseDetailPage
      accountId={accountId}
      workspaceId={workspaceId}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/knowledge-database/databases/page.tsx
```typescript
"use client";

import { KnowledgeDatabasesRouteScreen } from "@/modules/notion/api";

export default function KnowledgeDatabaseDatabasesPage() {
  return <KnowledgeDatabasesRouteScreen />;
}
```

## File: app/(shell)/knowledge-database/page.tsx
```typescript
import { redirect } from "next/navigation";

export default function KnowledgeDatabasePage() {
  redirect("/knowledge-database/databases");
}
```

## File: app/(shell)/knowledge/block-editor/page.tsx
```typescript
"use client";

import { BlockEditorView } from "@/modules/notion/api";

export default function KnowledgeBlockEditorPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">區塊編輯器</h1>
        <p className="text-sm text-muted-foreground">
          極簡 Zustand 狀態管理。Enter 新增區塊，Backspace 刪除空白區塊，拖曳重排。
        </p>
      </header>

      <BlockEditorView />
    </div>
  );
}
```

## File: app/(shell)/knowledge/page.tsx
```typescript
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Brain, Building2, Database, FileText, FolderKanban, MessageSquare } from "lucide-react";

import { useApp, useAuth } from "@/modules/platform/api"
import { buildWikiContentTree } from "@/modules/workspace/api";
import type { WikiAccountContentNode, WikiAccountSeed } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

const QUICK_ACCESS = [
  {
    href: "/knowledge/pages?scope=account",
    title: "Pages",
    description: "顯式 account summary 的頁面樹檢視與維運工具；日常建立與整理請從工作區進入。",
    icon: FileText,
  },
  {
    href: "/source/libraries",
    title: "Libraries",
    description: "維持 schema / table 型知識資產。",
    icon: Database,
  },
  {
    href: "/knowledge-base/articles",
    title: "Articles",
    description: "組織知識庫 SOP 文章、驗證管治與分類樹。",
    icon: FolderKanban,
  },
  {
    href: "/knowledge-database/databases",
    title: "Databases",
    description: "結構化資料庫、多視圖（表格、看板、日曆）管理。",
    icon: Brain,
  },
  {
    href: "/notebook/rag-query",
    title: "Ask / Cite",
    description: "查詢、引用與回答檢視。",
    icon: MessageSquare,
  },
] as const;

export default function KnowledgeHubPage() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const [contentTree, setContentTree] = useState<WikiAccountContentNode[]>([]);
  const [loading, setLoading] = useState(true);

  const accountSeeds = useMemo<WikiAccountSeed[]>(() => {
    const personalUser = authState.user;
    const activeAccountId = appState.activeAccount?.id;
    const seeds: WikiAccountSeed[] = [];

    if (personalUser) {
      seeds.push({
        accountId: personalUser.id,
        accountName: personalUser.name,
        accountType: "personal",
        isActive: activeAccountId === personalUser.id,
      });
    }

    const organizations = Object.values(appState.accounts);
    for (const organization of organizations) {
      seeds.push({
        accountId: organization.id,
        accountName: organization.name,
        accountType: "organization",
        isActive: activeAccountId === organization.id,
      });
    }

    return seeds;
  }, [appState.accounts, appState.activeAccount?.id, authState.user]);

  useEffect(() => {
    let disposed = false;

    async function load() {
      setLoading(true);
      try {
        const result = await buildWikiContentTree(accountSeeds);
        if (!disposed) {
          setContentTree(result);
        }
      } catch {
        if (!disposed) {
          setContentTree([]);
        }
      } finally {
        if (!disposed) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      disposed = true;
    };
  }, [accountSeeds]);

  const activeAccount = contentTree.find((node) => node.isActive);
  const highlightedWorkspace =
    activeAccount?.workspaces.find((workspace) => workspace.workspaceId === appState.activeWorkspaceId) ??
    activeAccount?.workspaces[0];

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Hub</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Knowledge Hub</h1>
        <p className="text-sm text-muted-foreground">
          從這裡進入 Knowledge、Knowledge Base、Knowledge Database、Source 與 Notebook 各模組。
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Workspace-first entry</CardTitle>
          <CardDescription>先鎖定 active account，再選擇要進入的工作區，最後才分流到 Knowledge、知識頁面、Notebook / AI。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <Skeleton className="h-6 w-48" />
          ) : activeAccount ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Active Account</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Building2 className="size-4 text-primary" />
                  <Badge variant="outline">{activeAccount.accountType === "personal" ? "個人" : "組織"}</Badge>
                  <span className="font-medium text-foreground">{activeAccount.accountName}</span>
                </div>
              </div>
              <div className="rounded-xl border border-border/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Workspace Coverage</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                  <FolderKanban className="size-4 text-primary" />
                  <span>{activeAccount.workspaces.length} 個工作區可直接進入各自的知識頁面</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">尚未取得 account context。</p>
          )}

          {highlightedWorkspace && (
            <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
              <div className="rounded-xl border border-border/60 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Highlighted workspace</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{highlightedWorkspace.workspaceName}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  先把這個工作區當成知識主樞紐，再從裡面打開知識頁面與 Notebook / AI。
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/workspace/${highlightedWorkspace.workspaceId}`}>進入工作區</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(highlightedWorkspace.workspaceId)}`}>知識頁面</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/ai-chat?workspaceId=${encodeURIComponent(highlightedWorkspace.workspaceId)}`}>
                      Notebook / AI
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/60 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">Knowledge</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    先整理文件來源、Libraries 與 upload / ingest。
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">知識頁面</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    再用頁面樹與內容脈絡整理知識結構。
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">Notebook / AI</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    最後才消費這些知識做問答、摘要與洞察。
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {QUICK_ACCESS.map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <item.icon className="size-4" />
                      </div>
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Workspace Snapshot</CardTitle>
          <CardDescription>以下工作區皆屬於目前 active account；請優先從工作區進入，再分流到 Knowledge、知識頁面與 Notebook / AI。</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : !activeAccount || activeAccount.workspaces.length === 0 ? (
            <p className="text-sm text-muted-foreground">目前帳號下沒有工作區。</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeAccount.workspaces.map((workspace) => (
                <Card key={workspace.workspaceId} className="transition-colors hover:border-primary/40 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{workspace.workspaceName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {workspace.contentBaseItems
                        .filter((item) => item.enabled)
                        .map((item) => (
                          <Badge key={item.key} variant="secondary" className="text-[10px]">
                            {item.label}
                          </Badge>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/workspace/${workspace.workspaceId}`}>Workspace</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.workspaceId)}`}>知識頁面</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/workspace/${workspace.workspaceId}?tab=Files`}>
                          Files
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/ai-chat?workspaceId=${encodeURIComponent(workspace.workspaceId)}`}>
                          <Brain className="mr-1 size-3.5" />
                          Notebook
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## File: app/(shell)/knowledge/pages/[pageId]/page.tsx
```typescript
"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { KnowledgePageDetailPage } from "@/modules/notion/api";

export default function KnowledgePageDetailPageRoute() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const activeWorkspaceId = appState.activeWorkspaceId ?? null;
  const currentUserId = authState.user?.id ?? "";

  return (
    <KnowledgePageDetailPage
      accountId={accountId}
      activeWorkspaceId={activeWorkspaceId}
      currentUserId={currentUserId}
    />
  );
}
```

## File: app/(shell)/knowledge/pages/page.tsx
```typescript
"use client";

import { KnowledgePagesRouteScreen } from "@/modules/notion/api";

export default function KnowledgePagesPage() {
  return <KnowledgePagesRouteScreen />;
}
```

## File: app/(shell)/notebook/page.tsx
```typescript
import { redirect } from "next/navigation";

export default function NotebookPage() {
  redirect("/notebook/rag-query");
}
```

## File: app/(shell)/notebook/rag-query/page.tsx
```typescript
"use client";

import { useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { resolveWorkspaceFromMap } from "@/modules/workspace/api";
import { RagQueryView } from "@/modules/notebooklm/api";

export default function NotebookRagQueryPage() {
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() || "";
  const resolvedWorkspace = resolveWorkspaceFromMap(appState.workspaces, requestedWorkspaceId);
  const workspaceId = resolvedWorkspace?.id ?? appState.activeWorkspaceId ?? undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Notebook</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">RAG 查詢</h1>
        <p className="text-sm text-muted-foreground">使用工作區脈絡執行查詢，並檢視回答與引用來源。</p>
      </header>

      <RagQueryView workspaceId={workspaceId} />
    </div>
  );
}
```

## File: app/(shell)/organization/_utils.ts
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

## File: app/(shell)/organization/audit/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount, OrganizationAuditPage } from "@/modules/platform/api"

export default function OrganizationAuditPageRoute() {
  const { state: appState } = useApp();
  const { activeAccount, workspaces, workspacesHydrated } = appState;
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  return (
    <OrganizationAuditPage
      organizationId={organizationId}
      workspaces={workspaces}
      workspacesHydrated={workspacesHydrated}
    />
  );
}
```

## File: app/(shell)/organization/content/page.tsx
```typescript
import { redirect } from "next/navigation";

/**
 * Module: organization/content page
 * Purpose: redirect to the consolidated content hub at /knowledge.
 */
export default function OrganizationKnowledgePage() {
  redirect("/knowledge");
}
```

## File: app/(shell)/organization/daily/page.tsx
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

## File: app/(shell)/organization/members/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount, MembersPage } from "@/modules/platform/api"

export default function OrganizationMembersPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <MembersPage organizationId={organizationId} />;
}
```

## File: app/(shell)/organization/page.tsx
```typescript
"use client";

/**
 * Organization Overview Page — /organization
 * Lists organizations visible to the current user and allows switching
 * to an organization account context.
 * Section pages live under /organization/[section].
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useApp, useAuth } from "@/modules/platform/api"
import type { AccountEntity } from "@/modules/platform/api";
import { isActiveOrganizationAccount } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

export default function OrganizationPage() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { user } = authState;
  const { accounts, activeAccount, accountsHydrated, bootstrapPhase } = appState;

  const orgList = Object.values(accounts);
  const activeOrganizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;

  function handleSwitch(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
    router.replace("/workspace");
  }

  function handleSwitchToPersonal() {
    if (!user) return;
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: user });
    router.replace("/workspace");
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
            <Link href="/workspace">回到 Workspace Hub</Link>
          </Button>
          {activeOrganizationId && (
            <Button asChild size="sm" variant="outline">
              <Link href="/organization/members">組織治理模組</Link>
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
              { href: "/organization/members", title: "成員管理", desc: "邀請與管理組織成員" },
              { href: "/organization/teams", title: "團隊管理", desc: "建立與編輯團隊" },
              { href: "/organization/permissions", title: "權限政策", desc: "設定存取規則" },
              { href: "/organization/workspaces", title: "工作區", desc: "組織下的工作區清單" },
              { href: "/organization/schedule", title: "工作需求排程", desc: "排程與容量總覽" },
              { href: "/organization/audit", title: "稽核記錄", desc: "操作歷史追蹤" },
              { href: "/organization/daily", title: "動態牆", desc: "組織工作區動態" },
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

## File: app/(shell)/organization/permissions/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount, PermissionsPage } from "@/modules/platform/api"

export default function OrganizationPermissionsPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <PermissionsPage organizationId={organizationId} />;
}
```

## File: app/(shell)/organization/schedule/dispatcher/page.tsx
```typescript
import { redirect } from "next/navigation";

/**
 * Dispatcher page — redirects to the organization schedule view.
 * Route: /organization/schedule/dispatcher
 */
export default function DispatcherPage() {
  redirect("/organization/schedule");
}
```

## File: app/(shell)/organization/schedule/page.tsx
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

## File: app/(shell)/organization/teams/page.tsx
```typescript
"use client";

import { useApp, isActiveOrganizationAccount, TeamsPage } from "@/modules/platform/api"

export default function OrganizationTeamsPage() {
  const { state: { activeAccount } } = useApp();
  const organizationId = isActiveOrganizationAccount(activeAccount) ? activeAccount.id : null;
  return <TeamsPage organizationId={organizationId} />;
}
```

## File: app/(shell)/organization/workspaces/page.tsx
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

## File: app/(shell)/settings/general/page.tsx
```typescript
/**
 * /settings/general — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";

export default function SettingsGeneralPage() {
  redirect("/workspace");
}
```

## File: app/(shell)/settings/notifications/page.tsx
```typescript
"use client";

import { useAuth, NotificationsPage } from "@/modules/platform/api"

export default function NotificationCenterPage() {
  const { state: authState } = useAuth();
  const recipientId = authState.user?.id ?? "";
  return <NotificationsPage recipientId={recipientId} />;
}
```

## File: app/(shell)/settings/page.tsx
```typescript
/**
 * /settings — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/workspace");
}
```

## File: app/(shell)/source/documents/page.tsx
```typescript
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";

/**
 * /source/documents is now a redirect shim.
 * Canonical file management lives at /workspace/[id]?tab=Files.
 * If a workspaceId is available (via URL param or active workspace),
 * we redirect immediately; otherwise we show a picker placeholder.
 */
export default function SourceDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state: { activeWorkspaceId },
  } = useApp();

  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() || "";
  const targetWorkspaceId = requestedWorkspaceId || activeWorkspaceId || "";

  useEffect(() => {
    if (targetWorkspaceId) {
      router.replace(`/workspace/${encodeURIComponent(targetWorkspaceId)}?tab=Files`);
    }
  }, [router, targetWorkspaceId]);

  if (targetWorkspaceId) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">
        正在導向工作區檔案管理頁面…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Source</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">文件</h1>
        <p className="text-sm text-muted-foreground">工作區來源文件管理（已整合至工作區 Files 頁簽）。</p>
      </header>
      <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
        請先從側邊欄選擇一個工作區，系統將自動導向至該工作區的檔案管理頁面（
        <code className="rounded bg-muted px-1">?tab=Files</code>
        ）。你也可以直接在網址帶入{" "}
        <code className="rounded bg-muted px-1">workspaceId</code> 參數。
      </p>
    </div>
  );
}
```

## File: app/(shell)/source/libraries/page.tsx
```typescript
"use client";

import { useApp, useAuth } from "@/modules/platform/api"
import { LibrariesView, LibraryTableView } from "@/modules/notebooklm/api";

export default function SourceLibrariesPage() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? undefined;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Source</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">資料庫</h1>
        <p className="text-sm text-muted-foreground">
          對齊資料庫／資料來源能力的 MVP，產品命名統一為 Libraries。
        </p>
      </header>

      {accountId ? (
        <>
          <LibraryTableView accountId={accountId} workspaceId={workspaceId} />
          <LibrariesView accountId={accountId} workspaceId={workspaceId} />
        </>
      ) : (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號情境，請先登入或切換帳號。
        </p>
      )}
    </div>
  );
}
```

## File: app/(shell)/source/page.tsx
```typescript
import { redirect } from "next/navigation";

export default function SourcePage() {
  redirect("/workspace");
}
```

## File: app/(shell)/workspace-feed/page.tsx
```typescript
"use client";

/**
 * Route: /workspace-feed
 * Purpose: Workspace activity feed — shows posts, reactions, and replies for the
 *          currently active workspace.
 */

import { useApp } from "@/modules/platform/api";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace/api";

export default function WorkspaceFeedPage() {
  const { state } = useApp();
  const accountId = state.activeAccount?.id ?? "";
  const workspaceId = state.activeWorkspaceId ?? "";
  const workspaceName = "工作區";

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
        workspaceName={workspaceName}
      />
    </div>
  );
}
```

## File: app/(shell)/workspace/[workspaceId]/page.tsx
```typescript
"use client";

import { useParams, useSearchParams } from "next/navigation";

import { useApp } from "@/modules/platform/api";
import { WorkspaceDetailRouteScreen } from "@/modules/workspace/api";

export default function WorkspaceDetailPage() {
  const params = useParams<{ workspaceId: string }>();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const initialTab = searchParams.get("tab") ?? undefined;
  const initialOverviewPanel = searchParams.get("panel") ?? undefined;
  const {
    state: { activeAccount, accountsHydrated },
  } = useApp();

  return (
    <WorkspaceDetailRouteScreen
      workspaceId={workspaceId}
      accountId={activeAccount?.id}
      accountsHydrated={accountsHydrated}
      initialTab={initialTab}
      initialOverviewPanel={initialOverviewPanel}
    />
  );
}
```

## File: app/(shell)/workspace/page.tsx
```typescript
"use client";

import { useSearchParams } from "next/navigation";

import type { ActiveAccount } from "@/modules/platform/api";
import { useApp, useAuth, isActiveOrganizationAccount } from "@/modules/platform/api"
import { WorkspaceHubScreen } from "@/modules/workspace/api";

function getActiveAccountType(activeAccount: ActiveAccount | null) {
  return isActiveOrganizationAccount(activeAccount) ? "organization" : "user";
}

export default function WorkspacePage() {
  const searchParams = useSearchParams();
  const {
    state: { activeAccount, accountsHydrated, bootstrapPhase },
  } = useApp();
  const { state: authState } = useAuth();
  const context = searchParams.get("context");

  return (
    <div className="space-y-4">
      {context === "unavailable" && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          目前帳戶無法存取該工作區，已返回工作區清單。
        </div>
      )}

      <WorkspaceHubScreen
        accountId={activeAccount?.id}
        accountName={activeAccount?.name}
        accountType={getActiveAccountType(activeAccount)}
        accountsHydrated={accountsHydrated}
        isBootstrapSeeded={bootstrapPhase === "seeded"}
        currentUserId={authState.user?.id}
      />
    </div>
  );
}
```

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

## File: app/layout.tsx
```typescript
import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@shared-utils";
import { Providers } from "@/modules/platform/api";

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

## File: app/(shell)/layout.tsx
```typescript
"use client";

/**
 * app/(shell)/layout.tsx — Next.js route layout shim.
 * Canonical implementation: modules/platform/interfaces/web/components/ShellRootLayout.tsx
 */

import { ShellLayout } from "@/modules/platform/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ShellLayout>{children}</ShellLayout>;
}
```

## File: app/(shell)/settings/profile/page.tsx
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