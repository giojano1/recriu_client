"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CompanySize } from "../types";
import { cn } from "@/lib/utils/utils";

export default function SizeSelector() {
  const [selectedSize, setSelectedSize] = useState<CompanySize | null>(null);
  const options = [
    { label: "1-10", value: CompanySize.STARTUP_1_10 },
    { label: "11-50", value: CompanySize.SMALL_11_50 },
    { label: "51-200", value: CompanySize.MEDIUM_51_200 },
    { label: "201-1000", value: CompanySize.LARGE_201_1000 },
    { label: "1000+", value: CompanySize.ENTERPRISE_1000_PLUS },
  ];
  return (
    <ul className="flex gap-4 flex-wrap">
      {options.map((option) => {
        const isSelected = selectedSize === option.value;
        return (
          <SelectorButton
            key={option.value}
            onClick={() => setSelectedSize(option.value)}
            isSelected={isSelected}
          >
            {option.label}
          </SelectorButton>
        );
      })}
    </ul>
  );
}
function SelectorButton({
  children,
  onClick,
  isSelected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <Button
      size="lg"
      variant="outline"
      className={cn(
        `w-[140px] justify-between px-4 group `,
        isSelected && "border-primary "
      )}
      onClick={onClick}
    >
      {children}
      <div
        className={cn(
          `size-5 rounded-full border flex items-center justify-center`,
          isSelected ? "border-primary bg-primary" : "border-muted "
        )}
      >
        <div
          className={cn(
            isSelected && "bg-white dark:bg-accent size-2.5 rounded-full"
          )}
        />
      </div>
    </Button>
  );
}
