"use client";

/**
 * CalendarSidebarPanel — Google Calendar-style left-panel scaffold.
 *
 * Rendered inside ShellSidebarBody when section === "calendar".
 * Shows: mini month calendar, search users, booking pages section,
 * "my calendars" list, and "other calendars" list.
 *
 * Data is currently local-state scaffolding; production wiring will connect
 * through platform/subdomains/calendar/ use-cases and the Google Calendar
 * adapter in packages/integration-google/.
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Search } from "lucide-react";

// ── Mini calendar helpers ──────────────────────────────────────────────────────

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"] as const;

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const totalDays = getDaysInMonth(year, month);
  const startDay = getFirstDayOfWeek(year, month);
  const grid: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= totalDays; d++) grid.push(d);
  // Pad to full weeks
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

const MONTH_NAMES = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
] as const;

// ── Calendar list types ────────────────────────────────────────────────────────

interface CalendarEntry {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

const INITIAL_MY_CALENDARS: CalendarEntry[] = [
  { id: "primary", name: "主要日曆", color: "#1a73e8", visible: true },
  { id: "tasks", name: "Tasks", color: "#0f9d58", visible: true },
  { id: "birthday", name: "生日", color: "#16a765", visible: true },
];

const INITIAL_OTHER_CALENDARS: CalendarEntry[] = [
  { id: "tw-holidays", name: "台灣的節慶假日", color: "#0f9d58", visible: true },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function MiniCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const grid = buildMonthGrid(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="px-1 py-1 select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-foreground">
          {viewYear}年{MONTH_NAMES[viewMonth]}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            aria-label="上個月"
            onClick={prevMonth}
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            aria-label="下個月"
            onClick={nextMonth}
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {WEEKDAY_LABELS.map((lbl) => (
          <div key={lbl} className="text-center text-[10px] text-muted-foreground font-medium py-0.5">
            {lbl}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {grid.map((day, idx) => (
          <button
             
            key={idx}
            disabled={day === null}
            aria-label={day ? `${viewYear}年${MONTH_NAMES[viewMonth]}${day}日` : undefined}
            onClick={() => { if (day) setSelectedDay(day); }}
            className={[
              "h-6 w-6 mx-auto flex items-center justify-center rounded-full text-[11px] transition-colors",
              day === null ? "invisible" : "cursor-pointer hover:bg-muted",
              day && isToday(day) ? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" : "",
              day && selectedDay === day && !isToday(day) ? "bg-muted text-foreground font-medium" : "",
              day && !isToday(day) && selectedDay !== day ? "text-foreground" : "",
            ].filter(Boolean).join(" ")}
          >
            {day ?? ""}
          </button>
        ))}
      </div>
    </div>
  );
}

interface CalendarGroupProps {
  title: string;
  calendars: CalendarEntry[];
  onToggle: (id: string) => void;
  onAdd?: () => void;
}

function CalendarGroup({ title, calendars, onToggle, onAdd }: CalendarGroupProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between px-1 py-0.5 group">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground flex-1 text-left"
          aria-expanded={expanded}
        >
          {title}
          {expanded
            ? <ChevronUp className="size-3 ml-1" />
            : <ChevronDown className="size-3 ml-1" />}
        </button>
        {onAdd && (
          <button
            aria-label={`新增日曆到「${title}」`}
            onClick={onAdd}
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="size-3" />
          </button>
        )}
      </div>
      {expanded && (
        <ul className="space-y-0.5">
          {calendars.map((cal) => (
            <li key={cal.id}>
              <button
                onClick={() => onToggle(cal.id)}
                className="flex items-center gap-2 w-full px-1 py-0.5 rounded hover:bg-muted text-left"
              >
                <span
                  className="h-3 w-3 rounded-sm shrink-0 border"
                  style={{
                    backgroundColor: cal.visible ? cal.color : "transparent",
                    borderColor: cal.color,
                  }}
                  aria-hidden="true"
                />
                <span className="text-xs text-foreground truncate">{cal.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function CalendarSidebarPanel() {
  const [myCalendars, setMyCalendars] = useState<CalendarEntry[]>(INITIAL_MY_CALENDARS);
  const [otherCalendars, setOtherCalendars] = useState<CalendarEntry[]>(INITIAL_OTHER_CALENDARS);

  function toggleCalendar(
    setter: React.Dispatch<React.SetStateAction<CalendarEntry[]>>,
    id: string,
  ) {
    setter((prev) =>
      prev.map((cal) => (cal.id === id ? { ...cal, visible: !cal.visible } : cal)),
    );
  }

  return (
    <div className="flex flex-col gap-3 px-2 py-2">
      {/* Mini calendar */}
      <MiniCalendar />

      {/* Search users */}
      <button className="flex items-center gap-2 w-full rounded-md border border-border/60 px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <Search className="size-3.5 shrink-0" />
        搜尋使用者
      </button>

      {/* Booking pages */}
      <div>
        <div className="flex items-center justify-between px-1 py-0.5 group">
          <span className="text-[11px] font-medium text-muted-foreground">預約頁面</span>
          <button
            aria-label="新增預約頁面"
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="size-3" />
          </button>
        </div>
        <p className="px-1 text-[10px] text-muted-foreground">尚未建立預約頁面。</p>
      </div>

      {/* My calendars */}
      <CalendarGroup
        title="我的日曆"
        calendars={myCalendars}
        onToggle={(id) => toggleCalendar(setMyCalendars, id)}
      />

      {/* Other calendars */}
      <CalendarGroup
        title="其他日曆"
        calendars={otherCalendars}
        onToggle={(id) => toggleCalendar(setOtherCalendars, id)}
        onAdd={() => { /* TODO: open add calendar dialog */ }}
      />
    </div>
  );
}
