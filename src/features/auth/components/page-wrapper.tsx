import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

export default function AuthPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex w-full flex-col gap-6 ">
        {children}
      </CardContent>
    </Card>
  );
}

AuthPageWrapper.Header = function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h2 className="text-xl leading-none font-semibold ">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
  );
};
AuthPageWrapper.Footer = function Footer({
  text,
  linkText,
  linkHref,
}: {
  text: string;
  linkText: string;
  linkHref: string;
}) {
  return (
    <div className="text-center text-sm font-medium">
      <span className="text-muted-foreground">{text} </span>
      <Link href={linkHref} className="whitespace-nowrap underline">
        {linkText}
      </Link>
    </div>
  );
};
