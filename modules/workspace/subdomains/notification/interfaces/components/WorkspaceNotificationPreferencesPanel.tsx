"use client";

/**
 * WorkspaceNotificationPreferencesPanel
 *
 * Workspace-scoped notification preferences UI.
 * Lets a workspace member toggle which event types they want notifications for.
 */

import { useCallback, useEffect, useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { Switch } from "@ui-shadcn/ui/switch";
import { Label } from "@ui-shadcn/ui/label";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import {
  getWorkspaceNotificationPreferences,
} from "../queries/workspace-notification.queries";
import { updateWorkspaceNotificationPreferences } from "../_actions/workspace-notification.actions";
import {
  WORKSPACE_NOTIFICATION_EVENT_TYPES,
} from "../../application/dto/notification-preference.dto";
import type { WorkspaceNotificationEventType } from "../../application/dto/notification-preference.dto";

const EVENT_LABELS: Record<WorkspaceNotificationEventType, string> = {
  "workspace-flow.task.assigned": "任務指派",
  "workspace-flow.task.status_changed": "任務狀態變更",
  "workspace-flow.task.submitted_to_qa": "任務提交驗收",
  "workspace-flow.task.qa_passed": "任務驗收通過",
  "workspace-flow.task.acceptance_approved": "任務驗收核准",
  "workspace-flow.issue.opened": "問題建立",
  "workspace-flow.issue.fixed": "問題已修正",
  "workspace-flow.issue.closed": "問題關閉",
  "workspace.lifecycle-transitioned": "工作區狀態變更",
  "workspace.audit.critical-detected": "嚴重稽核事件",
};

interface WorkspaceNotificationPreferencesPanelProps {
  readonly workspaceId: string;
  readonly memberId: string;
}

export function WorkspaceNotificationPreferencesPanel({
  workspaceId,
  memberId,
}: WorkspaceNotificationPreferencesPanelProps) {
  const [subscribed, setSubscribed] = useState<
    Set<WorkspaceNotificationEventType>
  >(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const prefs = await getWorkspaceNotificationPreferences(
        workspaceId,
        memberId,
      );
      setSubscribed(new Set(prefs.subscribedEvents));
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, memberId]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleToggle(eventType: WorkspaceNotificationEventType) {
    setSubscribed((prev) => {
      const next = new Set(prev);
      if (next.has(eventType)) {
        next.delete(eventType);
      } else {
        next.add(eventType);
      }
      return next;
    });
  }

  function handleSave() {
    startSaving(async () => {
      await updateWorkspaceNotificationPreferences({
        workspaceId,
        memberId,
        subscribedEvents: [...subscribed],
      });
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">工作區通知偏好</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {WORKSPACE_NOTIFICATION_EVENT_TYPES.map((eventType) => (
            <li key={eventType} className="flex items-center justify-between gap-3">
              <Label
                htmlFor={`notif-${eventType}`}
                className="text-sm cursor-pointer"
              >
                {EVENT_LABELS[eventType as WorkspaceNotificationEventType] ??
                  eventType}
              </Label>
              <Switch
                id={`notif-${eventType}`}
                checked={subscribed.has(
                  eventType as WorkspaceNotificationEventType,
                )}
                onCheckedChange={() =>
                  handleToggle(eventType as WorkspaceNotificationEventType)
                }
                disabled={isSaving}
              />
            </li>
          ))}
        </ul>
      )}

      <Button
        size="sm"
        disabled={isLoading || isSaving}
        onClick={handleSave}
        className="w-full"
      >
        {isSaving ? "儲存中…" : "儲存偏好"}
      </Button>
    </div>
  );
}
