import "dotenv/config";
import { createQueue } from "../lib/queue";
import prisma from "@/lib/prisma";
import { EvalStatus, Evaluation } from "@/generated/prisma";
export const imageGraderQueueWorker = createQueue<{ imagePath: string }>(
  "image-grader",
  true
);

imageGraderQueueWorker.process(5, async (job) => {
  console.log(`⚙️ Processing image grader job`);
  const { imagePath } = job.data;
  let evaluation: Evaluation | null = null;
  try {
    const image = await prisma.image.findFirst({
      where: {
        imagePath: { equals: imagePath.toString() },
      },
    });

    if (!image) {
      throw new Error("Image not found");
    }

    evaluation = await prisma.evaluation.create({
      data: {
        imageId: image.id,
        status: EvalStatus.pending,
        evaluator: "gpt-4o-mini",
      },
    });

    if (!evaluation) {
      throw new Error("Evaluation record not found");
    }

    await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: {
        status: EvalStatus.processing,
      },
    });

    await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: { status: EvalStatus.completed },
    });
  } catch (err) {
    await prisma.evaluation.update({
      where: { id: evaluation?.id },
      data: { status: EvalStatus.failed },
    });
    throw err;
  }
});

console.log("🚀 Image grader worker started and listening for jobs...");

process.on("SIGTERM", () => {
  console.log("📴 Image grader worker shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📴 Detailed description worker shutting down gracefully...");
  process.exit(0);
});

imageGraderQueueWorker.on("error", (err) => {
  console.error("Redis error – exiting", err);
  process.exit(1);
});
