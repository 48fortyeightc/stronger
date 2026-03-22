"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useTransition } from "react";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Moon,
  Plus,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { CalendarGrid } from "@/components/dashboard/calendar-grid";
import { HeatmapGrid } from "@/components/dashboard/heatmap-grid";
import { LifeLineBars } from "@/components/dashboard/life-line-bars";
import { MetricSparkBars } from "@/components/dashboard/metric-sparkbars";
import { OverviewRings } from "@/components/dashboard/overview-rings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AIInsight, AppState, DailyAction, InsightKind, LifeLineName } from "@/lib/types";
import { cn, formatPercent } from "@/lib/utils";

const TrendChart = dynamic(() => import("@/components/charts/trend-chart").then((mod) => mod.TrendChart), {
  ssr: false,
});

const WeeklyBarChart = dynamic(
  () => import("@/components/charts/weekly-bar-chart").then((mod) => mod.WeeklyBarChart),
  { ssr: false },
);

const domainColor: Record<LifeLineName, string> = {
  生命: "#95f036",
  爱: "#ff5f93",
  事业: "#47d4ff",
};

function themeCard(isLight: boolean) {
  return isLight
    ? "border border-slate-200/80 bg-white/72 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-2xl"
    : "border border-white/8 bg-white/[0.03] shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl";
}

function subCard(isLight: boolean) {
  return isLight ? "border border-slate-200/80 bg-white/78" : "border border-white/8 bg-white/[0.04]";
}

async function postInsight<T>(url: string, payload: T) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("AI request failed");
  return (await response.json()) as AIInsight;
}

function createActionsFromInsight(insight: AIInsight, domain: LifeLineName): DailyAction[] {
  return insight.actions.slice(0, 4).map((action, index) => ({
    id: `ai-${index}-${Date.now()}`,
    title: action,
    duration: index === 0 ? "45 分钟" : index === 1 ? "25 分钟" : "10 分钟",
    priority: index === 0 ? "关键" : index === 1 ? "重要" : "维持",
    status: "pending",
    domain,
    note: "来自 AI 的今日建议",
    scheduledAt: index === 0 ? "09:00" : index === 1 ? "14:00" : "20:30",
  }));
}

