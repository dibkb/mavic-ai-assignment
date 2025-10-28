"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SortToggle, { SortOrder } from "../sort-toggle";
import { EvaluationsResponse, Evaluation } from "@/lib/types/evaluation";
import Media from "../media";
import { sourceCodePro } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import EvaluationMetrics from "../evaluation-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import StatusChip from "@/components/dashboard/status-chip";

const fetchEvaluations = async (): Promise<EvaluationsResponse> => {
  try {
    const res = await axios.get<EvaluationsResponse>("/api/admin/evaluations");
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      window.location.href = "/admin";
    }
    throw err;
  }
};

export default function EvaluateImages() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["evaluations"],
    queryFn: fetchEvaluations,
    // 3s refetch interval
    refetchInterval: 3000,
  });
  const [order, setOrder] = useState<SortOrder>("desc");

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>error loading evaluations</p>;

  const sortedEvaluations = (data?.evaluations ?? []).slice().sort((a, b) => {
    const tA = new Date(a.createdAt).getTime();
    const tB = new Date(b.createdAt).getTime();
    return order === "asc" ? tA - tB : tB - tA;
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">Evaluation Results</h2>
        <SortToggle order={order} setOrder={setOrder} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {sortedEvaluations.map((ev: Evaluation) => (
          <section key={ev.id} className="space-y-2">
            <div className="border p-2 rounded-md space-y-2 flex flex-col justify-between">
              <Media
                img={{
                  imagePath: ev.image.imagePath,
                  prompt: ev.image.prompt,
                }}
              />
              <section>
                <p
                  className={cn(
                    "text-sm text-stone-600",
                    sourceCodePro.className
                  )}
                >
                  {ev.image.prompt}
                </p>
                <StatusChip status={ev.status} />
              </section>
            </div>

            {ev.status === "completed" ? (
              <EvaluationMetrics evaluation={ev} />
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
