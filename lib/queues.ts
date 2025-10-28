import { createQueue } from "./queue";

export const imageGraderQueue = createQueue<{ imageId: string }>(
  "image-grader"
);
