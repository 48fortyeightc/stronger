"use client";

import { cn } from "@/lib/utils";

export function CountdownMiniCalendar({
  title,
  daysLeft,
  targetLabel,
  isLight,
}: {
  title: string;
  daysLeft: number;
  targetLabel: string;
  isLight: boolean;
}) {
  const cells = [
    "今",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
  ];

  return (
    <div
      className={cn(
        "rounded-[24px] border p-4",
        isLight ? "border-slate-200/80 bg-white/82" : "border-white/8 bg-white/[0.04]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className={cn("text-[11px] uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/38")}>
            倒数日
          </div>
          <div className={cn("mt-2 text-sm font-medium", isLight ? "text-slate-900" : "text-white")}>{title}</div>
          <div className={cn("mt-1 text-[11px]", isLight ? "text-slate-500" : "text-white/42")}>
            距离 {targetLabel}
          </div>
        </div>
        <div className="text-right">
          <div className={cn("text-3xl font-semibold tracking-[-0.06em]", isLight ? "text-slate-950" : "text-white")}>{daysLeft}</div>
          <div className={cn("text-[11px]", isLight ? "text-slate-500" : "text-white/38")}>天</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-8 gap-1.5">
        {cells.map((cell, index) => (
          <div
            key={`${cell}-${index}`}
            className={cn(
              "flex aspect-square items-center justify-center rounded-xl border text-[11px] font-medium",
              index === 0
                ? isLight
                  ? "border-slate-300 bg-slate-950 text-white"
                  : "border-white/18 bg-white text-black"
                : index < 8
                  ? isLight
                    ? "border-slate-200/80 bg-white/70 text-slate-500"
                    : "border-white/8 bg-white/[0.02] text-white/50"
                  : isLight
                    ? "border-slate-200/80 bg-slate-900/[0.03] text-slate-400"
                    : "border-white/8 bg-white/[0.03] text-white/38",
            )}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className={cn("mt-3 flex items-center justify-between text-[11px]", isLight ? "text-slate-500" : "text-white/38")}> 
        <span>今天</span>
        <span>{targetLabel}</span>
      </div>
    </div>
  );
}
