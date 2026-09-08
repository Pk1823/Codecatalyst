import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive System Briefing & Architecture Overview — MissionWell AI",
  description:
    "Official Executive Brief & Architecture Dossier for MissionWell AI: Predictive Wellness Monitoring for Central Armed Police Forces & Defense Services.",
};

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
