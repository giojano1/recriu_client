import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default function PublicPageBtn({ className }: { className?: string }) {
  return (
    <Button
      size="sm"
      variant="outline"
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
