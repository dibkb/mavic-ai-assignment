import { z } from "zod";

export const SizeOutputSchema = z.object({
  score: z.number(),
  matches: z.boolean(),
  details: z.string(),
});

export type SizeOutput = z.infer<typeof SizeOutputSchema>;
