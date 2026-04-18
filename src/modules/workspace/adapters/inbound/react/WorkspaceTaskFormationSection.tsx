"use client";

/**
 * WorkspaceTaskFormationSection — workspace.task-formation tab.
 *
 * Closed-loop design: task candidates are derived from knowledge sources
 * (notion pages, databases, or AI research summaries). This section shows:
 *   1. A closed-loop banner explaining data provenance
 *   2. Source selector — where to pull task candidates from
 *   3. Pipeline stages showing the formation workflow
 */

import {
  ListPlus,
  ArrowRight,
  FileText,
  LayoutGrid,
  BookOpen,
  Upload,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";

interface WorkspaceTaskFormationSectionProps {
  workspaceId: string;
  accountId: string;
}

const PIPELINE_STAGES = [
  { label: "需求收集", count: 0, color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  { label: "評估分析", count: 0, color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
  { label: "任務拆解", count: 0, color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
  { label: "待指派", count: 0, color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
] as const;

type SourceType = "pages" | "database" | "research" | null;

export function WorkspaceTaskFormationSection({
  workspaceId,
  accountId,
}: WorkspaceTaskFormationSectionProps): React.ReactElement {
  const [selectedSource, setSelectedSource] = useState<SourceType>(null);
  const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;

  const sources = [
    {
      id: "pages" as SourceType,
      label: "知識頁面",
      description: "從 notion.pages 的結構化頁面萃取任務",
      icon: <FileText className="size-4 text-blue-500" />,
      href: `${base}?tab=Pages`,
      color: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
      activeColor: "border-blue-500/60 bg-blue-500/15",
    },
    {
      id: "database" as SourceType,
      label: "資料庫",
      description: "從 notion.database 的結構化資料集合萃取任務",
      icon: <LayoutGrid className="size-4 text-purple-500" />,
      href: `${base}?tab=Database`,
      color: "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10",
      activeColor: "border-purple-500/60 bg-purple-500/15",
    },
    {
      id: "research" as SourceType,
      label: "AI 研究摘要",
      description: "從 notebooklm.research 的 AI 合成結論萃取任務",
      icon: <BookOpen className="size-4 text-emerald-500" />,
      href: `${base}?tab=Research`,
      color: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
      activeColor: "border-emerald-500/60 bg-emerald-500/15",
    },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListPlus className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">任務形成</h2>
        </div>
        <Button size="sm" variant="outline" disabled={!selectedSource}>
          <ListPlus className="size-3.5" />
          從選定來源生成任務
        </Button>
      </div>

      {/* Closed-loop banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div className="space-y-1 text-xs text-amber-700/90">
          <p className="font-medium">資料閉環說明</p>
          <p>
            任務由知識來源驅動：先上傳文件（
            <Link href={`${base}?tab=Sources`} className="underline underline-offset-2 hover:text-amber-800">
              來源文件
            </Link>
            ）→ AI 解析建立知識（
            <Link href={`${base}?tab=Pages`} className="underline underline-offset-2 hover:text-amber-800">
              頁面
            </Link>
            /
            <Link href={`${base}?tab=Database`} className="underline underline-offset-2 hover:text-amber-800">
              資料庫
            </Link>
            ）→ 執行 AI 研究合成（
            <Link href={`${base}?tab=Research`} className="underline underline-offset-2 hover:text-amber-800">
              研究摘要
            </Link>
            ）→ 在此選定來源並生成任務候選。
          </p>
        </div>
      </div>

      {/* Source selector */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">選擇任務來源</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {sources.map((source) => {
            const isSelected = selectedSource === source.id;
            return (
              <button
                key={source.id}
                type="button"
                onClick={() => setSelectedSource(isSelected ? null : source.id)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  isSelected ? source.activeColor : source.color
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {source.icon}
                    <span className="text-sm font-medium">{source.label}</span>
                  </div>
                  {isSelected && (
                    <Badge variant="outline" className="text-xs">已選</Badge>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{source.description}</p>
                <Link
                  href={source.href}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  前往查看
                  <ChevronRight className="size-3" />
                </Link>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline stages */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">任務形成管道</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:items-stretch">
              <div
                className={`flex items-center justify-between rounded-xl border px-3 py-3 sm:flex-col sm:items-start sm:gap-2 ${stage.color}`}
              >
                <p className="text-xs font-medium">{stage.label}</p>
                <Badge variant="outline" className="text-xs border-inherit">
                  {stage.count}
                </Badge>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <ArrowRight className="size-3.5 shrink-0 rotate-90 text-muted-foreground/40 sm:rotate-0 sm:self-center" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Empty state or action prompt */}
      {selectedSource ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-6 text-center">
          <ListPlus className="mx-auto mb-3 size-8 text-primary/50" />
          <p className="text-sm font-medium">
            從「{sources.find((s) => s.id === selectedSource)?.label}」生成任務候選
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            AI 將讀取選定來源的內容，萃取可執行任務並等待你確認。
          </p>
          <Button size="sm" className="mt-3" disabled>
            <ListPlus className="size-3.5" />
            生成任務候選（開發中）
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-6 text-center">
          <Upload className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">請先選定一個知識來源</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            從上方選擇「知識頁面」、「資料庫」或「AI 研究摘要」作為任務生成的依據。
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Link
              href={`${base}?tab=Sources`}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 hover:bg-muted"
            >
              <Upload className="size-3" />
              上傳來源文件
            </Link>
            <Link
              href={`${base}?tab=Research`}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 hover:bg-muted"
            >
              <BookOpen className="size-3" />
              執行研究合成
            </Link>
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
