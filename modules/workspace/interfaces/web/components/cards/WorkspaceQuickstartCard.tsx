"use client";

import Link from "next/link";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

interface WorkspaceQuickstartCardProps {
  readonly workspaceId: string;
}

export function WorkspaceQuickstartCard({ workspaceId }: WorkspaceQuickstartCardProps) {
  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>🚀 開始使用這個工作區</CardTitle>
        <CardDescription>完成以下步驟，讓工作區進入運作狀態。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold">Step 1 · 上傳文件</p>
          <p className="mt-1 text-xs text-muted-foreground">
            先把原始文件上傳到 Files 分頁，作為知識基底。
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link href={`?tab=Files`}>前往 Files</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold">Step 2 · 建立頁面</p>
          <p className="mt-1 text-xs text-muted-foreground">
            直接在工作區知識頁面建立第一個頁面，整理結構。
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspaceId)}`}>前往知識頁面</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold">Step 3 · AI 查詢</p>
          <p className="mt-1 text-xs text-muted-foreground">
            用 RAG Query 對工作區知識提問，驗證內容可被檢索。
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link href={`/notebook/rag-query?workspaceId=${encodeURIComponent(workspaceId)}`}>
              前往 RAG Query
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
