"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface Brand {
  brandName: string;
  brandDescription: string;
  style: string;
  brandVision: string;
  brandVoice: string;
  colors: string[];
  createdAt: string;
}

const fetchBrands = async (): Promise<Brand[]> => {
  const res = await axios.get<{ brands: Brand[] }>("/api/admin/brands");
  return res.data.brands;
};

export default function Brands() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>error</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Brands</h2>
      <ul className="space-y-2">
        {data?.map((b: Brand) => (
          <li key={b.brandName} className="border p-4 rounded-md">
            <h3 className="font-medium">{b.brandName}</h3>
            <p className="text-sm text-muted-foreground">
              {b.brandDescription}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
