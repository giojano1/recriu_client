import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";

export default function NotFound() {
  return (
    <Empty className="h-svh">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Link href="/">Go to Home</Link>
        </Button>
        <EmptyDescription>
          Need help? <Link href="/">Contact support</Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
