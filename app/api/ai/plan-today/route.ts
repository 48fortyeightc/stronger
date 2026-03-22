import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/ai/provider";
import type { PlanTodayInput } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as PlanTodayInput;
  const data = await generateInsight("planToday", payload);

  return NextResponse.json(data);
}
