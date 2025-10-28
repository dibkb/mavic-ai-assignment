import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import sizeAgent from "../agents/size-agent";
import { SizeOutputSchema } from "../../lib/types/workflow/size";
import openai from "../providers/open-ai";
import { cacheLLM } from "@/lib/llm-cache";

const sizeWorkflow = createStep({
  id: "size-workflow",
  description: "Evaluates the size accuracy of a generated image",
  inputSchema: z.object({
    originalPrompt: z.string(),
    imageUrl: z.url(),
    channel: z.string().optional(),
  }),
  outputSchema: SizeOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Trigger data not found");
    }
    const { originalPrompt, imageUrl, channel } = inputData;

    const response = await cacheLLM("size", { imageUrl, channel }, () =>
      sizeAgent.generate(
        [
          {
            role: "user",
            content: `Original prompt: ${originalPrompt}\nImage URL: ${imageUrl}\nChannel: ${channel}`,
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
      )
    );
    return response.object;
  },
});

export default sizeWorkflow;
