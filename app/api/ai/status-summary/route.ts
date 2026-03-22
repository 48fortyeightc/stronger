import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/ai/provider";
import type { StatusSummaryInput } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as StatusSummaryInput;
  const data = await generateInsight("statusSummary", payload);

  return NextResponse.json(data);
}
