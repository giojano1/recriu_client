"use client";
import { Navbar } from "@/components/common/navbar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navLinks } from "@/constants/nav-links";
import UserBar from "./user";
import { usePathname } from "next/navigation";
import { dashboardRoutes } from "@/constants/routes";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MainSidebarContent() {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith(dashboardRoutes.SETTINGS);
  if (isSettingsPage) {
    return (
      <SidebarContent>
        <SidebarMenuItem className="mx-2 mt-2">
          <SidebarMenuButton asChild>
            <Link href={dashboardRoutes.DASHBOARD}>
              <ChevronLeft />
              <span>Go Back</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <Navbar navLinks={navLinks.settings} label="Personal" />
      </SidebarContent>
    );
  }
  return (
    <>
      <SidebarContent>
        <Navbar navLinks={navLinks.dashboard} label="Main" />
      </SidebarContent>
      <SidebarFooter>
        <UserBar />
      </SidebarFooter>
    </>
  );
}
