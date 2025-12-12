"use client";
import { Navbar } from "@/components/common/sidebar/navbar";
import Logo from "@/components/ui/logos/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { navLinks } from "@/constants/nav-links";
import * as React from "react";
import User from "../../common/sidebar/user";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          asChild
          className="data-[slot=sidebar-menu-button]:p-1.5!"
        >
          <div>
            <Logo size="sm" />
            <span className="text-base font-semibold">Recriu</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <Navbar navLinks={navLinks.main} />
        <Navbar navLinks={navLinks.management} label="Management" />
        <Navbar navLinks={navLinks.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <User />
      </SidebarFooter>
    </Sidebar>
  );
}
