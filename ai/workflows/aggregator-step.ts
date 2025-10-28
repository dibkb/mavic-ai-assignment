import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

import { aggregateScores } from "../agents/aggregator";

const aggregatorStep = createStep({
  id: "aggregator-step",
  description:
    "Runs all evaluation agents in parallel and aggregates their scores into a final endScore and confidence.",
  inputSchema: z.object({
    originalPrompt: z.string(),
    imageUrl: z.url(),
    sizeWorkflow: z.object({
      score: z.number(),
      matches: z.boolean(),
      details: z.string(),
    }),
    moodWorkflow: z.object({
      score: z.number(),
      moodPrompt: z.array(z.string()),
      moodImage: z.array(z.string()),
      matchScore: z.number(),
    }),
    semanticsWorkflow: z.object({
      score: z.number(),
      matchedKeywords: z.array(z.string()),
      similarity: z.number(),
    }),
    creativityWorkflow: z.object({
      score: z.number(),
      factors: z.object({
        colorVariance: z.number(),
        entropy: z.number(),
        promptTokenVariety: z.number(),
      }),
    }),
    weights: z.record(z.string(), z.number()).optional(),
  }),
  outputSchema: z.object({
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
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Trigger data not found");
    }
    const {
      weights,
      creativityWorkflow,
      sizeWorkflow,
      moodWorkflow,
      semanticsWorkflow,
    } = inputData;

    const { endScore, confidence } = aggregateScores({
      scores: {
        creativity: creativityWorkflow.score,
        size: sizeWorkflow.score,
        mood: moodWorkflow.score,
        semantics: semanticsWorkflow.score,
      },
      weights: weights ?? {},
    });

    return {
      endScore,
      confidence,
      creativity: creativityWorkflow,
      size: sizeWorkflow,
      mood: moodWorkflow,
      semantics: semanticsWorkflow,
    } as const;
  },
});

export default aggregatorStep;
