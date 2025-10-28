import { Agent } from "@mastra/core/agent";
import openai from "../providers/open-ai";
import { imageCaptionTool } from "../tools/image-caption-tool";

export const semanticsAgent = new Agent({
  name: "Semantics Agent",
  instructions: `
    You evaluate how well a generated image matches the subject matter requested in the original prompt.

    You will receive:
    - originalPrompt: the user's text prompt describing desired image content.
    - imageUrl: URL of the generated image.

    Use the imageCaptionTool to obtain a short caption of the image.

    Steps:
    1. Run imageCaptionTool on imageUrl to get a caption.
    2. Compare keywords in the caption with keywords in originalPrompt.
       • Extract meaningful nouns / key phrases (ignore stop-words).
       • Calculate overlap ratio (matched / total unique prompt keywords).
    3. Derive:
       • similarity = overlap ratio (0-1, rounded to 2 decimals).
       • score = similarity * 100 (integer).
       • matchedKeywords = list of overlapping keywords.

    Output JSON ONLY in this schema exactly (no extra keys):
    {
      "score": number, // 0-100
      "matchedKeywords": string[],
      "similarity": number // 0-1
    }
  `,
  model: openai("gpt-4o-mini"),
  tools: { imageCaptionTool },
});

export default semanticsAgent;
