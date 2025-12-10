"use client";

import { navLinks } from "@/constants/nav-links";
import { usePathname } from "next/navigation";

export default function ActiveDashboardPage() {
  const pathname = usePathname();

  const activePage = navLinks.find((link) => pathname === link.url);

  return (
    <div>
      {activePage && <h1 className="font-medium">{activePage.name}</h1>}
    </div>
  );
}
