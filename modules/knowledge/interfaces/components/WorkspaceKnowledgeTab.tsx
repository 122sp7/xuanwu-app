"use client";

import { useEffect, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import type { WorkspaceKnowledgeSummary } from "../../domain/entities/KnowledgeSummary";
import { getWorkspaceKnowledgeSummary } from "../queries/knowledge.queries";

interface WorkspaceKnowledgeTabProps {
  readonly workspace: WorkspaceEntity;
}

const EMPTY_SUMMARY: WorkspaceKnowledgeSummary = {
  registeredAssetCount: 0,
  readyAssetCount: 0,
  supportedSourceCount: 0,
  status: "needs-input",
  blockedReasons: [],
  nextActions: [],
  visibleSurface: "workspace-tab-live",
  contractStatus: "contract-live",
};

const statusVariantMap = {
  "needs-input": "outline",
  staged: "outline",
  ready: "secondary",
} as const;

export function WorkspaceKnowledgeTab({ workspace }: WorkspaceKnowledgeTabProps) {
  const [summary, setSummary] = useState<WorkspaceKnowledgeSummary>(EMPTY_SUMMARY);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadKnowledgeSummary() {
      setLoadState("loading");

      try {
        const nextSummary = await getWorkspaceKnowledgeSummary(workspace);
        if (cancelled) {
          return;
        }

        setSummary(nextSummary);
        setLoadState("loaded");
      } catch (error) {
        console.warn("[WorkspaceKnowledgeTab] Failed to load knowledge summary:", error);

        if (!cancelled) {
          setSummary(EMPTY_SUMMARY);
          setLoadState("error");
        }
      }
    }

    void loadKnowledgeSummary();

    return () => {
      cancelled = true;
    };
  }, [workspace]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Knowledge</CardTitle>
        <CardDescription>
          先上線可見的 read-side Knowledge UI，將 file / parser 現況收斂成可落地的契約入口。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading knowledge posture…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入 knowledge 摘要，以下先顯示契約與 UI 已上線的預設狀態。
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Registered assets</p>
            <p className="mt-1 text-xl font-semibold">{summary.registeredAssetCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Ready assets</p>
            <p className="mt-1 text-xl font-semibold">{summary.readyAssetCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Supported sources</p>
            <p className="mt-1 text-xl font-semibold">{summary.supportedSourceCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Current knowledge posture</p>
            <Badge variant={statusVariantMap[summary.status]}>{summary.status}</Badge>
            <Badge variant="secondary">{summary.visibleSurface}</Badge>
            <Badge variant="secondary">{summary.contractStatus}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            目前已經有可見的 Knowledge 分頁作為上線入口；真正的 ingestion、chunk、retrieval
            寫側仍以契約先行，避免直接把流程耦合進 workspace UI。
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-sm font-semibold text-foreground">Published surface</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Workspace Detail → Knowledge tab</li>
              <li>/docs/architecture/knowledge.md</li>
              <li>/docs/reference/development-contracts/knowledge-contract.md</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-sm font-semibold text-foreground">Blocked reasons</p>
            {summary.blockedReasons.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                目前沒有額外的 blocked reason，可直接以現有 UI 驗證契約與 read-side 摘要。
              </p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {summary.blockedReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Recommended next actions</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {summary.nextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
