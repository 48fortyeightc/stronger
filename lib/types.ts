export type LifeLineName = "生命" | "爱" | "事业";

export type LifeLineStage = "修复" | "建立" | "推进" | "维持";

export type TrendDirection = "up" | "steady" | "down";

export type ActionPriority = "关键" | "重要" | "维持";

export type ActionStatus = "pending" | "done";

export type InsightKind =
  | "statusSummary"
  | "planToday"
  | "reviewDay"
  | "weeklySummary";

export interface LifeLineState {
  name: LifeLineName;
  score: number;
  stage: LifeLineStage;
  trend: TrendDirection;
  weeklyDone: number;
  weeklyTarget: number;
  accent: string;
}

export interface Goal {
  title: string;
  domain: LifeLineName;
  reason: string;
  daysTotal: number;
  daysElapsed: number;
  progress: number;
  yearTheme: string;
  phaseLabel: string;
  weekLabel: string;
  countdownDays: number;
}

export interface DailyAction {
  id: string;
  title: string;
  duration: string;
  priority: ActionPriority;
  status: ActionStatus;
  domain: LifeLineName;
  note: string;
  scheduledAt: string;
}

export interface DailyLogDraft {
  doneText: string;
  duration: number;
  mood: "低迷" | "平稳" | "专注" | "有力量";
  blocker: string;
  progressFeeling: number;
}

export interface AIInsight {
  title: string;
  summary: string;
  actions: string[];
  warnings: string[];
}

export interface TrendPoint {
  label: string;
  progress: number;
  energy: number;
}

export interface WeeklyBarPoint {
  label: string;
  生命: number;
  爱: number;
  事业: number;
}

export interface WeeklySnapshot {
  completedDays: number;
  streakDays: number;
  progressRate: number;
  strongestMove: string;
  biggestBlocker: string;
  totalTasks: number;
  doneTasks: number;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  caption: string;
  accent: string;
  series: number[];
}

export interface CountdownEvent {
  id: string;
  title: string;
  daysLeft: number;
  tone: "urgent" | "focus" | "steady";
}

export interface CalendarTaskBlock {
  label: string;
  minutes: number;
}

export interface CalendarDay {
  isoDate: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  completedTasks: number;
  totalTasks: number;
  dominantLine: LifeLineName;
  reviewed: boolean;
  stageTitle: string;
  focusTitle: string;
  taskBlocks: CalendarTaskBlock[];
  outputSummary: string;
  reviewSummary: string;
  nextStep: string;
}

export interface HeatmapCell {
  id: string;
  value: number;
}

export interface AppState {
  lifeLines: LifeLineState[];
  goal: Goal;
  dailyActions: DailyAction[];
  dailyLog: DailyLogDraft;
  weeklySnapshot: WeeklySnapshot;
  trendPoints: TrendPoint[];
  weeklyBars: WeeklyBarPoint[];
  metricCards: MetricCard[];
  countdowns: CountdownEvent[];
  calendarDays: CalendarDay[];
  heatmap: HeatmapCell[];
  aiInsights: Record<InsightKind, AIInsight>;
}

export interface StatusSummaryInput {
  lifeLines: LifeLineState[];
  goalTitle: string;
  blocker: string;
}

export interface PlanTodayInput {
  lifeLines: LifeLineState[];
  goal: Goal;
  blocker: string;
}

export interface ReviewDayInput {
  goal: Goal;
  dailyActions: DailyAction[];
  dailyLog: DailyLogDraft;
}

export interface WeeklySummaryInput {
  goal: Goal;
  lifeLines: LifeLineState[];
  weeklySnapshot: WeeklySnapshot;
}
