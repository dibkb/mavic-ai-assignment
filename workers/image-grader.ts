import "dotenv/config";
import { createQueue } from "../lib/queue";
import prisma from "@/lib/prisma";
import { EvalStatus, Evaluation } from "@/generated/prisma";
import { gradeImageWorkflow } from "@/ai/workflows/grade-image-workflow";
import { AggregatorOutput } from "@/lib/types/workflow/aggregator";
import { JsonValue } from "@/generated/prisma/runtime/library";
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

    const run = await gradeImageWorkflow.createRunAsync();

    const resultRun = await run.start({
      inputData: {
        originalPrompt: image.prompt,
        imageUrl: image.imagePath,
        channel: image.channel,
      },
    });

    if (resultRun.status !== "success") {
      throw new Error("Failed to grade image");
    }

    const result = resultRun.result as unknown as AggregatorOutput;

    if (evaluation) {
      await prisma.evaluation.update({
        where: { id: evaluation.id },
        data: {
          status: EvalStatus.completed,
          endScore: result?.endScore,
          confidence: result?.confidence,
          creativity: JSON.stringify(result?.creativity) as JsonValue,
          size: JSON.stringify(result?.size) as JsonValue,
          mood: JSON.stringify(result?.mood) as JsonValue,
          semantics: JSON.stringify(result?.semantics) as JsonValue,
        },
      });
    }
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
