"use client";

import React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Smartphone,
  ShieldCheck,
  Lock,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { useAuth } from "@/components/providers";

export default function WellnessAssessmentPage() {
  const { lang } = useAuth();
  const isHi = lang === "hi";

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 sm:py-8">
      {/* Back Navigation */}
      <Link
        href="/personnel"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>{isHi ? "वापस डैशबोर्ड पर" : "Back to Overview"}</span>
      </Link>

      {/* Main Notice Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B132B] p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header with Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHi ? "सैनिक मूल्यांकन केवल मोबाइल ऐप पर" : "Soldier Assessment (Mobile App Only)"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi
                  ? "गृह मंत्रालय एवं डीपीडीपी अधिनियम 2023 के तहत वेब मूल्यांकन प्रतिबंधित है"
                  : "Web-based assessment submission is disabled under MHA & DPDP 2023 directives"}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 self-start sm:self-center">
            <ShieldCheck className="h-3.5 w-3.5" />
            DPDP Guard Active
          </span>
        </div>

        {/* Security & Confidentiality Explanation */}
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{isHi ? "वैधानिक सुरक्षा एवं गैर-दंडात्मक गोपनीयता प्रोटोकॉल:" : "Statutory Privacy & Non-Punitive Protocol:"}</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300/90 leading-normal">
            {isHi
              ? "कार्यस्थल अथवा शेयर्ड कंप्यूटरों पर सैनिक का मानसिक व शारीरिक स्वास्थ्य मूल्यांकन भरना पूर्णतः प्रतिबंधित है ताकि किसी भी सहकर्मी या कमांडर द्वारा स्क्रीन पर उत्तर न देखे जा सकें। मूल्यांकन केवल सैनिक के निजी फोन अथवा टैक्टिकल डिवाइस पर मिशनवेल मोबाइल ऐप के माध्यम से ही स्वीकार किया जाता है।"
              : "To guarantee zero-stigmatization and safeguard personnel from workplace observation, self-assessments cannot be administered on open desktop browsers or shared workstations. All voluntary assessments must be submitted through the confidential MissionWell Mobile Application on your personal smartphone."}
          </p>
        </div>

        {/* Interactive QR Code Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3.5 rounded-xl bg-white shadow-md border border-slate-200 text-slate-900">
              <QRCodeSVG
                value="http://192.168.1.30:8082/personnel"
                size={160}
                level="H"
                fgColor="#0F172A"
                bgColor="#FFFFFF"
              />
            </div>
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {isHi ? "फोन कैमरे अथवा Expo Go से स्कैन करें" : "Scan to Launch Mobile App"}
              </span>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                exp://192.168.1.30:8082
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {isHi ? "मोबाइल ऐप पर मूल्यांकन के 3 सरल चरण:" : "3 Simple Steps on Mobile:"}
            </h3>
            
            <ol className="space-y-2.5 list-decimal list-inside text-[11px] leading-relaxed">
              <li>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {isHi ? "मोबाइल ऐप खोलें" : "Open Mobile App"}:
                </span>{" "}
                {isHi ? "दिए गए क्यूआर कोड को अपने फोन से स्कैन करें।" : "Scan the QR code or open Expo Go."}
              </li>
              <li>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {isHi ? "60-सेकंड त्वरित चेक-इन" : "60-Second Check-in"}:
                </span>{" "}
                {isHi ? "ड्यूटी के घंटे, नींद व थकान पर 6 त्वरित प्रश्नों के उत्तर दें।" : "Answer 6 rapid check-in questions on workload & rest."}
              </li>
              <li>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {isHi ? "100% गोपनीय रिकॉर्ड" : "Encrypted Vault"}:
                </span>{" "}
                {isHi ? "डेटा सीधे सुरक्षित एन्क्रिप्शन के साथ वेलफेयर हब में सिंक होगा।" : "Your assessment records safely in the confidential welfare hub."}
              </li>
            </ol>

            <div className="pt-2">
              <a
                href="http://localhost:8082/personnel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>{isHi ? "मोबाइल ऐप वेब प्रीव्यू खोलें (Port 8082)" : "Open Mobile Web Preview (Port 8082)"}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-blue-500" />
            <span>{isHi ? "शून्य एसीआर/एपीएआर लिंकेज गारंटी" : "Zero APAR / ACR Career Linkage Guarantee"}</span>
          </div>
          <span>Ministry of Home Affairs • CAPF</span>
        </div>

      </div>
    </div>
  );
}
