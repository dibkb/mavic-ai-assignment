import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const clientOpenAI = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
export default openai;
