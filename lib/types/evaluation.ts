import { Channel } from "@/generated/prisma";

export interface Evaluation {
  id: string;
  status: string;
  endScore: number | null;
  confidence: number | null;
  creativity: string | null;
  size: string | null;
  mood: string | null;
  evaluator: string;
  semantics: string | null;
  createdAt: string;
  image: {
    imagePath: string;
    prompt: string;
    channel: Channel;
    model: string;
  };
}

export interface EvaluationsResponse {
  evaluations: Evaluation[];
}