export function StrongerApp({ initialState }: { initialState: AppState }) {
  const [appState, setAppState] = useState(initialState);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeInsight, setActiveInsight] = useState<InsightKind>("statusSummary");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    initialState.calendarDays.find((item) => item.isToday)?.isoDate ?? initialState.calendarDays[0]?.isoDate,
  );
  const [isPending, startTransition] = useTransition();

  const isLight = theme === "light";
  const completedToday = appState.dailyActions.filter((item) => item.status === "done").length;
  const todayProgress = Math.round((completedToday / Math.max(appState.dailyActions.length, 1)) * 100);
  const monthProgress = Math.min(appState.goal.progress + 18, 100);
  const selectedDay = appState.calendarDays.find((item) => item.isoDate === selectedDate);

  const completionRings = [
    { label: "本月", value: monthProgress, accent: "#95f036" },
    { label: "本周", value: appState.weeklySnapshot.progressRate, accent: "#ff5f93" },
    { label: "今日", value: todayProgress, accent: "#47d4ff" },
  ];

  const quickMetrics = [
    { label: "目标进度", value: formatPercent(appState.goal.progress), icon: <Zap className="size-3 text-amber-400" /> },
    { label: "倒数日", value: String(appState.goal.countdownDays), icon: <CalendarClock className="size-3 text-violet-400" /> },
    { label: "本周任务", value: `${appState.weeklySnapshot.doneTasks}/${appState.weeklySnapshot.totalTasks}`, icon: <CheckCircle2 className="size-3 text-emerald-400" /> },
    { label: "连续前进", value: String(appState.weeklySnapshot.streakDays), icon: <Activity className="size-3 text-orange-400" /> },
  ];

  const formattedDate = useMemo(
    () => new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date("2026-03-18")),
    [],
  );

  function toggleAction(id: string) {
    setAppState((current) => ({
      ...current,
      dailyActions: current.dailyActions.map((item) =>
        item.id === id ? { ...item, status: item.status === "done" ? "pending" : "done" } : item,
      ),
    }));
  }

  function addTask() {
    if (!newTaskTitle.trim()) return;
    setAppState((current) => ({
      ...current,
      dailyActions: [
        ...current.dailyActions,
        {
          id: `manual-${Date.now()}`,
          title: newTaskTitle.trim(),
          duration: "15 分钟",
          priority: "重要",
          status: "pending",
          domain: current.goal.domain,
          note: "手动添加到今天的任务",
          scheduledAt: "待定",
        },
      ],
    }));
    setNewTaskTitle("");
  }

  function runInsight(kind: InsightKind) {
    startTransition(async () => {
      const endpoint = `/api/ai/${kind === "statusSummary" ? "status-summary" : kind === "planToday" ? "plan-today" : kind === "reviewDay" ? "review-day" : "weekly-summary"}`;
      const payload =
        kind === "statusSummary"
          ? { lifeLines: appState.lifeLines, goalTitle: appState.goal.title, blocker: appState.dailyLog.blocker }
          : kind === "planToday"
            ? { lifeLines: appState.lifeLines, goal: appState.goal, blocker: appState.dailyLog.blocker }
            : kind === "reviewDay"
              ? { goal: appState.goal, dailyActions: appState.dailyActions, dailyLog: appState.dailyLog }
              : { goal: appState.goal, lifeLines: appState.lifeLines, weeklySnapshot: appState.weeklySnapshot };

      try {
        const insight = await postInsight(endpoint, payload);
        setAppState((current) => ({
          ...current,
          aiInsights: { ...current.aiInsights, [kind]: insight },
          dailyActions: kind === "planToday" ? createActionsFromInsight(insight, current.goal.domain) : current.dailyActions,
        }));
      } finally {
        setActiveInsight(kind);
      }
    });
  }

  return (
    <div
      className={cn(
        "min-h-screen pb-14 transition-colors duration-300",
        isLight
          ? "bg-[radial-gradient(circle_at_top_left,rgba(71,212,255,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,95,147,0.10),transparent_18%),linear-gradient(180deg,#f9fbff_0%,#eef3f9_48%,#f8fafc_100%)] text-slate-900"
          : "bg-[radial-gradient(circle_at_top_left,rgba(71,212,255,0.08),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,95,147,0.08),transparent_18%),linear-gradient(180deg,#07080a_0%,#090b10_42%,#0a0b0f_100%)] text-white",
      )}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between gap-4 px-1 pt-2">
          <div>
            <div className={cn("text-[2rem] font-semibold tracking-tight", isLight ? "text-slate-950" : "text-white")}>摘要</div>
            <div className={cn("mt-1 text-sm", isLight ? "text-slate-500" : "text-white/48")}>{formattedDate}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={
                isLight
                  ? "border-slate-200/90 bg-white/80 text-slate-700 hover:bg-white"
                  : undefined
              }
            >
              {isLight ? <Moon className="mr-2 size-4" /> : <Sun className="mr-2 size-4" />}
              {isLight ? "深色模式" : "浅色模式"}
            </Button>
            <Button
              onClick={() => runInsight("planToday")}
              disabled={isPending}
              className={
                isLight
                  ? "border-slate-200/90 bg-slate-950 text-white hover:bg-slate-800"
                  : undefined
              }
            >
              <Sparkles className="mr-2 size-4" />AI 安排今天
            </Button>
          </div>
        </header>

        <main className="grid gap-5 xl:grid-cols-12">
          <Card className={cn("xl:col-span-8", themeCard(isLight))}>
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.14fr_0.86fr] lg:items-start">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[appState.goal.yearTheme, appState.goal.phaseLabel, appState.goal.weekLabel].map((tag) => (
                      <Badge key={tag} className={isLight ? "border-slate-200/80 bg-slate-900/[0.03] text-slate-600" : "border-white/10 bg-white/[0.03] text-white/60"}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className={cn("text-xs font-medium uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/38")}>
                    当前阶段目标
                  </div>
                  <h1 className={cn("text-4xl font-semibold leading-[1.06] tracking-[-0.05em] sm:text-5xl", isLight ? "text-slate-950" : "text-white")}>
                    {appState.goal.title}
                  </h1>
                  <p className={cn("max-w-xl text-sm leading-7", isLight ? "text-slate-500" : "text-white/48")}>
                    {appState.goal.reason}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                  <div className={cn("rounded-[28px] p-5", subCard(isLight))}>
                    <div className={cn("mb-4 text-xs font-semibold uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/38")}>生命 / 爱 / 事业得分</div>
                    <LifeLineBars lifeLines={appState.lifeLines} isLight={isLight} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {quickMetrics.map((metric) => (
                      <div key={metric.label} className={cn("rounded-[20px] p-4", subCard(isLight))}>
                        <div className="mb-2 flex items-center gap-2">{metric.icon}<span className={cn("text-[11px] font-medium", isLight ? "text-slate-500" : "text-white/38")}>{metric.label}</span></div>
                        <div className={cn("text-[1.7rem] font-semibold tracking-[-0.05em]", isLight ? "text-slate-950" : "text-white")}>{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cn("rounded-[30px] p-5", subCard(isLight))}>
                <div className="space-y-4">
                  <div className={cn("text-xs font-semibold uppercase tracking-[0.22em]", isLight ? "text-slate-500" : "text-white/38")}>
                    周期概览
                  </div>
                  <OverviewRings rings={completionRings} isLight={isLight} />
                  <div className="space-y-2.5">
                    {completionRings.map((item) => (
                      <div key={item.label} className={cn("rounded-[18px] px-3 py-3", isLight ? "border border-slate-200/80 bg-white/82" : "border border-white/8 bg-white/[0.03]")}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="h-3 w-1 rounded-full" style={{ backgroundColor: item.accent }} />
                            <span className={cn("text-xs font-medium", isLight ? "text-slate-500" : "text-white/42")}>{item.label}</span>
                          </div>
                          <div className="flex items-end gap-1">
                            <span className={cn("text-xl font-semibold tracking-[-0.05em]", isLight ? "text-slate-950" : "text-white")}>{item.value}</span>
                            <span className={cn("mb-0.5 text-[11px] font-semibold", isLight ? "text-slate-400" : "text-white/36")}>%</span>
                          </div>
                        </div>
                        <div className={cn("mt-2 h-1.5 rounded-full", isLight ? "bg-slate-200/90" : "bg-white/8")}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${item.value}%`, backgroundColor: item.accent }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className={cn("xl:col-span-4", themeCard(isLight))}>
            <div className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>Today</div>
                  <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>今天待办</div>
                </div>
                <Badge className={isLight ? "border-slate-200/80 bg-slate-900/[0.03] text-slate-600" : "border-white/10 bg-white/[0.03] text-white/60"}>{completedToday}/{appState.dailyActions.length} 已完成</Badge>
              </div>

              <div className="mt-5 space-y-3">
                {appState.dailyActions.map((task) => (
                  <button key={task.id} onClick={() => toggleAction(task.id)} className={cn("flex w-full items-start gap-3 rounded-[24px] border px-4 py-4 text-left transition", isLight ? task.status === "done" ? "border-slate-200/90 bg-slate-900/[0.03]" : "border-slate-200/80 bg-white/82 hover:bg-white/95" : task.status === "done" ? "border-white/10 bg-white/[0.08]" : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]")}>
                    <span className={cn("mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs", isLight ? task.status === "done" ? "border-slate-300 bg-slate-900 text-white" : "border-slate-300 bg-transparent text-slate-500" : task.status === "done" ? "border-white/20 bg-white/90 text-black" : "border-white/18 bg-transparent text-white/50")}>{task.status === "done" ? "✓" : ""}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className={cn("truncate text-sm font-semibold", isLight ? "text-slate-900" : "text-white")}>{task.title}</div>
                        <span className={cn("text-xs", isLight ? "text-slate-400" : "text-white/36")}>{task.scheduledAt}</span>
                      </div>
                      <div className={cn("mt-1 flex flex-wrap items-center gap-2 text-xs", isLight ? "text-slate-500" : "text-white/42")}>
                        <span style={{ color: domainColor[task.domain] }}>{task.domain}</span>
                        <span>{task.priority}</span>
                        <span>{task.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="快速添加今天的任务" className={cn("min-w-0 flex-1 rounded-full border px-4 py-3 text-sm outline-none transition", isLight ? "border-slate-200/90 bg-white/86 text-slate-900 placeholder:text-slate-400 focus:border-slate-300" : "border-white/8 bg-white/[0.04] text-white placeholder:text-white/28 focus:border-white/16")} />
                <Button
                  onClick={addTask}
                  className={
                    isLight
                      ? "border-slate-200/90 bg-slate-950 text-white hover:bg-slate-800"
                      : undefined
                  }
                >
                  <Plus className="mr-1 size-4" />添加
                </Button>
              </div>
            </div>
          </Card>

          <Card className={cn("xl:col-span-4", themeCard(isLight))}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>倒数日</div>
                  <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>阶段提醒</div>
                </div>
                <CalendarClock className="size-5 text-[#ffb454]" />
              </div>
              <div className="mt-5 space-y-3">
                {appState.countdowns.map((item) => (
                  <div key={item.id} className={cn("rounded-[24px] p-4", subCard(isLight))}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={cn("text-sm font-semibold", isLight ? "text-slate-950" : "text-white")}>{item.title}</div>
                        <div className={cn("mt-1 text-xs", isLight ? "text-slate-500" : "text-white/40")}>{item.tone === "focus" ? "当前阶段重点" : item.tone === "urgent" ? "重要提醒" : "常规节奏"}</div>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-3xl font-semibold", isLight ? "text-slate-950" : "text-white")}>{item.daysLeft}</div>
                        <div className={cn("text-xs", isLight ? "text-slate-500" : "text-white/40")}>天</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className={cn("xl:col-span-4", themeCard(isLight))}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>AI 洞察</div>
                  <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>{appState.aiInsights[activeInsight].title}</div>
                </div>
                <Sparkles className="size-5 text-[#47d4ff]" />
              </div>
              <p className={cn("mt-4 text-sm leading-7", isLight ? "text-slate-600" : "text-white/54")}>{appState.aiInsights[activeInsight].summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => runInsight("statusSummary")} className={isLight ? "border-slate-200/90 bg-white/80 text-slate-700 hover:bg-white" : undefined}>帮我聚焦</Button>
                <Button variant="secondary" onClick={() => runInsight("reviewDay")} className={isLight ? "border-slate-200/90 bg-white/80 text-slate-700 hover:bg-white" : undefined}>复盘今天</Button>
                <Button variant="secondary" onClick={() => runInsight("weeklySummary")} className={isLight ? "border-slate-200/90 bg-white/80 text-slate-700 hover:bg-white" : undefined}>周总结</Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 xl:col-span-4">
            {appState.metricCards.map((card) => (
              <Card key={card.id} className={cn("p-5", themeCard(isLight))}>
                <div className={cn("text-xs uppercase tracking-[0.18em]", isLight ? "text-slate-500" : "text-white/36")}>{card.title}</div>
                <div className={cn("mt-3 text-4xl font-semibold tracking-[-0.05em]", isLight ? "text-slate-950" : "text-white")}>{card.value}</div>
                <div className={cn("mt-2 text-sm", isLight ? "text-slate-500" : "text-white/44")}>{card.caption}</div>
                <MetricSparkBars data={card.series} accent={card.accent} isLight={isLight} />
              </Card>
            ))}
          </div>

          <Card className={cn("xl:col-span-8", themeCard(isLight))}>
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>成长日历</div>
                    <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>三月</div>
                  </div>
                  <Badge className={isLight ? "border-slate-200/80 bg-slate-900/[0.03] text-slate-600" : "border-white/10 bg-white/[0.03] text-white/60"}>苹果日历式摘要</Badge>
                </div>
                <div className="mt-5">
                  <CalendarGrid days={appState.calendarDays} selectedDate={selectedDate} onSelect={setSelectedDate} isLight={isLight} />
                </div>
              </div>
              <div className={cn("rounded-[28px] p-5", subCard(isLight))}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>当天详情</div>
                    <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>{selectedDay?.isToday ? "今天" : `${selectedDay?.day ?? ""} 日`}</div>
                  </div>
                  <Badge className={isLight ? "border-slate-200/80 bg-slate-900/[0.03] text-slate-600" : "border-white/10 bg-white/[0.03] text-white/60"}>
                    {selectedDay?.stageTitle ?? "阶段冲刺"}
                  </Badge>
                </div>

                <div className={cn("mt-4 rounded-[24px] p-4", isLight ? "border border-slate-200/80 bg-white/88" : "border border-white/8 bg-white/[0.03]")}>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>当前主目标</div>
                  <div className={cn("mt-2 text-base font-semibold leading-6", isLight ? "text-slate-950" : "text-white")}>{appState.goal.title}</div>
                  <div className={cn("mt-2 text-sm", isLight ? "text-slate-500" : "text-white/44")}>{appState.goal.reason}</div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className={cn("rounded-[22px] p-4", isLight ? "border border-slate-200/80 bg-white/88" : "border border-white/8 bg-white/[0.03]")}>
                    <div className={cn("text-xs uppercase tracking-[0.18em]", isLight ? "text-slate-500" : "text-white/36")}>任务完成</div>
                    <div className={cn("mt-2 text-3xl font-semibold tracking-[-0.05em]", isLight ? "text-slate-950" : "text-white")}>
                      {selectedDay?.completedTasks ?? 0}/{selectedDay?.totalTasks ?? 0}
                    </div>
                    <div className={cn("mt-2 text-sm", isLight ? "text-slate-500" : "text-white/42")}>今天已经做了多少，和计划差多少，一眼看清。</div>
                  </div>

                  <div className={cn("rounded-[22px] p-4", isLight ? "border border-slate-200/80 bg-white/88" : "border border-white/8 bg-white/[0.03]")}>
                    <div className={cn("text-xs uppercase tracking-[0.18em]", isLight ? "text-slate-500" : "text-white/36")}>主线偏向</div>
                    <div className="mt-2 text-3xl font-semibold tracking-[-0.05em]" style={{ color: selectedDay ? domainColor[selectedDay.dominantLine] : "#47d4ff" }}>
                      {selectedDay?.dominantLine ?? "事业"}
                    </div>
                    <div className={cn("mt-2 text-sm", isLight ? "text-slate-500" : "text-white/42")}>当前这一天主要推进哪一条线。</div>
                  </div>
                </div>

                <div className={cn("mt-4 rounded-[24px] p-4", isLight ? "border border-slate-200/80 bg-white/88" : "border border-white/8 bg-white/[0.03]")}>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>任务拆解</div>
                  <div className="mt-3 space-y-2">
                    {selectedDay?.taskBlocks.map((block) => (
                      <div key={`${selectedDay.isoDate}-${block.label}`} className="flex items-center justify-between gap-3 rounded-[18px] px-3 py-2">
                        <div className={cn("text-sm font-medium", isLight ? "text-slate-900" : "text-white")}>{block.label}</div>
                        <div className={cn("text-sm font-semibold", isLight ? "text-slate-500" : "text-white/54")}>{block.minutes} 分钟</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn("mt-4 rounded-[24px] p-4", isLight ? "border border-slate-200/80 bg-white/88" : "border border-white/8 bg-white/[0.03]")}>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>当天输出</div>
                  <div className={cn("mt-2 text-sm leading-6", isLight ? "text-slate-700" : "text-white/68")}>{selectedDay?.outputSummary ?? "暂无当日输出"}</div>
                  <div className={cn("mt-4 text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>晚间复盘</div>
                  <div className={cn("mt-2 text-sm leading-6", isLight ? "text-slate-700" : "text-white/68")}>{selectedDay?.reviewSummary ?? "暂无晚间复盘"}</div>
                  <div className={cn("mt-4 text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>明日第一步</div>
                  <div className={cn("mt-2 text-sm leading-6", isLight ? "text-slate-700" : "text-white/68")}>{selectedDay?.nextStep ?? "暂无下一步"}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className={cn("xl:col-span-4", themeCard(isLight))}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>热力图</div>
                  <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>持续性</div>
                </div>
                <Badge className={isLight ? "border-slate-200/80 bg-slate-900/[0.03] text-slate-600" : "border-white/10 bg-white/[0.03] text-white/60"}>最近 12 周</Badge>
              </div>
              <div className="mt-5"><HeatmapGrid cells={appState.heatmap} isLight={isLight} /></div>
            </div>
          </Card>

          <Card className={cn("xl:col-span-6", themeCard(isLight))}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>趋势</div>
                  <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>最近 7 天推进与能量</div>
                </div>
                <ChevronRight className={cn("size-5", isLight ? "text-slate-400" : "text-white/32")} />
              </div>
              <TrendChart data={appState.trendPoints} isLight={isLight} />
            </div>
          </Card>

          <Card className={cn("xl:col-span-6", themeCard(isLight))}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-white/36")}>分布</div>
                  <div className={cn("mt-2 text-2xl font-semibold", isLight ? "text-slate-950" : "text-white")}>本周三线任务投入</div>
                </div>
                <ChevronRight className={cn("size-5", isLight ? "text-slate-400" : "text-white/32")} />
              </div>
              <WeeklyBarChart data={appState.weeklyBars} isLight={isLight} />
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
