"use client";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAdmin } from "@/hooks/useAdmin";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  useAdmin();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
