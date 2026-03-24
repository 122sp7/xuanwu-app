"use client";

import { useState } from "react";
import { PenSquare, Send, X } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import type { PublishDailyEntryInput } from "@/modules/daily";
import { DailyFeed } from "@/modules/daily";
import { publishDailyEntry } from "@/modules/daily/interfaces/_actions/daily.actions";
import type { WorkspaceEntity } from "@/modules/workspace";

interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}

const ENTRY_TYPE_LABEL: Record<PublishDailyEntryInput["entryType"], string> = {
  update: "進度更新",
  blocker: "阻塞問題",
  ask: "協作需求",
  milestone: "里程碑",
  signal: "系統訊號",
  story: "限時動態",
  highlight: "精選",
};

const VISIBILITY_OPTIONS: readonly PublishDailyEntryInput["visibility"][] = [
  "workspace_only",
  "organization",
];
const VISIBILITY_LABEL: Record<PublishDailyEntryInput["visibility"], string> = {
  workspace_only: "僅工作區",
  organization: "組織可見",
  selected_workspaces: "指定工作區",
  public_demo: "公開展示",
};

export function WorkspaceDailyTab({ workspace }: WorkspaceDailyTabProps) {
  const { state: appState } = useApp();
  const actorAccountId = appState.activeAccount?.id ?? "";

  const visibilityOptions =
    workspace.accountType === "organization" ? VISIBILITY_OPTIONS : VISIBILITY_OPTIONS.slice(0, 1);
  const defaultVisibility = visibilityOptions[0] ?? "workspace_only";

  const [showComposer, setShowComposer] = useState(false);
  const [entryType, setEntryType] =
    useState<PublishDailyEntryInput["entryType"]>("update");
  const [visibility, setVisibility] =
    useState<PublishDailyEntryInput["visibility"]>(defaultVisibility);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handlePublish() {
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
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      {/* ── 動態瀑布流 ── */}
      <DailyFeed scope={{ accountId: workspace.accountId, workspaceId: workspace.id }} />

      {/* ── 撰寫浮動按鈕（右下角） ── */}
      {!showComposer && (
        <button
          type="button"
          aria-label="新增 Daily"
          onClick={() => setShowComposer(true)}
          className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-foreground shadow-lg text-background hover:bg-foreground/90 active:scale-95 transition-all"
        >
          <PenSquare className="h-5 w-5" />
        </button>
      )}

      {/* ── 撰寫面板（底部滑出式） ── */}
      {showComposer && (
        <div className="fixed inset-x-0 bottom-0 z-30 max-w-lg mx-auto bg-background border-t border-border shadow-2xl rounded-t-2xl p-4 space-y-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">新增 Daily</h3>
            <button
              type="button"
              aria-label="關閉"
              onClick={() => {
                setShowComposer(false);
                setActionError(null);
              }}
              className="h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">類型</label>
              <select
                value={entryType}
                onChange={(e) =>
                  setEntryType(e.target.value as PublishDailyEntryInput["entryType"])
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {Object.entries(ENTRY_TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">可見性</label>
              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as PublishDailyEntryInput["visibility"])
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {visibilityOptions.map((v) => (
                  <option key={v} value={v}>{VISIBILITY_LABEL[v]}</option>
                ))}
              </select>
            </div>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="標題（必填）"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="摘要（必填）：一句話說明進展"
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <textarea
            rows={2}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="補充內文（選填）"
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />

          {actionError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {actionError}
            </p>
          )}

          <button
            type="button"
            disabled={submitting || !title.trim() || !summary.trim()}
            onClick={() => void handlePublish()}
            className="w-full flex h-10 items-center justify-center gap-1.5 rounded-xl bg-foreground text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {submitting ? "發布中…" : "發布 Daily"}
          </button>
        </div>
      )}
    </div>
  );
}
