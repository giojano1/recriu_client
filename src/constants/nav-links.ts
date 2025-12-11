import {
  Briefcase,
  ChartLine,
  LayoutDashboard,
  Settings,
  SquareUser,
  User,
} from "lucide-react";
import { dashboardRoutes } from "./routes";

export const navLinks = {
  dashboard: [
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
  ],
  settings: [
    {
      name: "Profile",
      url: dashboardRoutes.SETTINGS,
      icon: User,
    },
  ],
};
