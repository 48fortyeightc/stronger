import type {
  AIInsight,
  CalendarDay,
  CalendarTaskBlock,
  CountdownEvent,
  DailyAction,
  DailyLogDraft,
  Goal,
  HeatmapCell,
  InsightKind,
  LifeLineName,
  LifeLineState,
  MetricCard,
  TrendPoint,
  WeeklyBarPoint,
  WeeklySnapshot,
} from "@/lib/types";

function makeCalendarDays() {
  const year = 2026;
  const monthIndex = 2;
  const today = 18;
  const first = new Date(year, monthIndex, 1);
  const firstWeekday = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const prevDays = new Date(year, monthIndex, 0).getDate();
  const days: CalendarDay[] = [];
  const calendarPlans: Array<{
    dominantLine: string;
    totalTasks: number;
    completedTasks: number;
    focusTitle: string;
    taskBlocks: CalendarTaskBlock[];
    outputSummary: string;
    reviewSummary: string;
    nextStep: string;
  }> = [
    {
      dominantLine: "浜嬩笟",
      totalTasks: 6,
      completedTasks: 4,
      focusTitle: "行测：判断推理 + 资料分析",
      taskBlocks: [
        { label: "行测判断推理", minutes: 90 },
        { label: "六级阅读", minutes: 45 },
        { label: "数据分析简历", minutes: 30 },
      ],
      outputSummary: "完成 1 套判断推理，整理 12 道错题，六级阅读 1 篇。",
      reviewSummary: "今天行测推进最稳，英语和保底任务都没有掉线。",
      nextStep: "明天先做资料分析 30 分钟，再进入英语单词。",
    },
    {
      dominantLine: "浜嬩笟",
      totalTasks: 5,
      completedTasks: 3,
      focusTitle: "英语：六级阅读 + 单词",
      taskBlocks: [
        { label: "六级阅读", minutes: 60 },
        { label: "单词复习", minutes: 40 },
        { label: "行测错题", minutes: 30 },
      ],
      outputSummary: "完成 2 篇阅读，单词复习 1 轮，补了少量行测错题。",
      reviewSummary: "英语推进比较稳定，下午容易分神，建议把阅读放在上午。",
      nextStep: "明天先刷听力，再回到行测模块训练。",
    },
    {
      dominantLine: "浜嬩笟",
      totalTasks: 5,
      completedTasks: 4,
      focusTitle: "数据分析保底：SQL + 简历投递",
      taskBlocks: [
        { label: "SQL 练习", minutes: 60 },
        { label: "Excel / Python", minutes: 50 },
        { label: "岗位投递", minutes: 20 },
      ],
      outputSummary: "补完 SQL 练习 1 组，更新简历 1 版，投递 2 个岗位。",
      reviewSummary: "保底方向推进不错，简历和项目材料需要更快成型。",
      nextStep: "明天把一个项目经历写成可投递的版本。",
    },
    {
      dominantLine: "浜嬩笟",
      totalTasks: 6,
      completedTasks: 3,
      focusTitle: "行测：套题训练 + 订正",
      taskBlocks: [
        { label: "行测模考", minutes: 100 },
        { label: "错题订正", minutes: 40 },
        { label: "六级背词", minutes: 30 },
      ],
      outputSummary: "做了 1 套行测题，订正了 15 道错题，背词 1 轮。",
      reviewSummary: "模考时间不够稳，后面需要固定题量和节奏。",
      nextStep: "明天先做资料分析专项，再补一篇六级作文。",
    },
    {
      dominantLine: "鐢熷懡",
      totalTasks: 4,
      completedTasks: 3,
      focusTitle: "恢复日：运动 + 睡眠 + 轻量学习",
      taskBlocks: [
        { label: "跑步 / 拉伸", minutes: 30 },
        { label: "六级听力", minutes: 30 },
        { label: "行测轻复习", minutes: 20 },
      ],
      outputSummary: "完成运动和轻量学习，身体状态比前两天更稳。",
      reviewSummary: "今天适合恢复，别把计划塞得太满，保持节奏更重要。",
      nextStep: "明天恢复到正常强度，先行测后英语。",
    },
    {
      dominantLine: "浜嬩笟",
      totalTasks: 5,
      completedTasks: 4,
      focusTitle: "数据分析：作品集 + 面试准备",
      taskBlocks: [
        { label: "项目整理", minutes: 60 },
        { label: "面试问答", minutes: 30 },
        { label: "岗位投递", minutes: 20 },
      ],
      outputSummary: "整理了 1 个项目案例，准备了 5 个面试问答。",
      reviewSummary: "保底方向继续推进，材料整理开始有成效。",
      nextStep: "明天先补项目说明，再投递 2 个岗位。",
    },
    {
      dominantLine: "鐢熷懡",
      totalTasks: 4,
      completedTasks: 2,
      focusTitle: "周复盘：整理进度 + 恢复节奏",
      taskBlocks: [
        { label: "周复盘", minutes: 30 },
        { label: "下周计划", minutes: 30 },
        { label: "休息恢复", minutes: 40 },
      ],
      outputSummary: "把本周的行测、英语、实习任务都做了归档。",
      reviewSummary: "周末先收口，不要再临时加任务，给下周留出空间。",
      nextStep: "明天先确认下周的 3 个主任务，再开始新一轮执行。",
    },
  ];
  const dominantLines: LifeLineName[] = ["生命", "事业", "事业", "爱", "生命", "事业", "爱"];

  for (let i = 0; i < 42; i += 1) {
    const gridDay = i - firstWeekday + 1;
    const inCurrentMonth = gridDay > 0 && gridDay <= daysInMonth;
    const day = inCurrentMonth
      ? gridDay
      : gridDay <= 0
        ? prevDays + gridDay
        : gridDay - daysInMonth;
    const plan = calendarPlans[(day - 1) % calendarPlans.length];
    const completedTasks = inCurrentMonth ? plan.completedTasks : 0;
    const totalTasks = inCurrentMonth ? plan.totalTasks : 0;

    days.push({
      isoDate: `${year}-03-${String(inCurrentMonth ? day : 1).padStart(2, "0")}`,
      day,
      inCurrentMonth,
      isToday: inCurrentMonth && day === today,
      completedTasks,
      totalTasks,
      dominantLine: (inCurrentMonth ? plan.dominantLine : dominantLines[i % dominantLines.length]) as LifeLineName,
      reviewed: inCurrentMonth ? day % 2 === 0 : false,
      stageTitle: "大三下学期 · 毕业冲刺期",
      focusTitle: inCurrentMonth ? plan.focusTitle : "阶段整理",
      taskBlocks: inCurrentMonth ? plan.taskBlocks : [],
      outputSummary: inCurrentMonth ? plan.outputSummary : "暂无当日记录",
      reviewSummary: inCurrentMonth ? plan.reviewSummary : "请先选择当前日期，再查看当天复盘。",
      nextStep: inCurrentMonth ? plan.nextStep : "选择一个有效日期后继续。",
    });
  }

  return days;
}

