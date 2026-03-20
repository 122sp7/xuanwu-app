"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Send, X } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import type {
  DailyFeedItem,
  PublishDailyEntryInput,
  WorkspaceDailyDigestEntity,
} from "@/modules/daily";
import { getWorkspaceDailyDigest, getWorkspaceDailyFeed } from "@/modules/daily";
import { publishDailyEntry } from "@/modules/daily/interfaces/_actions/daily.actions";
import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

const DAILY_ENTRY_TYPE_LABEL: Record<DailyFeedItem["entryType"], string> = {
  update: "更新",
  blocker: "阻塞",
  ask: "協作需求",
  milestone: "里程碑",
  signal: "系統訊號",
  story: "限時動態",
  highlight: "精選",
};

const DAILY_VISIBILITY_LABEL: Record<DailyFeedItem["visibility"], string> = {
  workspace_only: "僅工作區",
  organization: "組織可見",
  selected_workspaces: "指定工作區",
  public_demo: "公開展示",
};

const STANDARD_WORKSPACE_DAILY_VISIBILITIES: readonly PublishDailyEntryInput["visibility"][] = [
  "workspace_only",
  "organization",
];

function formatNotificationTime(timestamp: number) {
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return "—";
  }
}

function formatPublishedAt(iso: string) {
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) {
    return "—";
  }

  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceDailyTab({ workspace }: WorkspaceDailyTabProps) {
  const { state: appState } = useApp();
  const actorAccountId = appState.activeAccount?.id ?? "";

  const supportedVisibilities =
    workspace.accountType === "organization"
      ? STANDARD_WORKSPACE_DAILY_VISIBILITIES
      : ["workspace_only"];
  const defaultVisibility = supportedVisibilities[0];

  const [digest, setDigest] = useState<WorkspaceDailyDigestEntity | null>(null);
  const [feed, setFeed] = useState<readonly DailyFeedItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [showComposer, setShowComposer] = useState(false);
  const [entryType, setEntryType] = useState<PublishDailyEntryInput["entryType"]>("update");
  const [visibility, setVisibility] = useState<PublishDailyEntryInput["visibility"]>(
    defaultVisibility,
  );
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDailyData() {
      setLoadState("loading");

      try {
        const [nextDigest, nextFeed] = await Promise.all([
          getWorkspaceDailyDigest(workspace.id, workspace.accountId),
          getWorkspaceDailyFeed(workspace.id),
        ]);
        if (cancelled) {
          return;
        }

        setDigest(nextDigest);
        setFeed(nextFeed);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceDailyTab] Failed to load daily feed:", error);
        }

        if (!cancelled) {
          setDigest(null);
          setFeed([]);
          setLoadState("error");
        }
      }
    }

    void loadDailyData();

    return () => {
      cancelled = true;
    };
  }, [workspace.accountId, workspace.id]);

  const dailyNotifications = useMemo(() => digest?.items ?? [], [digest]);
  const unreadCount = useMemo(() => digest?.summary.unread ?? 0, [digest]);

  async function refreshDailyData() {
    const [nextDigest, nextFeed] = await Promise.all([
      getWorkspaceDailyDigest(workspace.id, workspace.accountId),
      getWorkspaceDailyFeed(workspace.id),
    ]);
    setDigest(nextDigest);
    setFeed(nextFeed);
    setLoadState("loaded");
  }

  async function handlePublishEntry() {
    if (!actorAccountId) {
      setActionError("找不到目前操作帳戶，請重新整理後再試一次。");
      return;
    }

    setSubmitting(true);
    setActionError(null);
    try {
      const result = await publishDailyEntry({
        organizationId: workspace.accountId,
        workspaceId: workspace.id,
        authorId: actorAccountId,
        entryType,
        visibility,
        title,
        summary,
        body,
      });

      if (!result.success) {
        setActionError(result.error.message);
        return;
      }

      setTitle("");
      setSummary("");
      setBody("");
      setEntryType("update");
      setVisibility(defaultVisibility);
      setShowComposer(false);
      await refreshDailyData();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Daily</CardTitle>
            <CardDescription>
              依文件先落地 Workspace Daily 發布，再逐步保留通知 digest 相容層。
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={() => setShowComposer((value) => !value)}
            className="flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            新增 Daily
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Published today</p>
            <p className="mt-1 text-xl font-semibold">{feed.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Digest unread</p>
            <p className="mt-1 text-xl font-semibold">{unreadCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Recipient</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{workspace.accountId}</p>
          </div>
        </div>

        {showComposer && (
          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  類型
                </label>
                <select
                  value={entryType}
                  onChange={(event) =>
                    setEntryType(event.target.value as PublishDailyEntryInput["entryType"])
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {Object.entries(DAILY_ENTRY_TYPE_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  可見性
                </label>
                <select
                  value={visibility}
                  onChange={(event) =>
                    setVisibility(event.target.value as PublishDailyEntryInput["visibility"])
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {supportedVisibilities.map((value) => (
                    <option key={value} value={value}>
                      {DAILY_VISIBILITY_LABEL[value]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                標題 <span className="text-destructive">*</span>
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="今天最值得被看見的更新"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                摘要 <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="一句話說清楚目前進展、風險或協作需求。"
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">內文</label>
              <textarea
                rows={3}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="補充背景、下一步或需要組織支援的內容。"
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowComposer(false);
                  setActionError(null);
                }}
                className="flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-muted"
              >
                <X className="h-3 w-3" />
                取消
              </button>
              <button
                type="button"
                disabled={submitting || !title.trim() || !summary.trim()}
                onClick={() => void handlePublishEntry()}
                className="flex h-8 items-center gap-1 rounded-md bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                <Send className="h-3 w-3" />
                {submitting ? "發布中…" : "發布 Daily"}
              </button>
            </div>
          </div>
        )}

        {actionError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {actionError}
          </div>
        )}

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading daily feed…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入每日動態，請重新整理頁面或稍後再試。
          </p>
        )}

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Workspace Daily</h3>
            <p className="text-xs text-muted-foreground">
              先以文件定義的 authored entry 為主，再保留 digest 作為相容基線。
            </p>
          </div>

          {loadState === "loaded" && feed.length === 0 && (
            <p className="text-sm text-muted-foreground">今天尚未發布新的 Workspace Daily。</p>
          )}

          {feed.map((entry) => (
            <div key={entry.entryId} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                    <Badge variant="outline">{DAILY_ENTRY_TYPE_LABEL[entry.entryType]}</Badge>
                    <Badge variant="secondary">{DAILY_VISIBILITY_LABEL[entry.visibility]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                  {entry.body && <p className="text-sm text-foreground/90">{entry.body}</p>}
                  <p className="text-xs text-muted-foreground">{formatPublishedAt(entry.publishedAtISO)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Digest baseline</h3>
            <p className="text-xs text-muted-foreground">保留既有通知摘要，確保遷移期間仍可對照。</p>
          </div>

          {loadState === "loaded" && dailyNotifications.length === 0 && (
            <p className="text-sm text-muted-foreground">
              今天尚未有新的工作區通知或動態紀錄。
            </p>
          )}

          {loadState === "loaded" && dailyNotifications.length > 0 && (
            <div className="space-y-3">
              {dailyNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-border/40 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {notification.title}
                        </p>
                        <Badge variant="outline">{notification.type}</Badge>
                        {!notification.read && <Badge variant="secondary">Unread</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
