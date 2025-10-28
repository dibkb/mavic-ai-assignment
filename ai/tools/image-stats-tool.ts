import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import sharp from "sharp";

function calculateEntropy(hist: number[]): number {
  const total = hist.reduce((a, b) => a + b, 0);
  return hist.reduce((entropy, count) => {
    if (!count) return entropy;
    const p = count / total;
    return entropy - p * Math.log2(p);
  }, 0);
}

export const imageStatsTool = createTool({
  id: "image-stats",
  description:
    "Compute basic statistics (color variance, entropy) for an image URL",
  inputSchema: z.object({
    url: z.url(),
  }),
  outputSchema: z.object({
    colorVariance: z.number(),
    entropy: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  execute: async ({ context }) => {
    const { url } = context;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch image");
    const buffer = Buffer.from(await res.arrayBuffer());
    const img = sharp(buffer);
    const { width, height } = await img.metadata();

    const stats = await img.stats();

    const colorVariance =
      (stats.channels[0].stdev ** 2 +
        stats.channels[1].stdev ** 2 +
        stats.channels[2].stdev ** 2) /
      3;

    const entropy =
      stats.entropy ??
      calculateEntropy(
        (stats.channels[0] as unknown as { histogram: number[] }).histogram ||
          []
      );

    return { colorVariance, entropy, width: width || 0, height: height || 0 };
  },
});
