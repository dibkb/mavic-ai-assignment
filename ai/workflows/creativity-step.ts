import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import creativityAgent from "../agents/creativity-agent";
import { CreativityOutputSchema } from "../../lib/types/workflow/creativity";
import openai from "../providers/open-ai";

const creativityWorkflow = createStep({
  id: "creativity-workflow",
  description: "Evaluates the creativity of a generated image",
  inputSchema: z.object({
    originalPrompt: z.string(),
    imageUrl: z.url(),
    channel: z.string().optional(),
  }),
  outputSchema: CreativityOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Trigger data not found");
    }
    const { originalPrompt, imageUrl } = inputData;

    const response = await creativityAgent.generate(
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
            factors: z.object({
              colorVariance: z.number(),
              entropy: z.number(),
              promptTokenVariety: z.number(),
            }),
          }),
          model: openai("gpt-4.1-nano"),
        },
      }
    );
    return response.object;
  },
});

export default creativityWorkflow;
