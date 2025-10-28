import { NextRequest, NextResponse } from "next/server";
import { imageGraderQueue } from "@/lib/queues";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const { imagePath } = (await req.json()) as { imagePath?: string };
    if (!imagePath || typeof imagePath !== "string") {
      return NextResponse.json(
        { error: "imagePath is required" },
        { status: 400 }
      );
    }

    const job = await imageGraderQueue.createJob({ imagePath }).save();
    return NextResponse.json({ jobId: job.id });
  } catch (err) {
    console.error("Failed to enqueue evaluation job", err);
    return NextResponse.json(
      { error: "unable to start evaluation" },
      { status: 500 }
    );
  }
}
