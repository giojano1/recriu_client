"use client";

import { usePathname } from "next/navigation";
import { navLinks } from "@/constants/nav-links";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function ActiveDashboardPage() {
  const pathname = usePathname();

  const activePage = navLinks.find((link) => pathname === link.url);

  return (
    <div>
      {activePage && (
        <h1>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {activePage.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </h1>
      )}
    </div>
  );
}
