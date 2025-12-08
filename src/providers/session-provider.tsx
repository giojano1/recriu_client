"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import type { Session } from "next-auth";

interface AuthSessionProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export function AuthSessionProvider({
  children,
  session,
}: AuthSessionProviderProps) {
  return (
    <SessionProvider session={session} refetchInterval={0}>
      {children}
    </SessionProvider>
  );
}
