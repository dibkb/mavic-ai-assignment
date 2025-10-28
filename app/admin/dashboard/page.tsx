"use client";
import { Tab } from "@/lib/types/nuqs";
import { useQueryState } from "nuqs";
import { z } from "zod";

const TabSchema = z.enum([Tab.Brands, Tab.GenerateImages, Tab.EvaluatedImages]);

export default function Dashboard() {
  const [tab] = useQueryState("tab", TabSchema.default(Tab.Brands));

  let content: React.ReactNode;
  switch (tab as Tab) {
    case Tab.GenerateImages:
      content = <div>Generate Images content</div>;
      break;
    case Tab.EvaluatedImages:
      content = <div>Evaluated Images content</div>;
      break;
    case Tab.Brands:
    default:
      content = <div>Brands content</div>;
  }

  return <div className="p-8">{content}</div>;
}
