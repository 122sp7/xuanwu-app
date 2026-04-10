"use client";

/**
 * Module: notion/subdomains/database
 * Layer: interfaces/components
 * Purpose: DatabaseCalendarView — month-grid calendar grouped by a date field.
 */

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { Badge } from "@ui-shadcn/ui/badge";

import { getRecords } from "../queries";
import type { DatabaseSnapshot } from "../../domain/aggregates/Database";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";

interface DatabaseCalendarViewProps {
  database: DatabaseSnapshot;
  accountId: string;
}

function getProperty(record: DatabaseRecordSnapshot, fieldId: string): unknown {
  if (record.properties && typeof record.properties === "object") {
    return (record.properties as Record<string, unknown>)[fieldId] ?? null;
  }
  return null;
}

export function DatabaseCalendarView({ database, accountId }: DatabaseCalendarViewProps) {
  const [records, setRecords] = useState<DatabaseRecordSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => new Date());

  const dateField = database.fields.find((f) => f.type === "date") ?? null;
  const titleField = database.fields.find((f) => f.type === "text") ?? null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { void load(); }, [load]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const recordsByDay: Record<string, DatabaseRecordSnapshot[]> = {};
  if (dateField) {
    for (const record of records) {
      const val = getProperty(record, dateField.id);
      if (!val) continue;
      try {
        const d = new Date(String(val));
        if (!isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month) {
          const key = String(d.getDate());
          (recordsByDay[key] ??= []).push(record);
        }
      } catch {}
    }
  }

  function prevMonth() { setCursor(new Date(year, month - 1, 1)); }
  function nextMonth() { setCursor(new Date(year, month + 1, 1)); }

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  if (!dateField) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        此資料庫未包含「日期」欄位，無法顯示日曆視圖。
      </p>
    );
  }

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {year}年 {month + 1}月
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60">
        <div className="grid grid-cols-7 bg-muted/30">
          {weekDays.map((d) => (
            <div key={d} className="px-2 py-1.5 text-center text-[10px] font-semibold text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-border/40">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[60px] border-b border-r border-border/30 bg-muted/10" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayRecords = recordsByDay[String(day)] ?? [];
            const today = new Date();
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            return (
              <div key={day} className={`min-h-[60px] border-b border-r border-border/30 p-1 ${isToday ? "bg-primary/5" : ""}`}>
                <span className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {dayRecords.slice(0, 3).map((record) => {
                    const title = titleField ? String(getProperty(record, titleField.id) ?? "") || "—" : "—";
                    return (
                      <Badge key={record.id} variant="secondary" className="w-full justify-start truncate text-[9px]">
                        {title}
                      </Badge>
                    );
                  })}
                  {dayRecords.length > 3 && (
                    <span className="text-[9px] text-muted-foreground">+{dayRecords.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