export const defaultLifeLines: LifeLineState[] = [
  {
    name: "生命",
    score: 74,
    stage: "建立",
    trend: "up",
    weeklyDone: 5,
    weeklyTarget: 7,
    accent: "#95f036",
  },
  {
    name: "爱",
    score: 61,
    stage: "维持",
    trend: "steady",
    weeklyDone: 2,
    weeklyTarget: 3,
    accent: "#ff5f93",
  },
  {
    name: "事业",
    score: 83,
    stage: "推进",
    trend: "up",
    weeklyDone: 8,
    weeklyTarget: 10,
    accent: "#47d4ff",
  },
];

export const defaultGoal: Goal = {
  title: "建立稳定执行节奏，让每周都有看得见的推进",
  domain: "事业",
  reason: "当前阶段不需要更多目标，需要更稳定的节奏和更强的推进感。",
  daysTotal: 30,
  daysElapsed: 8,
  progress: 42,
  yearTheme: "变得更稳定、更强",
  phaseLabel: "Q1 重建执行系统",
  weekLabel: "第 11 周",
  countdownDays: 22,
};

export const defaultDailyActions: DailyAction[] = [
  {
    id: "task-1",
    title: "45 分钟深度推进当前目标",
    duration: "45 分钟",
    priority: "关键",
    status: "done",
    domain: "事业",
    note: "只做最重要的一步，不切任务。",
    scheduledAt: "09:00",
  },
  {
    id: "task-2",
    title: "跑步 30 分钟",
    duration: "30 分钟",
    priority: "重要",
    status: "pending",
    domain: "生命",
    note: "今天优先恢复身体状态。",
    scheduledAt: "18:30",
  },
  {
    id: "task-3",
    title: "给重要的人发一条认真消息",
    duration: "10 分钟",
    priority: "维持",
    status: "pending",
    domain: "爱",
    note: "不是形式，是一次真实连接。",
    scheduledAt: "20:30",
  },
  {
    id: "task-4",
    title: "晚间复盘今天的推进质量",
    duration: "12 分钟",
    priority: "重要",
    status: "pending",
    domain: "事业",
    note: "写下卡点和明天第一步。",
    scheduledAt: "22:15",
  },
];

export function createInitialDailyLog(): DailyLogDraft {
  return {
    doneText: "我完成了今天最重要的一步，也没有让杂事打断主线推进。",
    duration: 96,
    mood: "专注",
    blocker: "下午容易分神，看到新想法就想切出去。",
    progressFeeling: 8,
  };
}

