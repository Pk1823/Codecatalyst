"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-enter w-full">
      {children}
    </div>
  );
}
