import { NextRequest, NextResponse } from "next/server";
import { imageGraderQueue } from "@/lib/queues";
import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { EvalStatus } from "@/generated/prisma";
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
    // find image
    const image = await prisma.image.findFirst({
      where: { imagePath: { equals: imagePath } },
    });
    if (!image) {
      return NextResponse.json({ error: "image not found" }, { status: 404 });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        imageId: image.id,
        status: EvalStatus.pending,
        evaluator: "gpt-4o-mini",
      },
    });

    const job = await imageGraderQueue
      .createJob<{ imagePath: string; evaluationId: string }>({
        imagePath,
        evaluationId: evaluation.id,
      })
      .save();
    return NextResponse.json({ jobId: job.id, evaluationId: evaluation.id });
  } catch (err) {
    console.error("Failed to enqueue evaluation job", err);
    return NextResponse.json(
      { error: "unable to start evaluation" },
      { status: 500 }
    );
  }
}
