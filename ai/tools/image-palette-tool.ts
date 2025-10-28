import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import sharp from "sharp";

function classifyMood({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): string {
  if (r > g && r > b) return "warm";
  if (b > r && b > g) return "cool";
  if (g > r && g > b) return "natural";
  return "neutral";
}

export const imagePaletteTool = createTool({
  id: "image-palette",
  description: "Get dominant color of an image and map to a mood category",
  inputSchema: z.object({
    url: z.url(),
  }),
  outputSchema: z.object({
    color: z.object({ r: z.number(), g: z.number(), b: z.number() }),
    mood: z.string(),
  }),
  execute: async ({ context }) => {
    const { url } = context;
    const buffer = await (await fetch(url)).arrayBuffer();
    const img = sharp(Buffer.from(buffer));
    const { dominant } = await img.stats();
    const mood = classifyMood(dominant);
    return { color: dominant, mood };
  },
});
