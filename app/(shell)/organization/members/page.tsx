"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { getOrganizationMembers } from "@/modules/organization/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationMembersPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [members, setMembers] = useState<Awaited<ReturnType<typeof getOrganizationMembers>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!activeOrganizationId) return;
    const organizationId: string = activeOrganizationId;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const data = await getOrganizationMembers(organizationId);
        if (!cancelled) {
          setMembers(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setMembers([]);
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
        <h1 className="text-2xl font-bold tracking-tight">成員</h1>
        <p className="mt-1 text-sm text-muted-foreground">組織成員清單與目前角色。</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>組織成員清單與目前角色。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入成員資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取成員資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && members.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的成員資料。</p>
          )}
          {loadState === "loaded" &&
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge variant="secondary">{member.presence}</Badge>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
