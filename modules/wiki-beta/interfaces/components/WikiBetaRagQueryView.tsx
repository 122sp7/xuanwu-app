"use client";

/**
 * WikiBetaRagQueryView — clean chat-like RAG query interface.
 *
 * Provides:
 *  - Question input with top_k parameter
 *  - Answer display with citations
 *  - Query history (in-memory)
 *
 * Uses shadcn components for consistent wiki+notion style.
 */

import { useCallback, useState } from "react";
import {
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
} from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Separator } from "@ui-shadcn/ui/separator";
import { Slider } from "@ui-shadcn/ui/slider";

import { runWikiBetaRagQuery } from "../../application";
import type { WikiBetaCitation, WikiBetaRagQueryResult } from "../../domain";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface WikiBetaRagQueryViewProps {
  readonly workspaceId?: string;
}

interface QueryHistoryItem {
  question: string;
  result: WikiBetaRagQueryResult;
  timestamp: Date;
}

/* ------------------------------------------------------------------ */
/*  Citation card                                                     */
/* ------------------------------------------------------------------ */

function CitationCard({ citation, index }: { readonly citation: WikiBetaCitation; readonly index: number }) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/20 p-3">
      <div className="flex items-start gap-2">
        <Badge variant="secondary" className="mt-0.5 shrink-0 text-[10px]">
          {index + 1}
        </Badge>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs leading-relaxed text-foreground">
            {citation.text || "（無引用文字）"}
          </p>
          <div className="flex flex-wrap gap-1">
            {citation.doc_id && (
              <Badge variant="outline" className="text-[10px]">
                doc: {citation.doc_id.slice(0, 8)}…
              </Badge>
            )}
            {citation.score != null && (
              <Badge variant="outline" className="text-[10px]">
                score: {citation.score.toFixed(3)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function WikiBetaRagQueryView({ workspaceId }: WikiBetaRagQueryViewProps) {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const [question, setQuestion] = useState("");
  const [topK, setTopK] = useState(5);
  const [querying, setQuerying] = useState(false);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";

  const handleQuery = useCallback(async () => {
    if (!question.trim() || !accountId) return;

    setQuerying(true);
    try {
      const result = await runWikiBetaRagQuery(
        question.trim(),
        accountId,
        workspaceId ?? "",
        topK,
      );
      setHistory((prev) => [
        { question: question.trim(), result, timestamp: new Date() },
        ...prev,
      ]);
      setQuestion("");
    } catch (e) {
      setHistory((prev) => [
        {
          question: question.trim(),
          result: {
            answer: `查詢失敗: ${e instanceof Error ? e.message : "Unknown error"}`,
            citations: [],
            cache: "miss",
            vectorHits: 0,
            searchHits: 0,
            accountScope: accountId,
          },
          timestamp: new Date(),
        },
        ...prev,
      ]);
    } finally {
      setQuerying(false);
    }
  }, [accountId, question, topK, workspaceId]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ── Chat history ── */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              RAG Query
            </h1>
            <p className="text-sm text-muted-foreground">
              基於已索引文件的智慧問答，支援引用追蹤。
            </p>
          </div>

          {workspaceId && (
            <Badge variant="secondary" className="text-xs">
              workspace: {workspaceId}
            </Badge>
          )}

          <Separator />

          {/* History */}
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Sparkles className="mb-3 size-10 text-muted-foreground/20" />
              <h3 className="text-base font-medium text-foreground">
                開始提問
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                在下方輸入問題，系統將從已索引的文件中搜尋並產生回答。
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Question */}
                  <div className="flex justify-end">
                    <div className="max-w-md rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
                      {item.question}
                    </div>
                  </div>

                  {/* Answer */}
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="mt-0.5 size-4 shrink-0 text-primary" />
                          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                            {item.result.answer}
                          </p>
                        </div>

                        {/* Citations */}
                        {item.result.citations.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">
                              引用來源 ({item.result.citations.length})
                            </p>
                            {item.result.citations.map((c, ci) => (
                              <CitationCard
                                key={ci}
                                citation={c}
                                index={ci}
                              />
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.result.vectorHits != null && (
                            <Badge variant="outline" className="text-[10px]">
                              vector: {item.result.vectorHits}
                            </Badge>
                          )}
                          {item.result.searchHits != null && (
                            <Badge variant="outline" className="text-[10px]">
                              search: {item.result.searchHits}
                            </Badge>
                          )}
                          {item.result.cache && (
                            <Badge variant="outline" className="text-[10px]">
                              cache: {item.result.cache}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px]">
                            {item.timestamp.toLocaleTimeString("zh-TW")}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="border-t border-border/60 bg-muted/20 px-6 py-3">
        <div className="mx-auto max-w-2xl space-y-2">
          {/* Top K slider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Label className="text-xs">Top K:</Label>
            <Slider
              value={[topK]}
              onValueChange={([v]) => setTopK(v)}
              min={1}
              max={20}
              step={1}
              className="w-32"
            />
            <span className="w-6 text-center font-mono">{topK}</span>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="輸入您的問題..."
              className="h-10 text-sm"
              disabled={querying || !accountId}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleQuery();
                }
              }}
            />
            <Button
              size="icon"
              className="size-10 shrink-0"
              disabled={querying || !question.trim() || !accountId}
              onClick={() => void handleQuery()}
            >
              {querying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
