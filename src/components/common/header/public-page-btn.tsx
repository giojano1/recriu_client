"use client";

import { Button } from "@/components/ui/button";
import { useGetCurrentCompany } from "@/features/company/get-current-company";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function PublicPageBtn({ className }: { className?: string }) {
  const { data, isLoading, error } = useGetCurrentCompany();

  const handleRedirect = () => {
    if (!data?.company.slug) return;

    const url = `https://recriu.com/${data.company.slug}`;
    window.open(url, "_blank");
  };

  if (error) {
    toast.error("Failed to load company data.");
    return null;
  }
  if (!data) return null;
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleRedirect}
      disabled={!data.company.slug}
      className={`flex items-center gap-2 ${className}`}
    >
      <span className="max-w-[130px] truncate text-[12px] font-bold">
        {isLoading ? "Loading..." : `recriu.com/${data.company.slug}`}
      </span>
      <ExternalLink className="mb-px size-3.5" />
    </Button>
  );
}
