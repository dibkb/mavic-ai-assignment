"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Brand } from "@/lib/types/brand";
import { sourceCodePro } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useState } from "react";
import SortToggle from "../sort-toggle";

const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const res = await axios.get<{ brands: Brand[] }>("/api/admin/brands");
    return res.data.brands;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      window.location.href = "/admin";
    }
    throw err;
  }
};

export default function Brands() {
  const { data, isLoading, error } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const sorted = (data ?? []).slice().sort((a, b) => {
    const tA = new Date(a.createdAt).getTime();
    const tB = new Date(b.createdAt).getTime();
    return order === "asc" ? tA - tB : tB - tA;
  });

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>error</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Brands</h2>
      <SortToggle order={order} setOrder={setOrder} />

      <ul className="space-y-2">
        {sorted.map((b: Brand) => (
          <li key={b.brandName} className="border p-4 rounded-md space-y-2">
            <h3 className="font-medium text-lg">{b.brandName}</h3>
            <p className="text-xs text-muted-foreground">
              Created&nbsp;{new Date(b.createdAt).toLocaleDateString()}
            </p>
            <dl className="grid grid-cols-4 gap-x-2 gap-y-1 text-sm">
              <dt className="font-medium col-span-1">Description</dt>
              <dd className="col-span-3 text-muted-foreground">
                {b.brandDescription}
              </dd>
              <dt className="font-medium col-span-1">Style</dt>
              <dd className="col-span-3 text-muted-foreground">{b.style}</dd>
              <dt className="font-medium col-span-1">Vision</dt>
              <dd className="col-span-3 text-muted-foreground">
                {b.brandVision}
              </dd>
              <dt className="font-medium col-span-1">Voice</dt>
              <dd className="col-span-3 text-muted-foreground">
                {b.brandVoice}
              </dd>
              <dt className="font-medium col-span-1">Colors</dt>
              <dd
                className={cn(
                  "col-span-3 text-muted-foreground",
                  sourceCodePro.className
                )}
              >
                {b.colors.join(", ")}
              </dd>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
