import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import getImageMetadata from "./image-metadata";

export const imageMetadataTool = createTool({
  id: "get-image-metadata",
  description: "Fetch image dimensions and file size metadata from a URL",
  inputSchema: z.object({
    imageUrl: z
      .string()
      .describe("The URL of the image to get the metadata for"),
  }),
  outputSchema: z.object({
    width: z.number(),
    height: z.number(),
    sizeBytes: z.number(),
    type: z.string(),
    mime: z.string(),
    wUnits: z.string(),
    hUnits: z.string(),
  }),
  execute: async ({ context }) => {
    const { imageUrl } = context;
    const meta = await getImageMetadata(imageUrl.toString());
    return meta;
  },
});
