"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HandHelping,
  ShieldCheck,
  CheckCircle2,
  Send,
  Phone,
  MessageSquare,
  User,
  ArrowRight,
  Moon,
  Stethoscope,
  Home,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { WelfareService } from "@/services/welfare.service";
import { useToast } from "@/components/providers";

export default function RequestSupportPage() {
  const { toast } = useToast();
  const [supportType, setSupportType] = useState("Workload Review");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [preferredContact, setPreferredContact] = useState("Welfare Officer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast({
        title: "Please add a brief description",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await WelfareService.createSupportRequestCase({
        personnelId: "P-1024",
        supportType,
        priority,
        description,
        preferredContact,
      });

      setCreatedCaseId(created.id);
      toast({
        title: "Support Request Submitted",
        description: `Your request was logged as ${created.id}. Assigned to Dr. Aarti Sharma.`,
        type: "success",
      });
    } catch {
      toast({
        title: "Error submitting support request",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdCaseId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-8 text-center space-y-6 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Confidential Welfare Intake Confirmed
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Your support request has been submitted.
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tracking Case ID: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{createdCaseId}</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 text-left text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              <span className="text-slate-500 dark:text-slate-400">Assigned Welfare Officer:</span>{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">Dr. Aarti Sharma (Deputy Commandant)</strong>
            </p>
            <p>
              <span className="text-slate-500 dark:text-slate-400">Category:</span>{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">{supportType} ({priority} Priority)</strong>
            </p>
            <p>
              <span className="text-slate-500 dark:text-slate-400">Preferred Contact:</span>{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">{preferredContact}</strong>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              A welfare officer will review your request confidentially. You may expect initial contact within 24–48 hours without any career prejudice or service notification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/personnel"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-semibold shadow-xs transition-all"
            >
              <span>Back to Wellbeing Overview</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                setCreatedCaseId(null);
                setDescription("");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Confidentiality Header */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3 shadow-xs">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Confidential Welfare Channel:</span> All requests are handled exclusively by authorized medical/welfare officers and are strictly protected under Force Welfare Regulations.
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-md">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Request Welfare Support
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit a confidential request for workload adjustment, counseling, rest recovery, or family welfare.
          </p>
        </div>

        {/* 1-Click Quick Templates */}
        <div className="mb-6 space-y-2 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>1-Click Quick Templates (Click to auto-fill)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {[
              {
                icon: Moon,
                color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
                title: "Rest / Stand-Down Relief",
                type: "Recovery Support",
                pri: "High",
                draft: "Requesting a 48-hour operational stand-down rest following consecutive night shifts and fatigue.",
              },
              {
                icon: Stethoscope,
                color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
                title: "Medical / Doctor Consultation",
                type: "Medical Referral",
                pri: "Medium",
                draft: "Requesting medical officer consultation for persistent physical fatigue, headache, or sleep disruption.",
              },
              {
                icon: Home,
                color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
                title: "Family Emergency / Leave Assistance",
                type: "Family/Welfare Support",
                pri: "High",
                draft: "Requesting welfare officer assistance regarding an urgent family situation and compassionate leave coordination.",
              },
              {
                icon: HeartPulse,
                color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
                title: "Talk with Welfare Officer",
                type: "Counseling",
                pri: "Medium",
                draft: "Requesting a confidential 1-on-1 discussion with the Welfare Officer regarding operational strain and personal wellbeing.",
              },
            ].map((tmpl) => {
              const TIcon = tmpl.icon;
              return (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => {
                    setSupportType(tmpl.type);
                    setPriority(tmpl.pri);
                    setDescription(tmpl.draft);
                    toast({
                      title: `Selected: ${tmpl.title}`,
                      description: "Form pre-filled. You can customize the description below before submitting.",
                      type: "info",
                    });
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition-all flex items-start gap-2.5 group shadow-2xs cursor-pointer hover:border-emerald-500/50"
                >
                  <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${tmpl.color}`}>
                    <TIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {tmpl.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {tmpl.draft}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Support Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider font-mono">
              Support Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                "Counseling",
                "Workload Review",
                "Recovery Support",
                "Family/Welfare Support",
                "Medical Referral",
                "General Assistance",
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSupportType(type)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    supportType === type
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500/50 shadow-2xs font-semibold"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider font-mono">
              Priority Urgency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Low", desc: "Routine review (within 7 days)" },
                { label: "Medium", desc: "Timely review (within 48 hrs)" },
                { label: "High", desc: "Urgent check-in (within 24 hrs)" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPriority(p.label)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    priority === p.label
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500/50 shadow-2xs font-semibold"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider font-mono">
              Preferred Contact Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "Welfare Officer", icon: User },
                { id: "Phone", icon: Phone },
                { id: "In-person", icon: HandHelping },
                { id: "Secure Message", icon: MessageSquare },
              ].map((c) => {
                const CIcon = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPreferredContact(c.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      preferredContact === c.id
                        ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500/50 font-semibold"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                    }`}
                  >
                    <CIcon className="h-3.5 w-3.5" />
                    <span>{c.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
              Description / Circumstances
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe your request or current duty stress (e.g. consecutive night shifts, need for family leave assistance, physical exhaustion)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Submitting Request..." : "Submit Support Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
