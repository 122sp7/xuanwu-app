"use client";

/**
 * Module: knowledge-database
 * Layer: interfaces/components
 * Purpose: DatabaseCalendarView — month calendar grouped by the first date field.
 *
 * Renders a standard month grid. Records whose date field falls within the
 * displayed month are shown as chips on the relevant day cell.
 */

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { getRecords } from "../queries/knowledge-database.queries";
import type { Database, Field } from "../../domain/entities/database.entity";
import type { DatabaseRecord } from "../../domain/entities/record.entity";

interface DatabaseCalendarViewProps {
  database: Database;
  accountId: string;
  workspaceId: string;
  currentUserId: string;
}

function getProperty(record: DatabaseRecord, fieldId: string): unknown {
  if (record.properties instanceof Map) return record.properties.get(fieldId);
  return (record.properties as Record<string, unknown>)[fieldId];
}

/** Return an ISO date string (YYYY-MM-DD) if value is a valid date-like string. */
function toDateString(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/** Find the first date field in the schema. */
function findDateField(fields: Field[]): Field | undefined {
  return fields.find((f) => f.type === "date");
}

/** Build a map: dateKey (YYYY-MM-DD) → records */
function buildDateMap(
  records: DatabaseRecord[],
  dateFieldId: string,
): Map<string, DatabaseRecord[]> {
  const map = new Map<string, DatabaseRecord[]>();
  for (const record of records) {
    const ds = toDateString(getProperty(record, dateFieldId));
    if (!ds) continue;
    const existing = map.get(ds) ?? [];
    existing.push(record);
    map.set(ds, existing);
  }
  return map;
}

/** Return all days in a given month as YYYY-MM-DD strings. */
function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function getRecordLabel(record: DatabaseRecord, fields: Field[]): string {
  // Use the value of the first text field as the label
  const textField = fields.find((f) => f.type === "text");
  if (textField) {
    const val = getProperty(record, textField.id);
    if (typeof val === "string" && val) return val;
  }
  return record.id.slice(0, 8);
}

export function DatabaseCalendarView({
  database,
  accountId,
}: DatabaseCalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accountId || !database.id) return;
    setLoading(true);
    try {
      const data = await getRecords(accountId, database.id);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, [accountId, database.id]);

  useEffect(() => { load(); }, [load]);

  const dateField = findDateField(database.fields);

  const dateMap = dateField
    ? buildDateMap(records, dateField.id)
    : new Map<string, DatabaseRecord[]>();

  const days = getDaysInMonth(year, month);
  // First day of week offset (0=Sunday)
  const firstDayOffset = days[0].getDay();
  // Pad empty cells before first day
  const paddedDays: (Date | null)[] = [
    ...Array.from({ length: firstDayOffset }, () => null),
    ...days,
  ];
  // Pad to complete last row
  while (paddedDays.length % 7 !== 0) paddedDays.push(null);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  if (!dateField) {
    return (
      <p className="rounded-md border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        日曆視圖需要至少一個「日期」欄位。請先新增日期欄位。
      </p>
    );
  }

  const todayStr = today.toISOString().slice(0, 10);

  return (
    <div className="space-y-2">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">
          {year} 年 {MONTH_NAMES[month]}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border border-border/60 overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border/60 bg-muted/30">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="py-1.5 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {paddedDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="min-h-[80px] border-b border-r border-border/40 bg-muted/10 last:border-r-0" />;
            }
            const ds = day.toISOString().slice(0, 10);
            const dayRecords = dateMap.get(ds) ?? [];
            const isToday = ds === todayStr;

            return (
              <div
                key={ds}
                className={`min-h-[80px] border-b border-r border-border/40 p-1.5 last:border-r-0 ${
                  isToday ? "bg-primary/5" : "bg-background"
                }`}
              >
                <div className={`mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  isToday
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground"
                }`}>
                  {day.getDate()}
                </div>
                <div className="flex flex-col gap-0.5">
                  {dayRecords.slice(0, 3).map((record) => (
                    <Badge
                      key={record.id}
                      variant="secondary"
                      className="h-4 justify-start truncate px-1 text-[10px] font-normal"
                    >
                      {getRecordLabel(record, database.fields)}
                    </Badge>
                  ))}
                  {dayRecords.length > 3 && (
                    <span className="text-[10px] text-muted-foreground pl-1">
                      +{dayRecords.length - 3} 更多
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {records.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          共 {records.length} 筆記錄，依「{dateField.name}」欄位顯示
        </p>
      )}
    </div>
  );
}
