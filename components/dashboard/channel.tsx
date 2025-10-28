/* eslint-disable @next/next/no-img-element */
"use client";
import { Channel } from "@/generated/prisma";

const channelLabelMap: Record<Channel, string> = {
  [Channel.Instagram]:
    "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg",
  [Channel.Tiktok]:
    "https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg",
  [Channel.Linkedin]:
    "https://upload.wikimedia.org/wikipedia/commons/e/e8/Linkedin-logo-blue-In-square-40px.png",
  [Channel.Facebook]:
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/FB_Logo_PNG.png",
};
const modelLabelMap: Record<string, string> = {
  openai:
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg",
  google:
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/Google_Gemini_logo_2025.svg",
  deepseek:
    "https://upload.wikimedia.org/wikipedia/commons/4/40/Deepseek-logo-icon.png",
};
export default function ChannelLabel({
  channel,
  model,
}: {
  channel: Channel;
  model: string;
}) {
  const modelPrefix = model.split("/")[0];

  return (
    <div className="flex items-center gap-4">
      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
        <img
          src={modelLabelMap[modelPrefix]}
          alt={modelPrefix}
          className="w-4 h-4 inline-block"
        />
        {model}
      </p>
      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
        <img
          src={channelLabelMap[channel]}
          alt={channel}
          className="w-4 h-4 inline-block"
        />
        {channel}
      </p>
    </div>
  );
}
