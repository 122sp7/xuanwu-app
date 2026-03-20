"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { getOrganizationTeams } from "@/modules/organization";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationTeamsPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [teams, setTeams] = useState<Awaited<ReturnType<typeof getOrganizationTeams>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    const organizationId = activeOrganizationId;
    if (!organizationId) return;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const data = await getOrganizationTeams(organizationId);
        if (!cancelled) {
          setTeams(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setTeams([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  if (!activeOrganizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">團隊</h1>
        <p className="mt-1 text-sm text-muted-foreground">組織團隊與成員關聯。</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Teams</CardTitle>
          <CardDescription>組織團隊與成員關聯。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入團隊資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取團隊資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && teams.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的團隊資料。</p>
          )}
          {loadState === "loaded" &&
            teams.map((team) => (
              <div key={team.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{team.name}</p>
                  <Badge variant="outline">{team.type}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{team.description || "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Members: {team.memberIds.length}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
