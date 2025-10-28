import { NextResponse } from "next/server";
import { imageGraderQueue } from "@/lib/queues";

export async function GET() {
  const job = await imageGraderQueue
    .createJob({ imageId: "69008992db8d329af69c1547" })
    .save();
  return NextResponse.json({ jobId: job.id });
}
