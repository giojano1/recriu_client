import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSwitch from "@/components/ui/toggle/theme-switch";
import NotificationsBtn from "./notifications-btn";
import PublicPageBtn from "./public-page-btn";

export default function Header() {
  return (
    <header className="bg-sidebar border-sidebar-border sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <PublicPageBtn className="hidden md:flex" />

          <Separator
            orientation="vertical"
            className="ml-2 hidden data-[orientation=vertical]:h-4 md:inline-flex"
          />
          <ThemeSwitch />
          <NotificationsBtn />
        </div>
      </div>
    </header>
  );
}
