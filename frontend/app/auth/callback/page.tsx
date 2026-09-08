"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [stepMessage, setStepMessage] = useState("Verifying Google OAuth 2.0 Credentials...");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function processOAuth() {
      try {
        const error = searchParams.get("error");
        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        const token = searchParams.get("token");
        const role = searchParams.get("role");
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        // Case 1: Direct token redirect from backend
        if (token) {
          setStepMessage("Cryptographic token validated. Establishing secure session...");
          localStorage.setItem("token", token);
          const userData = {
            name: name ? decodeURIComponent(name) : "Officer",
            email: email ? decodeURIComponent(email) : "",
            role: role || "WELFARE_OFFICER",
          };
          localStorage.setItem("user", JSON.stringify(userData));
          window.dispatchEvent(new Event("missionwell_auth_changed"));

          setStatus("success");
          setStepMessage("Authentication complete. Routing to Command Terminal...");

          setTimeout(() => {
            if (role === "COMMANDER") router.push("/command");
            else if (role === "PERSONNEL") router.push("/checkin");
            else if (role === "ADMIN") router.push("/admin");
            else router.push("/dashboard");
          }, 900);
          return;
        }

        // Case 2: Code exchange required
        if (code) {
          setStepMessage("Exchanging OAuth authorization code with Identity Provider...");
          const res = await fetch("/api/auth/google/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              state,
              redirectUri: `${window.location.origin}/auth/callback`,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.error || "Failed to complete Google authentication");
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("missionwell_auth_changed"));

          setStatus("success");
          setStepMessage("Identity verified. Initializing encrypted profile...");

          const userRole = data.user?.role;
          setTimeout(() => {
            if (userRole === "COMMANDER") router.push("/command");
            else if (userRole === "PERSONNEL") router.push("/checkin");
            else if (userRole === "ADMIN") router.push("/admin");
            else router.push("/dashboard");
          }, 900);
          return;
        }

        throw new Error("No authorization credentials received from Google.");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "An unexpected error occurred during Google sign-in.");
      }
    }

    processOAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-navy-700/60 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 mb-6 shadow-inner">
            {status === "processing" && (
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-bounce" />
            )}
            {status === "error" && (
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              DPDP 2023 Secure Gateway
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight mb-2">
            {status === "processing" && "Processing Google Single Sign-On"}
            {status === "success" && "Authentication Authorized"}
            {status === "error" && "Authentication Failed"}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 min-h-[40px]">
            {status === "error" ? errorMessage : stepMessage}
          </p>

          {status === "processing" && (
            <div className="mt-6 w-full bg-slate-100 dark:bg-navy-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 h-full w-full animate-pulse" />
            </div>
          )}

          {status === "error" && (
            <div className="mt-6">
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-navy-700 dark:hover:bg-navy-600 text-white font-medium rounded-xl text-sm transition-all shadow-md"
              >
                Return to Login
              </button>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Identity Services 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
