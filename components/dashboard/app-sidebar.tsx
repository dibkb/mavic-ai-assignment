import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Tab } from "@/lib/types/nuqs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchPending = async () => {
  const res = await axios.get<{
    pending: number;
    processing: number;
  }>("/api/admin/evaluations/pending");
  return res.data;
};
const items = [
  {
    title: "Brands",
    url: `/admin/dashboard?tab=${Tab.Brands}`,
  },
  {
    title: "Generated Images",
    url: `/admin/dashboard?tab=${Tab.GeneratedImages}`,
  },
  {
    title: "Evaluated Images",
    url: `/admin/dashboard?tab=${Tab.EvaluatedImages}`,
  },
];
export function AppSidebar() {
  const { data } = useQuery({
    queryKey: ["pending-evals"],
    queryFn: fetchPending,
    refetchInterval: 1000,
  });
  return (
    <Sidebar className="h-full">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isEvaluated = item.title === "Evaluated Images";
                const count = (data?.pending ?? 0) + (data?.processing ?? 0);
                return (
                  <SidebarMenuItem key={item.title}>
                    <a
                      href={item.url}
                      className="flex w-full items-center justify-between gap-2 px-2 py-1 rounded hover:bg-sidebar-accent"
                    >
                      <span>{item.title}</span>
                      {isEvaluated && count > 0 && (
                        <span className="animate-pulse bg-red-500 text-white rounded-full text-[10px] px-1.5">
                          {count}
                        </span>
                      )}
                    </a>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
