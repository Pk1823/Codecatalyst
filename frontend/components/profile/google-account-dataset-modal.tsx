"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Mail,
  CheckCircle2,
  Calendar,
  MapPin,
  HeartPulse,
  Activity,
  Clock,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Copy,
  Check,
  Layers,
  FileText,
  AlertCircle,
  Briefcase,
  Moon,
  Info,
  BadgeCheck,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useAuth, useToast } from "@/components/providers";
import { ProfileService, PersonFullDataset, CustomDatasetDetail } from "@/services/profile.service";

interface GoogleAccountDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPersonnelId?: string;
}

export function GoogleAccountDatasetModal({
  isOpen,
  onClose,
  targetPersonnelId,
}: GoogleAccountDatasetModalProps) {
  const { user, role, force, lang } = useAuth();
  const { toast } = useToast();
  const isHi = lang === "hi";

  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<PersonFullDataset | null>(null);
  const [activeTab, setActiveTab] = useState<"google" | "military" | "wellness" | "custom">("google");
  const [copiedSub, setCopiedSub] = useState(false);

  // Add Detail Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<"customDetail" | "deployment" | "dutySchedule">("customDetail");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for adding details
  const [customCategory, setCustomCategory] = useState("Operational Note");
  const [customLabel, setCustomLabel] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const [depLocation, setDepLocation] = useState("");
  const [depTerrain, setDepTerrain] = useState("Counter-Insurgency Grid");
  const [depDays, setDepDays] = useState("14");

  const [shiftType, setShiftType] = useState("Day Sentry");
  const [shiftHours, setShiftHours] = useState("8");
  const [isNightShift, setIsNightShift] = useState(false);

  // Core details edit state
  const [isEditCoreOpen, setIsEditCoreOpen] = useState(false);
  const [editBloodGroup, setEditBloodGroup] = useState("B+");
  const [editBaseLocation, setEditBaseLocation] = useState("");
  const [editDutyStatus, setEditDutyStatus] = useState("Active Duty");

  const loadDataset = async () => {
    setLoading(true);
    try {
      const data = await ProfileService.getProfileDataset(targetPersonnelId);
      setDataset(data);
      if (data.personnel) {
        setEditBloodGroup(data.personnel.bloodGroup || "B+");
        setEditBaseLocation(data.personnel.baseLocation || "");
        setEditDutyStatus(data.personnel.currentDutyStatus || "Active Duty");
      }
    } catch (err: any) {
      toast({
        title: isHi ? "डेटा लोड त्रुटि" : "Error Loading Dataset",
        description: err?.message || "Could not fetch profile dataset.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDataset();
    }
  }, [isOpen, targetPersonnelId, role]);

  if (!isOpen) return null;

  const isAuthorized = dataset?.authorization?.isAuthorizedOfficer ?? (role === "ADMIN" || role === "WELFARE_OFFICER");
  const p = dataset?.personnel;
  const g = dataset?.googleAccount;

  const copyGoogleSub = () => {
    if (g?.googleSub) {
      navigator.clipboard.writeText(g.googleSub);
      setCopiedSub(true);
      setTimeout(() => setCopiedSub(false), 2000);
      toast({
        title: isHi ? "कॉपी किया गया" : "Copied to Clipboard",
        description: `Google Sub ID: ${g.googleSub}`,
        type: "success",
      });
    }
  };

  // Handler: Add a detail
  const handleAddDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p?.id) return;

    if (!isAuthorized) {
      toast({
        title: isHi ? "अनुमति अस्वीकृत" : "Access Denied",
        description: isHi
          ? "केवल अधिकृत कल्याण अधिकारी या व्यवस्थापक ही विवरण जोड़ सकते हैं।"
          : "Only authorized Welfare Officers or System Admins can add details to this dataset.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (addType === "customDetail") {
        if (!customLabel.trim() || !customValue.trim()) {
          toast({ title: "Validation Error", description: "Label and Value are required.", type: "warning" });
          setIsSubmitting(false);
          return;
        }
        await ProfileService.addDatasetDetail(p.id, "customDetail", {
          category: customCategory,
          label: customLabel.trim(),
          value: customValue.trim(),
          notes: customNotes.trim(),
        });
      } else if (addType === "deployment") {
        if (!depLocation.trim()) {
          toast({ title: "Validation Error", description: "Deployment location is required.", type: "warning" });
          setIsSubmitting(false);
          return;
        }
        await ProfileService.addDatasetDetail(p.id, "deployment", {
          location: depLocation.trim(),
          terrain: depTerrain,
          consecutiveDays: Number(depDays) || 14,
          isCurrent: true,
          stressWeight: 1.1,
        });
      } else if (addType === "dutySchedule") {
        await ProfileService.addDatasetDetail(p.id, "dutySchedule", {
          shiftType,
          hours: Number(shiftHours) || 8,
          nightShift: isNightShift,
          date: new Date(),
        });
      }

      toast({
        title: isHi ? "विवरण जोड़ा गया" : "Detail Added Successfully",
        description: isHi ? "नया रिकॉर्ड सुरक्षित रूप से दर्ज किया गया।" : "New record securely stored in personnel dataset.",
        type: "success",
      });

      // Reset & Reload
      setCustomLabel("");
      setCustomValue("");
      setCustomNotes("");
      setDepLocation("");
      setIsAddModalOpen(false);
      await loadDataset();
    } catch (err: any) {
      toast({
        title: isHi ? "त्रुटि" : "Operation Failed",
        description: err?.message || "Failed to add detail.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Remove detail
  const handleRemoveDetail = async (type: "customDetail" | "deployment" | "dutySchedule", id: string, label: string) => {
    if (!p?.id) return;

    if (!isAuthorized) {
      toast({
        title: isHi ? "अनुमति अस्वीकृत" : "Access Denied",
        description: isHi
          ? "केवल अधिकृत कल्याण अधिकारी या व्यवस्थापक ही रिकॉर्ड हटा सकते हैं।"
          : "Only authorized Welfare Officers or System Admins can remove records.",
        type: "error",
      });
      return;
    }

    const confirmMsg = isHi
      ? `क्या आप वाकई '${label}' को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।`
      : `Are you sure you want to remove '${label}' from this dataset? This zero-trust action is audited.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await ProfileService.removeDatasetDetail(p.id, type, id);
      toast({
        title: isHi ? "हटा दिया गया" : "Detail Removed",
        description: `'${label}' has been securely removed from dataset.`,
        type: "info",
      });
      await loadDataset();
    } catch (err: any) {
      toast({
        title: isHi ? "त्रुटि" : "Deletion Failed",
        description: err?.message || "Failed to remove detail.",
        type: "error",
      });
    }
  };

  // Handler: Update Core Personnel Details
  const handleUpdateCore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p?.id) return;

    if (!isAuthorized) {
      toast({
        title: "Access Denied",
        description: "Only authorized officers can update core military personnel records.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await ProfileService.addDatasetDetail(p.id, "coreUpdate", {
        bloodGroup: editBloodGroup,
        baseLocation: editBaseLocation,
        currentDutyStatus: editDutyStatus,
      });

      toast({
        title: isHi ? "सफलतापूर्वक अद्यतित" : "Core Details Updated",
        description: "Personnel base station, blood group, and duty status saved.",
        type: "success",
      });
      setIsEditCoreOpen(false);
      await loadDataset();
    } catch (err: any) {
      toast({ title: "Update Failed", description: err?.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Top Military Cyber Banner */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  {isHi ? "गूगल खाता एवं समग्र कार्मिक डेटासेट" : "Google Account & Comprehensive Person Dataset"}
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {isHi ? "एमएचए शून्य-विश्वास सुरक्षा प्रोटोकॉल • डीपीए 2023 अनुपालन" : "MHA Zero-Trust Defense Security Protocol • DPDP Act Compliant"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDataset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh dataset from backend"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Authorization Policy Banner */}
        <div className={`px-5 py-2 text-xs flex items-center justify-between border-b ${
          isAuthorized
            ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
            : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300"
        }`}>
          <div className="flex items-center gap-2">
            {isAuthorized ? (
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <span className="font-medium">
              {isAuthorized
                ? isHi
                  ? "अधिकृत अधिकारी निकासी: आपको कार्मिक डेटासेट में विवरण बनाने, जोड़ने और हटाने की पूर्ण अनुमति है।"
                  : "Authorized Officer Clearance: You have full administrative permission to Create, Add, Edit, and Remove details."
                : isHi
                  ? "कार्मिक (जवान) मोड: डेटा अखंडता नियमों के तहत परिचालन रिकॉर्ड में संशोधन प्रतिबंधित है।"
                  : "Personnel Mode: Modifications to official operational records are restricted to authorized Welfare Officers."}
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/60 dark:bg-black/30 border border-current">
            {dataset?.authorization?.clearanceLevel || `${role} ACCESS`}
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading && !dataset ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="h-7 w-7 animate-spin text-blue-500" />
              <p className="text-xs font-mono">{isHi ? "डेटासेट प्राप्त किया जा रहा है..." : "Fetching Google account & defense dataset..."}</p>
            </div>
          ) : (
            <>
              {/* Top Hero: Verified Google Account Profile Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/40 via-slate-50 to-emerald-50/30 dark:from-blue-950/20 dark:via-slate-900/40 dark:to-emerald-950/20 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={g?.avatarUrl || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
                        alt={g?.name || "Google User"}
                        className="h-16 w-16 rounded-full object-cover border-2 border-emerald-500/80 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">{g?.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                          {g?.role?.replace("_", " ")}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          {g?.force}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{g?.email}</span>
                        {g?.emailVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold ml-1">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-0.5">
                        <span>Service ID: <strong className="text-slate-700 dark:text-slate-200">{g?.serviceId}</strong></span>
                        <span>•</span>
                        <span>Unit: <strong className="text-slate-700 dark:text-slate-200">{g?.unitName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Google Account Sub ID Pill */}
                  {g?.googleSub && (
                    <div className="flex flex-col items-start sm:items-end gap-1 text-[11px] font-mono bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Google Account Identifier (sub)</span>
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <span>{g.googleSub}</span>
                        <button
                          onClick={copyGoogleSub}
                          className="p-1 hover:text-blue-500 transition-colors"
                          title="Copy Google Sub ID"
                        >
                          {copiedSub ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1 text-xs">
                  {[
                    { id: "google", label: isHi ? "गूगल पहचान" : "Google Identity", icon: User },
                    { id: "military", label: isHi ? "परिचालन डेटासेट" : "Operational Dataset", icon: Briefcase },
                    { id: "wellness", label: isHi ? "कल्याण एवं टेलीमेट्री" : "Wellness & Telemetry", icon: HeartPulse },
                    { id: "custom", label: isHi ? "कस्टम विवरण (CRUD)" : `Custom Details (${dataset?.customDetails?.length || 0})`, icon: Layers },
                  ].map((t) => {
                    const TIcon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          activeTab === t.id
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <TIcon className="h-3.5 w-3.5" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Authorized Action: Add Detail Button */}
                {isAuthorized && (
                  <button
                    onClick={() => {
                      setAddType("customDetail");
                      setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isHi ? "विवरण जोड़ें" : "Add Detail"}</span>
                  </button>
                )}
              </div>

              {/* TAB 1: Google Identity & Core Metadata */}
              {activeTab === "google" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        Google Identity Parameters
                      </span>
                      <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span>Primary Email:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-200">{g?.email}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span>Auth Protocol:</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{g?.authProvider}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span>Email Status:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Verified by Google</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Session Creation:</span>
                          <span>{g?.accountCreated ? new Date(g.accountCreated).toLocaleString() : "Active"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        Linked Paramilitary Identity
                      </span>
                      <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span>Service Number:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-200">{g?.serviceId}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span>Force Branch:</span>
                          <span className="font-bold text-slate-900 dark:text-slate-200">{g?.force}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span>Designated Rank:</span>
                          <span>{g?.rank}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Assigned Directorate:</span>
                          <span>{g?.department}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Deployments</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
                        {p?.deployments?.length || 1} Stationings
                      </span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Deploy Days</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                        {p?.activeDeployDays || 18} Days
                      </span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Wellness Indicator</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                        {p?.wellnessAssessments?.[0]?.score ? `${p.wellnessAssessments[0].score}%` : "74% Optimal"}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Custom Records</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5 block">
                        {dataset?.customDetails?.length || 0} Attributes
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Operational Military Dataset */}
              {activeTab === "military" && (
                <div className="space-y-4 text-xs">
                  {/* Core Military Attributes Card */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-amber-500" />
                        Core Military Record
                      </h4>
                      {isAuthorized && (
                        <button
                          onClick={() => setIsEditCoreOpen(!isEditCoreOpen)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>{isEditCoreOpen ? "Cancel Edit" : "Edit Core Details"}</span>
                        </button>
                      )}
                    </div>

                    {isEditCoreOpen ? (
                      <form onSubmit={handleUpdateCore} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Blood Group</label>
                          <select
                            value={editBloodGroup}
                            onChange={(e) => setEditBloodGroup(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                          >
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Base Location</label>
                          <input
                            type="text"
                            value={editBaseLocation}
                            onChange={(e) => setEditBaseLocation(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Duty Status</label>
                          <select
                            value={editDutyStatus}
                            onChange={(e) => setEditDutyStatus(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                          >
                            {["Active Duty", "Stand-Down", "On Leave", "Medical Review"].map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                          >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Personnel ID:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{p?.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Blood Group:</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400">{p?.bloodGroup || "O+"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Base Location:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{p?.baseLocation || "Srinagar Base"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Duty Status:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{p?.currentDutyStatus || "Active Duty"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Deployments List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        Stationing & Deployments
                      </h4>
                      {isAuthorized && (
                        <button
                          onClick={() => {
                            setAddType("deployment");
                            setIsAddModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Deployment</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {p?.deployments && p.deployments.length > 0 ? (
                        p.deployments.map((dep: any) => (
                          <div
                            key={dep.id}
                            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">{dep.location}</span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                  {dep.terrain}
                                </span>
                                {dep.isCurrent && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-mono">
                                Consecutive Days: {dep.consecutiveDays || 0} • Stress Weight: {dep.stressWeight || 1.0}x
                              </p>
                            </div>

                            {isAuthorized && (
                              <button
                                onClick={() => handleRemoveDetail("deployment", dep.id, dep.location)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Remove deployment record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 py-3 text-center">No deployment records stored.</p>
                      )}
                    </div>
                  </div>

                  {/* Duty Shifts */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Duty Shifts & Operational Schedules
                      </h4>
                      {isAuthorized && (
                        <button
                          onClick={() => {
                            setAddType("dutySchedule");
                            setIsAddModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Duty Shift</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {p?.dutySchedules && p.dutySchedules.length > 0 ? (
                        p.dutySchedules.map((sch: any) => (
                          <div
                            key={sch.id}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-slate-900 dark:text-white">{sch.shiftType}</span>
                              <span className="font-mono text-slate-500">{sch.hours} Hours</span>
                              {sch.nightShift && (
                                <span className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-mono font-semibold">
                                  <Moon className="h-3 w-3" /> Night
                                </span>
                              )}
                            </div>

                            {isAuthorized && (
                              <button
                                onClick={() => handleRemoveDetail("dutySchedule", sch.id, sch.shiftType)}
                                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                title="Remove duty schedule"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 py-2 text-center">No specific shift schedules listed.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Wellness, Health & Telemetry */}
              {activeTab === "wellness" && (
                <div className="space-y-4 text-xs">
                  {/* Workload 5-Day Telemetry */}
                  {p?.workloadRecords?.[0] && (
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        5-Day Operational Workload Telemetry
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-400 block">5-Day Duty Hours:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{p.workloadRecords[0].dutyHours5d} hrs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Night Shifts:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">{p.workloadRecords[0].nightShifts5d}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Average Sleep:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{p.workloadRecords[0].sleepHoursAvg} hrs/night</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Unavailed Leaves:</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">{p.workloadRecords[0].leaveDaysUnavailed} Days</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assessments List */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <HeartPulse className="h-4 w-4 text-rose-500" />
                      Wellness Assessments & Psychological Ratings
                    </h4>

                    {p?.wellnessAssessments && p.wellnessAssessments.length > 0 ? (
                      p.wellnessAssessments.map((a: any) => (
                        <div
                          key={a.id}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                Overall Wellbeing: {a.score}%
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                {a.indicatorStatus}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(a.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            <div>Stress: <strong className="text-slate-800 dark:text-slate-200">{a.stressLevel}</strong></div>
                            <div>Fatigue: <strong className="text-slate-800 dark:text-slate-200">{a.fatigueLevel}</strong></div>
                            <div>Recovery: <strong className="text-slate-800 dark:text-slate-200">{a.recoveryStatus}</strong></div>
                          </div>

                          {a.recommendation && (
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                              💡 <em>Recommendation:</em> {a.recommendation}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 py-3 text-center">No assessments recorded.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Custom Details (Dynamic Key-Values & CRUD) */}
              {activeTab === "custom" && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-purple-500" />
                        Dynamic Person Attributes & Certifications
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isHi
                          ? "अधिकृत अधिकारी इस जवान के डेटासेट में कोई भी नया परिचालन या चिकित्सा विवरण जोड़ सकते हैं।"
                          : "Authorized officers can add custom attributes, specialized certifications, medical notes, or emergency contacts."}
                      </p>
                    </div>

                    {isAuthorized && (
                      <button
                        onClick={() => {
                          setAddType("customDetail");
                          setIsAddModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Attribute</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {dataset?.customDetails && dataset.customDetails.length > 0 ? (
                      dataset.customDetails.map((item: CustomDatasetDetail) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                {item.category}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white text-xs">
                                {item.label}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 pl-0.5">
                              {item.value}
                            </p>
                            {item.notes && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-0.5">
                                {item.notes}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pl-0.5 pt-0.5">
                              <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
                              {item.authorName && <span>• By: {item.authorName}</span>}
                            </div>
                          </div>

                          {isAuthorized && (
                            <button
                              onClick={() => handleRemoveDetail("customDetail", item.id, `${item.category}: ${item.label}`)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                              title="Remove custom attribute"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                        <Layers className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {isHi ? "कोई कस्टम विवरण अभी तक नहीं जोड़ा गया है।" : "No custom attributes added yet."}
                        </p>
                        {isAuthorized && (
                          <button
                            onClick={() => {
                              setAddType("customDetail");
                              setIsAddModalOpen(true);
                            }}
                            className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            + Add the first custom detail
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>MHA Zero-Trust Biometrics Protocol</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            {isHi ? "बंद करें" : "Close"}
          </button>
        </div>
      </div>

      {/* SUB-MODAL: Add Detail Modal Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-emerald-500" />
                {isHi ? "नया विवरण जोड़ें (अधिकृत)" : "Add Person Dataset Detail (Authorized)"}
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: "customDetail", label: "Custom Field" },
                { id: "deployment", label: "Deployment" },
                { id: "dutySchedule", label: "Duty Shift" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAddType(t.id as any)}
                  className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                    addType === t.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddDetail} className="space-y-3 text-xs">
              {addType === "customDetail" && (
                <>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs"
                    >
                      <option value="Operational Note">Operational Note</option>
                      <option value="Medical & Health Clearance">Medical & Health Clearance</option>
                      <option value="Commando / Weapon Certification">Commando / Weapon Certification</option>
                      <option value="Emergency Next-of-Kin Contact">Emergency Next-of-Kin Contact</option>
                      <option value="Psychological Resilience Review">Psychological Resilience Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Attribute Name / Label *</label>
                    <input
                      type="text"
                      placeholder="e.g., High-Altitude Acclimatization Status"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Attribute Value *</label>
                    <input
                      type="text"
                      placeholder="e.g., Certified Fit for >14,000 ft (Ladakh Grid)"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Confidential Notes (Optional)</label>
                    <textarea
                      placeholder="Add any administrative or clinical notes..."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs resize-none"
                    />
                  </div>
                </>
              )}

              {addType === "deployment" && (
                <>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Stationing Location *</label>
                    <input
                      type="text"
                      placeholder="e.g., Sector Outpost 9, Line of Control"
                      value={depLocation}
                      onChange={(e) => setDepLocation(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Terrain Grid</label>
                    <select
                      value={depTerrain}
                      onChange={(e) => setDepTerrain(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs"
                    >
                      <option value="High Altitude Glacier">High Altitude Glacier</option>
                      <option value="Counter-Insurgency Grid">Counter-Insurgency Grid</option>
                      <option value="Border Outpost / Picket">Border Outpost / Picket</option>
                      <option value="Dense Jungle / LWE Area">Dense Jungle / LWE Area</option>
                      <option value="Urban Security">Urban Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Consecutive Days)</label>
                    <input
                      type="number"
                      value={depDays}
                      onChange={(e) => setDepDays(e.target.value)}
                      min="1"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {addType === "dutySchedule" && (
                <>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Shift Type</label>
                    <select
                      value={shiftType}
                      onChange={(e) => setShiftType(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs"
                    >
                      <option value="Day Sentry">Day Sentry</option>
                      <option value="Night Watch">Night Watch</option>
                      <option value="Convoy Escort">Convoy Escort</option>
                      <option value="Patrol Duty">Patrol Duty</option>
                      <option value="Standby QRT">Standby QRT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      value={shiftHours}
                      onChange={(e) => setShiftHours(e.target.value)}
                      min="1"
                      max="24"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="nightShiftCheck"
                      checked={isNightShift}
                      onChange={(e) => setIsNightShift(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <label htmlFor="nightShiftCheck" className="text-slate-700 dark:text-slate-300">
                      Classified as Night Duty Shift
                    </label>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-xs"
                >
                  {isSubmitting ? "Adding..." : "Add to Dataset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
