import { StrongerApp } from "@/components/stronger-app";
import {
  createInitialDailyLog,
  defaultAiInsights,
  defaultCalendarDays,
  defaultCountdowns,
  defaultDailyActions,
  defaultGoal,
  defaultHeatmap,
  defaultLifeLines,
  defaultMetricCards,
  defaultTrendPoints,
  defaultWeeklyBars,
  defaultWeeklySnapshot,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <StrongerApp
      initialState={{
        lifeLines: defaultLifeLines,
        goal: defaultGoal,
        dailyActions: defaultDailyActions,
        dailyLog: createInitialDailyLog(),
        weeklySnapshot: defaultWeeklySnapshot,
        trendPoints: defaultTrendPoints,
        weeklyBars: defaultWeeklyBars,
        metricCards: defaultMetricCards,
        countdowns: defaultCountdowns,
        calendarDays: defaultCalendarDays,
        heatmap: defaultHeatmap,
        aiInsights: defaultAiInsights,
      }}
    />
  );
}
