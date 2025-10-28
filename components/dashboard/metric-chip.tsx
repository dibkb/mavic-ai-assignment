"use client";
import { cn } from "@/lib/utils";
export default function MetricChip({ score }: { score: number | null }) {
  const color =
    score === null
      ? "bg-gray-300 text-gray-600"
      : score >= 75
        ? "bg-green-200 text-green-800"
        : score >= 50
          ? "bg-yellow-200 text-yellow-800"
          : "bg-red-200 text-red-800";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
        color
      )}
    >
      {score ?? "-"}
    </span>
  );
}
