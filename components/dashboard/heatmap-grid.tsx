"use client";

import { cn } from "@/lib/utils";
import type { HeatmapCell } from "@/lib/types";

const darkColors = [
  "rgba(255,255,255,0.04)",
  "rgba(87,212,255,0.18)",
  "rgba(87,212,255,0.32)",
  "rgba(181,255,82,0.34)",
  "rgba(181,255,82,0.56)",
];

const lightColors = ["#eef2f7", "#d7eef8", "#bde4f3", "#def4c1", "#b6ee6e"];

export function HeatmapGrid({
  cells,
  isLight = false,
}: {
  cells: HeatmapCell[];
  isLight?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 gap-2">
      {cells.map((cell) => (
        <div
          key={cell.id}
          className={cn(
            "aspect-square rounded-[10px] border",
            isLight ? "border-slate-200/80" : "border-white/[0.03]",
          )}
          style={{ backgroundColor: isLight ? lightColors[cell.value] : darkColors[cell.value] }}
        />
      ))}
    </div>
  );
}
