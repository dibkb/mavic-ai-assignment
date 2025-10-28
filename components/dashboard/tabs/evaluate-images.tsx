"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EvaluationsResponse, Evaluation } from "@/lib/types/evaluation";
import Media from "../media";
import { sourceCodePro } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import EvaluationMetrics from "../evaluation-metrics";

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
  });

  if (isLoading) return <p>loading...</p>;
  if (error) return <p>error loading evaluations</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Evaluation Results</h2>
      <div className="grid grid-cols-3 gap-4">
        {data?.evaluations.map((ev: Evaluation) => (
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
              </section>
            </div>
            <EvaluationMetrics evaluation={ev} />
          </section>
        ))}
      </div>
    </section>
  );
}
