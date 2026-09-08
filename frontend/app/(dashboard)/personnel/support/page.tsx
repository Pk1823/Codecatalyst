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
        <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-8 text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Confidential Welfare Intake Confirmed
            </span>
            <h2 className="text-xl font-bold text-[#F8FAFC] mt-1">
              Your support request has been submitted.
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tracking Case ID: <span className="font-mono font-bold text-emerald-400">{createdCaseId}</span>
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 text-left text-xs space-y-2 text-slate-300">
            <p>
              <span className="text-slate-400">Assigned Welfare Officer:</span>{" "}
              <strong className="text-slate-200">Dr. Aarti Sharma (Deputy Commandant)</strong>
            </p>
            <p>
              <span className="text-slate-400">Category:</span>{" "}
              <strong className="text-slate-200">{supportType} ({priority} Priority)</strong>
            </p>
            <p>
              <span className="text-slate-400">Preferred Contact:</span>{" "}
              <strong className="text-slate-200">{preferredContact}</strong>
            </p>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              A welfare officer will review your request confidentially. You may expect initial contact within 24–48 hours without any career prejudice or service notification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/personnel"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#090D16] px-5 py-2.5 text-xs font-semibold transition-all"
            >
              <span>Back to Wellbeing Overview</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                setCreatedCaseId(null);
                setDescription("");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
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
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-emerald-400">Confidential Welfare Channel:</span> All requests are handled exclusively by authorized medical/welfare officers and are strictly protected under Force Welfare Regulations.
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#F8FAFC]">
            Request Welfare Support
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Submit a confidential request for workload adjustment, counseling, rest recovery, or family welfare.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Support Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
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
                  className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                    supportType === type
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/50"
                      : "border-slate-800 bg-[#090D16] text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
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
                  className={`p-3 rounded-lg border text-left transition-all ${
                    priority === p.label
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/50"
                      : "border-slate-800 bg-[#090D16] text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
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
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      preferredContact === c.id
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/50"
                        : "border-slate-800 bg-[#090D16] text-slate-300 hover:bg-slate-800/60"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
              Description / Circumstances
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe your request or current duty stress (e.g. consecutive night shifts, need for family leave assistance, physical exhaustion)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#090D16] p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#090D16] py-3 text-xs font-semibold transition-all disabled:opacity-50"
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
