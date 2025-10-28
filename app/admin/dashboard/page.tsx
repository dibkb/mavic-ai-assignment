"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

  const tabLabelMap: Record<Tab, string> = {
    [Tab.Brands]: "Brands",
    [Tab.GenerateImages]: "Generate Images",
    [Tab.EvaluatedImages]: "Evaluated Images",
  };

  return (
    <div className="p-8 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tabLabelMap[tab as Tab]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {content}
    </div>
  );
}
