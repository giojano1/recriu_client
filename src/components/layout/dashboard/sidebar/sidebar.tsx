"use client";
import { CollapsibleNavbar } from "@/components/common/collapsible-navbar";
import { Navbar } from "@/components/common/navbar";
import Logo from "@/components/ui/logos/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { navLinks } from "@/constants/nav-links";
import { SquareTerminal } from "lucide-react";
import * as React from "react";
import { PlanCard } from "./plan-card";
const navLinksTwo = [
  {
    title: "Label One",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "History",
        url: "#",
      },
      {
        title: "Starred",
        url: "#",
      },
      {
        title: "Settings",
        url: "#",
      },
    ],
  },
];

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
        <CollapsibleNavbar navLinks={navLinksTwo} label="Management" />
      </SidebarContent>
      <SidebarFooter>
        <PlanCard />
      </SidebarFooter>
    </Sidebar>
  );
}
