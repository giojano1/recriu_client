import {
  BadgeQuestionMark,
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
    {
      name: "Analytics",
      url: dashboardRoutes.ANALYTICS,
      icon: ChartLine,
    },
  ],
  management: [
    {
      name: "Team",
      url: dashboardRoutes.TEAM,
      icon: Users,
    },
    {
      name: "Careers Page",
      url: dashboardRoutes.CAREER_PAGE,
      icon: Globe,
    },
  ],
  secondary: [
    {
      name: "Settings",
      url: dashboardRoutes.SETTINGS,
      icon: Settings,
    },
    {
      name: "Get Help",
      url: dashboardRoutes.SETTINGS,
      icon: BadgeQuestionMark,
    },
  ],
};
