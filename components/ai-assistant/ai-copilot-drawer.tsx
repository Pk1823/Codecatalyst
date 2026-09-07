"use client";

import React, { useState } from "react";
import { Sparkles, Brain, Shield, Send, X, Bot, User as UserIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function AICopilotDrawer() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Namaste. I am your MissionWell Welfare Intelligence Assistant. I provide operational decision-support, workload summaries, and welfare indicator analysis for authorized officers. How may I assist your welfare review today?",
      timestamp: "Just now",
    },
  ]);

  const quickPrompts = [
    "Which units show elevated workload pressure?",
    "Summarize active welfare interventions in Bravo Company",
    "Explain the risk factors for Personnel P-1024",
    "What are the force-wide leave utilization trends?",
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Simulated AI response engine with safety boundaries
    setTimeout(() => {
      let responseText = "Based on current synthetic datasets, force readiness remains steady. For specific personnel inquiries, please verify role authorization.";

      const lower = q.toLowerCase();
      if (lower.includes("elevated workload") || lower.includes("units")) {
        responseText =
          "Based on the simulated dataset, Units Alpha, Bravo, and Echo show elevated workload indicators exceeding the 65% baseline. Average deployment duration in these units is currently 161 days, with night-duty duty hours averaging 68 hrs/week. Recommended action: Consider rotational duty reallocation and sanctioning pending leave requests.";
      } else if (lower.includes("p-1024") || lower.includes("piyush")) {
        responseText =
          "Personnel P-1024 (Ct. Piyush Kumar, Bravo Coy) shows an elevated welfare risk index of 72/100 (HIGH). Contributing factors: 142 continuous deployment days (27%), elevated duty hours averaging 68 hrs/week (23%), and fragmented sleep recovery cycles of 5.5 hours (19%). Case CASE-2025-042 is currently active with a rotational duty intervention assigned.";
      } else if (lower.includes("bravo") || lower.includes("intervention")) {
        responseText =
          "In Bravo Company, there are currently 2 active welfare interventions: 1) Rotational Duty Reassignment for P-1024 to daytime logistics; 2) Voluntary Stress Decompression & Sleep Hygiene guidance. Leave clearance drives have also been recommended for the upcoming rotation cycle.";
      } else if (lower.includes("leave") || lower.includes("trend")) {
        responseText =
          "Force-wide leave utilization is currently at 32.8% YTD, which is approximately 18% below the peacetime operational baseline. Units Alpha and Echo show the lowest leave consumption rates (24.5% and 22.8% respectively) due to successive border and field attachments.";
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
        aria-label="Open MissionWell AI Decision Support Assistant"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
        </div>
        <span className="hidden sm:inline">MissionWell AI</span>
        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">COPILOT</span>
      </button>

      {/* Slide-out Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-teal-600 text-white shadow-xs">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">MissionWell AI</h2>
                    <span className="rounded-xs bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase">
                      Decision Support
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Personnel Welfare Intelligence Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* AI Ethical & Operational Guard Disclaimer */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 px-3.5 py-2 border-b border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Shield className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>
                AI-generated decision support. Verify insights before taking action. Does not provide clinical diagnoses.
              </span>
            </div>

            {/* Chat Conversation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2.5 max-w-[88%]",
                    m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                      m.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gradient-to-tr from-slate-800 to-slate-700 dark:from-teal-900 dark:to-blue-900 text-teal-300"
                    )}
                  >
                    {m.sender === "user" ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs",
                        m.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-xs"
                          : "bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs"
                      )}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block px-1">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Quick Prompt Suggestions */}
              {messages.length < 3 && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Suggested Welfare Queries:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {quickPrompts.map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(qp)}
                        className="text-left text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        ⚡ {qp}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask regarding welfare trends, units, or risk..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-lg bg-blue-700 dark:bg-blue-600 p-2 text-white hover:bg-blue-800 disabled:opacity-40 transition-opacity"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                MissionWell AI Decision Support Engine • Zero Diagnostic Autonomy
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
