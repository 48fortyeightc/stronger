import OpenAI from "openai";
import type {
  AIInsight,
  PlanTodayInput,
  ReviewDayInput,
  StatusSummaryInput,
  WeeklySummaryInput,
} from "@/lib/types";
import {
  planFallback,
  reviewFallback,
  statusFallback,
  weeklyFallback,
} from "@/lib/ai/fallbacks";

type InsightInput =
  | StatusSummaryInput
  | PlanTodayInput
  | ReviewDayInput
  | WeeklySummaryInput;

type InsightTask = "statusSummary" | "planToday" | "reviewDay" | "weeklySummary";

const provider = process.env.AI_PROVIDER ?? "qwen";
const model = process.env.QWEN_MODEL ?? "qwen-plus";
const baseURL =
  process.env.QWEN_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1";

function getClient() {
  if (provider !== "qwen" || !process.env.QWEN_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.QWEN_API_KEY,
    baseURL,
  });
}

function buildPrompt(task: InsightTask, input: InsightInput) {
  const taskLabel = {
    statusSummary: "状态总结",
    planToday: "安排今天",
    reviewDay: "复盘今天",
    weeklySummary: "周总结",
  }[task];

  return `你是 stronger 的 AI 成长教练。请根据输入，为用户生成一份简洁、具体、可执行的${taskLabel}。

输出必须是 JSON 对象，格式如下：
{
  "title": "不超过18字",
  "summary": "1-2句中文总结",
  "actions": ["建议1", "建议2", "建议3"],
  "warnings": ["提醒1", "提醒2"]
}

规则：
1. 只输出 JSON，不要包含 markdown。
2. 必须使用简体中文。
3. actions 最多 3 条，warnings 最多 2 条。
4. 不要空泛鼓励，要围绕目标、任务和数据给建议。

输入：
${JSON.stringify(input, null, 2)}`;
}

function safeParseInsight(raw: string) {
  const trimmed = raw.trim().replace(/^```json/, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(trimmed) as AIInsight;

  return {
    title: parsed.title,
    summary: parsed.summary,
    actions: Array.isArray(parsed.actions) ? parsed.actions.slice(0, 3) : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.slice(0, 2) : [],
  };
}

function getFallback(task: InsightTask, input: InsightInput): AIInsight {
  switch (task) {
    case "statusSummary":
      return statusFallback(input as StatusSummaryInput);
    case "planToday":
      return planFallback(input as PlanTodayInput);
    case "reviewDay":
      return reviewFallback(input as ReviewDayInput);
    case "weeklySummary":
      return weeklyFallback(input as WeeklySummaryInput);
  }
}

export async function generateInsight(task: InsightTask, input: InsightInput) {
  const fallback = getFallback(task, input);
  const client = getClient();

  if (!client) {
    return fallback;
  }

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "你是一位克制、清晰、重视行动的成长教练。",
        },
        {
          role: "user",
          content: buildPrompt(task, input),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      return fallback;
    }

    return safeParseInsight(raw);
  } catch {
    return fallback;
  }
}
