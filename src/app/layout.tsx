import { cn } from "@/lib/utils/utils";
import { QueryProvider, ThemeProvider } from "@/providers";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { UnhandledRejectionHandler } from "@/lib/error/unhandled-rejection-handler";

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
      <body className={cn(inter.variable, "antialiased")}>
        <UnhandledRejectionHandler />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
