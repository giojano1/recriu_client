import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recriu - Hire the best talent, faster",
  description:
    "Recriu is a cutting-edge recruitment platform that streamlines your hiring process, helping you find and hire the best talent quickly and efficiently.",
  icons: {
    icon: "/assets/svg/logo_white.svg",
  },
  keywords: [
    "ATS",
    "Applicant Tracking System",
    "hiring software",
    "recruiting platform",
    "candidate management",
    "HR software",
    "Recriu",
    "talent acquisition",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "antialiased")}>{children}</body>
    </html>
  );
}
