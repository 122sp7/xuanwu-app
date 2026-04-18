"use client";

/**
 * NotionKnowledgeSection — top-level knowledge hub for the notion.knowledge tab.
 *
 * Closed-loop design: the knowledge hub is the central orchestrator showing
 * the full data flow pipeline:
 *   Sources (upload) → Pages/Database (structure) → AI (analysis) → Tasks (execution)
 */

import { FileText, BookOpen, Layout, LayoutGrid, Upload, ListPlus, ArrowRight, Brain } from "lucide-react";
import Link from "next/link";

interface NotionKnowledgeSectionProps {
  workspaceId: string;
  accountId: string;
}

export function NotionKnowledgeSection({ workspaceId, accountId }: NotionKnowledgeSectionProps): React.ReactElement {
  const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;

  const knowledgeItems = [
    {
      href: `${base}?tab=Pages`,
      label: "頁面",
      description: "階層化內容頁面",
      icon: <FileText className="size-4 text-blue-500" />,
    },
    {
      href: `${base}?tab=Database`,
      label: "資料庫",
      description: "結構化資料集合",
      icon: <LayoutGrid className="size-4 text-purple-500" />,
    },
    {
      href: `${base}?tab=Templates`,
      label: "模板",
      description: "可重複使用的骨架",
      icon: <Layout className="size-4 text-muted-foreground" />,
    },
  ] as const;

  const pipelineSteps = [
    {
      step: "1",
      label: "上傳來源",
      description: "上傳 PDF / 圖片",
      href: `${base}?tab=Sources`,
      icon: <Upload className="size-3.5 text-orange-500" />,
      color: "border-orange-500/20 bg-orange-500/5",
    },
    {
      step: "2",
      label: "知識結構化",
      description: "頁面 / 資料庫",
      href: `${base}?tab=Pages`,
      icon: <FileText className="size-3.5 text-blue-500" />,
      color: "border-blue-500/20 bg-blue-500/5",
    },
    {
      step: "3",
      label: "AI 分析",
      description: "RAG 查詢 / 研究合成",
      href: `${base}?tab=Research`,
      icon: <Brain className="size-3.5 text-emerald-500" />,
      color: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      step: "4",
      label: "任務形成",
      description: "從知識生成任務",
      href: `${base}?tab=TaskFormation`,
      icon: <ListPlus className="size-3.5 text-primary" />,
      color: "border-primary/20 bg-primary/5",
    },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">知識中心</h2>
      </div>

      {/* Closed-loop pipeline visualization */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">資料閉環流程</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {pipelineSteps.map((step, i) => (
            <div key={step.step} className="flex items-center gap-2 sm:flex-1">
              <Link
                href={step.href}
                className={`flex flex-1 items-start gap-2 rounded-xl border px-3 py-2.5 transition hover:brightness-95 ${step.color}`}
              >
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background/60 text-[10px] font-bold text-muted-foreground">
                  {step.step}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    {step.icon}
                    <p className="text-xs font-medium">{step.label}</p>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{step.description}</p>
                </div>
              </Link>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight className="size-3 shrink-0 text-muted-foreground/40 rotate-90 sm:rotate-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge type quick access */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">知識類型</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {knowledgeItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-2 rounded-xl border border-border/40 p-4 transition hover:bg-muted/40"
            >
              {item.icon}
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}
