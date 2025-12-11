import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

export default function SettingsCard({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Card className="p-0 shadow-none">
      <CardHeader className="flex h-14 items-center justify-between border-b pb-0!">
        <CardTitle>{label}</CardTitle>
        <Button size="sm" variant="outline">
          <Edit className="size-4" />
          <span className="text-sm">Edit</span>
        </Button>
      </CardHeader>
      <CardContent className="pb-6">{children}</CardContent>
    </Card>
  );
}
