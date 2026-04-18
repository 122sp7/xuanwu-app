"use client";

/**
 * @module ui-visualization
 * 數據視覺化元件（Recharts 2 封裝）。
 *
 * Context7 基線：/recharts/recharts
 * - 使用 ResponsiveContainer 確保響應式佈局。
 * - 避免固定 width/height，改用 percentage + parent div 高度。
 */

import { type ReactNode } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ─── StatCard (preserved from original) ──────────────────────────────────────

export interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  icon?: ReactNode;
}

export const StatCard = ({ label, value, caption, icon }: StatCardProps) => (
  <article className="rounded-md border p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      {icon}
    </div>
    <p className="mt-2 text-2xl font-semibold">{String(value)}</p>
    {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
  </article>
);

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface DataPoint {
  name: string;
  [key: string]: string | number;
}

export interface SeriesConfig {
  dataKey: string;
  color?: string;
  label?: string;
}

const DEFAULT_COLORS = [
  "hsl(var(--chart-1, 215 100% 50%))",
  "hsl(var(--chart-2, 150 60% 50%))",
  "hsl(var(--chart-3, 30 100% 55%))",
  "hsl(var(--chart-4, 280 70% 60%))",
  "hsl(var(--chart-5, 0 70% 60%))",
];

// ─── XuanwuLineChart ──────────────────────────────────────────────────────────

export interface XuanwuLineChartProps {
  data: DataPoint[];
  series: SeriesConfig[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

/**
 * Responsive line chart.
 *
 * @example
 * ```tsx
 * <XuanwuLineChart
 *   data={[{ name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }]}
 *   series={[{ dataKey: 'value', label: 'Revenue', color: '#8884d8' }]}
 * />
 * ```
 */
export const XuanwuLineChart = ({
  data,
  series,
  height = 300,
  showGrid = true,
  showLegend = true,
  className,
}: XuanwuLineChartProps) => (
  <div className={["w-full", className].filter(Boolean).join(" ")} style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        {series.map((s, i) => (
          <Line
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.label ?? s.dataKey}
            stroke={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// ─── XuanwuBarChart ───────────────────────────────────────────────────────────

export interface XuanwuBarChartProps {
  data: DataPoint[];
  series: SeriesConfig[];
  height?: number;
  stacked?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

/**
 * Responsive bar chart with optional stacking.
 */
export const XuanwuBarChart = ({
  data,
  series,
  height = 300,
  stacked = false,
  showGrid = true,
  showLegend = true,
  className,
}: XuanwuBarChartProps) => (
  <div className={["w-full", className].filter(Boolean).join(" ")} style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        {series.map((s, i) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.label ?? s.dataKey}
            fill={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
            {...(stacked ? { stackId: "stack" } : {})}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ─── XuanwuPieChart ───────────────────────────────────────────────────────────

export interface PieDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface XuanwuPieChartProps {
  data: PieDataPoint[];
  height?: number;
  innerRadius?: number;
  showLegend?: boolean;
  className?: string;
}

/**
 * Responsive pie / donut chart.
 *
 * @example
 * ```tsx
 * <XuanwuPieChart
 *   data={[{ name: 'Done', value: 80 }, { name: 'Todo', value: 20 }]}
 *   innerRadius={60}
 * />
 * ```
 */
export const XuanwuPieChart = ({
  data,
  height = 300,
  innerRadius = 0,
  showLegend = true,
  className,
}: XuanwuPieChartProps) => (
  <div className={["w-full", className].filter(Boolean).join(" ")} style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius="80%">
          {data.map((entry, i) => (
            <Cell
              key={entry.name}
              fill={entry.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  </div>
);
