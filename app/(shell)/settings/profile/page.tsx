"use client";

/**
 * Settings — 個人資料 /settings/profile
 * Manages user avatar, username, display name, email, bio, and connected accounts.
 */

import { useEffect, useRef, useState } from "react";
import { Camera, Plus, Trash2 } from "lucide-react";

import { useAuth } from "@/app/providers/auth-provider";
import { subscribeToUserProfile } from "@/modules/account/interfaces/queries/account.queries";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Separator } from "@ui-shadcn/ui/separator";
import { Textarea } from "@ui-shadcn/ui/textarea";

export default function SettingsProfilePage() {
  const { state: authState, logout } = useAuth();
  const { user } = authState;
  const [profile, setProfile] = useState<AccountEntity | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToUserProfile(user.id, setProfile);
    return () => unsub();
  }, [user?.id]);

  const displayName = profile?.name ?? user?.name ?? "";
  const email = profile?.email ?? user?.email ?? "";
  const avatarUrl = profile?.photoURL ?? null;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">個人資料</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理您的個人資料設定</p>
      </div>

      {/* Avatar */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="頭像" className="size-full object-cover" />
            ) : (
              <Camera className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">個人頭像</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                上傳頭像
              </Button>
              <Button type="button" variant="ghost" size="sm">
                移除
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </div>
        </div>
      </section>

      {/* Username */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">使用者名稱</Label>
          <div className="flex items-center rounded-md border border-input bg-background text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring overflow-hidden">
            <span className="flex items-center border-r border-input bg-muted px-3 py-2 text-muted-foreground text-sm shrink-0">
              cal.com/
            </span>
            <Input
              id="username"
              defaultValue={displayName.toLowerCase().replace(/\s+/g, "")}
              className="border-0 shadow-none focus-visible:ring-0 rounded-none"
              placeholder="your-username"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ⓘ 提示：您可以在使用者名稱之間加上「+」（例如 cal.com/anna+brian）來與多位人士會面
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullname">完整姓名</Label>
          <Input id="fullname" defaultValue={displayName} placeholder="您的完整姓名" />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label>電子郵件</Label>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <span className="flex-1 truncate">{email}</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                主要
              </span>
              <span className="text-muted-foreground">···</span>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1 shrink-0">
              <Plus className="size-3.5" />
              新增電子郵件
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label htmlFor="bio">關於</Label>
          <Textarea
            id="bio"
            placeholder="撰寫一段關於自己的介紹…"
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button type="button">更新</Button>
        </div>
      </section>

      {/* Connected accounts */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold">Connected accounts</h2>
        <div className="flex items-center justify-between text-sm">
          <span>Google</span>
          <Button type="button" variant="destructive" size="sm">
            中斷連結
          </Button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-sm space-y-2">
        <h2 className="text-sm font-semibold text-destructive">危險區域</h2>
        <p className="text-xs text-muted-foreground">請小心。帳戶刪除後無法復原。</p>
        <Separator className="my-3" />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => void logout()}
          >
            <Trash2 className="size-3.5" />
            刪除帳號
          </Button>
        </div>
      </section>
    </div>
  );
}
