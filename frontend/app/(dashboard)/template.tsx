"use client";

import React from "react";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-page-enter w-full">{children}</div>;
}
