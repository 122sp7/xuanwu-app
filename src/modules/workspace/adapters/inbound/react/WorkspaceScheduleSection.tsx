"use client";

/**
 * WorkspaceScheduleSection — workspace.schedule tab — workspace demand planning.
 */

import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@packages";
import { CalendarRange, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientScheduleUseCases } from "../../outbound/firebase-composition";
import {
  DEMAND_PRIORITIES,
  type DemandPriority,
  type WorkDemandSnapshot,
} from "../../../subdomains/schedule/domain/entities/WorkDemand";
import { createWorkDemandAction } from "../server-actions/schedule-actions";
import { parseLocalDatetimeInput, toLocalDatetimeInputValue } from "./workspace-schedule-datetime";
const scheduleUseCases = createClientScheduleUseCases();

interface WorkspaceScheduleSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

function isDemandPriority(value: string): value is DemandPriority {
  return (DEMAND_PRIORITIES as readonly string[]).includes(value);
}

export function WorkspaceScheduleSection({
  workspaceId,
  accountId,
  currentUserId,
}: WorkspaceScheduleSectionProps): React.ReactElement {
  const { listWorkDemandsByWorkspace } = scheduleUseCases;
  const [period, setPeriod] = useState("本週");
  const [demands, setDemands] = useState<WorkDemandSnapshot[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<DemandPriority>("medium");
  const [scheduledAtLocal, setScheduledAtLocal] = useState(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(9, 0, 0, 0);
    return toLocalDatetimeInputValue(nextDay);
  });
  const [isCreatingDemand, setIsCreatingDemand] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadDemands(): Promise<void> {
    const result = await listWorkDemandsByWorkspace.execute(workspaceId);
    setDemands(result);
  }

  useEffect(() => {
    let active = true;
    void listWorkDemandsByWorkspace.execute(workspaceId).then((result) => {
      if (active) setDemands(result);
    }).catch(() => {
      if (active) setDemands([]);
    });
    return () => { active = false; };
  }, [listWorkDemandsByWorkspace, workspaceId]);

  async function handleCreateDemand(): Promise<void> {
    if (!currentUserId) {
      setCreateError("尚未取得操作者身分，請重新登入後再試。");
      return;
    }
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setCreateError("請先輸入排程標題。");
      return;
    }
    const scheduledAt = parseLocalDatetimeInput(scheduledAtLocal);
    if (!scheduledAt) {
      setCreateError("排程時間格式不正確，請重新選擇。");
      return;
    }
    setIsCreatingDemand(true);
    setCreateError(null);
    const result = await createWorkDemandAction({
      workspaceId,
      accountId,
      requesterId: currentUserId,
      title: normalizedTitle,
      description: description.trim(),
      priority,
      scheduledAt,
    });
    if (!result.success) {
      setCreateError(result.error.message);
      setIsCreatingDemand(false);
      return;
    }
    setTitle("");
    setDescription("");
    await loadDemands();
    setIsCreatingDemand(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">排程</h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => void handleCreateDemand()}
          disabled={isCreatingDemand || !title.trim()}
        >
          <Plus className="size-3.5" />
          {isCreatingDemand ? "建立中…" : "新增排程事項"}
        </Button>
      </div>

      <div className="grid gap-2 rounded-xl border border-border/40 bg-card/30 p-3 sm:grid-cols-2">
        <Input
          placeholder="排程標題（例如：現場驗收）"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
        />
        <Input
          type="datetime-local"
          value={scheduledAtLocal}
          onChange={(event) => setScheduledAtLocal(event.target.value)}
        />
        <Select
          value={priority}
          onValueChange={(value) => {
            if (isDemandPriority(value)) {
              setPriority(value);
            }
          }}
        >
          <SelectTrigger aria-label="排程優先度">
            <SelectValue placeholder="選擇優先度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
          </SelectContent>
        </Select>
        <div className="hidden sm:block" />
        <div className="sm:col-span-2">
          <Textarea
            placeholder="工作內容說明（選填）"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={3}
          />
        </div>
      </div>

      {createError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {createError}
        </p>
      )}

      {/* Phase labels */}
      <div className="flex flex-wrap gap-2">
        {["本週", "本月", "季度", "全部"].map((value) => (
          <Badge
            key={value}
            variant={period === value ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setPeriod(value)}
          >
            {value}
          </Badge>
        ))}
      </div>

      {demands.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-2">
          {demands.map((demand) => (
            <div
              key={demand.id}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-card/40 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{demand.title}</p>
                <p className="text-xs text-muted-foreground">{demand.scheduledAt}</p>
              </div>
              <Badge variant={demand.status === "completed" ? "default" : "outline"}>
                {demand.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative space-y-0 overflow-hidden rounded-xl border border-border/40 bg-card/30">
          <div className="absolute left-6 top-0 h-full w-px bg-border/30" />
          <div className="px-4 py-8 text-center">
            <CalendarRange className="mx-auto mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">尚無工作排程</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              建立排程事項後，將顯示此工作區何時需要執行哪些工作。
            </p>
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
