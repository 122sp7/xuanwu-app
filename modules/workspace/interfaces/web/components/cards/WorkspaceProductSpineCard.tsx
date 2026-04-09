"use client";

import Link from "next/link";
import type { WorkspaceEntity } from "../../../api/contracts";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { WorkspaceInformationCard } from "./WorkspaceInformationCard";
import {
  getWorkspaceAddressLines,
  getWorkspaceRoleAssignments,
} from "../../view-models/workspace-supporting-records";

interface WorkspaceProductSpineCardProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceProductSpineCard({ workspace }: WorkspaceProductSpineCardProps) {
  const addressLines = getWorkspaceAddressLines(workspace);
  const workspaceRoles = getWorkspaceRoleAssignments(workspace);

  return (
    <Card className="border border-border/50 xl:col-span-2">
      <CardHeader>
        <CardTitle>Workspace Product Spine</CardTitle>
        <CardDescription>
          從這個工作區穩定分流到 Knowledge、知識頁面、Notebook / AI；Search、Source、Sync
          則作為底層支撐能力。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_0.9fr]">
        <div className="xl:col-span-4">
          <WorkspaceInformationCard
            workspaceName={<p className="text-sm font-medium text-foreground">{workspace.name}</p>}
            workspaceAddress={
              addressLines.length > 0 ? (
                <div className="space-y-1.5 text-sm text-foreground">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">尚未設定工作區地址。</p>
              )
            }
            workspaceRoles={
              workspaceRoles.length > 0
                ? workspaceRoles.map((entry) => ({
                    id: entry.id,
                    roleName: <p className="text-sm font-medium text-foreground">{entry.roleName}</p>,
                    roleValue: entry.role ? (
                      <p className="text-sm text-foreground break-all">{entry.role}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">未設定</p>
                    ),
                  }))
                : []
            }
          />
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Knowledge</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            先用文件、來源與資料庫建立工作區知識基底，再讓知識頁面與 AI 消費。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/workspace/${workspace.id}?tab=Files`}>Files 分頁</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/source/documents?workspaceId=${encodeURIComponent(workspace.id)}`}>
                文件
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Knowledge Pages</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            以工作區知識頁面與文章結構承接知識脈絡，不再透過獨立 Wiki tab 中轉。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.id)}`}>知識頁面</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/knowledge-base/articles?workspaceId=${encodeURIComponent(workspace.id)}`}>
                文章
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Notebook / AI</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            用 AI 對話與 RAG 查詢消費這個工作區的知識，不再把 AI 當成獨立產品島。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/ai-chat?workspaceId=${encodeURIComponent(workspace.id)}`}>AI 對話</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/notebook/rag-query?workspaceId=${encodeURIComponent(workspace.id)}`}>
                RAG Query
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border/50 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Supporting layers</p>
          <ul className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Search</span>：用 RAG Query 承接查詢、引用與回答。
            </li>
            <li>
              <span className="font-medium text-foreground">Source</span>：Files / Documents
              是來源接入與 metadata 宿主。
            </li>
            <li>
              <span className="font-medium text-foreground">Sync</span>：upload → ingest → index 流程持續把來源同步成可查詢知識。
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
