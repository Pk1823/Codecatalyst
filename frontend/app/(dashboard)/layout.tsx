"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { DemoBanner } from "@/components/layout/demo-banner";
import { AICopilotDrawer } from "@/components/ai-assistant/ai-copilot-drawer";
import { AuthorityBar } from "@/components/layout/authority-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <DemoBanner />
      <div className="flex flex-1 relative">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex flex-1 flex-col min-w-0">
          <Topbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-28">
            {children}
          </main>
        </div>
      </div>
      <AICopilotDrawer />
      <AuthorityBar />
    </div>
  );
}
