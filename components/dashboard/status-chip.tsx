"use client";
import { cn } from "@/lib/utils";

export default function StatusChip({ status }: { status: string }) {
  const color =
    status === "completed"
      ? "bg-green-200 text-green-800"
      : status === "processing"
        ? "bg-yellow-200 text-yellow-800 animate-pulse"
        : "bg-gray-300 text-gray-800";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
        color
      )}
    >
      {status}
    </span>
  );
}
