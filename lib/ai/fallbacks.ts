import type {
  AIInsight,
  PlanTodayInput,
  ReviewDayInput,
  StatusSummaryInput,
  WeeklySummaryInput,
} from "@/lib/types";

export function statusFallback(input: StatusSummaryInput): AIInsight {
  const weakest = [...input.lifeLines].sort((a, b) => a.score - b.score)[0];

  return {
    title: "先稳住最弱的一条线",
    summary: `你当前的 30 天目标是“${input.goalTitle}”。从整体状态看，现在最需要补的是${weakest.name}，因为它会直接影响这个目标能否稳定推进。`,
    actions: [
      "把今天的关键动作控制在 1-3 个",
      `先安排一个与${weakest.name}相关的任务`,
      "晚上留出 10 分钟复盘",
    ],
    warnings: [`当前最大阻碍是“${input.blocker}”，不要再增加新目标来分散注意力。`],
  };
}

export function planFallback(input: PlanTodayInput): AIInsight {
  return {
    title: "先推进主目标，再补其他线",
    summary: `围绕“${input.goal.title}”，今天最重要的是先把主线推进完成，再处理次级任务。`,
    actions: [
      `先完成一个直接服务于“${input.goal.title}”的关键任务`,
      "把今日待办压缩到最重要的几项",
      "晚上写一句对明天有帮助的提醒",
    ],
    warnings: [`注意“${input.blocker}”带来的中断，别让它破坏你的节奏。`],
  };
}

export function reviewFallback(input: ReviewDayInput): AIInsight {
  const doneCount = input.dailyActions.filter((item) => item.status === "done").length;

  return {
    title: doneCount > 0 ? "今天是有效前进的一天" : "今天更像准备，而不是推进",
    summary: `你为“${input.goal.title}”投入了 ${input.dailyLog.duration} 分钟，当前状态是“${input.dailyLog.mood}”。判断今天，不要只看情绪，要看是否完成了关键动作。`,
    actions: [
      "保留今天最有效的一步，明天重复它",
      "把卡点写成一句可执行提醒",
    ],
    warnings: [input.dailyLog.blocker || "今天的阻碍没有被明确记录，明天容易重复发生。"],
  };
}

export function weeklyFallback(input: WeeklySummaryInput): AIInsight {
  return {
    title: "本周你在形成自己的系统",
    summary: `你已经连续前进 ${input.weeklySnapshot.streakDays} 天，本周完成了 ${input.weeklySnapshot.doneTasks} / ${input.weeklySnapshot.totalTasks} 项任务。说明节奏正在形成，但还要继续稳住。`,
    actions: [
      "继续保持一个阶段目标，不要频繁切换",
      "把最重要任务固定到更稳定的时间段",
      "保留周复盘，让一周有明确收口",
    ],
    warnings: [input.weeklySnapshot.biggestBlocker],
  };
}
