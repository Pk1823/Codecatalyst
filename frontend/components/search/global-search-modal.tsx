"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderHeart, User, LineChart, Sparkles, X, ChevronRight } from "lucide-react";
import { MOCK_PERSONNEL } from "@/lib/mock-data/personnel";
import { MOCK_WELFARE_CASES, MOCK_RECOMMENDATIONS } from "@/lib/mock-data/cases";

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const matchedPersonnel = q
    ? MOCK_PERSONNEL.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.unit.toLowerCase().includes(q) ||
          p.anonymizedCode.toLowerCase().includes(q)
      )
    : MOCK_PERSONNEL.slice(0, 3);

  const matchedCases = q
    ? MOCK_WELFARE_CASES.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.personnelId.toLowerCase().includes(q) ||
          c.primaryConcern.toLowerCase().includes(q) ||
          c.unit.toLowerCase().includes(q)
      )
    : MOCK_WELFARE_CASES.slice(0, 2);

  const matchedRecommendations = q
    ? MOCK_RECOMMENDATIONS.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.targetUnit?.toLowerCase().includes(q)
      )
    : MOCK_RECOMMENDATIONS.slice(0, 2);

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search by Personnel ID (e.g. P-1024), Case ID, Unit, or Recommendation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent py-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Personnel Results */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              <span>Personnel & Risk Profiles</span>
              <span>{matchedPersonnel.length} found</span>
            </div>
            <div className="space-y-1">
              {matchedPersonnel.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigateTo(`/analytics/personnel/${p.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {p.name} ({p.id})
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {p.rank} • {p.unit} • {p.workloadStatus} Workload
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      View AI Analysis
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Welfare Cases Results */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              <span>Welfare Cases</span>
              <span>{matchedCases.length} found</span>
            </div>
            <div className="space-y-1">
              {matchedCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigateTo(`/welfare/cases/${c.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                      <FolderHeart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {c.id} • {c.primaryConcern}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Officer: {c.assignedOfficer} • Status: {c.status}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              <span>AI Welfare Recommendations</span>
              <span>{matchedRecommendations.length} found</span>
            </div>
            <div className="space-y-1">
              {matchedRecommendations.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigateTo(`/recommendations`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {r.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Target: {r.targetUnit || "Force-wide"} • {r.impactLevel} Priority
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press ESC to close or click any item to jump directly</span>
          <span>MissionWell Quick Intelligence</span>
        </div>
      </div>
    </div>
  );
}
