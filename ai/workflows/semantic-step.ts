import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import semanticsAgent from "../agents/semantics-agent";
import openai from "../providers/open-ai";

const semanticWorkflow = createStep({
  id: "semantic-workflow",
  description: "Evaluates the semantic accuracy of a generated image",
  inputSchema: z.object({
    originalPrompt: z.string(),
    imageUrl: z.url(),
    channel: z.string().optional(),
  }),
  outputSchema: z.object({
    score: z.number(),
    matchedKeywords: z.array(z.string()),
    similarity: z.number(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Trigger data not found");
    }
    const { originalPrompt, imageUrl } = inputData;

    const response = await semanticsAgent.generate(
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
            matchedKeywords: z.array(z.string()),
            similarity: z.number(),
          }),
          model: openai("gpt-4.1-nano"),
        },
      }
    );
    return response.object;
  },
});

export default semanticWorkflow;
