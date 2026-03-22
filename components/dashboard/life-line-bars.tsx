"use client";

import { Activity, BriefcaseBusiness, Heart } from "lucide-react";
import type { LifeLineState } from "@/lib/types";

const iconMap = {
  生命: Activity,
  爱: Heart,
  事业: BriefcaseBusiness,
} as const;

export function LifeLineBars({
  lifeLines = [],
  isLight,
}: {
  lifeLines?: LifeLineState[];
  isLight: boolean;
}) {
  return (
    <div className="space-y-5">
      {lifeLines.map((line) => {
        const Icon = iconMap[line.name];

        return (
          <div key={line.name} className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={
                    isLight
                      ? "flex size-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-900/[0.03]"
                      : "flex size-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04]"
                  }
                >
                  <Icon className="size-4" style={{ color: line.accent }} />
                </div>
                <div className="min-w-0">
                  <div className={isLight ? "text-sm font-medium text-slate-900" : "text-sm font-medium text-white"}>
                    {line.name}
                  </div>
                  <div className={isLight ? "text-[11px] text-slate-500" : "text-[11px] text-white/38"}>
                    {line.stage}
                  </div>
                </div>
              </div>
              <div className={isLight ? "text-xl font-semibold text-slate-950" : "text-xl font-semibold text-white"}>
                {line.score}
              </div>
            </div>

            <div className={isLight ? "h-2 rounded-full bg-slate-200/90" : "h-2 rounded-full bg-white/6"}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${line.score}%`,
                  background: `linear-gradient(90deg, ${line.accent}, ${line.accent}cc)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
