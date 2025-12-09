import Logo from "@/components/ui/logos/logo";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <section className="flex flex-col gap-4 px-4 py-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo size="sm" />
            Recriu
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>
      </section>
      <section className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/svg/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
          sizes="100vw"
        />
      </section>
    </div>
  );
}
