import {
  Briefcase,
  Calendar,
  ChartLine,
  Globe,
  LayoutDashboard,
  Settings,
  SquareUser,
  Users,
} from "lucide-react";
import { dashboardRoutes } from "./routes";

export const navLinks = {
  main: [
    {
      name: "Dashboard",
      url: dashboardRoutes.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      url: dashboardRoutes.JOBS,
      icon: Briefcase,
    },
    {
      name: "Candidates",
      url: dashboardRoutes.CANDIDATES,
      icon: SquareUser,
    },
    {
      name: "Calendar",
      url: dashboardRoutes.CALENDAR,
      icon: Calendar,
    },
  ],
  management: [
    {
      name: "Employees",
      url: dashboardRoutes.ANALYTICS,
      icon: Users,
    },
    {
      name: "Analytics",
      url: dashboardRoutes.ANALYTICS,
      icon: ChartLine,
    },
    {
      name: "Career Page",
      url: dashboardRoutes.CAREER_PAGE,
      icon: Globe,
    },
    {
      name: "Settings",
      url: dashboardRoutes.SETTINGS,
      icon: Settings,
    },
  ],
};
