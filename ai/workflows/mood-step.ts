import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import moodAgent from "../agents/mood-agent";
import { MoodOutputSchema } from "../../lib/types/workflow/mood";
import openai from "../providers/open-ai";

const moodWorkflow = createStep({
  id: "mood-workflow",
  description: "Evaluates the mood of a generated image",
  inputSchema: z.object({
    originalPrompt: z.string(),
    imageUrl: z.url(),
    channel: z.string().optional(),
  }),
  outputSchema: MoodOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Trigger data not found");
    }
    const { originalPrompt, imageUrl } = inputData;

    const response = await moodAgent.generate(
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
            moodPrompt: z.array(z.string()),
            moodImage: z.array(z.string()),
            matchScore: z.number(),
          }),
          model: openai("gpt-4.1-nano"),
        },
      }
    );
    return response.object;
  },
});

export default moodWorkflow;
