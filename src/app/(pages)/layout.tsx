import { AuthSessionProvider } from "@/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
