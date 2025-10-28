import { z } from "zod";

export const CreativityOutputSchema = z.object({
  score: z.number(),
  factors: z.object({
    colorVariance: z.number(),
    entropy: z.number(),
    promptTokenVariety: z.number(),
  }),
});

export type CreativityOutput = z.infer<typeof CreativityOutputSchema>;
