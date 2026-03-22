import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/ai/provider";
import type { WeeklySummaryInput } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as WeeklySummaryInput;
  const data = await generateInsight("weeklySummary", payload);

  return NextResponse.json(data);
}
