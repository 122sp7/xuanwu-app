"use client";

import { Loader2, Search } from "lucide-react";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Textarea } from "@ui-shadcn/ui/textarea";
import type { WikiCitation } from "../../api";

interface RagQueryCardProps {
  readonly query: string;
  readonly topK: string;
  readonly loading: boolean;
  readonly answer: string;
  readonly citations: WikiCitation[];
  readonly cacheMode: "hit" | "miss";
  readonly accountScope: string;
  readonly vectorHits: number;
  readonly searchHits: number;
  readonly onQueryChange: (value: string) => void;
  readonly onTopKChange: (value: string) => void;
  readonly onAsk: () => void;
}

export function RagQueryCard({
  query,
  topK,
  loading,
  answer,
  citations,
  cacheMode,
  accountScope,
  vectorHits,
  searchHits,
  onQueryChange,
  onTopKChange,
  onAsk,
}: RagQueryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RAG Query</CardTitle>
        <CardDescription>直接呼叫 py_fn rag_query callable，取得回答與引用來源。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="請輸入問題，例如：總結最近三份文件的重要重點"
          rows={4}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="w-28"
            value={topK}
            onChange={(event) => onTopKChange(event.target.value)}
            inputMode="numeric"
            placeholder="top_k"
          />
          <Button onClick={onAsk} disabled={loading}>
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Search className="mr-2 size-4" />}
            送出查詢
          </Button>
        </div>

        <div className="rounded-md border border-border/60 bg-muted/20 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Answer</p>
          <p className="whitespace-pre-wrap text-sm text-foreground">{answer || "尚未查詢"}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 px-2 py-1">cache: {cacheMode}</span>
            <span className="rounded-full border border-border/60 px-2 py-1">scope: {accountScope}</span>
            <span className="rounded-full border border-border/60 px-2 py-1">vector hits: {vectorHits}</span>
            <span className="rounded-full border border-border/60 px-2 py-1">search hits: {searchHits}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Citations</p>
          {citations.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無引用來源</p>
          ) : (
            citations.map((citation, index) => (
              <div key={`${citation.doc_id ?? "doc"}-${index}`} className="rounded-md border border-border/60 p-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{citation.filename || citation.doc_id || "未命名文件"}</p>
                  <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                    {citation.provider || "unknown"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{citation.text || "(無節錄)"}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
