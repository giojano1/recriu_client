import Header from "@/components/layout/dashboard/header";
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
