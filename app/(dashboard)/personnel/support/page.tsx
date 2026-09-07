"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HandHelping,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
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
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-6 shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Confidential Welfare Intake Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              Your support request has been submitted.
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tracking Case ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{createdCaseId}</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-left text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              <strong>Assigned Welfare Officer:</strong> Dr. Aarti Sharma (Deputy Commandant)
            </p>
            <p>
              <strong>Category:</strong> {supportType} ({priority} Priority)
            </p>
            <p>
              <strong>Preferred Contact:</strong> {preferredContact}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              A welfare officer will review your request confidentially. You may expect initial contact within 24–48 hours without any career prejudice or service notification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/personnel"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 text-xs font-bold transition-all"
            >
              <span>Back to Wellbeing Overview</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                setCreatedCaseId(null);
                setDescription("");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
      <div className="rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/70 dark:bg-teal-950/40 p-4 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
        <div className="text-xs text-teal-900 dark:text-teal-200">
          <span className="font-bold">Confidential Welfare Channel.</span> All requests are handled exclusively by authorized medical/welfare officers and are strictly protected under Force Welfare Regulations.
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Request Welfare Support
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit a request for workload adjustment, counseling, rest recovery, or family welfare.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Support Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
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
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    supportType === type
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
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
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
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
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      preferredContact === c.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Description / Circumstances
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe your request or current duty stress (e.g. consecutive night shifts, need for family leave assistance, physical exhaustion)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white py-3 text-xs font-bold shadow-md shadow-blue-900/30 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Submitting Request..." : "Request Support"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
