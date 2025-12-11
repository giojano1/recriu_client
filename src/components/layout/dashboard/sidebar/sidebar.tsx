"use client";
import { Navbar } from "@/components/common/navbar";
import Logo from "@/components/ui/logos/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navLinks } from "@/constants/nav-links";
import * as React from "react";
import User from "./user";

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
      <SidebarContent>
        <Navbar navLinks={navLinks} label="Main" />
      </SidebarContent>
      <SidebarFooter>
        <User />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
