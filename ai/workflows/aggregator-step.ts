import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

import { aggregateScores, AggregatorOutputSchema } from "../agents/aggregator";

const aggregatorStep = createStep({
  id: "aggregator-step",
  description:
    "Runs all evaluation agents in parallel and aggregates their scores into a final endScore and confidence.",
  inputSchema: z.object({
    "size-workflow": z.object({
      score: z.number(),
      matches: z.boolean(),
      details: z.string(),
      channel: z.string().optional(),
    }),
    "mood-workflow": z.object({
      score: z.number(),
      moodPrompt: z.array(z.string()),
      moodImage: z.array(z.string()),
      matchScore: z.number(),
    }),
    "semantic-workflow": z.object({
      score: z.number(),
      matchedKeywords: z.array(z.string()),
      similarity: z.number(),
    }),
    "creativity-workflow": z.object({
      score: z.number(),
      factors: z.object({
        colorVariance: z.number(),
        entropy: z.number(),
        promptTokenVariety: z.number(),
      }),
    }),
    weights: z.record(z.string(), z.number()).optional(),
  }),
  outputSchema: AggregatorOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Trigger data not found");
    }
    const {
      weights,
      "creativity-workflow": creativityWorkflow,
      "size-workflow": sizeWorkflow,
      "mood-workflow": moodWorkflow,
      "semantic-workflow": semanticWorkflow,
    } = inputData;

    const { endScore, confidence } = aggregateScores({
      scores: {
        creativity: creativityWorkflow.score,
        size: sizeWorkflow.score,
        mood: moodWorkflow.score,
        semantics: semanticWorkflow.score,
      },
      weights: weights ?? {},
    });

    return {
      endScore,
      confidence,
      creativity: creativityWorkflow,
      size: sizeWorkflow,
      mood: moodWorkflow,
      semantics: semanticWorkflow,
    } as const;
  },
});

export default aggregatorStep;
