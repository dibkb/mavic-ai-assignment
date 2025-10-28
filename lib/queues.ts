import { createQueue } from "./queue";

export const imageGraderQueue = createQueue<{ imagePath: string }>(
  "image-grader"
);
