"use client";

/**
 * NotebooklmNotebookSection — notebooklm.notebook tab — RAG query interface.
 * Input a question → AI retrieves from indexed documents → displays answer + citations.
 */

import { Brain, Search } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import type { RagQueryOutput } from "../../../adapters/outbound/callable/FirebaseCallableAdapter";
import { ragQueryAction } from "../server-actions/notebook-actions";

interface NotebooklmNotebookSectionProps {
  workspaceId: string;
  accountId: string;
}

export function NotebooklmNotebookSection({
  workspaceId,
  accountId,
}: NotebooklmNotebookSectionProps): React.ReactElement {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<RagQueryOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleQuery = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      try {
        const output = (await ragQueryAction({
          accountId,
          workspaceId,
          query: trimmed,
        })) as RagQueryOutput;
        setResult(output);
      } catch {
        setError("查詢失敗，請確認已上傳來源文件並完成向量索引後再試。");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">RAG 查詢</h2>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="輸入問題，AI 從已索引文件中搜尋答案…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleQuery()}
          disabled={isPending}
          className="text-sm"
        />
        <Button
          size="sm"
          onClick={handleQuery}
          disabled={isPending || !query.trim()}
        >
          <Search className={`size-3.5 ${isPending ? "animate-pulse" : ""}`} />
          {isPending ? "查詢中…" : "查詢"}
        </Button>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
            <p className="text-sm font-medium text-foreground">AI 答案</p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {result.answer}
            </p>
          </div>

          {result.citations.length > 0 && (
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">來源引用</p>
              <ul className="mt-2 space-y-1.5">
                {result.citations.map((c) => (
                  <li
                    key={c.chunk_id}
                    className="flex items-center justify-between text-xs text-muted-foreground"
                  >
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
        </div>
      )}

      {!result && !isPending && (
        <p className="text-xs text-muted-foreground">
          在上方輸入問題，AI 將根據「來源文件」分頁中已完成 RAG 索引的文件回答。
        </p>
      )}
    </div>
  ) as React.ReactElement;
}
