import { z } from "zod";

export const AggregatorInputSchema = z.object({
  scores: z.record(z.string(), z.number()),
  weights: z.record(z.string(), z.number()).optional().default({}),
});

export type AggregatorInput = z.infer<typeof AggregatorInputSchema>;

export const AggregatorOutputSchema = z.object({
  endScore: z.number(),
  confidence: z.number(),
});

export type AggregatorOutput = z.infer<typeof AggregatorOutputSchema>;

export function aggregateScores({
  scores,
  weights = {},
}: AggregatorInput): AggregatorOutput {
  const agentKeys = Object.keys(scores);
  if (agentKeys.length === 0) {
    throw new Error("No agent scores provided");
  }
  const sumWeights = agentKeys.reduce(
    (sum, key) => sum + (weights[key] ?? 1),
    0
  );
  const weightedTotal = agentKeys.reduce(
    (sum, key) => sum + scores[key] * (weights[key] ?? 1),
    0
  );
  const endScore = Math.round((weightedTotal / sumWeights) * 100) / 100;
  const mean = weightedTotal / sumWeights;
  const variance =
    agentKeys.reduce((sum, key) => {
      const w = weights[key] ?? 1;
      return sum + w * Math.pow(scores[key] - mean, 2);
    }, 0) / sumWeights;
  const stdDev = Math.sqrt(variance);

  const confidence = Math.max(0, Math.round(100 - Math.min(stdDev, 50)));

  return { endScore, confidence };
}

export default aggregateScores;
