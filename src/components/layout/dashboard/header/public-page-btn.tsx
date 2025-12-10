"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function PublicPageBtn({ className }: { className?: string }) {
  const [disabled, setDisabled] = useState(false);

  const handleCopy = async () => {
    if (disabled) return;

    setDisabled(true);

    const url = "https://recriu.com/app_name";
    await navigator.clipboard.writeText(url);

    setTimeout(() => setDisabled(false), 2000);
    toast.success("Public page URL copied to clipboard!");
  };

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={disabled}
      onClick={handleCopy}
      className={`flex items-center gap-2 ${className}`}
    >
      <div className="mt-0.5 -mr-0.5 size-2 rounded-full bg-green-500" />
      <span className="max-w-[130px] truncate text-[12px] font-bold">
        recriu.com/app_name
      </span>
      <Copy className="size-3.5" />
    </Button>
  );
}
