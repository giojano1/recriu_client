import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSwitch from "@/components/ui/toggle/theme-switch";
import { Bell, Copy } from "lucide-react";
import ActiveDashboardPage from "./active-page";

export default function Header() {
  return (
    <header className="bg-sidebar border-sidebar-border flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <ActiveDashboardPage />
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <div className="mt-0.5 -mr-0.5 size-2 rounded-full bg-green-500" />
            <span className="text-[12px] font-bold">recriu.com/app_name</span>
            <Copy className="size-3.5" />
          </Button>
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Button size="icon" variant="ghost">
            <Bell className="size-4" />
          </Button>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
