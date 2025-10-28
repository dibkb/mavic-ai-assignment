"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { Image, ImagesResponse } from "@/lib/types/image";
import Media from "../media";
import ChannelLabel from "../channel";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Channel } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { sourceCodePro } from "@/lib/fonts";
import SortToggle, { SortOrder } from "../sort-toggle";

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

  const [models, setModels] = useState<string[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [order, setOrder] = useState<SortOrder>("desc");

  function toggle<T extends string | Channel>(
    value: T,
    list: T[],
    setter: Dispatch<SetStateAction<T[]>>
  ) {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  }

  const clearAll = () => {
    setModels([]);
    setChannels([]);
  };

  const filteredImages = (data?.images ?? []).filter((img) => {
    const modelOk = models.length ? models.includes(img.model) : true;
    const channelOk = channels.length ? channels.includes(img.channel) : true;
    return modelOk && channelOk;
  });

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>error</p>;

  const sortedImages = filteredImages.slice().sort((a, b) => {
    const tA = new Date(a.createdAt).getTime();
    const tB = new Date(b.createdAt).getTime();
    return order === "asc" ? tA - tB : tB - tA;
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">Generated Images</h2>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Filter
                {(models.length || channels.length) > 0 && (
                  <span className="ml-2 text-xs">
                    {models.length + channels.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 space-y-4" align="end">
              <div>
                <p className="font-medium mb-2">Models</p>
                <div className="space-y-1">
                  {data?.availableModels.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={models.includes(m)}
                        onCheckedChange={() => toggle(m, models, setModels)}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Channels</p>
                <div className="space-y-1">
                  {data?.availableChannels.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={channels.includes(c as Channel)}
                        onCheckedChange={() =>
                          toggle(c as Channel, channels, setChannels)
                        }
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <SortToggle order={order} setOrder={setOrder} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {sortedImages.map((img: Image) => (
          <div
            key={img.imagePath}
            className="border p-2 rounded-md space-y-2 flex flex-col justify-between"
          >
            <Media img={img} />
            <section>
              <p
                className={cn(
                  "text-sm text-stone-600",
                  sourceCodePro.className
                )}
              >
                {img.prompt}
              </p>
              <ChannelLabel channel={img.channel} model={img.model} />
            </section>
          </div>
        ))}
      </div>
    </section>
  );
}
