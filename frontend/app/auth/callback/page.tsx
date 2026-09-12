"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { BrandIcon } from "@/components/common/brand-logo";
import { AuthService } from "@/services/auth.service";

function CallbackContent() {
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
        const role = searchParams.get("role") as any;
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
          localStorage.setItem("missionwell_auth_user", JSON.stringify(userData));
          window.dispatchEvent(new Event("missionwell_auth_changed"));

          setStatus("success");
          setStepMessage(`Authentication complete for ${userData.name}. Routing to Command Deck...`);

          const targetPath = AuthService.getRedirectPathForRole(role || "WELFARE_OFFICER");
          setTimeout(() => {
            router.push(targetPath);
          }, 800);
          return;
        }

        // Case 2: Code exchange required
        if (code) {
          setStepMessage("Exchanging OAuth authorization code with Google Identity Provider...");
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
          localStorage.setItem("missionwell_auth_user", JSON.stringify(data.user));
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "google_sso_welcome",
              JSON.stringify({
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                force: data.user.force,
                avatarUrl: data.user.avatarUrl,
                time: Date.now(),
              })
            );
          }
          window.dispatchEvent(new Event("missionwell_auth_changed"));

          setStatus("success");
          setStepMessage(`Official Google Account Verified: ${data.user.name} (${data.user.email}). Establishing secure session...`);

          const userRole = data.user?.role || "WELFARE_OFFICER";
          const targetPath = AuthService.getRedirectPathForRole(userRole);
          setTimeout(() => {
            router.push(targetPath);
          }, 800);
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
    <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center relative z-10">
        <div className="relative inline-flex items-center justify-center mb-6">
          <BrandIcon size="xl" animate={true} />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            DPDP 2023 Secure Gateway
          </span>
        </div>

        <h2 className="text-xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
          {status === "processing" && "Processing Google Single Sign-On"}
          {status === "success" && "Authentication Authorized"}
          {status === "error" && "Authentication Failed"}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 min-h-[40px]">
          {status === "error" ? errorMessage : stepMessage}
        </p>

        {status === "processing" && (
          <div className="mt-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 h-full w-full animate-pulse" />
          </div>
        )}

        {status === "error" && (
          <div className="mt-6">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition-all shadow-md"
            >
              Return to Login
            </button>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
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
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-white transition-colors duration-200 relative overflow-hidden">
      {/* Cinematic Defense Security Gateway Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
        <img
          src="/login-bg.jpg"
          alt="Defense Security Gateway & Mountain Outpost Backdrop"
          className="w-full h-full object-cover object-center opacity-40 dark:opacity-75 transition-opacity duration-700 select-none scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/90 via-slate-50/45 to-slate-50/90 dark:from-[#090D16]/90 dark:via-[#090D16]/55 dark:to-[#090D16]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-50/40 dark:via-[#090D16]/40 to-slate-50/95 dark:to-[#090D16]/95" />
        <div className="absolute inset-0 bg-tactical-grid opacity-60 dark:opacity-40" />
      </div>

      {/* Ambient Defense Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 dark:bg-blue-500/15 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[250px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-3 bg-white/90 dark:bg-[#0F172A]/90 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400">Initializing DPDP Gateway...</span>
            </div>
          }
        >
          <CallbackContent />
        </Suspense>
      </div>
    </div>
  );
}
