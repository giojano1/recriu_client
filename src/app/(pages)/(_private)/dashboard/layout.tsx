import Header from "@/components/layout/dashboard/header/header";
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
