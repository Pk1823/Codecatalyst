import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "MissionWell AI — Predictive Wellness Monitoring for Safer, Stronger Forces",
  description:
    "AI-powered, privacy-first platform that helps identify early indicators of stress, fatigue, burnout, and workload pressure for Central Armed Police Forces and Uniformed Services. Smart India Hackathon Problem Statement 26186.",
  keywords: [
    "MissionWell AI",
    "Predictive Wellness",
    "Force Readiness",
    "CRPF Welfare",
    "CAPF Stress Monitoring",
    "Smart India Hackathon",
    "Personnel Wellbeing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
