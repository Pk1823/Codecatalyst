"use client";

import React, { useState } from "react";
import {
  Activity,
  Shield,
  Users,
  Briefcase,
  Calendar,
  FolderHeart,
  TrendingUp,
  AlertCircle,
  Lock,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Flame,
  CheckCircle2,
  PhoneCall,
  RotateCcw,
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
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {isHi ? "बल समग्र कल्याण एवं तत्परता अवलोकन" : "Force Wellness & Readiness Command"}
            </h2>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2.5 py-0.5 border border-purple-300 dark:border-purple-800">
              {meta.sampleCommanderName}
            </span>
            <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 border border-amber-300 dark:border-amber-800">
              {meta.sampleBattalion}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isHi ? "बटालियन एवं कंपनी-वार सामरिक कल्याण नियंत्रण कक्ष" : "Battalion & Company-Level Tactical Welfare Briefing"} •{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{meta.primaryTheatre}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3 py-2 border border-slate-200 dark:border-slate-700">
          <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-left">
            <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {isHi ? "डीपीडीपी 2023 गोपनीयता सुरक्षित" : "DPDP Act 2023 Compliant"}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {isHi ? "व्यक्तिगत पहचान पूरी तरह से अज्ञात (Masked)" : "Individual PII strictly masked"}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Macro KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title={isHi ? "सक्रिय नफरी (Total Strength)" : "Total Personnel"}
          value="1,248"
          subtitle={isHi ? "5 कंपनियां सक्रिय" : "All Companies Active"}
          icon={Users}
          variant="default"
        />
        <StatCard
          title={isHi ? "बल कल्याण सूचकांक" : "Force Welfare Index"}
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
          subtitle={isHi ? "चिकित्सा दल की देखरेख में" : "Under Active Care"}
          icon={FolderHeart}
          variant="info"
        />
      </div>

      {/* Battalion Company Roll-Call Stress Heat Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isHi ? "कंपनी-वार रोल-कॉल तनाव एवं तत्परता स्थिति" : "Company-Wise Roll-Call & Operational Stress Grid"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta.sampleBattalion} • {isHi ? "रोटेशनल आराम एवं अवकाश संतुलन की निगरानी" : "Monitor fatigue accumulation across deployment sectors"}
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
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
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedCoy === coy.name
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{coy.name}</span>
                  <span
                    className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      isSevere
                        ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                        : isElevated
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                        : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {coy.stress}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {coy.strength} {isHi ? "सैनिक" : "Troops"}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {coy.location}
                </div>
                <div className="mt-2 text-[9px] font-semibold text-teal-600 dark:text-teal-400">
                  ● {coy.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Simulated Executive Insights Panel */}
      <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-r from-teal-50/70 via-blue-50/50 to-slate-50 dark:from-teal-950/30 dark:via-blue-950/20 dark:to-slate-900/40 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isHi ? "एआई सामरिक सिफ़ारिशें एवं कमान सलाह" : "AI Force Insights & Tactical Command Advisories"}
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 font-mono">
            {isHi ? "संश्लेषित परिचालन सिमुलेशन" : "Simulated insights based on synthetic data"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_EXECUTIVE_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="p-3.5 rounded-xl border border-white/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xs space-y-1"
            >
              <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                ● {insight.category}
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {insight.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts: Unit Comparison & Deployment Leave Trend */}
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
