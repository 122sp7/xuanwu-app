"use client";

import { useCallback, useEffect, useState } from "react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Users } from "lucide-react";

import type { WorkDemand } from "../domain/types";
import { DEMAND_STATUS_LABELS, DEMAND_PRIORITY_LABELS } from "../domain/types";
import { assignWorkDemand } from "./_actions/work-demand.actions";
import { getAccountDemands } from "./queries/work-demand.queries";

export interface AccountMember {
  id: string;
  name: string;
}

const PRIORITY_DOT: Record<WorkDemand["priority"], string> = {
  low: "bg-green-400",
  medium: "bg-amber-400",
  high: "bg-red-500",
};

const STATUS_VARIANT: Record<WorkDemand["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  open: "secondary",
  in_progress: "default",
  completed: "default",
};

interface AccountSchedulingViewProps {
  readonly accountId: string;
  readonly currentUserId: string;
  readonly availableMembers?: AccountMember[];
}

export function AccountSchedulingView({
  accountId,
  currentUserId,
  availableMembers = [],
}: AccountSchedulingViewProps) {
  const [demands, setDemands] = useState<WorkDemand[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [pendingAssign, setPendingAssign] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDemands = useCallback(async () => {
    setLoadState("loading");
    try {
      const data = await getAccountDemands(accountId);
      setDemands(data);
      setLoadState("loaded");
    } catch {
      setLoadState("error");
    }
  }, [accountId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadDemands();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDemands]);

  async function handleAssign(demandId: string, userId: string) {
    setPendingAssign(demandId);
    setActionError(null);
    try {
      const result = await assignWorkDemand({
        demandId,
        userId,
        assignedBy: currentUserId,
      });
      if (!result.success) {
        setActionError(result.error.message);
        return;
      }
      await loadDemands();
    } finally {
      setPendingAssign(null);
    }
  }

  const byWorkspace = demands.reduce<Record<string, WorkDemand[]>>((acc, d) => {
    if (!acc[d.workspaceId]) acc[d.workspaceId] = [];
    acc[d.workspaceId].push(d);
    return acc;
  }, {});

  const workspaceEntries = Object.entries(byWorkspace);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-semibold">工作需求總覽</h2>
          <p className="text-sm text-muted-foreground">
            顯示名下所有 Workspace 提出的需求，可在此指派成員。
          </p>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}

      {loadState === "loading" && (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          載入中…
        </div>
      )}

      {loadState === "error" && (
        <p className="text-sm text-destructive">載入失敗，請重新整理。</p>
      )}

      {loadState === "loaded" && demands.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          目前名下所有 Workspace 均無工作需求。
        </div>
      )}

      {loadState === "loaded" && workspaceEntries.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaceEntries.map(([wsId, wsDemands]) => (
            <Card key={wsId} className="flex flex-col">
              <CardHeader className="bg-muted/40 pb-3">
                <CardTitle className="text-sm font-semibold truncate">
                  Workspace: <span className="font-mono text-xs">{wsId.slice(0, 8)}…</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {wsDemands.length} 筆需求
                </p>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 p-4">
                {wsDemands.map((demand) => (
                  <div
                    key={demand.id}
                    className="rounded-md border border-border/60 bg-background p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug flex-1 min-w-0 truncate">
                        {demand.title}
                      </p>
                      <span
                        title={DEMAND_PRIORITY_LABELS[demand.priority]}
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[demand.priority]}`}
                      />
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[demand.status]} className="text-[10px]">
                        {DEMAND_STATUS_LABELS[demand.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {demand.scheduledAt}
                      </span>
                    </div>

                    {availableMembers.length > 0 && (
                      <div className="mt-2.5">
                        <p className="mb-1 text-[10px] text-muted-foreground">指派給</p>
                        <Select
                          value={demand.assignedUserId ?? ""}
                          onValueChange={(userId) => {
                            if (userId) void handleAssign(demand.id, userId);
                          }}
                          disabled={pendingAssign === demand.id}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="選擇成員…" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {availableMembers.length === 0 && demand.assignedUserId && (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        已指派：{demand.assignedUserId}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loadState === "loaded" && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={loadDemands}>
            重新整理
          </Button>
        </div>
      )}
    </div>
  );
}

