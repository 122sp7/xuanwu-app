"use client";

/**
 * NotebooklmResearchSection — notebooklm.research tab — workspace synthesis.
 * Calls rag_query with a synthesis prompt to summarise all workspace documents.
 *
 * Closed-loop design: the synthesis result can be forwarded to
 * workspace.task-formation as the AI research source for task generation.
 */

import { Button } from "@packages";
import { BookOpen, FlaskConical, ListPlus } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import type { RagQueryOutput } from "../../../adapters/outbound/callable/FirebaseCallableAdapter";
import { synthesizeWorkspaceAction } from "../server-actions/notebook-actions";

interface NotebooklmResearchSectionProps {
  workspaceId: string;
  accountId: string;
}

function taskFormationHref(accountId: string, workspaceId: string) {
  const params = new URLSearchParams({
    tab: "TaskFormation",
    sourceKind: "research",
    sourceId: "latest",
  });
  return `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}?${params.toString()}`;
}

function getResearchCacheKey(accountId: string, workspaceId: string): string {
  return `xuanwu:task-formation:research:${accountId}:${workspaceId}`;
}

export function NotebooklmResearchSection({
  workspaceId,
  accountId,
}: NotebooklmResearchSectionProps): React.ReactElement {
  const [result, setResult] = useState<RagQueryOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSynthesize = () => {
    setError(null);
    startTransition(async () => {
      try {
        const output = (await synthesizeWorkspaceAction({
          accountId,
          workspaceId,
        })) as RagQueryOutput;
        setResult(output);
        window.localStorage.setItem(getResearchCacheKey(accountId, workspaceId), output.answer);
      } catch {
        setError("合成失敗，請確認已上傳來源文件並完成向量索引後再試。");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">研究摘要</h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSynthesize}
          disabled={isPending}
        >
          <FlaskConical className={`size-3.5 ${isPending ? "animate-pulse" : ""}`} />
          {isPending ? "合成中…" : "執行研究合成"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        針對此工作區所有已索引來源文件，AI 將提取主要主題、關鍵發現與重要結論。
      </p>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
            <p className="text-sm font-medium text-foreground">研究合成結果</p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {result.answer}
            </p>
          </div>

          {result.citations.length > 0 && (
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                參考來源（{result.citations.length} 個文件片段）
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {result.citations.map((c) => (
                  <li key={c.chunk_id} className="flex items-center justify-between">
                    <span className="truncate">📎 {c.filename}</span>
                    <span className="ml-2 shrink-0 rounded bg-muted px-1.5 py-0.5">
                      {(c.score * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                向量命中 {result.vector_hits} 筆 · 全文命中 {result.search_hits} 筆 ·{" "}
                {result.cache === "hit" ? "快取命中" : "即時查詢"}
              </p>
            </div>
          )}

          {/* Closed-loop CTA: forward research result to task formation */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-emerald-700">研究摘要已就緒</p>
              <p className="text-xs text-emerald-600/80">
                可將此 AI 研究合成結果作為任務形成的來源依據。
              </p>
            </div>
            <Link
              href={taskFormationHref(accountId, workspaceId)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-500/20"
            >
              <ListPlus className="size-3.5" />
              → 生成任務
            </Link>
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
