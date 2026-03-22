"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { LifeLineState } from "@/lib/types";

export function LifeLineChart({ data }: { data: LifeLineState[] }) {
  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(23,32,31,0.14)" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: "#42514c", fontSize: 12, fontWeight: 600 }}
          />
          <Radar
            name="状态"
            dataKey="score"
            stroke="#c56a32"
            fill="#c56a32"
            fillOpacity={0.28}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [`${String(value ?? "-")} / 10`, "状态分"]}
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(23,32,31,0.08)",
              background: "rgba(255,250,242,0.96)",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
