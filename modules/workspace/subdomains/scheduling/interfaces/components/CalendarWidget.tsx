"use client";

import { useMemo, useState } from "react";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "@lib-date-fns";
import { Button } from "@ui-shadcn/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { WorkDemand } from "../../domain/types";
import { DEMAND_STATUS_LABELS } from "../../domain/types";

interface CalendarWidgetProps {
  demands: WorkDemand[];
  onDayClick?: (date: Date) => void;
}

const DAY_HEADERS = ["日", "一", "二", "三", "四", "五", "六"] as const;

const STATUS_DOT_CLASSES: Record<WorkDemand["status"], string> = {
  draft: "bg-muted-foreground",
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  completed: "bg-green-500",
};

function CalendarDayCell({
  day,
  isCurrentMonth,
  dayDemands,
  onDayClick,
}: {
  day: Date;
  isCurrentMonth: boolean;
  dayDemands: WorkDemand[];
  onDayClick?: (date: Date) => void;
}) {
  const today = isToday(day);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={format(day, "yyyy-MM-dd")}
      onClick={() => onDayClick?.(day)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onDayClick?.(day);
      }}
      className={[
        "relative min-h-[72px] rounded-lg border p-1.5 text-sm transition-colors",
        isCurrentMonth
          ? "border-border/50 bg-card hover:bg-accent/40 cursor-pointer"
          : "border-transparent bg-muted/20 text-muted-foreground cursor-default",
        today ? "ring-2 ring-primary ring-offset-1" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
          today ? "bg-primary text-primary-foreground" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {format(day, "d")}
      </span>

      <div className="mt-1 space-y-0.5">
        {dayDemands.slice(0, 3).map((d) => (
          <div
            key={d.id}
            title={`${d.title} (${DEMAND_STATUS_LABELS[d.status]})`}
            className="flex items-center gap-1 truncate"
          >
            <span
              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT_CLASSES[d.status]}`}
            />
            <span className="truncate text-[10px] leading-none text-foreground/80">
              {d.title}
            </span>
          </div>
        ))}
        {dayDemands.length > 3 && (
          <span className="text-[10px] text-muted-foreground">
            +{dayDemands.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

export function CalendarWidget({ demands, onDayClick }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));

  const monthDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      }),
    [currentMonth],
  );

  const leadingBlanks = useMemo(() => getDay(startOfMonth(currentMonth)), [currentMonth]);

  const demandsByDate = useMemo(() => {
    const map = new Map<string, WorkDemand[]>();
    for (const d of demands) {
      const key = d.scheduledAt.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return map;
  }, [demands]);

  function getDayDemands(day: Date): WorkDemand[] {
    return demandsByDate.get(format(day, "yyyy-MM-dd")) ?? [];
  }

  const legendEntries: { status: WorkDemand["status"]; label: string }[] = [
    { status: "open", label: DEMAND_STATUS_LABELS.open },
    { status: "in_progress", label: DEMAND_STATUS_LABELS.in_progress },
    { status: "completed", label: DEMAND_STATUS_LABELS.completed },
    { status: "draft", label: DEMAND_STATUS_LABELS.draft },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {format(currentMonth, "yyyy 年 M 月")}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="上個月"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
          >
            今天
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="下個月"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {legendEntries.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${STATUS_DOT_CLASSES[status]}`}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_HEADERS.map((h) => (
          <div
            key={h}
            className="pb-1 text-center text-xs font-medium text-muted-foreground"
          >
            {h}
          </div>
        ))}

        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {monthDays.map((day) => (
          <CalendarDayCell
            key={day.toISOString()}
            day={day}
            isCurrentMonth={isSameMonth(day, currentMonth)}
            dayDemands={getDayDemands(day)}
            onDayClick={isSameMonth(day, currentMonth) ? onDayClick : undefined}
          />
        ))}
      </div>
    </div>
  );
}

