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
    <ul className="flex flex-wrap gap-4">
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
        `group w-[130px] justify-between px-4`,
        isSelected &&
          "border-primary dark:border-card-foreground bg-accent dark:bg-input/50"
      )}
      onClick={onClick}
    >
      {children}
      <div
        className={cn(
          `flex size-5 items-center justify-center rounded-full border`,
          isSelected ? "border-primary bg-primary" : "border"
        )}
      >
        <div
          className={cn(
            isSelected && "dark:bg-accent size-2.5 rounded-full bg-white"
          )}
        />
      </div>
    </Button>
  );
}
