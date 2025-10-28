"use client";
import { Image } from "@/lib/types/image";
import { useState } from "react";
import { createPortal } from "react-dom";
export default function Media({
  img,
}: {
  img: Pick<Image, "imagePath" | "prompt">;
}) {
  const [open, setOpen] = useState(false);
  const isVideo = img.imagePath.endsWith(".mp4");
  const mediaEl = isVideo ? (
    <video
      src={img.imagePath}
      autoPlay
      muted
      loop
      className="w-full h-auto object-cover rounded"
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.imagePath}
      alt={img.prompt}
      className="w-full h-auto object-cover rounded"
    />
  );

  return (
    <>
      <div
        className="group cursor-pointer overflow-hidden rounded"
        onClick={() => setOpen(true)}
      >
        {/* hover zoom */}
        <div className="transition-transform duration-300 group-hover:scale-105">
          {mediaEl}
        </div>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl leading-none font-bold"
              aria-label="Close preview"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <div
              className="max-h-full max-w-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo ? (
                <video
                  src={img.imagePath}
                  autoPlay
                  muted
                  loop
                  controls
                  className="h-auto w-auto max-h-[90vh] max-w-[90vw] object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.imagePath}
                  alt={img.prompt}
                  className="h-auto w-auto max-h-[90vh] max-w-[90vw] object-contain"
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
