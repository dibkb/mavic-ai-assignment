import { Channel } from "@/generated/prisma";

export interface Image {
  imagePath: string;
  prompt: string;
  model: string;
  channel: Channel;
  timestamp: string;
  userId: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImagesResponse {
  images: Image[];
  availableModels: string[];
  availableChannels: string[];
}
