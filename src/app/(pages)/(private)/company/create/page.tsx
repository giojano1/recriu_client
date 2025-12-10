import { auth } from "@/lib/auth/auth";

export default async function page() {
  const session = await auth();

  return <div>{session?.user.email}</div>;
}
