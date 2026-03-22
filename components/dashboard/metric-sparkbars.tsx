"use client";

import { cn } from "@/lib/utils";

export function MetricSparkBars({
  data,
  accent,
  isLight,
}: {
  data: number[];
  accent: string;
  isLight: boolean;
}) {
  const max = Math.max(...data, 1);

  return (
    <div className="mt-4">
      <div className="flex h-20 items-end gap-1">
        {data.map((value, index) => (
          <div key={`${index}-${value}`} className="flex h-full flex-1 items-end">
            <div
              className={cn(
                "w-full rounded-full transition-opacity",
                value === 0 ? "opacity-35" : "opacity-100",
              )}
              style={{
                height: `${Math.max((value / max) * 100, value > 0 ? 14 : 6)}%`,
                backgroundColor: value > 0 ? accent : isLight ? "#dbe4ef" : "rgba(255,255,255,0.08)",
              }}
            />
          </div>
        ))}
      </div>
      <div className={cn("mt-2 flex justify-between text-[10px]", isLight ? "text-slate-400" : "text-white/30")}>
        <span>0时</span>
        <span>6时</span>
        <span>12时</span>
        <span>18时</span>
      </div>
    </div>
  );
}
