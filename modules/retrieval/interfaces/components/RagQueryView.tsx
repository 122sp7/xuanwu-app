"use client";

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
  runWikiBetaRagQuery,
  type WikiBetaCitation,
} from "../../api";

interface RagQueryViewProps {
  readonly workspaceId?: string;
}

/** Minimal RAG query chat interface. Uses local useState only – no streaming, no global state. */
export function RagQueryView({ workspaceId }: RagQueryViewProps) {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const effectiveWorkspaceId = workspaceId?.trim() ?? "";

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<WikiBetaCitation[]>([]);
  const [queried, setQueried] = useState(false);

  async function handleSubmit() {
    const q = query.trim();
    if (!q) {
      toast.error("請先輸入問題");
      return;
    }
    if (authState.status !== "authenticated" || authState.user?.email === DEV_DEMO_ACCOUNT_EMAIL) {
      toast.error("請先以真實帳號登入才能執行 RAG 查詢");
      return;
    }
    if (!activeAccountId) {
      toast.error("目前沒有 active account，無法執行 RAG 查詢");
      return;
    }
    if (!effectiveWorkspaceId) {
      toast.error("請先選擇工作區，再執行 RAG 查詢");
      return;
    }

    setLoading(true);
    try {
      let result = await runWikiBetaRagQuery(q, activeAccountId, effectiveWorkspaceId, 4, {
        requireReady: true,
      });
      // Compatibility fallback for older vectors without ready status.
      if (result.citations.length === 0 && (result.vectorHits > 0 || result.searchHits > 0)) {
        result = await runWikiBetaRagQuery(q, activeAccountId, effectiveWorkspaceId, 4, {
          requireReady: false,
          maxAgeDays: 3650,
        });
      }
      setAnswer(result.answer);
      setCitations(result.citations);
      setQueried(true);
    } catch (error) {
      console.error(error);
      toast.error("呼叫 rag_query 失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Query input */}
      <Card>
        <CardHeader>
          <CardTitle>RAG Query</CardTitle>
          <CardDescription>
            輸入問題，取得 AI 回答與引用來源。
            {effectiveWorkspaceId ? ` workspace: ${effectiveWorkspaceId}` : " （請先選擇工作區）"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) void handleSubmit();
            }}
            placeholder="請輸入你的問題...（Ctrl+Enter 送出）"
            rows={4}
          />
          <Button onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Search className="mr-2 size-4" />
            )}
            {loading ? "查詢中..." : "送出查詢"}
          </Button>
        </CardContent>
      </Card>

      {/* Answer */}
      {queried && (
        <Card>
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-foreground">{answer || "（無回答）"}</p>
          </CardContent>
        </Card>
      )}

      {/* Citations */}
      {queried && (
        <Card>
          <CardHeader>
            <CardTitle>Citations</CardTitle>
            <CardDescription>
              {citations.length === 0
                ? "目前查詢無相關引用，請確認文件已完成 RAG 索引。"
                : `${citations.length} 筆引用來源`}
            </CardDescription>
          </CardHeader>
          {citations.length > 0 && (
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {citations.map((citation, index) => (
                  <AccordionItem
                    key={`${citation.doc_id ?? "doc"}-${index}`}
                    value={`citation-${index}`}
                  >
                    <AccordionTrigger className="text-sm font-medium">
                      <span className="flex items-center gap-2">
                        {citation.filename ?? citation.doc_id ?? "未命名文件"}
                        {citation.provider && (
                          <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                            {citation.provider}
                          </span>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-muted-foreground">{citation.text ?? "（無節錄）"}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
