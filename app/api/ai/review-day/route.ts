import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/ai/provider";
import type { ReviewDayInput } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as ReviewDayInput;
  const data = await generateInsight("reviewDay", payload);

  return NextResponse.json(data);
}
