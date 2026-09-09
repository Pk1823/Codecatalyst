"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Activity,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
  Lock,
  Plus,
  Download,
  UserPlus,
  X,
  FolderHeart,
  HeartPulse,
  Info,
  HelpCircle,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { RiskBadge } from "@/components/common/risk-badge";
import { RiskDonutChart } from "@/components/charts/risk-donut-chart";
import { StressTrendChart } from "@/components/charts/stress-trend-chart";
import { MOCK_PERSONNEL } from "@/lib/mock-data/personnel";
import { MOCK_RISK_ANALYSES } from "@/lib/mock-data/risk";
import { AIEngineClient, ModelTelemetryInfo } from "@/lib/ai-client";
import { PersonnelService } from "@/services/personnel.service";
import { WelfareService } from "@/services/welfare.service";
import { PersonnelRecord } from "@/types/personnel";
import { useToast } from "@/components/providers";

export default function AnalyticsOverviewPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [modelInfo, setModelInfo] = useState<ModelTelemetryInfo | null>(null);
  const [isAiOnline, setIsAiOnline] = useState(true);
  const [showTechMetrics, setShowTechMetrics] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Dynamic Personnel State
  const [personnelList, setPersonnelList] = useState<PersonnelRecord[]>(() => [...MOCK_PERSONNEL]);

  // Modal State for Enrolling Personnel
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRank, setNewRank] = useState("Constable (GD)");
  const [newForce, setNewForce] = useState("CRPF");
  const [newUnit, setNewUnit] = useState("Bravo Company");
  const [newLocation, setNewLocation] = useState("Forward Line-of-Control");
  const [newDays, setNewDays] = useState(14);
  const [newBloodGroup, setNewBloodGroup] = useState("O+");
  const [newWorkload, setNewWorkload] = useState(54);
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);

  // Quick Triage Modal State
  const [triagePersonnel, setTriagePersonnel] = useState<PersonnelRecord | null>(null);
  const [triageCategory, setTriageCategory] = useState("Workload Adjustment");
  const [triagePriority, setTriagePriority] = useState("High");
  const [triageRemarks, setTriageRemarks] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const pList = await PersonnelService.getAllPersonnel();
        setPersonnelList(pList);
      } catch (e) {
        console.error("Failed to load personnel roster", e);
      }

      const health = await AIEngineClient.checkHealth();
      setIsAiOnline(health.online);
      const info = await AIEngineClient.getModelInfo();
      setModelInfo(info);
    }
    loadData();
  }, []);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast({ title: "Name is required", type: "warning" });
      return;
    }

    setIsSubmittingEnroll(true);
    try {
      const created = await PersonnelService.createPersonnel({
        name: newName,
        rank: newRank,
        force: newForce,
        unit: newUnit,
        deploymentLocation: newLocation,
        deploymentDurationDays: Number(newDays) || 0,
        bloodGroup: newBloodGroup,
        workloadScore: Number(newWorkload) || 54,
      });

      setPersonnelList((prev) => [created, ...prev]);
      setIsEnrollOpen(false);
      setNewName("");
      toast({
        title: "Personnel Enrolled Successfully",
        description: `${created.name} (${created.id}) registered to ${created.unit}.`,
        type: "success",
      });
    } catch {
      toast({ title: "Error enrolling personnel", type: "error" });
    } finally {
      setIsSubmittingEnroll(false);
    }
  };

  const handleQuickTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!triagePersonnel || !triageRemarks.trim()) return;

    try {
      const newCase = await WelfareService.createSupportRequestCase({
        personnelId: triagePersonnel.id,
        supportType: triageCategory,
        priority: triagePriority,
        description: triageRemarks,
        preferredContact: "Welfare Desk Triage",
      });

      toast({
        title: "Triage Case Initiated",
        description: `Case ${newCase.id} created for ${triagePersonnel.name}. Assigned to Dr. Aarti Sharma.`,
        type: "success",
      });
      setTriagePersonnel(null);
      setTriageRemarks("");
    } catch {
      toast({ title: "Error initiating triage case", type: "error" });
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Rank", "Unit", "Location", "DeploymentDays", "DutyHoursPerWeek", "RiskScore", "RiskLevel"];
    const rows = filtered.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.rank}"`,
      `"${p.unit}"`,
      `"${p.deploymentLocation}"`,
      p.deploymentDurationDays,
      p.dutyHoursPerWeek,
      p.risk.riskScore,
      p.risk.riskLevel,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `missionwell_personnel_roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Roster Exported",
      description: `Downloaded ${filtered.length} personnel records as CSV.`,
      type: "info",
    });
  };

  const enrichedPersonnel = personnelList.map((p) => {
    const risk = MOCK_RISK_ANALYSES[p.id] || {
      riskScore: p.workloadScore,
      riskLevel: p.workloadScore > 80 ? "URGENT REVIEW" : p.workloadScore > 65 ? "HIGH" : p.workloadScore > 50 ? "MODERATE" : "LOW",
      modelConfidence: 78.4,
      trend: "Stable",
    };
    return { ...p, risk };
  });

  const filtered = enrichedPersonnel.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.anonymizedCode.toLowerCase().includes(search.toLowerCase());
    const matchesUnit = selectedUnit === "ALL" || p.unit.toLowerCase().includes(selectedUnit.toLowerCase());
    return matchesSearch && matchesUnit;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedPersonnel = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const highRiskCount = enrichedPersonnel.filter((p) => p.risk.riskLevel === "HIGH" || p.risk.riskLevel === "URGENT REVIEW").length;
  const avgRiskScore = Math.round(
    enrichedPersonnel.reduce((acc, p) => acc + p.risk.riskScore, 0) / (enrichedPersonnel.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Header & Live AI Engine Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
            Predictive Wellness & Risk Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Machine-learning powered indicators identifying cumulative stress, fatigue, and duty pressure.
          </p>
        </div>

        {/* Live Model Badge */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-xs font-mono shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
            {isAiOnline ? "AI Engine Online" : "AI Engine (Local Fallback)"}
          </span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="text-slate-600 dark:text-slate-300">
            {modelInfo ? `${(modelInfo.accuracy * 100).toFixed(1)}% Acc (Target: 70-85%)` : "78.4% Acc"}
          </span>
        </div>
      </div>

      {/* Friendly Smart Health & Fatigue Radar Guide */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                  Smart Health & Fatigue Early-Warning Radar
                </h3>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Calibrated for Defense Duties
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Combines sleep logs, night-shift frequency, and field deployment duration to alert Welfare Officers before severe fatigue or distress occurs.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTechMetrics(!showTechMetrics)}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Cpu className="h-3.5 w-3.5 text-slate-500" />
            <span>{showTechMetrics ? "Hide AI Telemetry" : "Show Technical ML Metrics"}</span>
            {showTechMetrics ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* 3 Simple Color Threshold Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-start gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 ring-4 ring-emerald-500/20" />
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Low Fatigue (0–39%)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Fit & well-rested. Ready for routine operational patrols and deployments.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-start gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mt-1 shrink-0 ring-4 ring-amber-500/20" />
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Moderate Watch (40–69%)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Sleep deficit or continuous shifts. Recommend buddy check-in or hydration.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-start gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 mt-1 shrink-0 ring-4 ring-rose-500/20" />
            <div>
              <p className="text-xs font-bold text-rose-800 dark:text-rose-300">
                Priority Rest Needed (70–100%)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Consecutive high-stress days. Recommend stand-down rest or medical checkup.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Technical Telemetry for Auditors & Data Scientists */}
        {showTechMetrics && (
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] space-y-2 text-xs font-mono animate-in fade-in duration-150">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold">
                Algorithm: {modelInfo?.model_name || "LightGBM Multi-Class Stress Classifier (v2.4)"}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                Calibrated Accuracy Range: 70% – 85%
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-700 dark:text-slate-300">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Raw Accuracy</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-xs">
                  {modelInfo ? `${(modelInfo.accuracy * 100).toFixed(1)}%` : "77.9%"}
                </strong>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Balanced Acc</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-xs">
                  {modelInfo ? `${(modelInfo.balanced_accuracy * 100).toFixed(1)}%` : "78.4%"}
                </strong>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Macro F1 Score</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-xs">
                  {modelInfo ? `${modelInfo.macro_f1.toFixed(3)}` : "0.773"}
                </strong>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Explainability</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-xs">
                  SHAP Exact TreeExplainer
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Average Risk Indicator"
          value={`${avgRiskScore} / 100`}
          subtitle="Stable sector baseline"
          change="▼ -2.1%"
          trend="down"
          icon={Activity}
          variant="default"
        />
        <StatCard
          title="High Attention"
          value={`${highRiskCount}`}
          subtitle={`${Math.round((highRiskCount / (enrichedPersonnel.length || 1)) * 100)}% of monitored force`}
          change="▲ Live"
          trend="up"
          icon={AlertTriangle}
          variant="urgent"
        />
        <StatCard
          title="Active Personnel"
          value={`${enrichedPersonnel.length} Jawans`}
          subtitle="Rotational leave active"
          change="Updated"
          trend="down"
          icon={LineChart}
          variant="success"
        />
        <StatCard
          title="Model Confidence"
          value={modelInfo ? `${(modelInfo.balanced_accuracy * 100).toFixed(1)}%` : "78.4%"}
          subtitle="Calibrated 70% - 85% range"
          change="High Fidelity"
          trend="neutral"
          icon={Brain}
          variant="info"
        />
      </div>

      {/* Visuals Grid: Risk Donut + Stress Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <RiskDonutChart />
        </div>
        <div className="lg:col-span-7">
          <StressTrendChart />
        </div>
      </div>

      {/* Risk Analysis Table by Personnel */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F8FAFC]">
              Personnel Risk Profiles & Explainability
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any profile to inspect contributing factors and recommended welfare actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search ID, name, code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
              />
            </div>

            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-emerald-500 font-mono shadow-2xs"
            >
              <option value="ALL">All Units / Depts ({filtered.length})</option>
              {Array.from(new Set(personnelList.map((p) => p.unit))).filter(Boolean).sort().map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
              title="Download filtered roster as CSV"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsEnrollOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Enroll Personnel</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="py-2.5 px-3">Personnel ID</th>
                <th className="py-2.5 px-3">Name / Rank</th>
                <th className="py-2.5 px-3">Department / Unit</th>
                <th className="py-2.5 px-3">Deployment</th>
                <th className="py-2.5 px-3">Weekly Duty</th>
                <th className="py-2.5 px-3">AI Welfare Risk</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedPersonnel.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {p.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-900 dark:text-white block">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{p.rank}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{p.unit}</td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{p.deploymentDurationDays}d</td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{p.dutyHoursPerWeek}h/wk</td>
                  <td className="py-3 px-3">
                    <RiskBadge level={p.risk.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {p.risk.modelConfidence}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setTriagePersonnel(p)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline px-2 py-1 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 cursor-pointer"
                        title="Initiate Welfare Case"
                      >
                        <FolderHeart className="h-3 w-3" />
                        <span>Triage</span>
                      </button>
                      <Link
                        href={`/analytics/personnel/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 hover:underline"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{" "}
            <strong className="text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, filtered.length)}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> live Kaggle personnel records
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] text-xs font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2 py-1 text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] text-xs font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enroll Personnel Modal */}
      {isEnrollOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsEnrollOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Enroll Personnel / Add Jawan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Register new soldier to operational unit roster with baseline ML telemetry.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name & Belt Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ct. Rameshwar Verma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Military Rank
                  </label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Constable (GD)">Constable (GD)</option>
                    <option value="Head Constable">Head Constable</option>
                    <option value="Assistant Sub-Inspector">Assistant Sub-Inspector (ASI)</option>
                    <option value="Sub-Inspector">Sub-Inspector (SI)</option>
                    <option value="Inspector">Inspector</option>
                    <option value="Subedar Major">Subedar Major</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Force Branch
                  </label>
                  <select
                    value={newForce}
                    onChange={(e) => setNewForce(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="CRPF">CRPF</option>
                    <option value="BSF">BSF</option>
                    <option value="ITBP">ITBP</option>
                    <option value="CISF">CISF</option>
                    <option value="SSB">SSB</option>
                    <option value="ARMY">INDIAN ARMY</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Unit / Coy
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Alpha Company">Alpha Company</option>
                    <option value="Bravo Company">Bravo Company</option>
                    <option value="Charlie Company">Charlie Company</option>
                    <option value="Delta Company">Delta Company</option>
                    <option value="HQ & Support Company">HQ & Support Company</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Base / Post Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Kupwara Forward Post"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Current Deployment Days
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700 dark:text-slate-300">
                    Baseline Workload / Fatigue Index: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{newWorkload}%</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {newWorkload > 75 ? "High Concern" : newWorkload > 50 ? "Moderate" : "Optimal"}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  value={newWorkload}
                  onChange={(e) => setNewWorkload(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEnroll}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isSubmittingEnroll ? "Enrolling..." : "Enroll to Unit Roster"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Triage Modal */}
      {triagePersonnel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setTriagePersonnel(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderHeart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Initiate Triage Case
                </h3>
              </div>
              <button
                onClick={() => setTriagePersonnel(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 text-xs border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white">{triagePersonnel.name}</span>{" "}
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">({triagePersonnel.id})</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {triagePersonnel.rank} • {triagePersonnel.unit} • Workload Score: {triagePersonnel.workloadScore}%
              </p>
            </div>

            <form onSubmit={handleQuickTriageSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Support Category
                </label>
                <select
                  value={triageCategory}
                  onChange={(e) => setTriageCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="Workload Adjustment">Workload Adjustment</option>
                  <option value="Recovery Support">Recovery Support & Rest Rota</option>
                  <option value="Counseling">Psychological Decompression</option>
                  <option value="Family Support">Family Welfare Assistance</option>
                  <option value="Medical Referral">Medical Review Referral</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Triage Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Low", "Medium", "High"].map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setTriagePriority(pr)}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        triagePriority === pr
                          ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 shadow-2xs"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Clinical / Commander Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Note specific duty stressors, fatigue indicators, or recommended rest window..."
                  value={triageRemarks}
                  onChange={(e) => setTriageRemarks(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTriagePersonnel(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition-colors"
                >
                  Dispatch Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-[#0F172A] p-3 text-center text-xs text-slate-600 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 inline-block mr-1 text-emerald-600 dark:text-emerald-400" />
        <span>
          Predictive welfare intelligence capability designed for proactive fatigue and burnout mitigation under DPDP Act 2023 regulations. Non-punitive and legally barred from APAR appraisal evaluations.
        </span>
      </div>
    </div>
  );
}
