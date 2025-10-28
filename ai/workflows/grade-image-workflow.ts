import z from "zod";
import { createWorkflow } from "@mastra/core/workflows";
import sizeWorkflow from "./size-step";
import moodWorkflow from "./mood-step";
import semanticsWorkflow from "./semantic-step";
import creativityWorkflow from "./creativity-step";
import aggregatorStep from "./aggregator-step";

export const gradeImageWorkflow = createWorkflow({
  id: "grade-image-workflow",
  inputSchema: z.object({
    originalPrompt: z.string(),
    imageUrl: z.url(),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
})
  .parallel([sizeWorkflow, moodWorkflow, semanticsWorkflow, creativityWorkflow])
  .then(aggregatorStep)
  .commit();
