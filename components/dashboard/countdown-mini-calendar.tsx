"use client";

import { useState, type FormEvent } from "react";
import { Calendar as CalendarIcon, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CountdownEvent = {
  id: number;
  title: string;
  date: string;
  color: string;
};

const initialEvents: CountdownEvent[] = [
  { id: 1, title: "CET-6", date: "2026-06-13", color: "from-blue-400 to-blue-600" },
  { id: 2, title: "行测冲刺", date: "2026-07-20", color: "from-emerald-400 to-emerald-600" },
  { id: 3, title: "厦门数据分析实习", date: "2026-04-30", color: "from-rose-400 to-rose-600" },
];

const paletteOptions = [
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-rose-400 to-rose-600",
  "from-amber-400 to-amber-600",
  "from-violet-400 to-violet-600",
];

function getWeekday(dateString: string) {
  const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const date = new Date(`${dateString}T00:00:00`);
  return days[date.getDay()];
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function calculateDays(dateString: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${dateString}T00:00:00`);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function CountdownMiniCalendar({ isLight }: { isLight: boolean }) {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    color: "from-blue-400 to-blue-600",
  });

  function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date) return;

    setEvents((current) => [
      ...current,
      {
        id: Date.now(),
        title: newEvent.title.trim(),
        date: newEvent.date,
        color: newEvent.color,
      },
    ]);
    setNewEvent({ title: "", date: "", color: "from-blue-400 to-blue-600" });
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={cn("text-xs font-semibold uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/38")}>倒数日</div>
          <div className={cn("mt-2 flex items-center gap-2 text-2xl font-semibold tracking-[-0.04em]", isLight ? "text-slate-950" : "text-white")}>
            <CalendarIcon className={cn("size-5", isLight ? "text-slate-500" : "text-white/48")} />
            <span>日历倒数</span>
          </div>
          <div className={cn("mt-1 text-sm", isLight ? "text-slate-500" : "text-white/44")}>记录你的重要时刻</div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-full border transition active:scale-95",
            isLight
              ? "border-slate-200/90 bg-white text-slate-700 shadow-[0_16px_40px_rgba(148,163,184,0.2)] hover:bg-slate-50"
              : "border-white/10 bg-white/[0.05] text-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.24)] hover:bg-white/[0.08]",
          )}
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => {
          const days = calculateDays(event.date);
          const isPast = days < 0;

          return (
            <div
              key={event.id}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border transition",
                isLight
                  ? "border-slate-200/80 bg-white/86 shadow-[0_24px_80px_rgba(148,163,184,0.18)]"
                  : "border-white/8 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.28)]",
              )}
            >
              <button
                type="button"
                onClick={() => setEvents((current) => current.filter((item) => item.id !== event.id))}
                className={cn(
                  "absolute right-4 top-4 z-10 rounded-full p-2 opacity-0 transition group-hover:opacity-100",
                  isLight
                    ? "bg-black/8 text-slate-700 hover:bg-rose-500 hover:text-white"
                    : "bg-black/20 text-white/80 hover:bg-rose-500 hover:text-white",
                )}
              >
                <Trash2 className="size-4" />
              </button>

              <div className={`flex h-20 items-center bg-gradient-to-b ${event.color} px-5`}>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/78">倒数日</div>
                  <div className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-white">
                    {event.title} {isPast ? "已经" : "还有"}
                  </div>
                </div>
              </div>

              <div className="relative flex flex-1 flex-col justify-between p-5">
                <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05]">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.9) 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />
                </div>

                <div className="relative z-10 flex items-end justify-between gap-4">
                  <div>
                    <div className={cn("text-[11px] uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/38")}>
                      剩余
                    </div>
                    <div className={cn("mt-2 text-[4.3rem] font-black leading-none tracking-[-0.08em]", isLight ? "text-slate-950" : "text-white")}>
                      {Math.abs(days)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={cn("text-[11px] uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/38")}>
                      目标日期
                    </div>
                    <div className={cn("mt-2 text-sm font-medium", isLight ? "text-slate-900" : "text-white")}>{formatDate(event.date)}</div>
                    <div className={cn("mt-1 text-[11px]", isLight ? "text-slate-500" : "text-white/38")}>{getWeekday(event.date)}</div>
                  </div>
                </div>

                <div className={cn("relative z-10 mt-5 rounded-[22px] border p-3", isLight ? "border-slate-200/80 bg-white/82" : "border-white/8 bg-white/[0.03]")}>
                  <div className={cn("text-[11px] uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>
                    今日提醒
                  </div>
                  <div className={cn("mt-2 text-sm leading-6", isLight ? "text-slate-700" : "text-white/72")}>
                    {isPast ? "这个节点已经过去，适合回看沉淀。" : `今天距离这个节点还有 ${Math.abs(days)} 天，保持节奏。`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className={cn("w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl", isLight ? "bg-white text-slate-900" : "bg-zinc-900 text-white")}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className={cn("text-xs uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/36")}>新增倒数</div>
                <div className="mt-2 text-xl font-semibold">记录一个新的重要节点</div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={cn("rounded-full p-2 transition", isLight ? "text-slate-500 hover:bg-slate-100" : "text-white/60 hover:bg-white/8")}
              >
                <X className="size-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={addEvent}>
              <input
                value={newEvent.title}
                onChange={(event) => setNewEvent((current) => ({ ...current, title: event.target.value }))}
                placeholder="事项名称，例如 CET-6"
                className={cn(
                  "w-full rounded-[1.25rem] border px-4 py-3 text-sm outline-none transition",
                  isLight
                    ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
                    : "border-white/8 bg-white/[0.04] text-white placeholder:text-white/28 focus:border-white/16",
                )}
              />

              <input
                type="date"
                value={newEvent.date}
                onChange={(event) => setNewEvent((current) => ({ ...current, date: event.target.value }))}
                className={cn(
                  "w-full rounded-[1.25rem] border px-4 py-3 text-sm outline-none transition",
                  isLight
                    ? "border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-300"
                    : "border-white/8 bg-white/[0.04] text-white focus:border-white/16",
                )}
              />

              <div className="grid grid-cols-5 gap-3">
                {paletteOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewEvent((current) => ({ ...current, color }))}
                    className={cn(
                      "h-10 rounded-full bg-gradient-to-br transition active:scale-95",
                      color,
                      newEvent.color === color ? "ring-4 ring-sky-400/30" : "opacity-80 hover:opacity-100",
                    )}
                  />
                ))}
              </div>

              <button
                type="submit"
                className={cn(
                  "mt-2 w-full rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition active:scale-[0.98]",
                  isLight ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-white text-black hover:bg-white/90",
                )}
              >
                保存
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
