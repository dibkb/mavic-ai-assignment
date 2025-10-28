import { createQueue } from "../lib/queue";
import prisma from "@/lib/prisma";

export const imageGraderQueueWorker = createQueue<{ imageId: string }>(
  "image-grader",
  true
);

imageGraderQueueWorker.process(5, async (job) => {
  console.log(`⚙️ Processing image grader job`);
  const imageId = job.data.imageId;
  try {
    const image = await prisma.image.findUnique({
      where: {
        id: imageId,
      },
    });
    if (!image) {
      throw new Error("Image not found");
    }
  } catch (err) {
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
