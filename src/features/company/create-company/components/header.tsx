import Logo from "@/components/ui/logos/logo";
import Link from "next/link";

export default function CreateCompanyHeader() {
  return (
    <header className="flex h-20 shrink-0 items-center border-b px-4 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Logo size="sm" />
          Recriu
        </Link>
      </div>
    </header>
  );
}
