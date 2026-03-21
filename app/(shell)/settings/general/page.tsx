"use client";

/**
 * Settings — 一般 /settings/general
 * Manages language, timezone, time format, and week-start preferences.
 */

import { useState } from "react";
import { Button } from "@ui-shadcn/ui/button";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

const LANGUAGES = [
  { value: "zh-TW", label: "中文（台灣）" },
  { value: "zh-CN", label: "中文（簡體）" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

const TIMEZONES = [
  { value: "Asia/Taipei", label: "Asia/Taipei" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "UTC", label: "UTC" },
];

const TIME_FORMATS = [
  { value: "12", label: "12 小時制" },
  { value: "24", label: "24 小時制" },
];

const WEEK_STARTS = [
  { value: "0", label: "星期日" },
  { value: "1", label: "星期一" },
  { value: "6", label: "星期六" },
];

export default function SettingsGeneralPage() {
  const [language, setLanguage] = useState("zh-TW");
  const [timezone, setTimezone] = useState("Asia/Taipei");
  const [timeFormat, setTimeFormat] = useState("12");
  const [weekStart, setWeekStart] = useState("0");

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">一般</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理語言和時區設定</p>
      </div>

      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
        {/* Language */}
        <div className="space-y-1.5">
          <Label htmlFor="language">語言</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timezone */}
        <div className="space-y-1.5">
          <Label htmlFor="timezone">時區</Label>
          <div className="flex items-center gap-2">
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone" className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5">
              <span className="text-xs">📅</span>
              日程時區變更
            </Button>
          </div>
        </div>

        {/* Time format */}
        <div className="space-y-1.5">
          <Label htmlFor="timeformat">時間格式</Label>
          <Select value={timeFormat} onValueChange={setTimeFormat}>
            <SelectTrigger id="timeformat" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_FORMATS.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            ⓘ 此為內部設定，您或要預約您時間的使用者在公開預約的頁面上看見的時間並不會受到影響。
          </p>
        </div>

        {/* Week start */}
        <div className="space-y-1.5">
          <Label htmlFor="weekstart">一週開始</Label>
          <Select value={weekStart} onValueChange={setWeekStart}>
            <SelectTrigger id="weekstart" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEK_STARTS.map((ws) => (
                <SelectItem key={ws.value} value={ws.value}>
                  {ws.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button type="button">更新</Button>
        </div>
      </section>
    </div>
  );
}
