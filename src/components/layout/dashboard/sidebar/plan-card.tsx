import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

//TODO: Update content with dynamic content or remove if not needed
export function PlanCard() {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="gap-1 px-4">
        <CardTitle className="text-sm">You're on Growth</CardTitle>
        <CardDescription className="text-[12px]">
          Upgrade to unlock new features and expand your usage limits.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div>
          <div className="grid gap-2.5">
            <Badge
              variant="outline"
              className="h-7 w-full rounded-md font-bold"
            >
              10 / 10 jobs
            </Badge>
            <Button className="w-full shadow-none" size="sm" type="button">
              Upgrade
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
