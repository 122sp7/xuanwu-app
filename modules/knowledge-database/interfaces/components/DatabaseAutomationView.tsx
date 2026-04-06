"use client";

/**
 * Module: knowledge-database
 * Layer: interfaces/components
 * Purpose: DatabaseAutomationView — manage automation rules for a Database.
 *
 * Notion-equivalent: Database > "Automations" panel.
 * Renders a list of existing automations and a creator for new ones.
 * Actual execution is handled server-side; this component is management UI only.
 */

import { Plus, Zap, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

import type {
  DatabaseAutomation,
  AutomationTrigger,
  AutomationActionType,
} from "../../domain/entities/database-automation.entity";

// ── Trigger labels ─────────────────────────────────────────────────────────────
const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  record_created: "建立記錄時",
  record_updated: "更新記錄時",
  record_deleted: "刪除記錄時",
  property_changed: "屬性變更時",
};

const ACTION_LABELS: Record<AutomationActionType, string> = {
  send_notification: "發送通知",
  update_property: "更新屬性",
  create_record: "建立記錄",
  webhook: "呼叫 Webhook",
};

// ── In-memory store (replace with Firebase persistence in the real impl) ───────
const DEMO_AUTOMATIONS: DatabaseAutomation[] = [];

interface DatabaseAutomationViewProps {
  databaseId: string;
  accountId: string;
  currentUserId: string;
}

interface DraftAutomation {
  name: string;
  trigger: AutomationTrigger;
  actionType: AutomationActionType;
  actionValue: string;
}

const DEFAULT_DRAFT: DraftAutomation = {
  name: "",
  trigger: "record_created",
  actionType: "send_notification",
  actionValue: "",
};

export function DatabaseAutomationView({
  databaseId,
  accountId,
  currentUserId,
}: DatabaseAutomationViewProps) {
  const [automations, setAutomations] = useState<DatabaseAutomation[]>(DEMO_AUTOMATIONS);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<DraftAutomation>(DEFAULT_DRAFT);

  function handleSave() {
    if (!draft.name.trim()) return;
    const now = new Date().toISOString();
    const newAutomation: DatabaseAutomation = {
      id: crypto.randomUUID(),
      databaseId,
      accountId,
      name: draft.name.trim(),
      enabled: true,
      trigger: draft.trigger,
      conditions: [],
      actions: [{ type: draft.actionType, config: { value: draft.actionValue } }],
      createdByUserId: currentUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    setAutomations((prev) => [...prev, newAutomation]);
    setDraft(DEFAULT_DRAFT);
    setCreating(false);
  }

  function handleToggle(id: string) {
    setAutomations((prev) =>
      prev.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a),
    );
  }

  function handleDelete(id: string) {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">自動化規則</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {automations.length}
          </span>
        </div>
        {!creating && (
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setCreating(true)}>
            <Plus className="h-3.5 w-3.5" />
            新增規則
          </Button>
        )}
      </div>

      {/* Create form */}
      {creating && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">新規則</p>

          <div className="space-y-1">
            <Label className="text-xs">規則名稱</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="例如：建立後發送通知"
              className="h-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">觸發條件</Label>
              <Select
                value={draft.trigger}
                onValueChange={(v) => setDraft((d) => ({ ...d, trigger: v as AutomationTrigger }))}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TRIGGER_LABELS) as AutomationTrigger[]).map((t) => (
                    <SelectItem key={t} value={t}>{TRIGGER_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">執行動作</Label>
              <Select
                value={draft.actionType}
                onValueChange={(v) => setDraft((d) => ({ ...d, actionType: v as AutomationActionType }))}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ACTION_LABELS) as AutomationActionType[]).map((a) => (
                    <SelectItem key={a} value={a}>{ACTION_LABELS[a]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">動作參數（選填）</Label>
            <Input
              value={draft.actionValue}
              onChange={(e) => setDraft((d) => ({ ...d, actionValue: e.target.value }))}
              placeholder={draft.actionType === "webhook" ? "https://..." : "訊息內容或欄位值"}
              className="h-8 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setCreating(false); setDraft(DEFAULT_DRAFT); }}>
              取消
            </Button>
            <Button size="sm" disabled={!draft.name.trim()} onClick={handleSave}>
              儲存
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {automations.length === 0 && !creating ? (
        <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          <Zap className="mx-auto mb-2 h-8 w-8 opacity-30" />
          <p>尚無自動化規則</p>
          <p className="text-xs mt-1">點擊「新增規則」來建立第一條規則</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border">
          {automations.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => handleToggle(a.id)}
                title={a.enabled ? "停用" : "啟用"}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                {a.enabled
                  ? <ToggleRight className="h-5 w-5 text-primary" />
                  : <ToggleLeft className="h-5 w-5" />
                }
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${!a.enabled ? "line-through text-muted-foreground" : ""}`}>
                  {a.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {TRIGGER_LABELS[a.trigger]} → {ACTION_LABELS[a.actions[0]?.type ?? "send_notification"]}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(a.id)}
                title="刪除"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
