"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Image, ImagesResponse } from "@/lib/types/image";
import Media from "../media";

const fetchImages = async (): Promise<ImagesResponse> => {
  try {
    const res = await axios.get<ImagesResponse>("/api/admin/images");
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      window.location.href = "/admin";
    }
    throw err;
  }
};

export default function GenerateImages() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
  });

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>error</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Generated Images</h2>
      <div className="grid grid-cols-3 gap-4">
        {data?.images.map((img: Image) => (
          <div key={img.imagePath} className="border p-2 rounded-md space-y-2">
            <Media img={img} />
            <p className="text-sm">{img.prompt}</p>
            <p className="text-xs text-muted-foreground">
              {img.model} • {img.channel}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
