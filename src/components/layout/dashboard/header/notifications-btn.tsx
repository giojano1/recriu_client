import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function NotificationsBtn() {
  return (
    <Button size="icon" variant="ghost">
      <Bell className="size-4" />
    </Button>
  );
}
