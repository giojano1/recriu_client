import { auth } from "@/lib/auth/auth";
import React from "react";

export default async function page() {
  const session = await auth();

  return <div>{session?.user.email}</div>;
}
