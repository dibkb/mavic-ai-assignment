import { z } from "zod";

export const MoodOutputSchema = z.object({
  score: z.number(),
  moodPrompt: z.array(z.string()),
  moodImage: z.array(z.string()),
  matchScore: z.number(),
});

export type MoodOutput = z.infer<typeof MoodOutputSchema>;
