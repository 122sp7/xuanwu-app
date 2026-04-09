"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { createOrgPolicy, getOrgPolicies } from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { isOrganizationAccount } from "../_utils";

type PolicyScope = "workspace" | "member" | "global";

export default function OrganizationPermissionsPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [policies, setPolicies] = useState<Awaited<ReturnType<typeof getOrgPolicies>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newScope, setNewScope] = useState<PolicyScope>("member");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadPolicies(organizationId: string) {
    setLoadState("loading");
    try {
      const data = await getOrgPolicies(organizationId);
      setPolicies(data);
      setLoadState("loaded");
    } catch {
      setPolicies([]);
      setLoadState("error");
    }
  }

  useEffect(() => {
    if (!activeOrganizationId) return;
    const organizationId: string = activeOrganizationId;
    let cancelled = false;

    async function load() {
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
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  async function handleCreate() {
    if (!activeOrganizationId || !newName.trim()) return;
    setCreateSubmitting(true);
    setCreateError(null);
    const result = await createOrgPolicy({
      orgId: activeOrganizationId,
      name: newName.trim(),
      description: newDescription.trim(),
      rules: [],
      scope: newScope,
    });
    setCreateSubmitting(false);
    if (result.success) {
      setCreateOpen(false);
      setNewName("");
      setNewDescription("");
      setNewScope("member");
      await loadPolicies(activeOrganizationId);
    } else {
      setCreateError(result.error.message);
    }
  }

  if (!activeOrganizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">權限</h1>
          <p className="mt-1 text-sm text-muted-foreground">組織層級政策規則與 scope。</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>新增政策</Button>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增政策</DialogTitle>
            <DialogDescription>建立組織層級存取控制政策。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="policy-name">名稱</Label>
              <Input
                id="policy-name"
                placeholder="政策名稱"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="policy-description">描述</Label>
              <Input
                id="policy-description"
                placeholder="選填"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="policy-scope">Scope</Label>
              <Select value={newScope} onValueChange={(v) => setNewScope(v as PolicyScope)}>
                <SelectTrigger id="policy-scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member（成員）</SelectItem>
                  <SelectItem value="workspace">Workspace（工作區）</SelectItem>
                  <SelectItem value="global">Global（全域）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createError && <p className="text-sm text-destructive">{createError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate} disabled={createSubmitting || !newName.trim()}>
              {createSubmitting ? "建立中…" : "建立"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
