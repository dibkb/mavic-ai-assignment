"use client";
import { Image } from "@/lib/types/image";
export default function Media({
  img,
}: {
  img: Pick<Image, "imagePath" | "prompt">;
}) {
  const isVideo = img.imagePath.endsWith(".mp4");
  if (isVideo) {
    return (
      <video
        src={img.imagePath}
        autoPlay
        muted
        loop
        className="w-full h-auto object-cover rounded"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.imagePath}
      alt={img.prompt}
      className="w-full h-auto object-cover rounded"
    />
  );
}
