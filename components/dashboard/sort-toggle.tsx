"use client";
import { ArrowDownNarrowWideIcon, ArrowUpNarrowWideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortOrder = "asc" | "desc";

interface SortToggleProps {
  order: SortOrder;
  setOrder: (o: SortOrder) => void;
}

export default function SortToggle({ order, setOrder }: SortToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Sort:</span>
      <Button
        variant={order === "asc" ? "default" : "outline"}
        size="sm"
        onClick={() => setOrder("asc")}
      >
        <ArrowDownNarrowWideIcon className="size-4" /> Oldest
      </Button>
      <Button
        variant={order === "desc" ? "default" : "outline"}
        size="sm"
        onClick={() => setOrder("desc")}
      >
        <ArrowUpNarrowWideIcon className="size-4" /> Newest
      </Button>
    </div>
  );
}
