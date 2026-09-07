"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User, UserRole } from "@/types/auth";
import { AuthService } from "@/services/auth.service";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface AuthContextType {
  user: User;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: AuthService.getCurrentUser(),
  role: "WELFARE_OFFICER",
  switchRole: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
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
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User>(AuthService.getCurrentUser());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("missionwell_theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setThemeState(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Load user
    setUser(AuthService.getCurrentUser());

    const handleAuthChange = () => {
      setUser(AuthService.getCurrentUser());
    };

    window.addEventListener("missionwell_auth_changed", handleAuthChange);
    return () => window.removeEventListener("missionwell_auth_changed", handleAuthChange);
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("missionwell_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const switchRole = (role: UserRole) => {
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

  const toast = (msg: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...msg, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
        <AuthContext.Provider value={{ user, role: user.role, switchRole, logout }}>
          <ToastContext.Provider value={{ toast }}>
            {children}
            {/* Accessible Toast Container */}
            <div
              aria-live="polite"
              className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
            >
              {toasts.map((t) => (
                <div
                  key={t.id}
                  className="pointer-events-auto flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2"
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                      t.type === "success"
                        ? "bg-emerald-500"
                        : t.type === "warning"
                        ? "bg-amber-500"
                        : t.type === "error"
                        ? "bg-rose-500"
                        : "bg-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
                    {t.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{t.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
                    aria-label="Close notification"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </ToastContext.Provider>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}
