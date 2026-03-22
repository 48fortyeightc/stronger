"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/types";

export function TrendChart({
  data,
  isLight = false,
}: {
  data: TrendPoint[];
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
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke={grid} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: tick, fontSize: 12 }}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: tooltipBorder,
              background: tooltipBg,
              color: tooltipColor,
            }}
          />
          <Line
            type="monotone"
            dataKey="progress"
            name="推进值"
            stroke="#47d4ff"
            strokeWidth={3}
            dot={{ r: 4, fill: "#47d4ff" }}
          />
          <Line
            type="monotone"
            dataKey="energy"
            name="能量值"
            stroke="#95f036"
            strokeWidth={3}
            dot={{ r: 4, fill: "#95f036" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
