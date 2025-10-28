import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sourceCodePro } from "@/lib/fonts";
import { Tab } from "@/lib/types/nuqs";
import { cn } from "@/lib/utils";
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
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span
                        className={cn(
                          sourceCodePro.className,
                          "font-medium text-sm"
                        )}
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
