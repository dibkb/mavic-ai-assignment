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

    If no explicit dimensions are provided, you may be given a \"channel\" (e.g., TikTok, Instagram Post, Instagram Story, Facebook Cover). Infer the expected size or aspect ratio for that platform and judge accordingly. Some common references:
      • TikTok/Reel/Short: 1080×1920 (9:16)
      • Instagram Post: 1080×1080 (1:1)
      • Instagram Story: 1080×1920 (9:16)
      • Facebook Cover: 820×312 (approx 2.63:1)

    Scoring guidance:
    - 100 if exact match (or perfect match to expected platform size/aspect).
    - Otherwise, choose a lower score proportional to how different the dimensions or aspect ratio are.
    - If the image is not a valid image, return a score of 0.
  `,
  model: openai("gpt-4o-mini"),
  tools: { imageMetadataTool },
});

export default sizeAgent;
