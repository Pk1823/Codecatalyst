"use client";

import React, { useState } from "react";
import {
  Activity,
  Shield,
  Users,
  Briefcase,
  Calendar,
  FolderHeart,
  Lock,
  Zap,
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { FORCES_METADATA } from "@/lib/force-metadata";
import { StatCard } from "@/components/common/stat-card";
import { UnitComparisonChart } from "@/components/charts/unit-comparison-chart";
import { DeploymentLeaveTrendChart } from "@/components/charts/deployment-leave-trend-chart";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { MOCK_EXECUTIVE_INSIGHTS } from "@/lib/mock-data/analytics";

export default function CommanderDashboardPage() {
  const { user, force, lang } = useAuth();
  const meta = FORCES_METADATA[force] || FORCES_METADATA.CRPF;
  const isHi = lang === "hi";

  const [selectedCoy, setSelectedCoy] = useState<string>("Bravo");

  const companies = [
    { name: "Alpha Coy", strength: 142, stress: "Moderate (54%)", status: "Routine Patrol", location: "Sector HQ Grid" },
    { name: "Bravo Coy", strength: 138, stress: "Elevated (78%)", status: "Forward Hard Area", location: meta.sampleLocation },
    { name: "Charlie Coy", strength: 145, stress: "Optimal (42%)", status: "Reserve Stand-down", location: "Rear Logistics Base" },
    { name: "Delta Coy", strength: 140, stress: "Severe (84%)", status: "High Risk Area", location: "Outpost 4 / Nala Crossing" },
    { name: "HQ & Support Coy", strength: 160, stress: "Optimal (38%)", status: "Communications", location: "Main Battalion HQ" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              {isHi ? "बल समग्र कल्याण एवं तत्परता अवलोकन" : "Force Wellness & Readiness Command"}
            </h2>
            <span className="rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-medium px-2 py-0.5 border border-slate-700">
              {meta.sampleCommanderName}
            </span>
            <span className="rounded bg-slate-800 text-emerald-400 text-[10px] font-mono font-semibold px-2 py-0.5 border border-slate-700">
              {meta.sampleBattalion}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi ? "बटालियन एवं कंपनी-वार सामरिक कल्याण नियंत्रण कक्ष" : "Battalion & Company-Level Tactical Welfare Briefing"} •{" "}
            <span className="font-mono text-slate-300">{meta.primaryTheatre}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg bg-[#0F172A] px-3 py-2 border border-slate-800">
          <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="text-left">
            <span className="block text-[11px] font-medium text-slate-200">
              {isHi ? "डीपीडीपी 2023 गोपनीयता सुरक्षित" : "DPDP Act 2023 Compliant"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {isHi ? "व्यक्तिगत पहचान पूरी तरह से अज्ञात (Masked)" : "Masked aggregate unit data only"}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Macro KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title={isHi ? "सक्रिय नफरी" : "Total Strength"}
          value="1,248"
          subtitle={isHi ? "5 कंपनियां सक्रिय" : "5 Companies Monitored"}
          icon={Users}
          variant="default"
        />
        <StatCard
          title={isHi ? "बल कल्याण सूचकांक" : "Force Wellness Index"}
          value="81.4 / 100"
          subtitle={isHi ? "सुरक्षित तत्परता क्षेत्र" : "Safe Operational Zone"}
          change="▲ +2.4%"
          trend="down"
          icon={Activity}
          variant="success"
        />
        <StatCard
          title={isHi ? "कार्यभार दबाव" : "Workload Pressure"}
          value="68.2%"
          subtitle={isHi ? "सामान्य से अधिक" : "Above Peacetime Roster"}
          change="▲ Elevated"
          trend="up"
          icon={Briefcase}
          variant="warning"
        />
        <StatCard
          title={isHi ? "फॉरवर्ड पोस्ट औसत" : "Deployment Strain"}
          value="142 Days"
          subtitle={isHi ? "अग्रिम चौकियों पर" : "Average Forward Post"}
          change="▲ +18% Q/Q"
          trend="up"
          icon={Calendar}
          variant="urgent"
        />
        <StatCard
          title={isHi ? "सक्रिय कल्याण मामले" : "Open Welfare Cases"}
          value="24"
          subtitle={isHi ? "चिकित्सा दल की देखरेख में" : "Under Medical Review"}
          icon={FolderHeart}
          variant="info"
        />
      </div>

      {/* Battalion Company Roll-Call Stress Heat Matrix */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A]/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              {isHi ? "कंपनी-वार रोल-कॉल तनाव एवं तत्परता स्थिति" : "Company-Wise Roll-Call & Operational Stress Grid"}
            </h3>
            <p className="text-xs text-slate-400">
              {meta.sampleBattalion} • {isHi ? "रोटेशनल आराम एवं अवकाश संतुलन की निगरानी" : "Monitor fatigue accumulation across deployment sectors"}
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
            {isHi ? "5 सक्रिय कंपनियां" : "5 Active Deployments"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {companies.map((coy) => {
            const isElevated = coy.stress.includes("Elevated");
            const isSevere = coy.stress.includes("Severe");
            return (
              <div
                key={coy.name}
                onClick={() => setSelectedCoy(coy.name)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCoy === coy.name
                    ? "border-emerald-500 bg-slate-900 ring-1 ring-emerald-500/50"
                    : "border-slate-800 bg-[#090D16] hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">{coy.name}</span>
                  <span
                    className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                      isSevere
                        ? "bg-rose-950/50 text-rose-300 border-rose-800/60"
                        : isElevated
                        ? "bg-amber-950/50 text-amber-300 border-amber-800/60"
                        : "bg-emerald-950/50 text-emerald-300 border-emerald-800/60"
                    }`}
                  >
                    {coy.stress}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  {coy.strength} {isHi ? "सैनिक" : "Personnel"}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {coy.location}
                </div>
                <div className="mt-2 text-[9px] font-mono font-medium text-emerald-400">
                  ● {coy.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tactical Advisory Panel */}
      <div className="rounded-xl border border-slate-800 bg-[#0F172A]/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              {isHi ? "सामरिक कल्याण सिफ़ारिशें एवं कमान सलाह" : "Tactical Welfare Advisories"}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {isHi ? "संचालन डेटा आधारित" : "Operational Decision Support"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_EXECUTIVE_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="p-3.5 rounded-lg border border-slate-800 bg-[#090D16] space-y-1"
            >
              <span className="text-[10px] font-mono font-medium uppercase text-emerald-400">
                ● {insight.category}
              </span>
              <h4 className="text-xs font-semibold text-white">
                {insight.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts: Unit Comparison & Risk Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <UnitComparisonChart />
        </div>
        <div className="lg:col-span-5">
          <RiskDonutChart />
        </div>
      </div>

      <div>
        <DeploymentLeaveTrendChart />
      </div>
    </div>
  );
}
