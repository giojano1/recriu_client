import {
  Briefcase,
  ChartLine,
  LayoutDashboard,
  Settings,
  SquareUser,
} from "lucide-react";
import { dashboardRoutes } from "./routes";

export const navLinks = [
  {
    name: "Dashboard",
    url: dashboardRoutes.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: "Candidates",
    url: dashboardRoutes.CANDIDATES,
    icon: SquareUser,
  },
  {
    name: "Jobs",
    url: dashboardRoutes.JOBS,
    icon: Briefcase,
  },
  {
    name: "Analytics",
    url: dashboardRoutes.ANALYTICS,
    icon: ChartLine,
  },
  {
    name: "Settings",
    url: dashboardRoutes.SETTINGS,
    icon: Settings,
  },
];
