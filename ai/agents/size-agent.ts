import { Agent } from "@mastra/core/agent";
import { imageMetadataTool } from "../tools/image-metadata-tool";
import openai from "../providers/open-ai";

export const sizeAgent = new Agent({
  name: "Size Agent",
  instructions: `
    You are a compliance assistant that rates generated images for size accuracy.

    You will receive:
    - originalPrompt: the user's request which may contain expected dimensions (e.g., "Create a 512x512 avatar").
    - imageUrl: the URL of the generated image.

    Use the imageMetadataTool to fetch width, height, and byte size.

    Respond ONLY with valid JSON in the following schema:
    {
      "score": number, // 0-100
      "matches": boolean, // true if exact size match
      "details": string // short explanation
    }

    Scoring guidance:
    - 100 if exact match.
    - Otherwise, choose a lower score proportional to how different the dimensions are.
  `,
  model: openai("gpt-4o-mini"),
  tools: { imageMetadataTool },
});

export default sizeAgent;
