"use client";

/**
 * WorkspaceSettingsSection — workspace.settings tab — workspace configuration.
 */

import { Settings, Globe, Lock, Trash2 } from "lucide-react";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Separator } from "@ui-shadcn/ui/separator";
import type { WorkspaceEntity } from "./WorkspaceContext";

interface WorkspaceSettingsSectionProps {
  workspaceId: string;
  accountId: string;
  workspace?: WorkspaceEntity | null;
}

export function WorkspaceSettingsSection({
  workspaceId,
  accountId: _accountId,
  workspace,
}: WorkspaceSettingsSectionProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">工作區設定</h2>
      </div>

      {/* General section */}
      <div className="space-y-3 rounded-xl border border-border/40 bg-card/30 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">一般</p>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">名稱</p>
          <p className="text-sm font-medium">{workspace?.name ?? "—"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">工作區 ID</p>
          <p className="font-mono text-xs text-muted-foreground">{workspaceId}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">可見性</p>
          <Badge variant="outline" className="gap-1 text-xs">
            {workspace?.visibility === "public" ? (
              <Globe className="size-3" />
            ) : (
              <Lock className="size-3" />
            )}
            {workspace?.visibility ?? "—"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">狀態</p>
          <Badge
            variant={workspace?.lifecycleState === "active" ? "default" : "secondary"}
            className="text-xs"
          >
            {workspace?.lifecycleState ?? "—"}
          </Badge>
        </div>
        <Button size="sm" variant="outline" className="mt-2" disabled>
          編輯設定
        </Button>
      </div>

      <Separator />

      {/* Danger zone */}
      <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-xs font-medium text-destructive uppercase tracking-wide">危險區域</p>
        <p className="text-xs text-muted-foreground">
          刪除工作區後，所有資料（任務、文件、成員）將無法恢復。
        </p>
        <Button size="sm" variant="destructive" disabled>
          <Trash2 className="size-3.5" />
          刪除工作區
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}
