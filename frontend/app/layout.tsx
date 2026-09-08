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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('missionwell_theme');
                var isDark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) || t === 'system';
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-slate-50 text-slate-900 dark:bg-[#090D16] dark:text-slate-100 min-h-screen selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300 transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
