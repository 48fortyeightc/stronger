"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyBarPoint } from "@/lib/types";

export function WeeklyBarChart({
  data,
  isLight = false,
}: {
  data: WeeklyBarPoint[];
  isLight?: boolean;
}) {
  const grid = isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)";
  const tick = isLight ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.5)";
  const tooltipBg = isLight ? "rgba(255,255,255,0.98)" : "rgba(17,19,24,0.96)";
  const tooltipBorder = isLight ? "1px solid rgba(15,23,42,0.08)" : "1px solid rgba(255,255,255,0.08)";
  const tooltipColor = isLight ? "#0f172a" : "#ffffff";

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} barSize={14}>
          <CartesianGrid vertical={false} stroke={grid} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: tick, fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: tooltipBorder,
              background: tooltipBg,
              color: tooltipColor,
            }}
          />
          <Bar dataKey="生命" fill="#95f036" radius={[6, 6, 0, 0]} />
          <Bar dataKey="爱" fill="#ff5f93" radius={[6, 6, 0, 0]} />
          <Bar dataKey="事业" fill="#47d4ff" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
