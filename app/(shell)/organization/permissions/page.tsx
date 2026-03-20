"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { getOrgPolicies } from "@/modules/organization";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { isOrganizationAccount } from "../_utils";

export default function OrganizationPermissionsPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [policies, setPolicies] = useState<Awaited<ReturnType<typeof getOrgPolicies>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    const organizationId = activeOrganizationId;
    if (!organizationId) return;
    let cancelled = false;

    Promise.resolve().then(async () => {
      if (cancelled) {
        return;
      }
      setLoadState("loading");
      try {
        const data = await getOrgPolicies(organizationId);
        if (!cancelled) {
          setPolicies(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setPolicies([]);
          setLoadState("error");
        }
      }
    });

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
        <h1 className="text-2xl font-bold tracking-tight">權限</h1>
        <p className="mt-1 text-sm text-muted-foreground">組織層級政策規則與 scope。</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>組織層級政策規則與 scope。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入政策資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取政策資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && policies.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的政策資料。</p>
          )}
          {loadState === "loaded" &&
            policies.map((policy) => (
              <div key={policy.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{policy.name}</p>
                  <Badge variant="outline">{policy.scope}</Badge>
                  <Badge variant={policy.isActive ? "default" : "secondary"}>
                    {policy.isActive ? "active" : "inactive"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{policy.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">Rules: {policy.rules.length}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
