import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function PrivateRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (
    !session ||
    !session.user ||
    session.error === "RefreshAccessTokenError"
  ) {
    redirect("/auth/login");
  }

  return <> {children}</>;
}
