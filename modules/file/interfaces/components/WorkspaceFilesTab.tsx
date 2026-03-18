"use client";

import { useMemo } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceFiles } from "../queries/file.queries";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";

interface WorkspaceFilesTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceFilesTab({ workspace }: WorkspaceFilesTabProps) {
  const assets = useMemo(() => getWorkspaceFiles(workspace), [workspace]);
  const availableCount = useMemo(
    () => assets.filter((asset) => asset.status === "active").length,
    [assets],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          盤點目前已註冊或可立即導出的工作區資產，作為後續檔案流程的起點。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Registered assets</p>
            <p className="mt-1 text-xl font-semibold">{assets.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Directly available</p>
            <p className="mt-1 text-xl font-semibold">{availableCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Derived manifests</p>
            <p className="mt-1 text-xl font-semibold">{assets.length - availableCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {assets.map((asset) => (
            <div key={asset.id} className="rounded-xl border border-border/40 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{asset.name}</p>
                    <Badge variant={asset.status === "active" ? "secondary" : "outline"}>
                      {asset.status}
                    </Badge>
                    <Badge variant="outline">{asset.kind}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{asset.detail}</p>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  <p>Source: {asset.source}</p>
                  {asset.href && (
                    <a
                      href={asset.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex text-primary hover:underline"
                    >
                      Open asset
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
