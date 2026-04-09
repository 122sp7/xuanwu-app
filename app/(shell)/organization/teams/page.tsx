"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { createTeam, getOrganizationTeams } from "@/modules/platform/subdomains/organization";
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

export default function OrganizationTeamsPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [teams, setTeams] = useState<Awaited<ReturnType<typeof getOrganizationTeams>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"internal" | "external">("internal");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadTeams(organizationId: string) {
    setLoadState("loading");
    try {
      const data = await getOrganizationTeams(organizationId);
      setTeams(data);
      setLoadState("loaded");
    } catch {
      setTeams([]);
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

  async function handleCreate() {
    if (!activeOrganizationId || !newName.trim()) return;
    setCreateSubmitting(true);
    setCreateError(null);
    const result = await createTeam({
      organizationId: activeOrganizationId,
      name: newName.trim(),
      description: newDescription.trim(),
      type: newType,
    });
    setCreateSubmitting(false);
    if (result.success) {
      setCreateOpen(false);
      setNewName("");
      setNewDescription("");
      setNewType("internal");
      await loadTeams(activeOrganizationId);
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
          <h1 className="text-2xl font-bold tracking-tight">團隊</h1>
          <p className="mt-1 text-sm text-muted-foreground">組織團隊與成員關聯。</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>建立團隊</Button>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>建立團隊</DialogTitle>
            <DialogDescription>填寫團隊名稱與類型以建立新團隊。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="team-name">名稱</Label>
              <Input
                id="team-name"
                placeholder="團隊名稱"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="team-description">描述</Label>
              <Input
                id="team-description"
                placeholder="選填"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="team-type">類型</Label>
              <Select
                value={newType}
                onValueChange={(v) => setNewType(v as "internal" | "external")}
              >
                <SelectTrigger id="team-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal（內部）</SelectItem>
                  <SelectItem value="external">External（外部）</SelectItem>
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
