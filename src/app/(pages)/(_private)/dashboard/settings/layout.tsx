import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[900px] py-4">{children}</section>
  );
}
