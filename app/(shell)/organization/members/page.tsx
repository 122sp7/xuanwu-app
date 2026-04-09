"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { dismissMember, getOrganizationMembers, inviteMember } from "@/modules/platform/subdomains/organization";
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

type MemberRole = "Admin" | "Member" | "Guest";

export default function OrganizationMembersPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [members, setMembers] = useState<Awaited<ReturnType<typeof getOrganizationMembers>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("Member");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [removingId, setRemovingId] = useState<string | null>(null);

  async function loadMembers(organizationId: string) {
    setLoadState("loading");
    try {
      const data = await getOrganizationMembers(organizationId);
      setMembers(data);
      setLoadState("loaded");
    } catch {
      setMembers([]);
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

  async function handleInvite() {
    if (!activeOrganizationId || !inviteEmail.trim()) return;
    setInviteSubmitting(true);
    setInviteError(null);
    const result = await inviteMember({
      organizationId: activeOrganizationId,
      email: inviteEmail.trim(),
      teamId: "",
      role: inviteRole,
      protocol: "email",
    });
    setInviteSubmitting(false);
    if (result.success) {
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("Member");
      await loadMembers(activeOrganizationId);
    } else {
      setInviteError(result.error.message);
    }
  }

  async function handleDismiss(memberId: string) {
    if (!activeOrganizationId) return;
    setRemovingId(memberId);
    await dismissMember(activeOrganizationId, memberId);
    setRemovingId(null);
    await loadMembers(activeOrganizationId);
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
          <h1 className="text-2xl font-bold tracking-tight">成員</h1>
          <p className="mt-1 text-sm text-muted-foreground">組織成員清單與目前角色。</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>邀請成員</Button>
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
                  {member.role !== "Owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={removingId === member.id}
                      onClick={() => handleDismiss(member.id)}
                    >
                      移除
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>邀請成員</DialogTitle>
            <DialogDescription>輸入電子信箱以邀請新成員加入組織。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="invite-email">電子信箱</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="invite-role">角色</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as MemberRole)}>
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {inviteError && <p className="text-sm text-destructive">{inviteError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              取消
            </Button>
            <Button onClick={handleInvite} disabled={inviteSubmitting || !inviteEmail.trim()}>
              {inviteSubmitting ? "邀請中…" : "送出邀請"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
