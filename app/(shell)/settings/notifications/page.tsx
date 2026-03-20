"use client";

/**
 * Settings — 推播通知 /settings/notifications
 * Manages push-notification preferences for the user.
 */

import { useState } from "react";
import { Label } from "@/ui/shadcn/ui/label";
import { Switch } from "@/ui/shadcn/ui/switch";
import { Button } from "@/ui/shadcn/ui/button";
import { Separator } from "@/ui/shadcn/ui/separator";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: "new-booking",
    label: "新預約",
    description: "當有新的預約請求時通知我",
    enabled: true,
  },
  {
    id: "booking-cancelled",
    label: "預約取消",
    description: "當預約被取消時通知我",
    enabled: true,
  },
  {
    id: "booking-rescheduled",
    label: "預約更改",
    description: "當預約時間被更改時通知我",
    enabled: true,
  },
  {
    id: "reminder",
    label: "會議提醒",
    description: "在會議開始前發送提醒通知",
    enabled: true,
  },
  {
    id: "team-invite",
    label: "團隊邀請",
    description: "當您被邀請加入團隊時通知我",
    enabled: true,
  },
  {
    id: "digest",
    label: "每日摘要",
    description: "每日傳送今日排程的摘要通知",
    enabled: false,
  },
];

export default function SettingsNotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(INITIAL_SETTINGS);

  function toggle(id: string) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">推播通知</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理您接收推播通知的偏好設定</p>
      </div>

      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-1">
        {settings.map((setting, idx) => (
          <div key={setting.id}>
            {idx > 0 && <Separator className="my-4" />}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor={setting.id} className="text-sm font-medium cursor-pointer">
                  {setting.label}
                </Label>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </div>
              <Switch
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={() => {
                  toggle(setting.id);
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-end">
        <Button type="button">儲存設定</Button>
      </div>
    </div>
  );
}
