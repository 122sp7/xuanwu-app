"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { useAuth } from "@/modules/platform/api";
import { getProfile, updateProfile } from "../..";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

type FormState = {
  displayName: string;
  bio: string;
  photoURL: string;
};

const EMPTY_FORM: FormState = {
  displayName: "",
  bio: "",
  photoURL: "",
};

export function SettingsProfileRouteScreen() {
  const { state: authState } = useAuth();
  const actorId = authState.user?.id ?? "";

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!actorId) {
      setForm(EMPTY_FORM);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setMessage(null);
      try {
        const profile = await getProfile(actorId);
        if (!cancelled) {
          setForm({
            displayName: profile?.displayName ?? authState.user?.name ?? "",
            bio: profile?.bio ?? "",
            photoURL: profile?.photoURL ?? "",
          });
        }
      } catch {
        if (!cancelled) {
          setMessage("讀取個人資料失敗，請稍後重試。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [actorId, authState.user?.name]);

  const hasChanges = useMemo(() => {
    return form.displayName.trim().length > 0 || form.bio.trim().length > 0 || form.photoURL.trim().length > 0;
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!actorId) {
      setMessage("尚未登入，無法更新個人資料。");
      return;
    }

    const payload = {
      ...(form.displayName.trim() ? { displayName: form.displayName.trim() } : {}),
      ...(form.bio.trim() ? { bio: form.bio.trim() } : {}),
      ...(form.photoURL.trim() ? { photoURL: form.photoURL.trim() } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setMessage("請至少填寫一個欄位再儲存。");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const result = await updateProfile(actorId, payload);
      if (result.success) {
        setMessage("已更新個人資料。");
      } else {
        setMessage(result.error?.message ?? "更新個人資料失敗。");
      }
    } catch {
      setMessage("更新個人資料失敗，請稍後重試。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>個人資料</CardTitle>
          <CardDescription>這個頁面已切換到 account-profile 寫入流程（strangler migration）。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="displayName">顯示名稱</Label>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, displayName: event.target.value }));
                }}
                placeholder="輸入顯示名稱"
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">簡介</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, bio: event.target.value }));
                }}
                placeholder="輸入個人簡介"
                rows={4}
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoURL">頭像網址</Label>
              <Input
                id="photoURL"
                value={form.photoURL}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, photoURL: event.target.value }));
                }}
                placeholder="https://example.com/avatar.png"
                disabled={loading || saving}
              />
            </div>

            {message ? (
              <p className="text-sm text-muted-foreground">{message}</p>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading || saving || !hasChanges}>
                {saving ? "儲存中..." : "儲存個人資料"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
