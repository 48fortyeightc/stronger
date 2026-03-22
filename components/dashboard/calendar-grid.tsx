"use client";

import type { CalendarDay, LifeLineName } from "@/lib/types";
import { cn } from "@/lib/utils";

const domainColor: Record<LifeLineName, string> = {
  生命: "#95f036",
  爱: "#ff5f93",
  事业: "#47d4ff",
};

const weekdays = ["一", "二", "三", "四", "五", "六", "日"];

export function CalendarGrid({
  days,
  selectedDate,
  onSelect,
  isLight = false,
}: {
  days: CalendarDay[];
  selectedDate: string;
  onSelect: (date: string) => void;
  isLight?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((day) => (
          <div key={day} className={cn("px-2 text-xs font-medium", isLight ? "text-slate-400" : "text-white/42")}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const ratio = day.totalTasks === 0 ? 0 : day.completedTasks / day.totalTasks;
          return (
            <button
              key={`${day.isoDate}-${day.day}`}
              onClick={() => day.inCurrentMonth && onSelect(day.isoDate)}
              className={cn(
                "relative aspect-square rounded-2xl border px-2 py-1 text-left transition",
                day.inCurrentMonth
                  ? isLight
                    ? "border-slate-200/80 bg-white/88 hover:bg-slate-50"
                    : "border-white/8 bg-white/[0.04] hover:bg-white/[0.08]"
                  : isLight
                    ? "border-transparent bg-slate-100/60 text-slate-300"
                    : "border-transparent bg-white/[0.02] text-white/20",
                selectedDate === day.isoDate && day.inCurrentMonth
                  ? isLight
                    ? "border-slate-300 bg-slate-100"
                    : "border-white/18 bg-white/[0.1]"
                  : "",
              )}
            >
              <div
                className="absolute inset-x-2 bottom-2 h-1.5 rounded-full"
                style={{
                  background: day.inCurrentMonth
                    ? `linear-gradient(90deg, ${domainColor[day.dominantLine]} ${ratio * 100}%, ${isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)"} ${ratio * 100}%)`
                    : isLight
                      ? "rgba(15,23,42,0.06)"
                      : "rgba(255,255,255,0.04)",
                }}
              />
              <div className="flex items-center justify-between text-xs">
                <span className={cn(day.isToday ? (isLight ? "font-semibold text-slate-900" : "font-semibold text-white") : isLight ? "text-slate-600" : "text-white/70")}>
                  {day.day}
                </span>
                {day.reviewed && day.inCurrentMonth ? (
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: domainColor[day.dominantLine] }} />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
