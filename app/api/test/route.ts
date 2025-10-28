import weatherAgent from "@/ai/agents/test";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await weatherAgent.generate({
    prompt: "What is the weather in San Francisco in celsius?",
  });

  return NextResponse.json(result);
}