export const defaultTrendPoints: TrendPoint[] = [
  { label: "Mon", progress: 46, energy: 60 },
  { label: "Tue", progress: 62, energy: 63 },
  { label: "Wed", progress: 58, energy: 56 },
  { label: "Thu", progress: 71, energy: 68 },
  { label: "Fri", progress: 74, energy: 61 },
  { label: "Sat", progress: 65, energy: 72 },
  { label: "Sun", progress: 82, energy: 76 },
];

export const defaultWeeklyBars: WeeklyBarPoint[] = [
  { label: "周一", 生命: 2, 爱: 0, 事业: 3 },
  { label: "周二", 生命: 1, 爱: 1, 事业: 3 },
  { label: "周三", 生命: 0, 爱: 1, 事业: 4 },
  { label: "周四", 生命: 1, 爱: 0, 事业: 4 },
  { label: "周五", 生命: 1, 爱: 0, 事业: 3 },
  { label: "周六", 生命: 2, 爱: 0, 事业: 1 },
  { label: "周日", 生命: 1, 爱: 1, 事业: 2 },
];

export const defaultWeeklySnapshot: WeeklySnapshot = {
  completedDays: 5,
  streakDays: 4,
  progressRate: 68,
  strongestMove: "把关键任务放在上午，推进率明显更高。",
  biggestBlocker: "下午临时插入的信息会打断主线节奏。",
  totalTasks: 20,
  doneTasks: 13,
};

export const defaultMetricCards: MetricCard[] = [
  {
    id: "focus",
    title: "专注时长",
    value: "96",
    caption: "今天 / 分钟",
    accent: "#47d4ff",
    series: [1, 3, 5, 7, 9, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "streak",
    title: "连续前进",
    value: "4",
    caption: "本周 / 天",
    accent: "#95f036",
    series: [2, 4, 5, 6, 8, 6, 4, 3, 5, 4, 6, 7, 5, 0, 0, 0],
  },
  {
    id: "tasks",
    title: "已完成任务",
    value: "13",
    caption: "本周 / 20 项",
    accent: "#ffb454",
    series: [0, 2, 3, 4, 3, 5, 6, 5, 4, 3, 5, 6, 4, 2, 1, 0],
  },
  {
    id: "review",
    title: "复盘完成",
    value: "5",
    caption: "本周 / 7 次",
    accent: "#ff5f93",
    series: [0, 0, 2, 3, 4, 2, 5, 3, 4, 5, 4, 2, 3, 4, 2, 0],
  },
];

export const defaultCountdowns: CountdownEvent[] = [
  { id: "goal", title: "30 天目标结束", daysLeft: 22, tone: "focus" },
  { id: "review", title: "本周复盘", daysLeft: 3, tone: "steady" },
  { id: "month", title: "本月总结", daysLeft: 14, tone: "urgent" },
];

export const defaultCalendarDays = makeCalendarDays();

export const defaultHeatmap: HeatmapCell[] = Array.from({ length: 84 }, (_, index) => ({
  id: `heat-${index}`,
  value: (index * 7) % 5,
}));

export const defaultAiInsights: Record<InsightKind, AIInsight> = {
  statusSummary: {
    title: "这周的重点不是更忙，而是更稳",
    summary:
      "事业线推进最强，生命线正在回升，爱这条线需要更主动地安排任务，不要只靠临时想起。",
    actions: ["继续保留上午的深度推进", "给爱这条线预留明确任务", "晚上用复盘收口，不带着混乱睡觉"],
    warnings: ["不要因为单日状态波动就重设目标", "周中最容易被临时事务打断主线"],
  },
  planToday: {
    title: "今天的关键，不是做满而是推进",
    summary: "只抓住四件事里最重要的两件，先把事业线推进，再补生命线恢复。",
    actions: ["先完成深度工作", "晚上固定复盘", "给生命线留出运动窗口"],
    warnings: ["不要把低价值小任务塞进今天的前半段"],
  },
  reviewDay: {
    title: "今天是有效前进的一天",
    summary: "你完成了核心任务，也留下了记录。最大的风险不在努力不足，而在节奏被临时想法打散。",
    actions: ["明天继续先抓主任务", "把分心入口提前关掉"],
    warnings: ["晚上不要因为疲惫感否定整天的推进"],
  },
  weeklySummary: {
    title: "本周你的节奏开始成型",
    summary:
      "连续前进天数和任务完成率都在提高，说明系统开始发挥作用，接下来要补足生命线和爱线的稳定投入。",
    actions: ["下周继续单目标推进", "生命和爱各补一项固定任务"],
    warnings: ["不要在周末因为补偿心理安排过多任务"],
  },
};
