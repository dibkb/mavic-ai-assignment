import { z } from "zod";

export const SemanticOutputSchema = z.object({
  score: z.number(),
  matchedKeywords: z.array(z.string()),
  similarity: z.number(),
});

export type SemanticOutput = z.infer<typeof SemanticOutputSchema>;
