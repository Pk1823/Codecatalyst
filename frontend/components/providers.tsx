"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { User, UserRole } from "@/types/auth";
import { AuthService } from "@/services/auth.service";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "996298582246-13mn1si480vso7nkl6gn97nqctb8eq11.apps.googleusercontent.com";

export type ForceType = "CRPF" | "BSF" | "ITBP" | "CISF" | "ARMY" | "STATE_POLICE";
export type LanguageType = "en" | "hi";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  resolvedTheme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface AuthContextType {
  user: User;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  force: ForceType;
  setForce: (f: ForceType) => void;
  lang: LanguageType;
  setLang: (l: LanguageType) => void;
  toggleLang: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: AuthService.getCurrentUser(),
  role: "WELFARE_OFFICER",
  switchRole: () => {},
  logout: () => {},
  force: "CRPF",
  setForce: () => {},
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  details?: string[];
  link?: string;
  actionLabel?: string;
  type?: "info" | "success" | "warning" | "error";
}

interface ToastContextType {
  toast: (msg: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [user, setUser] = useState<User>(AuthService.getCurrentUser());
  const [force, setForceState] = useState<ForceType>("CRPF");
  const [lang, setLangState] = useState<LanguageType>("en");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const applyTheme = (mode: ThemeMode) => {
    let effective: "light" | "dark" = "dark";
    if (mode === "system") {
      effective = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      effective = mode;
    }

    setResolvedTheme(effective);
    if (effective === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.colorScheme = "light";
    }
  };

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("missionwell_theme") as ThemeMode | null;
    const initialTheme: ThemeMode = savedTheme || "dark";
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      const current = localStorage.getItem("missionwell_theme") as ThemeMode | null;
      if (current === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Load saved force preference
    const savedForce = localStorage.getItem("missionwell_force") as ForceType | null;
    if (savedForce) setForceState(savedForce);

    // Load saved language
    const savedLang = localStorage.getItem("missionwell_lang") as LanguageType | null;
    if (savedLang) setLangState(savedLang);

    // Load user from storage
    setUser(AuthService.getCurrentUser());

    // Sync active authenticated session if available
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data?.user) {
          const freshUser = data.user;
          setUser(freshUser);
          localStorage.setItem("missionwell_auth_user", JSON.stringify(freshUser));
          localStorage.setItem("user", JSON.stringify(freshUser));
          if (freshUser.force) setForceState(freshUser.force);
          window.dispatchEvent(new Event("missionwell_auth_changed"));
        }
      })
      .catch(() => {});

    const handleAuthChange = () => {
      setUser(AuthService.getCurrentUser());
    };

    window.addEventListener("missionwell_auth_changed", handleAuthChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("missionwell_auth_changed", handleAuthChange);
    };
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("missionwell_theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const setForce = (f: ForceType) => {
    setForceState(f);
    localStorage.setItem("missionwell_force", f);
    toast({
      title: `Branch Context: ${f}`,
      description: `Welfare protocol adapted for ${f} operational parameters.`,
      type: "info",
    });
  };

  const setLang = (l: LanguageType) => {
    setLangState(l);
    localStorage.setItem("missionwell_lang", l);
  };

  const toggleLang = () => {
    const nextLang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    toast({
      title: nextLang === "hi" ? "भाषा: हिन्दी" : "Language: English",
      description: nextLang === "hi" ? "कल्याण पोर्टल हिन्दी में उपलब्ध है" : "Switched to English",
      type: "info",
    });
  };

  const switchRole = (role: UserRole) => {
    const current = AuthService.getCurrentUser();
    const isRealAccount =
      current &&
      current.email &&
      (current.email.includes("@gmail.com") ||
        (!current.email.includes("crpf.gov.in") && !current.email.includes("defense.gov.in")));

    if (isRealAccount) {
      const updatedUser = { ...current, role };
      localStorage.setItem("missionwell_auth_user", JSON.stringify(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("missionwell_auth_changed"));
      toast({
        title: `Role Switched`,
        description: `Active role: ${role.replace("_", " ")} (${updatedUser.name})`,
        type: "info",
      });
      return;
    }

    const newUser = AuthService.login(role);
    setUser(newUser);
    toast({
      title: `Switched Demo Persona`,
      description: `Active role: ${role.replace("_", " ")} (${newUser.name})`,
      type: "info",
    });
  };

  const logout = () => {
    AuthService.logout();
    setUser(AuthService.getCurrentUser());
  };

  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  const toast = (msg: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    if (msg.type === "error" || msg.type === "warning") {
      playAlertChime();
    }
    setToasts((prev) => [...prev, { ...msg, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme, setTheme }}>
          <AuthContext.Provider
            value={{
              user,
              role: user.role,
              switchRole,
              logout,
              force,
              setForce,
              lang,
              setLang,
              toggleLang,
            }}
          >
            <ToastContext.Provider value={{ toast }}>
              {children}
              {/* Accessible Toast Container */}
              <div
                aria-live="polite"
                className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full sm:w-96 pointer-events-none px-2 sm:px-0"
              >
                {toasts.map((t) => (
                  <div
                    key={t.id}
                    className={`pointer-events-auto flex flex-col gap-2 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
                      t.type === "error"
                        ? "border-rose-500/50 bg-rose-950/90 text-rose-50 shadow-rose-950/50"
                        : t.type === "warning"
                        ? "border-amber-500/50 bg-amber-950/90 text-amber-50 shadow-amber-950/50"
                        : t.type === "success"
                        ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-50 shadow-emerald-950/50"
                        : "border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 shadow-xl"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                          t.type === "success"
                            ? "bg-emerald-400"
                            : t.type === "warning"
                            ? "bg-amber-400 animate-pulse"
                            : t.type === "error"
                            ? "bg-rose-400 animate-ping"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold leading-tight tracking-tight">{t.title}</p>
                        {t.description && (
                          <p className="text-[11px] opacity-90 mt-1 leading-normal break-words">{t.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                        className="text-slate-400 hover:text-white text-xs p-1 rounded-sm cursor-pointer"
                        aria-label="Close notification"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Contributing Telemetry Details Badges */}
                    {t.details && t.details.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/10 mt-1">
                        {t.details.map((badge, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-white border border-white/15"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    {t.link && (
                      <div className="flex justify-end pt-1">
                        <a
                          href={t.link}
                          onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-white text-slate-900 hover:bg-slate-100 shadow-xs cursor-pointer transition-transform active:scale-95"
                        >
                          <span>{t.actionLabel || "Review Alert →"}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ToastContext.Provider>
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
