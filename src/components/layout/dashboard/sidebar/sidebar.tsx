"use client";
import Logo from "@/components/ui/logos/logo";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import * as React from "react";
import MainSidebarContent from "./sidebar-content";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-14 border-b">
        <SidebarMenuButton
          size="lg"
          asChild
          className="hover:bg-transparent active:bg-transparent"
        >
          <div>
            <Logo size="sm" />
            <span className="text-lg font-bold">Recriu</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      {props.children}
      <MainSidebarContent />
      <SidebarRail />
    </Sidebar>
  );
}
