import { NextResponse } from "next/server";
import { imageGraderQueue } from "@/lib/queues";

export async function GET() {
  const job = await imageGraderQueue
    .createJob({
      imagePath:
        "https://github.com/mavic-ai/mavic-test-repo/raw/main/sample_images/ChatGPT%20Image%20Jul%2019,%202025,%2011_43_02%20AM.png?raw=true",
    })
    .save();
  return NextResponse.json({ jobId: job.id });
}
