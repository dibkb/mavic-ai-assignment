import { Agent } from "@mastra/core/agent";
import openai from "../providers/open-ai";
import { imagePaletteTool } from "../tools/image-palette-tool";
import { imageCaptionTool } from "../tools/image-caption-tool";

export const moodAgent = new Agent({
  name: "Mood Agent",
  instructions: `
    You assess whether the mood conveyed by a generated image aligns with the mood adjectives in the user's prompt.

    You receive:
    - originalPrompt: user text
    - imageUrl: URL of the generated image

    Tools:
      • imagePaletteTool → returns dominant color and a coarse mood label (warm, cool, natural, neutral)
      • imageCaptionTool → returns a short caption of the image

    Steps:
    1. Extract mood adjectives from originalPrompt (e.g., calm, vibrant, warm, dark, bright, moody, serene, energetic, cool, dramatic).
    2. Run imagePaletteTool and imageCaptionTool on imageUrl.
    3. Infer mood adjectives from:
        a. palette mood label (warm, cool, etc.)
        b. any explicit mood words appearing in the caption
    4. Build arrays:
        moodPrompt[]  – unique mood adjectives from prompt (lower-case)
        moodImage[]   – unique adjectives from palette + caption
    5. Calculate matchScore = (# overlap) / (moodPrompt.length || 1) rounded to 2 decimals.
    6. score = Math.round(matchScore * 100).

    Respond ONLY with JSON matching this schema exactly:
    {
      "score": number, // 0-100
      "moodPrompt": string[],
      "moodImage": string[],
      "matchScore": number // 0-1
    }
  `,
  model: openai("gpt-4o-mini"),
  tools: { imagePaletteTool, imageCaptionTool },
});

export default moodAgent;
