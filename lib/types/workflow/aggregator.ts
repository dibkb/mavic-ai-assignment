import z from "zod";

export const AggregatorOutputSchema = z.object({
  endScore: z.number(),
  confidence: z.number(),
  creativity: z.object({
    score: z.number(),
    factors: z.object({
      colorVariance: z.number(),
      entropy: z.number(),
      promptTokenVariety: z.number(),
    }),
  }),
  size: z.object({
    score: z.number(),
    matches: z.boolean(),
    details: z.string(),
  }),
  mood: z.object({
    score: z.number(),
    moodPrompt: z.array(z.string()),
    moodImage: z.array(z.string()),
    matchScore: z.number(),
  }),
  semantics: z.object({
    score: z.number(),
    matchedKeywords: z.array(z.string()),
    similarity: z.number(),
  }),
});

export type AggregatorOutput = z.infer<typeof AggregatorOutputSchema>;
