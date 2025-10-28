import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import sizeAgent from "../agents/size-agent";
import openai from "../providers/open-ai";

const sizeWorkflow = createStep({
  id: "size-workflow",
  description: "Evaluates the size accuracy of a generated image",
  inputSchema: z.object({
    originalPrompt: z.string(),
    imageUrl: z.url(),
  }),
  outputSchema: z.object({
    score: z.number(),
    matches: z.boolean(),
    details: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Trigger data not found");
    }
    const { originalPrompt, imageUrl } = inputData;

    const response = await sizeAgent.generate(
      [
        {
          role: "user",
          content: `Original prompt: ${originalPrompt}\nImage URL: ${imageUrl}`,
        },
      ],
      {
        structuredOutput: {
          schema: z.object({
            score: z.number(),
            matches: z.boolean(),
            details: z.string(),
          }),
          model: openai("gpt-4.1-nano"),
        },
      }
    );
    return response.object;
  },
});

export default sizeWorkflow;
