import { Mastra } from "@mastra/core/mastra";
import { weatherAgent } from "@/ai/agents/test";
import sizeAgent from "@/ai/agents/size-agent";
import { semanticsAgent } from "@/ai/agents/semantics-agent";
import creativityAgent from "@/ai/agents/creativity-agent";
import { moodAgent } from "@/ai/agents/mood-agent";

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    sizeAgent,
    semanticsAgent,
    creativityAgent,
    moodAgent,
  },
});
