import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, SignupData } from "../types";
import { AuthService, EVALUATOR_PERSONAS } from "../services/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (serviceId: string, pass: string) => Promise<void>;
  signup: (data: SignupData) => Promise<User>;
  loginAsPersona: (key: keyof typeof EVALUATOR_PERSONAS) => Promise<void>;
  loginWithGoogle: (googleUser: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentSession();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (serviceId: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await AuthService.loginWithCredentials(serviceId, pass);
      if (res.user) {
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await AuthService.register(data);
      if (res.user) {
        setUser(res.user);
        return res.user;
      }
      throw new Error(res.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsPersona = async (key: keyof typeof EVALUATOR_PERSONAS) => {
    setIsLoading(true);
    try {
      const persona = await AuthService.loginAsPersona(key);
      setUser(persona);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleUser: User) => {
    setIsLoading(true);
    try {
      const u = await AuthService.loginWithGoogleUser(googleUser);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginAsPersona,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
