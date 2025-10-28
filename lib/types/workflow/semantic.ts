import { z } from "zod";

export const SemanticsOutputSchema = z.object({
  score: z.number(),
  matchedKeywords: z.array(z.string()),
  similarity: z.number(),
});

export type SemanticsOutput = z.infer<typeof SemanticsOutputSchema>;
