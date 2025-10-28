import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { clientOpenAI } from "../providers/open-ai";

export const imageCaptionTool = createTool({
  id: "caption-image",
  description:
    "Generate a brief caption describing the main content of an image URL using OpenAI vision capabilities.",
  inputSchema: z.object({
    url: z.string().url().describe("Image URL to caption"),
  }),
  outputSchema: z.object({
    caption: z.string(),
  }),
  execute: async ({ context }) => {
    const { url } = context;

    const completion = await clientOpenAI.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url,
              },
            },
            {
              type: "text",
              text: "Describe this image in one short sentence.",
            },
          ],
        },
      ],
    });

    const caption = completion.choices[0]?.message?.content?.trim() || "";
    return { caption };
  },
});
